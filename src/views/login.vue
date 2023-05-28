<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue';
import { getCaptcha, login } from '@/apis'
import { debounce } from 'throttle-debounce'
import { useUserStore } from '@/stores/modules/user'
import { useSubmit } from '@/composition/submit';

const userStore = useUserStore()
const router = useRouter()

const rules = {
  name: { required: true, message: '请输入用户名' },
  password: { required: true, message: '请输入密码' },
  captcha: { required: true, message: '请输入验证码' }
}

// 登录表单
const formData = reactive({
  name: '',
  password: '',
  captcha: '',
  key: ''
})

// 获取验证码
const capcha = ref('')
const handlegetCaptcha = () => {
  getCaptcha().then(({ data }) => {
    formData.key = data.key
    capcha.value = data.img
  })
}
handlegetCaptcha()

// 提交表单
const { handleSubmit, form, isSubmitting } = useSubmit(() => {
  return login(formData)
    .then((res) => {
      const data = res.data.data
      userStore.$patch({ _token: data.token, userData: data.user, menus: data.menus })
      router.push('/')
    })
    .catch(() => {
      console.log(form.value)
      handlegetCaptcha()
    })
})

</script>

<template>
  <div class="login-wrapper">
    <el-row>
      <el-col :span="12" class="left-box h-100v col-box display-flex align-center justify-center position-relative">
        <transition-group enter-active-class="animate__animated animate__bounceInLeft" appear>
          <img key="logo" class="logo position-absolute" src="/images/login-logo.png" style="width: 220px" alt="">
          <div key="bg">
            <img src="/images/login-box-bg-fec91044.svg" style="width: 350px" alt="">
          </div>
        </transition-group>
        </el-col>
      <el-col :span="12" class="col-box h-100v display-flex justify-center align-center">
        <transition appear enter-active-class="animate__animated animate__bounceInRight">
          <el-form :rules="rules" ref="form" :model="formData" @submit.prevent="handleSubmit">
            <h2 class="text-align-center font-20 mb-24 font-bold">登 录</h2>
            <el-form-item prop="name" class="mb-24">
              <el-input placeholder="账号" v-model="formData.name">
                <template #prefix>
                  <el-icon class="el-input__icon"><i-ep-user /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="name" class="mb-24">
              <el-input placeholder="密码" v-model="formData.password" type="password">
                <template #prefix>
                  <el-icon class="el-input__icon"><i-ep-lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-image v-if="capcha" :src="capcha" class="cursor-pointer" @click="handlegetCaptcha"></el-image>
            </el-form-item>
            <el-form-item prop="name" class="mb-24">
              <el-input placeholder="验证码" v-model="formData.captcha">
                <template #prefix>
                  <el-icon class="el-input__icon"><i-ep-lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-button class="w-100" type="primary" native-type="submit" :loading="isSubmitting" @click="handleSubmit">登 录</el-button>
          </el-form>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.left-box {
  background-image: url('/images/bg.png');
}
.el-form {
  width: 350px;
}
.logo {
  left: 20px;
  top: 20px;
}
.el-image {
  width: 100%;
}
</style>