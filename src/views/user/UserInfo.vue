<script setup>
import {ref} from 'vue';
import getUserInfoStore from '/src/stores/userInfo';
import {updateUserInfoService} from '../../api/user';
import {ElMessage} from 'element-plus';

const userInfoStore = getUserInfoStore();
const userInfo = ref({...userInfoStore.userInfo});
const rules = {
    nickname: [
        {required: true, message: '请输入用户昵称', trigger: 'blur'},
        {
            pattern: /^\S{2,10}$/,
            message: '昵称必须是2-10位的非空字符串',
            trigger: 'blur'
        }
    ],
    email: [
        {required: true, message: '请输入用户邮箱', trigger: 'blur'},
        {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
    ]
};
//修改个人资料
async function updateUserInfo() {
    // console.log(userInfo)
    // console.log(userInfo.value)
    //调用接口
    let result = await updateUserInfoService(userInfo.value);
    ElMessage.success(result.message == '操作成功' ? '修改成功' : result.message);
    //修改pinia中存储的用户个人信息
    userInfoStore.setUserInfo(userInfo.value);
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>基本资料</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="登录名称">
                        <el-input v-model="userInfo.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="用户昵称" prop="nickname">
                        <el-input v-model="userInfo.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="用户邮箱" prop="email">
                        <el-input v-model="userInfo.email"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserInfo">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>
