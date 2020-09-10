import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import BackHome from '../components/BackHome.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/back/Users.vue'
import Roles from '../components/roles/Roles.vue'
import Rights from '../components/roles/Rights.vue'
import Categories from '../components/goods/Categories.vue'
import Goods from '../components/goods/Goods.vue'
import Params from '../components/goods/Params.vue'
import Orders from '../components/orders/Orders.vue'
import Reports from '../components/reports/Reports.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/backhome',
    name: 'backhome',
    component: BackHome,
    redirect: '/welcome',
    children: [
      { path: '/welcome', name: 'welcome', component: Welcome },
      { path: '/users', name: 'users', component: Users },
      { path: '/roles', name: 'roles', component: Roles },
      { path: '/rights', name: 'rights', component: Rights },
      { path: '/categories', name: 'categories', component: Categories },
      { path: '/goods', name: 'goods', component: Goods },
      { path: '/params', name: 'params', component: Params },
      { path: '/orders', name: 'orders', component: Orders },
      { path: '/reports', name: 'reports', component: Reports }
    ]
  }]
})
// 挂载路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
