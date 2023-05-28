<script lang="ts" setup>
import { ref } from 'vue'
import { useDrawer } from '@/composition/drawer'
import { deletePortrait, getContactInfo, getContactList, getCustomerInfo, getCustomerLog, getPortraitList } from '@/apis/customer'
import { usePage } from '@/composition/page';
import { ElMessage, type TabsPaneContext } from 'element-plus'
import addContact from '@/views/order/index/components/add-contact.vue'
import addRemark from './add-remark.vue'
import order from '@/views/order/index/index.vue'

const customerData = ref<Record<string, any>>({})
const activeName = ref('portrait')
const id = ref(0)

const { visible, handleVisible } = useDrawer((idParam: number) => {
  id.value = idParam
  contactQuery.value.customer_id = idParam
  activeName.value = 'portrait'
  getCustomerInfo(idParam)
    .then((res) => {
      orderEl.value.query.c_id = id.value
      customerData.value = res.data.data.customer
      portraitQuery.value.c_id = id.value
      handleSearchPortrait()
    })
})

const orderEl = ref()
// 点击多标签
const handleClickTab = (tab: TabsPaneContext) => {
  switch(tab.paneName) {
    case 'address':
      handleSearchContact()
      break
    case 'portrait':
      handleSearchPortrait()
      break
    case 'operation':
      handleSearchLog()
      break
    case 'order':
      orderEl.value.handleSearch()
      break
  }
}

// 客户联系人列表
const { listData: contactList, query: contactQuery, handleSearch: handleSearchContact, total: contactTotal, handleCurrentChange: handleContactCurrentChange, loadData: loadContactList, handleSizeChange: handleContactSizeChange } = usePage(getContactList, false)

// 客户备注列表
const { listData: portraitList, query: portraitQuery, handleSearch: handleSearchPortrait, loadData: loadPortraitList, total: portraitTotal, handleSizeChange: handlePortraitSizeChange, handleCurrentChange: handlePortraitCurrentChange } = usePage(getPortraitList, false)

// 操作记录
const { listData: logList, total: logTotal, handleCurrentChange: handleLogCurrentChange, handleSizeChange: handleLogSizeChange, handleSearch: handleSearchLog } = usePage(() => {
  return getCustomerLog(customerData.value.id)
}, false)

// 新增收货人地址
const addContactEl = ref()
const handleAddContact = (id: number) => {
  addContactEl.value.handleVisible(id)

  if (!id) return
  getContactInfo(id)
    .then(res => {
      Object.assign(addContactEl.value.formData, res.data.data)
    })
}

// 新增备注
const addRemarkEl = ref()
const handleAddRemark = (id: number, content?: string) => {
  addRemarkEl.value.handleVisible(id)
  addRemarkEl.value.formData.c_id = customerData.value.id
  if (content) {
    addRemarkEl.value.formData.content = content
  }
}

//删除客户备注
const handleDeletePortrait = (id: number) => {
  deletePortrait(id)
    .then(() => {
      ElMessage({ message: '操作成功', type: 'success' })
      loadPortraitList()
    })
}

defineExpose({ handleVisible })
</script>

<template>
  <el-drawer v-model="visible" title="客户信息" size="50vw">
    <el-card header="客户详情" shadow="never" class="mb-24">
      <el-row class="info-row">
        <el-col :span="8">
          <span class="color-gray mr-12">客户名称</span>
          <span>{{ customerData.name }}</span>
        </el-col>
        <el-col :span="8">
          <span class="color-gray mr-12">客户等级</span>
          <span>{{ customerData.name }}</span>
        </el-col>
        <el-col :span="8">
          <span class="color-gray mr-12">客户来源</span>
          <span>{{ customerData.name }}</span>
        </el-col>
        <el-col :span="8">
          <span class="color-gray mr-12">所属行业</span>
          <span>{{ customerData.name }}</span>
        </el-col>
        <el-col :span="8">
          <span class="color-gray mr-12">归属员工</span>
          <span>{{ customerData.name }}</span>
        </el-col>
        <el-col :span="8">
          <span class="color-gray mr-12">归属部门</span>
          <span>{{ customerData.name }}</span>
        </el-col>
        <el-col :span="8">
          <span class="color-gray mr-12">录入人</span>
          <span>{{ customerData.name }}</span>
        </el-col>
        <el-col :span="8">
          <span class="color-gray mr-12">初始绑定微信</span>
          <span>{{ customerData.name }}</span>
        </el-col>
        <el-col :span="8">
          <span class="color-gray mr-12">二线绑定微信</span>
          <span>{{ customerData.name }}</span>
        </el-col>
        <el-col>
          <span class="color-gray mr-12">客户介绍</span>
          <span>{{ customerData.content }}</span>
        </el-col>
      </el-row>
    </el-card>
    <el-card header="首要收货人地址信息" shadow="never">
      <el-row class="info-row">
        <span class="color-gray mr-12">姓名</span>
        <span></span>
      </el-row>
      <el-row>
        <span class="color-gray mr-12">手机号</span>
        <span></span>
      </el-row>
      <el-row>
        <span class="color-gray mr-12">收货人备注</span>
        <span></span>
      </el-row>
      <el-row>
        <el-tabs v-model="activeName" @tab-click="handleClickTab" class="w-100">
          <el-tab-pane label="备注" name="portrait">
            <list-page show-paginate :total="portraitTotal" @current-change="handlePortraitCurrentChange" @size-change="handlePortraitSizeChange">
              <template #tools>
                <el-row justify="end" class="w-100">
                  <el-button type="primary" @click="handleAddRemark(0)" size="small"><i-ep-Plus></i-ep-Plus> 新建备注 </el-button>
                </el-row>
              </template>
              <el-table :data="portraitList">
                <el-table-column label="备注内容" prop="content" align="center"></el-table-column>
                <el-table-column label="添加人" prop="user.name" align="center"></el-table-column>
                <el-table-column label="添加时间" prop="create_time_name" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template v-slot="{ row }">
                    <el-button type="primary" size="small" @click="handleAddRemark(row.id, row.content)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDeletePortrait(row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </list-page>
          </el-tab-pane>
          <el-tab-pane label="收货人地址" name="address">
            <list-page show-paginate :total="contactTotal" @current-change="handleContactCurrentChange" @size-change="handleContactSizeChange">
              <template #tools>
                <el-row justify="end" class="w-100">
                  <el-button type="primary" size="small" @click="handleAddContact(0)"><i-ep-Plus></i-ep-Plus> &nbsp;添加</el-button>
                </el-row>
              </template>
              <el-table :data="contactList">
                <el-table-column label="姓名" prop="name" width="150" show-overflow-tooltip align="center">
                  <template v-slot="{ row }">
                    <el-link :type="row.is_default ? 'primary' : 'default'" :underline="false">{{ row.name }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column label="性别" prop="sex_name" width="80" align="center"></el-table-column>
                <el-table-column label="手机号" prop="mobile" align="center"></el-table-column>
                <el-table-column label="地址" prop="address_name" width="210" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="详细地址" prop="address" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template v-slot="{ row }">
                    <el-button type="primary" size="small" @click="handleAddContact(row.id)">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </list-page>
          </el-tab-pane>
          <el-tab-pane label="操作记录" name="operation">
            <list-page :total="logTotal"  @current-change="handleLogCurrentChange" @size-change="handleLogSizeChange" show-paginate>
              <el-timeline>
                <el-timeline-item v-for="log in logList" :key="log.id" :timestamp="''" color="#409eff">
                  {{ log.date }}
                  <ul>
                    <li v-for="children in log.children" :key="children.id">
                      <div class="display-flex align-center color-gray">
                        <avatar :name="children.user.name" :avatar="children.user.thumb"></avatar>
                        <span class="mr-12">{{ children.user.name }}</span>
                        <template v-if="['new', 'del', 'belong'].includes(children.field)">
                          <span></span>
                          <span>{{ children.action }}了{{children.role}}</span><span>{{ children.items }}</span>
                        </template>
                        <template v-else-if="children.field === 'file'">
                          <span>${children.action}了${children.role}</span><span>${children.times}</span>
                        </template>
                        <template v-else>
                          将{{children.role}}<strong class="color-text mx-6">{{children.title}}</strong> 从 {{children.old_content}} {{children.action}}为<strong class="color-text mx-6">{{children.new_content}}</strong>
                        </template>
                        <span class="ml-12">{{ children.times }}</span>
                      </div>
                    </li>
                  </ul>
                </el-timeline-item>
              </el-timeline>
            </list-page>
          </el-tab-pane>
          <el-tab-pane label="客户订单" name="order">
            <order ref="orderEl" :show-header="false"></order>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-card>
  </el-drawer>
  <add-contact ref="addContactEl" :customer-name="customerData.name" @success="loadContactList"></add-contact>
  <add-remark ref="addRemarkEl" @success="loadPortraitList"></add-remark>
</template>

<style lang="scss">
</style>