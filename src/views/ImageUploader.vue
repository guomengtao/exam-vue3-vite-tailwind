<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">上传题目图片</h2>
    
    <!-- 上传区域 -->
    <div 
      class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input 
        type="file" 
        ref="fileInput"
        class="hidden" 
        accept="image/jpeg,image/png"
        @change="handleFileChange"
      >
      
      <div v-if="!previewUrl" class="space-y-2">
        <CloudArrowUpIcon class="w-10 h-10 mx-auto text-gray-400" />
        <p class="text-gray-600">
          <span class="text-blue-500 font-medium">点击上传</span> 或拖拽图片到此处
        </p>
        <p class="text-sm text-gray-400">支持 JPG/PNG 格式，大小不超过2MB</p>
      </div>
      
      <div v-else class="relative">
        <img :src="previewUrl" alt="预览" class="max-h-60 mx-auto rounded" />
        <button 
          @click.stop="removeImage"
          class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
    
    <!-- 上传按钮 -->
    <button
      v-if="previewUrl && !isUploading"
      @click="uploadImage"
      class="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
    >
      确认上传
    </button>
    
    <!-- 上传状态 -->
    <div v-if="isUploading" class="mt-4 text-center">
      <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      <p class="mt-2 text-gray-600">上传中...</p>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 text-red-700 rounded">
      {{ errorMessage }}
    </div>
    
    <!-- 上传结果 -->
    <div v-if="uploadResult" class="mt-4 p-3 bg-green-100 text-green-700 rounded">
      上传成功！图片URL: 
      <a :href="uploadResult" target="_blank" class="underline">{{ uploadResult }}</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const fileInput = ref(null)
const previewUrl = ref('')
const isUploading = ref(false)
const errorMessage = ref('')
const uploadResult = ref('')
const dragOver = ref(false)

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) validateAndPreview(file)
}

const handleDrop = (e) => {
  dragOver.value = false
  const file = e.dataTransfer.files[0]
  if (file) validateAndPreview(file)
}

const validateAndPreview = (file) => {
  // 重置状态
  errorMessage.value = ''
  uploadResult.value = ''
  
  // 验证文件类型
  const validTypes = ['image/jpeg', 'image/png']
  if (!validTypes.includes(file.type)) {
    errorMessage.value = '只支持JPG/PNG格式图片'
    return
  }
  
  // 验证文件大小 (2MB)
  if (file.size > 2 * 1024 * 1024) {
    errorMessage.value = '图片大小不能超过2MB'
    return
  }
  
  // 预览图片
  previewUrl.value = URL.createObjectURL(file)
}

const removeImage = () => {
  previewUrl.value = ''
  fileInput.value.value = ''
}

const uploadImage = async () => {
  if (!previewUrl.value) return
  
  isUploading.value = true
  errorMessage.value = ''
  
  try {
    const file = fileInput.value.files[0]
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('http://47.120.38.206:8081/api/upload', {
      method: 'POST',
      body: formData
    })
    
    const result = await response.json()
    
    if (response.ok) {
      uploadResult.value = result.url
    } else {
      errorMessage.value = result.error || '上传失败'
    }
  } catch (error) {
    errorMessage.value = '网络错误，请重试'
  } finally {
    isUploading.value = false
  }
}
</script>