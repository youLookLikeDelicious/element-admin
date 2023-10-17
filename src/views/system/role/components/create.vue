<script lang="ts" setup>
import { ref } from 'vue'
import { useDialog } from '@/composition/dialog'
import { useSubmit } from '@/composition/submit'
import { ElMessage } from 'element-plus'
import { nextTick } from 'vue'
import { getMenus, getRoleInfo, saveRole } from '@/apis/system'
import { convertChild } from '@/utils'

const emit = defineEmits<{
  (event: 'success'): void
}>()


const DEFAULT_FORM = {
  name: '',
  remark: ''
}

// 验证规则
const rules = {
  name: { required: true, message: '请输入角色名称' },
}


// 获取角色权限
const loadMenus = () => {
  return getMenus()
    .then(res => {
      convertChild(res.data.data)
      menu.value = res.data.data
    })
}

// 载入角色详情
const treeEl = ref()
const loadRole = (id: number) => {
  getRoleInfo(id)
    .then(res => {
      const data = res.data.data
      formData.value = {
        name: data.name,
        remark: data.remark,
        menu: data.menu.map((item: { id: number }) => item.id).sort((a: number, b: number) => a - b)
      }
      formData.value.menu.forEach(item => {
        treeEl.value.setChecked(item, true)
      })
    })
}

const menu = ref([])
const { dialogVisible, handleVisible, id } = useDialog(() => {
  nextTick(async() => {
    form.value && form.value.clearValidate()
    await loadMenus()
    if (id.value) loadRole(id.value)
  })
})

// form表单
const formData = ref<typeof DEFAULT_FORM & { menu: number[] }>({ ...DEFAULT_FORM, menu: [] })

const { handleSubmit, isSubmitting, form } = useSubmit(() => {
  return saveRole({ ...formData.value, menu: treeEl.value.getCheckedNodes(false, true).map((item: { id: number }) => item.id) }, id.value)
    .then(() => {
      emit('success')
      dialogVisible.value = false
      ElMessage({ message: '操作成功', type: 'success' })
    })
})

const handleClose = () => {
  formData.value = { ...DEFAULT_FORM, menu: [] }
  menu.value = []
}

// 处理节点被选中事件
// bug 如果不展开子选项,子选项不会触发, 所以使用 getCheckedNodes()
const handleCheckChange = (data: any, checked: boolean, childrenChecked: boolean) => {
  // 节点被选中
  if ((checked || childrenChecked) && !formData.value.menu.includes(data.id)) {
    formData.value.menu.push(data.id)
  }

  // 节点被移除
  if (!checked && !childrenChecked) {
    const ind = formData.value.menu.findIndex(item => item === data.id)
    if (ind >= 0) {
      formData.value.menu.splice(ind, 1)
    }
  }
}

defineExpose({ handleVisible, formData })
</script>

<template>
  <el-dialog v-model="dialogVisible" :close-on-click-modal="false" width="520" :title="id ? '编辑角色' : '添加角色'" @close="handleClose">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="80px" @submit.prevent="handleSubmit">
      <el-row>
        <el-col>
          <el-form-item label="角色名称" prop="name">
            <el-input placeholder="角色名称" v-model="formData.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="备注" prop="remark">
            <el-input placeholder="备注" type="textarea" v-model="formData.remark"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="权限" prop="parent_id">
            <el-tree ref="treeEl" :data="menu" :props="{ label: 'name', children: 'children' }" show-checkbox @check-change="handleCheckChange" node-key="id" class="w-100"></el-tree>
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