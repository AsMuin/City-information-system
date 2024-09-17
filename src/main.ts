import {createApp} from 'vue';
// import './style.css'
import App from './App.vue';
import * as Cesium from 'cesium';
import {createPinia} from 'pinia';
import {createPersistedState} from 'pinia-persistedstate-plugin';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from './router/index';
import getUserInfoStore from './stores/userInfo';
import '@/assets/layout/css/app.css';

// window.Cesium=Cesium;
window.CESIUM_BASE_URL = '/public/Cesium';
Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMmIyNmFlOC0yNDEzLTRmYjctOTYxMi0wYzllYjg5MjdiZWQiLCJpZCI6MTY1NDQ2LCJpYXQiOjE2OTQyNDg5NjN9.Wh5t2U4rV6y7ef2JLXbsJ4WqpbOO0JhN_3g1_BxN7rw';
const pinia = createPinia();
pinia.use(
    createPersistedState({
        initialState: {
            getUserInfoStore
            // 在 initialState 中不包含 getMapStore 模块
        }
    })
);

createApp(App).use(pinia).use(ElementPlus).use(router).mount('#app');
