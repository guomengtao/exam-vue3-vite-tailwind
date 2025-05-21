

<template>
  <div class="max-w-md mx-auto mt-10 bg-white shadow-md p-6 rounded">
    <h2 class="text-xl font-semibold mb-4">修改密码</h2>
    <form @submit.prevent="handleChangePassword" class="space-y-4">
      <div>
        <label class="block mb-1">当前密码</label>
        <input v-model="oldPassword" type="password" class="w-full border px-4 py-2 rounded" />
      </div>
      <div>
        <label class="block mb-1">新密码</label>
        <input v-model="newPassword" type="password" class="w-full border px-4 py-2 rounded" />
      </div>
      <div>
        <label class="block mb-1">确认新密码</label>
        <input v-model="confirmPassword" type="password" class="w-full border px-4 py-2 rounded" />
      </div>
      <div v-if="error" class="text-red-600">{{ error }}</div>
      <div v-if="success" class="text-green-600">{{ success }}</div>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        修改密码
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')

const handleChangePassword = async () => {
  error.value = ''
  success.value = ''

  if (newPassword.value !== confirmPassword.value) {
    error.value = '两次输入的新密码不一致'
    return
  }

  const token = localStorage.getItem('token')
  try {
    const response = await fetch('http://47.120.38.206:8081/api/admin/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        old_password: oldPassword.value,
        new_password: newPassword.value
      })
    })

    const data = await response.json()
    if (response.ok && data.code === 200) {
      success.value = '密码修改成功'
      oldPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
    } else {
      error.value = data.message || '密码修改失败'
    }
  } catch (e) {
    error.value = '请求失败，请稍后再试'
  }
}
</script>