<script lang="ts" setup>
import { ref } from 'vue'
import { usePage } from '@/composition/page'
import { changeDefaultContact, getContactInfo, getContactList } from '@/apis/customer'
import { ElMessage } from 'element-plus';
import addContact from '@/views/order/index/components/add-contact.vue'

const { listData, loadData, total, handleCurrentChange, handleSizeChange, handleReset, query, handleSearch } = usePage(getContactList)

const createEl = ref()
const handleCreate = (id: number) => {
  createEl.value.handleVisible(id)

  if (!id) return
  getContactInfo(id)
    .then(res => {
      Object.assign(createEl.value.formData, res.data.data)
    })
}


// 禁用
const handleSetDefault = (id: number) => {
  changeDefaultContact(id)
    .then(() => {
      ElMessage({ message: '操作成功', type: 'success' })
      loadData()
    })
}
</script>

<template>
  <list-page show-paginate :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange">
    <template #header>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-input v-model="query.keyword" placeholder="收货人姓名/手机号码" clearable @change="handleSearch"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="query.customer" placeholder="关联客户" clearable @change="handleSearch"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="danger" @click="handleReset" plain>
            <i-ep-CircleClose></i-ep-CircleClose>&nbsp; 重 置
          </el-button>
        </el-col>
      </el-row>
    </template>
    <el-table :data="listData">
      <el-table-column label="关联客户" prop="customer.name" align="center"></el-table-column>
      <el-table-column label="收货人姓名" prop="name" align="center">
        <template v-slot="{ row }">
          <el-link :underline="false" :type="row.is_default ? 'primary' : 'default'">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="sex_name" align="center"></el-table-column>
      <el-table-column label="手机号码" prop="mobile" align="center"></el-table-column>
      <el-table-column label="微信号码" prop="wechat" align="center"></el-table-column>
      <el-table-column label="电子邮箱" prop="email" align="center"></el-table-column>
      <el-table-column label="担任职位" prop="position" align="center"></el-table-column>
      <el-table-column label="部门" prop="department" align="center"></el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template v-slot="{ row }">
          <el-button type="primary" size="small" @click="handleCreate(row.id)">编辑</el-button>
          <el-button v-if="!row.is_default" type="primary" size="small" @click="handleSetDefault(row.id)">设为首要联系人</el-button>
          <!-- <el-button type="danger" size="small" @click="handleDisable(row.id)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </list-page>
  <add-contact ref="createEl"></add-contact>
</template>

<style lang="scss">
</style>