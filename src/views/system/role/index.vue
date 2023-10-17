<script lang="ts" setup>
import { ref } from 'vue'
import { usePage } from '@/composition/page'
import create from './components/create.vue'
import { ElMessage } from 'element-plus'
import { deleteRole, getRoleList } from '@/apis/system'

const { listData, loadData, total, handleCurrentChange, handleSizeChange, query, handleReset, currentPage } = usePage(getRoleList)

const createEl = ref()

// 添加菜单
const handleCreate = (id: number) => {
  createEl.value.handleVisible(id)
}

// 删除
const handleDelete = (id: number) => {
  deleteRole(id)
    .then(() => {
      ElMessage({ type: 'success', message: '删除成功' })
      loadData()
    })
}


</script>

<template>
  <list-page show-paginate :current-page="currentPage" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange">
    <!-- 标题栏 -->
    <template #header>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-input placeholder="角色" clearable @change="loadData" v-model="query.name" class="w-100"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="danger" @click="handleReset" plain>
            <i-ep-CircleClose></i-ep-CircleClose>&nbsp; 重 置
          </el-button>
        </el-col>
      </el-row>
    </template>
    <!-- 工具栏 -->
    <template #tools>
      <el-row justify="end" class="w-100">
        <el-button v-if="isPermission('role.store')" type="primary" @click="handleCreate(0)">
          <i-ep-Plus></i-ep-Plus> 添 加
        </el-button>
      </el-row>
    </template>
    <!-- 列表部分 -->
    <el-table :data="listData" row-key="id">
      <el-table-column label="角色" align="center" prop="name"></el-table-column>
      <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="{ row }">
          <el-button v-if="isPermission('role.update')" type="primary" size="small" @click="handleCreate(row.id)">编辑</el-button>
          <el-button v-if="isPermission('role.destroy')" type="danger" size="small" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <create ref="createEl" @success="loadData"></create>
  </list-page>

</template>

<style lang="scss" scoped>
</style>