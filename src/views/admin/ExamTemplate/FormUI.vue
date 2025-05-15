<template>
  <div class="p-6 space-y-6 max-w-5xl mx-auto">
    <div class="flex items-center justify-between border-b pb-4 mb-6">
      <h1 class="text-2xl font-bold">编辑试卷模板</h1>
      <router-link
        to="/admin/exam-template/list"
        class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
      >
        返回列表
      </router-link>
    </div>

    <form @submit.prevent class="space-y-4 bg-white p-6 shadow rounded">
      <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div>
    
  <input v-model="props.form.title" class="form-input" />
 
          <label class="block text-sm font-medium">标题</label>
          <input type="text" class="form-input w-full" value="演示标题" readonly />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium">描述</label>
        <textarea class="form-textarea w-full" rows="3" readonly>这是演示描述文本</textarea>
      </div>

      <div>
        <h2 class="text-xl font-semibold mb-2">
          题目列表（总分：10）
        </h2>

        <div
          v-for="(q, index) in questions"
          :key="index"
          :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
          class="rounded-lg p-4"
        >
          <div class="border-t pt-4 mt-4 space-y-2 relative">
            <button
              type="button"
              class="absolute top-2 right-0 text-red-600 hover:text-red-800 delete-btn"
              title="删除此题"
              disabled
            >
              ×
            </button>

            <!-- 表头 -->
            <div class="grid grid-cols-[100px_1fr_80px_100px] gap-4 items-center mb-1 text-sm text-gray-600 font-medium">
              <div>类型</div>
              <div>题目</div>
              <div>分值</div>
              <div>题图</div>
            </div>
            <!-- 题目行 -->
            <div class="grid grid-cols-[100px_1fr_80px_100px] gap-4 items-center">
              <div class="w-[100px]">
                <select class="form-select w-full" disabled>
                  <option>单选题</option>
                </select>
              </div>
              <div>
                <input type="text" class="form-input w-full" value="演示题目" readonly />
              </div>
              <div class="w-[80px]">
                <input type="number" class="form-input w-full" value="5" readonly />
              </div>
              <div class="w-[100px] flex items-center">
                <ImageCropper
                  :modelValue="props.form?.questions?.[index]?.image_url"
                  @update:modelValue="val => {
                    if (props.form?.questions?.[index]) {
                      props.form.questions[index].image_url = val
                    }
                  }"
                  :buttonIcon="'📷'"
                  :previewWidth="320"
                  :previewHeight="180"
                  :buttonType="'button'"
                />
              </div>
            </div>

            <div class="relative inline-block mt-2">
              <img
                :src="props.form?.questions?.[index]?.image_url || 'https://via.placeholder.com/320x180'"
                class="w-[320px] h-[180px] object-cover rounded-xl shadow-lg border border-gray-200"
                alt="题图大图"
              />
            </div>

            <div>
              <label class="block text-sm font-medium">选项</label>
              <ul class="space-y-1">
                <li
                  v-for="(opt, idx) in q.options"
                  :key="idx"
                  :class="idx % 2 === 0 ? 'bg-gray-100' : 'bg-white'"
                  class="mb-4 p-3 rounded-md"
                >
                  <div class="space-y-1">
                    <!-- 第一行：选择按钮 + 字母 + 图片 -->
                    <div class="flex items-center gap-2">
                      <input type="radio" disabled />
                      <span class="option-letter">{{ String.fromCharCode(65 + idx) }}.</span>
                      <div class="relative">
                        <img
                          src="https://via.placeholder.com/120x68"
                          class="w-[120px] h-[68px] object-cover rounded-xl shadow-lg border border-gray-200"
                          alt="选项图"
                        />
                      </div>
                    </div>

                    <!-- 第二行：输入 + 上传按钮 -->
                    <div class="flex items-center gap-2">
                      <input
                        type="text"
                        class="form-input flex-1"
                        :value="opt"
                        readonly
                      />
                      <button disabled class="px-2 py-1 bg-gray-300 rounded">上传</button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="pt-4">
          <button type="button" disabled class="w-full px-4 py-2 bg-green-300 text-white rounded cursor-not-allowed">
            + 添加题目
          </button>
        </div>
      </div>

      <div class="pt-4">
        <button
          type="submit"
          disabled
          class="px-6 py-2 bg-blue-300 text-white rounded cursor-not-allowed"
        >
          保存修改
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import ImageCropper from '@/components/ImageCropper.vue'

const props = defineProps({
  form: Object
})

const questions = [
  {
    options: ['选项一', '选项二', '选项三', '选项四'],
  },
]
</script>

<style scoped>
.form-input,
.form-select,
.form-textarea {
  border: 1px solid #d1d5db;
  padding: 0.5rem;
  border-radius: 0.375rem;
  width: 100%;
}
.option-letter {
  font-weight: bold;
  min-width: 1.5rem;
  display: inline-block;
}
.delete-btn {
  transition: all 0.2s;
}
.delete-btn:hover {
  transform: scale(1.1);
}
</style>
