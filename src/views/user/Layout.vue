<script setup>
import {
    CaretBottom,
    Crop,
    EditPen,
    Management,
    Promotion,
    SwitchButton,
    User,
    UserFilled,
    Comment,
    Histogram
} from '@element-plus/icons-vue';
import avatar from '../../assets/default.png';
import {getUserInfoService} from '../../api/user';
import getUserInfoStore from '../../stores/userInfo';
import {useRouter} from 'vue-router';
import {ElMessage, ElMessageBox} from 'element-plus';
import {getUserTokenStore} from '../../stores/token';
import getPosition from '@utils/user_article/getCurrentPosition';

const userToken = getUserTokenStore();

const router = useRouter();
const userInfoStore = getUserInfoStore();

//调用函数，获取用户详细信息
async function getUserInfo() {
    //调用接口
    const result = await getUserInfoService();
    console.table(result);
    const position = await getPosition() 
    //数据存储到pinia中
    userInfoStore.setUserInfo(result.data);
}

getUserInfo();

//条目触发后的函数
function handleCommand(command) {
    //判断指令
    if (command === 'logout') {
        //退出登录
        //提示用户 确认框
        ElMessageBox.confirm('你确认要登出吗？', '温馨提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(async () => {
                //退出登录
                //1.清空pinia中存储的token以及个人信息
                userToken.removeToken();
                userInfoStore.removeUserInfo();
                //2.跳转到登录页面
                await router.push('/login');
                ElMessage({
                    type: 'success',
                    message: '登出成功'
                });
            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '取消登出'
                });
            });
    } else {
        //路由跳转
        router.push('/user/' + command);
    }
}
</script>

<template>
    <!--  element-plus中的容器-->
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <!--      element-plus的菜单标签-->
            <el-menu
                active-text-color="#ffd04b"
                background-color="#232323"
                text-color="#fff"
                router
            >
                <el-menu-item index="/article/category" v-if="userInfoStore.userInfo.userRole">
                    <el-icon>
                        <Comment />
                    </el-icon>
                    <span>帖子分类管理</span>
                </el-menu-item>
                <el-menu-item index="/article/manage">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>城市论坛</span>
                </el-menu-item>
                <el-menu-item index="/city_Day">
                    <el-icon><Histogram /></el-icon>
                    <span>三维城市场景</span>
                </el-menu-item>
                <el-sub-menu index="">
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="/user/info">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/user/avatar">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>更换头像</span>
                    </el-menu-item>
                    <el-menu-item index="/user/resetPassword">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>重置密码</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div>
                    尊敬的用户：
                    <strong>
                        {{
                            userInfoStore.userInfo.nickname
                                ? userInfoStore.userInfo.nickname
                                : userInfoStore.userInfo.username
                        }}
                    </strong>
                </div>

                <!--        下拉菜单-->
                <!--        command:条目被点击后会触发，在事件函数上可以声明一个参数，接受条目对应的指令-->
                <div class="el-header-item">
                    <div class="el-header-role">
                        {{ userInfoStore.userInfo.userRole ? '管理员' : '普通用户' }}
                    </div>
                    <el-dropdown placement="bottom-end" @command="handleCommand">
                        <span class="el-dropdown__box">
                            <el-avatar
                                :src="
                                    userInfoStore.userInfo.userPic
                                        ? userInfoStore.userInfo.userPic
                                        : avatar
                                "
                            />
                            <el-icon>
                                <CaretBottom />
                            </el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="info" :icon="User">
                                    基本资料
                                </el-dropdown-item>
                                <el-dropdown-item command="avatar" :icon="Crop">
                                    更换头像
                                </el-dropdown-item>
                                <el-dropdown-item command="resetPassword" :icon="EditPen">
                                    重置密码
                                </el-dropdown-item>
                                <el-dropdown-item command="logout" :icon="SwitchButton">
                                    退出登录
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </el-header>
            <!-- 中间区域 -->
            <el-main>
                <router-view></router-view>
            </el-main>
            <!-- 底部区域 -->
            <el-footer>project233 created by AsMuin</el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #232323;

        &__logo {
            height: 120px;
            background: url('@/assets/project233Logo.png') no-repeat center / 120px auto;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-header-item {
            display: flex;
            align-items: center;

            .el-header-role {
                font-size: 14px;
                color: #999;
                margin-right: 10px;
            }

            .el-dropdown__box {
                display: flex;
                align-items: center;

                .el-icon {
                    color: #999;
                    margin-left: 10px;
                }

                &:active,
                &:focus {
                    outline: none;
                }
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>
