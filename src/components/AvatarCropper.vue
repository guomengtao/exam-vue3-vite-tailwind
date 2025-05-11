<template>
  <div class="container">
    <!-- 截图触发按钮 -->
    <button @click="startCapture">开始截图</button>
    
    <!-- 截图目标区域 -->
    <div ref="captureArea" class="content-box">
      <h2>可截图内容区域</h2>
      <p>按住鼠标左键拖拽选择截图范围</p>
    </div>

    <!-- 选区遮罩层 -->
    <div v-if="isCapturing" 
         class="selection-mask"
         @mousedown="startDrag"
         @touchstart.passive="startDrag"
         @mouseup="endDrag"
         @touchend="endDrag">
      <div class="selection-box" :style="boxStyle"></div>
    </div>

    <!-- 预览区 -->
    <div v-if="previewUrl" class="preview">
      <img :src="previewUrl" alt="截图预览">
      <button @click="downloadImage">下载图片</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import html2canvas from 'html2canvas'

// 响应式状态
const captureArea = ref(null)
const isCapturing = ref(false)
const previewUrl = ref('')
const startPos = ref({ x: 0, y: 0 })
const endPos = ref({ x: 0, y: 0 })
const isDragging = ref(false)

// 计算选区样式
const boxStyle = computed(() => ({
  left: `${Math.min(startPos.value.x, endPos.value.x)}px`,
  top: `${Math.min(startPos.value.y, endPos.value.y)}px`,
  width: `${Math.abs(startPos.value.x - endPos.value.x)}px`,
  height: `${Math.abs(startPos.value.y - endPos.value.y)}px`
}))

// 开始截图
const startCapture = () => {
  isCapturing.value = true
  startPos.value = { x: 0, y: 0 }
  endPos.value = { x: 0, y: 0 }
}

// 开始拖拽
const startDrag = (e) => {
  isDragging.value = true
  const rect = captureArea.value.getBoundingClientRect()
  const clientX = e.clientX || e.touches[0].clientX
  const clientY = e.clientY || e.touches[0].clientY
  
  startPos.value = {
    x: clientX - rect.left,
    y: clientY - rect.top
  }
  endPos.value = { ...startPos.value }

  // 优化事件监听[5,7](@ref)
  document.addEventListener('mousemove', handleDrag, { passive: true })
  document.addEventListener('touchmove', handleDrag, { passive: true })
}

// 处理拖拽
const handleDrag = (e) => {
  if (!isDragging.value) return
  
  const rect = captureArea.value.getBoundingClientRect()
  const clientX = e.clientX || e.touches[0].clientX
  const clientY = e.clientY || e.touches[0].clientY
  
  endPos.value = {
    x: Math.max(0, Math.min(clientX - rect.left, rect.width)),
    y: Math.max(0, Math.min(clientY - rect.top, rect.height))
  }
}

// 结束拖拽
const endDrag = async () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('touchmove', handleDrag)
  
  if (startPos.value.x !== endPos.value.x && 
      startPos.value.y !== endPos.value.y) {
    await captureSelection()
  }
  isCapturing.value = false
}

// 执行截图
const captureSelection = async () => {
  const canvas = await html2canvas(captureArea.value, {
    useCORS: true, // 处理跨域[3](@ref)
    logging: false,
    backgroundColor: null
  })
  
  // 计算选区参数
  const x = Math.min(startPos.value.x, endPos.value.x)
  const y = Math.min(startPos.value.y, endPos.value.y)
  const width = Math.abs(startPos.value.x - endPos.value.x)
  const height = Math.abs(startPos.value.y - endPos.value.y)

  // 创建裁剪Canvas
  const croppedCanvas = document.createElement('canvas')
  const ctx = croppedCanvas.getContext('2d')
  croppedCanvas.width = width
  croppedCanvas.height = height
  
  ctx.drawImage(
    canvas,
    x, y, width, height,
    0, 0, width, height
  )

  previewUrl.value = croppedCanvas.toDataURL('image/png')
}

// 下载图片
const downloadImage = () => {
  const link = document.createElement('a')
  link.href = previewUrl.value
  link.download = `screenshot_${Date.now()}.png`
  link.click()
}
</script>

<style scoped>
.selection-mask {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  cursor: crosshair;
}

.selection-box {
  position: absolute;
  border: 2px dashed #fff;
  background: rgba(255,255,255,0.1);
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
}

.preview {
  margin-top: 20px;
  text-align: center;
}

.preview img {
  max-width: 100%;
  border: 1px solid #ddd;
}

.content-box {
  position: relative;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  min-height: 300px;
}
</style>