import { ref } from 'vue'

export const useDialog = (callback?: (data?: any, id?: number) => any) => {
  const dialogVisible = ref(false)

  const id = ref<undefined|number>(0)

  const handleVisible = (data?: any, idParam?: number) => {
    id.value = idParam
    dialogVisible.value = true

    if (typeof callback === 'function') {
      return callback(data, idParam)
    }

    return Promise.resolve()
  }

  return { dialogVisible, handleVisible, id }
}