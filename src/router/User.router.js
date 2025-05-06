// src/router/empty.router.js
import EmptyRouterView from '@/components/EmptyRouterView.vue';

export default [
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/layout/admin/AdminLayout.vue'),
    meta: { title: '首页' },
    children: [
      {
        path: '', // 默认访问 /admin 时加载首页
        name: 'AdminIndex',
        component: EmptyRouterView,
        // meta: { title: '首页' },
      },
      {
        path: 'example',
        name: 'Example',
        meta: { title: '示例页面' },
        component: EmptyRouterView,
        children: [
          {
            path: 'create',
            name: 'ExampleCreate',
            component: EmptyRouterView,
            meta: { title: '创建示例' },
          },
        ],
      },
    ],
  },
];