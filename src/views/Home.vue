<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">考试管理系---统</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">功能列表</h2>
        <ul class="space-y-2">
          <li>
            <router-link 
              to="/exam/create" 
              class="text-blue-500 hover:text-blue-700"
            >
              创建考试
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
// 无需额外的 JavaScript 逻辑
</script> 