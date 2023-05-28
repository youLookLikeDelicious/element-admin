<script lang="ts" setup>
import ListPage from '@/components/slot/list-page.vue'
import { deleteDepartment, getDepartment } from '@/apis/user'
import { usePage } from '@/composition/page'
import create from './components/create.vue'
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const { listData, loadData } = usePage(getDepartment)

const createEl = ref()
const handleCreate = (id: number, data?: any) => {
  createEl.value.handleVisible(id)

  if (data) {
    createEl.value.formData.title = data.title
    createEl.value.formData.pid = data.pid
    createEl.value.formData.status = data.status
    createEl.value.formData.remark = data.remark
    createEl.value.formData.operate_status = data.operate_status
  }
}


// 删除
const handleDelete = (id: number) => {
  ElMessageBox.confirm('确认删除吗', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteDepartment(id)
      .then(() => {
        ElMessage({ type: 'success', message: '操作成功' })
        loadData()
      })
  })
}
</script>

<template>
  <list-page>
    <template #tools>
      <el-row justify="end" class="w-100">
        <el-button type="primary" @click="handleCreate(0)">
          <i-ep-Plus></i-ep-Plus>
          添加
        </el-button>
      </el-row>
    </template>
    <el-table :data="listData" row-key="id">
      <el-table-column label="部门名称" prop="title"></el-table-column>
      <el-table-column label="负责人" align="center" prop="leader.name"></el-table-column>
      <el-table-column label="部门电话" align="center" prop="phone"></el-table-column>
      <el-table-column label="状态" align="center" prop="phone">
        <template v-slot="{ row }">
          <el-tag :type="+row.status === 1 ? '' : 'danger'">{{ row.status_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="{ row }">
          <el-button type="primary" size="small" @click=handleCreate(row.id,row)><i-ep-EditPen />&nbsp;编 辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row.id)"><i-ep-Delete />&nbsp;删 除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </list-page>
  <create ref="createEl" @success="loadData"></create>
</template>

<style lang="scss">
</style>