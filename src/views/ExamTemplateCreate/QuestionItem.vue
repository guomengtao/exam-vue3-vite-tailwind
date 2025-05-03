<template>
  <div class="question-item">
    <div class="question-header">
      <h3>题目 {{ index + 1 }}</h3>
      <button @click="$emit('delete')">🗑 删除</button>
    </div>

    <!-- 题型选择 -->
    <label>题型：</label>
    <select v-model="localQuestion.type">
      <option value="single">单选题</option>
      <option value="multiple">多选题</option>
    </select>

    <!-- 题干 -->
    <label>题干：</label>
    <input v-model="localQuestion.title" placeholder="请输入题干" />
    <ImageUploader v-model:image="localQuestion.titleImage" />

    <!-- 选项列表 -->
    <div class="options">
      <div
        v-for="(option, i) in localQuestion.options"
        :key="i"
        class="option"
      >
        <input
          v-model="option.text"
          :placeholder="`选项 ${String.fromCharCode(65 + i)}`"
        />
        <ImageUploader v-model:image="option.image" />
      </div>

      <!-- 选项固定为4个，隐藏按钮 -->
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import ImageUploader from '@/components/ImageUploader.vue' // 使用 @ 指向 src

const props = defineProps({
  question: Object,
  index: Number
})
const emit = defineEmits(['update', 'delete'])

// 本地状态，初始化选项图片字段
const localQuestion = reactive({
  ...JSON.parse(JSON.stringify(props.question)),
  titleImage: props.question.titleImage || '',
  options: (props.question.options || []).map(opt => ({
    ...opt,
    image: opt.image || ''
  }))
})

// 实时同步数据回父组件
watch(
  () => localQuestion,
  (val) => {
    emit('update', JSON.parse(JSON.stringify(val)))
  },
  { deep: true }
)
</script>

<style scoped>
.question-item {
  margin-top: 10px;
}
.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.options {
  margin-top: 10px;
}
.option {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 10px;
}
.option input {
  flex: 1;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>