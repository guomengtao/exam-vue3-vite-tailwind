<!-- 📄 src/components/GenerateExamButton.vue -->
<template>
  <button
    @click="generateExam"
    class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
    :disabled="loading"
  >
    <span v-if="loading">生成中...</span>
    <span v-else>生成试卷</span>
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  templateId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['success'])
const router = useRouter()
const loading = ref(false)
const baseUrl = import.meta.env.VITE_API_BASE_URL

const generateExam = async () => {
  loading.value = true
  try {
    const res = await fetch(`${baseUrl}/api/exam_paper`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template_id: props.templateId })
    })
    const data = await res.json()
    
    if (data.code === 200) {
      emit('success', data.data)
      // 可选：自动跳转到新试卷页
      // router.push(`/admin/exam-paper/${data.data.id}`)
    } else {
      throw new Error(data.msg || '生成失败')
    }
  } catch (err) {
    alert(`生成错误: ${err.message}`)
  } finally {
    loading.value = false
  }
}
</script>