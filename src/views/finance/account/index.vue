<script lang="ts" setup>
import { ref } from 'vue'
import { usePage } from '@/composition/page'
import create from './components/create.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deleteAccount, getAccountList } from '@/apis/finance'
import info from './components/info.vue'

const { listData, loadData, total, query, handleCurrentChange, handleSizeChange, handleSearch, handleReset } = usePage(getAccountList)

const createEl = ref()
const handleCreate = (id: number, data?: any) => {
  createEl.value.handleVisible(id, data)
}

// 查看流水明细
const infoEl = ref()
const infoTitle = ref('')
const handleShowLog = (id: number, accountNo: string) => {
  infoEl.value.handleVisible(id)
  infoTitle.value = `账户 ${accountNo} 明细`
}

// 删除
const handleDisable = (id: number) => {
  ElMessageBox.confirm('确认删除吗', '提示', {
    confirmButtonText: '确认',
    type: 'warning',
    cancelButtonText: '取消'
  })
    .then(() => {
      deleteAccount(id)
        .then(() => {
          ElMessage({ message: '操作成功', type: 'success' })
          loadData()
        })
    })
}
</script>

<template>
  <list-page show-paginate :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange">
    <template #header>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-select v-model="query.status" placeholder="账户状态" clearable @change="handleSearch" class="w-100">
            <el-option :value="0" label="启用"></el-option>
            <el-option :value="1" label="禁用"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-cascader v-model="query.department_id" placeholder="部门" :props="{ label: 'title', value: 'id', expandTrigger: 'hover', checkStrictly: false, emitPath: false }" clearable class="w-100" @change="handleSearch"></el-cascader>
        </el-col>
        <el-col :span="4">
          <classify-picker v-model="query.p_id" :init-data="true"></classify-picker>
        </el-col>
        <el-col :span="4">
          <el-button type="danger" @click="handleReset" plain>
            <i-ep-CircleClose></i-ep-CircleClose>&nbsp; 重 置
          </el-button>
        </el-col>
      </el-row>
    </template>
    <template #tools>
      <el-row justify="end" class="w-100">
        <el-button type="primary" @click="handleCreate(0)">
          <i-ep-Plus></i-ep-Plus> 添 加
        </el-button>
      </el-row>
    </template>
    <el-table :data="listData">
      <el-table-column label="所属部门" prop="department.title" align="center"></el-table-column>
      <el-table-column label="类型" prop="classify.title" align="center"></el-table-column>
      <el-table-column label="所属项目" prop="classify.title" align="center"></el-table-column>
      <el-table-column label="账户号" prop="account_no" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column label="所属银行" prop="bank" align="center"></el-table-column>
      <el-table-column label="所属人" prop="carderUser.name" align="center"></el-table-column>
      <el-table-column label="余额" prop="money" align="center"></el-table-column>
      <el-table-column label="备注" prop="content" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="录入时间" prop="create_time" width="160" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" align="center">
        <template v-slot="{ row }">
          <el-tag :type="+row.status ? 'danger' : ''">{{ row.status_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="210">
        <template v-slot="{ row }">
          <el-button type="primary" size="small" @click="handleCreate(row.id, row)">编辑</el-button>
          <el-button type="primary" size="small" @click="handleShowLog(row.id, row.account_no)">明细</el-button>
          <el-button type="danger" size="small" @click="handleDisable(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </list-page>
  <create ref="createEl" @success="loadData"></create>
  <info ref="infoEl" :title="infoTitle"></info>
</template>

<style lang="scss">
</style>