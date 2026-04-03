<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>物流AI系统登录</h1>
        <p>欢迎使用智能物流管理系统</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- 用户名输入框 -->
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            id="username"
            type="text" 
            v-model="loginForm.username" 
            placeholder="请输入用户名"
            required
            :class="{ error: errors.username }"
          />
          <span v-if="errors.username" class="error-text">{{ errors.username }}</span>
        </div>
        
        <!-- 密码输入框 -->
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            id="password"
            type="password" 
            v-model="loginForm.password" 
            placeholder="请输入密码"
            required
            :class="{ error: errors.password }"
            @input="validatePassword"
          />
          <div class="password-requirements">
            <span :class="{ met: hasNumber }">包含数字</span>
            <span :class="{ met: hasLowercase }">小写字母</span>
            <span :class="{ met: hasUppercase }">大写字母</span>
            <span class="requirement-note">（至少满足其中两种）</span>
          </div>
          <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
        </div>
        
        <!-- 验证码输入框 -->
        <div class="form-group captcha-group">
          <label for="captcha">验证码</label>
          <div class="captcha-input">
            <input 
              id="captcha"
              type="text" 
              v-model="loginForm.captcha" 
              placeholder="请输入验证码"
              maxlength="4"
              required
              :class="{ error: errors.captcha }"
            />
            <div class="captcha-image" @click="refreshCaptcha">
              <span>{{ captchaCode }}</span>
            </div>
          </div>
          <span v-if="errors.captcha" class="error-text">{{ errors.captcha }}</span>
        </div>
        
        <!-- 登录按钮 -->
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      
      <!-- 登录状态提示 -->
      <div v-if="loginMessage" class="login-message" :class="{ error: loginError }">
        {{ loginMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
  captcha: ''
});

// 错误信息
const errors = reactive({
  username: '',
  password: '',
  captcha: ''
});

// 加载状态
const loading = ref(false);

// 登录消息
const loginMessage = ref('');
const loginError = ref(false);

// 验证码
const captchaCode = ref('');

// 密码验证条件
const hasNumber = computed(() => /\d/.test(loginForm.password));
const hasLowercase = computed(() => /[a-z]/.test(loginForm.password));
const hasUppercase = computed(() => /[A-Z]/.test(loginForm.password));

// 密码强度验证
const validatePassword = () => {
  const conditionsMet = [hasNumber.value, hasLowercase.value, hasUppercase.value].filter(Boolean).length;
  
  if (loginForm.password.length > 0 && conditionsMet < 2) {
    errors.password = '密码必须包含数字、小写字母、大写字母中的至少两种';
  } else {
    errors.password = '';
  }
};

// 生成验证码
const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  captchaCode.value = code;
};

// 刷新验证码
const refreshCaptcha = () => {
  generateCaptcha();
  loginForm.captcha = '';
  errors.captcha = '';
};

// 表单验证
const validateForm = () => {
  let isValid = true;
  
  // 清空错误信息
  Object.keys(errors).forEach(key => errors[key] = '');
  
  // 用户名验证
  if (!loginForm.username.trim()) {
    errors.username = '请输入用户名';
    isValid = false;
  }
  
  // 密码验证
  if (!loginForm.password) {
    errors.password = '请输入密码';
    isValid = false;
  } else {
    validatePassword();
    if (errors.password) isValid = false;
  }
  
  // 验证码验证
  if (!loginForm.captcha) {
    errors.captcha = '请输入验证码';
    isValid = false;
  } else if (loginForm.captcha.toUpperCase() !== captchaCode.value.toUpperCase()) {
    errors.captcha = '验证码错误';
    isValid = false;
  }
  
  return isValid;
};

// 处理登录
const handleLogin = async () => {
  if (!validateForm()) return;
  
  loading.value = true;
  loginMessage.value = '';
  loginError.value = false;
  
  try {
    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 模拟登录成功
    if (loginForm.username === 'admin' && loginForm.password === 'Admin123') {
      loginMessage.value = '登录成功！正在跳转...';
      loginError.value = false;
      
      // 存储登录状态
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', loginForm.username);
      
      // 跳转到首页
      setTimeout(() => {
        router.push('/');
      }, 200);
    } else {
      loginMessage.value = '用户名或密码错误';
      loginError.value = true;
    }
  } catch (error) {
    loginMessage.value = '登录失败，请稍后重试';
    loginError.value = true;
  } finally {
    loading.value = false;
  }
};

// 初始化验证码
generateCaptcha();
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  color: #333;
  margin-bottom: 10px;
  font-size: 24px;
}

.login-header p {
  color: #666;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input.error {
  border-color: #ff4757;
}

.error-text {
  color: #ff4757;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.password-requirements {
  margin-top: 8px;
  font-size: 12px;
}

.password-requirements span {
  margin-right: 10px;
  color: #999;
}

.password-requirements span.met {
  color: #2ed573;
  font-weight: bold;
}

.requirement-note {
  color: #666 !important;
  font-style: italic;
}

.captcha-input {
  display: flex;
  gap: 10px;
}

.captcha-input input {
  flex: 1;
}

.captcha-image {
  width: 80px;
  height: 40px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  font-size: 18px;
  color: #333;
  letter-spacing: 2px;
}

.captcha-image:hover {
  background: #e9ecef;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.login-btn:hover:not(:disabled) {
  background: #5a6fd8;
}

.login-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.login-message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
}

.login-message:not(.error) {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.login-message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>