<script lang="ts" setup>
import { ref } from 'vue'
import { usePage } from '@/composition/page'
import create from './components/create.vue'
import { deleteClassify, getClassifyList } from '@/apis/order'
import { ElMessage, ElMessageBox } from 'element-plus';

const { listData, loadData, total, handleCurrentChange, handleSizeChange } = usePage(getClassifyList)

const createEl = ref()
const handleCreate = (id: number, data?: any) => {
  createEl.value.handleVisible(id)

  if (data) {
    data.parent_id = data.parent_id || ''
    Object.assign(createEl.value.formData, data)
  }
}


// 删除
const handleDisable = (id: number) => {
  ElMessageBox.confirm('确认删除吗?', '提示', {
    confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
  }).then(() => {
    deleteClassify(id)
      .then(() => {
        ElMessage({ type: 'success', message: '操作成功' })
        loadData()
      })
  })
}
</script>

<template>
  <list-page  @current-change="handleCurrentChange" @size-change="handleSizeChange" :total="total" show-paginate>
    <template #tools>
      <el-row justify="end" class="w-100">
        <el-button type="primary" @click="handleCreate(0)">
          <i-ep-Plus></i-ep-Plus> 添 加
        </el-button>
      </el-row>
    </template>
    <el-table :data="listData" row-key="id">
      <el-table-column label="分类名称" prop="title" align="left"></el-table-column>
      <el-table-column label="销售状态" align="center">
        <template v-slot="{ row }">
          <el-tag :type="row.status ? 'danger' : ''">{{ row.status_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="推广状态" align="center">
        <template v-slot="{ row }">
          <el-tag :type="row.push_status ? 'danger' : ''">{{ row.push_status_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="结算方式" prop="charge_status_name" align="center"></el-table-column>
      <el-table-column label="运营方式" prop="operate_status_name" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template v-slot="{ row }">
          <el-button type="primary" size="small" @click="handleCreate(row.id, row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDisable(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </list-page>
  <create ref="createEl" @success="loadData"></create>
</template>

<style lang="scss">
</style>