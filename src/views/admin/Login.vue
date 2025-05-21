<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">管理员登录</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <input
          v-model="username"
          type="text"
          autocomplete="off"
          placeholder="请输入用户名"
          class="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          v-model="password"
          type="password"
          autocomplete="off"
          placeholder="请输入密码"
          class="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded disabled:opacity-50"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
        <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

const apiBaseUrl = 'http://47.120.38.206:8081'

const handleLogin = async () => {
  console.log('handleLogin called')
  error.value = ''
  loading.value = true
  try {
    const response = await fetch(`${apiBaseUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })
    console.log('fetch returned', response)
    const data = await response.json()
    console.log('response JSON', data)

    if (response.ok && data.data.token) {
      console.log('Login success, storing token and navigating')
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('username', username.value)
      router.push({ name: 'AdminIndex' })
    } else {
      console.log('Login failed, showing error')
      error.value = data.message || '登录失败，请检查用户名或密码'
    }
  } catch (err) {
    console.error('fetch error:', err)
    error.value = '请求失败，请检查网络或服务器状态'
  } finally {
    loading.value = false
    console.log('handleLogin finished, loading set to false')
  }
}
</script>