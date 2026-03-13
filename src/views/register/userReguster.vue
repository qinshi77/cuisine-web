<template>
  <div class="register-page">
    <div class="register-container">
      <!-- 页面标题 -->
      <div class="register-header">
        <h1>非遗美食账户注册</h1>
        <p>加入我们，探索传统美食的魅力</p>
      </div>

      <!-- 注册表单 -->
      <el-form ref="registerForm" :model="registerForm" :rules="rules" class="register-form">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
          />
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            show-password
          />
        </el-form-item>

        <!-- 确认密码 -->
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请确认密码"
            prefix-icon="el-icon-lock"
            show-password
          />
        </el-form-item>

        <!-- 邮箱 -->
        <!-- <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="请输入邮箱"
            prefix-icon="el-icon-message"
          />
        </el-form-item> -->

        <!-- 非遗美食兴趣 -->
        <el-form-item label="非遗美食兴趣">
          <el-checkbox-group v-model="registerForm.interests">
            <el-checkbox label="传统糕点">传统糕点</el-checkbox>
            <el-checkbox label="手工面食">手工面食</el-checkbox>
            <el-checkbox label="传统酿造">传统酿造</el-checkbox>
            <el-checkbox label="民间小吃">民间小吃</el-checkbox>
            <el-checkbox label="传统烹饪技艺">传统烹饪技艺</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" class="submit-btn" @click="submitForm">注册</el-button>
          <!-- <el-button @click="resetForm">重置</el-button> -->
        </el-form-item>

        <!-- 登录链接 -->
        <div class="login-link">
          <span>已有账户？</span>
          <router-link to="/login">立即登录</router-link>
        </div>
      </el-form>
    </div>

    <!-- 非遗美食背景装饰 -->
    <div class="decorative-elements">
      <div v-for="(icon, index) in foodIcons" :key="index" class="food-icon">
        <img :src="icon" alt="非遗美食">
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserRegister',
  data() {
    return {
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        interests: []
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于 6 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: this.validateConfirmPassword, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      },
      foodIcons: [
        'https://neeko-copilot.bytedance.net/api/text2image?prompt=traditional%20chinese%20pastry&size=200x200',
        'https://neeko-copilot.bytedance.net/api/text2image?prompt=chinese%20noodles&size=200x200',
        'https://neeko-copilot.bytedance.net/api/text2image?prompt=chinese%20fermented%20food&size=200x200',
        'https://neeko-copilot.bytedance.net/api/text2image?prompt=chinese%20street%20food&size=200x200'
      ]
    }
  },
  methods: {
    // 验证确认密码
    validateConfirmPassword(rule, value, callback) {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    },
    // 提交表单
    submitForm() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          axios.post('http://localhost:8081/user/register', this.registerForm)
            .then(response => {
              this.$message.success('注册成功')
              console.log('注册成功:', response.data)
              // 跳转到登录页面
              this.$router.push('/login')
            })
            .catch(error => {
              if (error.response.status === 409) {
                this.$message.error('用户名或密码已存在')
              } else {
                this.$message.error('注册失败')
              }
            })
          return false
        }
      })
    },
    // 重置表单
    resetForm() {
      this.$refs.registerForm.resetFields()
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.register-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  position: relative;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h1 {
  font-size: 28px;
  color: #8B4513; /* 传统木色 */
  margin-bottom: 10px;
  font-weight: bold;
}

.register-header p {
  font-size: 16px;
  color: #666;
}

.register-form {
  width: 100%;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background-color: #8B4513;
  border-color: #8B4513;
}

.submit-btn:hover {
  background-color: #A0522D;
  border-color: #A0522D;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.login-link a {
  color: #8B4513;
  text-decoration: none;
  margin-left: 5px;
}

.login-link a:hover {
  text-decoration: underline;
}

.decorative-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
}

.food-icon {
  position: absolute;
  width: 80px;
  height: 80px;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.food-icon:nth-child(1) {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.food-icon:nth-child(2) {
  top: 20%;
  right: 15%;
  animation-delay: 2s;
}

.food-icon:nth-child(3) {
  bottom: 15%;
  left: 15%;
  animation-delay: 4s;
}

.food-icon:nth-child(4) {
  bottom: 10%;
  right: 10%;
  animation-delay: 1s;
}

.food-icon img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .register-container {
    padding: 30px 20px;
    margin: 20px;
  }

  .register-header h1 {
    font-size: 24px;
  }

  .food-icon {
    width: 60px;
    height: 60px;
  }
}
</style>
