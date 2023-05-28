<script lang="ts" setup>
import { reactive } from 'vue'
import { resetPassword } from '@/apis/user'
import { useSubmit } from '@/composition/submit'
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/modules/user';

const formData = reactive({
  old_pwd: '',
  pwd: '',
  pwd_confirm: ''
})

const validatePwd = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入密码'))
  }

  if (formData.pwd_confirm) {
    form.value.validateField('pwd_confirm')
  }
  callback()
}

const vallidatePwdConfirm = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入确认密码'))
  }

  if (value !== formData.pwd) {
    return callback(new Error('密码不一致'))
  }

  callback()
}

const rules = {
  old_pwd: { required: true, message: '请输入旧密码' },
  pwd: { validator: validatePwd },
  pwd_confirm: { validator: vallidatePwdConfirm }
}

const router = useRouter()
const userStore = useUserStore()

const { isSubmitting, handleSubmit, form } = useSubmit(() => {
  return resetPassword(formData)
    .then(() => {
      userStore.clear()
      router.push('/login')
    })
})

</script>

<template>
  <el-card header="重置密码" shadow="never">
    <el-form ref="form" :rules="rules" :model="formData" label-width="100px" @submit.native.prevent="handleSubmit">
      <el-form-item label="旧密码" prop="old_pwd">
        <el-input v-model="formData.old_pwd" placeholder="旧密码" type="password" show-password>
          <template #prefix>
            <el-icon class="el-input__icon"><i-ep-lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="pwd">
        <el-input v-model="formData.pwd" type="password" show-password placeholder="新密码">
          <template #prefix>
            <el-icon class="el-input__icon"><i-ep-lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="pwd_confirm">
        <el-input v-model="formData.pwd_confirm" type="password" show-password placeholder="确认新密码">
          <template #prefix>
            <el-icon class="el-input__icon"><i-ep-lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-row justify="end">
        <el-button type="primary" native-type="submit" :loading="isSubmitting"><i-ep-Finished v-if="!isSubmitting" class="mr-12" @click="handleSubmit" /> 提 交</el-button>
      </el-row>
    </el-form>
  </el-card>
</template>

<style lang="scss">
</style>