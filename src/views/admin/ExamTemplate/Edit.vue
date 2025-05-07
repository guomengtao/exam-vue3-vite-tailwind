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
              <select v-model="q.type" class="form-select w-full">
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
                v-for="(opt, idx) in q.options"
                :key="idx"
                class="flex items-center gap-2"
              >
                <input
                  :type="q.type === 'multi' ? 'checkbox' : 'radio'"
                  :name="`answer-${index}`"
                  :value="opt"
                  :checked="q.correct_answer.includes(opt)"
                  @change="updateAnswer(q, opt, $event)"
                />
                <input
                  v-model="q.options[idx]"
                  type="text"
                  class="form-input flex-1"
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

const form = ref({})
const loading = ref(true)
const error = ref('')

function fetchDetail() {
  fetch(`${baseUrl}/api/exam_template?id=${id}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.code === 200) {
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
 

 
function updateAnswer(question, option, event) {
  if (question.type === 'multi') {
    if (!Array.isArray(question.correct_answer)) question.correct_answer = []
    if (event.target.checked) {
      question.correct_answer.push(option)
    } else {
      question.correct_answer = question.correct_answer.filter((a) => a !== option)
    }
  } else {
    question.correct_answer = option
  }
}

function handleSubmit() {
  console.log('提交按钮被点击了！')

  // 保留原来的转换逻辑
  const transformedQuestions = arrayToLetter(form.value.questions)

  const enhancedQuestions = transformedQuestions.map((q) => {
    console.log(`处理问题：${q.title}`)
    console.log(`原始选项：`, q.options)
    console.log(`原始答案：`, q.correct_answer)

    let bitmask = 0

    // 处理单选题
    if (q.type === 'single') {
      if (typeof q.correct_answer === 'string') {
        const index = q.correct_answer.charCodeAt(0) - 'A'.charCodeAt(0)
        if (index >= 0 && index < q.options.length) {
          bitmask = 1 << index
        } else {
          console.warn(`单选题答案索引越界: ${q.correct_answer}`)
        }
      }
    }
    
    // 处理多选题
    else if (q.type === 'multi') {
      if (typeof q.correct_answer === 'string') {
        // 如果答案是字符串，例如 'A,C'，将其转换为数组
        q.correct_answer = q.correct_answer.split(',')
      }

      if (Array.isArray(q.correct_answer)) {
        q.correct_answer.forEach((letter) => {
          const index = letter.charCodeAt(0) - 'A'.charCodeAt(0)
          if (index >= 0 && index < q.options.length) {
            bitmask |= 1 << index
          } else {
            console.warn(`多选题答案索引越界: ${letter}`)
          }
        })
      }
    }

    console.log(`计算后的 bitmask: ${bitmask.toString(2)}`)
    return { ...q, correct_answer_bitmask: bitmask }
  })

  console.log('准备提交的题目：', JSON.stringify(enhancedQuestions, null, 2))

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