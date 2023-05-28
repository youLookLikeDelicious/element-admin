<script lang="ts" setup>
import { reactive, ref, nextTick } from 'vue'
import { useDialog } from '@/composition/dialog'
import { useSubmit } from '@/composition/submit'
import { ElMessage } from 'element-plus'
import { getBindAccount, saveAccount } from '@/apis/finance'
import { useCommonDict } from '@/composition/dict'
import { computed } from 'vue'

const DEFAULT_FORM = {
  p_id: '',
  d_id: '',
  account_no: '',
  bank: '',
  carder: '',
  card_id: '',
  carder_name: '',
  type: '',
  content: '',
  money_remark: '',
  money: 0.00
}

const emit = defineEmits<{
  (event: 'success'): void
}>()


// 验证规则
const rules = {
  d_id: { required: true, message: '请选择部门' },
  p_id: { required: true, message: '请选择项目' },
  account_no: { required: true, message: '请填写账户号' },
  carder: { required: true, message: '请选择持卡人', trigger: 'change' },
  type: { required: true, message: '请选择类型' },
  money: { required: true, message: '请填写余额', trigger: 'blur' }
  // bank: {}
}

// 绑定账号
const { list: cardList, loadList: loadCardList } = useCommonDict(getBindAccount)

// 处理修改类型事件
const handleChangeType = (value: number) => {
  formData.card_id = ''
  if (!value) {
    cardList.value = []
    return
  }
  loadCardList()
}

// 是否显示绑定银行卡
const showCardList = computed(() => {
  if (!paymentPickerEl.value) return false
  const currentType = paymentPickerEl.value.paymentList.find((item: dict.Payment) => item.id === +formData.type)

  return currentType && currentType.need_bind_card
})

const classifyPickerEl = ref()
const departmentPickerEl = ref()
const paymentPickerEl = ref()
const { dialogVisible, handleVisible, id } = useDialog((id, data?: any) => {
  setTimeout(() => {
    departmentPickerEl.value.loadData()
    paymentPickerEl.value.loadData()

    if (id) {
      loadCardList()
    }
    // 编辑初始化，加载一些数据
    if (data && data.d_id) {
      handleChangeDepartment(data.p_id, false)
        .then(() => {
          data.money = +data.money
          data.type = +data.type
          Object.assign(formData, data)
        })
    }
  })
  return nextTick(() => {
    form.value && form.value.clearValidate()
  })
})

// form表单
const formData = reactive({ ...DEFAULT_FORM })

const { handleSubmit, isSubmitting, form } = useSubmit(() => {
  return saveAccount(formData, id.value)
    .then(() => {
      emit('success')
      dialogVisible.value = false
      ElMessage({ message: '操作成功', type: 'success' })
    })
})

// 修改部门
// 清空classify选项 重新获取classify列表
const handleChangeDepartment = (value: number, clear = true) => {
  if (clear) {
    formData.p_id = ''
  }
  if (!value) {
    classifyPickerEl.value.classifyList = []
    return
  }

  return classifyPickerEl.value.loadData({ department_id: value })
}

// 关闭对话框
const handleClose = () => {
  classifyPickerEl.value.classifyList.value = []
  Object.assign(formData, DEFAULT_FORM)
}

defineExpose({ handleVisible, formData })
</script>

<template>
  <el-dialog v-model="dialogVisible" :close-on-click-modal="false" width="1200" :title="id ? '编辑收款账户' : '添加收款账户'" @close="handleClose">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="80px" @submit.prevent="handleSubmit">
      <el-row>
        <el-col :span="8">
          <el-form-item label="部门" prop="d_id">
            <department-picker ref="departmentPickerEl" v-model="formData.d_id" @change="(value: number) => handleChangeDepartment(value, true)"></department-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目" prop="p_id">
            <classify-picker ref="classifyPickerEl" v-model="formData.p_id"></classify-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="类型" prop="type">
            <payment-picker ref="paymentPickerEl" v-model="formData.type" @change="handleChangeType"></payment-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="showCardList">
          <el-form-item label="银行卡" prop="card_id">
            <el-select v-model="formData.card_id" placeholder="绑定银行卡" clearable class="w-100">
              <el-option v-for="card in cardList" :key="card.id" :label="card.account_no" :value="card.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="账户号" prop="account_no">
            <el-input v-model="formData.account_no" placeholder="账户号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属银行" prop="bank">
            <el-input v-model="formData.bank" placeholder="所属银行" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="持卡人" prop="carder">
            <user-picker :department-id="formData.d_id" v-model="formData.carder" v-model:userName="formData.carder_name" placeholder="持卡人"></user-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="余额" prop="money">
            <el-input-number :controls="false" v-model="formData.money" placeholder="余额" :precision="2"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="变动理由" prop="money_remark">
            <el-input v-model="formData.money_remark" clearable placeholder="余额变动理由" type="textarea" :rows="3"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="账户备注" prop="content">
            <el-input type=textarea :rows="3" placeholder="账户备注" v-model="formData.content"></el-input>
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