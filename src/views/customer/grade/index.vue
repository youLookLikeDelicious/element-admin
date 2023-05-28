<script lang="ts" setup>
import { ref } from 'vue'
import { usePage } from '@/composition/page'
import create from './components/create.vue'
import { changeGradeStatus, getGradeList } from '@/apis/customer'
import { ElMessage } from 'element-plus';
import { useClassifyList } from '@/composition/dict';

const { listData, query, total, loadData, handleCurrentChange, handleSizeChange, handleSearch } = usePage(getGradeList)

const createEl = ref()
const handleCreate = (id: number, data?: any) => {
  createEl.value.handleVisible(id)

  if (data) {
    Object.assign(createEl.value.formData, data)
  }
}

// 项目分类
const {classifyList, loadClassifyList} = useClassifyList()
loadClassifyList()

// 禁用
const handleDisable = (id: number) => {
  changeGradeStatus(id)
  .then(() => {
      ElMessage({ message: '操作成功', type: 'success' })
      loadData()
    })
}
</script>

<template>
  <list-page :total="total" show-paginate @current-change="handleCurrentChange" @size-change="handleSizeChange">
    <template #header>
      <el-row>
        <el-col :span="4">
          <el-select v-model="query.classify_id" placeholder="项目名称" clearable @change="handleSearch">
            <el-option v-for="classify in classifyList" :key="classify.id" :value="classify.id" :label="classify.title"></el-option>
          </el-select>
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
      <el-table-column label="项目" prop="classify.title" align="center"></el-table-column>
      <el-table-column label="等级名称" prop="title" align="center"></el-table-column>
      <el-table-column label="最低等级条件" prop="min_conditions" align="center"></el-table-column>
      <el-table-column label="最高等级条件" prop="max_conditions" align="center"></el-table-column>
      <el-table-column label="状态" align="center">
        <template v-slot="{ row }">
          <el-tag :type="row.status_type">{{ row.status_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="description" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="150" fixed="right">
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