import { createRouter, createWebHistory } from 'vue-router'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/exam-template/create',
    name: 'ExamTemplateCreate',
    component: () => import('@/views/ExamTemplateCreate/index.vue')
  },
  // 添加图片上传页面的路由
  {
    path: '/image-upload',
    name: 'ImageUploadPage',
    component: () => import('@/views/ImageUploadPage.vue') // 引入 ImageUploadPage.vue 页面
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router