<script lang="ts" setup>
import { ref } from 'vue'
import { usePage } from '@/composition/page'
import edit from './components/edit.vue'
import { getOrderList } from '@/apis/order'
import type { TabsPaneContext } from 'element-plus';
import { usePayment } from '@/composition/dict';
import { useClassifyList } from '@/composition/dict';

const { listData, loadData, total, handleCurrentChange, handleSizeChange, query, handleSearch, handleReset } = usePage(getOrderList)

const props = withDefaults(defineProps<{
  showHeader?: boolean
}>(), {
  showHeader: true
})

const STATUS_TYPE: Record<any, string> = {
  1: '',
  '-1': 'warning',
  '-2': 'error',
  2: 'success'
}

const editEl = ref()
const handelEdit = (id: number) => {
  editEl.value.handleVisible(id)
}


// 退单
const handleDisable = (id: number) => {
  
}

const activeName = ref('')
const handleClickTab = (tab: TabsPaneContext) => {
  query.value = {}
  switch(tab.paneName) {
    case '1':
      query.value.status = 1
      break
    // 已签收
    case '2':
      query.value.status = 2
      break
    // 退换货
    case 3:
      query.value.status = -1
      break
    // 代收货款
    case '4':
      query.value.deliver_type = 1
      break
    case '5':
      query.value.order_type = 1
      break
  }
  handleSearch()
}

// 付款方式
const { paymentList, loadPaymentList } = usePayment()
loadPaymentList()
// 所属项目
const { classifyList, loadClassifyList } = useClassifyList()
if (props.showHeader) {
  loadClassifyList()
}

defineExpose({ handleSearch, query })
</script>

<template>
  <list-page @current-change="handleCurrentChange" @size-change="handleSizeChange" :total="total" show-paginate>
    <template #header v-if="showHeader">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-select v-model="query.pay_id" placeholder="付款方式" clearable @change="handleSearch" class="w-100">
            <el-option v-for="pay in paymentList" :key="pay.id" :label="pay.payment" :value="pay.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="query.project_id" placeholder="所属项目" clearable @change="handleSearch" class="w-100">
            <el-option v-for="classify in classifyList" :key="classify.id" :label="classify.title" :value="classify.id"></el-option>
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
      <el-tabs v-if="showHeader" type="card" v-model="activeName" @tab-click="handleClickTab" class="w-100">
        <el-tab-pane label="全部订单" name=""></el-tab-pane>
        <el-tab-pane label="未签收" name="1"></el-tab-pane>
        <el-tab-pane label="已签收" name="2"></el-tab-pane>
        <el-tab-pane label="退换货" name="3"></el-tab-pane>
        <el-tab-pane label="代收货款" name="4"></el-tab-pane>
        <el-tab-pane label="预售/预定" name="5"></el-tab-pane>
      </el-tabs>
    </template>
    <el-table :data="listData">
      <el-table-column label="商品" prop="product_name" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="收件人" prop="contact.name" align="center"></el-table-column>
      <el-table-column label="订单金额" prop="payable_price" align="center"></el-table-column>
      <el-table-column label="已付金额" prop="pay_price" align="center"></el-table-column>
      <el-table-column label="订单状态" align="center">
        <template v-slot="{ row }">
          <el-tag :type="STATUS_TYPE[row.status]">{{ row.status_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="订单编号" width="140" prop="order_no" align="center"></el-table-column>
      <el-table-column label="快递单号" width="140" prop="waybill_no" align="center"></el-table-column>
      <el-table-column label="物流状态" prop="waybill_status_name" align="center"></el-table-column>
      <el-table-column label="下单时间" width="120" prop="place_time_text" align="center"></el-table-column>
      <el-table-column label="签收时间" width="120" prop="assign_at" align="center"></el-table-column>
      <el-table-column label="发货方式" prop="deliver_type_name" align="center"></el-table-column>
      <el-table-column label="订单类型" prop="order_type_name" align="center"></el-table-column>
      <el-table-column label="订单备注" prop="remark" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template v-slot="{ row }">
          <el-button type="primary" size="small" @click="handelEdit(row.id)">编辑</el-button>
          <el-button type="primary" size="small">换货</el-button>
          <el-button type="danger" size="small" @click="handleDisable(row.id)">退单</el-button>
        </template>
      </el-table-column>
    </el-table>
  </list-page>
  <edit ref="editEl" @success="loadData"></edit>
</template>

<style lang="scss">
</style>