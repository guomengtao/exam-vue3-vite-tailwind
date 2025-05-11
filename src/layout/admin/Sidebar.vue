<template>
  <aside class="w-64 bg-white text-black h-screen border-r border-gray-200">
    <div class="p-4 text-2xl font-bold border-b border-gray-300">后台管理</div>
    <nav class="mt-4">
      <ul class="space-y-2">
        <!-- 一级菜单项 -->
        <li>
          <RouterLink
            to="/admin"
            class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
            active-class="bg-gray-100 font-semibold"
          >
            <Home class="w-5 h-5 mr-3 text-gray-600" />
            首页
          </RouterLink>
        </li>

        <!-- 问卷操作菜单 -->
        <li>
          <div class="px-4 py-2 text-xs text-gray-500 uppercase tracking-wide">试卷操作</div>
          <ul class="space-y-1 pl-2">
            <SidebarLink icon="Upload" text="导入问卷" to="#" />

            <!-- ✅ 原始写法：新增试卷模版 -->
            <li>
              <RouterLink
                to="/admin/exam-template/create"
                class="flex items-center px-4 py-2 text-sm hover:bg-gray-100 rounded transition-colors"
                active-class="bg-gray-100 font-semibold"
              >
                <FilePlus class="w-4 h-4 mr-2 text-gray-500" />
                新增试卷
              </RouterLink>
            </li>
            

            <SidebarLink icon="Files" text="试卷模板" to="/admin/exam-template/list" />
            <SidebarLink icon="ListChecks" text="试卷管理" to="/admin/exam-paper/list" />
            <SidebarLink icon="UserPlus" text="导入用户" to="#" />
            <SidebarLink icon="UserPlus" text="添加用户" to="admin/exam-template/create" />
            <SidebarLink icon="Users" text="用户管理" to="#" />
          </ul>
        </li>

        <!-- 系统管理菜单 -->
        <li>
          <div class="px-4 py-2 text-xs text-gray-500 uppercase tracking-wide">系统管理</div>
          <ul class="space-y-1 pl-2">
            <SidebarLink icon="UserPlus" text="新增管理员" to="#" />
            <SidebarLink icon="ShieldCheck" text="管理员管理" to="#" />
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { Home, Upload, FilePlus, Files, ListChecks, UserPlus, Users, ShieldCheck } from 'lucide-vue-next'
import SidebarLink from '@/components/sidebar/SidebarLink.vue' // ✅ 修改为你的实际路径
</script>