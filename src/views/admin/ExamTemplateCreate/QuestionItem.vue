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
    <label class="label">选项：</label>
    <div class="options">
      <div
        v-for="(option, i) in localQuestion.options"
        :key="i"
        class="option"
      >
        <OptionItem
          v-model="localQuestion.options[i]"
          :label="String.fromCharCode(65 + i)"
          @delete="removeOption(i)"
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
            :value="i"
            v-model="singleCorrectIndex"
            v-if="localQuestion.type === 'single'"
            name="single-correct"
          />
          <span>✔ 正确</span>
        </div>
      </div>
    </div>

    <!-- 添加选项按钮 -->
    <button
      class="delete-button"
      style="margin-top: 10px; background-color: #409eff"
      @click="addOption"
      :disabled="localQuestion.options.length >= 8"
    >
      ➕ 添加选项
    </button>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'
import OptionItem from './OptionItem.vue'

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

// 初始化 options，最多 4 个默认
const providedOptions = props.question.options || []
localQuestion.options = Array.from({ length: 4 }, (_, i) => {
  return providedOptions[i] || { text: '', correct: false, image: '' }
})

// 单选题正确答案索引计算属性
const singleCorrectIndex = computed({
  get: () => localQuestion.options.findIndex(opt => opt.correct),
  set: (val) => {
    localQuestion.options.forEach((opt, i) => {
      opt.correct = i === val
    })
  }
})

// 添加选项
function addOption() {
  if (localQuestion.options.length < 8) {
    localQuestion.options.push({ text: '', correct: false, image: '' })
  }
}

// 删除选项
function removeOption(index) {
  localQuestion.options.splice(index, 1)
}

// 同步数据给父组件
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
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.question-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.delete-button {
  background-color: #f56c6c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.delete-button:hover {
  background-color: #e45656;
}

.label {
  display: block;
  margin-top: 12px;
  font-weight: 500;
  color: #333;
  font-size: 15px;
}

.select,
.input {
  width: 100%;
  padding: 8px 12px;
  margin-top: 4px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 15px;
}

.options {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fafafa;
  transition: background-color 0.2s;
}
.option:hover {
  background-color: #f5f5f5;
}

.option .input {
  flex: 1;
  min-width: 160px;
}

.correct-control {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  font-size: 14px;
}

.correct-control input {
  transform: scale(1.2);
  margin-right: 4px;
}
</style>