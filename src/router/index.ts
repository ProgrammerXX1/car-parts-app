import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue'; // Проверь путь
import CarPartsPage from '../views/CarPartsPage.vue'; // Проверь путь

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/car-parts',
    name: 'CarParts',
    component: CarPartsPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
