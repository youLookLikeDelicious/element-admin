<script lang="ts" setup>
import { ref } from 'vue'
import { usePage } from '@/composition/page'
import create from './components/create.vue'
import { deletePayment, getPaymentList } from '@/apis/order'
import { ElMessage } from 'element-plus';

const { listData, loadData, total, handleCurrentChange, handleSizeChange } = usePage(getPaymentList)

const createEl = ref()
const handleCreate = (id: number, data?: any) => {
  createEl.value.handleVisible(id)

  if (data) {
    Object.assign(createEl.value.formData, { payment: data.payment, description: data.description })
  }
}


// 禁用
const handleDelete = (id: number) => {
  deletePayment(id)
    .then(() => {
      ElMessage({ message: '操作成功', type: 'success' })
      loadData()
    })
}
</script>

<template>
  <list-page :total="total" show-paginate @current-change="handleCurrentChange" @size-change="handleSizeChange">
    <template #tools>
      <el-row justify="end" class="w-100">
        <el-button type="primary" @click="handleCreate(0)">
          <i-ep-Plus></i-ep-Plus> 添 加
        </el-button>
      </el-row>
    </template>
    <el-table :data="listData">
      <el-table-column label="支付方式" prop="payment" align="center"></el-table-column>
      <el-table-column label="添加人" prop="username" align="center"></el-table-column>
      <el-table-column label="描述" prop="description" align="center" show-overflow-tooltip></el-table-column>
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