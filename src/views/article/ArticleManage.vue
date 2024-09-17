<script setup>
import {Delete, Edit, Plus, View} from '@element-plus/icons-vue';
import {getUserTokenStore} from '../../stores/token';
import {reactive, ref} from 'vue';
import {
    articleAddService,
    articleDeleteService,
    articleListService,
    articleUpdateService,
    categoryGetAllService
} from '@/api/article';
import {QuillEditor} from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import {ElMessage, ElMessageBox} from 'element-plus';
import {getUserInfoStore} from '/src/stores/userInfo';

const userInfoStore = getUserInfoStore();
const userTokenStore = getUserTokenStore();

//文章分类数据模型
const categoryList = ref([]);

//用户搜索时选中的分类id
const categoryId = ref('');

//用户搜索时选中的发布状态
const state = ref('');

//文章列表数据模型
const articleList = ref([]);

//分页条数据模型
const pageNumber = ref(1); //当前页
const total = ref(20); //总条数
const pageSize = ref(3); //每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = size => {
    pageSize.value = size;
    getArticleList();
};
//当前页码发生变化，调用此函数
const onCurrentChange = num => {
    pageNumber.value = num;
    getArticleList();
};

//获取文章分类数据
async function getCategoryList() {
    let result = await categoryGetAllService();
    categoryList.value = result.data;
}

getCategoryList();

//获取文章列表数据
async function getArticleList() {
    let params = {
        pageNumber: pageNumber.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value ? categoryId.value : null,
        state: state.value ? state.value : null
    };
    let result = await articleListService(params);
    //渲染视图
    total.value = result.data.total;
    articleList.value = result.data.items;
    //处理数据，给数据模型扩展一个属性categoryName，分类名称
    for (let i = 0; i < articleList.value.length; i++) {
        let article = articleList.value[i];
        for (let j = 0; j < categoryList.value.length; j++) {
            if (article.categoryId === categoryList.value[j].id) {
                article.categoryName = categoryList.value[j].categoryName;
                articleList.value[i] = article;
            }
        }
    }
}

getArticleList();
//控制抽屉是否显示
const visibleDrawer = ref(false);
//添加表单数据模型
const articleModel = reactive({
    title: '',
    categoryId: '',
    coverImg: '',
    content: '',
    state: ''
});

//上传成功执行回调函数
function uploadSuccess(result) {
    console.log(result);
    articleModel.coverImg = result.data;
    console.log(result.data);
}

//上传失败执行
function uploadError(result) {
    console.log(result);
    ElMessage.error(result.message.contains('maximum') ? '图片过大' : '上传失败');
}

async function addArticle(articleState) {
    //发布状态赋值
    articleModel.state = articleState;

    //调用接口 发布文章
    let result = await articleAddService(articleModel);

    ElMessage.success(result.message == '操作成功' ? '添加成功' : result.message);
    visibleDrawer.value = false;
    await getArticleList();
}

//添加（修改）文章弹窗
function editArticle(row) {
    if (drawerTitle.value === '修改帖子') {
        //判断用户是否创建者
        if (row.createUser === userInfoStore.userInfo.id || userInfoStore.userInfo.userRole) {
            //显示弹窗
            visibleDrawer.value = true;
            //原有数据录入
            articleModel.title = row.title;
            articleModel.categoryId = row.categoryId;
            articleModel.coverImg = row.coverImg;
            articleModel.content = row.content;
            //拓展id属性，传递给后台，完成分类的修改
            articleModel.id = row.id;
        } else {
            ElMessageBox.alert('您无权修改该帖子');
        }
    }
    if (drawerTitle.value === '发布帖子') {
        //显示弹窗
        visibleDrawer.value = true;
        //清除数据
        articleModel.title = '';
        articleModel.categoryId = '';
        articleModel.coverImg = '';
        articleModel.content = ' ';
    }
}
//查看文章内容
function getArticle(row) {
    if (drawerTitle.value === '帖子内容') {
        console.log(row);
        ElMessageBox.alert(
            `<img src="${row.coverImg}" style="width: 100%;"><br><br>${row.content}`,
            row.title,
            {
                dangerouslyUseHTMLString: true
            }
        );
    }
}
//清空article数据模型内的数据
function clearArticleData() {
    for (let key in articleModel) {
        if (key === 'content') {
            articleModel[key] = ' ';
        }
        articleModel[key] = '';
    }
}
//修改文章
async function updateArticle(articleState) {
    //更换文章状态state
    articleModel.state = articleState;
    //调用接口
    let result = await articleUpdateService(articleModel);
    ElMessage.success(result.message == '操作成功' ? '修改成功' : result.message);
    //调用获取所有文章的函数，刷新页面
    await getArticleList();
    //退出弹窗
    visibleDrawer.value = false;
}

//删除文章
function deleteArticle(row) {
    //判断用户是否创建者
    console.log(row);
    if (row.createUser == userInfoStore.userInfo.id || userInfoStore.userInfo.userRole) {
        //提示用户 确认框
        ElMessageBox.confirm('你确认要删除该帖子吗？', '温馨提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(async () => {
                //调用接口，删除文章
                await articleDeleteService(row.id);
                ElMessage({
                    type: 'success',
                    message: '删除成功'
                });
                //调用获取所有文章的函数，刷新页面
                await getArticleList();
            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '取消删除'
                });
            });
    } else {
        ElMessageBox.alert('您无权删除该文章');
    }
}

const drawerTitle = ref('');
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>帖子管理</span>
                <div class="extra">
                    <el-button
                        type="primary"
                        @click="
                            drawerTitle = '发布帖子';
                            editArticle();
                        "
                    >
                        发布帖子
                    </el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="帖子分类：">
                <el-select placeholder="请选择" v-model="categoryId">
                    <el-option
                        v-for="category in categoryList"
                        :key="category.id"
                        :label="category.categoryName"
                        :value="category.id"
                    ></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发布状态：">
                <el-select placeholder="请选择" v-model="state">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getArticleList()">搜索</el-button>
                <el-button
                    @click="
                        categoryId = '';
                        state = '';
                        getArticleList();
                    "
                >
                    重置
                </el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="articleList" style="width: 100%">
            <el-table-column label="帖子标题" width="400" prop="title"></el-table-column>
            <el-table-column label="分类" prop="categoryName"></el-table-column>
            <el-table-column label="发表时间" prop="createTime"></el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="操作" width="150">
                <template #default="{row}">
                    <el-button
                        :icon="View"
                        circle
                        plain
                        type="primary"
                        @click="
                            drawerTitle = '帖子内容';
                            getArticle(row);
                        "
                    ></el-button>
                    <el-button
                        :icon="Edit"
                        circle
                        plain
                        type="primary"
                        @click="
                            drawerTitle = '修改帖子';
                            editArticle(row);
                        "
                    ></el-button>
                    <el-button
                        :icon="Delete"
                        circle
                        plain
                        type="danger"
                        @click="deleteArticle(row)"
                    ></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination
            v-model:current-page="pageNumber"
            v-model:page-size="pageSize"
            :page-sizes="[3, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next"
            background
            :total="total"
            @size-change="onSizeChange"
            @current-change="onCurrentChange"
            style="margin-top: 20px; justify-content: flex-end"
        />
        <el-drawer
            v-model="visibleDrawer"
            :title="drawerTitle"
            direction="rtl"
            size="50%"
            @close="clearArticleData()"
        >
            <!-- 添加/更新文章表单 -->
            <el-form :model="articleModel" label-width="100px">
                <el-form-item label="帖子标题">
                    <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="帖子分类">
                    <el-select placeholder="请选择" v-model="articleModel.categoryId">
                        <el-option
                            v-for="category in categoryList"
                            :key="category.id"
                            :label="category.categoryName"
                            :value="category.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="帖子封面">
                    <!--          auto-upload:设置是否自动上传
                        action：设置服务器接口路径
                        name：设置上传的文件字段名
                        headers：设置上传的请求头
                        on-success:设置上传成功的回调函数
          -->
                    <el-upload
                        class="avatar-uploader"
                        :auto-upload="true"
                        :show-file-list="false"
                        action="/base/upload"
                        name="file"
                        :headers="{Authorization: userTokenStore.token}"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                    >
                        <img
                            v-if="articleModel.coverImg"
                            :src="articleModel.coverImg"
                            class="avatar"
                            alt=""
                        />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="帖子内容">
                    <div class="editor">
                        <quill-editor
                            theme="snow"
                            v-model:content="articleModel.content"
                            contentType="html"
                        ></quill-editor>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="
                            drawerTitle === '发布帖子'
                                ? addArticle('已发布')
                                : updateArticle('已发布')
                        "
                    >
                        发布
                    </el-button>
                    <el-button
                        type="info"
                        @click="
                            drawerTitle === '发布帖子' ? addArticle('草稿') : updateArticle('草稿')
                        "
                    >
                        草稿
                    </el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </el-card>
</template>
<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .el-select {
        --el-select-width: 220px;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
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
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>
