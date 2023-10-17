import { useUserStore } from '@/stores/modules/user'
import { dayjs } from 'element-plus'
import { debounce } from 'throttle-debounce'
import type { App } from 'vue'

const MOBILE_MAX_WIDTH = 960

const checkIsMobile = (app: App) => {
  const rect = document.documentElement.getBoundingClientRect()
  app.config.globalProperties.$is_mobile = rect.width <= MOBILE_MAX_WIDTH
}

function registerGlobalProperty(app: App) {
  app.config.globalProperties.$upload_url = import.meta.env.VITE_UPLOAD_URL
  app.config.globalProperties.$api_url = import.meta.env.VITE_API

  const userStore = useUserStore()
  app.config.globalProperties.isPermission = (permission?: string) => {
    if (!permission || userStore.isSuperAdmin) return true

    return userStore.permissions.includes(permission)
  }

  app.config.globalProperties.getShortStructs = (format = 'x', isRange = true) => {
    return [
      {
        text: '近三天',
        value: () => {
          return [dayjs().subtract(2, 'day').format(format), dayjs().format()]
        }
      },
      {
        text: '近七天',
        value: () => {
          return [dayjs().subtract(7, 'day').format(format), dayjs().format()]
        }
      },
      {
        text: '近30天',
        value: () => {
          return [dayjs().subtract(29, 'day').format(format), dayjs().format()]
        }
      },
      {
        text: '上个月',
        value: () => {
          return [dayjs().subtract(1, 'month').startOf('month').format(format), dayjs().subtract(1, 'month').endOf('month').format(format)]
        }
      },
      {
        text: '本月',
        value: () => {
          return [dayjs().startOf('month').format(format), dayjs().format(format)]
        }
      }
    ]
  }
}
export const initApp = {
  install(app: App) {
    registerGlobalProperty(app)

    // 权限管理
    const userStore = useUserStore()
    app.config.globalProperties.isPermission = function (permission?: string) {
      if (userStore.isSuperAdmin || !permission) return true

      return userStore.permissions.includes(permission)
    }

    // 显示隐藏行的el-table 属性
    app.config.globalProperties.showDeletedRows = (colum: any) => {
      if (colum?.row?.deleted_at) {
        return 'deleted-row'
      }
      return undefined
    }

    // 移动端判断
    checkIsMobile(app)

    window.addEventListener('resize', debounce(10, () => {
      checkIsMobile(app)
    }))
  }
}
