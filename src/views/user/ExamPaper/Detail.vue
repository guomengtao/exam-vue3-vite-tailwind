<template>
  <div class="exam-container">
    <!-- 试卷头部 -->
    <div class="exam-header">
      <h1>{{ paper.title }}</h1>
      <div class="exam-meta">
        <span>总分：{{ paper.total_score }}分</span>
        <span>剩余时间：{{ formattedTime }}</span>
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
              required
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
              :name="'q_' + question.id"
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
      <button type="submit" :disabled="isSubmitting" class="submit-btn">
        {{ isSubmitting ? '提交中...' : '提交试卷' }}
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
</style>
 

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 环境变量
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const staticHost = import.meta.env.VITE_STATIC_HOST

// 试卷数据
const paper = ref({
  id: '',
  uuid: '',
  title: '加载中...',
  questions: [],
  total_score: 0,
  time_limit: 60,
  cover_image: ''
})

// 用户答案
const answers = ref({})
const isSubmitting = ref(false)
const remainingSeconds = ref(paper.value.time_limit * 60)

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

// 获取试卷数据
const fetchPaper = async () => {
  try {
    const res = await fetch(`${apiBaseUrl}/api/exam_paper/redis?uuid=${route.params.id}`)
    const data = await res.json()
    
    if (data.code === 200) {
      paper.value = {
        ...data.data,
        questions: JSON.parse(data.data.questions || '[]')
      }
      
      // 初始化答案结构
      paper.value.questions.forEach(q => {
        answers.value[q.id] = {
          answer: q.type === 'multi' ? [] : null,
          score: q.score
        }
      })
      
      remainingSeconds.value = (data.data.time_limit || 60) * 60
    }
  } catch (err) {
    console.error('加载试卷失败:', err)
    alert('加载试卷失败，请刷新重试')
  }
}

// 提交答案
const submitAnswers = async () => {
  isSubmitting.value = true
  
  try {
    // 过滤掉未作答的题目
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
      answers: validAnswers
    }

    const res = await fetch(`${apiBaseUrl}/api/submit_answer`, {
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
      query: { 
        paper_uuid: paper.value.uuid, // 试卷唯一标识
      }
    })

  } catch (err) {
    console.error('提交出错:', err)
    alert(`提交失败: ${err.message}`)
  } finally {
    isSubmitting.value = false
  }
}

// 倒计时逻辑
let timer
onMounted(() => {
  fetchPaper()
  timer = setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value--
    } else {
      clearInterval(timer)
      submitAnswers()
    }
  }, 1000)
})

onUnmounted(() => clearInterval(timer))
</script>

 