<template>
  <div class="image-uploader">
    <my-upload
      field="img"
      @crop-success="cropSuccess"
      v-model="show"
      :width="300"
      :height="300"
      img-format="png"
      lang-type="zh"
      :no-circle="true"
      :no-square="true"
    ></my-upload>
    <div class="upload-button" @click="handleClick">
      <span v-if="!imagePreview">📷 选择图片</span>
      <img v-else :src="imagePreview" class="preview-image" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import myUpload from 'vue-image-crop-upload'

const props = defineProps({
  image: String
})
const emit = defineEmits(['update:image'])

const show = ref(false)
const imagePreview = ref(props.image || '')

const handleClick = () => {
  // 重置预览图片
  imagePreview.value = ''
  emit('update:image', '')
  // 显示选择图片界面
  show.value = true
}

const cropSuccess = (imgDataUrl, field) => {
  imagePreview.value = imgDataUrl
  emit('update:image', imgDataUrl)
}
</script>

<style scoped>
.image-uploader {
  display: inline-block;
}
.upload-button {
  width: 100px;
  height: 100px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  text-align: center;
  line-height: 100px;
  overflow: hidden;
  background-color: #f9f9f9;
  position: relative;
  transition: all 0.3s;
}
.upload-button:hover {
  border-color: #409eff;
  color: #409eff;
}
.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}
</style>