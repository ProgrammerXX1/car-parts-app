<template>
  <div class="container-fluid mt-8">
    <div class="text-center mb-4">
      <h1 class="display-4 text-primary">Детали автомобиля</h1>
      <p class="lead text-secondary">Управляйте деталями вашего автомобиля с легкостью</p>
    </div>

    <!-- Переключатель "Off Base / On Base" -->
    <div class="text-center mb-3">
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          id="basePriceToggle"
          v-model="includeBasePrice"
        />
        <label class="form-check-label" for="basePriceToggle">
          {{ includeBasePrice ? 'Базовая цена включена' : 'Базовая цена отключена' }}
        </label>
      </div>
    </div>

    <div class="card mb-8 shadow-sm">
      <div class="card-header bg-dark text-white">
        <h2 class="h5 mb-0">Все детали</h2>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover table-bordered table-striped w-100">
            <thead class="thead-light">
              <tr>
                <th>Уровень</th>
                <th>Деталь</th>
                <th v-if="includeBasePrice">Базовая цена</th>
                <th>Цена деталей</th>
                <th>Количество</th>
                <th>Стоимость</th>
                <th class="text-center">Действия</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="({ part, level }) in flattenParts(parts, 0)" :key="part.id">
                <tr>
                  <td>{{ level }}</td>
                  <td>
                    <span :style="{ paddingLeft: `${level * 20}px` }">
                      {{ part.name }}
                    </span>
                  </td>
                  <td v-if="includeBasePrice">{{ part.price > 0 ? part.price : '—' }}</td>
                  <td>{{ calculateDetailPrice(part) }}</td>
                  <td>{{ part.quantity }}</td>
                  <td>{{ calculateTotal(part) }}</td>
                  <td class="text-center">
                    <button class="btn btn-danger btn-sm me-1" @click="removePart(part.id)">Удалить</button>
                    <button class="btn btn-success btn-sm me-1" @click="addPart(part.id)">Добавить</button>
                    <button class="btn btn-warning btn-sm me-1" @click="decreasePart(part.id)">Уменьшить</button>
                    <button class="btn btn-primary btn-sm" @click="editPart(part.id)">Редактировать</button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <form @submit.prevent="addNewPart" class="mt-4">
          <div class="row g-3">
            <div class="col-12 col-md-3">
              <input v-model="newPartName" class="form-control" placeholder="Название детали" required />
            </div>
            <div class="col-12 col-md-3">
              <input v-model.number="newPartPrice" class="form-control" placeholder="Цена" type="number" required />
            </div>
            <div class="col-12 col-md-2">
              <input v-model.number="newPartQuantity" class="form-control" placeholder="Количество" type="number" required />
            </div>
            <div class="col-12 col-md-3">
              <select v-model="selectedParentId" class="form-select">
                <option value="">Без родителя</option>
                <option v-for="({ part }) in flattenParts(parts, 0)" :key="part.id" :value="part.id">
                  {{ part.name }}
                </option>
              </select>
            </div>
            <div class="col-12 col-md-1">
              <button class="btn btn-primary w-100" type="submit">Add</button>
            </div>
          </div>
        </form>

        <!-- Кнопки экспорта -->
        <div class="text-center mt-4">
          <button class="btn btn-outline-success me-2" @click="exportToExcel">Экспорт в Excel</button>
          <button class="btn btn-outline-info" @click="exportToPDF">Экспорт в PDF</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import { Part } from '../types/Part';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AutoTableOptions } from 'jspdf-autotable';
import myFont from '../fonts/Roboto-Regular.base64';

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
                { id: '1.1.1', name: 'Замок', price: 5000, quantity: 1 },
                { id: '1.1.2', name: 'Ручка', price: 6000, quantity: 1 },
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
            { id: '2.1', name: 'Поршень', price: 10000, quantity: 1 },
            { id: '2.2', name: 'Кольца', price: 2000, quantity: 1 },
          ],
        },
      ] as Part[],
      newPartName: '',
      newPartPrice: 0,
      newPartQuantity: 1,
      selectedParentId: '',
      includeBasePrice: true,
    };
  },
  methods: {
    findPartById(parts: Part[], id: string): Part | null {
    for (const part of parts) {
      if (part.id === id) {
        return part;
      }
      if (part.children) {
        const found = this.findPartById(part.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  },
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

      // Сбрасываем базовую цену родителя при добавлении дочернего элемента
      parent.price = 0;
    }
  } else {
    this.parts.push(newPart); // Добавляем как корневой элемент
  }

  // Сброс формы
  this.newPartName = '';
  this.newPartPrice = 0;
  this.newPartQuantity = 1;
  this.selectedParentId = '';
},

addPart(id: string) {
  const findAndUpdate = (parts: Part[]) => {
    parts.forEach((part) => {
      if (part.id === id) {
        part.quantity += 1; // Увеличиваем количество
      } else if (part.children) {
        findAndUpdate(part.children);
      }
    });
  };
  findAndUpdate(this.parts);
},

calculateDetailPrice(part: Part): number {
  if (part.children && part.children.length > 0) {
    return part.children.reduce(
      (sum, child) => sum + this.calculateDetailPrice(child) * child.quantity,
      0
    );
  }
  return part.price;
},

    calculateTotal(part: Part): number {
      const detailPrice = this.calculateDetailPrice(part);
      const basePrice = this.includeBasePrice ? part.price : 0;
      return (basePrice + detailPrice) * part.quantity;
    },
    flattenParts(parts: Part[], level: number): { part: Part; level: number }[] {
  const flatten = (parts: Part[], level: number): { part: Part; level: number }[] => {
    return parts.reduce((acc: { part: Part; level: number }[], part: Part) => {
      acc.push({ part, level }); // Добавляем объект с уровнем
      if (part.children && part.children.length > 0) {
        acc = acc.concat(flatten(part.children, level + 1));
      }
      return acc;
    }, []);
  };
  return flatten(parts, level);
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
    decreasePart(id: string) {
      const findAndUpdate = (parts: Part[]) => {
        parts.forEach((part) => {
          if (part.id === id &&
          part.quantity > 1) {
            part.quantity -= 1;
          } else if (part.children) {
            findAndUpdate(part.children);
          }
        });
      };
      findAndUpdate(this.parts);
    },
    exportToExcel() {
  const partsForExport = this.flattenParts(this.parts, 0).map(({ part }) => ({
    ...part,
    summ: this.calculateTotal(part),
  }));

  const worksheet = XLSX.utils.json_to_sheet(partsForExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Детали');

  XLSX.writeFile(workbook, 'car_parts.xlsx');
},
exportToPDF(): void {
  const doc = new jsPDF();

  // Подключение шрифта
  doc.addFileToVFS('Roboto-Regular.ttf', myFont);
  doc.addFont('Roboto-Regular.ttf', 'Roboto-Regular', 'normal');
  doc.setFont('Roboto-Regular');

  // Заголовок
  doc.setFontSize(24);
  doc.text('Детали машины', 10,10);

  const tableData = this.flattenParts(this.parts, 0).map(({ part }) => [
    part.name,
    part.price.toString(),
    part.quantity.toString(),
    this.calculateTotal(part).toString(),
  ]);

  const options: AutoTableOptions = {
    head: [['Деталь', 'Базовая цена', 'Количество', 'Стоимость']],
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
  };

  doc.autoTable(options);
  doc.save('car_parts.pdf');
},
  },
});
</script>

<style>
.btn-sm {
    --bs-btn-padding-y: 0.25rem;
    --bs-btn-padding-x: 0.5rem;
    --bs-btn-font-size: 0.6rem;
}
.container {
    max-width: 1200px;
}
</style>
