<script setup>
import {Lock, User} from '@element-plus/icons-vue';
import {ref} from 'vue';
// import { ElMessage } from 'element-plus'
//调用后台接口，完成注册
import {loginService, registerService} from '../../api/user';
import {ElMessage} from 'element-plus';
import {useRouter} from 'vue-router';
import {getUserTokenStore} from '../../stores/token';
import getPosition from '@utils/user_article/getCurrentPosition';
const userTokenStore = getUserTokenStore();
const router = new useRouter();

//控制注册与登录表单显示，默认显示登录
const registerFormVisible = ref(false);
//定义数据模型
const registerData = ref({
    username: '',
    password: '',
    password2: '',
    userRole: ''
});
//校验密码的函数
const checkPassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入密码'));
    } else if (value !== registerData.value.password) {
        callback(new Error('两次密码不一致'));
    } else {
        callback();
    }
};
//定义表单校验规则
const registerRules = {
    username: [
        {required: true, message: '请输入用户名', trigger: 'blur'},
        {min: 3, max: 10, message: '用户名长度在3到10字符之间', trigger: 'blur'}
    ],
    password: [
        {required: true, message: '请输入密码', trigger: 'blur'},
        {min: 5, max: 16, message: '密码长度在5到16字符之间', trigger: 'blur'}
    ],
    password2: [{validator: checkPassword, trigger: 'blur'}]
};

async function register() {
    let result = await registerService(registerData.value);
    // if (result.code === 0) {
    //   //成功了
    //   alert("注册成功")
    // }else {
    //   //失败了
    //   alert(result.message? result.message : "注册失败")
    // }
    //alert(result.message='注册成功'? '注册成功':result.message)
    ElMessage.success(result.message == '操作成功' ? '注册成功' : result.message);
    registerFormVisible.value = false;
    clearRegisterData();
}

//绑定数据，复用注册表单数据
//表单数据校验
//登录函数
async function login() {
    try {
    let result = await loginService(registerData.value);
    // if (result.code === 0){
    //   alert( "登陆成功")
    // }
    // else {
    //   alert(result.message? result.message : "登陆失败")
    // }
    //alert(result.message='登录成功'? '登录成功':result.message)
    ElMessage.success(result.message == '操作成功' ? '登录成功' : result.message);
    //把得到的token存储到pinia的userToken中
    userTokenStore.setToken(result.data); //result.data里存储token字符串
    //跳转到首页 路由完成跳转
    await router.push('/city_Day');
    } catch (error) {
        ElMessage.error('登录失败');
    }
}

//定义函数，清空注册数据模型的数据
function clearRegisterData() {
    registerData.value.username = '';
    registerData.value.password = '';
    registerData.value.password2 = '';
}
</script>

<template>
    <el-row class="login-page">
        <video autoplay loop class="fill" muted="muted">
            <source src="../../assets/projectLogin_BG.mp4" type="video/mp4" />
        </video>
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 注册表单 -->
            <el-form
                ref="form"
                size="large"
                autocomplete="off"
                v-if="registerFormVisible"
                :model="registerData"
                :rules="registerRules"
            >
                <el-form-item>
                    <h1 style="color: white">注册</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input
                        :prefix-icon="User"
                        placeholder="请输入用户名"
                        v-model="registerData.username"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        :prefix-icon="Lock"
                        type="password"
                        placeholder="请输入密码"
                        v-model="registerData.password"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="password2">
                    <el-input
                        :prefix-icon="Lock"
                        type="password"
                        placeholder="请输入再次密码"
                        v-model="registerData.password2"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="userRole">
                    <el-input
                        :prefix-icon="Lock"
                        type="password"
                        placeholder="若注册为管理用户请输入权限码"
                        v-model="registerData.userRole"
                    ></el-input>
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="register">
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link
                        type="info"
                        :underline="false"
                        @click="
                            registerFormVisible = false;
                            clearRegisterData();
                        "
                    >
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录表单 -->
            <el-form
                ref="form"
                size="large"
                autocomplete="off"
                v-else
                :model="registerData"
                :rules="registerRules"
            >
                <el-form-item>
                    <h1 style="color: white">登录</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input
                        :prefix-icon="User"
                        placeholder="请输入用户名"
                        v-model="registerData.username"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        name="password"
                        :prefix-icon="Lock"
                        type="password"
                        placeholder="请输入密码"
                        v-model="registerData.password"
                    ></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <!-- <el-link type="primary" :underline="false">忘记密码？(未完成)</el-link> -->
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">
                        登录
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link
                        type="info"
                        :underline="false"
                        @click="
                            registerFormVisible = true;
                            clearRegisterData();
                        "
                    >
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style scoped lang="scss">
.h1 {
    color: white;
}

.login-page {
    height: 100vh;

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}

.fill {
    width: 100%;
    height: 100%;
    object-fit: fill;
    position: absolute;
    z-index: -1;
}
</style>
