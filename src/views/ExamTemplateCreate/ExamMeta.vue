<template>
  <div class="exam-meta">
    <label class="label">试卷标题：</label>
    <input v-model="localTitle" placeholder="请输入试卷标题" class="input" @input="$emit('update:title', localTitle)" />

    <label class="label">试卷描述：</label>
    <textarea v-model="localDescription" placeholder="请输入描述" class="textarea" @input="$emit('update:description', localDescription)" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['title', 'description'])
const emit = defineEmits(['update:title', 'update:description'])

const localTitle = ref(props.title)
const localDescription = ref(props.description)

// 保证 prop 更新时，同步到本地状态
watch(() => props.title, (newVal) => localTitle.value = newVal)
watch(() => props.description, (newVal) => localDescription.value = newVal)
</script>

<style scoped>
.exam-meta {
  margin-top: 20px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

.input,
.textarea {
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 15px;
  box-sizing: border-box;
}

.input:focus,
.textarea:focus {
  border-color: #409eff;
  outline: none;
}
</style>