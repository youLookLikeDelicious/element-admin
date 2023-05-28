<script lang="ts" setup>
import { reactive } from 'vue'
import { useDialog } from '@/composition/dialog'
import { useSubmit } from '@/composition/submit'
import { saveWechat } from '@/apis/adm'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const emit = defineEmits<{
  (event: 'success'): void
}>()


// 验证规则
const rules = {
  wechat: { required: true, message: '请输入微信号名称' }
}

const { dialogVisible, handleVisible, id } = useDialog((id, data) => {
  userName.value = data.name
  formData.belong_uid = data.belong_uid || ''
  formData.wechat = data.wechat
  setTimeout(() => {
    console.log(form.value)
    if (form.value) {
      form.value.clearValidate()
    }
  })
  return Promise.resolve()
})

// form表单
const formData = reactive({
  belong_uid: 0,
  wechat: ''
})
const userName = ref('')

// 提交表单
const { handleSubmit, isSubmitting, form } = useSubmit(() => {
  return saveWechat(formData, id.value)
    .then(() => {
      emit('success')
      dialogVisible.value = false
      ElMessage({ message: '操作成功', type: 'success' })
    })
})


const userPickerEl = ref()

const handleClose = () => {
  userName.value = ''
}
defineExpose({ handleVisible, formData })
</script>

<template>
  <el-dialog v-model="dialogVisible" :close-on-click-modal="false" width="520" :title="id ? '编辑微信' : '添加微信'" @close="handleClose">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="120px"  @submit.prevent="handleSubmit">
      <el-row>
        <el-col>
          <el-form-item label="微信号名称" prop="wechat">
            <el-input placeholder="渠道名称" v-model="formData.wechat" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="绑定员工" prop="belong_uid">
            <user-picker v-model="formData.belong_uid" v-model:userName="userName" ref="userPickerEl"></user-picker>
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