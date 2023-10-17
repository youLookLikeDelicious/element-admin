<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import { useDialog } from '@/composition/dialog'
import { useSubmit } from '@/composition/submit'
import { ElMessage } from 'element-plus'
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
  name: { required: true, message: '请输入名称' },
}


const menus = ref([])

const { dialogVisible, handleVisible, id } = useDialog(() => {
  return nextTick(() => {
    getMenus()
      .then(res => {
        convertChild(res.data.data, id.value)
        menus.value = res.data.data
      })
    form.value && form.value.clearValidate()
  })
})

// form表单
const formData = ref([{ ...DEFAULT_FORM }])
const { handleSubmit, isSubmitting, form } = useSubmit(() => {
  return saveMenu({ menus: formData.value}, id.value)
    .then(() => {
       emit('success')
       dialogVisible.value = false
       ElMessage({ message: '操作成功', type: 'success' })
  })
})

/**
 * 复制添加菜单
 *
 * @param index 
 */
const handleCopyMenu = (index: number) => {
  formData.value.push({ ...formData.value[index], name: '', url: '', icon: '', permission: '' })
}

/**
 * 追加一个菜单权限
 */
const handleAppendMenu = () => {
  formData.value.push({ ...DEFAULT_FORM })
}

/**
 * 移除菜单权限
 *
 * @param index 
 */
const handleRemoveMenu = (index: number) => {
  formData.value.splice(index, 1)
}

const handleClose = () => {
  formData.value = [{ ...DEFAULT_FORM }]
}

defineExpose({ handleVisible, formData })
</script>

<template>
  <el-dialog v-model="dialogVisible" :close-on-click-modal="false" width="1200" title="添加菜单" @close="handleClose">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="90px" @submit.prevent="handleSubmit">
      <el-row justify="end" class="mb-24">
        <el-button type="primary" @click="handleAppendMenu">
          <i-ep-Plus></i-ep-Plus>&nbsp; 添 加
        </el-button>
      </el-row>
      <el-card v-for="(menu, index) in formData" :key="index" shadow="never" class="mb-24">
        <template #header>
          <div class="display-flex justify-between">
            <span>菜单/权限</span>
            <div>
              <el-button size="small" @click="handleCopyMenu(index)">
                <i-ep-CopyDocument></i-ep-CopyDocument>
              </el-button>
              <el-button v-if="index" type="danger" plain size="small" @click="handleRemoveMenu(index)">
                <i-ep-Delete></i-ep-Delete>&nbsp; 移 除
              </el-button>
            </div>
          </div>
        </template>
        <el-row>
          <el-col :span="6">
            <el-form-item label="菜单名称" :prop="`${index}.name`" required :show-message="false">
              <el-input placeholder="菜单名称" v-model="menu.name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="父级菜单" :prop="`${index}.parent_id`" :show-message="false">
              <el-cascader placeholder="父级菜单" v-model="menu.parent_id" :check-strictly="true" :options="menus" clearable :props="{ expandTrigger: 'hover', emitPath: false, checkStrictly: true, label: 'name', value: 'id' }" class="w-100"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类型" :prop="`${index}.type`" :show-message="false">
              <el-select v-model="menu.type" placeholder="类型" clearable class="w-100">
                <el-option :value="1" label="菜单"></el-option>
                <el-option :value="2" label="权限"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="前端地址" :prop="`${index}.url`" :show-message="false">
              <el-input v-model="menu.url" placeholder="前端地址" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="权限" :prop="`${index}.permission`" :show-message="false">
              <el-input v-model="menu.permission" placeholder="权限" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="图标" :prop="`${index}.icon`" :show-message="false">
              <el-input v-model="menu.icon" placeholder="图标"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="排序" :prop="`${index}.sort`" required :show-message="false">
              <el-input placeholder="排序" v-model="menu.sort"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" :prop="`${index}.status`" required :show-message="false">
              <el-select v-model="menu.status" placeholder="状态" clearable class="w-100">
                <el-option label="启用" :value="1"></el-option>
                <el-option label="禁用" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <input type="submit" hidden />
    </el-form>
    <template #footer>
      <el-row justify="end">
        <el-button type="primary" native-type="submit" :loading="isSubmitting" @click="handleSubmit"><i-ep-Finished v-if="!isSubmitting" class="mr-12" /> 提 交</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
</style>