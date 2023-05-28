<script lang="ts" setup>
import { reactive } from 'vue'
import { useSubmit } from '@/composition/submit'
import { useDepartmentList } from '@/composition/dict'
import { nextTick } from 'vue';
import { useDialog } from '@/composition/dialog';
import { saveDepartment } from '@/apis/user';
import { ElMessage } from 'element-plus';

const DEFAULT_FORM = {
  pid: '',
  title: '',
  remark: '',
  status: '',
  operate_status: 1
}

const emit = defineEmits<{
  (event: 'success'): void
}>()

// 部门列表
const { departmentList, loadDepartmentList } = useDepartmentList()

const { dialogVisible, handleVisible, id } = useDialog(() => {
  loadDepartmentList()
  return nextTick(() => {
    form.value && form.value.clearValidate()
  })
})

const { isSubmitting, handleSubmit, form } = useSubmit(() => {
  return saveDepartment(formData, id.value)
    .then(() => {
      emit('success')
      dialogVisible.value = false
      ElMessage({ message: '操作成功', type: 'success' })
    })
})

const formData = reactive({...DEFAULT_FORM})


const rules = {
  title: { required: true, message: '请输入部门名称', trigger: 'blur' }
}

// 关闭对话框
const handleClose = () => {
  Object.assign(formData, DEFAULT_FORM)
}
defineExpose({ handleVisible, formData })
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="id ? '编辑部门' : '添加'" width="520" @close="handleClose">
    <el-form ref="form" @submit.prevent="handleSubmit" :model="formData" :rules="rules" label-position="right" label-width="80px">
      <el-row>
        <el-col>
          <el-form-item label="父级部门" prop="pid">
            <el-cascader v-model="formData.pid" placeholder="父级部门" class="w-100" clearable :options="departmentList" :props="{ label: 'title', value: 'id', emitPath: false, checkStrictly: true, expandTrigger: 'hover' }"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="部门名称" prop="title">
            <el-input v-model="formData.title" placeholder="部门名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="部门描述" prop="remark">
            <el-input v-model="formData.remark" placeholder="部门描述" clearable type="textarea" :rows="3"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="状态" prop="operate_status">
            <el-radio-group v-model="formData.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="自营/联营" prop="operate_status">
            <el-radio-group v-model="formData.operate_status">
              <el-radio :label="1">自营</el-radio>
              <el-radio :label="0">联营</el-radio>
            </el-radio-group>
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