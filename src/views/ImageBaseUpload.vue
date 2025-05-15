<template>
  <div>
    <button @click="showModal = true">图</button>
    <input ref="fileInput" type="file" accept="image/*" />

    <button @click="upload">上传选中文件</button>
    <button @click="uploadTextFile">上传测试Blob</button>

    <BaseModal :visible="showModal" @close="showModal = false">
      <h2>Hello world!</h2>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '@/components/BaseModal.vue'

const showModal = ref(false)
const fileInput = ref(null)

const upload = async () => {
  const file = fileInput.value?.files?.[0]
  if (!file) {
    console.warn("请选择文件")
    return
  }

  console.log('📂 选中文件:', file)

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch('http://47.120.38.206:8081/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MSwiZXhwIjoxNzQ3MjkzMTE3LCJyb2xlIjoiYWRtaW4ifQ._j6d08Y9ch9ZXe1fQxuVqIqiwu5V5LCViPB07RL4010'
      },
      body: formData
    })

    const result = await response.json()
    console.log("✅ 上传选中文件结果：", result)
  } catch (error) {
    console.error("❌ 上传失败：", error)
  }
}

const uploadTextFile = async () => {
  const blob = new Blob(['hello world'], { type: 'text/plain' })
  const testFile = new File([blob], 'hello.txt', { type: 'text/plain' })

  const formData = new FormData()
  formData.append('file', testFile)

  try {
    const response = await fetch('http://47.120.38.206:8081/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MSwiZXhwIjoxNzQ3MjkzMTE3LCJyb2xlIjoiYWRtaW4ifQ._j6d08Y9ch9ZXe1fQxuVqIqiwu5V5LCViPB07RL4010'
      },
      body: formData
    })

    const result = await response.json()
    console.log("✅ 上传测试Blob结果：", result)
  } catch (error) {
    console.error("❌ 测试上传失败：", error)
  }
}
</script>