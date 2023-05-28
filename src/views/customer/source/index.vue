<script lang="ts" setup>
import { ref } from 'vue'
import { usePage } from '@/composition/page'
import create from './components/create.vue'
import { changeSourceStatus, getSourcePageList } from '@/apis/customer'
import { ElMessage } from 'element-plus';

const { listData, loadData, total, handleCurrentChange, handleSizeChange } = usePage(getSourcePageList)

const createEl = ref()
const handleCreate = (id: number, data?: any) => {
  createEl.value.handleVisible(id)

  if (data) {
    Object.assign(createEl.value.formData, data)
  }
}


// 禁用
const handleDisable = (id: number) => {
  changeSourceStatus(id)
    .then(() => {
      ElMessage({ message: '操作成功', type: 'success' })
      loadData()
    })
}
</script>

<template>
  <list-page show-paginate :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange">
    <template #tools>
      <el-row justify="end" class="w-100">
        <el-button type="primary" @click="handleCreate(0)">
          <i-ep-Plus></i-ep-Plus> 添 加
        </el-button>
      </el-row>
    </template>
    <el-table :data="listData">
      <el-table-column label="渠道名称" prop="title" align="center"></el-table-column>
      <el-table-column label="状态" align="center">
        <template v-slot="{ row }">
          <el-tag :type="row.status_type">{{ row.status_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="{ row }">
          <el-button type="primary" size="small" @click="handleCreate(row.id, row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDisable(row.id)">{{ +row.status === 1 ? '禁用' : '启用' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </list-page>
  <create ref="createEl" @success="loadData"></create>
</template>

<style lang="scss">
</style>