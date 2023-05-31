import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SongView from "../views/SongView.vue";
import RecordingView from "../views/RecordingView.vue";
import AddSongView from "../views/AddSongView.vue";
import LoginView from "../views/LoginView.vue";
import HelpView from "../views/HelpView.vue";
import TabCreator from "../views/TabCreator.vue";

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/:song", name: "song", component: SongView },
  { path: "/:song/:rec", name: "recording", component: RecordingView },
  { path: "/add", name: "addsong", component: AddSongView },
  { path: "/tabcreator", name: "tabcreator", component: TabCreator },
  { path: "/login", name: "login", component: LoginView },
  { path: "/help", name: "help", component: HelpView },
  { path: "/help/:page", name: "helpPage", component: HelpView },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
