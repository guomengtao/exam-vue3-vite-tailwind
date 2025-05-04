<template>
  <div class="image-uploader">
    <my-upload
      :key="uploadKey"
      v-model="show"
      field="img"
      @crop-success="cropSuccess"
      :width="400"
      :height="300"
      :max-size="5000"
      :output-size="1"
      :quality="1"
      img-format="png"
      lang-type="zh"
      :no-circle="true"
      :no-square="true"
      :fixed="true"
      :fixed-number="[4, 3]"
    />

    <!-- 上传按钮 -->
    <div class="upload-button" @click="handleClick">
      📷
    </div>

    <!-- 裁剪后的预览图 -->
    <div v-if="imagePreview" class="preview-container">
      <img
        :src="imagePreview"
        class="preview-image"
        @load="onImageLoad"
      />
    </div>

    <!-- 图像尺寸信息 -->
    <div v-if="imageSize.width && imageSize.height" class="image-info">
      图片尺寸：{{ imageSize.width }} × {{ imageSize.height }}
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import myUpload from 'vue-image-crop-upload'

const props = defineProps({
  image: String
})
const emit = defineEmits(['update:image'])

const show = ref(false)
const uploadKey = ref(0)
const imagePreview = ref(props.image || '')
const imageSize = ref({ width: 0, height: 0 })

const handleClick = () => {
  show.value = false
  uploadKey.value++
  nextTick(() => {
    show.value = true
  })
}

const cropSuccess = (imgDataUrl) => {
  imagePreview.value = imgDataUrl
  emit('update:image', imgDataUrl)
}

const onImageLoad = (event) => {
  const img = event.target
  imageSize.value = {
    width: img.naturalWidth,
    height: img.naturalHeight
  }
}
</script>

<style scoped>
.image-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #409eff;
  color: white;
  font-size: 24px;
  line-height: 60px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background-color 0.3s;
}
.upload-button:hover {
  background-color: #66b1ff;
}

.preview-container {
  width: 400px;
  height: 300px;
  border: 1px solid #ccc;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-info {
  margin-top: 10px;
  font-size: 14px;
  color: #333;
}
</style>