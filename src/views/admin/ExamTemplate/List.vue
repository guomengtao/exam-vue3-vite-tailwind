<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">试卷模板列表</h1>

    <div v-if="loading">正在加载...</div>
    <div v-else-if="error" class="text-red-600">请求失败：{{ error }}</div>

    <div v-else>
      <!-- 表格显示数据 -->
      <table class="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th class="px-4 py-2 border-b text-left">ID</th>
            <th class="px-4 py-2 border-b text-left">标题</th>
            <th class="px-4 py-2 border-b text-left">发布时间</th>
            <th class="px-4 py-2 border-b text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in result"
            :key="item.id"
            class="border-b hover:bg-gray-50"
          >
            <td class="px-4 py-2">{{ item.id }}</td>
            <td class="px-4 py-2">
  <router-link
    :to="`/admin/exam-template/detail/${item.id}`"
    class="text-blue-600 hover:underline"
  >
    {{ item.title }}
  </router-link>
</td>
            <td class="px-4 py-2">{{ formatDate(item.created_at) }}</td>
            <td class="px-4 py-2 space-x-2">
              <!-- 操作按钮 -->
              <button
                @click="editTemplate(item.id)"
                class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-400"
              >
                编辑
              </button>
              <router-link
                :to="`/admin/exam-template/detail/${item.id}`"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400"
              >
                详情
              </router-link>
              <button
                @click="deleteTemplate(item.id)"
                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400"
              >
                删除
              </button>
              <button
                @click="generateExam(item.id)"
                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-400"
              >
                生成试卷
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 分页控制器 -->
      <div class="flex justify-between items-center mt-6">
        <button
          @click="prevPage"
          :disabled="page <= 1"
          class="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          上一页
        </button>
        <span>第 {{ page }} / {{ totalPages }} 页</span>
        <button
          @click="nextPage"
          :disabled="page >= totalPages"
          class="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const result = ref([])
const error = ref('')
const loading = ref(true)

const page = ref(1)
const limit = 2
const total = ref(0)

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://47.120.38.206:8081'

const totalPages = computed(() => Math.ceil(total.value / limit))

const router = useRouter()

function fetchExamTemplates() {
  loading.value = true
  fetch(`${baseUrl}/api/exam_template?page=${page.value}&limit=${limit}`)
    .then(response => {
      if (!response.ok) throw new Error('请求失败')
      return response.json()
    })
    .then(data => {
      if (data.code === 200 && data.data) {
        // 通过 ID 倒序排列数据
        result.value = data.data.list.sort((a, b) => b.id - a.id)
        total.value = data.data.pagination.total
      } else {
        throw new Error(data.msg || '接口格式错误')
      }
    })
    .catch(err => {
      error.value = err.message
    })
    .finally(() => {
      loading.value = false
    })
}

function nextPage() {
  if (page.value < totalPages.value) {
    page.value++
  }
}

function prevPage() {
  if (page.value > 1) {
    page.value--
  }
}

// 操作按钮处理函数
function editTemplate(id) {
  console.log(`编辑模板，ID: ${id}`)
}

function deleteTemplate(id) {
  console.log(`删除模板，ID: ${id}`)
}

function generateExam(id) {
  console.log(`生成试卷，ID: ${id}`)
}

// 格式化时间：年月日 时 分
function formatDate(dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 自动加载初始页和监听分页变化
onMounted(fetchExamTemplates)
watch(page, fetchExamTemplates)
</script>

<style scoped>
/* 样式可以根据需要修改 */
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #e0e0e0;
  text-align: left;
  padding: 8px;
}

th {
  background-color: #f9fafb;
}

button {
  transition: background-color 0.3s ease;
}

button:hover {
  cursor: pointer;
}
</style>