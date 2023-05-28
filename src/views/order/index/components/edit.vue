<script lang="ts" setup>
import { reactive } from 'vue'
import { useDialog } from '@/composition/dialog'
import { useSubmit } from '@/composition/submit'
import { useClassifyList, usePayment, useWaybillList } from '@/composition/dict'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { ref } from 'vue'
import { getCustomerContacts } from '@/apis'
import { getAllProduct } from '@/apis/product'
import { getOrderInfo, saveOrder } from '@/apis/order'
import addContact from './add-contact.vue'

const emit = defineEmits<{
  (event: 'success'): void
}>()

const DEFAULT_DATA = {
  name: '',
  grade_id: undefined,
  industry_id: undefined,
  goods_names: '',
  pay_id: '',
  payable_price: undefined,
  pay_price: undefined,
  delivery_type: 0,
  order_type: 0,
  order_class: 0,
  waybill_class: '',
  waybill_no: '',
  other_pay_id: '',
  place_time: Date.now(),
  other_price: undefined,
  remark: '',
  project_id: '',
  c_id: 0,
  contact_id: ''
}

// 验证规则
const rules = {
  name: { required: true, message: '请输入客户名称' },
  project_id: { required: true, message: '请选择所属项目' },
  grade_id: { required: true, message: '请选择客户等级' },
  pay_id: { required: true, message: '请选择收款账户' },
  payable_price: { required: true, message: '请输入订单总价' },
  place_time: { required: true, message: '请选择下单日期' },
  pay_price: { required: true, message: '请输入已付金额' },
}

const { dialogVisible, id, handleVisible } = useDialog((id) => {
  axios.all([loadClassifyList(), loadPaymentList(), loadWayBillList()])
  if (form.value) {
    form.value.clearValidate()
  }
  
  if (!id) {
    return Promise.resolve()
  }
  return getOrderInfo(id)
    .then(res => {
      const data = res.data.data
      
      Object.assign(formData, {
        c_id: data.c_id,
        project_id: data.project_id,
        delivery_type: data.delivery_type,
        order_type: data.order_type,
        order_class: data.order_class,
        waybill_class: data.waybill_class,
        waybill_no: data.waybill_no,
        pay_id: data.pay_id,
        other_pay_id: +data.other_pay_id || '',
        other_price: parseFloat(data.other_price),
        place_time: data.place_time * 1000,
        remark: data.remark,
        pay_price: +data.pay_price,
        contact_id: data.contact_id,
        payable_price: parseFloat(data.payable_price),
        products: data.product.map((item: Record<string, any>) => ({ id: parseInt(item.product_id), price: item.price, num: +item.num }))
      })
      customerName.value = data.customer.name
      loadContactList()
      handleLoadProduct(false)
    })
})
const customerName = ref('')


// form表单
const formData = reactive<typeof DEFAULT_DATA & { products: { id: number | string, num?: number, price: string }[], payable_price?: number }>({ ...DEFAULT_DATA, products: [] })

// 所属项目
const { classifyList, loadClassifyList } = useClassifyList()

// 支付方式
const { paymentList, loadPaymentList } = usePayment()
// 快递公司
const { wayBillList, loadWayBillList } = useWaybillList()

// 根据所属项目-获取所有商品
const productList = ref<{ id: number, title: string, price_text: string }[]>([])
const handleLoadProduct = (clear = true) => {
  if (clear) {
    formData.products = []
  }

  if (!formData.project_id) {
    productList.value = []
    return
  }
  getAllProduct({ classify_id: formData.project_id })
    .then(res => {
      productList.value = res.data.data
    })
}

// 追加商品
const DEFAULT_PRODUCT = {
  id: '',
  price: '',
  num: undefined
}
const handleAppendProduct = () => {
  if (!formData.project_id) {
    ElMessage({ type: 'warning', message: '请选择所属项目' })
    return
  }
  formData.products.push({ ...DEFAULT_PRODUCT })
}

// 处理选择商品事件,禁止重复选择
const handleChangeProduct = (value: number, $index: number) => {
  formData.products[$index].price = ''
  if (!value) {
    return
  }
  if (formData.products.some((item: any, index) => item.id === value && $index !== index)) {
    ElMessage({ message: '不能选择重复的商品', type: 'error' })
    formData.products[$index].id = ''
    return
  }

  const product = productList.value.find(item => item.id === value)
  if (product) {
    formData.products[$index].price = product.price_text
  }
}

// 客户联系人
// eslint-disable-next-line no-undef
const contactList = ref<dict.Contact[]>([])
const loadContactList = () => {
  if (!formData.c_id) return
  getCustomerContacts(formData.c_id)
    .then(res => {
      contactList.value = res.data.data
    })
}

// 提交表单
const { handleSubmit, isSubmitting, form } = useSubmit(() => {
  if (!formData.products.length) {
    ElMessage({ message: '请添加商品', type: 'warning' })
    return Promise.resolve()
  }
  
  return saveOrder(formData, id.value)
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

// 
const addContactEl = ref()
const handleAddContact = () => {
  addContactEl.value.handleVisible()
  addContactEl.value.formData.cid = formData.c_id
}
defineExpose({ handleVisible, formData, loadContactList })
</script>

<template>
  <el-dialog v-model="dialogVisible" :close-on-click-modal="false" width="1200" :title="id ? '编辑订单' : '添加订单'" @close="handleClose">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px" @submit.prevent="handleSubmit">
      <el-card header="订单信息" shadow="never" class="mt-12">
        <template #header>
          <el-row class="justify-between align-center">
            <span>订单信息</span>
            <el-button size="small" type="primary" @click="handleAppendProduct"><i-ep-Plus></i-ep-Plus>&nbsp;添加商品</el-button>
          </el-row>
        </template>
        <el-row v-if="formData.products.length" class="mb-12">
          <el-table :data="formData.products">
            <el-table-column label="商品名称" align="center">
              <template v-slot="{ $index, row }">
                <el-form-item :show-message="false" required :prop="`products.${$index}.id`" style="margin-bottom: 0">
                  <el-select v-model="row.id" clearable filterable @change="(value: number) => handleChangeProduct(value, $index)" size="small" placeholder="商品">
                    <el-option v-for="product in productList" :key="product.id" :value="product.id" :label="product.title"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="商品单价" align="center" prop="price"></el-table-column>
            <el-table-column label="商品数量" align="center">
              <template v-slot="{ row }">
                <el-form-item :show-message="false" style="margin-bottom: 0">
                  <el-input-number v-model="row.num" placeholder="商品数量" size="small" :controls="false"></el-input-number>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template v-slot="{ $index }">
                <el-button size="small" type="danger" plain @click="formData.products.splice($index, 1)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="所属项目" prop="project_id">
              <el-select v-model="formData.project_id" placeholder="所属项目" clearable class="w-100" @change="handleLoadProduct(true)">
                <el-option v-for="classify in classifyList" :key="classify.id" :value="classify.id" :label="classify.title"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收款账户" prop="pay_id">
              <el-select v-model="formData.pay_id" placeholder="收款账户" clearable class="w-100">
                <el-option v-for="payment in paymentList" :key="payment.id" :value="payment.id" :label="payment.payment"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单总价" prop="payable_price">
              <el-input-number v-model="formData.payable_price" placeholder="订单总价" :precision="2" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="已付金额" prop="pay_price">
              <el-input-number v-model="formData.pay_price" placeholder="已付金额" :precision="2" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发货方式" prop="delivery_type">
              <el-radio-group v-model="formData.delivery_type">
                <el-radio :label="0">正常快递</el-radio>
                <el-radio :label="1">代收货款</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单类型" prop="order_type">
              <el-radio-group v-model="formData.order_type">
                <el-radio :label="0">正常订单</el-radio>
                <el-radio :label="1">预订/预售</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单分类" prop="order_class">
              <el-radio-group v-model="formData.order_class">
                <el-radio :label="0">零售订单</el-radio>
                <el-radio :label="1">代理订单</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="快递公司" prop="waybill_class">
              <el-select v-model="formData.waybill_class" placeholder="快递公司" clearable class="w-100">
                <el-option v-for="waybill in wayBillList" :key="waybill.id" :value="waybill.id" :label="waybill.waybill_name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="快递单号" prop="waybill_no">
              <el-input v-model="formData.waybill_no" placeholder="快递单号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="其他收入" prop="other_pay_id">
              <el-select v-model="formData.other_pay_id" placeholder="其他收入" clearable class="w-100">
                <el-option label="拼多多" :value="1"></el-option>
                <el-option label="红包" :value="2"></el-option>
                <el-option label="其他" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="金额" prop="other_price">
              <el-input-number v-model="formData.other_price" placeholder="金额" :precision="2" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下单日期" prop="place_time">
              <el-date-picker v-model="formData.place_time" formate="YYYY-MM-DD" placeholder="下单日期" clearable value-format="x" class="w-100"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="mr-12">
            <el-form-item label="收件人" prop="contact_id">
              <el-select v-model="formData.contact_id" placeholder="收件人" clearable class="w-100">
                <el-option v-for="contact in contactList" :key="contact.id" :value="contact.id" :label="contact.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="margin-top: 3px">
            <el-button type="primary" size="small" @click="handleAddContact"><i-ep-Plus></i-ep-Plus>&nbsp; 新增收货人地址</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="订单描述" prop="remark">
              <el-input type="textarea" v-model="formData.remark" placeholder="订单描述" :rows="3"></el-input>
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
  <add-contact ref="addContactEl" @success="loadContactList" :customer-name="customerName"></add-contact>
</template>

<style lang="scss">
</style>