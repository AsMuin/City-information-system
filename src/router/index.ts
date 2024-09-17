import {createRouter, createWebHistory} from 'vue-router';
import Login from '../views/user/Login.vue';
import Layout from '../views/user/Layout.vue';
import ArticleCategory from '../views/article/ArticleCategory.vue';
import ArticleManage from '../views/article/ArticleManage.vue';
import UserInfo from '../views/user/UserInfo.vue';
import UserAvatar from '../views/user/UserAvatar.vue';
import UserResetPassword from '../views/user/UserResetPassword.vue';
import city_Day from '../views/city_Day.vue';
import city_Night from '../views/city_Night.vue';
const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/layout',
        component: Layout,
        children: [
            {
                path: '/article/category',
                component: ArticleCategory
            },
            {
                path: '/article/manage',
                component: ArticleManage
            },
            {
                path: '/user/info',
                component: UserInfo
            },
            {
                path: '/user/avatar',
                component: UserAvatar
            },
            {
                path: '/user/resetPassword',
                component: UserResetPassword
            }
        ]
    },
    {
        path: '/city_Day',
        component: city_Day
    },
    {
        path: '/city_Night',
        component: city_Night
    }
];
const router = createRouter({
    history: createWebHistory(),
    routes: routes
});
export default router;
