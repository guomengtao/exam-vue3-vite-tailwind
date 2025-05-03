<template>
  <div class="image-upload-page">
    <h2>Upload Your Image</h2>
    <ImageUploader />
  </div>
</template>

<script>
import ImageUploader from '@/components/ImageUploader.vue'; // 调整路径为你的实际路径

export default {
  name: 'ImageUploadPage',
  components: {
    ImageUploader,
  },
};
</script>

<style scoped>
.image-upload-page {
  text-align: center;
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}
</style>