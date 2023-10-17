<script lang="ts" setup>
defineProps<{ menus?: layout.Menus[] }>()

</script>

<template>
  <template v-for="menu in menus || []" :key="menu.id">
    <el-sub-menu v-if="menu.children" :index="menu.id + ''" :key="menu.id + 'bb'">
      <template #title>
        <i :class="['iconfont', 'mr-12', menu.icon]"></i>
        <span>{{ menu.name }}</span>
      </template>
      <menu-item :menus="menu.children"></menu-item>
    </el-sub-menu>
    <el-menu-item v-else :index="`/${menu.url}`" :key="menu.id + 'aa'">
      <i :class="['iconfont', 'mr-12', menu.icon]"></i>
      <span>{{ menu.name }}</span>
    </el-menu-item>
  </template>
</template>

<style lang="scss" scoped>
</style>