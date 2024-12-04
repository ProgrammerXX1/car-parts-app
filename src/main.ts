import { createApp } from 'vue';
import App from './App.vue';
import { BootstrapVue3 } from 'bootstrap-vue-3';
import router from './router'; // Убедись, что роутер импортирован

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';

const app = createApp(App);
app.use(BootstrapVue3);
app.use(router); // Убедись, что роутер используется
app.mount('#app');
