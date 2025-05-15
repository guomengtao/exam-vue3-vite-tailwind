<template>
  <div>
    <button class="trigger-button" type="button" @click="openCropper">图</button>
    <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none;" />
    <div v-if="visible" class="modal">
      <div>
        <button type="button" class="close-button" @click="visible = false">关闭</button>
        <!-- 原始组件内容全部移入这里 -->
        <!-- 原内容起始 -->
        <div>
          <!-- 顶部：截图 + 预览（两小行 + 居中） -->
          <div class="top-section">
            <!-- 左列：截图 + 按钮 -->
            <div class="left-cropper-column">
              <div class="cropper-container">
                <img ref="image" src="" alt="Preview" />
              </div>
              <button type="button" class="reselect-button" @click="triggerFileInput">重新选择</button>
            </div>

            <!-- 中列：竖线 -->
            <div class="divider"></div>

            <!-- 右列：预览图 + 文字 -->
            <div class="preview-box-container">
              <div class="preview-box">
                <img :src="croppedImage" v-if="croppedImage" />
              </div>
              <div class="preview-label">预览图片</div>
            </div>
          </div>

          <!-- 底部提示与上传 -->
          <div class="bottom-section">
            <p class="upload-tip-inline">
              请选择图片上传：大小800 * 450像素支持JPG、PNG等格式，图片需小于2M
            </p>
            <button type="button" class="upload-button" @click="uploadCroppedImage">
              上传图片
            </button>
          </div>

        </div>
        <!-- 原内容结束 -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';

const props = defineProps({
  modelValue: String,
  uploadUrl: String
})
const emit = defineEmits(['update:modelValue'])

const visible = ref(false);
const image = ref(null);
let cropper = null;
const croppedImage = ref('');
const fileInput = ref(null);

const openCropper = () => {
  fileInput.value.click();
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) {
    console.error("没有选择文件！");
    return;
  }
  console.log("文件选择成功：", file); // 打印文件信息
  uploadImage(e);
  visible.value = true;
};

// 只在点击上传按钮时上传裁剪后图片，此函数仅负责初始化裁剪器
const uploadImage = async (e) => {
  const file = e.target.files[0];
  if (!file) {
    console.error("没有选择文件！");
    return;
  }
  // 读取文件并显示到裁剪器
  const reader = new FileReader();
  reader.onload = (event) => {
    image.value.src = event.target.result;
    // 等待图片加载完毕再初始化 cropper
    image.value.onload = () => {
      initCropper();
    };
  };
  reader.readAsDataURL(file);
};

const updatePreview = () => {
  if (!cropper) return;
  const canvas = cropper.getCroppedCanvas();
  if (canvas) {
    croppedImage.value = canvas.toDataURL('image/jpeg');
  }
};

const initCropper = () => {
  if (cropper) cropper.destroy();
  cropper = new Cropper(image.value, {
    aspectRatio: 16 / 9,
    viewMode: 1,
    autoCropArea: 1,
    ready() {
      updatePreview();
    },
    crop() {
      updatePreview();
    }
  });
};

const cropImage = () => {
  if (!cropper) return null;
  return cropper.getCroppedCanvas();
};

const uploadCroppedImage = async () => {
  if (!cropper) return;

  const canvas = cropImage();

  if (!canvas) {
    console.error('裁剪失败，无法生成图片');
    return;
  }

  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));

  if (!blob) {
    console.error('无法转换为有效的图片');
    return;
  }

  // 打印生成的 blob，确认图片是否有效
  console.log('生成的裁剪图片 blob:', blob);

  // 创建一个文件对象，确保上传时是有效的图片
  const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
  const formData = new FormData();
  formData.append('file', file); // 字段名为后端要求的 'file'

  // 打印 FormData 内容，确保字段名正确
  formData.forEach((value, key) => {
    console.log(`${key}:`, value);
  });

  try {
    const response = await fetch('http://47.120.38.206:8081/api/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: formData
    });

    const result = await response.json();
    if (result && result.url) {
      const fullUrl = 'http://47.120.38.206:8081' + result.url;
      emit('update:modelValue', fullUrl); // 更新上传图片 URL
      visible.value = false;
    } else {
      console.error('上传失败:', result);
    }
  } catch (error) {
    console.error('上传请求失败:', error);
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};
</script>

<style>
/* 裁剪容器 */
.cropper-container {
  width: 180px;
  height: 180px;
  margin: 20px 0;
  position: relative;
}

/* 图片样式 */
.cropper-container img {
  max-width: 100%;
}

/* 预览样式 */
.preview img {
  max-width: 300px;
  margin-top: 10px;
  border: 1px dashed #ccc;
}

/* 实时预览样式 */
.preview-box-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 180px;
}

/* 预览框按16:9比例调整 */
.preview-box {
  width: 180px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.preview-box img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}

.preview-label {
  font-size: 14px;
  color: #555;
  text-align: center;
  width: 100%;
}

.cropper-label {
  font-size: 14px;
  color: #555;
  text-align: center;
}

.upload-tip {
  margin-top: 4px;
  font-size: 12px;
  color: #999;
  text-align: center;
}

/* 横向容器 */
.horizontal-container {
  display: flex;
  gap: 30px;
  align-items: flex-end;
}

.divider {
  width: 1px;
  background-color: #ddd;
  height: 180px;
  margin: 0 15px;
}

/* 核心修改：4个红色外角控制点 */
.cropper-point {
  width: 16px !important;
  height: 16px !important;
  background-color: transparent !important;
  border: 2px solid red !important;
  opacity: 1 !important;
}

/* 定位到裁剪框外边缘（关键调整） */
.cropper-point.point-se {
  right: -8px !important;
  bottom: -8px !important;
}
.cropper-point.point-sw {
  left: -8px !important;
  bottom: -8px !important;
}
.cropper-point.point-nw {
  left: -8px !important;
  top: -8px !important;
}
.cropper-point.point-ne {
  right: -8px !important;
  top: -8px !important;
}

/* 隐藏其他控制点 */
.cropper-point:not(.point-se):not(.point-sw):not(.point-nw):not(.point-ne) {
  display: none !important;
}

/* 移除默认中心点 */
.cropper-point:before {
  display: none !important;
}

/* 裁剪框样式 */
.cropper-view-box {
  outline: 1px solid rgba(255, 255, 255, 0.8) !important;
}

.upload-tip-bottom {
  width: 100%;
  text-align: center;
  margin-top: 16px;
  font-size: 12px;
  color: #999;
}

.upload-button {
  margin: 30px auto 0;
  display: block;
  padding: 10px 20px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

.upload-button:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.reselect-button {
  margin-top: 8px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 10px;
  cursor: pointer;
  font-size: 14px;
}

.reselect-button:hover {
  background-color: #e6e6e6;
}

.label-button-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  margin-top: 12px;
}

.upload-tip-inline {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
  text-align: center;
  width: 100%;
}

.select-image-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  display: block;
  width: 100%;
  text-align: center;
}

.select-image-button:hover {
  background-color: #357ce7;
}

/* 新增布局样式 */
.top-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  margin-top: 20px;
}

.left-cropper-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 220px;
}

.preview-box-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 180px;
}

.bottom-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
}

/* 新增弹窗样式 */
.trigger-button {
  background-color: #409eff;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: none;
}

.modal {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  overflow-y: auto;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal > div {
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  position: relative;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #eee;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
}
</style>