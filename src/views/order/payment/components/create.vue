<script lang="ts" setup>
import { reactive } from 'vue'
import { useDialog } from '@/composition/dialog'
import { useSubmit } from '@/composition/submit'
import { savePayment } from '@/apis/order'
import { ElMessage } from 'element-plus'
import { nextTick } from 'vue'

const emit = defineEmits<{
  (event: 'success'): void
}>()


// 验证规则
const rules = {
  payment: { required: true, message: '请输入支付方式' }
}

const { dialogVisible, handleVisible, id } = useDialog(() => {
  return nextTick(() => {
    form.value && form.value.clearValidate()
  })
})

// form表单
const formData = reactive({
  payment: '',
  description: ''
})

const { handleSubmit, isSubmitting, form } = useSubmit(() => {
  return savePayment(formData, id.value)
    .then(() => {
      emit('success')
      dialogVisible.value = false
      ElMessage({ message: '操作成功', type: 'success' })
    })
})

const handleClose = () => {
  formData.payment = ''
  formData.description = ''
}

defineExpose({ handleVisible, formData })
</script>

<template>
  <el-dialog v-model="dialogVisible" :close-on-click-modal="false" width="520" :title="id ? '编辑支付方式' : '添加支付方式'" @close="handleClose" @submit.prevent="handleSubmit">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="80px">
      <el-row>
        <el-col>
          <el-form-item label="支付方式" prop="payment">
            <el-input placeholder="渠道名称" v-model="formData.payment" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="formData.description" placeholder="描述"></el-input>
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