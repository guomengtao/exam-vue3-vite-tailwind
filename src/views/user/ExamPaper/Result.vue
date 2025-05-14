<template>
  <div class="result-container">
    <!-- 调试信息（上线时可移除） -->
    <div v-if="debugMode" class="debug-info">
      <h3>调试信息</h3>
      <p>试卷UUID: {{ route.query.paper_uuid }}</p>
      <p>记录UUID: {{ route.params.record_id }}</p>
      <p>API状态: {{ apiStatus }}</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loader"></div>
      <p>正在加载考试结果...</p>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="error-state">
      <h2>⚠️ 加载失败</h2>
      <p>{{ error }}</p>
      <button @click="fetchData" class="retry-btn">点击重试</button>
    </div>

    <!-- 结果展示 -->
    <div v-if="!loading && !error && paperData && resultData" class="result-content">
      <div class="result-header">
        <h1 class="text-2xl font-bold mb-2">{{ paperData.title }}</h1>
        <div class="result-info-row">
          <span>姓名：{{ username }}　学号：{{ userId }}</span>
          <span class="final-score-banner">总得分：{{ resultData.score }}分</span>
          <span>满分: {{ paperData.total_score }}分</span>
          <span>提交时间: {{ formatTime(resultData.created_at) }}</span>
          <span>用时: {{ resultData.duration }}秒</span>
        </div>
      </div>

      <div class="question-list">
        <div 
          v-for="(question, index) in paperData.questions" 
          :key="question.id"
          class="question-item"
          :class="getQuestionStatus(question)"
        >
          <div class="question-title">
            <span class="question-index">{{ index + 1 }}.</span>
            {{ question.title }}
            <span class="question-score">({{ question.score }}分)</span>
            <span class="status-badge"></span>
          </div>

          <!-- 选项列表 -->
          <div class="options-list">
            <div
              v-for="(option, optIndex) in question.options"
              :key="optIndex"
              class="option-item"
              :class="getOptionClass(question, optIndex)"
            >
              <span class="option-letter">{{ String.fromCharCode(65 + optIndex) }}.</span>
              {{ option }}
              <span v-if="isOptionSelected(question, optIndex)" class="user-answer-tag">你的选择</span>
              <span v-if="isCorrectOption(question, optIndex)" class="correct-answer-tag">正确答案</span>
            </div>
          </div>

          <div v-if="question.correct_answer !== null && question.correct_answer !== undefined">
            <p class="correct-answer-display">
              正确答案参考：
              <span>
                {{
                  question.correct_answer instanceof Array
                    ? question.correct_answer.map(i => String.fromCharCode(65 + i)).join(', ')
                    : String.fromCharCode(65 + question.correct_answer)
                }}
              </span>
            </p>
          </div>

          <div v-if="resultData.answers && resultData.answers[question.id]">
            <p class="user-answer-display">
              你的答案：
              <span>
                {{
                  (() => {
                    const userAns = resultData.answers[question.id].user_answer;
                    if (userAns === null || userAns === undefined) return '未作答';
                    if (Array.isArray(userAns)) {
                      return userAns.map(i => String.fromCharCode(65 + i)).join(', ');
                    }
                    return String.fromCharCode(65 + userAns);
                  })()
                }}
              </span>
            </p>
            <p class="answer-status" :class="{'correct': isAnswerCorrect(question), 'incorrect': !isAnswerCorrect(question)}">
              状态：{{ getAnswerStatusText(question) }}
            </p>
          </div>

          <!-- 得分和解析 -->
          <div class="question-footer">
            <span class="score-display">得分: {{ getQuestionScore(question) }}/{{ question.score }}分</span>
            <div v-if="question.analysis" class="question-analysis">
              <p class="analysis-title">📝 解析：</p>
              <p>{{ question.analysis }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

 

<style scoped>
/* 基础样式 */
.result-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
}

/* 调试信息 */
.debug-info {
  padding: 15px;
  background: #f0f0f0;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 14px;
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 40px;
}

.loader {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态 */
.error-state {
  text-align: center;
  padding: 30px;
  background: #fff8f8;
  border-radius: 5px;
  border: 1px solid #ffebee;
}

.retry-btn {
  margin-top: 15px;
  padding: 8px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 结果内容样式 */
/* 头部样式 */
.result-header {
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.question-item {
  padding: 20px;
  margin-bottom: 25px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.question-item.correct {
  border-left: 4px solid #52c41a;
}

.question-item.incorrect {
  border-left: 4px solid #ff4d4f;
}

.question-item.not-answered {
  border-left: 4px solid #d9d9d9;
}

/* 新增样式 */
.option-item {
  padding: 8px 12px;
  margin: 4px 0;
  border-radius: 5px;
  background: #f9f9f9;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.option-item.correct {
  border: 1px solid #4caf50;
  background-color: #e8f5e9;
}

.option-item.selected {
  border: 1px dashed #2196f3;
}

.option-letter {
  font-weight: bold;
  width: 20px;
}

.user-answer-tag::before {
  content: "✔️";
  margin-right: 4px;
  color: #28a745;
}

.correct-answer-tag::before {
  content: "✅";
  margin-left: 8px;
  color: #28a745;
}

.status-badge {
  margin-left: 10px;
  font-size: 18px;
}

.question-item.correct .status-badge::before {
  content: "✔️";
  color: #4caf50;
}

.question-item.incorrect .status-badge::before {
  content: "❌";
  color: #f44336;
}

.question-item.not-answered .status-badge::before {
  content: "⚠️";
}

.result-info-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  font-size: 15px;
  color: #555;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.final-score-banner {
  font-size: 20px;
  font-weight: bold;
  color: #2e7d32;
}

.student-info {
  color: #555;
  font-size: 15px;
}

.correct-answer-display {
  margin-top: 8px;
  font-size: 14px;
  color: #888;
}

.user-answer-display {
  margin-top: 4px;
  font-size: 14px;
  color: #555;
}

.answer-status {
  margin-top: 4px;
  font-size: 14px;
  font-weight: bold;
}

.answer-status.correct {
  color: #4caf50;
}

.answer-status.incorrect {
  color: #f44336;
}

/* 其他样式保持不变... */
</style>

  

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

// 调试模式
const debugMode = true
const apiStatus = ref('')
const paperData = ref(null)
const resultData = ref(null)
const loading = ref(true)
const error = ref(null)

// 将correct_answer_bitmask转为数组
const bitmaskToArray = (bitmask) => {
  if (bitmask === undefined || bitmask === null) return null
  const arr = []
  let mask = Number(bitmask)
  let index = 0
  while (mask > 0) {
    if ((mask & 1) === 1) {
      arr.push(index)
    }
    mask = mask >> 1
    index++
  }
  return arr
}

// 获取试卷数据
const fetchPaperData = async () => {
  const url = `${apiBaseUrl}/api/exam_paper/redis?uuid=${route.query.paper_uuid}`
  const res = await fetch(url)
  
  if (!res.ok) throw new Error(`试卷加载失败: HTTP ${res.status}`)
  
  const data = await res.json()
  if (data.code !== 200) throw new Error(data.message || '试卷数据异常')
  
  return data
}

// 获取答题结果
const fetchResultData = async () => {
  const url = `${apiBaseUrl}/api/user/answer/${route.params.record_id}`
  const res = await fetch(url)
  
  if (!res.ok) throw new Error(`结果加载失败: HTTP ${res.status}`)
  
  const data = await res.json()
  if (data.code !== 200) throw new Error(data.message || '结果数据异常')
  
  return data
}

// 获取数据
const fetchData = async () => {
  try {
    loading.value = true
    error.value = null
    apiStatus.value = '请求开始'

    if (!route.query.paper_uuid || !route.params.record_id) {
      throw new Error('缺少必要的考试参数')
    }

    const [paperRes, resultRes] = await Promise.all([
      fetchPaperData(),
      fetchResultData()
    ])

    // 规范化数据
    paperData.value = {
      ...paperRes.data,
      questions: JSON.parse(paperRes.data?.questions || '[]').map(q => ({
        ...q,
        id: String(q.id),
        options: q.options || [],
        correct_answer: q.correct_answer !== undefined && q.correct_answer !== null
          ? normalizeAnswer(q.correct_answer, q.type)
          : (q.correct_answer_bitmask !== undefined && q.correct_answer_bitmask !== null
            ? bitmaskToArray(q.correct_answer_bitmask)
            : null),
        analysis: q.analysis || ""
      }))
    }

    const normalizedAnswers = normalizeAnswers(resultRes.data.answers)

    // 构造包含正确答案、用户答案及状态的结构
    const answersWithStatus = {}
    for (const q of paperData.value.questions) {
      const userAnswer = normalizedAnswers[q.id]?.answer ?? null
      const questionCorrectAnswer = q.correct_answer
      const isCorrect = checkAnswerCorrect(userAnswer, questionCorrectAnswer, q.type)
      answersWithStatus[q.id] = {
        answer: normalizedAnswers[q.id]?.answer ?? null,
        user_answer: normalizedAnswers[q.id]?.answer ?? null,
        correct_answer: questionCorrectAnswer,
        is_correct: isCorrect,
        score: isCorrect ? normalizedAnswers[q.id]?.score ?? 0 : 0
      }
    }

    resultData.value = {
      ...resultRes.data,
      answers: answersWithStatus
    }
    resultData.value.user_uuid = resultRes.data.user_uuid || ''

    apiStatus.value = '请求成功'

  } catch (err) {
    console.error('数据加载失败:', err)
    error.value = `加载失败: ${err.message}`
    apiStatus.value = `请求失败: ${err.message}`
  } finally {
    loading.value = false
  }
}

// 辅助函数
const normalizeAnswer = (answer, type) => {
  if (answer === undefined || answer === null) return null
  if (type === 'multi') {
    return Array.isArray(answer) ? answer.map(Number) : [Number(answer)]
  }
  return Number(answer)
}

const normalizeAnswers = (answers) => {
  const normalized = {}
  for (const [qid, answerData] of Object.entries(answers)) {
    normalized[String(qid)] = {
      answer: normalizeAnswer(answerData.answer, 
                paperData.value?.questions.find(q => q.id === String(qid))?.type),
      score: Number(answerData.score)
    }
  }
  return normalized
}

const checkAnswerCorrect = (userAnswer, correctAnswer, type) => {
  if (userAnswer === undefined || correctAnswer === undefined || userAnswer === null || correctAnswer === null) return false

  if (type === 'multi') {
    const userAnsSet = Array.isArray(userAnswer) ? new Set(userAnswer) : new Set()
    const correctAnsSet = Array.isArray(correctAnswer) ? new Set(correctAnswer) : new Set()

    if (userAnsSet.size !== correctAnsSet.size) return false
    for (const ans of userAnsSet) {
      if (!correctAnsSet.has(ans)) return false
    }
    return true
  }

  return userAnswer === correctAnswer
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

const isOptionSelected = (question, optIndex) => {
  if (!resultData.value?.answers) return false
  const answer = resultData.value.answers[question.id]?.user_answer
  if (answer === undefined || answer === null) return false
  
  if (question.type === 'multi') {
    return Array.isArray(answer) ? answer.includes(optIndex) : false
  }
  return answer === optIndex
}

const isCorrectOption = (question, optIndex) => {
  const correctAnswer = question.correct_answer
  if (question.type === 'multi') {
    return Array.isArray(correctAnswer) ? correctAnswer.includes(optIndex) : false
  }
  return correctAnswer === optIndex
}

const getQuestionScore = (question) => {
  const raw = resultData.value?.answers?.[question.id]?.score ?? 0
  return isAnswerCorrect(question) ? raw : 0
}

const username = computed(() => resultData.value?.username || '')
const userId = computed(() => resultData.value?.user_id || '')

const getAnswerStatusText = (question) => {
  if (!resultData.value?.answers?.[question.id]) return "未作答"
  return isAnswerCorrect(question) ? "正确" : "错误"
}

const getQuestionStatus = (question) => {
  if (!resultData.value?.answers?.[question.id]) return "not-answered"
  return isAnswerCorrect(question) ? "correct" : "incorrect"
}

const getOptionClass = (question, optIndex) => {
  const classes = []
  if (isOptionSelected(question, optIndex)) classes.push('selected')
  if (isCorrectOption(question, optIndex)) classes.push('correct')
  return classes
}

const isAnswerCorrect = (question) => {
  const userAnswer = resultData.value?.answers?.[question.id]?.user_answer
  const correctAnswer = question.correct_answer
  
  if (userAnswer === undefined || correctAnswer === undefined) return false
  
  if (question.type === 'multi') {
    const userAns = Array.isArray(userAnswer) ? new Set(userAnswer) : new Set()
    const correctAns = Array.isArray(correctAnswer) ? new Set(correctAnswer) : new Set()
    
    if (userAns.size !== correctAns.size) return false
    for (const ans of userAns) {
      if (!correctAns.has(ans)) return false
    }
    return true
  }
  
  return userAnswer === correctAnswer
}

onMounted(() => {
  console.log('初始化结果页', {
    paper_uuid: route.query.paper_uuid,
    record_id: route.params.record_id
  })
  fetchData()
})
</script>