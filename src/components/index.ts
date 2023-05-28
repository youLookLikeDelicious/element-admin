
import type { App } from 'vue'
import listPage from './slot/list-page.vue'

export const registerComponent  = {
  install(app: App) {
    app.component('list-page', listPage)
  }
}
