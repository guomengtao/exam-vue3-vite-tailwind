<script setup>
import { ref, onMounted, watch } from 'vue'
import FormUI from './FormUI.vue'
import { toRefs } from 'vue'

const props = defineProps({
  mode: String, // 'create' or 'edit'
  id: [String, Number],
})

const form = ref({ title: '' })
const loading = ref(false)
const error = ref('')

const baseUrl = import.meta.env.VITE_API_BASE_URL

onMounted(() => {
  if (props.mode === 'edit' && props.id) {
    loading.value = true
    fetch(`${baseUrl}/api/exam_template?id=${props.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) {
          form.value.title = data.data.title  // 这里只拿 title 字段
        } else {
          error.value = data.msg
        }
      })
      .catch(err => {
        error.value = err.message
      })
      .finally(() => {
        loading.value = false
      })
  }
})
</script>

<template>
  <FormUI :form="form" />
</template>