import { ref } from 'vue'
import { debounce } from 'throttle-debounce'

export const useSubmit = (api: () => any) => {
  const isSubmitting = ref(false)

  const form = ref()
  
  const handleSubmit = debounce(100, () => {
    if (isSubmitting.value) return
    return form.value.validate()
      .then(() => {
        isSubmitting.value = true
        return api().finally(() => {
          isSubmitting.value = false
        })
      })
  })

  return { isSubmitting, handleSubmit, form }
}
