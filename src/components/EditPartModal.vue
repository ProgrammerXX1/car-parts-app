<!-- /src/components/EditPartModal.vue -->
<template>
    <div class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">Редактировать деталь</h5>
            <button type="button" class="btn-close" @click="closeEditModal"></button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Название детали</label>
              <input v-model="editPartName" class="form-control mb-2" required />
            </div>
            <div class="form-group">
              <label>Цена</label>
              <input v-model.number="editPartPrice" class="form-control mb-2" type="number" required />
            </div>
            <div class="form-group">
              <label>Количество</label>
              <input v-model.number="editPartQuantity" class="form-control mb-2" type="number" required />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeEditModal">Отмена</button>
            <button class="btn btn-success" @click="savePartChanges">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    props: {
      editPartName: {
        type: String,
        required: true,
      },
      editPartPrice: {
        type: Number,
        required: true,
      },
      editPartQuantity: {
        type: Number,
        required: true,
      },
      closeEditModal: {
        type: Function,
        required: true,
      },
      savePartChanges: {
        type: Function,
        required: true,
      },
    },
  });
  </script>
  
  <style scoped>
  .modal {
    background-color: rgba(0, 0, 0, 0.5);
  }
  </style>
  