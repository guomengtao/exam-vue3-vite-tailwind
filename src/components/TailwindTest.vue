/**
 * 【严禁删除】本注释用于描述当前文件的功能、页面交互要点等关键信息。
 * 【严禁精简】所有已有注释内容不得删除或精简，必须在原有基础上“增量更新”。
 *
 * - 功能概述：必须保留，除非明确说明删除。
 * - 页面交互要点：必须保留，除非明确说明删除。
 * 
 * ✅ 注释必须完整描述设计意图，帮助后续开发者理解当前文件结构。
 * ✅ 若需求变更，只能改具体字段或描述，不得擅自精简结构。
 *
 * ============================================
 * 🧾 页面功能说明：试卷创建表单
 * ============================================
 * 🔧 功能概述：
 * - 用于教师创建一份试卷模板，支持添加题目、题型、选项、图片、翻数、正确答案
 * - 试卷信息包含标题、描述、总分自动计算
 *
 * 🎯 页面交互要点：
 * - 默认存在一道单选题，用户可新增/删除题目
 * - 题型支持切换（单选、多选），多选支持 bitmask 计算得分
 * - 每题支持添加图片、设置翻数、设置正确答案
 * - 实时统计总分并展示
 *
 * ============================================
 * 📦 数据结构（用于后端接口）
 * ============================================
 * 试卷整体字段结构：
 * {
 *   title: String,               // 试卷标题
 *   description: String,         // 试卷描述
 *   questions: [                 // 题目数组
 *     {
 *       type: 'single' | 'multi',     // 题型
 *       score: Number,                // 当前题翻数
 *       questionText: String,         // 题目内容
 *       questionImage: String?,       // 题目图片
 *       options: [
 *         {
 *           text: String,
 *           image: String?,           // 选项图片
 *         }
 *       ],
 *       correctAnswer: String | Number  // 单选用 A/B/C/D，多选用 bitmask 表示
 *     }
 *   ],
 *   totalScore: Number          // 总分，由前端自动统计
 * }
 *
 * 📮 提交接口：POST /api/exam-template/create
 *
 * ============================================
 * 🧩 页面内组件结构（子组件划分）
 * ============================================
 * - ExamForm.vue (页面主组件)
 *   - ExamMeta.vue         // 试卷元信息输入（标题、描述）
 *   - QuestionList.vue     // 题目列表组件
 *     - QuestionItem.vue     // 单个题目组件（包含选项编辑、题型切换、答案设置）
 *       - OptionItem.vue       // 单个选项编辑（文字+图片）
 *
 * 📎 核心逻辑说明：
 * - QuestionList 负责维护 questions 数组状态，向上传递 totalScore
 * - QuestionItem 内部处理题型切换、bitmask 答案处理逻辑
 * - OptionItem 支持文本与图片，需支持动态添加/删除
 *
 * ============================================
 * 🧠 特殊逻辑说明
 * ============================================
 * - bitmask 答案格式示意：选 A + C => 1 << 0 + 1 << 2 = 5
 * - 题目动态添加/删除时，总分重新计算并同步
 * - 图片为 base64 或上传后的 URL，由用户选择
 * - 表单整体可通过“保存”按钮将完整 JSON 数据提交
 *
 * ============================================
 * 🧪 开发经验 & 问题总结（增量补充）
 * ============================================
 * ✅ 问题一：路由未安装未提示
 * - 使用 Vite + Vue3 初始化项目时，必须手动安装 `vue-router@4`
 * - 否则页面不会报错但无法跳转，影响开发排查
 * - 安装命令：npm install vue-router@4
 *
 * ✅ 问题二：开发环境端口冲突
 * - 使用 Docker 启动时已有端口监听，`vite` 报错提示 `Port 8089 is already in use`
 * - 应避免使用 `npm run dev` 重复启动，而是使用：
 *   - 推荐命令：`docker restart vue3-test_vue-app_1`
 *
 * ✅ 其他建议：
 * - lsof -i:8089 可检查端口占用情况
 * - 若项目需长期维护，建议将所有经验文档整理入 `docs/dev-notes.md`
 */
 
<template>
  <div class="p-10 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
    <h1 class="text-green-500 text-4xl font-bold mb-6">Hello Tailwind!</h1>
    <button class="px-6 py-3 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white rounded-lg shadow-lg hover:from-green-500 hover:to-green-700 transform transition-all duration-300 ease-in-out hover:scale-105">
      Tailwind 按钮测试111
    </button>
  </div>
</template>

<script setup>
// 无需 JS 内容，只测试样式
</script>