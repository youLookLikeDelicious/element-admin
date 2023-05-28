import { ref } from 'vue'

export const useDrawer = (callback?: (...args: any) => any) => {
  const visible = ref(false)

  const handleVisible = (...args: any) => {
    if (callback) {
      callback(...args)
    }
    visible.value = true
    return Promise.resolve()
  }

  return { visible, handleVisible }
}