<script lang="ts" setup>
import { reactive } from 'vue'
import { updateProfile } from '@/apis/user'
import { useSubmit } from '@/composition/submit'
import { useUserStore } from '@/stores/modules/user'
import UploadAvatar from '@/components/avatar/upload.vue'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()

const formData = reactive({
  sex: userStore.userData.sex,
  desc: userStore.userData.desc,
  thumb: userStore.thumb
})

const rules = {
  thumb: { required: true, message: '请上传头像' },
  sex: { required: true, message: '请选择性别' }
}

const { handleSubmit, isSubmitting, form } = useSubmit(() => {
  return updateProfile(formData)
    .then(() => {
      userStore.userData.sex = formData.sex
      userStore.userData.desc = formData.desc
      userStore.userData.thumb = formData.thumb
      ElMessage({ message: '操作成功', type: 'success' })
    })
})

</script>

<template>
  <div>
    <el-card header="修改个人信息" shadow="never">
      <el-form ref="form" :model="formData" :rules="rules" @submit.native.prevent="handleSubmit" label-width="120">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              {{ userStore.username }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="username">
              {{ userStore.name }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="头像" prop="thumb">
              <upload-avatar v-model="formData.thumb"></upload-avatar>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="mobile">
              {{ userStore.mobile }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="formData.sex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="">
              {{ userStore.department?.title }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位职称" prop="">
              {{ userStore.position?.title }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="员工类型" prop="">
              {{ userStore.type_text }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职日期" prop="">
              {{ userStore.entry_time }}
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="个人简介" prop="">
              <el-input type="textarea" v-model="formData.desc" :rows="3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="end">
          <el-button type="primary" native-type="submit" :loading="isSubmitting"><i-ep-Finished v-if="!isSubmitting" class="mr-12" @click="handleSubmit" /> 提 交</el-button>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>

</style>