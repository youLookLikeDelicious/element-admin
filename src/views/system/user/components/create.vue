<script lang="ts" setup>
import { ref } from 'vue'
import { useDialog } from '@/composition/dialog'
import { useSubmit } from '@/composition/submit'
import { ElMessage } from 'element-plus'
import { nextTick } from 'vue'
import { getAllRoles, saveUser, getUserInfo } from '@/apis/system'
import { computed } from 'vue'
import { convertTreeToList, type Tree } from '@/utils'

const emit = defineEmits<{
  (event: 'success'): void
}>()


const DEFAULT_FORM = {
  name: '',
  real_name: '',
  departments: [],
  position_id: [],
  position_change_at: '',
  gender: '',
  qq: '',
  wechat: '',
  phone: '',
  tel: '',
  birthday_type: '',
  birthday: '',
  join_at: '',
  is_regular_worker: '',
  convert_at: '',
  id_num: '',
  job_status: '',
  contract_date: '',
  is_form: 2,
  form_weights: undefined,
  leave_type: '',
  leave_at: '',
  content: '',
  saler_type: ''
}

// 验证规则
const rules = {
  name: { required: true, message: '请输入用户名' },
  real_name: { required: true, message: '请输入员工姓名' },
  departments: { required: true, message: '请选择部门' },
  gender: { required: true, message: '请选择性别' },
  wechat: { required: true, message: '请输入微信号' },
  id_num: { required: true, message: '请输入身份证' },
  phone: { required: true, message: '请输入手机号' },
  join_at: { required: true, message: '请选择入职日期' },
  position_id: { required: true, message: '请选择职位/等级' },
  leave_type: { required: true, message: '请选择是否主动离职', trigger: 'change' },
  leave_at: { required: true, message: '请选择离职日期' },
  is_regular_worker: { required: true, message: '请选择实习/转正状态' }
}

// 获取用户详情
const loadUserInfo = () => {
  if (!id.value) return
  getUserInfo(id.value)
    .then(res => {
      const user = res.data.data
      user.roles = user.roles.map((item: { id: number }) => +item.id)
      user.departments = user.departments.map((department: { id: number }) => department.id)
      user.contract_date = user.contract_start_at ? [user.contract_start_at, user.contract_end_at] : []

      delete user.id
      formData.value = user
    })
}

const { dialogVisible, handleVisible, id } = useDialog(() => {
  loadRoles()
    .then(loadUserInfo)
  return nextTick(() => {
    form.value && form.value.clearValidate()
  })
})

// 部门列表
const departmentRef = ref()
const departmentList = computed(() => {
  const departments = departmentRef.value?.departments
  return departments
    ? convertTreeToList(departments)
    : []
})
// 当前选中的部门
type department = Tree & { split_saler: number }
const currentDepartment = computed<department[]>(() => {
  const department = departmentList.value.filter(department => formData.value.departments.includes(department.id as never))
  return department as unknown as department[]
})

// 获取所有角色
const roles = ref<{id: number, name: string}[]>([])
const loadRoles = () => {
  return getAllRoles()
    .then(res => {
      roles.value = res.data.data
    })
}

// form表单
const formData = ref({ ...DEFAULT_FORM, roles: [] })

const { handleSubmit, isSubmitting, form } = useSubmit(() => {
  return saveUser(formData.value, id.value)
    .then(() => {
      emit('success')
      dialogVisible.value = false
      ElMessage({ message: '操作成功', type: 'success' })
    })
})

const handleClose = () => {
  formData.value = { ...DEFAULT_FORM, roles: [] }
}

defineExpose({ handleVisible, formData })
</script>

<template>
  <el-dialog v-model="dialogVisible" :close-on-click-modal="false" :title="id ? '编辑用户' : '添加用户'" width="1200" @close="handleClose">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="120px" @submit.prevent="handleSubmit">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="用户名" prop="name">
            <el-input placeholder="用户名" v-model="formData.name" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="姓名" prop="real_name">
            <el-input placeholder="姓名" v-model="formData.real_name" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="部门" prop="departments">
            <!-- <department-picker ref="departmentRef" v-model="formData.departments" multiple></department-picker> -->
          </el-form-item>
        </el-col>
        <el-col v-if="currentDepartment.some(department => department.split_saler === 2)" :span="8">
          <el-form-item label="一二线" prop="saler_type">
            <el-select v-model="formData.saler_type" placeholder="一二线销售" clearable class="w-100">
              <el-option label="一线销售" :value="1"></el-option>
              <el-option label="二线销售" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="个人微信" prop="wechat">
            <el-input v-model="formData.wechat" placeholder="个人微信" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="formData.phone" placeholder="手机号码" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="身份证号" prop="id_num">
            <el-input v-model="formData.id_num" placeholder="身份证号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入职时间" prop="join_at">
            <el-date-picker v-model="formData.join_at" placeholder="入职时间" clearable value-format="YYYY-MM-DD" class="w-100"></el-date-picker>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="职务/等级" prop="position_id">
            <position-picker v-model="formData.position_id"></position-picker>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="formData.gender" placeholder="性别" clearable class="w-100">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实习/转正" prop="is_regular_worker">
            <el-select label="" v-model="formData.is_regular_worker" clearable class="w-100">
              <el-option label="实习" :value="1"></el-option>
              <el-option label="转正" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="职务变更时间" prop="position_change_at">
            <el-date-picker v-model="formData.position_change_at" placeholder="职务变更时间" clearable value-format="YYYY-MM-DD" class="w-100"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="腾讯QQ" prop="qq">
            <el-input v-model="formData.qq" placeholder="腾讯QQ" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话号码" prop="tel">
            <el-input v-model="formData.tel" placeholder="电话号码" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="生日" prop="birthday">
            <div class="display-flex birthday-wrapper">
              <el-select label="" v-model="formData.birthday_type" clearable>
                <el-option label="公历" :value="0"></el-option>
                <el-option label="农历" :value="1"></el-option>
              </el-select>
              <el-date-picker v-model="formData.birthday" clearable placeholder="生日" value-format="YYYY-MM-DD" class="w-100"></el-date-picker>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="+formData.is_regular_worker === 2">
          <el-form-item label="转正日期" prop="convert_at">
            <el-date-picker v-model="formData.convert_at" clearable placeholder="转正日期" value-format="YYYY-MM-DD" class="w-100"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select label="" v-model="formData.job_status" clearable class="w-100">
              <el-option label="在职" :value="0"></el-option>
              <el-option label="离职" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="+formData.job_status === 1">
          <el-form-item label="是否主动离职">
            <el-select label="" v-model="formData.leave_type" clearable class="w-100">
              <el-option label="主动离职" :value="1"></el-option>
              <el-option label="被动离职" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="+formData.job_status === 1">
          <el-form-item label="离职日期" prop="leave_at">
            <el-date-picker v-model="formData.leave_at" placeholder="离职日期" clearable value-format="YYYY-MM-DD" class="w-100"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同日期" prop="convert_at">
            <el-date-picker type="daterange" v-model="formData.contract_date" clearable start-placeholder="合同开始日期" range-separator="至" end-placeholder="合同结束日期" value-format="YYYY-MM-DD" class="w-100"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="表单">
            <el-select placeholder="表单" clearable v-model="formData.is_form" class="w-100">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="formData.is_form === 1">
          <el-form-item label="表单权重" prop="">
            <el-input-number :controls="false" class="w-100" v-model="formData.form_weights"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="角色" prop="roles">
            <el-select v-model="formData.roles" placeholder="角色" clearable class="w-100" multiple>
              <el-option v-for="role in roles" :key="role.id" :value="role.id" :label="role.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col>
          <el-form-item label="备注说明" prop="content">
            <el-input type="textarea" placeholder="备注说明" v-model="formData.content" :autosize="{ minRows: 3 }"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-row justify="end">
        <el-button :loading="isSubmitting" @click="dialogVisible = false"> 取 消</el-button>
        <el-button type="primary" native-type="submit" :loading="isSubmitting" @click="handleSubmit"><i-ep-Finished v-if="!isSubmitting" class="mr-12" /> 提 交</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.birthday-wrapper) {
  .el-select {
    .el-input__wrapper {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0;
    }
  }
  .el-date-editor {
    .el-input__wrapper {
      border-left: 0;
      margin-left: -1px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
</style>