<!-- src/views/admin/Login.vue -->
<template>
  <div class="login">
    <h1>管理员登录</h1>
    <form>
      <label for="username">用户名</label>
      <input type="text" id="username" v-model="username" />
      <label for="password">密码</label>
      <input type="password" id="password" v-model="password" />
      <button type="submit">登录</button>
    </form>
  </div>
</template>
<script>
export default {
  name: 'AdminLogin',
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    login() {
      // 登录逻辑
    }
  }
}
</script>