<script lang="ts" setup>

defineProps<{
  showPaginate?: boolean
  total?: number
}>()

const emit = defineEmits<{
  (event: 'current-change', value: number): void
  (event: 'size-change', value: number): void
}>()
</script>

<template>
  <div>
    <div v-if="$slots.header" class="content-box mb-24">
      <slot name="header"></slot>
    </div>
    <div class="content-box">
      <div v-if="$slots.tools" class="mb-12 display-flex">
        <slot name="tools"></slot>
      </div>
      <slot></slot>
    </div>

    <div v-if="showPaginate" class="content-box mt-24">
      <el-row justify="end">
        <el-pagination background :page-sizes="[10, 20, 50, 100]" layout="prev, pager, next, sizes, total" @current-change="(page: number) => emit('current-change', page)" @size-change="(size: number) => emit('size-change', size)" :total="total || 0" />
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content-box {
  border-radius: 5px;
  padding: 24px;
  background-color: #fff;
}
</style>