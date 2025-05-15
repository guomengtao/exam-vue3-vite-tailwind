<template>
  <div v-if="visible" class="modal-mask">
    <div class="modal-content">
      <button class="modal-close" @click="$emit('close')">✖</button>
      <slot /> <!-- 插入内容 -->
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean
});
defineEmits(['close']);
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 200px;
  min-height: 100px;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 8px;
  right: 12px;
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
}
</style>