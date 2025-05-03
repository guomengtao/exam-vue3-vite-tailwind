<template>
  <div class="question-item">
    <div class="question-header">
      <h3>题目 {{ index + 1 }}</h3>
      <button class="delete-btn" @click="$emit('delete')">🗑 删除</button>
    </div>

    <div class="question-settings">
      <label>题型：</label>
      <select v-model="localQuestion.type">
        <option value="single">单选题</option>
        <option value="multiple">多选题</option>
      </select>

      <label>分数：</label>
      <input type="number" v-model.number="localQuestion.score" min="1" class="score-input" />
    </div>

    <div class="question-body">
      <label>题干：</label>
      <input v-model="localQuestion.title" placeholder="请输入题干" class="title-input" />
    </div>

    <div class="options">
      <label>选项：</label>
      <div
        v-for="(option, i) in localQuestion.options"
        :key="i"
        class="option"
      >
        <input
          v-model="option.text"
          :placeholder="`选项 ${String.fromCharCode(65 + i)}`"
          class="option-input"
        />

        <!-- 答案选择 -->
        <label class="answer-check">
          <input
            v-if="localQuestion.type === 'single'"
            type="radio"
            :name="'answer_' + localQuestion.id"
            :value="i"
            v-model="localQuestion.answer"
          />
          <input
            v-else
            type="checkbox"
            :value="i"
            v-model="localQuestion.answer"
          />
          正确
        </label>

        <button class="remove-btn" @click="removeOption(i)">❌</button>
      </div>

      <button class="add-btn" @click="addOption">➕ 添加选项</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue'

const props = defineProps({
  question: Object,
  index: Number
})
const emit = defineEmits(['update', 'delete'])

// 初始化 localQuestion，并补充默认 4 个选项
const localQuestion = reactive({
  ...JSON.parse(JSON.stringify(props.question)),
  options: [],
  answer: props.question.type === 'multiple' ? [] : null,
  score: props.question.score || 1
})

// 自动填充选项数
onMounted(() => {
  const count = localQuestion.options.length
  if (count < 4) {
    for (let i = count; i < 4; i++) {
      localQuestion.options.push({ text: '', image: '' })
    }
  }
})

// 同步到父组件
watch(
  () => localQuestion,
  () => {
    emit('update', JSON.parse(JSON.stringify(localQuestion)))
  },
  { deep: true }
)

// 添加/删除选项
const addOption = () => {
  localQuestion.options.push({ text: '', image: '' })
}
const removeOption = (index) => {
  localQuestion.options.splice(index, 1)

  // 修复答案同步问题
  if (localQuestion.type === 'multiple' && Array.isArray(localQuestion.answer)) {
    localQuestion.answer = localQuestion.answer.filter((a) => a !== index)
  }
  if (localQuestion.type === 'single' && localQuestion.answer === index) {
    localQuestion.answer = null
  }
}
</script>

<style scoped>
.question-item {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #fcfcfc;
  margin-bottom: 20px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.question-settings {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}

.question-settings select,
.score-input {
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.question-body {
  margin-top: 10px;
}

.title-input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-top: 5px;
}

.options {
  margin-top: 16px;
}

.option {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.option-input {
  flex: 1;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.answer-check {
  display: flex;
  align-items: center;
  gap: 4px;
}

.add-btn {
  margin-top: 10px;
  background-color: #409eff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.remove-btn,
.delete-btn {
  background: none;
  border: none;
  color: #d33;
  font-size: 16px;
  cursor: pointer;
}
</style>