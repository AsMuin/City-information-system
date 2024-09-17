<script lang="ts" setup>
import {ref} from 'vue';
import {updateUserPasswordService} from '@/api/user';
import {ElMessage} from 'element-plus';
import {useRouter} from 'vue-router';
const router = useRouter();

//修改密码的数据模型
const resetPasswordData = ref({
    oriPassword: '',
    password: '',
    checkPassword: ''
});

//校验两次输入的密码的函数
const checkPassword2 = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入密码'));
    } else if (value !== resetPasswordData.value.password) {
        callback(new Error('两次密码不一致'));
    } else {
        callback();
    }
};
//定义表单校验规则
const resetPasswordRules = {
    oriPassword: [
        {required: true, message: '请输入原密码', trigger: 'blur'},
        {min: 5, max: 16, message: '密码长度在5到16字符之间', trigger: 'blur'}
    ],
    password: [
        {required: true, message: '请输入密码', trigger: 'blur'},
        {min: 5, max: 16, message: '密码长度在5到16字符之间', trigger: 'blur'}
    ],
    checkPassword: [
        {required: true, message: '请再次输入密码', trigger: 'blur'},
        {min: 5, max: 16, message: '密码长度在5到16字符之间', trigger: 'blur'},
        {validator: checkPassword2, trigger: 'blur'}
    ]
};

//修改密码
async function resetPassword() {
    //调用接口，完成登录
    let result = await updateUserPasswordService(resetPasswordData.value);
    ElMessage.success(result.message == '操作成功' ? '修改成功' : result.message);
    //跳转到登录界面
    await router.push('/login');
}
function clearResetPasswordData() {
    resetPasswordData.value = {
        oriPassword: '',
        password: '',
        checkPassword: ''
    };
}
</script>
<template>
    <el-form
        ref="form"
        style="max-width: 600px"
        :model="resetPasswordData"
        status-icon
        :rules="resetPasswordRules"
        label-width="auto"
        class="demo-ruleForm"
    >
        <el-form-item label="原密码" prop="oriPassword">
            <el-input v-model="resetPasswordData.oriPassword" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="修改后的密码" prop="password">
            <el-input v-model="resetPasswordData.password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="再次确认修改后的密码" prop="checkPassword">
            <el-input
                v-model="resetPasswordData.checkPassword"
                type="password"
                autocomplete="off"
            />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="resetPassword">确认修改</el-button>
            <el-button @click="clearResetPasswordData">重置</el-button>
        </el-form-item>
    </el-form>
</template>
