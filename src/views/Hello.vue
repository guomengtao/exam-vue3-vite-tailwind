<template>
  <div>
    <h1>Hello</h1>
    <button @click="fetchExamTemplate">获取试卷模板</button>
    <pre>{{ result }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const result = ref('')

function fetchExamTemplate() {
  console.log('✅ 按钮被点击了！')  // 加这一行
  fetch('http://47.120.38.206:8081/api/exam_template?id=2')
    .then(response => {
      if (!response.ok) throw new Error('请求失败')
      return response.json()
    })
    .then(data => {
      result.value = JSON.stringify(data, null, 2)
    })
    .catch(error => {
      result.value = '请求失败：' + error.message
    })
}
</script>