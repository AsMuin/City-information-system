//定义请求的实例
import axios from 'axios';
import {ElMessage} from 'element-plus';
import {getUserTokenStore} from '../../stores/token';
// import { ElMessage } from 'element-plus'
//定义一个变量，记录公共的前缀，baseURL
// let baseURL = "http://localhost:8080";
const baseURL = '/base';
const BaseUrl = axios.create({baseURL});

//添加请求拦截器
BaseUrl.interceptors.request.use(
    config => {
        console.log('请求拦截器', config); //请求信息
        //请求前的回调
        //添加token
        const userTokenStore = getUserTokenStore();
        //判断有没有token
        if (userTokenStore.token) {
            config.headers.Authorization = userTokenStore.token;
        }
        return config;
    },
    err => {
        //请求错误的回调
        return Promise.reject(err);
    }
);
//添加响应拦截器
BaseUrl.interceptors.response.use(
    result => {
        //判断业务状态码
        if (result.data.code === 0) {
            console.log('响应拦截器', result); //响应信息，里面包含了请求信息(其中服务器后端返回的数据在data中)
            return result.data;
        } else {
            //操作失败
            //alert(result.data.message? result.data.message:'服务异常');
            ElMessage.error(result.data.message ? result.data.message : '服务异常');
            //异步操作的状态转换为失败
            return Promise.reject(result.data);
        }
    },
    err => {
        //判断响应状态码，如果为401，则证明未登录，提示请登录。并跳转到登录页面
        if (err.response && err.response.status === 401) {
            ElMessage.error('请重新登录');
            window.location.href = '/login';
        } else {
            ElMessage.error('服务异常');
        }
        return Promise.reject(err);
    }
);
export default BaseUrl;
