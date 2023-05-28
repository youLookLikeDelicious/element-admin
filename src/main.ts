import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'animate.css'
import './assets/main.scss'
import { registerComponent } from '@/components'
import { useUserStore } from './stores/modules/user'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(registerComponent)

const userStore = useUserStore()

app.config.globalProperties.$upload_url = import.meta.env.VITE_API + '/index/upload'

app.mount('#app')
