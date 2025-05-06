// src/router/admin.router.js
import EmptyRouterView from '@/components/EmptyRouterView.vue';

export default [
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/admin/Login.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/layout/admin/AdminLayout.vue'),
    meta: { title: '首页' },
    children: [
      {
        path: '', // 默认访问 /admin 时加载首页
        name: 'AdminIndex',
        component: () => import('@/views/admin/Index.vue'),
        // meta: { title: '首页' },
      },
      {
        path: 'exam-template',
        name: 'ExamTemplate',
        meta: { title: '试卷模板' },
        component: EmptyRouterView,
        children: [
          {
            path: 'create',
            name: 'ExamTemplateCreate',
            component: () => import('@/views/admin/ExamTemplateCreate/index.vue'),
            meta: { title: '创建试卷模板' },
          },
        ],
      },
    ],
  },
];