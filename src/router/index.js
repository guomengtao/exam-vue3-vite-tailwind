// router/index.js

import { createRouter, createWebHistory } from 'vue-router'
import viewRoutes from './User.router.js'
import adminRoutes from './Admin.router.js'

const routes = [
  ...viewRoutes,
  ...adminRoutes,
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✅ 添加路由守卫，拦截未登录跳转
// router.js
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); // ✅ 注意 key 一致
  const isLoginPage = to.path === '/admin/login';

  // 已登录访问登录页，跳转首页
  if (token && isLoginPage) {
    return next('/admin');
  }

  // 未登录访问需要权限的页面
  if (!token && to.meta.requiresAuth) {
    return next(`/admin/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }

  // 其他情况放行
  next();
});
export default router