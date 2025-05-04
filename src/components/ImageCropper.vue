<!-- src/components/ImageCropper.vue -->
<template>
  <div class="image-cropper">
    <input type="file" accept="image/*" @change="onFileChange" />

    <div v-if="imageUrl" class="cropper-container">
      <vue-cropper
        ref="cropper"
        :src="imageUrl"
        :aspect-ratio="4 / 3"
        :auto-crop-area="1"
        :view-mode="1"
        style="height: 300px; width: 400px"
      />
      <button @click="cropImage">Crop</button>
    </div>

    <div v-if="croppedImage" class="preview">
      <img :src="croppedImage" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'

const imageUrl = ref(null)
const croppedImage = ref(null)
const cropper = ref(null)

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    imageUrl.value = URL.createObjectURL(file)
  }
}

const cropImage = () => {
  if (cropper.value) {
    croppedImage.value = cropper.value.getCroppedCanvas({
      width: 400,
      height: 300,
    }).toDataURL('image/png')
  }
}
</script>

<style scoped>
.image-cropper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.cropper-container {
  margin-top: 10px;
}
.preview {
  margin-top: 10px;
  border: 1px solid #ccc;
  width: 400px;
  height: 300px;
}
.preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>