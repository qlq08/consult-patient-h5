import { createRouter, createWebHistory } from 'vue-router'

// 回顾: Vue2的路由
// 1.import VueRouter from 'vue-router'
// 2. const router=new VueRouter({routers:{ // 路由规则}})
// 3.选择路由模式  hash /#/user     history   /user

// 现在 Vue3的路由
// 1.创建路由实例 createRouter({ // 配置对象})
// 2.配置选项中 routers:[ // 路由规则]
// 3.createWebHistory 使用路由history模式
// 4.createWebHashHistory 使用路由hash模式
// 5.import.meta.env.BASE_URL  路由的基准路由  create-vue 脚手架提供的数据(环境变量)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: []
})

export default router
