<template>
  <div class="p-6">
    <h1 class="text-xl font-bold mb-4">环境变量测试</h1>
    <p class="text-gray-700">API 地址为：</p>
    <p class="text-blue-600 font-mono mt-2">{{ apiBaseUrl }}</p>
  </div>
</template>

<script setup>
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '未读取到变量'
</script>

<style scoped>
p {
  font-size: 1.2rem;
}
</style>