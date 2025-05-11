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
        <h1>{{ paperData.title }}</h1>
        <div class="result-meta">
          <span class="total-score">总分: {{ resultData.total_score }}分</span>
          <span class="submit-time">提交时间: {{ formatTime(resultData.created_at) }}</span>
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
            <span class="status-badge">{{ getAnswerStatusText(question) }}</span>
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
.result-header {
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.result-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: #666;
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

/* 其他样式保持不变... */
</style>

  

<script setup>
import { ref, onMounted } from 'vue'
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
  const url = `${apiBaseUrl}/api/exam/result/${route.params.record_id}`
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
        correct_answer: normalizeAnswer(q.correct_answer, q.type),
        analysis: q.analysis || ""
      }))
    }

    resultData.value = {
      ...resultRes.data,
      answers: normalizeAnswers(resultRes.data.answers)
    }

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

const formatTime = (timestamp) => new Date(timestamp * 1000).toLocaleString()

const isOptionSelected = (question, optIndex) => {
  if (!resultData.value?.answers) return false
  const answer = resultData.value.answers[question.id]?.answer
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
  return resultData.value?.answers?.[question.id]?.score ?? 0
}

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
  const userAnswer = resultData.value?.answers?.[question.id]?.answer
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

 