<template>
  <div class="user-layout">
    <!-- 前台通用头部 -->
    <header class="user-header">
      <router-link to="/">首页</router-link>
    </header>

    <!-- 页面内容 -->
    <main class="user-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.user-layout {
  min-height: 100vh;
  background: #f5f7fa;
}

.user-header {
  background: #fff;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-main {
  padding: 20px;
}
</style>