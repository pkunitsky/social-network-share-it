import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'
import store from '@/store'

import TokenChecker from '../utils/TokenChecker'

/* page components */
import auth from '@/pages/auth'
import home from '@/pages/home'


Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: home,
      beforeEnter: (to, from, next) => {
        const { token } = store.state
        if (!token) {
          /* if no token -> redirect to auth page */
          next({ path: '/auth' })
          return
        }

        next()
      }
    },
    {
      path: '/auth',
      component: auth,
      beforeEnter: (to, from, next) => {
        const { token } = store.state
        if (token) {
          next({ path: '/' })
          return
        }
        next()
      }
    },
    {
      path: '/logout',
      beforeEnter: (to, from, next) => {
        store.commit('setToken', null)

        next({ path: '/auth' })
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const { token } = store.state
  
  if (!token) {
    next()
    return
  }

  nprogress.start()
  TokenChecker
    .check(token)
    .then(valid => {
      if (!valid) store.commit('setToken', null)
      nprogress.done()
      next()
    })
})

export default router