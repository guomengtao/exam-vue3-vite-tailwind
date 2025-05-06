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

export default router