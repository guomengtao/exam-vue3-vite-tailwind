<template>
  <div class="option-item">
    <!-- 选项标签（如 A, B, C） -->
    <span class="option-label">{{ label }}.</span>

    <!-- 输入框 -->
    <input
      type="text"
      v-model="model.text"
      class="option-input"
      placeholder="请输入选项内容"
    />

    <!-- 图片上传 -->
    <div class="image-upload">
      <label class="upload-button">
        📷 上传图片
        <input type="file" accept="image/*" @change="onFileChange" hidden />
      </label>

      <!-- 图片预览 -->
      <div v-if="model.image" class="image-preview">
        <img :src="model.image" alt="预览图" />
        <button class="remove-image" @click="removeImage">✖</button>
      </div>
    </div>

    <!-- 删除选项按钮 -->
    <button class="delete-option" @click="$emit('delete')">🗑</button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Object,
  label: String
})
const emit = defineEmits(['update:modelValue', 'delete'])

const model = defineModel()

// 图片选择处理
function onFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      model.value.image = reader.result
    }
    reader.readAsDataURL(file)
  }
}

// 删除图片
function removeImage() {
  model.value.image = ''
}
</script>

<style scoped>
.option-item {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.option-label {
  width: 24px;
  font-weight: bold;
}

.option-input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  min-width: 200px;
}

.image-upload {
  display: flex;
  align-items: center;
  gap: 8px;
}

.upload-button {
  display: inline-block;
  background-color: #409eff;
  color: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}

.image-preview {
  position: relative;
  display: inline-block;
}

.image-preview img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.remove-image {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #f56c6c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 12px;
  cursor: pointer;
  line-height: 18px;
  text-align: center;
}

.delete-option {
  background: none;
  border: none;
  color: #f56c6c;
  font-size: 18px;
  cursor: pointer;
}
.delete-option:hover {
  color: #e45656;
}
</style>