<template>
  <nav class="text-sm text-gray-600 mb-4">
    <ul class="flex space-x-2">
      <li v-for="(item, index) in items" :key="index" class="flex items-center">
        <router-link
          v-if="index !== items.length - 1"
          :to="item.path"
          class="text-blue-600 hover:underline"
        >
          {{ item.label }}
        </router-link>
        <span v-else class="font-semibold text-gray-800">{{ item.label }}</span>
        <span v-if="index !== items.length - 1" class="mx-1">/</span>
      </li>
    </ul>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});
</script>