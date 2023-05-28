<script lang="ts" setup>
import { reactive } from 'vue'
import { useDialog } from '@/composition/dialog'
import { useSubmit } from '@/composition/submit'
import { ElMessage } from 'element-plus'
import { nextTick } from 'vue'
import { getProductInfo, saveProduct, saveUnit } from '@/apis/order'
import { useClassifyList, useUnitList, useSupplierList } from '@/composition/dict'
import axios from 'axios'
import AvatarUpload from '@/components/avatar/upload.vue'

const emit = defineEmits<{
  (event: 'success'): void
}>()

const DEFAULT_FORM_DATA = {
  title: '',
  classify_id: '',
  price: undefined,
  cost: undefined,
  numstr: undefined,
  unit: '',
  code: '',
  status: 0,
  supplier_id: '',
  description: '',
  minprice: undefined,
  image: ''
}
// 所属项目
const { classifyList, loadClassifyList } = useClassifyList()
// 单位
const { unitList, loadUnitList } = useUnitList()
// 供应商
const { supplierList, loadSupplierList } = useSupplierList()

// 验证规则
const rules = {
  classify_id: { required: true, message: '请选择所属项目' },
  title: { required: true, message: '请输入商品标题' },
  price: { required: true, message: '请填写商品价格', trigger: 'blur' },
  cost: { required: true, message: '请填写进价成本', trigger: 'blur' },
  minprice: { required: true, message: '请填写最低价格', trigger: 'blur' },
  numstr: { required: true, message: '请填写库存', trigger: 'blur' },
  code: { required: true, message: '请填写商品编号', trigger: 'blur' },
  supplier_id: { required: true, message: '请选择供应商', trigger: 'blur' },
}

const { dialogVisible, handleVisible, id } = useDialog((id?: number) => {
  return nextTick(() => {
    form.value && form.value.clearValidate()
    axios.all([loadClassifyList(), loadUnitList(), loadSupplierList()])
    id && getProductInfo(id)
      .then(res => {
        const data = res.data.data
        data.image = data.image_url
        delete data.id
        delete data.image_url
        Object.assign(formData, data)
      })
  })
})

// form表单
const formData = reactive({ ...DEFAULT_FORM_DATA })

const { handleSubmit, isSubmitting, form } = useSubmit(() => {
  return saveProduct(formData, id.value)
    .then(() => {
      emit('success')
      dialogVisible.value = false
      ElMessage({ message: '操作成功', type: 'success' })
    })
})

const handleClose = () => {
  Object.assign(formData, { ...DEFAULT_FORM_DATA })
}
defineExpose({ handleVisible, formData })
</script>

<template>
  <el-dialog v-model="dialogVisible" :close-on-click-modal="false" width="1200" :title="id ? '编辑商品' : '添加商品'" @close="handleClose">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="80px" @submit.prevent="handleSubmit">
      <el-row>
        <el-col :span="8">
          <el-form-item label="所属项目" prop="classify_id">
            <el-select v-model="formData.classify_id" placeholder="所属项目" class="w-100" clearable>
              <el-option v-for="classify in classifyList" :key="classify.id" :value="classify.id" :label="classify.title"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品标题" prop="title">
            <el-input placeholder="商品标题" v-model="formData.title" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品价格" prop="price">
            <el-input-number v-model="formData.price" placeholder="商品价格" :controls="false" :precision="2" type="textarea"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="成本进价" prop="cost">
            <el-input-number v-model="formData.cost" placeholder="商品价格" :controls="false" :precision="2" type="textarea"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="最低价格" prop="minprice">
            <el-input-number v-model="formData.minprice" placeholder="商品价格" :controls="false" :precision="2" type="textarea"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="库存" prop="cost">
            <el-input-number v-model="formData.numstr" placeholder="库存" :controls="false" :precision="0" type="textarea"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="规格单位" prop="unit">
            <el-select v-model="formData.unit" placeholder="规格单位" clearable class="w-100">
              <el-option v-for="unit in unitList" :key="unit.id" :value="unit.id" :label="unit.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品编号" prop="code">
            <el-input placeholder="商品编号" v-model="formData.code" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">下架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商" prop="supplier_id">
            <el-select v-model="formData.supplier_id" placeholder="供应商" clearable class="w-100">
              <el-option v-for="supplier in supplierList" :key="supplier.id" :value="supplier.id" :label="supplier.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="商品图片" prop="image">
            <avatar-upload v-model="formData.image"></avatar-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="描述" prop="description">
            <el-input v-model="formData.description" placeholder="描述" type="textarea" :rows="3"></el-input>
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