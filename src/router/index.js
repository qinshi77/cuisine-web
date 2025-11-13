import Vue from 'vue'
import Router from 'vue-router'

// 引入视图组件
import Home from '../views/Home.vue'
import Register from '../views/register/index.vue'

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
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/heatmap',
      name: 'HeatMap',
      component: () => import('../views/viewModel/index.vue')
    }
  ]
})
