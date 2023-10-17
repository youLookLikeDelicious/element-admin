<script lang="ts" setup>
import { ref } from 'vue'
import info from './components/info.vue'
import { usePage } from '@/composition/page'
import create from './components/create.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deleteUser, getUsers, resetpassword } from '@/apis/system'

const { currentPage, listData, query, total, loadData, handleCurrentChange, handleSizeChange, handleReset, handleSearch } = usePage(getUsers)

const createEl = ref()
// 添加用户
const handleCreate = (id: number) => {
  createEl.value.handleVisible(id)
}

// 删除
const handleDelete = (id: number) => {
  deleteUser(id)
    .then(() => {
      ElMessage({ type: 'success', message: '删除成功' })
      loadData()
    })
}

// 重置密码
const handleResetPwd = (id: number) => {
  ElMessageBox.confirm('确认重置密码?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    resetpassword(id)
      .then(() => {
        ElMessage({ type: 'success', message: '密码重置成功' })
      })
  })
}

const infoEl = ref()
const handleShowUserInfo = (id: number) => {
  infoEl.value.handleVisible(id)
}

</script>

<template>
  <list-page show-paginate :current-page="currentPage" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange">
    <!-- 标题栏 -->
    <template #header>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-input placeholder="姓名" clearable v-model="query.name" class="w-100"></el-input>
        </el-col>
        <!-- <el-col :span="4">
          <department-picker v-model="query.department_id"></department-picker>
        </el-col> -->
        <el-col :span="5">
          <el-date-picker type="daterange" :shortcuts="getShortStructs('YYYY-MM-DD')" v-model="query.join_at" value-format="YYYY-MM-DD" start-placeholder="创建时间" range-separator="至" end-placeholder="创建时间" clearable @change="handleSearch" class="w-100"></el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleSearch" plain>
            <i-ep-Search></i-ep-Search>&nbsp; 搜 索
          </el-button>
          <el-button type="danger" @click="handleReset" plain class="mr-12">
            <i-ep-CircleClose></i-ep-CircleClose>&nbsp; 重 置
          </el-button>
        </el-col>
      </el-row>
    </template>
    <!-- 工具栏 -->
    <template #tools>
      <el-row justify="end" class="w-100">
        <el-button v-if="isPermission('user.store')" type="primary" @click="handleCreate(0)">
          <i-ep-Plus></i-ep-Plus> 添 加
        </el-button>
      </el-row>
    </template>
    <!-- 列表部分 -->
    <el-table :data="listData" row-key="id">
      <el-table-column label="用户名" align="center" prop="name">
        <template v-slot="{ row }">
          <el-link type="primary" :underline="false" @click="handleShowUserInfo(row.id)">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" prop="real_name"></el-table-column>
      <el-table-column label="部门" align="center" prop="department_name" show-overflow-tooltip>
        <template v-slot="{ row }">
          {{ row.departments.map((item: any) => item.name).join(',') }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="入职时间" align="center" prop="join_at" show-overflow-tooltip></el-table-column> -->
      <!-- <el-table-column label="入职天数" align="center" prop="join_days"></el-table-column> -->
      <!-- <el-table-column label="角色" align="center" show-overflow-tooltip>
        <template v-slot="{ row }">
          <el-tag v-for="role in row.roles" :key="role.id">{{ role.name }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" fixed="right" width="230" align="center">
        <template v-slot="{ row }">
          <el-button v-if="isPermission('user.update')" type="primary" size="small" @click="handleCreate(row.id)">编辑</el-button>
          <el-button v-if="isPermission('user.reset-pwd')" type="primary" size="small" @click="handleResetPwd(row.id)">重置密码</el-button>
          <el-button v-if="isPermission('user.destroy')" type="danger" size="small" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <create ref="createEl" @success="loadData"></create>
    <info ref="infoEl"></info>
  </list-page>

</template>

<style lang="scss" scoped>
</style>