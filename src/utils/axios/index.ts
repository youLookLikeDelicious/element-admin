import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
import router from '@/router'

axios.defaults.withCredentials = false

axios.defaults.baseURL = import.meta.env.VITE_API

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  const message = error.response.data.message
  if (message !== 'The given data was invalid.') {
    ElMessage({
      showClose: false,
      message: message,
      type: 'error'
    })
  }
  if (message.response.status === 401) {
    router.push('/401')
  }
  return Promise.reject(error)
})

axios.interceptors.request.use(function (config) {
  if (!config.params) {
    config.params = {}
  }

  const userStore = useUserStore()
  // 添加token
  if (userStore._token) {
    config.headers.Authorization = userStore._token
  }

  return config
}, function (error) {
  return Promise.reject(error)
})

export default axios