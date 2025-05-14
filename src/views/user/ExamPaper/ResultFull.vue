<template>
  <div class="max-w-5xl mx-auto p-6">
    <div class="flex items-center justify-between border-b pb-4 mb-6">
      <h1 class="text-2xl font-bold">答题结果详情</h1>
    </div>
    <div v-if="loading" class="py-10 text-center text-gray-600">正在加载...</div>
    <div v-else-if="error" class="py-10 text-center text-red-600">{{ error }}</div>
    <div v-else>
      <div class="bg-blue-50 border border-blue-200 p-4 rounded mb-6">
        <p v-if="result.paper_description" class="text-sm text-gray-500 mb-2">
          {{ result.paper_description }}
        </p>
        <h2 class="text-2xl font-bold text-blue-800 mb-2">{{ result.paper_title }}</h2>
        <p class="text-sm text-gray-600">用户名：{{ result.username }} ｜ 学号：{{ result.user_id }} ｜ 得分：{{ result.score }} ｜ 用时：{{ formatTime(result.created_at) }}</p>
      </div>
      <div class="bg-white shadow p-6 rounded space-y-2 mb-8">
        <div><span class="font-semibold">用户名：</span>{{ result.username }}</div>
        <div><span class="font-semibold">学号：</span>{{ result.user_id }}</div>
        <div><span class="font-semibold">试卷名称：</span>{{ result.paper_title }}</div>
        <div><span class="font-semibold">总得分：</span>{{ result.score }}</div>
        <div><span class="font-semibold">用时：</span>{{ formatDuration(result.duration) }}</div>
        <div><span class="font-semibold">提交时间：</span>{{ formatTime(result.created_at) }}</div>
        <div>
          <span class="font-semibold">答题状态：</span>
          <span
            :class="{
              'text-green-600': result.status === 'finished',
              'text-yellow-600': result.status === 'pending'
            }"
          >
            {{ statusText }}
          </span>
        </div>
      </div>
      <div v-if="result.questions && result.questions.length">
        <h2 class="text-xl font-semibold mb-2">题目明细</h2>
        <div
          v-for="(q, i) in result.questions"
          :key="q.id"
          class="border-t pt-4 mt-4"
          :class="{
            'border-l-4 border-green-500 bg-green-50': isCorrect(q),
            'border-l-4 border-red-500 bg-red-50': !isCorrect(q)
          }"
        >
          <div class="flex items-center justify-between">
            <div>
              <span class="mr-2 text-lg">
                {{ isCorrect(q) ? '✅' : '❌' }}
              </span>
              <span class="font-semibold">题目 {{ i + 1 }}：</span>{{ q.title }}
            </div>
            <div>
              <span class="px-2 py-1 rounded text-xs"
                :class="{
                  'bg-green-50 text-green-700': isCorrect(q),
                  'bg-red-50 text-red-700': !isCorrect(q)
                }"
              >
                {{ isCorrect(q) ? '✔ 正确' : '✘ 错误' }}
              </span>
            </div>
          </div>
          <div class="mt-1 flex flex-wrap gap-6 text-sm text-gray-700">
            <div>
              <span class="font-semibold">类型：</span>{{ formatType(q.type) }}
            </div>
            <div>
              <span class="font-semibold">分值：</span>{{ q.score }}分
            </div>
          </div>
          <div class="mt-2 text-sm text-gray-700" v-if="q.options">
            <div v-for="(opt, idx) in q.options" :key="idx" class="mb-1">
              <span class="inline-block w-6 font-bold">{{ String.fromCharCode(65 + idx) }}.</span>
              <span :class="{
                'text-green-600 font-semibold': q.correct_answer?.includes?.(idx),
                'text-blue-600': q.user_answer?.includes?.(idx)
              }">{{ opt }}</span>
              <span v-if="q.correct_answer?.includes?.(idx)" class="ml-1 text-green-600">（正确）</span>
              <span v-if="q.user_answer?.includes?.(idx) && !q.correct_answer?.includes?.(idx)" class="ml-1 text-blue-600">（你的选择）</span>
            </div>
          </div>
          <div class="mt-2">
            <div>
              <span class="font-semibold">你的答案：</span>
              <span :class="isCorrect(q) ? 'text-green-700' : 'text-red-700'">
                {{ formatAnswer(q.user_answer, q.type) }}
              </span>
            </div>
            <div>
              <span class="font-semibold">正确答案：</span>
              <span>{{ formatAnswer(q.correct_answer, q.type) }}</span>
            </div>
            <div v-if="q.explanation" class="mt-1 text-gray-500 text-xs">
              <span class="font-semibold">解析：</span>{{ q.explanation }}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-gray-500 text-center mt-10">暂无题目明细</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://47.120.38.206:8081'
const route = useRoute()
const paper_uuid = ref(route.params.paper_uuid)
const record_id = ref(route.params.record_id)

const result = ref({})
const error = ref('')
const loading = ref(true)

// 统一获取答题详情
async function fetchData() {
  try {
    loading.value = true
    let url = ''
    if (record_id.value) {
      url = `${baseUrl}/api/user/answer/${record_id.value}/full`
    } else if (paper_uuid.value) {
      url = `${baseUrl}/api/user/answer/full?paper_uuid=${paper_uuid.value}`
    } else {
      throw new Error('缺少参数')
    }
    const resp = await fetch(url)
    const data = await resp.json()
    if (data.code === 200 && data.data) {
      result.value = data.data
    } else {
      throw new Error(data.message || '无数据')
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function formatType(type) {
  switch (type) {
    case 'single': return '单选题'
    case 'multi': return '多选题'
    case 'judge': return '判断题'
    default: return type
  }
}

function formatAnswer(answer, type) {
  if (Array.isArray(answer)) return answer.map(i => String.fromCharCode(65 + i)).join(', ')
  if (typeof answer === 'boolean') return answer ? '正确' : '错误'
  if (typeof answer === 'string' && type === 'judge') {
    if (answer === 'T' || answer === 'true') return '正确'
    if (answer === 'F' || answer === 'false') return '错误'
  }
  if (typeof answer === 'number') return String.fromCharCode(65 + answer)
  return answer ?? '-'
}

function isCorrect(q) {
  return !!q.is_correct
}

function formatTime(ts) {
  if (!ts) return '-'
  const d = new Date(ts * 1000)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}分${secs}秒`
}

const statusText = computed(() => {
  if (!result.value.status) return '-'
  if (result.value.status === 'finished') return '已完成'
  if (result.value.status === 'pending') return '未完成'
  return result.value.status
})

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.answer-correct { color: #16a34a; }
.answer-wrong { color: #dc2626; }
</style>