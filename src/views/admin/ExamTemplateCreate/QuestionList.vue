<template>
  <div class="question-list">
    <h2>题目列表</h2>

    <div v-for="(question, index) in questions" :key="question.id" class="question-item-wrapper">
      <QuestionItem
        :question="question"
        :index="index"
        @update="updateQuestion(index, $event)"
        @delete="deleteQuestion(index)"
      />
    </div>

    <button class="add-btn" @click="addQuestion">➕ 添加题目</button>

    <!-- ✅ 显示总分 -->
    <div class="total-score">总分：{{ totalScore }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import QuestionItem from './QuestionItem.vue'

const questions = ref([])

const addQuestion = () => {
  questions.value.push({
    id: Date.now(),
    type: 'single',
    title: '',
    score: 5,                // ✅ 默认分数
    options: [
      { text: '', image: '' },
      { text: '', image: '' }
    ],
    answer: null             // ✅ 正确答案（index）
  })
}

const updateQuestion = (index, newData) => {
  questions.value[index] = newData
}

const deleteQuestion = (index) => {
  questions.value.splice(index, 1)
}

// ✅ 计算总分
const totalScore = computed(() => {
  return questions.value.reduce((sum, q) => sum + (Number(q.score) || 0), 0)
})

onMounted(() => {
  addQuestion()
})
</script>

<style scoped>
.total-score {
  margin-top: 20px;
  font-weight: bold;
  font-size: 18px;
  color: #333;
}
</style>