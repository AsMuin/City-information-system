import {defineStore} from 'pinia';
import {ref} from 'vue';
interface IUserInfo {
    id: string;
    username: string;
    password: string;
    nickname: string;
    email: string;
    userPic: string;
    createTime: string;
    updateTime: string;
    userRole: string;
    position: [number,number] | null  ;
}
const defaultValue= {
    id: '',
    username: '',
    password: '',
    nickname: '',
    email: '',
    userPic: '',
    createTime: '',
    updateTime: '',
    userRole: '',
    position: null
}
export const getUserInfoStore = defineStore(
    'userInfo',
    () => {
        //定义状态相关的内容
        const userInfo = ref<IUserInfo>(defaultValue);
        const setUserInfo = (newUserInfo: Partial<IUserInfo>) => {
            userInfo.value = {...userInfo.value,...newUserInfo};
        };
        const removeUserInfo = () => {
            userInfo.value = defaultValue;
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
