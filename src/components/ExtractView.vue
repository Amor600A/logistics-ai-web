<template>
  <div class="extract-container">
    <h1>物流单据智能提取工具</h1>
    
    <!-- 文本输入区域 -->
    <div class="input-area">
      <textarea
        v-model="inputText"
        placeholder="请粘贴物流单据文本，例如：运单56789 货重3.5kg 收货人李四 电话13912345678"
        rows="6"
      ></textarea>
      <button @click="extractData" :disabled="loading">
        {{ loading ? '提取中...' : '开始提取' }}
      </button>
    </div>

    <!-- 结果展示区域 -->
    <div class="result-area" v-if="result">
      <h3>提取结果（JSON格式）</h3>
      <pre>{{ JSON.stringify(result, null, 2) }}</pre>
    </div>

    <!-- 错误提示 -->
    <div class="error-tip" v-if="errorMsg">{{ errorMsg }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// 响应式数据
const inputText = ref(''); // 输入的单据文本
const result = ref(null); // 提取结果
const loading = ref(false); // 加载状态
const errorMsg = ref(''); // 错误提示

// 调用后端API提取数据
const extractData = async () => {
  if (!inputText.value.trim()) {
    errorMsg.value = '请输入物流单据文本！';
    return;
  }

  // 重置状态
  loading.value = true;
  errorMsg.value = '';
  result.value = null;

  try {
    // 调用Node.js后端API
    const response = await axios.post(
      'http://localhost:3001/api/extract-logistics', // 后端接口地址
      { text: inputText.value } // 传参
    );

    if (response.data.code === 200) {
      result.value = response.data.data; // 展示提取结果
    } else {
      errorMsg.value = response.data.msg;
    }
  } catch (err) {
    errorMsg.value = `接口调用失败：${err.message || '请检查后端服务是否启动'}`;
  } finally {
    loading.value = false; // 结束加载
  }
};
</script>

<style scoped>
.extract-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 0 20px;
}

.input-area textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
}

.input-area button {
  margin-top: 10px;
  padding: 8px 20px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.input-area button:disabled {
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

.error-tip {
  margin-top: 10px;
  color: #f56c6c;
  font-size: 14px;
}
</style>