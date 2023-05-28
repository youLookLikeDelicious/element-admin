<script lang="ts" setup>
import { reactive } from 'vue'
import { useDialog } from '@/composition/dialog'
import { useSubmit } from '@/composition/submit'
import { ElMessage } from 'element-plus'
import { nextTick } from 'vue'
import { saveUnit } from '@/apis/order'

const emit = defineEmits<{
  (event: 'success'): void
}>()


// 验证规则
const rules = {
  name: { required: true, message: '请输入单位' }
}

const { dialogVisible, handleVisible, id } = useDialog(() => {
  return nextTick(() => {
    form.value && form.value.clearValidate()
  })
})

// form表单
const formData = reactive({
   name: '',
   description: ''
})

const { handleSubmit, isSubmitting, form } = useSubmit(() => {
  return saveUnit(formData, id.value)
    .then(() => {
      emit('success')
      dialogVisible.value = false
      ElMessage({ message: '操作成功', type: 'success' })
    })
})

const handleClose = () => {
  formData.name = ''
  formData.description = ''
}
defineExpose({ handleVisible, formData })
</script>

<template>
  <el-dialog v-model="dialogVisible" :close-on-click-modal="false" width="520" :title="id ? '编辑单位' : '添加单位'" @close="handleClose">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="80px" @submit.prevent="handleSubmit">
      <el-row>
        <el-col>
          <el-form-item label="单位名称" prop="name">
            <el-input placeholder="单位名称" v-model="formData.name" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="描述" prop="description">
            <el-input v-model="formData.description" placeholder="描述" type="textarea"></el-input>
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