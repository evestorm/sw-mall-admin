import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Dashboard from './views/Dashboard.vue'
import UserInfo from './views/UserInfo.vue'
import AddUser from './views/AddUser.vue'
import CategoryList from './views/CategoryList.vue'
import GoodsList from './views/GoodsList.vue'
import GoodsDetail from './views/GoodsDetail.vue'
import Login from './views/Login.vue'
import NotFound from './views/404.vue'

Vue.use(Router)

// 使用 router 变量接收
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', redirect: '/index' },
    { path: '/index',
      name: 'index',
      component: Index,
      meta: { title: '首页' },
      children: [
        { path: '', component: Dashboard },
        { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { title: 'Dashboard' } },
        { path: '/adduser', name: 'adduser', component: AddUser, meta: { title: '添加管理员' } },
        { path: '/userinfo', name: 'userinfo', component: UserInfo, meta: { title: '个人信息' } },
        { path: '/categorylist', name: 'categorylist', component: CategoryList, meta: { title: '分类列表' } },
        { path: '/goodslist', name: 'goodslist', component: GoodsList, meta: { title: '商品列表' } },
        { path: '/goodsdetail/:ID', name: 'goodsdetail', component: GoodsDetail, meta: { title: '编辑商品' } }
      ]
    },
    { path: '/login', name: 'login', component: Login, meta: { title: '登录' } },
    { path: '*', name: 'notfound', component: NotFound }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 查看本地是否有 token 值
  const isLogin = localStorage.token
  if (to.path === '/login') {
    next()
  } else {
    // 访问非login页面检查 isLogin ，不存在则跳转 login
    isLogin ? next() : next('/login')
  }
})

// 导出
export default router
