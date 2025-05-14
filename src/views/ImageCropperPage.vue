<template>
  <div class="max-w-3xl mx-auto p-6 space-y-6">
    <h2 class="text-xl font-bold">编辑图片题</h2>

    <div v-for="(q, qIdx) in questions" :key="qIdx" class="border border-gray-200 p-4 rounded space-y-4">
      <h3 class="font-bold">{{ q.type === 'multiple' ? '【多选题】' : '【单选题】' }} {{ q.text }}</h3>

      <img v-if="q.image" :src="q.image" class="max-w-full max-h-40 mb-2 rounded" />

      <div v-for="(opt, idx) in q.options" :key="idx" class="space-y-1">
        <img v-if="opt.image" :src="opt.image" class="max-w-full max-h-24 rounded border" />

        <div class="flex items-center gap-2">
          <input v-model="opt.text" type="text" placeholder="请输入选项内容" class="flex-1 border px-3 py-2 rounded" />
          <ImageCropper
            v-model="opt.image"
            uploadUrl="http://192.168.100.102:5173/upload"
            class="w-5 h-5 bg-transparent border-none p-0 shadow-none"
          >
            ●
          </ImageCropper>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import ImageCropper from '@/components/ImageCropper.vue'

const placeholder = '/images/example.jpg'

const questions = reactive([
  {
    type: 'multiple',
    text: '以下哪些图片是水果？',
    image: placeholder,
    options: [
      { text: '苹果', image: placeholder },
      { text: '香蕉', image: placeholder },
      { text: '土豆', image: placeholder },
      { text: '番茄', image: placeholder }
    ]
  },
  {
    type: 'single',
    text: '下面哪个动物是猫？',
    image: placeholder,
    options: [
      { text: '狗', image: placeholder },
      { text: '猫', image: placeholder },
      { text: '鸟', image: placeholder },
      { text: '鱼', image: placeholder }
    ]
  }
])
</script>