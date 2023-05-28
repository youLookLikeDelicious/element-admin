<script lang="ts" setup>
import { reactive } from 'vue'
import { useDialog } from '@/composition/dialog'
import { useSubmit } from '@/composition/submit'
import { getCustomerInfo, saveCustomer } from '@/apis/customer'
import { useCustomerSource, useWechatList, useCustomerGrade } from '@/composition/dict'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const emit = defineEmits<{
  (event: 'success'): void
}>()

const DEFAULT_DATA = {
  name: '',
  source_id: undefined,
  belong_wechat: undefined,
  grade_id: undefined,
  industry_id: undefined,
  wechat: '',
  status: '',
  content: ''
}

// 验证规则
const rules = {
  name: { required: true, message: '请输入客户名称' },
  source_id: { required: true, message: '请选择客户来源' },
  belong_wechat: { required: true, message: '请选择绑定微信' },
  grade_id: { required: true, message: '请选择客户等级' },
  wechat: { required: true, message: '请输入客户微信' },
  status: { required: true, message: '请选择客户状态' }
}

const { dialogVisible, handleVisible, id } = useDialog((id?: number) => {
  if (form.value) {
    form.value.clearValidate()
  }
  if (id) {
    getCustomerInfo(id)
      .then(res => {
        const data = res.data.data.customer
        data.belong_wechat = parseInt(data.belong_wechat)
        formData.name = data.name
        formData.source_id = data.source_id
        formData.belong_wechat = data.belong_wechat
        formData.grade_id = data.grade_id || ''
        formData.industry_id = data.industry_id || ''
        formData.wechat = data.wechat
        formData.status = data.status || ''
        formData.content = data.content
      })
  }
  return axios.all([loadSourceList(), loadWechatList(), loadCustomerGrade()])
})

// form表单
const formData = reactive<typeof DEFAULT_DATA & { products: { id: number | string, num?: number, price: string }[], address: number[] }>({ ...DEFAULT_DATA, products: [], address: [] })

// 获取客户来源
const { sourceList, loadSourceList } = useCustomerSource()
// 微信列表
const { wechatList, loadWechatList } = useWechatList()
// 客户等级
const { customerGradeList, loadCustomerGrade } = useCustomerGrade()


// 提交表单
const { handleSubmit, isSubmitting, form } = useSubmit(() => {
  return saveCustomer(formData, id.value)
    .then(() => {
      emit('success')
      dialogVisible.value = false
      ElMessage({ message: '操作成功', type: 'success' })
      return true
    })
})

const handleClose = () => {
  Object.assign(formData, { ...DEFAULT_DATA, products: [] })
}

defineExpose({ handleVisible, formData })
</script>

<template>
  <el-dialog v-model="dialogVisible" :close-on-click-modal="false" width="1200" :title="id ? '编辑客户' : '添加客户'" @close="handleClose">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px" @submit.prevent="handleSubmit">
      <el-card header="基本信息" shadow="never">
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户名称" prop="name">
              <el-input placeholder="客户名称" v-model="formData.name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户来源" prop="source_id">
              <el-select v-model="formData.source_id" placeholder="客户来源" class="w-100">
                <el-option v-for="source in sourceList" :key="source.id" :value="source.id" :label="source.title"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户等级" prop="grade_id">
              <el-select v-model="formData.grade_id" clearable placeholder="客户等级" class="w-100">
                <el-option v-for="grade in customerGradeList" :key="grade.id" :value="grade.id" :label="grade.title"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户微信" prop="wechat">
              <el-input v-model="formData.wechat" clearable placeholder="客户微信"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户状态" prop="status">
              <el-select v-model="formData.status" placeholder="客户状态" clearable class="w-100">
                <el-option :value="1" label="新进客户"></el-option>
                <el-option :value="2" label="跟进客户"></el-option>
                <el-option :value="3" label="正式客户"></el-option>
                <el-option :value="4" label="流失客户"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属行业" prop="industry_id">
              <el-select v-model="formData.industry_id" clearable placeholder="所属行业" class="w-100">
                <el-option v-for="industry in $industryList.value" :key="industry.id" :value="industry.id" :label="industry.title"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="绑定微信" prop="belong_wechat">
              <el-select v-model="formData.belong_wechat" placeholder="绑定微信" clearable>
                <el-option v-for="wechat in wechatList" :key="wechat.id" :label="wechat.wechat" :value="wechat.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>          
        <el-row>
          <el-col>
            <el-form-item label="客户介绍" prop="content">
              <el-input v-model="formData.content" type="textarea" :rows="3" placeholder="客户介绍"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <input type="submit" hidden>
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