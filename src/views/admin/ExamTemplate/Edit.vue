<template>
  <div class="p-6 space-y-6 max-w-5xl mx-auto">
    <div class="flex items-center justify-between border-b pb-4 mb-6">
      <h1 class="text-2xl font-bold">编辑试卷模板</h1>
      <router-link
        to="/admin/exam-template/list"
        class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
      >
        返回列表
      </router-link>
    </div>

    <div v-if="loading">正在加载...</div>
    <div v-else-if="error" class="text-red-600">请求失败：{{ error }}</div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-4 bg-white p-6 shadow rounded">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium">标题</label>
          <input v-model="form.title" type="text" class="form-input w-full" required />
        </div>
        <div>
          <label class="block text-sm font-medium">总分</label>
          <input v-model="form.total_score" type="number" class="form-input w-full" required />
        </div>
        <div>
          <label class="block text-sm font-medium">分类ID</label>
          <input v-model="form.category_id" type="text" class="form-input w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium">发布状态</label>
          <select v-model="form.status" class="form-select w-full">
            <option :value="1">已发布</option>
            <option :value="0">未发布</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium">描述</label>
        <textarea v-model="form.description" class="form-textarea w-full" rows="3" />
      </div>

      <div>
        <label class="block text-sm font-medium">封面图片链接</label>
        <input v-model="form.cover_image" type="text" class="form-input w-full" />
        <img v-if="form.cover_image" :src="form.cover_image" class="w-48 mt-2 rounded shadow" />
      </div>

      <div>
        <h2 class="text-xl font-semibold mt-6 mb-2">题目列表</h2>
        <div
          v-for="(q, index) in form.questions"
          :key="q.id || index"
          class="border-t pt-4 mt-4 space-y-2"
        >
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
              <input v-model="q.score" type="number" class="form-input w-full" />
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
                v-for="idx in getOptionCount(q.type)"
                :key="idx"
                class="flex items-center gap-2"
              >
                <input
                  :type="q.type === 'multi' ? 'checkbox' : 'radio'"
                  :name="`answer-${index}`"
                  :value="getOptionValue(q, idx-1)"
                  :checked="isOptionSelected(q, getOptionValue(q, idx-1))"
                  @change="updateAnswer(q, getOptionValue(q, idx-1), $event)"
                  :disabled="q.type === 'judge'"
                />
                <input
                  v-model="q.options[idx-1]"
                  type="text"
                  class="form-input flex-1"
                  :placeholder="getOptionPlaceholder(q.type, idx-1)"
                  :readonly="q.type === 'judge'"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="pt-4">
        <button
          type="submit"
          class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          保存修改
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-input,
.form-select,
.form-textarea {
  border: 1px solid #d1d5db;
  padding: 0.5rem;
  border-radius: 0.375rem;
  width: 100%;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import arrayToLetter from '@/utils/arrayToLetter'

const baseUrl = import.meta.env.VITE_API_BASE_URL
const route = useRoute()
const router = useRouter()
const id = route.query.id || route.params.id

const form = ref({
  questions: []
})
const loading = ref(true)
const error = ref('')

// 根据题目类型获取选项数量
function getOptionCount(type) {
  switch(type) {
    case 'judge': return 2    // 判断题固定2个选项
    default: return 4         // 其他类型固定4个选项
  }
}

// 获取选项值（确保选项存在）
function getOptionValue(question, index) {
  if (!question.options) {
    question.options = []
  }
  while (question.options.length <= index) {
    // 判断题预置"正确"、"错误"
    if (question.type === 'judge' && question.options.length < 2) {
      question.options.push(question.options.length === 0 ? '正确' : '错误')
    } else {
      question.options.push('')
    }
  }
  return question.options[index]
}

// 获取选项占位文本
function getOptionPlaceholder(type, index) {
  if (type === 'judge') {
    return index === 0 ? '正确' : '错误'
  }
  return `选项 ${String.fromCharCode(65 + index)}`
}

// 检查选项是否被选中
function isOptionSelected(question, option) {
  if (!option) return false
  if (question.type === 'multi') {
    return Array.isArray(question.correct_answer) && 
           question.correct_answer.includes(option)
  } else {
    return question.correct_answer === option
  }
}

// 更新答案选择
function updateAnswer(question, option, event) {
  if (!option || question.type === 'judge') return
  
  if (question.type === 'multi') {
    if (!Array.isArray(question.correct_answer)) {
      question.correct_answer = []
    }
    if (event.target.checked) {
      question.correct_answer.push(option)
    } else {
      question.correct_answer = question.correct_answer.filter(a => a !== option)
    }
  } else {
    question.correct_answer = option
  }
}

// 题目类型变化时重置选项
function handleTypeChange(question) {
  const optionCount = getOptionCount(question.type)
  question.options = question.options || []
  
  // 重置选项
  if (question.type === 'judge') {
    question.options = ['正确', '错误']
  } else {
    // 保持原有选项，不足的补空
    while (question.options.length < optionCount) {
      question.options.push('')
    }
    // 截断多余选项
    question.options = question.options.slice(0, optionCount)
  }
  
  // 重置答案
  question.correct_answer = question.type === 'multi' ? [] : ''
}

// 获取详情数据
function fetchDetail() {
  fetch(`${baseUrl}/api/exam_template?id=${id}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.code === 200) {
        // 确保每个题目有正确数量的选项
        data.data.questions = data.data.questions.map(q => {
          q.options = q.options || []
          const optionCount = getOptionCount(q.type)
          
          // 填充选项
          while (q.options.length < optionCount) {
            // 判断题预置"正确"、"错误"
            if (q.type === 'judge' && q.options.length < 2) {
              q.options.push(q.options.length === 0 ? '正确' : '错误')
            } else {
              q.options.push('')
            }
          }
          // 截断多余的选项
          q.options = q.options.slice(0, optionCount)
          
          // 初始化正确答案
          if (!q.correct_answer) {
            q.correct_answer = q.type === 'multi' ? [] : ''
          }
          
          return q
        })
        form.value = data.data
      } else {
        throw new Error(data.msg)
      }
    })
    .catch((err) => {
      error.value = err.message
    })
    .finally(() => {
      loading.value = false
    })
}

// 提交表单
function handleSubmit() {
  const transformedQuestions = arrayToLetter(form.value.questions)

  const enhancedQuestions = transformedQuestions.map((q) => {
    let bitmask = 0

    // 处理单选题
    if (q.type === 'single') {
      if (typeof q.correct_answer === 'string') {
        const index = q.correct_answer.charCodeAt(0) - 'A'.charCodeAt(0)
        if (index >= 0 && index < q.options.length) {
          bitmask = 1 << index
        }
      }
    }
    
    // 处理多选题
    else if (q.type === 'multi') {
      if (typeof q.correct_answer === 'string') {
        q.correct_answer = q.correct_answer.split(',')
      }

      if (Array.isArray(q.correct_answer)) {
        q.correct_answer.forEach((letter) => {
          const index = letter.charCodeAt(0) - 'A'.charCodeAt(0)
          if (index >= 0 && index < q.options.length) {
            bitmask |= 1 << index
          }
        })
      }
    }

    return { ...q, correct_answer_bitmask: bitmask }
  })

  const submitData = {
    ...form.value,
    questions: enhancedQuestions,
  }

  fetch(`${baseUrl}/api/exam_template`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submitData),
  })
    .then(res => res.json())
    .then((data) => {
      if (data.code === 200) {
        alert('保存成功')
        router.push(`/admin/exam-template/detail/${form.value.id}`)
      } else {
        alert(`保存失败：${data.msg}`)
      }
    })
    .catch((err) => {
      alert('请求失败：' + err.message)
    })
}

onMounted(() => {
  if (!id) {
    error.value = '缺少试卷模板 ID'
    loading.value = false
  } else {
    fetchDetail()
  }
})
</script>