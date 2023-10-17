<script lang="ts" setup>
import { ref } from 'vue'
import { useDialog } from '@/composition/dialog'
import { useSubmit } from '@/composition/submit'
import { ElMessage } from 'element-plus'
import { nextTick } from 'vue'
import { getMenus, saveMenu } from '@/apis/system'
import { convertChild } from '@/utils'

const emit = defineEmits<{
  (event: 'success'): void
}>()


const DEFAULT_FORM = {
  sort: 50,
  name: '',
  status: 1,
  type: 1,
  url: '',
  permission: '',
  parent_id: '',
  icon: ''
}

// 验证规则
const rules = {
}

const loadMenus = () => {
  getMenus()
    .then(res => {
      convertChild(res.data.data, id.value)
      menus.value = res.data.data
    })
}

const menus = ref([])
const { dialogVisible, handleVisible, id } = useDialog((data: typeof DEFAULT_FORM) => {
  loadMenus()
  formData.value = data
  nextTick(() => {
    form.value && form.value.clearValidate()
  })
})

// form表单
const formData = ref({ ...DEFAULT_FORM })

const { handleSubmit, isSubmitting, form } = useSubmit(() => {
  return saveMenu(formData.value, id.value)
    .then(() => {
      emit('success')
      dialogVisible.value = false
      ElMessage({ message: '操作成功', type: 'success' })
    })
})

const handleClose = () => {
  formData.value = { ...DEFAULT_FORM }
}

defineExpose({ handleVisible, formData })
</script>

<template>
  <el-dialog v-model="dialogVisible" :close-on-click-modal="false" width="520" :title="id ? '编辑菜单' : '添加菜单'" @close="handleClose">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="80px" @submit.prevent="handleSubmit">
      <el-row>
        <el-col>
          <el-form-item label="菜单名称" prop="name">
            <el-input placeholder="菜单名称" v-model="formData.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="父级菜单" prop="parent_id">
            <el-cascader placeholder="父级菜单" v-model="formData.parent_id" :check-strictly="true" :options="menus" clearable :props="{ expandTrigger: 'hover', emitPath: false, checkStrictly: true, label: 'name', value: 'id' }" class="w-100"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="类型" prop="type">
            <el-select v-model="formData.type" placeholder="类型" clearable class="w-100">
              <el-option :value="1" label="菜单"></el-option>
              <el-option :value="2" label="权限"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="前端地址" prop="url">
            <el-input v-model="formData.url" placeholder="前端地址" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="权限" prop="permission">
            <el-input v-model="formData.permission" placeholder="权限" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="图标" prop="icon">
            <el-input v-model="formData.icon" placeholder="图标" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="排序" prop="sort">
            <el-input placeholder="排序" v-model="formData.sort"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="状态" prop="status">
            <el-select v-model="formData.status" placeholder="状态" clearable class="w-100">
              <el-option label="启用" :value="1"></el-option>
              <el-option label="禁用" :value="2"></el-option>
            </el-select>
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