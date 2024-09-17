import {defineStore} from 'pinia';
import {ref} from 'vue';

export const getUserInfoStore = defineStore(
    'userInfo',
    () => {
        //定义状态相关的内容
        const userInfo = ref({
            id: '',
            username: '',
            password: '',
            nickname: '',
            email: '',
            userPic: '',
            createTime: '',
            updateTime: '',
            userRole: ''
        });
        const setUserInfo = newUserInfo => {
            userInfo.value = newUserInfo;
        };
        const removeUserInfo = () => {
            userInfo.value = {};
        };
        return {
            userInfo,
            setUserInfo,
            removeUserInfo
        };
    }
    // {persist:false},
);
export default getUserInfoStore;
