<script setup>
import {Plus, Upload} from '@element-plus/icons-vue';
import {ref} from 'vue';
import avatar from '/src/assets/default.png';
import {getUserInfoStore} from '/src/stores/userInfo';
import {getUserTokenStore} from '../../stores/token';
import {ElMessage} from 'element-plus';
import {updateUserAvatarService} from '../../api/user';

const userTokenStore = getUserTokenStore();
const userInfoStore = getUserInfoStore();
const uploadRef = ref();

//用户头像地址
const imgUrl = ref(userInfoStore.userInfo.userPic);

//图片上传成功的函数
function handleAvatarSuccess(result) {
    console.log(result);
    imgUrl.value = result.data;
}

//用户头像修改成上传的图片
async function updateAvatar() {
    //调用接口
    let result = await updateUserAvatarService(imgUrl.value);
    ElMessage.success(result.message == '操作成功' ? '头像修改成功' : result.message);
    //修改pinia中的数据
    userInfoStore.userInfo.userPic = imgUrl.value;
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>更换头像</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-upload
                    ref="uploadRef"
                    class="avatar-uploader"
                    :show-file-list="false"
                    :auto-upload="true"
                    action="/base/upload"
                    name="file"
                    :headers="{Authorization: userTokenStore.token}"
                    :on-success="handleAvatarSuccess"
                >
                    <img v-if="imgUrl" :src="imgUrl" class="avatar" alt="" />
                    <img v-else :src="avatar" width="278" alt="" />
                </el-upload>
                <br />
                <el-button
                    type="primary"
                    :icon="Plus"
                    size="large"
                    @click="uploadRef.$el.querySelector('input').click()"
                >
                    选择图片
                </el-button>
                <el-button type="success" :icon="Upload" size="large" @click="updateAvatar">
                    上传头像
                </el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<style lang="scss" scoped>
.avatar-uploader {
    :deep() {
        .avatar {
            width: 278px;
            height: 278px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 278px;
            height: 278px;
            text-align: center;
        }
    }
}
</style>
