import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'core-js/stable'; // only stable feature also is possible with only `core-js`
import 'regenerator-runtime/runtime'; // To ensure that regeneratorRuntime is defined globally
import VueLuxon from "vue-luxon";
const { DateTime } = require("luxon");

let app = createApp(App);

app.config.globalProperties.$version = 'ALPHA 0.3.0';

app.use(store)
  .use(router)
  .mount('#app');

app.config.globalProperties.$luxonDateTime = DateTime;

