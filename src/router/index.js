import Vue from 'vue'
import Router from 'vue-router'

// 引入视图组件
import Home from '../views/Home.vue'
import Login from '../views/register/index.vue'
import UserCommunity from '../views/user/index.vue'
import FoodHistory from '../views/history/index.vue'
import UserEdit from '../views/user/author.vue'
import CoolTool from '../views/coolTool/index.vue'
import UserRegister from '../views/register/userReguster.vue'
import Games from '../views/games/index.vue'

Vue.use(Router)

const router = new Router({
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
      component: UserCommunity,
      meta: { requiresAuth: true }
    },
    {
      path: '/history',
      name: 'FoodHistory',
      component: FoodHistory,
      meta: { requiresAuth: true }
    },
    {
      path: '/user/edit',
      name: 'UserEdit',
      component: UserEdit,
      meta: { requiresAuth: true }
    },
    {
      path: '/heatmap',
      name: 'HeatMap',
      component: () => import('../views/viewModel/index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/coolTool',
      name: 'CoolTool',
      component: CoolTool,
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'UserRegister',
      component: UserRegister
    },
    {
      path: '/games',
      name: 'Games',
      component: Games,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const username = localStorage.getItem('username')

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!username || username === '') {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
