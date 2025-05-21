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
    path: '/upload',
    name: 'upload',
    component: () => import('@/views/ImageCropperPage.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/layout/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, title: '首页' },
             // 直接指向试卷模板列表
            // component: EmptyRouterView,
             redirect: { name: 'AdminIndex' }, // ✅ 自动跳到列表页
    children: [
      {
        path: '', // 默认访问 /admin 时加载首页
        name: 'AdminIndex',
        component: () => import('@/views/admin/Index.vue'),
        // meta: { title: '首页' },
      },
      {
        path: 'admin/index',  
        name: 'AdminIndex',
        component: () => import('@/views/admin/Index.vue'),
        // meta: { title: '首页' },
      },
      {
        path: 'change-password',
        name: 'ChangePassword',
        component: () => import('@/views/admin/Admin/ChangePassword.vue'),
        meta: { title: '密码修改' },
      },
      {
        path: 'exam-template',
        name: 'ExamTemplate',
        meta: { requiresAuth: true, title: '试卷模版' },
         // 直接指向试卷模板列表
         component: EmptyRouterView,
         redirect: { name: 'ExamTemplateList' }, // ✅ 自动跳到列表页
        children: [
          {
            path: 'create',
            name: 'ExamTemplateCreate',
            component: () => import('@/views/admin/ExamTemplate/EditWithCreate.vue'),
            meta: { requiresAuth: true, title: '创建试卷模板' },
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
            component: () => import('@/views/admin/ExamTemplate/EditWithCreate.vue'),
            meta: { title: '试卷模板编辑' },
          },
          {
            path: 'list',
            name: 'ExamTemplateList',
            component: () => import('@/views/admin/ExamTemplate/List.vue'),
            meta: { requiresAuth: true, title: '试卷模板列表' },
          },
        ],
      },
      {
        path: 'exam-paper',
        name: 'ExamPaper',
        meta: { title: '试卷' },
         // 直接指向试卷模板列表
         component: EmptyRouterView,
         redirect: { name: 'ExamPaperList' }, // ✅ 自动跳到列表页
        children: [
          {
            path: 'detail/:id',
            name: 'ExamPaperDetail',
            component: () => import('@/views/admin/ExamPaper/Detail.vue'),
            meta: { title: '试卷详情' },
          },
      
                    {
            path: 'list',
            name: 'ExamPaperList',
            component: () => import('@/views/admin/ExamPaper/List.vue'),
            meta: { title: '试卷列表' },
          },
        ],
      },
      {
        path: 'admins',
        name: 'admins',
        meta: { title: '管理员' },
         // 直接指向试卷模板列表
         component: EmptyRouterView,
         redirect: { name: 'AdminList' }, // ✅ 自动跳到列表页
        children: [
          {
            path: 'detail/:id',
            name: 'ExamPaperDetail',
            component: () => import('@/views/admin/ExamPaper/Detail.vue'),
            meta: { title: '试卷详情' },
          },
      
             {
            path: 'list',
            name: 'AdminrList',
            component: () => import('@/views/admin/Admin/List.vue'),
            meta: { title: '管理员列表' },
          },

        ],
      },
    ],
  },
];