<script lang="ts" setup>
import { computed } from 'vue'

const BackgroundList = [
  '#F44336', '#FF4081', '#9C27B0', '#673AB7',
  '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688',
  '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107',
  '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'
]

interface Props {
  avatar: string,
  name: string,
  backgroundColor?: string
}

function getRandomBackgroundColor (seed: number) {
  return BackgroundList[seed % BackgroundList.length]
}

const backgroundColor = computed<string>(() => {
  return props.backgroundColor || getRandomBackgroundColor(props.name.length)
})

const props = withDefaults(defineProps<Props>(), {
  name: '',
  avatar: ''
})

</script>

<template>
  <div class="">
    <el-image v-if="props.avatar" class="avatar" :src="props.avatar" mode="aspectFill" lazy-load="false" />
    <div v-else class="avatar align-item-center justify-content-center" :style="{ backgroundColor }">
      <text style="color: #f5f7fa">{{ props.name.slice(0, 1).toUpperCase() }}</text>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$size: 45px;
.avatar {
  width: $size;
  height: $size;
  border-radius: $size;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 21px;
}
</style>