import { createRouter, createWebHistory } from "vue-router";
import city_Day from "../views/city_Day.vue";
import city_Night from "../views/city_Night.vue";
const routes = [
  {
    path: "/",
    redirect: "/city_Day",
  },
  {
    path: "/city_Day",
    component: city_Day,
  },
  {
    path: "/city_Night",
    component: city_Night,
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});
export default router;