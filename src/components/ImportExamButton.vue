<template>
  <button
    @click="handleImport"
    class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500"
    :disabled="loading"
  >
    <span v-if="loading">导入中...</span>
    <span v-else>导入为新模板</span>
  </button>
  <input
    type="file"
    ref="fileInput"
    accept=".xlsx,.xls"
    @change="parseFile"
    class="hidden"
  />
</template>

<script setup>
import { ref } from 'vue'
import * as XLSX from 'xlsx'
import { useToast } from 'vue-toast-notification'
import { useRouter } from 'vue-router'

const emit = defineEmits(['import-success'])
const $toast = useToast()
const router = useRouter()
const fileInput = ref(null)
const loading = ref(false)

const handleImport = () => {
  fileInput.value.click()
}

const parseFile = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  loading.value = true
  try {
    // 1. 读取Excel文件
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data)
    
    // 2. 解析数据
    const basicSheet = workbook.Sheets['基本信息']
    const basicData = XLSX.utils.sheet_to_json(basicSheet)[0]
    
    const questionSheet = workbook.Sheets['题目列表']
    const questionData = XLSX.utils.sheet_to_json(questionSheet)

    // 3. 构建创建请求数据
    const payload = {
      title: basicData['标题'],
      description: basicData['描述'],
      total_score: Number(basicData['总分']) || 100,
      status: 0, // 默认未发布状态
      questions: questionData.map(q => ({
        title: q['题目'],
        type: getQuestionType(q['题型']),
        score: Number(q['分值']) || 5,
        options: q['选项']?.split('|').filter(Boolean) || [],
        correct_answer: q['正确答案'],
        image_url: q['图片URL'] || ''
      }))
    }

    // 4. 调用新建模板接口
    const response = await fetch('/api/exam-templates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) throw new Error(await response.text())

    // 5. 处理创建成功
    const { data: newTemplate } = await response.json()
    $toast.success(`"${newTemplate.title}" 模板创建成功`)
    
    // 6. 跳转到新模板详情页
    router.push(`/admin/exam-template/detail/${newTemplate.id}`)
    emit('import-success', newTemplate)

  } catch (error) {
    $toast.error(`导入失败: ${error.message}`)
  } finally {
    loading.value = false
    e.target.value = ''
  }
}

// 题型转换器
const getQuestionType = (typeName) => {
  const mapping = {
    '单选题': 'single',
    '多选题': 'multi',
    '判断题': 'judge'
  }
  return mapping[typeName] || 'single'
}
</script>