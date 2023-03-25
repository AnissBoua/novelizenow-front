import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import {useAuth} from '@/stores/auth.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Registration.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/Account.vue')
    },
    {
      path: '/:chapter_id/page_edit/:page_id?',
      name: 'page_edit',
      component: () => import('../views/PageEdit.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const secureLoggedPath = [
    "/register",
    "/login",
    "/account"
  ]
  if (secureLoggedPath.includes(to.path)) {
    const authStore = useAuth();
    const { verifyToken } = authStore
    const isAuthenticated = await verifyToken();
    console.log(isAuthenticated);
    if (isAuthenticated) {
      if (to.path === "/account") {
        next();
      }else{
        next("/");
      }
    }
    else {
      if (to.path === "/account") {
        next("/login");
      } else {
        next();
      }
    }
    
  }else {
    next();
  }
})

export default router
