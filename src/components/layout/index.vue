<script lang="ts" setup>
import menus from './menus.vue'
import { useUserStore } from '@/stores/modules/user'
import avatar from '@/components/avatar/index.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useConfigStore } from '@/stores/modules/config'

const userStore = useUserStore()
const configStore = useConfigStore()

// 用户下拉按钮 事件
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

const asideEl = ref()

/**
 * 开关侧边栏
 */
const handleToggleSideBar = () => {
  configStore.$patch({ isCollapse: !configStore.isCollapse })
}

</script>

<template>
  <div class="common-layout">
    <el-container class="h-100">
      <!-- 侧边栏 中大屏幕-->
      <el-aside ref="asideEl" width="200px" :class="[ { 'aside-bar-collapse': configStore.isCollapse, 'aside-bar-expand': !configStore.isCollapse }, 'aside-bar-pc' ]">
        <!-- <el-image class="logo" fit="scale-down" :src="configStore.isCollapse ? '/images/logo-small.jpg' : '/images/logo.png'"></el-image> -->
        <div class="title logo">Element Admin</div>
        <div class="menu-box">
          <menus :menus="userStore.menus" :is-collapse="configStore.isCollapse" class="flex-1"></menus>
        </div>
      </el-aside>
      <!-- 侧边栏 小屏幕 -->
      <el-aside ref="asideEl" :class="[ 'aside-bar-mobile', { 'aside-bar-mobile-collapse': configStore.isCollapse, 'aside-bar-mobile-expand': !configStore.isCollapse } ]">
        <!-- <el-image class="logo" fit="scale-down" :src="'/images/logo.png'"></el-image> -->
        <div class="title logo">Element Admin</div>
        <menus :menus="userStore.menus" class="flex-1"></menus>
        <div class="asideEl-mobile-curtain" v-if="!configStore.isCollapse" @click="handleToggleSideBar"></div>
      </el-aside>
      <!-- 右边部分 -->
      <el-container class="overflow-y-hidden">
        <!-- header -->
        <el-header class="display-flex align-center">
          <el-row justify="space-between" class="flex-1 h-100">
            <div class="">
              <div class="h-100 expand-btn display-flex align-center justify-center" @click="handleToggleSideBar">
                <i-ep-Fold v-if="configStore.isCollapse" width="1.5em" height="1.5em" color="#666"></i-ep-Fold>
                <i-ep-Fold v-else width="1.5em" height="1.5em" color="#666"></i-ep-Fold>
              </div>
            </div>
            <div class="align-center display-flex">
              <!-- 通知 -->
              <el-link :underline="false" type="info" class="mr-24" href="/notification">
                <i-ep-Bell class="bell"></i-ep-Bell>
              </el-link>
              <!-- 用户部分 -->
              <el-dropdown @command="handleCommand">
                <div class="display-flex align-center cursor-pointer">
                  <avatar :name="userStore.name" :avatar="userStore.userData.thumb"></avatar>
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
          <router-view v-slot="{ Component, route }">
            <!-- <transition appear enter-active-class="animate__faster animate__animated animate__fadeInRight" > -->
              <component :is="Component" :key="route.path"></component>
            <!-- </transition> -->
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
$bg-color: #001529;
:deep(.el-aside) {
  @extend %scroll-bar-hidden;
  transition: width .2s;
}
.el-aside {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  margin-right: -1px;
  line-height: 0;
}

.expand-btn {
  cursor: pointer;
  height: 100%;
  transition: background-color .3s;
  width: 55px;
  &:hover {
    background-color: rgba(192, 196, 204, .3);
  }
}

.logo {
  width: 100%;
  height: 60px;
  overflow: hidden;
  flex: 1 0 60px;
  max-height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #f5f7fa;
  background-color: $bg-color;
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

.el-header {
  padding-left: 0;
}

.el-menu {
  border-right: 0;
  height: 100%;
  overflow: auto;
  @extend %scroll-bar-hidden;
}

.txt {
  background-color: #001529;
  height: 59px;
  line-height: 59px;
  text-align: center;
  color: #f5f7fa;
  font-size: 23px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.animate__fadeOutRight {
  z-index: 0;
  opacity: 0;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    -webkit-transform: translate3d(20%, 0, 0);
    transform: translate3d(20%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
.animate__fadeInRight {
  -webkit-animation-name: fadeInRight;
  animation-name: fadeInRight;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    -webkit-transform: translate3d(20%, 0, 0);
    transform: translate3d(20%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
.animate__fadeInRight {
  -webkit-animation-name: fadeInRight;
  animation-name: fadeInRight;
}

.menu-box {
  background-image: linear-gradient(to bottom, rgb(0, 21, 41), rgb(0, 21, 41));
  height: calc(100% - 60px);
  overflow-y: hidden;
  width: 100%;
}

// 侧边栏样式
.aside-bar-collapse {
  width: calc(var(--el-menu-icon-width) + var(--el-menu-base-level-padding) * 2)
}

.aside-bar-expand {
  width: 200px !important;
}

.aside-bar-pc {
  display: block;
  @media screen and (max-width: 960px) {
      display: none;
  }
}
.aside-bar-mobile {
  display: none;
  width: 200px;
  position: fixed;
  left: -200px;
  height: 100vh;
  top: 0;
  z-index: 9999;
  transition: left .3s;
  overflow: hidden;
  @media screen and (max-width: 960px) {
    display: block;
  }
  .el-image {
    background-color: #f5f7fa;
  }
}

.aside-bar-collapse {
  width: calc(var(--el-menu-icon-width) + var(--el-menu-base-level-padding) * 2)
}

.aside-bar-mobile-expand {
  left: 0;
  .asideEl-mobile-curtain {
    opacity: .3;
  }
}
.aside-bar-mobile-collapse {
  left: -200px;
}
.asideEl-mobile-curtain {
  opacity: 0;
  z-index: -1;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: var(--el-color-black);
  transition: opacity .3;
}

</style>