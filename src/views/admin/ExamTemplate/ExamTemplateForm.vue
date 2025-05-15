<template>
  <form @submit.prevent="onSubmit" class="p-4">
    <div class="mb-4">
      <label class="block text-sm font-medium mb-1">试卷标题</label>
      <input v-model="localForm.title" type="text" class="form-input w-full" />
    </div>
    <!-- 简化示例，题目等表单项可按需添加 -->
    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">提交</button>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  initialForm: {
    type: Object,
    default: () => ({ title: '', description: '', questions: [] })
  }
})

const emit = defineEmits(['submit'])

const localForm = reactive({ ...props.initialForm })

watch(() => props.initialForm, (newVal) => {
  Object.assign(localForm, newVal)
})

function onSubmit() {
  emit('submit', { ...localForm })
}
</script>