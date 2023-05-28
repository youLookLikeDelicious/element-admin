<script lang="ts" setup>
import { reactive } from 'vue'
import { useDialog } from '@/composition/dialog'
import { useSubmit } from '@/composition/submit'
import { ElMessage } from 'element-plus'
import { saveSupplier } from '@/apis/order'
import { nextTick } from 'vue'
import { useClassifyList } from '@/composition/dict'

const emit = defineEmits<{
  (event: 'success'): void
}>()

// 所属分类
const {classifyList, loadClassifyList} = useClassifyList()

// 验证规则
const rules = {
  classify_id: { required: true, message: '请选择所属分类' },
  name: { required: true, message: '请输入供应商名称', trigger: 'blur' },
  phone: { required: true, message: '请输入供应商电话' },
}

const { dialogVisible, handleVisible, id } = useDialog(() => {
  return nextTick(() => {
    loadClassifyList()
    form.value && form.value.clearValidate()
  })
})

// form表单
interface FormData {
  classify_id: '',
  name: '',
  phone: '',
  pay_type: 0,
  description: ''
}

const formData = reactive<FormData>({
  classify_id: '',
  name: '',
  phone: '',
  pay_type: 0,
  description: ''
})

const { handleSubmit, isSubmitting, form } = useSubmit(() => {
  return saveSupplier(formData, id.value)
    .then(() => {
      emit('success')
      dialogVisible.value = false
      ElMessage({ message: '操作成功', type: 'success' })
    })
})

const handleClose = () => {
  Object.assign(formData, {
    classify_id: '',
    name: '',
    phone: '',
    pay_type: 0,
    description: ''
  })
}
defineExpose({ handleVisible, formData })
</script>

<template>
  <el-dialog v-model="dialogVisible" :close-on-click-modal="false" width="520" :title="id ? '编辑供应商' : '添加供应商'" @close="handleClose">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px"  @submit.prevent="handleSubmit">
      <el-row>
        <el-col>
          <el-form-item label="所属分类" prop="classify_id">
            <el-select v-model="formData.classify_id" clearable placeholder="所属分类" class="w-100">
              <el-option v-for="classify in classifyList" :key="classify.id" :value="classify.id" :label="classify.title"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="供应商名称" prop="name">
            <el-input v-model="formData.name" clearable placeholder="供应商名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="供应商电话" prop="phone">
            <el-input v-model="formData.phone" clearable placeholder="供应商电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="结款方式" prop="pay_type">
            <el-radio-group v-model="formData.pay_type">
              <el-radio :label="0">月结</el-radio>
              <el-radio :label="1">现结</el-radio>
            </el-radio-group>
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