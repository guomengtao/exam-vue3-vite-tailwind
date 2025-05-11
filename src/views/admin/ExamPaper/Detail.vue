<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">试卷详情</h1>
      <div class="flex gap-2">
        <GenerateExamButton :templateId="result.id" />
        <ExportExamButton :examData="result" />
        <ImportExamButton :templateId="result.id" @import-success="refreshData" />
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
      <div><strong>UUID：</strong>{{ result.uuid }}</div>
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
      <div><strong>关联模板ID：</strong>{{ result.template_id }}</div>

      <div v-if="parsedQuestions.length" class="mt-6">
        <h2 class="text-xl font-semibold mb-2">题目列表</h2>
        <div
          v-for="(q, index) in parsedQuestions"
          :key="index"
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
              <li v-for="(opt, idx) in q.options" :key="idx">
                {{ opt }} <span v-if="isCorrectAnswer(q, idx)" class="text-green-600 ml-2">✓</span>
              </li>
            </ul>
          </div>
          <div><strong>正确答案bitmask：</strong>{{ q.correct_answer_bitmask }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import GenerateExamButton from '@/components/GenerateExamButton.vue'
import ExportExamButton from '@/components/ExportExamButton.vue'
import ImportExamButton from '@/components/ImportExamButton.vue'

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://47.120.38.206:8081'
const route = useRoute()
const id = route.query.id || route.params.id

const result = ref({})
const error = ref('')
const loading = ref(true)

// 计算属性：解析questions JSON字符串
const parsedQuestions = computed(() => {
  try {
    return result.value.questions ? JSON.parse(result.value.questions) : []
  } catch (e) {
    console.error('解析题目数据失败:', e)
    return []
  }
})

// 检查是否为正确答案
const isCorrectAnswer = (question, optionIndex) => {
  if (!question.correct_answer_bitmask) return false
  return (question.correct_answer_bitmask & (1 << optionIndex)) !== 0
}

async function fetchExamTemplate() {
  try {
    loading.value = true
    const response = await fetch(`${baseUrl}/api/exam_paper/redis?uuid=${id}`)
    if (!response.ok) throw new Error('请求失败')
    
    const data = await response.json()
    if (data.code === 200 && data.data) {
      result.value = data.data
    } else {
      throw new Error(data.msg || '无数据')
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
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
    case 1: return '已发布'
    case 0: return '未发布'
    default: return '未知状态'
  }
}

function formatQuestionType(type) {
  switch (type) {
    case 'single': return '单选题'
    case 'multi': return '多选题'
    case 'judge': return '判断题'
    default: return '未知类型'
  }
}

onMounted(() => {
  if (!id) {
    error.value = '缺少试卷UUID'
    loading.value = false
  } else {
    fetchExamTemplate()
  }
})
</script>