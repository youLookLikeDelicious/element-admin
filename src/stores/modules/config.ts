import { useLocalStorage } from "@vueuse/core"
import { defineStore } from "pinia"

export const useConfigStore = defineStore('config', {
  state() {
    return {
      isCollapse: useLocalStorage('menu-collapse', false)
    }
  }
})
