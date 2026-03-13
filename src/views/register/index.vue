<template>
  <div class="login-container">
    <div class="login-bg" /> <!-- 登录背景图片 -->
    <Card class="login-card">
      <div class="login-header">
        <img src="@/assets/logo.png" alt="泉州美食" class="logo">
        <h2>泉州美食网</h2>
        <p>登录您的账号</p>
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="rules" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="el-icon-lock" />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
          <el-link type="primary" class="forgot-password">忘记密码？</el-link>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-button" @click="submitForm('loginForm')">登录</el-button>
        </el-form-item>
        <el-form-item class="register-link">
          <span>还没有账号？</span>
          <el-link type="primary" @click="registerClick()">立即注册</el-link>
        </el-form-item>
      </el-form>
    </Card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  components: {
    Card: () => import('@/components/card.vue')
  },
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
        // remember: false
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 登录表单提交方法
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 登录成功后的处理逻辑
          console.log('登录表单数据:', this.loginForm)
          axios.post('http://localhost:8081/userLogin', this.loginForm)
            .then(response => {
              console.log('登录成功:', response)
              this.$message.success('登录成功')
              // 跳转到首页
              this.$router.push('/')
            })
            .catch(error => {
              console.error('登录失败:', error)
              this.$message.error('登录失败，请检查用户名和密码')
            })
        } else {
          this.$message.error('请检查输入信息')
          return false
        }
      })
    },
    // 注册点击事件
    registerClick() {
      this.$router.push('/register')
    }
  }
}
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.9)),
              url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80');
  background-size: cover;
  background-position: center;
  z-index: -1;
}

.login-card {
  width: 400px;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 15px;
}

.login-header h2 {
  color: #E64340; /* 泉州美食主题色 - 红色 */
  margin: 0 0 10px 0;
  font-size: 24px;
}

.login-header p {
  color: #666;
  margin: 0;
}

.login-form {
  width: 100%;
}

.forgot-password {
  float: right;
}

.login-button {
  width: 100%;
  background-color: #E64340;
  border-color: #E64340;
}

.login-button:hover {
  background-color: #c43633;
  border-color: #c43633;
}

.register-link {
  text-align: center;
  margin-top: 20px;
}

.register-link span {
  color: #666;
}
</style>
