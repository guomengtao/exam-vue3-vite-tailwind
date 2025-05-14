<template>
  <div class="exam-container">
    <!-- 试卷头部 -->
    <div class="exam-header">
      <h1 class="text-4xl font-extrabold">{{ paper.title }}</h1>

      <!-- 姓名与学号 -->
      <div class="student-info">
        <label>
          姓-名：
          <input v-model="username" type="text" placeholder="请输入姓名" required />
        </label>
        <label>
          学号：
          <input v-model="userId" type="text" placeholder="请输入学号" required />
        </label>
      </div>

      <div class="exam-meta">
        <span>满分：{{ paper.total_score }}分</span>
        <span>答题用时：{{ durationText }}</span>
        <span v-if="paper.time_limit !== 0">剩余时间：{{ formattedTime }}</span>
        <span @click="resetExam" class="text-sm text-gray-400 cursor-pointer hover:underline ml-auto">
          重填
        </span>
      </div>
      <img 
        v-if="paper.cover_image" 
        :src="staticHost + paper.cover_image" 
        class="cover-image"
      />
    </div>

    <!-- 答题表单 -->
    <form @submit.prevent="submitAnswers" class="exam-form">
      <!-- 题目列表 -->
      <div 
        v-for="(question, index) in paper.questions" 
        :key="question.id" 
        class="question-card"
        :ref="index === 0 ? 'firstQuestion' : null"
      >
        <h3>{{ index + 1 }}. {{ question.title }}（{{ question.score }}分）</h3>

        <!-- 题图 -->
        <img 
          v-if="question.image_url" 
          :src="staticHost + question.image_url" 
          class="question-image"
        />

        <!-- 单选题 -->
        <div v-if="question.type === 'single'" class="options">
          <label 
            v-for="(option, optIndex) in question.options" 
            :key="optIndex"
            class="option"
          >
            <input
              type="radio"
              :name="'q_' + question.id"
              :value="optIndex"
              v-model="answers[question.id].answer"
            />
            <span class="option-letter">{{ String.fromCharCode(65 + optIndex) }}.</span>
            {{ option }}
          </label>
        </div>

        <!-- 多选题 -->
        <div v-if="question.type === 'multi'" class="options">
          <label 
            v-for="(option, optIndex) in question.options" 
            :key="optIndex"
            class="option"
          >
            <input
              type="checkbox"
              :name="'q_' + question.id + '_' + optIndex"
              :value="optIndex"
              v-model="answers[question.id].answer"
            />
            <span class="option-letter">{{ String.fromCharCode(65 + optIndex) }}.</span>
            {{ option }}
          </label>
        </div>

        <!-- 判断题 -->
        <div v-if="question.type === 'judge'" class="options">
          <label class="option">
            <input
              type="radio"
              :name="'q_' + question.id"
              value="true"
              v-model="answers[question.id].answer"
              required
            />
            正确
          </label>
          <label class="option">
            <input
              type="radio"
              :name="'q_' + question.id"
              value="false"
              v-model="answers[question.id].answer"
              required
            />
            错误
          </label>
        </div>
      </div>

      <!-- 提交按钮 -->
      <button
        type="submit"
        :disabled="isSubmitting"
        class="submit-btn"
      >
        <span class="loader" v-if="isSubmitting" />
        {{ isSubmitting ? '正在提交，请稍候...' : '提交试卷' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.exam-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.exam-header {
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.exam-meta {
  display: flex;
  gap: 20px;
  margin-top: 10px;
  color: #666;
}

.cover-image {
  max-width: 200px;
  margin-top: 15px;
  border-radius: 4px;
}

.student-info {
  display: flex;
  gap: 20px;
  margin: 15px 0;
}

.student-info label {
  font-weight: bold;
  color: #d32f2f;
}

.student-info input {
  margin-left: 8px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.question-card {
  margin-bottom: 25px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.question-image {
  max-width: 100%;
  margin: 10px 0;
  border-radius: 4px;
}

.options {
  margin-top: 15px;
}

.option {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  margin: 6px 0;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.option:hover {
  background: #f5f5f5;
}

.option input {
  margin-right: 10px;
}

.option-letter {
  font-weight: bold;
  margin-right: 5px;
}

.submit-btn {
  display: block;
  width: 100%;
  padding: 12px;
  margin-top: 30px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover {
  background: #45a049;
}

.submit-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}
.bg-red-500 {
  background-color: #f56565;
}
.hover\:bg-red-600:hover {
  background-color: #e53e3e;
}
.mt-4 {
  margin-top: 1rem;
}
.loader {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 环境变量
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const staticHost = import.meta.env.VITE_STATIC_HOST

const route = useRoute()
const router = useRouter()

// 统一管理 localStorage
const storage = {
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch {
      return localStorage.getItem(key)
    }
  },
  set(key, value) {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value))
    } else {
      localStorage.setItem(key, value)
    }
  },
  remove(key) {
    localStorage.removeItem(key)
  }
}

// 学生姓名与学号
const _username = ref(storage.get('username') || '')
const _userId = ref(storage.get('userId') || '')

// 只在有效字符串时存储姓名和学号
const username = ref(_username.value)
watch(username, (val) => {
  const trimmed = String(val).trim()
  if (trimmed && trimmed.length <= 50) {
    storage.set('username', trimmed)
  }
})

const userId = ref(_userId.value)
watch(userId, (val) => {
  const trimmed = String(val).trim()
  if (trimmed && trimmed.length <= 50) {
    storage.set('userId', trimmed)
  }
})

// 试卷数据
const paper = ref({
  id: '',
  uuid: '',
  title: '加载中...',
  questions: [],
  total_score: 0,
  time_limit: 0,
  cover_image: ''
})

// 用户答案
const answers = ref({})
const isSubmitting = ref(false)
const remainingSeconds = ref(Number(storage.get('remainingTime')) || 0)

// 记录开始时间戳，持久化到 localStorage
const startTimestamp = ref(Number(storage.get('startTimestamp')) || Date.now())
storage.set('startTimestamp', startTimestamp.value)

// 获取当前用户UUID
const getCurrentUserUUID = () => {
  return localStorage.getItem('userUUID') || 'default-user-uuid'
}

// 获取认证token
const getAuthToken = () => {
  return localStorage.getItem('authToken') || ''
}

// 格式化时间显示
const formattedTime = computed(() => {
  const mins = Math.floor(remainingSeconds.value / 60)
  const secs = remainingSeconds.value % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})

// 替换 durationText 由 computed 改为 ref
const durationText = ref('')

// 获取试卷数据
 const fetchPaper = async () => {
  try {
    console.log('开始加载试卷...');
    console.log('请求地址:', `${apiBaseUrl}/api/exam_paper/redis?uuid=${route.params.id}`);
    const res = await fetch(`${apiBaseUrl}/api/exam_paper/redis?uuid=${route.params.id}`)
    const data = await res.json()
    
    console.log('接口响应数据:', data);

    if (data.code === 200) {
      paper.value = {
        ...data.data,
        questions: JSON.parse(data.data.questions || '[]'),
        time_limit: Number(data.data.time_limit) || 0
      }

      // 初始化答案结构
      paper.value.questions.forEach(q => {
        if (!q.id) {
          console.warn('警告：有题目 id 为 undefined', q)
          return
        }
        answers.value[q.id] = {
          answer: q.type === 'multi' ? [] : null,
          score: q.score
        }
      })

      const savedAnswers = storage.get('examAnswers')
      if (savedAnswers) {
        // 恢复多选题答案为数组格式
        for (const qid in savedAnswers) {
          if (!answers.value[qid]) answers.value[qid] = { answer: null, score: 0 };
          if (paper.value.questions.find(q => q.id === qid && q.type === 'multi')) {
            answers.value[qid].answer = Array.isArray(savedAnswers[qid].answer) ? savedAnswers[qid].answer : []
          } else {
            answers.value[qid].answer = savedAnswers[qid].answer
          }
        }
      }

      remainingSeconds.value = Number(storage.get('remainingTime')) || paper.value.time_limit * 60

      if (paper.value.time_limit === 0) {
        clearInterval(timer)
      }
    } else {
      alert('加载试卷失败，状态码不为200');
    }
  } catch (err) {
    console.error('加载试卷失败:', err)
    alert('加载试卷失败，请刷新重试')
  }
}

// 提交答案
const submitAnswers = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  const safeUsername = String(username.value).trim().slice(0, 50)
  const safeUserId = String(userId.value).trim().slice(0, 50)

  if (!safeUsername || !safeUserId) {
    alert('请填写完整的姓名和学号')
    isSubmitting.value = false
    return
  }

  if (safeUsername.length > 50 || safeUserId.length > 50) {
    isSubmitting.value = false
    return
  }

  storage.set('username', safeUsername)
  storage.set('userId', safeUserId)

  // 检查未作答题目
  const unansweredQuestions = paper.value.questions.filter(q => {
    const a = answers.value[q.id]?.answer
    return a === null || (Array.isArray(a) && a.length === 0)
  })

  if (unansweredQuestions.length > 0) {
    const questionNumbers = unansweredQuestions.map((q, idx) => idx + 1)
    alert(`以下题目未作答: ${unansweredQuestions.map(q => paper.value.questions.indexOf(q) + 1).join(', ')}，请完成所有题目后再提交。`)
    isSubmitting.value = false
    return
  }

  try {
    // 自动评分
    let totalScore = 0
    paper.value.questions.forEach(q => {
      const userAnswer = answers.value[q.id]?.answer
      const correctMask = q.correct_answer_bitmask

      if (q.type === 'single') {
        if ((1 << userAnswer) === correctMask) totalScore += q.score
      } else if (q.type === 'multi') {
        const userMask = Array.isArray(userAnswer) ? userAnswer.reduce((sum, i) => sum | (1 << i), 0) : 0
        if (userMask === correctMask) totalScore += q.score
      } else if (q.type === 'judge') {
        if ((userAnswer === 'true' && correctMask === 1) ||
            (userAnswer === 'false' && correctMask === 0)) {
          totalScore += q.score
        }
      }
    })

    const validAnswers = {}
    for (const qid in answers.value) {
      if (answers.value[qid].answer !== null) {
        validAnswers[qid] = {
          answer: answers.value[qid].answer,
          score: answers.value[qid].score
        }
      }
    }

    const submission = {
      uuid: getCurrentUserUUID(),
      exam_id: paper.value.id,
      exam_uuid: paper.value.uuid,
      username: safeUsername,
      user_id: safeUserId,
      answers: validAnswers,
      score: totalScore,
      duration: Math.floor((Date.now() - startTimestamp.value) / 1000),
    }

    console.log('提交时长（秒）:', submission.duration)

    const res = await fetch(`${apiBaseUrl}/api/user/answer`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(submission)
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || '提交失败')
    }

    const result = await res.json()
    router.push({
      path: `/exam/result/${result.record_id}`,
      query: { paper_uuid: paper.value.uuid }
    })
    storage.remove('examAnswers')
    storage.remove('username')
    storage.remove('userId')
    storage.remove('remainingTime')
    storage.remove('startTimestamp')

  } catch (err) {
    console.error('提交出错:', err)
    alert(`提交失败: ${err.message}`)
  } finally {
    isSubmitting.value = false
  }
}

// 监视 answers 自动保存
watch(answers, (newVal) => {
  storage.set('examAnswers', newVal)
  console.log('当前答题状态:', JSON.stringify(newVal, null, 2))
}, { deep: true })

// 清空试卷答题记录
const resetExam = () => {
  if (confirm('确定要清空所有答题记录并重新开始吗？')) {
    storage.remove('examAnswers')
    storage.remove('username')
    storage.remove('userId')
    storage.remove('remainingTime')
    storage.remove('startTimestamp')
    window.location.reload()
  }
}

// 倒计时逻辑
let timer
onMounted(async () => {
  await fetchPaper()
  if (paper.value.time_limit !== 0) {
    if (paper.value.time_limit && Number(paper.value.time_limit) > 0) {
      remainingSeconds.value = Number(storage.get('remainingTime')) || Number(paper.value.time_limit) * 60
    } else {
      remainingSeconds.value = 0
    }
    timer = setInterval(() => {
      if (remainingSeconds.value > 0) {
        remainingSeconds.value--
        storage.set('remainingTime', remainingSeconds.value)
      } else {
        clearInterval(timer)
        storage.remove('remainingTime')
        submitAnswers()
      }
    }, 1000)
  }
  setInterval(() => {
    const durationSeconds = Math.floor((Date.now() - startTimestamp.value) / 1000)
    const mins = Math.floor(durationSeconds / 60)
    const secs = durationSeconds % 60
    durationText.value = `${mins}分${secs.toString().padStart(2, '0')}秒`
  }, 1000)
})

onUnmounted(() => clearInterval(timer))
</script>