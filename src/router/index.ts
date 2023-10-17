import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/login.vue'
import defaultLayout from '@/components/layout/index.vue'
import { useUserStore } from '@/stores/modules/user'
import NotFound from '@/views/error/404.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: defaultLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/index.vue')
        },
         // 菜单管理
        {
          path: 'system/menu',
          name: 'menu',
          component: () => import('@/views/system/menu/index.vue')
        },
         // 角色
        {
          path: 'system/role',
          name: 'role',
          component: () => import('@/views/system/role/index.vue')
        },
         // 用户
        {
          path: 'system/user',
          name: 'user',
          component: () => import('@/views/system/user/index.vue')
        },
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
})

const TITLE = import.meta.env.VITE_TITLE
router.beforeEach((to) => {

  document.title = to.meta?.title ? `${TITLE}-${to.meta.title}` : TITLE

  const userStore = useUserStore()
  if (to.name === 'login') {
    return true
  }

  if (!userStore._token) {
    return '/login'
  }
})

export default router
