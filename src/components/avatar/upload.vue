<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/modules/user'

interface Props {
  modelValue: string
}

interface UploadResponse {
  data: {
    url: string
  }
}

defineProps<Props>()

const userStore = useUserStore()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

// 预览图片
const dialogVisible = ref(false)
const handlePreview = () => {
  dialogVisible.value = true
}

// 移除图片
const handleRemove = () => {
  emit('update:modelValue', '')
}

// 处理上传成功事件
const handleSuccess = (res: UploadResponse) => {
  emit('update:modelValue', res.data.url)
}
</script>

<template>
  <el-upload :action="$upload_url" :show-file-list="false" name="file" :headers="{ Authorization: userStore._token }" :on-success="handleSuccess" class="upload-avatar">
    <div v-if="modelValue" class="img-box position-relative" @click.stop>
      <img :src="modelValue" alt="">
      <div class="tools w-100 h-100 position-absolute display-flex justify-around align-center">
        <span @click.prevent.stop="handlePreview" color="f5f7fa"><i-ep-ZoomIn class="icon" /></span>
        <span @click.prevent.stop="handleRemove"><i-ep-Delete class="icon" /></span>
      </div>
    </div>
    <div v-else class="img-box display-flex justify-center align-center"><i-ep-plus></i-ep-plus></div>
  </el-upload>
  <el-dialog v-model="dialogVisible" class="preview-dialog">
    <img w-full v-if="modelValue" :src="modelValue" alt="Preview Image" />
  </el-dialog>
</template>

<style lang="scss" scoped>
$size: 120px;
.img-box {
  width: $size;
  height: $size;
  border-radius: 5px;
  border: 1px dashed var(--el-border-color);
  img {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
  svg {
    color: var(--el-color-info);
    width: 2em;
    height: 2em;
  }
}

.tools {
  left: 0;
  top: 0;
  opacity: 0;
  border-radius: 5px;
  transition: opacity .3s;
  background: rgba(0, 0, 0, .5);
  &:hover {
    opacity: 1;
  }
  svg {
    color: $ivory;
    width: 1.2em;
    height: 1.2em;
  }
}
.icon {
  color: $ivory;
}

.upload-avatar {
  width: 120px;
  height: 120px;
  overflow: hidden;
}
</style>