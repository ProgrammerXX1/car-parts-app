<!-- /src/components/PartTable.vue -->
<template>
  <div class="mb-4">
    <h2>{{ title }}</h2>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Деталь</th>
          <th>Цена</th>
          <th>Количество</th>
          <th>Стоимость</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="part in flattenParts(parts)" :key="part.id">
          <tr>
            <td>{{ part.name }}</td>
            <td>{{ calculatePrice(part) }}</td>
            <td>{{ part.quantity }}</td>
            <td>{{ calculatePrice(part) * part.quantity }}</td>
            <td>
              <button class="btn btn-danger btn-sm" @click="removePart(part.id)">Удалить</button>
              <button class="btn btn-primary btn-sm" @click="addPart(part.id)">Добавить</button>
              <button class="btn btn-warning btn-sm" @click="decreasePart(part.id)">Уменьшить</button>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <!-- Форма для добавления новой детали -->
    <form @submit.prevent="addNewPart">
      <div class="form-group">
        <input v-model="newPartName" class="form-control mb-2" placeholder="Название детали" required />
        <input v-model.number="newPartPrice" class="form-control mb-2" placeholder="Цена" type="number" required />
        <input v-model.number="newPartQuantity" class="form-control mb-2" placeholder="Количество" type="number" required />
        <button class="btn btn-success" type="submit">Добавить деталь</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Part } from '../types/Part';

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    parts: {
      type: Array as PropType<Part[]>,
      required: true,
    },
    flattenParts: {
      type: Function,
      required: true,
    },
    calculatePrice: {
      type: Function,
      required: true,
    },
    removePart: {
      type: Function,
      required: true,
    },
    addPart: {
      type: Function,
      required: true,
    },
    decreasePart: {
      type: Function,
      required: true,
    },
    addNewPart: {
      type: Function,
      required: true,
    },
    newPartName: {
      type: String,
      required: true,
    },
    newPartPrice: {
      type: Number,
      required: true,
    },
    newPartQuantity: {
      type: Number,
      required: true,
    },
  },
});
</script>

<style scoped>
.table {
  margin-bottom: 0;
}
</style>
