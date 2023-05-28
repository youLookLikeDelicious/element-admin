<script lang="ts" setup>
import { reactive } from 'vue'
import { useDialog } from '@/composition/dialog'
import { useSubmit } from '@/composition/submit'
import { saveContact } from '@/apis/customer'
import { ElMessage } from 'element-plus'
import { nextTick } from 'vue'
import { explodeAddress } from '@/apis'
import { ref } from 'vue'

const emit = defineEmits<{
  (event: 'success'): void
}>()

defineProps<{
  customerName?: string
}>()

const DEFAULT_FORM = {
  name: '',
  mobile: '',
  sex: 0,
  wechat: '',
  qq: '',
  cid: '',
  email: '',
  address: '',
  nickname: '',
  department: '',
  position: ''
}
// 验证规则
const rules = {
  name: { required: true, message: '请输入姓名' },
  mobile: { required: true, message: '请输入联系电话' },
  sex: { required: true, message: '请选择性别' },
  address_arr: { required: true, message: '请选择地址' }
}

const { dialogVisible, handleVisible, id } = useDialog(() => {
  return nextTick(() => {
    form.value && form.value.clearValidate()
  })
})

// form表单
const formData = reactive<typeof DEFAULT_FORM & { address_arr: any[], customer?: Record<string, any> }>({ ...DEFAULT_FORM, address_arr: [] })

const { handleSubmit, isSubmitting, form } = useSubmit(() => {
  return saveContact(formData, id.value)
    .then(() => {
      emit('success')
      dialogVisible.value = false
      ElMessage({ message: '操作成功', type: 'success' })
    })
})

const handleClose = () => {
  formData.name = ''
}

const addressStr = ref('')
const handleExplode = () => {
  if (!addressStr.value) return
  explodeAddress(addressStr.value)
    .then(res => {
      const data = res.data.data
      formData.address_arr = [data.province, data.city, data.area]
      if (!data.area) {
        formData.address_arr.pop()
      }

      formData.address = data.addressdetail
      formData.name = data.name
      formData.mobile = data.tel
    })
}

defineExpose({ handleVisible, formData })
</script>

<template>
  <el-dialog v-model="dialogVisible" :close-on-click-modal="false" width="1200" :title="id ? '编辑收获人地址' : '编辑收获人地址'" @close="handleClose">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px" @submit.prevent="handleSubmit">
      <el-row>
          <el-col :span="20">
            <el-form-item label="智能识别">
              <el-input v-model="addressStr" placeholder="如：山东省青岛市市北区敦化路诺德广场，张三，13800138000"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="handleExplode">识别地址</el-button>
          </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="客户名称">
            {{ customerName || formData?.customer?.name }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="姓名" prop="name">
            <el-input placeholder="姓名" v-model="formData.name" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话" prop="mobile">
            <el-input placeholder="联系电话" v-model="formData.mobile" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="formData.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="微信号" prop="wechat">
            <el-input placeholder="微信号" v-model="formData.wechat" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="QQ号码" prop="qq">
            <el-input placeholder="QQ号码" v-model="formData.qq" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="地址" prop="address_arr">
            <el-cascader v-model="formData.address_arr" placeholder="地址" clearable :options="$cityList.value" :props="{ expandTrigger: 'hover', label: 'name', value: 'id' }" class="w-100"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电子邮箱" prop="email">
            <el-input placeholder="电子邮箱" v-model="formData.email" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="称谓" prop="nickname">
            <el-input placeholder="称谓" v-model="formData.nickname" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="部门" prop="department">
            <el-input placeholder="部门" v-model="formData.department" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="职位" prop="position">
            <el-input placeholder="职位" v-model="formData.position" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="详细地址" prop="address">
            <el-input type="textarea" v-model="formData.address" placeholder="详细地址" :rows="3"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
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