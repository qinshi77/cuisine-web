<template>
  <div class="user-edit-page">
    <!-- 顶部导航栏 -->
    <el-menu default-active="7" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1" @click="$router.push('/')">首页</el-menu-item>
      <el-menu-item index="2" @click="$router.push('/community')">社区</el-menu-item>
      <el-menu-item index="3" @click="$router.push('/history')">美食文化</el-menu-item>
      <el-menu-item index="4" @click="$router.push('/coolTool')">美食工具</el-menu-item>
      <el-menu-item index="5" @click="$router.push('/heatmap')">热图</el-menu-item>
      <el-menu-item index="6" @click="$router.push('/games')">小游戏</el-menu-item>
      <el-menu-item index="7" class="active" @click="$router.push('/user/edit')"><i class="el-icon-user" />{{ userInfo.username }}</el-menu-item>
      <el-menu-item index="8" @click="handleLogout"><i class="el-icon-switch-button" />退出登录</el-menu-item>
    </el-menu>

    <!-- 编辑内容区域 -->
    <div class="edit-container">
      <el-card class="edit-card" shadow="hover">
        <div class="card-header">
          <h2>账户设置</h2>
          <el-button type="primary" :loading="saving" @click="saveChanges">保存更改</el-button>
        </div>

        <!-- 个人信息编辑 -->
        <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="100px">
          <!-- 头像上传 -->
          <el-form-item label="头像">
            <div class="avatar-uploader-wrapper">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <el-avatar v-if="userInfo.avatar" :size="120" :src="userInfo.avatar" class="avatar" />
                <el-avatar v-else :size="120" class="avatar">
                  {{ userInfo.username.charAt(0) }}
                </el-avatar>
                <div class="avatar-upload-text">更换头像</div>
              </el-upload>
            </div>
          </el-form-item>

          <!-- 基本信息 -->
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userInfo.username" placeholder="请输入用户名" />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userInfo.email" type="email" placeholder="请输入邮箱" />
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input v-model="userInfo.phone" placeholder="请输入手机号" />
          </el-form-item>

          <el-form-item label="个人简介">
            <el-input
              v-model="userInfo.bio"
              type="textarea"
              :rows="4"
              placeholder="介绍一下自己..."
            />
          </el-form-item>
        </el-form>

        <!-- 密码修改 -->
        <el-card class="password-card" shadow="hover" style="margin-top: 30px;">
          <div class="card-header">
            <h3>修改密码</h3>
          </div>
          <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules" label-width="100px">
            <el-form-item label="原密码" prop="oldPassword">
              <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入原密码" />
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" />
            </el-form-item>

            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="changePassword">修改密码</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 账户安全 -->
        <el-card class="security-card" shadow="hover" style="margin-top: 30px;">
          <div class="card-header">
            <h3>账户安全</h3>
          </div>
          <el-table :data="securityItems" style="width: 100%">
            <el-table-column prop="item" label="安全项目" width="180" />
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <el-tag :type="scope.row.status === '已绑定' ? 'success' : 'warning'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="action" label="操作" width="120">
              <template slot-scope="scope">
                <el-button type="text" size="small">
                  {{ scope.row.status === '已绑定' ? '修改' : '绑定' }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'UserEdit',
  data() {
    return {
      userId: '',
      username: '',
      saving: false,
      uploadUrl: 'http://localhost:8081/api/upload/image', // 实际项目中替换为真实的上传接口
      userInfo: {
        username: '美食爱好者',
        email: 'user@example.com',
        phone: '13800138000',
        bio: '热爱美食，喜欢分享各种美食体验',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      securityItems: [
        {
          item: '邮箱',
          status: '已绑定'
        },
        {
          item: '手机号',
          status: '已绑定'
        },
        {
          item: '微信',
          status: '未绑定'
        },
        {
          item: 'QQ',
          status: '未绑定'
        }
      ],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ]
      },
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于 6 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.passwordForm.newPassword) {
                callback(new Error('两次输入的密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    this.username = this.$route.query.username || localStorage.getItem('username') || ''
    this.findUserAll()
  },
  methods: {
    findUserAll() {
      axios.get('http://localhost:8081/findUserAll')
        .then(response => {
          console.log('获取到的用户信息:', response.data)
          const user = response.data.find(u => u.username === this.username)
          this.userId = user.id
          if (user) {
            const count = user.id
            axios.get('http://localhost:8081/api/user/info', { headers: { 'User-ID': count }})
              .then(response => {
                // this.userInfo = response.data
                const data = response.data
                this.userInfo.username = data.username
                this.userInfo.avatar = data.avatar
                // 邮箱和手机号暂时没有设置
                // this.userInfo.email = data.email
                // this.userInfo.phone = data.phone
                this.userInfo.bio = data.bio
                console.log('获取到的用户信息:', response.data)
              })
          } else {
            this.$message.error('用户不存在,请先登录或注册')
            this.$router.push('/login')
          }
        })
        .catch(error => {
          console.error('获取用户信息失败:', error)
        })
    },
    handleSelect(key) {
      console.log('点击了导航栏:', key)
    },
    handleAvatarSuccess(res, file) {
      // 实际项目中，这里应该根据后端返回的路径设置头像
      // 这里我们使用临时URL模拟
      this.$message.success('头像上传成功')
    },
    async beforeAvatarUpload(file) {
      const formData = new FormData()
      formData.append('file', file)
      try {
        // 2. 发送上传请求
        const response = await axios.post('http://localhost:8081/api/upload/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'User-ID': this.userId
          },
          onUploadProgress: (progressEvent) => {
            // 上传进度回调
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            console.log('上传进度:', percent + '%')
          }
        })

        // 3. 处理响应
        if (response.data.success) {
          const imageUrl = response.data.data.url
          this.userInfo.avatar = imageUrl
          console.log('上传成功，图片地址:', imageUrl)
          return imageUrl
        } else {
          throw new Error(response.data.message)
        }
      } catch (error) {
        console.error('上传失败:', error)
        throw error
      }
    },
    saveChanges() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.saving = true
          // 模拟保存操作
          axios.put('http://localhost:8081/api/user/update', {
            username: this.userInfo.username,
            avatar: this.userInfo.avatar,
            bio: this.userInfo.bio
          }, { headers: { 'User-ID': this.userId }})
            .then(response => {
              console.log('更新成功:', response.data)
              // 更新 localStorage 中的用户名
              localStorage.setItem('username', this.userInfo.username)

              // 触发事件，通知其他组件更新
              this.$emit('user-info-updated', this.userInfo)

              this.$message.success('更新成功')
              // 刷新页面，确保所有导航栏都更新
              window.location.href = '/'
            })
            .catch(error => {
              console.error('更新失败:', error)
              this.$message.error('保存失败')
            })
            .finally(() => {
              this.saving = false
            })
        } else {
          this.$message.error('请检查表单信息')
          return false
        }
      })
    },
    changePassword() {
      this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          // 密码修改操作
          axios.put('http://localhost:8081/api/user/password', {
            oldPassword: this.passwordForm.oldPassword,
            newPassword: this.passwordForm.newPassword,
            confirmPassword: this.passwordForm.confirmPassword
          }, { headers: { 'User-ID': this.userId }}).then(response => {
            console.log('密码修改成功:', response.data)
            this.$message.success('密码修改成功')
            this.passwordForm = {
              oldPassword: '',
              newPassword: '',
              confirmPassword: ''
            }
          }).catch(error => {
            console.error('密码修改失败:', error)
            this.$message.error('密码修改失败')
          })
        } else {
          this.$message.error('请检查密码信息')
          return false
        }
      })
    },
    handleLogout() {
      // 清除本地存储的用户信息
      localStorage.removeItem('username')
      localStorage.removeItem('token')
      // 跳转到登录页面
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.user-edit-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.el-menu-demo {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-menu-item.active {
  color: #E64340 !important;
  border-bottom: 2px solid #E64340;
}

.edit-container {
  max-width: 800px;
  margin: 30px auto;
  padding: 0 20px;
}

.edit-card {
  padding: 30px;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #E64340;
}

.card-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.card-header h3 {
  margin: 0;
  color: #333;
  font-size: 20px;
}

.avatar-uploader-wrapper {
  position: relative;
  display: inline-block;
}

.avatar {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
}

.avatar-upload-text {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  color: #E64340;
  font-size: 14px;
  cursor: pointer;
}

.password-card,
.security-card {
  padding: 20px;
  border-radius: 8px;
}

.el-form {
  margin-top: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

.security-card {
  margin-top: 30px;
}

@media (max-width: 768px) {
  .edit-container {
    padding: 0 10px;
  }

  .edit-card {
    padding: 20px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>
