<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">试卷列表</h1>

    <div v-if="loading">正在加载...</div>
    <div v-else-if="error" class="text-red-600">请求失败：{{ error }}</div>

    <div v-else>
      <!-- 表格显示数据 -->
      <table class="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th class="px-4 py-2 border-b text-left">ID</th>
            <th class="px-4 py-2 border-b text-left">试卷名称</th>
            <th class="px-4 py-2 border-b text-left">创建时间</th>
            <th class="px-4 py-2 border-b text-left">状态</th>
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
                :to="`/admin/exam-paper/detail/${item.uuid}`"
                class="text-blue-600 hover:underline"
              >
                {{ item.title || '未命名试卷' }}
              </router-link>
            </td>
            <td class="px-4 py-2">{{ formatDate(item.created_at) }}</td>
            <td class="px-4 py-2">
              <span :class="statusClass(item.status)">
                {{ formatStatus(item.status) }}
              </span>
            </td>
            <td class="px-4 py-2 space-x-2">
              <router-link
                :to="`/exam/detail/${item.uuid}`"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400"
              >
                查看试卷
              </router-link>
              <button
                @click="deletePaper(item.id)"
                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400"
              >
                删除
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
const limit = 20
const total = ref(0)

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://47.120.38.206:8081'

const totalPages = computed(() => Math.ceil(total.value / limit))

const router = useRouter()

// 修改后的获取试卷列表方法
function fetchExamPapers() {
  loading.value = true
  fetch(`${baseUrl}/api/exam_paper/redis?page=${page.value}&limit=${limit}`)
    .then(response => {
      if (!response.ok) throw new Error('请求失败')
      return response.json()
    })
    .then(data => {
      if (data.code === 200 && data.data) {
        result.value = data.data.list || []
        total.value = data.data.pagination?.total || 0
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

// 状态格式化
function formatStatus(status) {
  const statusMap = {
    0: '未开始',
    1: '进行中',
    2: '已结束',
    3: '已归档'
  }
  return statusMap[status] || '未知状态'
}

// 状态样式
function statusClass(status) {
  const classMap = {
    0: 'text-gray-500',
    1: 'text-green-500',
    2: 'text-blue-500',
    3: 'text-purple-500'
  }
  return classMap[status] || 'text-gray-500'
}

// 删除试卷
function deletePaper(id) {
  if (confirm('确定要删除这份试卷吗？')) {
    fetch(`${baseUrl}/api/exam_paper/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) {
          fetchExamPapers() // 刷新列表
        } else {
          throw new Error(data.msg || '删除失败')
        }
      })
      .catch(err => {
        alert('删除失败: ' + err.message)
      })
  }
}

// 分页控制
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

// 格式化时间
function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString()
}

// 自动加载初始页和监听分页变化
onMounted(fetchExamPapers)
watch(page, fetchExamPapers)
</script>

<style scoped>
/* 保持原有样式不变 */
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