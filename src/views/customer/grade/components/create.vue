<script lang="ts" setup>
import { reactive } from 'vue'
import { useDialog } from '@/composition/dialog'
import { useClassifyList } from '@/composition/dict'
import { useSubmit } from '@/composition/submit'
import { saveGrade } from '@/apis/customer'
import { ElMessage } from 'element-plus'

const { classifyList, loadClassifyList } = useClassifyList()

const emit = defineEmits<{
  (event: 'success'): void
}>()

// 验证最低等级条件
const validateMinCondition = (rules: string, value: number, callback: (e?: any) => void) => {
  if (!value) {
    return callback(new Error('请输入最低等级条件'))
  }

  if (formData.max_conditions && value > formData.max_conditions) {
    return callback(new Error('无效的最低等级条件值'))
  }

  callback()
}

// 验证最高等级条件
const validateMaxCondition = (rule: string, value: number, callback: (e?: any) => void) => {
  if (!value) {
    return callback(new Error('请输入最高等级条件'))
  }

  if (formData.min_conditions && formData.min_conditions > value) {
    return callback(new Error('无效的最高等级条件'))
  }

  callback()
}

// 验证规则
const rules = {
  classify_id: { required: true, message: '请选择项目分类' },
  title: { required: true, message: '请输入等级名称', trigger: 'blur' },
  min_conditions: { required: true, validator: validateMinCondition, trigger: 'blur' },
  max_conditions: { required: true, validator: validateMaxCondition, trigger: 'blur' }
}

const { dialogVisible, handleVisible, id } = useDialog(loadClassifyList)

// form表单
const formData = reactive({
  classify_id: '',
  title: '',
  min_conditions: undefined,
  max_conditions: undefined,
  description: ''
})

const { handleSubmit, isSubmitting, form } = useSubmit(() => {
  return saveGrade(formData, id.value)
    .then(() => {
      emit('success')
      dialogVisible.value = false
      ElMessage({ message: '操作成功', type: 'success' })
    })
})

defineExpose({ handleVisible, formData })
</script>

<template>
  <el-dialog v-model="dialogVisible" :close-on-click-modal="false" title="添加客户等级" @close="form.resetFields()" @submit.prevent="handleSubmit">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="项目分类" prop="classify_id">
            <el-select placeholder="项目分类" clearable v-model="formData.classify_id">
              <el-option v-for="classify in classifyList" :key="classify.id" :label="classify.title" :value="classify.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="等级名称" prop="title">
            <el-input v-model="formData.title" clearable placeholder="等级名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="最低条件" prop="min_conditions">
            <el-input-number :controls="false" placeholder="最低条件" v-model="formData.min_conditions"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="最高条件" prop="max_conditions">
            <el-input-number :controls="false" placeholder="最高条件" style="text-align: left" v-model="formData.max_conditions"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="formData.description" :rows="3" :maxlength="255" show-word-limit placeholder="描述"></el-input>
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