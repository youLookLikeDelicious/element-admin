import { ref } from 'vue'

export const useDialog = (callback?: (id?: number, data?: any) => any) => {
  const dialogVisible = ref(false)

  const id = ref(0)

  const handleVisible = (idParam: number, data?: any) => {
    if (callback) {
      callback(idParam, data)
    }

    id.value = idParam
    dialogVisible.value = true

    return Promise.resolve()
  }

  return { dialogVisible, handleVisible, id }
}