// 📄 /router/User.router.js
import UserLayout from '@/layout/user/UserLayout.vue'

export default [
  {
    path: '/exam/detail/:id',
    name: 'UserExamPaperDetail',
    component: () => import('@/views/user/ExamPaper/Detail.vue'),
    meta: { 
      title: '试卷详情',
      layout: UserLayout  // 直接使用导入的布局组件
    }
  },
  {
    path: '/exam/result/:record_id',
    name: 'UserExamPaperResult',
    component: () => import('@/views/user/ExamPaper/ResultFull.vue'),
    meta: { 
      title: '试卷得分',
      layout: UserLayout  // 直接使用导入的布局组件
    }
  },
]