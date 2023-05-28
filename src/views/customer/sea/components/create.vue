<script lang="ts" setup>
import { reactive } from 'vue'
import { useDialog } from '@/composition/dialog'
import { useSubmit } from '@/composition/submit'
import { saveSource } from '@/apis/customer'
import { ElMessage } from 'element-plus'
import { nextTick } from 'vue'

const emit = defineEmits<{
  (event: 'success'): void
}>()


// 验证规则
const rules = {
  title: { required: true, message: '请输入客户渠道' }
}

const { dialogVisible, handleVisible, id } = useDialog(() => {
  return nextTick(() => {
    form.value && form.value.clearValidate()
  })
})

// form表单
const formData = reactive({
  title: ''
})

const { handleSubmit, isSubmitting, form } = useSubmit(() => {
  return saveSource(formData, id.value)
    .then(() => {
      emit('success')
      dialogVisible.value = false
      ElMessage({ message: '操作成功', type: 'success' })
    })
})

const handleClose = () => {
  formData.title = ''
}

defineExpose({ handleVisible, formData })
</script>

<template>
  <el-dialog v-model="dialogVisible" :close-on-click-modal="false" width="520" :title="id ? '编辑客户渠道' : '添加客户渠道'" @close="handleClose">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="120px" @submit.prevent="handleSubmit">
      <el-row>
        <el-col>
          <el-form-item label="渠道名称" prop="title">
            <el-input placeholder="渠道名称" v-model="formData.title" clearable></el-input>
          </el-form-item>
        </el-col>
        <input type="submit" hidden>
      </el-row>
    </el-form>
    <template #footer>
      <el-row justify="end">
        <el-button type="primary" native-type="submit" :loading="isSubmitting" @click="handleSubmit"><i-ep-Finished v-if="!isSubmitting" class="mr-12" /> 提 交</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>

<style lang="scss">
</style>