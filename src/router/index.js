import Vue from 'vue'
import Router from 'vue-router'

// 引入视图组件
import Home from '../views/Home.vue'
import Login from '../views/register/index.vue'
import UserCommunity from '../views/user/index.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/community',
      name: 'UserCommunity',
      component: UserCommunity
    },
    {
      path: '/heatmap',
      name: 'HeatMap',
      component: () => import('../views/viewModel/index.vue')
    }
  ]
})
