// import axios from "axios";
// //定义一个变量，记录公共的前缀，baseURL
// let baseURL = "http://localhost:8080";
// const BaseUrl = axios.create({ baseURL });
import request from '@utils/user_article/request';

//获取所有文章数据的函数
export function categoryGetAllService() {
    //发送异步请求，获取所有文章数据
    //同步等待服务器响应的结果，并返回  async await
    //return request.get("/category",{headers:{'Authorization':userToken.token}});//在pinia中定义的响应式数据，都不需要value
    return request.get('/category');
}

//根据文章分类和发布状态搜索的函数
export function articleSearchService(searchConditions) {
    //发生请求，完成搜索
    return request.get('/article/search', {
        params: searchConditions
    });
}

//添加文章分类
export function categoryAddService(categoryData) {
    return request.post('/category', categoryData);
}

//文章分类修改
export function categoryUpdateService(categoryData) {
    return request.put('/category', categoryData);
}

//文章分类删除
export function categoryDeleteService(id) {
    return request.delete('/category?id=' + id);
}

//文章列表查询
export function articleListService(params) {
    return request.get('/article', {params: params});
}

//文章添加
export function articleAddService(articleData) {
    return request.post('/article', articleData);
}

//删除文章
export function articleDeleteService(id) {
    return request.delete('/article?id=' + id);
}

//修改文章
export function articleUpdateService(articleData) {
    return request.put('/article', articleData);
}
