<!-- 📄 src/components/sidebar/SidebarLink.vue -->
<template>
  <li>
    <RouterLink
      :to="to"
      class="flex items-center px-4 py-2 text-sm hover:bg-gray-100 rounded transition-colors"
      active-class="bg-gray-100 font-semibold"
    >
      <component :is="iconComponent" class="w-4 h-4 mr-2 text-gray-500" />
      {{ text }}
    </RouterLink>
  </li>
</template>

<script setup>
import { computed } from 'vue'
import * as icons from 'lucide-vue-next'
import { defineProps } from 'vue'

const props = defineProps({
  to: String,
  icon: String,
  text: String
})

// 动态获取图标组件
const iconComponent = computed(() => icons[props.icon] || null)
</script>