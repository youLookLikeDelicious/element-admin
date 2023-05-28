<script lang="ts" setup>
import { ref } from 'vue'
import { usePage } from '@/composition/page'
import create from './components/create.vue'
import assign from './components/assign.vue'
import { getCustomerSeaList } from '@/apis/customer'

const { listData, loadData, total, handleCurrentChange, handleSizeChange } = usePage(getCustomerSeaList)

const createEl = ref()
const handleCreate = (id: number, data?: any) => {
  createEl.value.handleVisible(id)

  if (data) {
    Object.assign(createEl.value.formData, data)
  }
}

// 分配
const assignEl = ref()
const handleAssign = (id: number[]) => {
  assignEl.value.handleVisible()
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
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="客户名称" prop="name" align="center"></el-table-column>
      <el-table-column label="状态" align="center">
        <template v-slot="{ row }">
          <el-tag :type="row.assign_status_name === '待分配' ? 'warning' : ''">{{ row.assign_status_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="一线销售" align="center" prop="user.name"></el-table-column>
      <el-table-column label="一线销售微信" align="center" prop="wechat.wechat"></el-table-column>
      <el-table-column label="二线销售" align="center" prop="second_user.name"></el-table-column>
      <el-table-column label="二线销售微信" align="center" prop="secondWechat.wechat"></el-table-column>
      <el-table-column label="来源渠道" align="center" prop="source.title"></el-table-column>
      <el-table-column label="分配时间" align="center" prop="distribute_time"></el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="{ row }">
          <el-button type="primary" size="small" @click="handleAssign([row.id])">分配</el-button>
        </template>
      </el-table-column>
    </el-table>
  </list-page>
  <create ref="createEl" @success="loadData"></create>
  <assign ref="assignEl" @success="loadData"></assign>
</template>

<style lang="scss">
</style>