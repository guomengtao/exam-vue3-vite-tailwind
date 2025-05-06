<!-- 📄 src/views/admin/ExamTemplate/Detail.vue -->
<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
  <h1 class="text-2xl font-bold">试卷模板详情</h1>
  <div class="flex gap-2">
    <router-link
      :to="`/admin/exam-template/edit/${result.id}`"
      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
    >
      编辑
    </router-link>
    <router-link
      to="/admin/exam-template/list"
      class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
    >
      返回列表
    </router-link>
  </div>
</div>

    <div v-if="loading">正在加载...</div>
    <div v-else-if="error" class="text-red-600">请求失败：{{ error }}</div>

    <div v-else class="bg-white shadow p-6 rounded space-y-4">
      <div><strong>ID：</strong>{{ result.id }}</div>
      <div><strong>标题：</strong>{{ result.title }}</div>
      <div><strong>描述：</strong>{{ result.description }}</div>
      <div v-if="result.cover_image">
        <strong>封面图片：</strong>
        <img :src="result.cover_image" alt="封面图" class="w-48 mt-2 rounded shadow" />
      </div>
      <div><strong>总分：</strong>{{ result.total_score }}</div>
      <div><strong>分类ID：</strong>{{ result.category_id }}</div>
      <div><strong>发布时间：</strong>{{ formatTimestamp(result.publish_time) }}</div>
      <div><strong>发布状态：</strong>{{ formatStatus(result.status) }}</div>
      <div><strong>创建人：</strong>{{ result.creator }}</div>
      <div><strong>创建时间：</strong>{{ formatDate(result.created_at) }}</div>
      <div><strong>更新时间：</strong>{{ formatDate(result.updated_at) }}</div>

      <div v-if="result.questions?.length" class="mt-6">
        <h2 class="text-xl font-semibold mb-2">题目列表</h2>
        <div
          v-for="(q, index) in result.questions"
          :key="q.id"
          class="border-t pt-4 mt-4 space-y-2"
        >
          <div><strong>题目 {{ index + 1 }}：</strong>{{ q.title }}</div>
          <div><strong>类型：</strong>{{ formatQuestionType(q.type) }}</div>
          <div><strong>分值：</strong>{{ q.score }}</div>
          <div v-if="q.image_url">
            <strong>题图：</strong>
            <img :src="q.image_url" alt="题图" class="w-32 mt-2" />
          </div>
          <div><strong>选项：</strong>
            <ul class="list-disc pl-6">
              <li v-for="(opt, idx) in q.options" :key="idx">{{ opt }}</li>
            </ul>
          </div>
          <div><strong>正确答案：</strong>{{ q.correct_answer }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const baseUrl = import.meta.env.VITE_API_BASE_URL
const route = useRoute()
const id = route.query.id || route.params.id

const result = ref({})
const error = ref('')
const loading = ref(true)

function fetchExamTemplate() {
  fetch(`${baseUrl}/api/exam_template?id=${id}`)
    .then(response => {
      if (!response.ok) throw new Error('请求失败')
      return response.json()
    })
    .then(data => {
      if (data.code === 200 && data.data) {
        result.value = data.data
      } else {
        throw new Error(data.msg || '无数据')
      }
    })
    .catch(err => {
      error.value = err.message
    })
    .finally(() => {
      loading.value = false
    })
}

function formatDate(dateStr) {
  if (!dateStr) return '无'
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function formatTimestamp(timestamp) {
  if (!timestamp) return '无'
  const d = new Date(timestamp * 1000)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function formatStatus(status) {
  switch (status) {
    case 1:
      return '已发布'
    case 0:
      return '未发布'
    default:
      return '未知状态'
  }
}

function formatQuestionType(type) {
  switch (type) {
    case 'single':
      return '单选题'
    case 'multi':
      return '多选题'
    case 'judge':
      return '判断题'
    default:
      return '未知类型'
  }
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