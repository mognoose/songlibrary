import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SongView from "../views/SongView.vue";
import AddSongView from "../views/AddSongView.vue";
import LoginView from "../views/LoginView.vue";

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/:song", name: "song", component: SongView },
  { path: "/add", name: "addsong", component: AddSongView },
  { path: "/login", name: "login", component: LoginView },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
