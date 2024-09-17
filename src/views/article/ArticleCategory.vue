<script setup>
import {Delete, Edit} from '@element-plus/icons-vue';
import {ref} from 'vue';
import {
    categoryAddService,
    categoryDeleteService,
    categoryGetAllService,
    categoryUpdateService
} from '/src/api/article';
import {ElMessage, ElMessageBox} from 'element-plus';

const categories = ref([]);

//声明一个异步函数
async function getCategories() {
    const result = await categoryGetAllService();
    categories.value = result.data;
}

getCategories();
//控制添加分类弹窗
const dialogVisible = ref(false);
//定义变量，控制分类弹窗的标题
const dialogTitle = ref('');
//添加分类数据模型
const categoryModel = ref({
    categoryName: '',
    categoryAlias: ''
});
//添加分类表单校验
const rules = {
    categoryName: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
    categoryAlias: [{required: true, message: '请输入分类别名', trigger: 'blur'}]
};

//调用接口，添加表单
async function addCategory() {
    //调用接口
    let result = await categoryAddService(categoryModel.value);
    ElMessage.success(result.message == '操作成功' ? '添加成功' : result.message);
    //调用获取所有文章分类的函数，刷新页面
    await getCategories();
    //退出弹窗
    dialogVisible.value = false;
}

//分类编辑弹窗
function editCategory(row) {
    dialogVisible.value = true;
    dialogTitle.value = '修改分类信息';
    //原有数据录取
    categoryModel.value.categoryName = row.categoryName;
    categoryModel.value.categoryAlias = row.categoryAlias;
    //拓展id属性，传递给后台，完成分类的修改
    categoryModel.value.id = row.id;
}

//编辑分类
async function updateCategory() {
    //调用接口
    let result = await categoryUpdateService(categoryModel.value);
    ElMessage.success(result.message == '操作成功' ? '修改成功' : result.message);
    //调用获取所有文章分类的函数，刷新页面
    await getCategories();
    //退出弹窗
    dialogVisible.value = false;
}
//清除弹窗数据模型内的数据
function clearCategoryModel() {
    categoryModel.value = {
        categoryName: '',
        categoryAlias: ''
    };
}
//确认删除提示框
function deleteCategory(row) {
    //提示用户 确认框
    ElMessageBox.confirm('你确认要删除该分类信息吗？', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(async () => {
            //调用接口，删除文章分类
            await categoryDeleteService(row.id);
            ElMessage({
                type: 'success',
                message: '删除成功'
            });
            //调用获取所有文章分类的函数，刷新页面
            await getCategories();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除'
            });
        });
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>帖子分类</span>
                <div class="extra">
                    <el-button
                        type="primary"
                        @click="
                            dialogVisible = true;
                            dialogTitle = '添加分类';
                            clearCategoryModel();
                        "
                    >
                        添加分类
                    </el-button>
                </div>
            </div>
        </template>
        <el-table :data="categories" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"></el-table-column>
            <el-table-column label="分类名称" prop="categoryName"></el-table-column>
            <el-table-column label="分类别名" prop="categoryAlias"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{row}">
                    <el-button
                        :icon="Edit"
                        circle
                        plain
                        type="primary"
                        @click="editCategory(row)"
                    ></el-button>
                    <el-button
                        :icon="Delete"
                        circle
                        plain
                        type="danger"
                        @click="deleteCategory(row)"
                    ></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 添加分类弹窗 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
            <el-form
                :model="categoryModel"
                :rules="rules"
                label-width="100px"
                style="padding-right: 30px"
            >
                <el-form-item label="分类名称" prop="categoryName">
                    <el-input
                        v-model="categoryModel.categoryName"
                        minlength="1"
                        maxlength="10"
                    ></el-input>
                </el-form-item>
                <el-form-item label="分类别名" prop="categoryAlias">
                    <el-input
                        v-model="categoryModel.categoryAlias"
                        minlength="1"
                        maxlength="15"
                    ></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button
                        type="primary"
                        @click="dialogTitle == '添加分类' ? addCategory() : updateCategory()"
                    >
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>
