<template>
  <button
    @click="handleExport"
    class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
  >
    导出模板
  </button>
</template>

<script setup>
import { defineProps } from 'vue'
import * as XLSX from 'xlsx'
import { formatStatus, formatQuestionType } from '@/utils/examExportHelpers'

const props = defineProps({
  examData: {
    type: Object,
    required: true
  }
})

const handleExport = () => {
  const wb = XLSX.utils.book_new()
  
  // 基本信息表
  const basicData = [{
    'ID': props.examData.id,
    '标题': props.examData.title,
    '描述': props.examData.description,
    '总分': props.examData.total_score,
    '状态': formatStatus(props.examData.status),
    '创建人': props.examData.creator
  }]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(basicData), "基本信息")

  // 题目表
  const questions = props.examData.questions?.map(q => ({
    '题目': q.title,
    '题型': formatQuestionType(q.type),
    '分值': q.score,
    '选项': q.options?.join('|') || '',
    '正确答案': q.correct_answer
  })) || []
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(questions), "题目列表")

  XLSX.writeFile(wb, `试卷_${props.examData.title}_${props.examData.id}.xlsx`)
}
</script>