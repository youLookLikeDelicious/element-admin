<script lang="ts" setup>
import { ref } from 'vue'
import { usePage } from '@/composition/page'
import create from './components/create.vue'
import { deleteUnit, getUnit } from '@/apis/order';
import { ElMessage } from 'element-plus';

const { listData, loadData, total, handleCurrentChange, handleSizeChange } = usePage(getUnit)

const createEl = ref()
const handleCreate = (id: number, data?: any) => {
  createEl.value.handleVisible(id)

  if (data) {
    Object.assign(createEl.value.formData, { name: data.name, description: data.description })
  }
}


// 删除
const handleDelete = (id: number) => {
  deleteUnit(id)
    .then(() => {
      ElMessage({ message: '操作成功', type: 'success' })
      loadData()
    })
}

</script>

<template>
  <list-page :total="total" show-paginate @current-change="handleCurrentChange" @size-change="handleSizeChange">
    <template #tools>
      <el-row justify="end">
        <el-button type="primary" @click="handleCreate(0)">
          <i-ep-Plus></i-ep-Plus> 添 加
        </el-button>
      </el-row>
    </template>
    <el-table :data="listData">
      <el-table-column label="单位名称" prop="name" align="center"></el-table-column>
      <el-table-column label="描述" prop="description" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="{ row }">
          <el-button type="primary" size="small" @click="handleCreate(row.id, row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </list-page>
  <create ref="createEl" @success="loadData"></create>
</template>

<style lang="scss">
</style>