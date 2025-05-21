<template>
  <header class="bg-black shadow px-6 py-4 flex justify-between items-center text-white">
    <!-- 左侧可以留空，或放 logo -->
    <div></div>
    <div class="flex items-center space-x-4">
      <span>欢迎你，管理员 {{ username }}</span>
      <RouterLink to="/admin/change-password" class="hover:underline">修改密码</RouterLink>
      <button @click="logout" class="hover:underline">退出</button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');

onMounted(() => {
  username.value = localStorage.getItem('username') || '管理员';
});

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