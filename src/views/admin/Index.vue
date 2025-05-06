<!-- src/views/admin/Index.vue -->
<template>
  <div class="bg-white p-6 rounded shadow-md">
    <h1 class="text-2xl font-bold mb-4">
      欢迎你，管理员 <span class="text-blue-600">{{ username }}</span>
    </h1>

    <ul class="space-y-2 text-gray-700">
      <li><strong>前端框架：</strong> Vue 3 + Composition API + Await 异步模式</li>
      <li><strong>后端框架：</strong> Gin (Go)</li>
      <li><strong>系统架构：</strong> 前后端完全分离</li>
      <li><strong>操作系统：</strong> Ubuntu 20+</li>
      <li><strong>运行方式：</strong> 独立服务进程</li>
      <li><strong>服务器状态：</strong>
        <span :class="status === '正常' ? 'text-green-600' : 'text-red-600'">{{ status }}</span>
      </li>
      <li><strong>服务器域名/IP：</strong> {{ hostname }} [ {{ ip }} ]</li>
    </ul>

    <div class="mt-6 pt-4 border-t text-sm text-gray-500">
      <p>版本：v-1.0.5</p>
      <p>技术支持：<span class="text-blue-600">日诺科技</span></p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const hostname = ref(window.location.hostname);
const ip = ref('127.0.0.1'); // 可由后端提供真实 IP
const status = ref('加载中...');
const username = ref('');

// 获取服务状态
const fetchStatus = async () => {
  try {
    const res = await axios.get('/api/status'); // 示例后端 API
    status.value = res.data.ok ? '正常' : '异常';
  } catch (err) {
    status.value = '无法连接';
  }
};

// 获取当前用户
const fetchUser = async () => {
  try {
    const res = await axios.get('/api/user/profile');
    username.value = res.data.username || '未知用户';
  } catch (err) {
    username.value = '未登录';
  }
};

onMounted(() => {
  fetchStatus();
  fetchUser();
});
</script>