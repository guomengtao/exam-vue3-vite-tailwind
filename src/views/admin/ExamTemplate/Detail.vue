<!-- 📄 src/views/admin/ExamTemplate/Detail.vue -->
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">试卷模板详情</h1>
    <div v-if="loading">正在加载...</div>
    <div v-else-if="error" class="text-red-600">请求失败：{{ error }}</div>
    <pre v-else class="bg-gray-100 p-4 rounded">{{ result }}</pre>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// ✅ 从环境变量读取 API 地址
const baseUrl = import.meta.env.VITE_API_BASE_URL

const route = useRoute()
const result = ref(null)
const error = ref('')
const loading = ref(true)

const id = route.query.id || route.params.id

function fetchExamTemplate() {
  fetch(`${baseUrl}/api/exam_template?id=${id}`)
    .then(response => {
      if (!response.ok) throw new Error('请求失败')
      return response.json()
    })
    .then(data => {
      result.value = data
    })
    .catch(err => {
      error.value = err.message
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  if (!id) {
    error.value = '缺少试卷模板 ID'
    loading.value = false
  } else {
    fetchExamTemplate()
  }
})
</script>