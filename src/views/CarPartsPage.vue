<template>
  <div class="container mt-5">
    <!-- Заголовок страницы -->
    <div class="text-center mb-4">
      <h1 class="display-4 text-primary">Детали автомобиля</h1>
      <p class="lead text-secondary">Управляйте деталями вашего автомобиля с легкостью</p>
    </div>

    <!-- Объединенная таблица для всех деталей -->
    <div class="card mb-5 shadow-sm">
      <div class="card-header bg-dark text-white">
        <h2 class="h5 mb-0">Все детали</h2>
      </div>
      <div class="card-body">
        <!-- Таблица с деталями -->
        <table class="table table-hover table-bordered">
          <thead class="thead-light">
            <tr>
              <th>Деталь</th>
              <th>Цена</th>
              <th>Количество</th>
              <th>Стоимость</th>
              <th class="text-center">Действия</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="part in flattenParts(parts)" :key="part.id">
              <tr>
                <td>{{ part.name }}</td>
                <td>{{ calculatePrice(part) }}</td>
                <td>{{ part.quantity }}</td>
                <td>{{ calculatePrice(part) * part.quantity }}</td>
                <td class="text-center">
                  <button class="btn btn-danger btn-sm me-1" @click="removePart(part.id)">Удалить</button>
                  <button class="btn btn-success btn-sm me-1" @click="addPart(part.id)">Добавить</button>
                  <button class="btn btn-warning btn-sm me-1" @click="decreasePart(part.id)">Уменьшить</button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>

        <!-- Форма для добавления новой детали -->
        <form @submit.prevent="addNewPart" class="mt-4">
          <div class="row g-3">
            <div class="col-md-3">
              <input v-model="newPartName" class="form-control" placeholder="Название детали" required />
            </div>
            <div class="col-md-3">
              <input v-model.number="newPartPrice" class="form-control" placeholder="Цена" type="number" required />
            </div>
            <div class="col-md-2">
              <input v-model.number="newPartQuantity" class="form-control" placeholder="Количество" type="number" required />
            </div>
            <div class="col-md-3">
              <select v-model="selectedParentId" class="form-select">
                <option value="">Без родителя</option>
                <option v-for="part in flattenParts(parts)" :key="part.id" :value="part.id">
                  {{ part.name }}
                </option>
              </select>
            </div>
            <div class="col-md-1">
              <button class="btn btn-primary w-100" type="submit">Add</button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div class="text-center mt-5">
      <button class="btn btn-outline-success me-3" @click="exportToExcel">Выгрузить в Excel</button>
      <button class="btn btn-outline-info" @click="exportToPDF">Выгрузить в PDF</button>
    </div>
  </div>
</template>


<script lang="ts">

import { defineComponent } from 'vue';
import { Part } from '../types/Part';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import myFont from '../fonts/Roboto-Regular.base64';
import { AutoTableOptions } from 'jspdf-autotable';


export default defineComponent({
  data() {
    return {
      parts: [
        {
          id: '1',
          name: 'Кузов',
          price: 0,
          quantity: 1,
          children: [
            {
              id: '1.1',
              name: 'Дверь',
              price: 0,
              quantity: 1,
              children: [
                { id: '1.1.1', name: 'Замок', price: 5000, quantity: 4 },
                { id: '1.1.2', name: 'Ручки', price: 6000, quantity: 6 },
              ],
            },
          ],
        },
        {
          id: '2',
          name: 'Двигатель',
          price: 0,
          quantity: 1,
          children: [
            { id: '2.1', name: 'Поршни', price: 10000, quantity: 5 },
            { id: '2.2', name: 'Кольца', price: 2000, quantity: 3 },
          ],
        },
      ] as Part[],
      newPartName: '',
      newPartPrice: 0,
      newPartQuantity: 1,
      selectedParentId: '', // ID родительской детали
    };
  },
  methods: {
    addNewPart() {
      const newPart: Part = {
        id: `${Date.now()}`,
        name: this.newPartName,
        price: this.newPartPrice,
        quantity: this.newPartQuantity,
        children: [],
      };

      if (this.selectedParentId) {
        const parent = this.findPartById(this.parts, this.selectedParentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(newPart);
        }
      } else {
        this.parts.push(newPart);
      }

      // Сброс формы
      this.newPartName = '';
      this.newPartPrice = 0;
      this.newPartQuantity = 1;
      this.selectedParentId = '';
    },
    findPartById(parts: Part[], id: string): Part | null {
      for (const part of parts) {
        if (part.id === id) return part;
        if (part.children) {
          const found = this.findPartById(part.children, id);
          if (found) return found;
        }
      }
      return null;
    },
    flattenParts(parts: Part[]): Part[] {
      const flatten = (parts: Part[]): Part[] => {
        return parts.reduce((acc: Part[], part: Part) => {
          acc.push(part);
          if (part.children && part.children.length > 0) {
            acc = acc.concat(flatten(part.children));
          }
          return acc;
        }, []);
      };
      return flatten(parts);
    },
    calculatePrice(part: Part): number {
      if (part.children && part.children.length > 0) {
        return part.children.reduce((sum, child) => sum + this.calculatePrice(child) * child.quantity, 0);
      }
      return part.price;
    },
    removePart(id: string) {
      const removeRecursive = (parts: Part[]): Part[] => {
        return parts.filter((part) => {
          if (part.id === id) return false;
          if (part.children) part.children = removeRecursive(part.children);
          return true;
        });
      };
      this.parts = removeRecursive(this.parts);
    },
  // Увеличение количества родительского элемента
  addPart(id: string) {
    const updateChildren = (part: Part, multiplier: number) => {
      if (part.children && part.children.length > 0) {
        part.children.forEach((child) => {
          child.quantity *= multiplier; // Пропорционально увеличиваем дочерние элементы
          updateChildren(child, multiplier); // Рекурсия для всех уровней
        });
      }
    };

    const findAndUpdatePart = (parts: Part[]) => {
      parts.forEach((part) => {
        if (part.id === id) {
          part.quantity += 1; // Увеличиваем родителя на 1
          updateChildren(part, 2); // Увеличиваем дочерние элементы в 2 раза
        } else if (part.children) {
          findAndUpdatePart(part.children); // Рекурсия для поиска элемента
        }
      });
    };

    findAndUpdatePart(this.parts); // Обновляем всю структуру
  },

  // Уменьшение количества родительского элемента
  decreasePart(id: string) {
    const updateChildren = (part: Part, divisor: number) => {
      if (part.children && part.children.length > 0) {
        part.children.forEach((child) => {
          child.quantity = Math.max(1, Math.floor(child.quantity / divisor)); // Пропорционально уменьшаем дочерние элементы
          updateChildren(child, divisor); // Рекурсия для всех уровней
        });
      }
    };

    const findAndUpdatePart = (parts: Part[]) => {
      parts.forEach((part) => {
        if (part.id === id && part.quantity > 1) {
          part.quantity -= 1; // Уменьшаем родителя на 1
          updateChildren(part, 2); // Уменьшаем дочерние элементы, деля их на 2
        } else if (part.children) {
          findAndUpdatePart(part.children); // Рекурсия для поиска элемента
        }
      });
    };

    findAndUpdatePart(this.parts); // Обновляем всю структуру
  },

  // Увеличение количества дочернего элемента
  addChild(id: string) {
    const findAndUpdateChild = (parts: Part[]) => {
      parts.forEach((part) => {
        if (part.id === id) {
          part.quantity += 1; // Увеличиваем дочерний элемент на 1
        } else if (part.children) {
          findAndUpdateChild(part.children); // Рекурсия для поиска элемента
        }
      });
    };

    findAndUpdateChild(this.parts); // Обновляем только дочерний элемент
  },

  // Уменьшение количества дочернего элемента
  decreaseChild(id: string) {
    const findAndUpdateChild = (parts: Part[]) => {
      parts.forEach((part) => {
        if (part.id === id && part.quantity > 1) {
          part.quantity -= 1; // Уменьшаем дочерний элемент на 1
        } else if (part.children) {
          findAndUpdateChild(part.children); // Рекурсия для поиска элемента
        }
      });
    };

    findAndUpdateChild(this.parts); // Обновляем только дочерний элемент
  },
    exportToExcel() {
      const partsForExport = this.flattenParts(this.parts).map((part) => {
        const { children, ...partWithoutChildren } = part;
        return {
          ...partWithoutChildren,
          total: this.calculatePrice(part) * part.quantity,
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(partsForExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Детали');
      XLSX.writeFile(workbook, 'car_parts.xlsx');
    },
    exportToPDF() {
      const doc = new jsPDF();
      doc.addFileToVFS('Roboto-Regular.ttf', myFont);
      doc.addFont('Roboto-Regular.ttf', 'Roboto-Regular', 'normal');
      doc.setFont('Roboto-Regular');
      doc.setFontSize(16);
      doc.text('Детали автомобиля', 10, 10);

      const tableData = this.flattenParts(this.parts).map((part) => [
        part.name,
        this.calculatePrice(part).toFixed(2),
        part.quantity.toString(),
        (this.calculatePrice(part) * part.quantity).toFixed(2),
      ]);

      // Создание таблицы
const options:AutoTableOptions={
        head: [['Деталь', 'Цена', 'Количество', 'Стоимость']],
        body: tableData,
        startY: 20,
        styles: {
          font: 'Roboto-Regular',
          fontSize: 10,
          textColor: 'black',
        },
        headStyles: {
          fontSize: 12,
          fillColor: '#f0f0f0',
        },
        alternateRowStyles: {
          fillColor: '#f9f9f9',
        },
      }
      ;
      doc.autoTable(options)
      ;
      doc.save('car_parts.pdf');
    },
  },
});
</script>
