<template>
  <div class="container mt-5">
    <!-- Заголовок страницы -->
    <div class="text-center mb-4">
      <h1 class="display-4 text-primary">Детали автомобиля</h1>
      <p class="lead text-secondary">Управляйте деталями вашего автомобиля с легкостью</p>
    </div>

    <!-- Карточка для раздела "Кузов" -->
    <div class="card mb-5 shadow-sm">
      <div class="card-header bg-dark text-white">
        <h2 class="h5 mb-0">Кузов</h2>
      </div>
      <div class="card-body">
        <!-- Таблица с деталями кузова -->
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
            <!-- Перебор деталей кузова с помощью v-for -->
            <template v-for="part in flattenParts(bodyParts)" :key="part.id">
              <tr>
                <td>{{ part.name }}</td>
                <td>{{ calculatePrice(part) }}</td>
                <td>{{ part.quantity }}</td>
                <td>{{ calculatePrice(part) * part.quantity }}</td>
                <td class="text-center">
                  <!-- Кнопки для действий: удалить, добавить, уменьшить, увеличить на 1 -->
                  <button class="btn btn-danger btn-sm me-1" @click="removePart(part.id)">Удалить</button>
                  <button class="btn btn-success btn-sm me-1" @click="addPart(part.id)">Добавить</button>
                  <button class="btn btn-warning btn-sm me-1" @click="decreasePart(part.id)">Уменьшить</button>
                  <button class="btn btn-secondary btn-sm" @click="incrementValue(part.id, 10)">Прибавить +10</button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>

        <!-- Форма для добавления новой детали в раздел "Кузов" -->
        <form @submit.prevent="addNewPart('body')" class="mt-4">
          <div class="row g-3">
            <div class="col-md-4">
              <input v-model="newBodyPartName" class="form-control" placeholder="Название детали" required />
            </div>
            <div class="col-md-3">
              <input v-model.number="newBodyPartPrice" class="form-control" placeholder="Цена" type="number" required />
            </div>
            <div class="col-md-3">
              <input v-model.number="newBodyPartQuantity" class="form-control" placeholder="Количество" type="number" required />
            </div>
            <div class="col-md-2">
              <button class="btn btn-primary w-100" type="submit">Добавить</button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Карточка для раздела "Двигатель" -->
    <div class="card mb-5 shadow-sm">
      <div class="card-header bg-dark text-white">
        <h2 class="h5 mb-0">Двигатель</h2>
      </div>
      <div class="card-body">
        <!-- Таблица с деталями двигателя -->
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
            <!-- Перебор деталей двигателя с помощью v-for -->
            <template v-for="part in flattenParts(engineParts)" :key="part.id">
              <tr>
                <td>{{ part.name }}</td>
                <td>{{ calculatePrice(part) }}</td>
                <td>{{ part.quantity }}</td>
                <td>{{ calculatePrice(part) * part.quantity }}</td>
                <td class="text-center">
                  <!-- Кнопки для действий: удалить, добавить, уменьшить, увеличить на 1 -->
                  <button class="btn btn-danger btn-sm me-1" @click="removePart(part.id)">Удалить</button>
                  <button class="btn btn-success btn-sm me-1" @click="addPart(part.id)">Добавить</button>
                  <button class="btn btn-warning btn-sm me-1" @click="decreasePart(part.id)">Уменьшить</button>
                  <button class="btn btn-secondary btn-sm" @click="incrementValue(part.id, 10)">Прибавить +10</button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>

        <!-- Форма для добавления новой детали в раздел "Двигатель" -->
        <form @submit.prevent="addNewPart('engine')" class="mt-4">
          <div class="row g-3">
            <div class="col-md-4">
              <input v-model="newEnginePartName" class="form-control" placeholder="Название детали" required />
            </div>
            <div class="col-md-3">
              <input v-model.number="newEnginePartPrice" class="form-control" placeholder="Цена" type="number" required />
            </div>
            <div class="col-md-3">
              <input v-model.number="newEnginePartQuantity" class="form-control" placeholder="Количество" type="number" required />
            </div>
            <div class="col-md-2">
              <button class="btn btn-primary w-100" type="submit">Добавить</button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Кнопки для экспорта данных -->
    <div class="text-center mt-5">
      <button class="btn btn-outline-success me-3" @click="exportToExcel">Выгрузить в Excel</button>
      <button class="btn btn-outline-info" @click="exportToPDF">Выгрузить в PDF</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Part } from '../types/Part'; // Импортируем тип данных Part
import * as XLSX from 'xlsx'; // Импортируем библиотеку XLSX для экспорта в Excel
import jsPDF from 'jspdf'; // Импортируем библиотеку jsPDF для экспорта в PDF
import 'jspdf-autotable';
import myFont from '../fonts/Roboto-Regular.base64';

export default defineComponent({
  data() {
    return {
      // Инициализация данных с примерами деталей
      parts: [
        {
          id: '1',
          name: 'Body',
          price: 11000,
          quantity: 1,
          children: [
            {
              id: '1.1',
              name: 'Door',
              price: 11000,
              quantity: 1,
              children: [
                { id: '1.1.1', name: 'Look', price: 5000, quantity: 4 },
                { id: '1.1.2', name: 'Pens', price: 6000, quantity: 6 },
              ],
            },
          ],
        },
        {
          id: '2',
          name: 'Engine',
          price: 12000,
          quantity: 1,
          children: [
            { id: '2.1', name: 'Porshens', price: 10000, quantity: 5 },
            { id: '2.2', name: 'Rings', price: 2000, quantity: 3 },
          ],
        },
      ] as Part[], // Определяем тип данных для списка деталей
      // Данные для новых деталей
      newBodyPartName: '',
      newBodyPartPrice: 0,
      newBodyPartQuantity: 1,
      newEnginePartName: '',
      newEnginePartPrice: 0,
      newEnginePartQuantity: 1,
    };
  },
  computed: {
    // Фильтруем детали кузова
    bodyParts(): Part[] {
      return this.parts.filter((part) => part.name === 'Body');
    },
    // Фильтруем детали двигателя
    engineParts(): Part[] {
      return this.parts.filter((part) => part.name === 'Engine');
    },
  },
  methods: {
    // Функция для "выравнивания" вложенных деталей в плоский массив
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
    // Вычисляем цену детали, включая вложенные детали
    calculatePrice(part: Part): number {
      if (part.children && part.children.length > 0) {
        return part.children.reduce((sum, child) => sum + this.calculatePrice(child) * child.quantity, 0);
      }
      return part.price;
    },
    // Функция для добавления новой детали
    addNewPart(type: string) {
      let newPart: Part;

      if (type === 'body') {
        newPart = {
          id: `${Date.now()}`,
          name: this.newBodyPartName,
          price: this.newBodyPartPrice,
          quantity: this.newBodyPartQuantity,
          children: [],
        };
        const bodyPart = this.parts.find((part) => part.name === 'Body');
        if (bodyPart && bodyPart.children) {
          bodyPart.children.push(newPart);
        }
        // Сбрасываем поля формы
        this.newBodyPartName = '';
        this.newBodyPartPrice = 0;
        this.newBodyPartQuantity = 1;
      } else if (type === 'engine') {
        newPart = {
          id: `${Date.now()}`,
          name: this.newEnginePartName,
          price: this.newEnginePartPrice,
          quantity: this.newEnginePartQuantity,
          children: [],
        };
        const enginePart = this.parts.find((part) => part.name === 'Engine');
        if (enginePart && enginePart.children) {
          enginePart.children.push(newPart);
        }
        // Сбрасываем поля формы
        this.newEnginePartName = '';
        this.newEnginePartPrice = 0;
        this.newEnginePartQuantity = 1;
      }
    },
    // Удаляем деталь по её ID
    removePart(id: string) {
      const removeRecursive = (parts: Part[]): Part[] => {
        return parts.filter((part) => {
          if (part.id === id) {
            return false;
          }
          if (part.children) {
            part.children = removeRecursive(part.children);
          }
          return true;
        });
      };
      this.parts = removeRecursive(this.parts);
    },
    // Увеличиваем количество детали на 1
    addPart(id: string) {
      const addRecursive = (parts: Part[]) => {
        parts.forEach((part) => {
          if (part.id === id) {
            part.quantity += 1;
          }
          if (part.children) {
            addRecursive(part.children);
          }
        });
      };
      addRecursive(this.parts);
    },
    // Уменьшаем количество детали на 1
    decreasePart(id: string) {
      const decreaseRecursive = (parts: Part[]) => {
        parts.forEach((part) => {
          if (part.id === id && part.quantity > 1) {
            part.quantity -= 1;
          }
          if (part.children) {
            decreaseRecursive(part.children);
          }
        });
      };
      decreaseRecursive(this.parts);
    },
    // Увеличиваем количество детали на указанное значение (например, +10)
    incrementValue(id: string, value: number) {
      const incrementRecursive = (parts: Part[]) => {
        parts.forEach((part) => {
          if (part.id === id) {
            part.quantity += value;
          }
          if (part.children) {
            incrementRecursive(part.children);
          }
        });
      };
      incrementRecursive(this.parts);
    },
    // Экспортируем данные в Excel
    exportToExcel() {
      const partsForExport = this.flattenParts(this.parts).map((part) => {
    const { children, ...partWithoutChildren } = part;

    // Используем calculatePrice для точной суммы
    return {
      ...partWithoutChildren,
      summ: this.calculatePrice(part) * part.quantity, // Учёт вложенных деталей
    };
  });

  // Создание таблицы Excel
  const worksheet = XLSX.utils.json_to_sheet(partsForExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Детали');

  // Сохранение файла
  XLSX.writeFile(workbook, 'car_parts.xlsx');
},

    // Экспортируем данные в PDF
      exportToPDF(): void {
        const doc = new jsPDF();

  // Подключение шрифта
  doc.addFileToVFS('Roboto-Regular.ttf', myFont);
  doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
  doc.setFont('Roboto');

  // Заголовок
  doc.setFontSize(16);
  doc.text('Details cars', 10, 10);

  // Данные для таблицы
  const tableData = this.flattenParts(this.parts).map((part) => [
    part.name,
    part.price.toString(),
    part.quantity.toString(),
    (this.calculatePrice(part) * part.quantity).toString(), // Учёт вложенных деталей
  ]);

  // Таблица
  doc.autoTable({
    head: [['Detail', 'Price', 'Count', 'Summ']],
    body: tableData,
    startY: 20, // Начало таблицы ниже заголовка
  });

  // Сохранение файла
  doc.save('car_parts.pdf');
    },
  },
});
</script>

<style scoped>
/* Стили для карточек */
.card {
  border-radius: 10px;
  overflow: hidden;
}

/* Стили для заголовков карточек */
.card-header {
  border-bottom: none;
  font-weight: bold;
}

/* Эффект при наведении на строки таблицы */
.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}

/* Стили для выравнивания текста в таблице */
.table th,
.table td {
  vertical-align: middle;
}

/* Стили для кнопок */
.btn {
  margin-right: 5px;
}
</style>
