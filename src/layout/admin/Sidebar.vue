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
          <div class="px-4 py-2 text-xs text-gray-500 uppercase tracking-wide">问卷操作</div>
          <ul class="space-y-1 pl-2">
            <SidebarLink icon="Upload" text="导入问卷" to="#" />
            
            <!-- ✅ 改回原始写法：新增问卷 -->
            <li>
              <RouterLink
                to="/admin/exam-template/create"
                class="flex items-center px-4 py-2 text-sm hover:bg-gray-100 rounded transition-colors"
                active-class="bg-gray-100 font-semibold"
              >
                <FilePlus class="w-4 h-4 mr-2 text-gray-500" />
                新增问卷
              </RouterLink>
            </li>

            <SidebarLink icon="Files" text="问卷模板" to="#" />
            <SidebarLink icon="ListChecks" text="问卷管理" to="#" />
            <SidebarLink icon="UserPlus" text="导入用户" to="#" />
            <SidebarLink icon="UserPlus" text="添加用户" to="#" />
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
import { Home, Upload, FilePlus, Files, ListChecks, UserPlus, Users, ShieldCheck } from 'lucide-vue-next';
</script>

<!-- 封装组件仍保留，可以继续用其他 SidebarLink -->
<script>
import { defineComponent, h } from 'vue';
import * as icons from 'lucide-vue-next';

const SidebarLink = defineComponent({
  props: {
    to: String,
    icon: String,
    text: String,
  },
  setup(props) {
    const IconComponent = icons[props.icon];
    return () =>
      h(
        'li',
        {},
        h(
          'RouterLink',
          {
            to: props.to,
            class:
              'flex items-center px-4 py-2 text-sm hover:bg-gray-100 rounded transition-colors',
            activeClass: 'bg-gray-100 font-semibold',
          },
          {
            default: () => [
              h(IconComponent, {
                class: 'w-4 h-4 mr-2 text-gray-500',
              }),
              props.text,
            ],
          }
        )
      );
  },
});

export default {
  components: {},
};
</script>