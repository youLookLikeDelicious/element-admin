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
        {
          path: 'notification',
          name: 'notification',
          meta: {
            title: '消息中心'
          },
          component: () => import('@/views/notification/index.vue')
        },
        {
          path: 'user/edit',
          name: 'editUser',
          component: () => import('@/views/user-edit.vue')
        },
        {
          path: 'reset/password',
          name: 'resetPassword',
          component: () => import('@/views/reset-password.vue')
        },
        {
          path: 'user/department/index',
          name: 'department',
          component: () => import('@/views/user/department/index.vue')
        },
        // 客户相关
        {
          path: '/customer/grade/index',
          name: 'customerGrage',
          meta: {
            title: '客户等级'
          },
          component: () => import('@/views/customer/grade/index.vue')
        },
        {
          path: '/customer/source/index',
          name: 'customerSource',
          meta: {
            title: '客户渠道'
          },
          component: () => import('@/views/customer/source/index.vue')
        },
        {
          path: '/customer/index/index',
          name: 'customerIndex',
          meta: {
            title: '客户管理'
          },
          component: () => import('@/views/customer/index/index.vue')
        },
        {
          path: '/customer/index/sea',
          name: 'customerSea',
          meta: {
            title: '公海客户'
          },
          component: () => import('@/views/customer/sea/index.vue')
        },
        {
          path: '/customer/contact/index',
          name: 'customerContact',
          meta: {
            title: '客户联系人'
          },
          component: () => import('@/views/customer/contact/index.vue')
        },
        {
          path: '/adm/wechat/wechat',
          meta: {
            title: '微信管理'
          },
          name: 'admWechat',
          component: () => import('@/views/adm/wechat/index.vue')
        },
        // 订单相关
        {
          path: '/order/payment/payment',
          meta: {
            title: '支付方式'
          },
          name: 'orderPayment',
          component: () => import('@/views/order/payment/index.vue')
        },
        {
          path: '/order/supplier/supplier',
          meta: {
            title: '供应商管理'
          },
          name: 'orderSupplier',
          component: () => import('@/views/order/supplier/index.vue')
        },
        {
          path: '/order/unit/unit',
          meta: {
            title: '单位管理'
          },
          name: 'orderUnit',
          component: () => import('@/views/order/unit/index.vue')
        },
        {
          path: '/order/product/product',
          meta: {
            title: '产品管理'
          },
          name: 'orderProduct',
          component: () => import('@/views/order/product/index.vue')
        },
        {
          path: '/order/order/order',
          meta: {
            title: '订单管理'
          },
          name: 'order',
          component: () => import('@/views/order/index/index.vue')
        },
        {
          path: '/order/classify/classify',
          meta: {
            title: '项目分类'
          },
          name: 'orderClassify',
          component: () => import('@/views/order/classify/index.vue')
        },
        // 财务管理
        {
          path: '/finance/account/index',
          meta: {
            title: '收款账户'
          },
          name: 'orderAccount',
          component: () => import('@/views/finance/account/index.vue')
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
