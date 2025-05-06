<template>
  <div class="h-screen flex bg-gray-100">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <Header />

      <!-- Content -->
      <main class="flex-1 p-6 overflow-y-auto">
        <!-- Breadcrumb navigation -->
        <Breadcrumb :items="breadcrumbItems" />

        <!-- Actual view -->
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumb from '@/components/Breadcrumb.vue';
import Sidebar from './Sidebar.vue';
import Header from './Header.vue';

const route = useRoute();

// 自动生成面包屑列表
const breadcrumbItems = computed(() => {
  return route.matched
    .filter(r => r.meta?.title)
    .map(r => ({
      label: r.meta.title,
      path: r.path.startsWith('/') ? r.path : '/' + r.path,
    }));
});
</script>