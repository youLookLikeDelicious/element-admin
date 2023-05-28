<script lang="ts" setup>
import { assignCustomer } from '@/apis/customer'
import { getAllUser } from '@/apis/user'
import { useDialog } from '@/composition/dialog'
import { useCommonDict, useWechatList } from '@/composition/dict'
import { useSubmit } from '@/composition/submit'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const emit = defineEmits<{
  (event: 'success'): void
}>()

const DEFAULT_FORM = {
  second_belong_did: '',
  second_belong_uid: '',
  second_belong_wechat: ''
}

// 微信列表
const { wechatList, loadWechatList } = useWechatList()
// 用户列表
// eslint-disable-next-line no-undef
const { list: userList, loadList: loadUserList } = useCommonDict<dict.User>(getAllUser)

// 打开对话框
const departmentPickerEl = ref()
const { handleVisible, dialogVisible } = useDialog(() => {
  setTimeout(() => {
    departmentPickerEl.value.loadData()
  })
})

const formData = ref({...DEFAULT_FORM})

const rules = {
  second_belong_did: { required: true, message: '请选择所属部门' },
  second_belong_uid: { required: true, message: '请选择所属员工' },
  second_belong_wechat: { required: true, message: '请选择所属微信' }
}

// 修改部门，重新获取用户列表，并清空微信列表
const handleDepartmentChange = (department_id: number | string) => {
  wechatList.value = []
  formData.value.second_belong_did = ''
  formData.value.second_belong_uid = ''
  userList.value = []

  if (department_id) {
    loadUserList({ department_id })
  }
}

// 修改员工，重新获取微信列表
const handleChangeUser = (user_id: number | string) => {
  formData.value.second_belong_wechat = ''
  if (!user_id) {
    wechatList.value = []
    return
  }
  loadWechatList({ user_id })
}

const { handleSubmit, form, isSubmitting } = useSubmit(() => {
  form.value.validate()
    .then(() => {
      assignCustomer(formData.value)
        .then(() => {
          ElMessage({ message: '操作成功', type: 'success' })
          handleClose()
          emit('success')
        })
    })
})

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
  formData.value = { ...DEFAULT_FORM }
  wechatList.value = []
}

defineExpose({ handleVisible })
</script>

<template>
  <el-dialog v-model="dialogVisible" title="分配客户" width="520">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="80">
      <el-row>
        <el-col>
          <el-form-item label="部门" prop="second_belong_did">
            <department-picker ref="departmentPickerEl" :parent-department="$departmentId" v-model="formData.second_belong_did" @change="handleDepartmentChange"></department-picker>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="员工" prop="second_belong_uid">
            <el-select v-model="formData.second_belong_uid" placeholder="员工" clearable @change="handleChangeUser" class="w-100">
              <el-option v-for="user in userList" :key="user.id" :value="user.id" :label="user.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="微信号" prop="second_belong_wechat">
            <el-select v-model="formData.second_belong_wechat" placeholder="微信号" clearable class="w-100">
              <el-option v-for="wechat in wechatList" :key="wechat.id" :value="wechat.id" :label="wechat.wechat"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
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