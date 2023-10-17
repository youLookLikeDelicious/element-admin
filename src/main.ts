import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'animate.css'
import './assets/main.scss'
import { registerComponent } from '@/components'
import { useUserStore } from '@/stores/modules/user'
import { initApp } from '@/utils/app/init'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(registerComponent)
app.use(initApp)

app.config.globalProperties.$upload_url = import.meta.env.VITE_API + '/index/upload'

const userStore = useUserStore()
userStore.fetchUser()
app.mount('#app')
