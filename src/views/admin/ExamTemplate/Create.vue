<template>
  <div class="p-6 space-y-6 max-w-5xl mx-auto">
    <div class="flex items-center justify-between border-b pb-4 mb-6">
      <h1 class="text-2xl font-bold">新建试卷模板</h1>
              <ImportExamButton @import-success="handleImportSuccess" class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500"/>

      <router-link
        to="/admin/exam-template/list"
        class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
      >
        返回列表
      </router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4 bg-white p-6 shadow rounded">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium">标题</label>
          <input v-model="form.title" type="text" class="form-input w-full" required />
        </div>
        <div>
          <label class="block text-sm font-medium">描述</label>
          <textarea v-model="form.description" class="form-textarea w-full" rows="3" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium">封面图片链接</label>
        <input v-model="form.cover_image" type="text" class="form-input w-full" />
        <img v-if="form.cover_image" :src="form.cover_image" class="w-48 mt-2 rounded shadow" />
      </div>

      <div>
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-xl font-semibold">题目列表</h2>
          <div class="text-lg font-medium">
            总分：<span class="text-blue-600">{{ totalScore }}</span>
          </div>
        </div>

        <div
          v-for="(q, index) in form.questions"
          :key="index"
          class="border-t pt-4 mt-4 space-y-2 relative"
        >
          <button
            type="button"
            @click="removeQuestion(index)"
            class="absolute top-2 right-0 text-red-600 hover:text-red-800 delete-btn"
            title="删除此题"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium">题目 {{ index + 1 }}</label>
              <input v-model="q.title" type="text" class="form-input w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium">类型</label>
              <select v-model="q.type" class="form-select w-full" @change="handleTypeChange(q)">
                <option value="single">单选题</option>
                <option value="multi">多选题</option>
                <option value="judge">判断题</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium">分值</label>
              <input 
                v-model.number="q.score" 
                type="number" 
                min="0"
                class="form-input w-full" 
              />
            </div>
            <div>
              <label class="block text-sm font-medium">题图链接</label>
              <input v-model="q.image_url" type="text" class="form-input w-full" />
              <img v-if="q.image_url" :src="q.image_url" class="w-32 mt-2" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium">选项</label>
            <ul class="space-y-1">
              <li
                v-for="(opt, idx) in q.options"
                :key="idx"
                class="flex items-center gap-2"
              >
                <input
                  :type="q.type === 'multi' ? 'checkbox' : 'radio'"
                  :name="`answer-${index}`"
                  :value="opt"
                  :checked="(q.correct_answer_bitmask & (1 << idx)) !== 0"
                  @change="handleBitmaskChange(q, idx, $event)"
                  :disabled="q.type === 'judge'"
                />
                <span class="option-letter">{{ String.fromCharCode(65 + idx) }}.</span>
                <input
                  v-model="q.options[idx]"
                  type="text"
                  class="form-input flex-1"
                  :readonly="q.type === 'judge'"
                />
              </li>
            </ul>
          </div>
        </div>

        <div class="pt-4">
          <button
            type="button"
            @click="addQuestion"
            class="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
          >
            + 添加题目
          </button>
        </div>
      </div>

      <div class="pt-4">
        <button
          type="submit"
          class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          创建试卷
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import ImportExamButton from '@/components/ImportExamButton.vue'

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const baseUrl = import.meta.env.VITE_API_BASE_URL
const router = useRouter()

// 初始化空表单
const form = ref({
  title: '',
  description: '',
  cover_image: '',
  total_score: 0, // 初始化总分字段
  questions: [createEmptyQuestion()] // 默认一个空题目
})

// 计算总分
const totalScore = computed(() => {
  const score = form.value.questions.reduce((sum, q) => sum + (Number(q.score) || 0), 0)
  form.value.total_score = score // 更新表单中的总分
  return score
})

// 创建空题目
function createEmptyQuestion() {
  return {
    id: Date.now(), // 临时ID
    type: 'single',
    title: '',
    score: 5, // 默认5分
    options: ['', '', '', ''],
    image_url: '',
    correct_answer_bitmask: 0
  }
}

// 添加新题目
function addQuestion() {
  form.value.questions.push(createEmptyQuestion())
}

// 删除题目
function removeQuestion(index) {
  if (form.value.questions.length <= 1) {
    alert('至少需要保留一道题目')
    return
  }
  if (confirm('确定要删除这道题目吗？')) {
    form.value.questions.splice(index, 1)
  }
}

// 根据题目类型获取选项数量
function getOptionCount(type) {
  switch(type) {
    case 'judge': return 2
    default: return 4
  }
}

// 处理bitmask变化
function handleBitmaskChange(question, index, event) {
  const mask = 1 << index
  if (question.type === 'multi') {
    question.correct_answer_bitmask = event.target.checked
      ? question.correct_answer_bitmask | mask
      : question.correct_answer_bitmask & ~mask
  } else {
    question.correct_answer_bitmask = event.target.checked ? mask : 0
  }
}

// 题目类型变化时重置
function handleTypeChange(question) {
  const optionCount = getOptionCount(question.type)
  question.options = question.options || []
  
  // 初始化选项
  while (question.options.length < optionCount) {
    question.options.push(
      question.type === 'judge' 
        ? (question.options.length ? '错误' : '正确')
        : ''
    )
  }
  question.options = question.options.slice(0, optionCount)
  question.correct_answer_bitmask = 0
}

// 提交表单（POST方式）
function handleSubmit() {
  const submitData = {
    ...form.value,
    questions: form.value.questions.map(q => ({
      type: q.type,
      title: q.title,
      score: Number(q.score) || 0,
      options: q.options,
      image_url: q.image_url,
      correct_answer_bitmask: q.correct_answer_bitmask || 0
    }))
  }

  fetch(`${baseUrl}/api/exam_template`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submitData)
  })
    .then(res => res.json())
    .then(data => {
      if (data.code === 200) {
        alert('创建成功')
        router.push('/admin/exam-template/list')
      } else {
        alert(`创建失败：${data.msg}`)
      }
    })
    .catch(err => {
      alert('请求失败：' + err.message)
    })
}
</script>

<style scoped>
.form-input,
.form-select,
.form-textarea {
  border: 1px solid #d1d5db;
  padding: 0.5rem;
  border-radius: 0.375rem;
  width: 100%;
}
.option-letter {
  font-weight: bold;
  min-width: 1.5rem;
  display: inline-block;
}
.delete-btn {
  transition: all 0.2s;
}
.delete-btn:hover {
  transform: scale(1.1);
}
</style>