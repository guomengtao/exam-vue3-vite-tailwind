<template>
  <div class="question-item">
    <div class="question-header">
      <h3 class="question-title">题目 {{ index + 1 }}</h3>
      <button class="delete-button" @click="$emit('delete')">🗑 删除</button>
    </div>

    <!-- 题型选择 -->
    <label class="label">题型：</label>
    <select v-model="localQuestion.type" class="select">
      <option value="single">单选题</option>
      <option value="multiple">多选题</option>
    </select>

    <!-- 分值设置 -->
    <label class="label">分值：</label>
    <input
      type="number"
      v-model.number="localQuestion.score"
      class="input"
      min="1"
      placeholder="请输入本题分值"
    />

    <!-- 题干输入 -->
    <label class="label">题干：</label>
    <input v-model="localQuestion.title" class="input" placeholder="请输入题干" />

    <!-- 选项输入 -->
    <div class="options">
      <div
        v-for="(option, i) in localQuestion.options"
        :key="i"
        class="option"
      >
        <input
          v-model="option.text"
          class="input"
          :placeholder="`选项 ${String.fromCharCode(65 + i)}`"
        />

        <!-- 正确答案选择 -->
        <div class="correct-control">
          <input
            type="checkbox"
            v-model="option.correct"
            v-if="localQuestion.type === 'multiple'"
          />
          <input
            type="radio"
            name="single-correct"
            :value="i"
            v-model="singleCorrectIndex"
            v-if="localQuestion.type === 'single'"
          />
          <span>✔ 正确</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'

const props = defineProps({
  question: Object,
  index: Number
})
const emit = defineEmits(['update', 'delete'])

// 初始化 localQuestion
const localQuestion = reactive({
  type: props.question.type || 'single',
  title: props.question.title || '',
  score: props.question.score || 2, // 默认分值为2
  options: []
})

// 初始化 options，最多 4 个
const providedOptions = props.question.options || []
localQuestion.options = Array.from({ length: 4 }, (_, i) => {
  return providedOptions[i] || { text: '', correct: false }
})

// 处理单选题正确选项
const singleCorrectIndex = computed({
  get: () => localQuestion.options.findIndex(opt => opt.correct),
  set: (val) => {
    localQuestion.options.forEach((opt, i) => {
      opt.correct = i === val
    })
  }
})

// 同步本地数据回父组件
watch(
  () => localQuestion,
  (val) => {
    emit('update', JSON.parse(JSON.stringify(val)))
  },
  { deep: true }
)
</script>

<style scoped>
.question-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  background-color: #f9f9f9;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.question-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.delete-button {
  background-color: #f56c6c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.delete-button:hover {
  background-color: #e45656;
}

.label {
  display: block;
  margin-top: 8px;
  font-weight: 500;
}

.select,
.input {
  width: 100%;
  padding: 6px 10px;
  margin-top: 4px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}

.options {
  margin-top: 12px;
}

.option {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.correct-control {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  font-size: 14px;
}
</style>