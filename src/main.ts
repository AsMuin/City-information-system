import { createApp } from "vue";
// import './style.css'
import App from "./App.vue";
import * as Cesium from "cesium";
import axios from "axios";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from "./router/index";

// window.Cesium=Cesium;
window.CESIUM_BASE_URL = "/public/Cesium";
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMmIyNmFlOC0yNDEzLTRmYjctOTYxMi0wYzllYjg5MjdiZWQiLCJpZCI6MTY1NDQ2LCJpYXQiOjE2OTQyNDg5NjN9.Wh5t2U4rV6y7ef2JLXbsJ4WqpbOO0JhN_3g1_BxN7rw";

createApp(App).use(ElementPlus).use(router).mount("#app");
