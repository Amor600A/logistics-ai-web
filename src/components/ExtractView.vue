<template>
  <div class="extract-container">
    <h1>物流单据智能提取工具</h1>

    <!-- 输入区域 -->
    <div class="input-area">
      <div class="input-type-selector">
        <label>输入类型：</label>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" v-model="inputType" value="text" />
            <span>文本内容</span>
          </label>
          <label class="radio-label">
            <input type="radio" v-model="inputType" value="file" />
            <span>文件路径</span>
          </label>
          <label class="radio-label">
            <input type="radio" v-model="inputType" value="upload" />
            <span>文件上传</span>
          </label>
        </div>
      </div>

      <!-- 文本和文件路径输入 -->
      <textarea v-if="inputType !== 'upload'" v-model="inputText"
        :placeholder="inputType === 'text' ? '请粘贴物流单据文本,例如:运单56789 货重3.5kg 收货人李四 电话13912345678' : '请输入文件路径,例如: D:\\documents\\logistics.txt'"
        rows="6"></textarea>

      <!-- 文件上传区域 -->
      <div v-if="inputType === 'upload'" class="file-upload-area">
        <div class="upload-box" @click="triggerFileInput" :class="{ 'has-file': uploadedFile }">
          <div v-if="!uploadedFile" class="upload-placeholder">
            <span class="upload-icon">📁</span>
            <p>点击选择文件或拖拽文件到此区域</p>
            <p class="upload-hint">支持 .txt, .doc, .docx, .pdf, .xlsx, .xls 格式，最大5MB</p>
          </div>
          <div v-else class="file-info">
            <span class="file-icon">📄</span>
            <div class="file-details">
              <p class="file-name">{{ uploadedFile.name }}</p>
              <p class="file-size">{{ formatFileSize(uploadedFile.size) }}</p>
            </div>
            <button @click.stop="removeFile" class="remove-btn">×</button>
          </div>
        </div>
        <input ref="fileInput" type="file" @change="handleFileSelect" accept=".txt,.doc,.docx,.pdf,.xlsx,.xls"
          style="display: none;" />
      </div>

      <div class="action-buttons">
        <button @click="showConfirmDialog" :disabled="loading || !isInputValid" class="extract-btn">
          {{ loading ? '提取中...' : '开始提取' }}
        </button>
      </div>
    </div>

    <!-- 结果展示区域 -->
    <div style="padding: 3px;">
      <h3 style="padding-bottom: 3px;">提取结果（JSON格式）</h3>
      <div class="result-area" v-if="result">
        <pre>{{ JSON.parse(JSON.stringify(result, null, 2)) }}</pre>
      </div>
    </div>

    <!-- 确认对话框 -->
    <div v-if="showConfirm" class="confirm-dialog-overlay">
      <div class="confirm-dialog">
        <h3>确认提取</h3>
        <p>您选择的是 <strong>{{ getInputTypeText() }}</strong></p>
        <div class="confirm-content">
          <p><strong>{{ inputType === 'upload' ? '上传文件' : '输入内容' }}：</strong></p>
          <div v-if="inputType === 'upload'" class="content-preview">
            <p>文件名：{{ uploadedFile?.name }}</p>
            <p>文件大小：{{ formatFileSize(uploadedFile?.size) }}</p>
          </div>
          <div v-else class="content-preview">{{ inputText }}</div>
        </div>
        <div class="dialog-buttons">
          <button @click="confirmExtract" class="confirm-btn">确认提取</button>
          <button @click="cancelExtract" class="cancel-btn">取消</button>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div class="error-tip" v-if="errorMsg">{{ errorMsg }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ExtractApiService from '@/services/ExtractApiService';

// 响应式数据
const inputText = ref(''); // 输入的单据文本
const inputType = ref('text'); // 输入类型：text、file 或 upload
const uploadedFile = ref(null); // 上传的文件
const result = ref(null); // 提取结果
const loading = ref(false); // 加载状态
const errorMsg = ref(''); // 错误提示
const showConfirm = ref(false); // 显示确认对话框
const fileInput = ref(null); // 文件输入引用

// 计算属性：检查输入是否有效
const isInputValid = computed(() => {
  if (inputType.value === 'upload') {
    return !!uploadedFile.value;
  }
  return inputText.value.trim().length > 0;
});

// 获取输入类型文本
const getInputTypeText = () => {
  const types = {
    'text': '文本内容',
    'file': '文件路径',
    'upload': '文件上传'
  };
  return types[inputType.value] || '文本内容';
};

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click();
};

// 处理文件选择
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 检查文件类型
    const allowedTypes = [
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    const allowedExtensions = ['.txt', '.doc', '.docx', '.pdf', '.xlsx', '.xls'];

    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      errorMsg.value = '不支持的文件格式，请选择 支持 .txt, .doc, .docx, .pdf, .xlsx, .xls 文件';
      return;
    }

    // 检查文件大小（限制为5MB）
    if (file.size > 5 * 1024 * 1024) {
      errorMsg.value = '文件大小不能超过5MB';
      return;
    }

    uploadedFile.value = file;
    errorMsg.value = '';
  }
};

// 移除文件
const removeFile = () => {
  uploadedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// 显示确认对话框
const showConfirmDialog = () => {
  if (!isInputValid.value) {
    errorMsg.value = getInputTypeText() === '文件上传' ? '请选择要上传的文件！' : `请输入${getInputTypeText()}！`;
    return;
  }
  showConfirm.value = true;
  errorMsg.value = '';
};

// 取消提取
const cancelExtract = () => {
  showConfirm.value = false;
};

// 确认提取
const confirmExtract = async () => {
  showConfirm.value = false;

  // 重置状态
  loading.value = true;
  errorMsg.value = '';
  result.value = null;

  try {
    switch (inputType.value) {
      case 'text':
        await handleTextExtract();
        break;
      case 'file':
        await handleFilePathExtract();
        break;
      case 'upload':
        await handleUploadExtract();
        break;
      default:
        throw new Error('不支持的输入类型');
    }
  } catch (err) {
    errorMsg.value = `接口调用失败：${err.message || '请检查后端服务是否启动'}`;
  } finally {
    loading.value = false; // 结束加载
  }
};

// 处理文本提取
const handleTextExtract = async () => {
  try {
    const apiResponse = await ExtractApiService.extractData(
      inputText.value
    );

    if (apiResponse.code === 200) {
      result.value = apiResponse.data; // 展示提取结果
    } else {
      errorMsg.value = apiResponse.msg;
    }
  } catch (error) {
    errorMsg.value = error.message;
  }
};

// 处理文件路径提取
const handleFilePathExtract = async () => {
  try {
    const apiResponse = await ExtractApiService.extractFromFilePath(
      inputText.value
    );

    if (apiResponse.code === 200) {
      result.value = apiResponse.data; // 展示提取结果
    } else {
      errorMsg.value = apiResponse.msg;
    }
  } catch (error) {
    errorMsg.value = error.message;
  }
};

// 处理文件上传提取
const handleUploadExtract = async () => {
  if (!uploadedFile.value) {
    errorMsg.value = '请选择要上传的文件';
    return;
  }

  try {
    const apiResponse = await ExtractApiService.extractFromFileUpload(uploadedFile.value);

    if (apiResponse.code === 200) {
      result.value = apiResponse.data; // 展示提取结果
    } else {
      errorMsg.value = apiResponse.msg;
    }
  } catch (error) {
    errorMsg.value = error.message;
  }
};
</script>

<style scoped>
.extract-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 0 20px;
}

.input-type-selector {
  margin-bottom: 15px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 4px;
}

.input-type-selector label {
  font-weight: bold;
  margin-right: 15px;
}

.radio-group {
  display: inline-flex;
  gap: 20px;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-label input {
  margin-right: 5px;
}

.input-area textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
}

.action-buttons {
  margin-top: 10px;
}

.extract-btn {
  padding: 8px 20px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.extract-btn:disabled {
  background: #999;
  cursor: not-allowed;
}

.result-area {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  background: #f9f9f9;
}

.result-area pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 14px;
}

/* 文件上传样式 */
.file-upload-area {
  margin-bottom: 15px;
}

.upload-box {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.upload-box:hover {
  border-color: #409eff;
  background: #f0f7ff;
}

.upload-box.has-file {
  border-color: #67c23a;
  background: #f0f9eb;
}

.upload-placeholder .upload-icon {
  font-size: 48px;
  margin-bottom: 10px;
  display: block;
}

.upload-hint {
  color: #999;
  font-size: 12px;
  margin-top: 5px;
}

.file-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.file-icon {
  font-size: 24px;
  margin-right: 10px;
}

.file-details {
  flex: 1;
  text-align: left;
}

.file-name {
  font-weight: bold;
  margin: 0;
  color: #333;
}

.file-size {
  margin: 0;
  color: #666;
  font-size: 12px;
}

.remove-btn {
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: #ff3742;
}

/* 确认对话框样式 */
.confirm-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirm-dialog {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
}

.confirm-dialog h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.confirm-content {
  margin: 15px 0;
}

.content-preview {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  margin-top: 5px;
  max-height: 100px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 12px;
}

.dialog-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.confirm-btn {
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-btn:hover {
  background: #337ab7;
}

.cancel-btn {
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #545b62;
}

.error-tip {
  margin-top: 10px;
  color: #f56c6c;
  font-size: 14px;
}
</style>