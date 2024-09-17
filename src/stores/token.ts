//定义store
import {defineStore} from 'pinia'
import {ref} from "vue";
//第一个参数：名字，唯一性
//第二个参数：函数，函数的内部可以定义状态的所有内容
//返回值：函数
export const getUserTokenStore = defineStore('token', () => {
        //定义状态的内容

        //1。响应式变量
        const token = ref('')
        //2.定义一个函数，修改token的值
        const setToken = (value) => {
            token.value = value
        }
        //3.定义一个函数，获取token的值
        const getToken = () => {
            return token.value
        }
        //4.定义一个函数，删除token的值
        const removeToken = () => {
            token.value = ''
        }
        return {
            token,
            setToken,
            getToken,
            removeToken
        }

    },
    {
        persist: true//持久化存储
    }
);
