<template>
  <div class="register">
    <h1>用户注册</h1>
    <form>
      <div class="form-group">
        <label for="username">用户名</label>
        <input type="text" id="username" placeholder="请输入用户名">
      </div>
      <div class="form-group">
        <label for="email">邮箱</label>
        <input type="email" id="email" placeholder="请输入邮箱">
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input type="password" id="password" placeholder="请输入密码">
      </div>
      <button type="submit">注册</button>
    </form>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<script>
export default {
  name: 'Register'
}
</script>

<style scoped>
.register {
  max-width: 500px;
  margin: 0 auto;
  padding: 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #666;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
}

button:hover {
  background-color: #3aa276;
}

router-link {
  display: block;
  text-align: center;
  color: #42b983;
  text-decoration: none;
}

router-link:hover {
  text-decoration: underline;
}
</style>