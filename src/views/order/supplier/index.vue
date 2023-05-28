<script lang="ts" setup>
import { ref } from 'vue'
import { usePage } from '@/composition/page'
import create from './components/create.vue'
import { deleteSupplier, getSupplier } from '@/apis/order'
import { ElMessage } from 'element-plus';
import { useClassifyList } from '@/composition/dict';

// 所属项目
const { classifyList, loadClassifyList } = useClassifyList()
loadClassifyList()

const { listData, loadData, query, handleSearch, handleReset, total } = usePage(getSupplier)

const createEl = ref()
const handleCreate = (id: number, data?: any) => {
  createEl.value.handleVisible(id)

  if (data) {
    Object.assign(createEl.value.formData, {
      classify_id: data.classify_id,
      name: data.name,
      phone: data.phone,
      pay_type: data.pay_type,
      description: data.description
    })
  }
}


// 删除
const handleDelete = (id: number) => {
  deleteSupplier(id)
    .then(() => {
      ElMessage({ message: '操作成功', type: 'success' })
      loadData()
    })
}
</script>

<template>
  <list-page show-paginate :total="total">
    <template #header>
      <el-row>
        <el-col :span="4">
          <el-select v-model="query.classify_id" placeholder="所属项目" @change="handleSearch" clearable>
            <el-option v-for="classify in classifyList" :key="classify.id" :value="classify.id" :label="classify.title"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="danger" @click="handleReset" plain>
            <i-ep-CircleClose></i-ep-CircleClose> 重 置
          </el-button>
        </el-col>
      </el-row>
    </template>
    <template #tools>
      <el-row justify="end">
        <el-button type="primary" @click="handleCreate(0)">
          <i-ep-Plus></i-ep-Plus> 添 加
        </el-button>
      </el-row>
    </template>
    <el-table :data="listData">
      <el-table-column label="所属项目" prop="classify.title" align="center"></el-table-column>
      <el-table-column label="供应商名称" prop="name" align="center"></el-table-column>
      <el-table-column label="创建人" prop="user.name" align="center"></el-table-column>
      <el-table-column label="供应商电话" prop="phone" align="center"></el-table-column>
      <el-table-column label="结账类型" prop="phone" align="center">
        <template v-slot="{ row }">
          {{ row.pay_type === 1 ? '现结' : '月结' }}
        </template>
      </el-table-column>
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