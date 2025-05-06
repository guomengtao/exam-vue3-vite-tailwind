// src/router/admin.router.js
import EmptyRouterView from '@/components/EmptyRouterView.vue';

export default [
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/admin/Login.vue'),
  },
  {
    path: '/env-test',
    name: 'EnvTest',
    component: () => import('@/views/EnvTest.vue'),
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
         // 直接指向试卷模板列表
         component: EmptyRouterView,
         redirect: { name: 'ExamTemplateList' }, // ✅ 自动跳到列表页
        children: [
          {
            path: 'create',
            name: 'ExamTemplateCreate',
            component: () => import('@/views/admin/ExamTemplateCreate/index.vue'),
            meta: { title: '创建试卷模板' },
          },
          {
            path: 'detail/:id',
            name: 'ExamTemplateDetail',
            component: () => import('@/views/admin/ExamTemplate/Detail.vue'),
            meta: { title: '试卷模板详情' },
          },
          {
            path: 'edit/:id',
            name: 'ExamTemplateEdit',
            component: () => import('@/views/admin/ExamTemplate/Edit.vue'),
            meta: { title: '试卷模板编辑' },
          },
          {
            path: 'list',
            name: 'ExamTemplateList',
            component: () => import('@/views/admin/ExamTemplate/List.vue'),
            meta: { title: '试卷模板列表' },
          },
        ],
      },
    ],
  },
];