import { useUserStore } from '@/stores'
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
  routes: [
    {
      path: '/login',
      component: () => import('@/views/Login/index.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/',
      component: () => import('@/views/Layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/Home/index.vue'),
          meta: { title: '首页' }
        },
        {
          path: '/article',
          component: () => import('@/views/Article/index.vue'),
          meta: { title: '健康百科' }
        },
        {
          path: '/notify',
          component: () => import('@/views/Notify/index.vue'),
          meta: { title: '消息通知' }
        },
        {
          path: '/user',
          component: () => import('@/views/User/index.vue'),
          meta: { title: '我的' }
        }
      ]
    }
  ]
})

// 访问权限控制
router.beforeEach((to) => {
  // 修改标题
  document.title = `优医问诊-${to.meta.title || ''}`
  // 如果return true 或啥也不写  就是放行
  // 拦截到某个页面,  return '路由地址'
  const store = useUserStore()
  // 不需要登录的页面, 白名单
  const whileList = ['/login']
  // 需求:当你没有登录也就是没有token 且 你访问的不是登录页面 拦截到登录
  if (!store.user?.token && !whileList.includes(to.path)) return '/login'
  // 否则不做任何处理
})

export default router
