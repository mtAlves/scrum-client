import Vue from 'vue'
import Router from 'vue-router'
import state from '@/store/state'

import login from '@/components/auth/login'
import register from '@/components/auth/register'

import home from '@/components/home/home'

import products from '@/components/products/main'
import product from '@/components/products/product'

import sprints from '@/components/sprints/sprints'
import tasks from '@/components/tasks/tasks'

Vue.use(Router)

function requireAuth (to, from, next) {
  const auth = state.auth
  if (auth.token === null || auth.username === null) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/',
      name: 'home',
      component: home,
      beforeEnter: requireAuth
    },
    {
      path: '/products',
      name: 'products',
      component: products,
      beforeEnter: requireAuth,
    },
    {
      path: '/product/:id',
      name: 'product',
      component: product,
      beforeEnter: requireAuth,
    },
    {
      path: '/sprints',
      name: 'sprints',
      component: sprints,
      beforeEnter: requireAuth
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: tasks,
      beforeEnter: requireAuth
    }
  ]
})
