<script lang="ts" setup>
defineProps<{
  menus: layout.Menus[],
  isCollapse?: boolean
}>()
</script>

<template>
  <el-menu :collapse="isCollapse" unique-opened router>
    <menu-item :menus="menus"></menu-item>
  </el-menu>
</template>

<style lang="scss" scoped>
$hover-text-color: #409eff;
:deep(.el-menu), .el-menu {
  --el-menu-hover-text-color: $hover-text-color;
  --el-menu-text-color: #f5f7fa;
  --el-menu-hover-bg-color: #001529;
  --el-menu-active-color: #409eff;
  --el-menu-bg-color: #0f2438;
  background-image: linear-gradient(to bottom, rgba(0, 21, 41, 1), rgba(0, 21, 41, 1));
}
:deep(.el-menu-item), :deep(.el-sub-menu__title) {
  &:hover {
    color: $hover-text-color;
  }
}
</style>