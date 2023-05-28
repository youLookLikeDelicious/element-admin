<script lang="ts" setup>
defineProps<{ menus: layout.Menus[] }>()

</script>

<template>
  <template v-for="menu in menus" :key="menu.id">
    <el-sub-menu v-if="menu.list" :index="menu.id + ''" :key="menu.id + 'bb'">
      <template #title>
        <i :class="['iconfont', 'mr-12', menu.icon]"></i>
        {{ menu.title }}
      </template>
      <menu-item :menus="menu.list"></menu-item>
    </el-sub-menu>
    <el-menu-item v-else :index="`/${menu.src}`" :key="menu.id + 'aa'">
      &nbsp;&nbsp;&nbsp;{{ menu.title }}
    </el-menu-item>
  </template>
</template>

<style lang="scss" scoped>
</style>