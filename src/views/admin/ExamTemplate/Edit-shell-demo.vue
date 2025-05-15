<!-- Edit.vue -->
<template>
  <FormShell :mode="'edit'" :id="id" />
</template>

<script setup>
import { useRoute } from 'vue-router'
import FormShell from './FormShell.vue'

const route = useRoute()
const id = route.params.id || route.query.id  // 支持 query 或 path 传参
</script>