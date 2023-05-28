<script lang="ts" setup>
import { reactive } from 'vue'
import { useDialog } from '@/composition/dialog'
import { useSubmit } from '@/composition/submit'
import { ElMessage } from 'element-plus'
import { nextTick } from 'vue'
import { SEAL_DEPARTMENT, useCommonDict, useDepartmentList } from '@/composition/dict'
import { getAllParentClassify, saveClassify } from '@/apis/order'
import { computed } from 'vue'

const emit = defineEmits<{
  (event: 'success'): void
}>()

const { departmentList, loadDepartmentList } = useDepartmentList()

// 父级项目分类
const { list: parentList, loadList: loadParentList } = useCommonDict(getAllParentClassify)

// 验证规则
const rules = {
  title: { required: true, message: '请输入项目分类' },
  department_id: { required: true, message: '请选择部门' }
}

const { dialogVisible, handleVisible, id } = useDialog(() => {
  // 获取销售部下的子部门
  loadDepartmentList({ parent_id: SEAL_DEPARTMENT })
  loadParentList()
  return nextTick(() => {
    form.value && form.value.clearValidate()
  })
})

const calcParentList = computed(() => {
  if (id.value) {
    return parentList.value.filter((item: {id: number}) => item.id !== id.value)
  }
  return parentList.value
})
// form表单
const formData = reactive({
  title: '',
  parent_id: '',
  department_id: '',
  operate_status: 1,
  description: ''
})

const { handleSubmit, isSubmitting, form } = useSubmit(() => {
  return saveClassify(formData, id.value)
    .then(() => {
      emit('success')
      dialogVisible.value = false
      ElMessage({ message: '操作成功', type: 'success' })
    })
})

const handleClose = () => {
  formData.title = ''
  formData.department_id = ''
  formData.operate_status = 1
  formData.description = ''
  formData.parent_id = ''
}

defineExpose({ handleVisible, formData })
</script>

<template>
  <el-dialog v-model="dialogVisible" :close-on-click-modal="false" width="520" :title="id ? '编辑项目分类' : '添加项目分类'" @close="handleClose">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px" @submit.prevent="handleSubmit">
      <el-row>
        <el-col>
          <el-form-item label="父级项目" prop="parent_id">
            <el-select v-model="formData.parent_id" placeholder="父级项目" clearable class="w-100">
              <el-option v-for="list in calcParentList" :key="list.id" :label="list.title" :value="list.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="项目分类" prop="title">
            <el-input placeholder="项目分类" v-model="formData.title" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="所属部门" prop="department_id">
            <el-cascader v-model="formData.department_id" :options="departmentList" :props="{ expandTrigger: 'hover', label: 'title', value: 'id', emitPath: false, checkStrictly: true }" class="w-100" placeholder="所属部门"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="运营方式" prop="operate_status">
            <el-radio-group v-model="formData.operate_status">
              <el-radio :label="1">自营</el-radio>
              <el-radio :label="2">联营</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="描述" prop="description">
            <el-input v-model="formData.description" type="textarea" placeholder="描述"></el-input>
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