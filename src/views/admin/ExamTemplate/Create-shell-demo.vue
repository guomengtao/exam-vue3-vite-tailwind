<template>
  <FormShell @submit="onSubmit" mode="create" />
</template>

<script setup>
import FormShell from './FormShell.vue'

function onSubmit(data) {
  console.log('Create提交:', data)
  // 调用新增API接口
}
</script>