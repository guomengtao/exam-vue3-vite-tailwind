<!-- 📄 src/views/admin/ExamTemplate/Edit.vue -->
<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
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

    <div v-else class="bg-white shadow p-6 rounded space-y-4">
      <div>
        <label class="font-semibold">标题：</label>
        <input v-model="result.title" class="border p-1 w-full rounded" />
      </div>
      <div>
        <label class="font-semibold">描述：</label>
        <textarea v-model="result.description" class="border p-1 w-full rounded" />
      </div>
      <div>
        <label class="font-semibold">总分：</label>
        <input v-model.number="result.total_score" type="number" class="border p-1 w-24 rounded" />
      </div>
      <div>
        <label class="font-semibold">分类ID：</label>
        <input v-model="result.category_id" class="border p-1 w-full rounded" />
      </div>
      <div>
        <label class="font-semibold">发布时间：</label>
        <input v-model.number="result.publish_time" type="number" class="border p-1 w-full rounded" />
      </div>
      <div>
        <label class="font-semibold">发布状态：</label>
        <select v-model="result.status" class="border p-1 rounded">
          <option :value="1">已发布</option>
          <option :value="0">未发布</option>
        </select>
      </div>
      <div>
        <label class="font-semibold">创建人：</label>
        <input v-model="result.creator" class="border p-1 w-full rounded" />
      </div>

      <div v-if="result.questions?.length" class="mt-6">
        <h2 class="text-xl font-semibold mb-2">题目列表</h2>
        <div
          v-for="(q, index) in result.questions"
          :key="q.id"
          class="border-t pt-4 mt-4 space-y-2"
        >
          <div>
            <label>题目 {{ index + 1 }}：</label>
            <input v-model="q.title" class="border p-1 w-full rounded" />
          </div>
          <div>
            <label>类型：</label>
            <select v-model="q.type" class="border p-1 rounded">
              <option value="single">单选题</option>
              <option value="multi">多选题</option>
              <option value="judge">判断题</option>
            </select>
          </div>
          <div>
            <label>分值：</label>
            <input v-model.number="q.score" type="number" class="border p-1 w-24 rounded" />
          </div>
          <div>
            <label>选项：</label>
            <div v-for="(opt, idx) in q.options" :key="idx" class="flex items-center gap-2">
              <input v-model="q.options[idx]" class="border p-1 w-full rounded" />
              <button @click="q.options.splice(idx, 1)" class="text-red-600">删除</button>
            </div>
            <button @click="q.options.push('')" class="mt-1 text-blue-600">添加选项</button>
          </div>
          <div>
            <label>正确答案：</label>
            <input v-model="q.correct_answer" class="border p-1 w-full rounded" />
          </div>
        </div>
      </div>

      <button
        @click="updateExamTemplate"
        class="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
      >
        保存修改
      </button>
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

function updateExamTemplate() {
  fetch(`${baseUrl}/api/exam_template`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(result.value)
  })
    .then((res) => {
      if (!res.ok) throw new Error('保存失败')
      return res.json()
    })
    .then((data) => {
      if (data.code === 200) {
        alert('保存成功')
      } else {
        throw new Error(data.msg || '未知错误')
      }
    })
    .catch((err) => {
      alert('保存失败：' + err.message)
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

<style scoped>
input, textarea, select {
  margin-top: 4px;
  display: block;
}
</style>
