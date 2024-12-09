<template>
  <div class="container-fluid mt-8">
    <div class="text-center mb-4">
      <h1 class="display-4 text-primary">Детали автомобиля</h1>
      <p class="lead text-secondary">
        Управляйте деталями вашего автомобиля с легкостью
      </p>
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
                <th>Базовая цена</th>
                <th>Цена деталей</th>
                <th>Количество</th>
                <th>Стоимость</th>
                <th class="text-center">Действия</th>
              </tr>
            </thead>
            <tbody>
              <template
                v-for="{ part, level } in flattenParts(parts, 0)"
                :key="part.id"
              >
                <tr :class="getBootstrapClass(level)">
                  <td>{{ level }}</td>
                  <td>
                    <span v-if="editingPartId !== part.id">{{
                      part.name
                    }}</span>
                    <input
                      v-else
                      v-model="part.name"
                      class="form-control form-control-sm"
                      type="text"
                    />
                  </td>
                  <td>
                    <input
                      v-model.number="part.basePrice"
                      class="form-control form-control-sm"
                      type="number"
                      :disabled="editingPartId !== part.id"
                      @input="updateBasePrice(part)"
                    />
                  </td>
                  <td>{{ calculateDetailPrice(part) }}</td>
                  <td>
                    <div class="d-flex align-items-center">
                      <button
                        class="btn btn-outline-secondary btn-sm"
                        @click="decreaseQuantity(part)"
                      >
                        -
                      </button>
                      <input
                        v-model.number="part.quantity"
                        class="form-control form-control-sm text-center mx-2"
                        type="number"
                        min="1"
                      />
                      <button
                        class="btn btn-outline-secondary btn-sm"
                        @click="increaseQuantity(part)"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{{ calculateTotal(part) }}</td>
                  <td>
                    <button
                      v-if="editingPartId !== part.id"
                      class="btn btn-primary btn-sm"
                      @click="startEditing(part.id)"
                    >
                      Редактировать
                    </button>
                    <button
                      v-else
                      class="btn btn-success btn-sm"
                      @click="savePart(part)"
                    >
                      Сохранить
                    </button>
                    <button
                      class="btn btn-danger btn-sm"
                      @click="removePart(part.id)"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <form @submit.prevent="addNewPart" class="mt-4">
          <div class="row g-3">
            <div class="col-12 col-md-3">
              <input
                v-model="newPartName"
                class="form-control"
                placeholder="Название детали"
                required
              />
            </div>
            <div class="col-12 col-md-3">
              <input
                v-model.number="newPartPrice"
                class="form-control"
                placeholder="Цена"
                type="number"
                required
              />
            </div>
            <div class="col-12 col-md-2">
              <input
                v-model.number="newPartQuantity"
                class="form-control"
                placeholder="Количество"
                type="number"
                required
              />
            </div>
            <div class="col-12 col-md-3">
              <select v-model="selectedParentId" class="form-select">
                <option value="">Без родителя</option>
                <option
                  v-for="{ part } in flattenParts(parts, 0)"
                  :key="part.id"
                  :value="part.id"
                >
                  {{ part.name }}
                </option>
              </select>
            </div>
            <div class="col-12 col-md-1">
              <button class="btn btn-primary w-100" type="submit">Add</button>
            </div>
          </div>
        </form>

        <div class="text-center mt-4">
          <button class="btn btn-outline-success me-2" @click="exportToExcel">
            Экспорт в Excel
          </button>
          <button class="btn btn-outline-info" @click="exportToPDF">
            Экспорт в PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AutoTableOptions } from 'jspdf-autotable';
import myFont from '../fonts/Roboto-Regular.base64';
export interface Part {
  id: string;
  name: string;
  basePrice: number;
  quantity: number;
  children: Part[];
}

export default defineComponent({
  data() {
    return {
      parts: [
        {
          id: '1',
          name: 'Кузов',
          basePrice: 0,
          quantity: 1,
          children: [
            {
              id: '1.1',
              name: 'Дверь',
              basePrice: 0,
              quantity: 1,
              children: [
                {
                  id: '1.1.1',
                  name: 'Замок',
                  basePrice: 0,
                  quantity: 1,
                  children: [
                    {
                      id: '1.1.1.1',
                      name: 'Метал замка',
                      basePrice: 0,
                      quantity: 4,
                      children: [
                        {
                          id: '1.1.1.1.1',
                          name: 'Пластик металла',
                          basePrice: 150,
                          quantity: 5,
                          children: [],
                        },
                      ],
                    },
                    {
                      id: '1.1.1.2',
                      name: 'Пластик замка',
                      basePrice: 0,
                      quantity: 2,
                      children: [
                        {
                          id: '1.1.1.1.2',
                          name: 'Замчок',
                          basePrice: 100,
                          quantity: 5,
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: '1.1.2',
                  name: 'Ручка',
                  basePrice: 6000,
                  quantity: 1,
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: '2',
          name: 'Двигатель',
          basePrice: 0,
          quantity: 1,
          children: [
            {
              id: '2.1',
              name: 'Поршень',
              basePrice: 10000,
              quantity: 1,
              children: [],
            },
            {
              id: '2.2',
              name: 'Кольца',
              basePrice: 2000,
              quantity: 1,
              children: [],
            },
          ],
        },
      ] as Part[],
      newPartName: '',
      newPartPrice: 0,
      newPartQuantity: 1,
      selectedParentId: '',
      editingPartId: null as string | null,
    };
  },
  methods: {
    hasChildren(part: Part): boolean {
      return part.children && part.children.length > 0;
    },
    calculateDetailPrice(part: Part): number {
      if (!this.hasChildren(part)) {
        // Если это самый дочерний элемент, возвращаем его базовую цену
        return part.basePrice;
      }

      // Если у элемента есть дети, суммируем их стоимости
      return part.children.reduce(
        (sum, child) => sum + this.calculateTotal(child), // Используем calculateTotal для каждого дочернего элемента
        0
      );
    },
    calculateTotal(part: Part): number {
      const detailPrice = this.calculateDetailPrice(part);

      if (this.hasChildren(part)) {
        // Если элемент родительский, добавляем базовую цену к стоимости деталей
        return (detailPrice + part.basePrice) * part.quantity;
      }

      // Если элемент самый дочерний, базовая цена равна стоимости
      return part.basePrice * part.quantity;
    },
    updateQuantity(part: Part, delta: number) {
      part.quantity = Math.max(part.quantity + delta, 1); // Изменяем количество, но не меньше 1

      // Пересчитываем родителей
      this.updateParents(this.parts, part.id);
    },

    startEditing(partId: string) {
      this.editingPartId = partId;
    },
    savePart(part: Part) {
      this.editingPartId = null;
    },
    addNewPart() {
      const newPart: Part = {
        id: `${Date.now()}`,
        name: this.newPartName,
        basePrice: this.newPartPrice,
        quantity: this.newPartQuantity,
        children: [],
      };

      if (this.selectedParentId) {
        const parent = this.findPartById(this.parts, this.selectedParentId);
        if (parent) {
          parent.children.push(newPart);
          parent.basePrice = 0; // Сброс базовой цены у родителя
        }
      } else {
        this.parts.push(newPart);
      }

      this.newPartName = '';
      this.newPartPrice = 0;
      this.newPartQuantity = 1;
      this.selectedParentId = '';
    },
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
    increaseQuantity(part: Part) {
      part.quantity += 1;

      // Пересчёт текущего элемента
      const detailPrice = this.calculateDetailPrice(part);
      const totalCost = detailPrice + part.basePrice * part.quantity;

      // Пересчёт родителей
      this.updateParents(this.parts, part.id);
    },

    decreaseQuantity(part: Part) {
      if (part.quantity > 1) {
        part.quantity -= 1;

        // Пересчёт текущего элемента
        const detailPrice = this.calculateDetailPrice(part);
        const totalCost = detailPrice + part.basePrice * part.quantity;

        // Пересчёт родителей
        this.updateParents(this.parts, part.id);
      }
    },
    getBootstrapClass(level: number): string {
      switch (level) {
        case 0:
          return 'table-primary'; // Голубой фон
        case 1:
          return 'table-secondary'; // Серый фон
        case 2:
          return 'table-success'; // Зелёный фон
        case 3:
          return 'table-danger'; // Красный фон
        case 4:
          return 'table-warning'; // Жёлтый фон
        default:
          return 'table-light'; // Светлый фон
      }
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
    flattenParts(
      parts: Part[],
      level: number
    ): { part: Part; level: number }[] {
      return parts.reduce<{ part: Part; level: number }[]>((acc, part) => {
        acc.push({ part, level });
        if (part.children && part.children.length > 0) {
          acc = acc.concat(this.flattenParts(part.children, level + 1));
        }

        return acc;
      }, []);
    },
    propagateChangesToParents(updatedPart: Part) {
      const visited = new Set<string>(); // Для отслеживания обработанных элементов
      const stack: Part[] = []; // Стек для обработки элементов

      // Ищем всех родителей, где обновленный элемент находится среди детей
      const findParents = (parts: Part[]) => {
        for (const part of parts) {
          if (part.children.some((child) => child.id === updatedPart.id)) {
            stack.push(part);
            visited.add(part.id);
          }
          if (part.children.length > 0) {
            findParents(part.children);
          }
        }
      };

      // Инициализируем стек родительскими элементами
      findParents(this.parts);

      // Обрабатываем стек
      while (stack.length > 0) {
        const currentPart = stack.pop();

        if (!currentPart) continue;

        // Обновляем базовую цену и пересчитываем стоимость
        const childTotal = currentPart.children.reduce(
          (sum, child) => sum + this.calculateTotal(child) * child.quantity,
          0
        );

        currentPart.basePrice = Math.max(currentPart.basePrice, 0); // Обновляем базовую цену

        // Добавляем родителей текущего элемента в стек, если они не обработаны
        for (const part of this.parts) {
          if (
            part.children.some((child) => child.id === currentPart.id) &&
            !visited.has(part.id)
          ) {
            stack.push(part);
            visited.add(part.id);
          }
        }
      }
    },
    updateBasePrice(part: Part) {
      // Убедимся, что базовая цена положительная
      part.basePrice = Math.max(part.basePrice, 0);

      // Пересчитываем сумму для текущего элемента
      this.updateParents(this.parts, part.id);
    },
    getPriceClass(price: number): string {
      if (isNaN(price)) return ''; // Если цена не число, возвращаем пустой класс
      if (price > 10000) return 'price-high';
      if (price > 5000) return 'price-medium';
      return 'price-low';
    },
    updateParents(parts: Part[], updatedPartId: string) {
      for (const part of parts) {
        if (part.children.some((child) => child.id === updatedPartId)) {
          // Пересчитываем стоимость родителя
          const detailPrice = this.calculateDetailPrice(part);
          const totalCost = (detailPrice + part.basePrice) * part.quantity;

          console.log(`Updated parent: ${part.name}, Total Cost: ${totalCost}`);

          // Рекурсивно обновляем родителей
          this.updateParents(this.parts, part.id);
        }

        // Продолжаем обработку дочерних элементов
        if (part.children.length > 0) {
          this.updateParents(part.children, updatedPartId);
        }
      }
    },

    exportToExcel() {
      const partsForExport = this.flattenParts(this.parts, 0).map(
        ({ part, level }) => ({
          Уровень: level,
          Название: part.name,
          'Базовая цена': part.basePrice,
          Количество: part.quantity,
          'Цена детали': this.calculateDetailPrice(part), // Добавляем цену детали
          Стоимость: this.calculateTotal(part),
        })
      );

      const worksheet = XLSX.utils.json_to_sheet(partsForExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Детали');
      XLSX.writeFile(workbook, 'car_parts.xlsx');
    },

    exportToPDF() {
      const doc = new jsPDF();

      // Данные для таблицы
      const tableData = this.flattenParts(this.parts, 0).map(
        ({ part, level }) => [
          level,
          part.name,
          part.basePrice,
          part.quantity,
          this.calculateDetailPrice(part), // Добавляем цену детали
          this.calculateTotal(part),
        ]
      );
      // Подключение шрифта
      doc.addFileToVFS('Roboto-Regular.ttf', myFont);
      doc.addFont('Roboto-Regular.ttf', 'Roboto-Regular', 'normal');
      doc.setFont('Roboto-Regular');

      // Заголовок
      doc.setFontSize(24);
      doc.text('Детали машины', 10, 10);
      // Настройки таблицы
      const options: AutoTableOptions = {
        head: [
          [
            'Уровень',
            'Деталь',
            'Базовая цена',
            'Цена деталей',
            'Количество',
            'Стоимость',
          ],
        ],
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

      // Генерация таблицы и сохранение файла
      doc.autoTable(options);

      doc.save('car_parts.pdf');
    },
  },
});
</script>
