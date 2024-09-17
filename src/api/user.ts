//request.js请求工具
import request from '../utils/user_article/request.js';

//提供调用注册接口的函数
export function registerService(registerData) {
    //借助于UrlSearchParams完成传递
    const params = new URLSearchParams();
    for (let key in registerData) {
        if (key === 'userRole' && registerData[key] !== '') {
            registerData[key] = true;
        }
        params.append(key, registerData[key]);
    }
    return request.post('/user/register', params);
}

//提供调用登录接口的函数
export function loginService(loginData) {
    //借助于UrlSearchParams完成传递
    const params = new URLSearchParams();
    for (let key in loginData) {
        params.append(key, loginData[key]);
    }
    return request.post('/user/login', params);
}

//获取用户详细信息
export function getUserInfoService() {
    return request.get('/user/userInfo');
}

//修改用户个人信息
export function updateUserInfoService(userInfoData) {
    return request.put('/user/update', userInfoData);
}

//修改用户头像
export function updateUserAvatarService(userAvatarUrl) {
    const params = new URLSearchParams();
    params.append('avatarUrl', userAvatarUrl);
    return request.patch('/user/updateAvatar', params);
}

//修改用户密码
export function updateUserPasswordService(resetPasswordData) {
    const params = new URLSearchParams();
    for (let key in resetPasswordData) {
        params.append(key, resetPasswordData[key]);
    }
    return request.patch('/user/updatePassword', resetPasswordData);
}
