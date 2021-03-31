import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('../pages/Index'),
    meta: {
      layout: 'MainLayout'
    }
  },
  {
    path: '/profile',
    component: () => import('../pages/Profile'),
    meta: {
      layout: 'MainLayout',
      requiresAuth: true
    }
  },
  {
    path: '/endpoints',
    component: () => import('../pages/Endpoints'),
    meta: {
      layout: 'MainLayout',
      requiresAuth: true
    }
  },
  {
    path: '/endpoints/:endpoint_id/urls',
    component: () => import('../pages/Urls'),
    meta: {
      layout: 'MainLayout',
      requiresAuth: true
    }
  },
  {
    path: '/endpoints/:endpoint_id/urls/new',
    component: () => import('../pages/CreateURL'),
    meta: {
      layout: 'MainLayout',
      requiresAuth: true
    }
  },
  {
    path: '/endpoints/:endpoint_id/urls/:id',
    component: () => import('../pages/EditURL'),
    meta: {
      layout: 'MainLayout',
      requiresAuth: true
    }
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const isLogged = store.getters['auth/isLogged']

  if (to.matched.some(route => route.meta.requiresAuth) && !isLogged)
    next({ name: 'index' })
  else
    next()
})

export default router
