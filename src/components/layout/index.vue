<script lang="ts" setup>
import { getMenus } from '@/apis/index'
import { ref } from 'vue'
import Menus from './menus.vue'
import { useUserStore } from '@/stores/modules/user'
import Avatar from '@/components/avatar/index.vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const menus = ref([])
// getMenus()
//   .then(res => {
//     menus.value = res.data
//   })

// 用户下拉按钮事件
const router = useRouter()
const handleCommand = (command: string) => {
  switch (command) {
    // 推出登录
    case 'signout':
      userStore.clear()
      router.push('/login')
      break
    case 'base':
      router.push('/user/edit')
      break
    case 'resetpwd':
      router.push('/reset/password')
    break
  }
}
</script>

<template>
  <div class="common-layout">
    <el-container class="h-100">
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-image class="logo" src="/images/login-logo.png"></el-image>
        <menus :menus="userStore.menus" class="flex-1"></menus>
      </el-aside>
      <!-- 右边部分 -->
      <el-container class="overflow-y-hidden">
        <!-- header -->
        <el-header class="display-flex align-center">
          <el-row justify="space-between" class="flex-1">
            <div></div>
            <div class="align-center display-flex">
              <!-- 通知 -->
              <el-link :underline="false" type="info" class="mr-24" href="/notification">
                <i-ep-Bell class="bell"></i-ep-Bell>
              </el-link>
              <!-- 用户部分 -->
              <el-dropdown @command="handleCommand">
                <div class="display-flex align-center cursor-pointer">
                  <avatar :name="userStore.name" :avatar="userStore.thumb"></avatar>
                  <span class="ml-12">
                    {{ userStore.name }}
                  </span>
                  <el-icon class="ml-12"><i-ep-ArrowDown /></el-icon>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="base">基本资料</el-dropdown-item>
                    <el-dropdown-item command="resetpwd">修改密码</el-dropdown-item>
                    <el-dropdown-item command="signout">退出</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </el-row>
        </el-header>
        <!-- 内容部分 -->
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-aside) {
  @extend %scroll-bar-hidden;
}
.el-aside {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  margin-right: -1px;
}
.logo {
  width: 100%;
  height: 60px;
  overflow: hidden;
  flex: 1 0 60px;
  max-height: 60px;
}
.el-header {
  border-bottom: 1px solid #eeeeee;
  border-left: 1px solid #eeeeee;
}

.bell {
  $size: 20px;
  width: $size;
  height: $size;
}
.el-menu {
  height: calc(100% - 60px);
  overflow: auto;
  @extend %scroll-bar-hidden;
}
</style>