<script lang="ts" setup>
import { ref } from 'vue'
import { usePage } from '@/composition/page'
import create from './components/create.vue'
import BatchCreate from './components/batch-create.vue'
import { ElMessage } from 'element-plus'
import { deleteMenu, getMenus } from '@/apis/system'

const { listData, loadData, total, handleCurrentChange, handleSizeChange } = usePage(getMenus)

const createEl = ref()
const batchCreateEl = ref()

// 添加菜单
const handleCreate = (id: number, data?: any) => {
  if (!id) {
    batchCreateEl.value.handleVisible()
    return
  }
  createEl.value.handleVisible(data, id)
}

// 删除
const handleDelete = (id: number) => {
  deleteMenu(id)
    .then(() => {
      ElMessage({ type: 'success', message: '删除成功' })
      loadData()
    })
}


</script>

<template>
  <list-page :show-paginate="false" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange">
    <!-- 工具栏 -->
    <template #tools>
      <el-row justify="end" class="w-100">
        <el-button v-if="isPermission('menu.store')" type="primary" @click="handleCreate(0)">
          <i-ep-Plus></i-ep-Plus> 添 加
        </el-button>
      </el-row>
    </template>
    <!-- 列表部分 -->
    <el-table :data="listData" row-key="id">
      <el-table-column label="菜单名称" prop="name">
        <template v-slot="{ row }">
          <i v-if="row.icon" :class="['iconfont', row.icon]"></i>
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" align="center">
        <template v-slot="{ row }">
          {{ row.type === 1? '菜单' : '权限' }}
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" align="center"></el-table-column>
      <el-table-column label="状态" align="center">
        <template v-slot="{ row }">
          <el-tag :type="row.status === 1 ? '' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="{ row }">
          <el-button v-if="isPermission('menu.update')" type="primary" size="small" @click="handleCreate(row.id, row)">编辑</el-button>
          <el-button v-if="isPermission('menu.destroy')" type="danger" size="small" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加 -->
    <create ref="createEl" @success="loadData"></create>
    <!-- 批量添加 -->
    <batch-create ref="batchCreateEl" @success="loadData"></batch-create>
  </list-page>

</template>

<style lang="scss" scoped>
</style>