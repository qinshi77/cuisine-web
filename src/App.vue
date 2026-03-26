<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  mounted() {
    // 监听页面关闭事件
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  },
  beforeDestroy() {
    // 移除事件监听器
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
  },
  methods: {
    handleBeforeUnload() {
      // 获取当前登录状态
      const username = localStorage.getItem('username')
      if (username) {
        // 调用退出登录接口
        axios.post('http://localhost:8081/userLogout', { username })
          .then(response => {
            console.log('退出登录成功:', response)
          })
          .catch(error => {
            console.error('退出登录失败:', error)
          })
        // 清除登录状态
        localStorage.removeItem('username')
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
