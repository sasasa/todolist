import Vue from 'vue'
import VueRouter from 'vue-router'
import Todos from '@/views/Todos.vue'
import Home from '@/views/Home.vue'
import Edit from '@/views/Edit.vue'
import Add from '@/views/Add.vue'
import Login from '@/views/Login.vue'
import Logout from '@/views/Logout.vue'
import Signup from '@/views/Signup.vue'
import ResetPassword from '@/views/ResetPassword.vue'
import SendEmail from '@/views/SendEmail.vue'
import { isAuthed } from '@/helpers/auth';

if (!process || process.env.NODE_ENV !== 'test') {
  Vue.use(VueRouter)
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/todos',
    name: 'todos',
    component: Todos,
    meta: {
      isRequestAuth: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/logout',
    name: 'logout',
    component: Logout,
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
  },
  {
    path: '/add',
    name: 'add',
    component: Add,
    meta: {
      isRequestAuth: true,
    },
  },
  {
    path: '/edit/:id(\\d+)',
    name: 'edit',
    component: Edit,
    props: true,
    meta: {
      isRequestAuth: true,
    },
  },
  {
    path: '/reset_password/:token',
    name: 'reset_password',
    component: ResetPassword,
    props: true,
  },
  {
    path: '/send_email',
    name: 'send_email',
    component: SendEmail,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (to.hash) {
        return { selector: to.hash }
      } else {
        return { x: 0, y: 0 }
      }
    }
  }
})
router.authed = () => {
  return isAuthed()
}
router.beforeEach((to, from, next) => {
  if(to.matched.some((route) => route.meta.isRequestAuth) && !router.authed()) {
    next({ path: '/login', query: { backuri: to.fullPath } })
  } else {
    next()
  }
})

export default router
