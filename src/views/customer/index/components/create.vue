<script lang="ts" setup>
import axios from 'axios'
import { reactive } from 'vue'
import { explodeAddress } from '@/apis'
import { ElMessage } from 'element-plus'
import { saveCustomer } from '@/apis/customer'
import { getAllProduct } from '@/apis/product'
import { useDialog } from '@/composition/dialog'
import { useSubmit } from '@/composition/submit'
import { useUserStore } from '@/stores/modules/user'
import { ref } from 'vue'
import { useCustomerSource, useClassifyList, useWechatList, useCustomerGrade, usePayment, useWaybillList, useCustomerList, useAccountList } from '@/composition/dict'


const emit = defineEmits<{
  (event: 'success'): void
}>()

const DEFAULT_DATA = {
  name: '',
  source_id: undefined,
  product_id: undefined,
  belong_wechat: undefined,
  grade_id: undefined,
  industry_id: undefined,
  wechat: '',
  is_referral: 0,
  content: '',
  c_name: '',
  c_mobile: '',
  c_address: '',
  remark: '',
  goods_names: '',
  o_goods_id: '',
  o_pay_id: '',
  o_payable_price: undefined,
  o_pay_price: undefined,
  o_delivery_type: 0,
  o_order_type: 0,
  o_order_class: 0,
  o_waybill_class: '',
  o_waybill_no: '',
  o_other_pay_id: '',
  o_place_time: Date.now(),
  o_other_price: undefined,
  o_remark: '',
  referral_id: '',
  recipient_account_id: '',
  status: '',
}

// 验证规则
const rules = {
  name: { required: true, message: '请输入客户名称' },
  source_id: { required: true, message: '请选择客户来源' },
  product_id: { required: true, message: '请选择所属项目' },
  belong_wechat: { required: true, message: '请选择绑定微信' },
  grade_id: { required: true, message: '请选择客户等级' },
  wechat: { required: true, message: '请输入客户微信' },
  c_name: { required: true, message: '请输入收货人' },
  c_mobile: { required: true, message: '请输入收货人联系电话' },
  address: { required: true, message: '请选择收货地址' },
  o_pay_id: { required: true, message: '请选择收款账户' },
  o_payable_price: { required: true, message: '请输入订单总价' },
  o_place_time: { required: true, message: '请选择下单日期' },
  o_pay_price: { required: true, message: '请输入已付金额' },
  referral_id: { required: true, message: '请选择源客户' },
  recipient_account_id: { required: true, message: '请选择收款账户' },
  status: { required: true, message: '请选择客户状态' }
}

const { dialogVisible, handleVisible, id } = useDialog(() => {
  axios.all([loadSourceList(), loadClassifyList(), loadWechatList(), loadCustomerGrade(), loadPaymentList(), loadWayBillList(), loadCustomerList()])
  if (form.value) {
    form.value.clearValidate()
  }
})

// form表单
const formData = reactive<typeof DEFAULT_DATA & { products: { id: number | string, num?: number, price: string }[], address: number[] }>({ ...DEFAULT_DATA, products: [], address: [] })

// 客户列表
const { customerList, loadCustomerList } = useCustomerList()
// 获取客户来源
const { sourceList, loadSourceList } = useCustomerSource()
// 所属项目
const { classifyList, loadClassifyList } = useClassifyList()
// 微信列表
const { wechatList, loadWechatList } = useWechatList()
// 客户等级
const { customerGradeList, loadCustomerGrade } = useCustomerGrade()

// 支付方式
const { paymentList, loadPaymentList } = usePayment()
// 快递公司
const { wayBillList, loadWayBillList } = useWaybillList()

// 搜索客户
const handleLoadCustomerList = (keywords: string) => {
  loadCustomerList({ keywords })
}

// 收款账户
const { accountList, loadAccountList } = useAccountList()


// 根据所属项目-获取所有商品
const productList = ref<{ id: number, title: string, price_text: string }[]>([])
const handleLoadProduct = () => {
  formData.products = []

  if (!formData.product_id) {
    return
  }
  getAllProduct({ classify_id: formData.product_id })
    .then(res => {
      productList.value = res.data.data
    })
}

// 自动识别收货人地址信息
const addressStr = ref('')
const handleExplode = () => {
  if (!addressStr.value) return
  explodeAddress(addressStr.value)
    .then(res => {
      const data = res.data.data
      formData.address = [data.province, data.city, data.area]
      if (!data.area) {
        formData.address.pop()
      }

      formData.c_address = data.addressdetail
      formData.c_name = data.name
      formData.c_mobile = data.tel
    })
}

// 追加商品
const DEFAULT_PRODUCT = {
  id: '',
  price: '',
  num: undefined
}
const handleAppendProduct = () => {
  if (!formData.product_id) {
    ElMessage({ message: '请选择所属项目', type: 'error' })
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

// 修改付款方式，重新获取收款账户
const showRecipient = ref(false)
const handleChangePayment = (paymentId: number) => {
  showRecipient.value = false
  formData.recipient_account_id = ''
  accountList.value = []


  const payment = paymentList.value.find(item => item.id === paymentId)

  if (!paymentId || !payment || payment.need_bind_card === 2) return

  showRecipient.value = true
  loadAccountList({ type: paymentId })
}


// 提交表单
const { handleSubmit, isSubmitting, form } = useSubmit(() => {
  if (!formData.products.length) {
    ElMessage({ message: '请添加商品', type: 'warning' })
    return Promise.resolve()
  }
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
const userStore = useUserStore()
console.log(userStore)
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
            <el-form-item label="所属项目" prop="product_id">
              <el-select v-model="formData.product_id" placeholder="所属项目" @change="handleLoadProduct" class="w-100">
                <el-option v-for="classify in classifyList" :key="classify.id" :value="classify.id" :label="classify.title"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="归属员工">
              {{ userStore.name }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="归属部门">
              {{ userStore.department?.title }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="绑定微信" prop="belong_wechat">
              <el-select v-model="formData.belong_wechat" placeholder="绑定微信" clearable class="w-100">
                <el-option v-for="wechat in wechatList" :key="wechat.id" :label="wechat.wechat" :value="wechat.id"></el-option>
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
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否转介客户" prop="is_referral">
              <el-radio-group v-model="formData.is_referral">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="formData.is_referral === 1" :span="8">
            <el-form-item label="源客户" prop="referral_id">
              <el-select v-model="formData.referral_id" placeholder="源客户" filterable class="w-100" :remote-method="handleLoadCustomerList" remote clearable>
                <el-option v-for="customer in customerList" :key="customer.id" :label="customer.name" :value="customer.id"></el-option>
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
      <el-card header="首要收货人地址信息" shadow="never" class="mt-12">
        <el-row>
          <el-col :span="20">
            <el-form-item label="智能识别">
              <el-input v-model="addressStr" placeholder="如: 山东省青岛市市北区敦化路诺德广场,张三,13800138000"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="handleExplode">识别地址</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="收货人">
              <el-input placeholder="收货人姓名" v-model="formData.c_name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话">
              <el-input placeholder="联系电话" v-model="formData.c_mobile" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地址" prop="address">
              <el-cascader v-model="formData.address" placeholder="地址" clearable :options="$cityList.value" :props="{ expandTrigger: 'hover', label: 'name', value: 'id' }"></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="详细地址" prop="c_address">
              <el-input type="textarea" v-model="formData.c_address" placeholder="详细地址" :rows="3"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="备注信息" prop="remark">
              <el-input type="textarea" v-model="formData.remark" placeholder="备注信息" :rows="3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-card header="订单信息" shadow="never" class="mt-12">
        <template #header>
          <el-row class="justify-between align-center">
            <span>订单信息</span>
            <el-button szie="small" type="primary" @click="handleAppendProduct"><i-ep-Plus></i-ep-Plus>&nbsp;添加商品</el-button>
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
              <template v-slot="{ row, $index }">
                <el-form-item :show-message="false" required :prop="`products.${$index}.num`" style="margin-bottom: 0">
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
            <el-form-item label="订单总价" prop="o_payable_price">
              <el-input-number v-model="formData.o_payable_price" placeholder="订单总价" :precision="2" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="已付金额" prop="o_pay_price">
              <el-input-number v-model="formData.o_pay_price" placeholder="已付金额" :precision="2" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="付款方式" prop="o_pay_id">
              <el-select v-model="formData.o_pay_id" placeholder="付款方式" clearable class="w-100" @change="handleChangePayment">
                <el-option v-for="payment in paymentList" :key="payment.id" :value="payment.id" :label="payment.payment"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="showRecipient">
            <el-form-item label="收款账户" prop="recipient_account_id">
              <el-select v-model="formData.recipient_account_id" placeholder="收款账户" clearable class="w-100">
                <el-option v-for="account in accountList" :key="account.id" :value="account.id" :label="`${account.account_no} (${account.carderUser.name})`">
                  <div class="display-flex justify-between">
                    <span>{{ account.account_no }}</span>
                    <span class="color-gray">{{ account.carderUser.name }}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发货方式" prop="o_delivery_type">
              <el-radio-group v-model="formData.o_delivery_type">
                <el-radio :label="0">正常快递</el-radio>
                <el-radio :label="1">代收货款</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单类型" prop="o_order_type">
              <el-radio-group v-model="formData.o_order_type">
                <el-radio :label="0">正常订单</el-radio>
                <el-radio :label="1">预订/预售</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单分类" prop="o_order_class">
              <el-radio-group v-model="formData.o_order_class">
                <el-radio :label="0">零售订单</el-radio>
                <el-radio :label="1">代理订单</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="快递公司" prop="o_waybill_class">
              <el-select v-model="formData.o_waybill_class" placeholder="快递公司" clearable class="w-100">
                <el-option v-for="waybill in wayBillList" :key="waybill.id" :value="waybill.id" :label="waybill.waybill_name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="快递单号" prop="o_waybill_no">
              <el-input v-model="formData.o_waybill_no" placeholder="快递单号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下单日期" prop="o_place_time">
              <el-date-picker v-model="formData.o_place_time" formate="YYYY-MM-DD" placeholder="下单日期" clearable value-format="x" class="w-100"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="其他收入" prop="o_other_pay_id">
              <el-select v-model="formData.o_other_pay_id" placeholder="其他收入" clearable class="w-100">
                <el-option label="拼多多" :value="1"></el-option>
                <el-option label="红包" :value="2"></el-option>
                <el-option label="其他" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="金额" prop="o_other_price">
              <el-input-number v-model="formData.o_other_price" placeholder="金额" :precision="2" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="订单描述" prop="o_remark">
              <el-input type="textarea" v-model="formData.o_remark" placeholder="订单描述" :rows="3"></el-input>
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