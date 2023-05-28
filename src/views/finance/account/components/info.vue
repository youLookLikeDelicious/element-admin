<script lang="ts" setup>
import { getAccountLog, exportAccountLog, deleteAccountLog, withDrawAccountLog } from '@/apis/finance'
import { useDrawer } from '@/composition/drawer'
import { usePage } from '@/composition/page'
import { download } from '@/utils/axios/download';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue'

defineProps<{
  title?: string
}>()

const { listData, loadData, total, handleCurrentChange, handleSizeChange, handleSearch, query, handleReset } = usePage((params?: any) => {
  return getAccountLog(id.value, params)
}, false)

const id = ref(0)
const { visible, handleVisible } = useDrawer((idParam: number) => {
  id.value = idParam
  loadData()
})

// 删除
const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定删除该数据吗', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteAccountLog(id)
      .then(() => {
        ElMessage({ type: 'success', message: '删除成功' })
        loadData()
      })
  })
}

// 撤回
const handleWithDraw = (id: number) => {
  ElMessageBox.confirm('确定要撤回该数据吗', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    withDrawAccountLog(id)
      .then(() => {
        ElMessage({ type: 'success', message: '撤回成功' })
        loadData()
      })
  })
}


// 关闭抽屉
const handleClose = () => {
  query.value = {}
}

// 导出
const handleExport = () => {
  exportAccountLog(id.value)
    .then(res => {
      download(res)
    })
}

defineExpose({ handleVisible })
</script>

<template>
  <el-drawer v-model="visible" size="80vw" @close="handleClose" :title="title">
    <list-page show-paginate :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange">
      <template #header>
        <el-row :gutter="10">
          <el-col :span="4">
            <el-date-picker v-model="query.date" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="日期" value-format="x" clearable @change="handleSearch" class="w-100"></el-date-picker>
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
          <el-button type="primary" @click="handleExport"><i-ep-Download></i-ep-Download> 导 出</el-button>
        </el-row>
      </template>
      <el-table :data="listData">
        <el-table-column label="操作者" prop="user.name"></el-table-column>
        <el-table-column label="描述" prop="description"></el-table-column>
        <el-table-column label="进账">
          <template v-slot="{ row }">
            <span v-if="+row.flow >= 0">{{ row.flow }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出账">
          <template v-slot="{ row }">
            <span v-if="+row.flow < 0">{{ row.flow }}</span>
          </template>
        </el-table-column>
        <el-table-column label="余额" prop="balance" show-overflow-tooltip></el-table-column>
        <el-table-column label="订单编号" prop="order.order_no" show-overflow-tooltip></el-table-column>
        <el-table-column label="时间" prop="create_time" width="170"></el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template v-slot="{ row }">
            <el-button v-if="row.allow_delete" size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
            <el-button v-if="row.allow_with_draw" size="small" type="primary" @click="handleWithDraw(row.id)">撤回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </list-page>
  </el-drawer>
</template>

<style lang="scss">
</style>