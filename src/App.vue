<template>
  <div class="container mt-5">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Car Parts App</a>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Главная</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/car-parts">Детали автомобиля</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-view></router-view> <!-- Компонент для отображения страниц -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>

<style>
.container {
  max-width: 800px;
}
</style>
