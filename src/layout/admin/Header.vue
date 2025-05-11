<!-- src/layout/admin/Header.vue -->
<template>
  <header class="bg-black shadow px-6 py-4 flex justify-between items-center text-white">
    <!-- 左侧可以留空，或放 logo -->
    <div></div>
    <div class="flex items-center space-x-4">
      <span>欢迎你，管理员 Jack</span>
      <RouterLink to="/admin/change-password" class="hover:underline">修改密码</RouterLink>
      <button @click="logout" class="hover:underline">退出</button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const logout = () => {
  // 清除登录信息（如 token）
  localStorage.removeItem('token');
  router.push('/admin/login');
};
</script>

<style scoped>
/* 白色文字 */
a, span, button {
  color: white;
}
a:hover, button:hover {
  text-decoration: underline;
}
</style>