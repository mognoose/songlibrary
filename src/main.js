import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'core-js/stable'; // only stable feature also is possible with only `core-js`
import 'regenerator-runtime/runtime'; // To ensure that regeneratorRuntime is defined globally

let app = createApp(App);

app.config.globalProperties.$version = 'ALPHA 0.2.1';

app.use(store).use(router).mount('#app');
