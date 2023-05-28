<script lang="ts" setup>
import { ref } from 'vue'
import { usePage } from '@/composition/page'
import create from './components/create.vue'
import { deleteProduct, getProductList } from '@/apis/order'
import { useClassifyList } from '@/composition/dict';
import { ElMessage } from 'element-plus';

const { classifyList, loadClassifyList } = useClassifyList()
loadClassifyList()
const { listData, loadData, total, query, handleReset, handleSearch } = usePage(getProductList)

const createEl = ref()
const handleCreate = (id: number) => {
  createEl.value.handleVisible(id)
}


// 删除
const handleDisable = (id: number) => {
  deleteProduct(id)
    .then(() => {
      ElMessage({ message: '操作成功', type: 'success' })
      loadData()
    })
}
</script>

<template>
  <list-page :total="total" show-paginate>
    <template #header>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-select v-model="query.classify_id" placeholder="所属项目" @change="handleSearch" clearable class="w-100">
            <el-option v-for="classify in classifyList" :key="classify.id" :value="classify.id" :label="classify.title"></el-option>
          </el-select>
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
      <el-table-column label="商品编号" prop="code" align="center"></el-table-column>
      <el-table-column label="所属分类" prop="classify.title" align="center"></el-table-column>
      <el-table-column label="商品名称" prop="title" align="center"></el-table-column>
      <el-table-column label="供应商" prop="supplier.name" align="center"></el-table-column>
      <el-table-column label="价格" prop="price" align="center"></el-table-column>
      <el-table-column label="单位" prop="unit.name" align="center"></el-table-column>
      <el-table-column label="成本价" prop="cost" align="center"></el-table-column>
      <el-table-column label="最低价" prop="minprice" align="center"></el-table-column>
      <el-table-column label="图片" align="center" width="125">
        <template v-slot="{ row }">
          <el-image :src="row.image_url" style="width: 120px"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template v-slot="{ row }">
          <el-tag :type="row.status ? 'danger' : ''">{{ row.status ? '下架' : '正常' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="{ row }">
          <el-button type="primary" size="small" @click="handleCreate(row.id)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDisable(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </list-page>
  <create ref="createEl" @success="loadData"></create>
</template>

<style lang="scss">
</style>