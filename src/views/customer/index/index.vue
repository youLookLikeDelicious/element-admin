<script lang="ts" setup>
import { ref } from 'vue'
import { usePage } from '@/composition/page'
import create from './components/create.vue'
import { getCustomerList } from '@/apis/customer'
import editCustomer from './components/edit-customer.vue'
import addOrder from '@/views/order/index/components/edit.vue'
import info from './components/info.vue'
import { useCustomerGrade, useCustomerSource } from '@/composition/dict'

const TYPE_MAP: Record<string, any> = {
  0: 'info',
  1: 'warning',
  2: 'success',
  3: '',
  4: 'danger'
}
const { listData, loadData, total, handleCurrentChange, handleSizeChange, query, handleSearch, handleReset } = usePage(getCustomerList)

const createEl = ref()
const handleCreate = (id: number) => {
  createEl.value.handleVisible(id)
}

// 客户等级
const { customerGradeList, loadCustomerGrade } = useCustomerGrade()
const { sourceList, loadSourceList } = useCustomerSource()
loadCustomerGrade()
loadSourceList()
// 编辑客户
const editEl = ref()
const handleEdit = (id: number) => {
  editEl.value.handleVisible(id)
}

// 添加订单
const addOrderEl = ref()
const handleAddOrder = (id: number) => {
  addOrderEl.value.handleVisible()
    .then(() => {
      addOrderEl.value.formData.c_id = id
      addOrderEl.value.loadContactList()
    })
}

// 查看详情
const infoEl = ref()
const handleShowInfo = (id: number) => {
  infoEl.value.handleVisible(id)
}

</script>

<template>
  <list-page show-paginate :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange">
    <template #header>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-select v-model="query.grade_id" placeholder="客户等级" clearable @change="handleSearch" class="w-100">
            <el-option v-for="grade in customerGradeList" :key="grade.id" :value="grade.id" :label="grade.title"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="query.source_id" placeholder="客户来源" clearable @change="handleSearch" class="w-100">
            <el-option v-for="source in sourceList" :key="source.id" :value="source.id" :label="source.title"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="query.status" placeholder="客户状态" clearable class="w-100"  @change="handleSearch">
            <el-option :value="1" label="意向不明"></el-option>
            <el-option :value="2" label="意向模糊"></el-option>
            <el-option :value="3" label="意向一般"></el-option>
            <el-option :value="4" label="意向强烈"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input v-model="query.keywords" placeholder="姓名/微信" clearable @change="handleSearch"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="danger" @click="handleReset" plain>
            <i-ep-CircleClose></i-ep-CircleClose>&nbsp; 重 置
          </el-button>
        </el-col>
      </el-row>
    </template>
    <template #tools>
      <div class="display-flex flex-1 flex-nowrap justify-between">
        <el-tabs v-model="query.tab" type="card" @tab-change="handleSearch" class="el-tabs-border flex-1">
          <el-tab-pane name="0" label="全部已分配客户"></el-tab-pane>
          <el-tab-pane name="1" label="我的客户"></el-tab-pane>
        </el-tabs>
        <el-button type="primary" @click="handleCreate(0)" class="position-absolute" style="right: 0">
          <i-ep-Plus></i-ep-Plus> 添 加
        </el-button>
      </div>
    </template>
    <el-table :data="listData">
      <el-table-column label="客户名称" prop="name" align="center">
        <template v-slot="{ row }">
          <el-link type="primary" :underline="false" @click="handleShowInfo(row.id)">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template v-slot="{ row }">
          <el-tag :type="TYPE_MAP[row.status]">{{ row.status_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="客户等级" prop="grade" align="center"></el-table-column>
      <el-table-column label="微信号" prop="wechat" align="center"></el-table-column>
      <el-table-column label="来源渠道" prop="source" align="center"></el-table-column>
      <el-table-column label="所属员工" prop="belong_name" align="center"></el-table-column>
      <el-table-column label="所属微信" prop="wechatName" align="center"></el-table-column>
      <el-table-column label="所属部门" prop="belong_department" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="180" fixed="right">
        <template v-slot="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row.id)">编辑</el-button>
          <el-button type="primary" size="small" @click="handleAddOrder(row.id)">添加订单</el-button>
        </template>
      </el-table-column>
    </el-table>
  </list-page>
  <create ref="createEl" @success="loadData"></create>
  <!-- 添加订单 -->
  <add-order ref="addOrderEl"></add-order>
  <info ref="infoEl"></info>
  <edit-customer ref="editEl" @success="loadData"></edit-customer>
</template>

<style lang="scss">
</style>