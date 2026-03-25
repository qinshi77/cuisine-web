<template>
  <div class="user-community">
    <!-- 顶部导航栏 -->
    <el-menu default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1" @click="$router.push({ path: '/', query: { username: username }})">首页</el-menu-item>
      <el-menu-item index="2" @click="logout">退出登录</el-menu-item>
      <el-menu-item index="3" class="active">社区</el-menu-item>
      <el-menu-item index="4" @click="$router.push({ path: '/user/edit', query: { username: username }})"><i class="el-icon-user" />我的账户</el-menu-item>
    </el-menu>

    <!-- 社区内容区域 -->
    <div class="community-container">
      <!-- 左侧：用户信息和发布区域 -->
      <div class="left-section">
        <!-- 用户信息卡片 -->
        <el-card class="user-info-card" shadow="hover">
          <div class="user-avatar">
            <el-avatar v-if="userInfo.avatar" :src="userInfo.avatar" />
            <el-avatar v-else class="avatar">
              {{ userInfo.username.charAt(0) }}
            </el-avatar>
          </div>
          <h3 class="user-name">{{ userInfo.username }}</h3>
          <p class="user-bio">{{ userInfo.bio }}</p>
          <div class="user-stats">
            <div class="stat-item">
              <span class="stat-value">{{ userInfo.posts }}</span>
              <span class="stat-label">帖子</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ userInfo.followers }}</span>
              <span class="stat-label">关注者</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ userInfo.following }}</span>
              <span class="stat-label">关注</span>
            </div>
          </div>
        </el-card>

        <!-- 文章查看模式切换 -->
        <div class="radio-group">
          <el-radio-group v-model="activeView" size="large">
            <el-radio-button label="all">查看所有文章</el-radio-button>
            <el-radio-button label="following">查看关注文章</el-radio-button>
            <el-radio-button label="self">查看本人文章</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 发布帖子区域 -->
        <el-card class="post-create-card" shadow="hover">
          <h3 class="section-title">发布美食分享</h3>
          <el-input
            v-model="newPost.content"
            type="textarea"
            :rows="4"
            placeholder="分享你的美食体验..."
          />
          <div class="post-actions">
            <el-upload
              class="avatar-uploader"
              action="http://localhost:8081/api/upload/image"
              :on-change="handleImageChange"
              :show-file-list="false"
            >
              <el-button size="small" type="primary">
                <i class="el-icon-picture-outline" /> 上传图片
              </el-button>
            </el-upload>
            <el-button type="primary" class="post-button" @click="createPost">发布</el-button>
          </div>
          <div v-if="newPost.image" class="preview-image">
            <el-image :src="newPost.image" fit="cover" />
            <el-button size="small" type="danger" @click="newPost.image = ''">删除</el-button>
          </div>
        </el-card>
      </div>

      <!-- 右侧：帖子列表 -->
      <div class="right-section">
        <h2 class="section-title">社区动态</h2>
        <div class="post-list">
          <el-card v-for="(post, index) in filteredPosts" :key="index" class="post-card" shadow="hover">
            <div class="post-header">
              <el-avatar :src="post.author.avatar">{{ post.author.username.charAt(0) }}</el-avatar>
              <div class="post-author-info">
                <h4 class="author-name">{{ post.author.username }}</h4>
                <span class="post-time">{{ post.createdAt }}</span>
              </div>
            </div>
            <div class="post-content">
              <p>{{ post.content }}</p>
              <el-image v-if="post.image" :src="post.image" fit="cover" class="post-image" />
            </div>
            <div class="post-actions">
              <el-button type="text" @click="toggleLike(post)">
                <i :class="post.liked ? 'el-icon-thumb' : 'el-icon-thumb-outline'" :style="{ color: post.liked ? '#E64340' : '' }" />
                <span>{{ post.likes }}</span>
              </el-button>
              <el-button type="text" @click="toggleComments(post)">
                <i class="el-icon-chat-dot-round" />
                <span>{{ post.comments.length }}</span>
              </el-button>
              <el-button type="text">
                <i class="el-icon-share" />
                <span>分享</span>
              </el-button>
              <el-button v-if="post.author.username !== username" type="text" @click="followAuthor(post)">
                <i class="el-icon-plus" />
                <span v-if="!post.isFollowing">关注作者</span>
                <span v-else>取消关注</span>
              </el-button>
              <el-button v-else type="text" style="color: #E64340;" @click="deletePost(post, index)">
                <i class="el-icon-delete" />
                <span>删除文章</span>
              </el-button>
            </div>
            <div v-if="post.showComments" class="comments-section">
              <div v-for="(comment, cIndex) in post.comments" :key="cIndex" class="comment-item">
                <el-avatar :src="comment.author.avatar">{{ comment.author.username.charAt(0) }}</el-avatar>
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-author">{{ comment.author.username }}</span>
                    <span class="comment-time">{{ comment.createdAt }}</span>
                  </div>
                  <p>{{ comment.content }}</p>
                </div>
              </div>
              <div class="comment-input">
                <el-input
                  v-model="post.newComment"
                  placeholder="写下你的评论..."
                  @keyup.enter="addComment(post)"
                />
                <el-button type="primary" @click="addComment(post)">发送</el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserCommunity',
  data() {
    return {
      username: '',
      userId: '',
      userInfo: {
        username: '',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        bio: '',
        posts: 0,
        followers: 0,
        following: 0
      },
      newPost: {
        content: '',
        image: ''
      },
      activeView: 'all',
      posts: [
        // {
        //   id: 1,
        //   content: '今天尝试了泉州的面线糊，味道真的很不错！汤底鲜美，面线细腻，配上油条简直绝了。推荐大家去尝尝！',
        //   image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        //   author: {
        //     username: '吃货小王',
        //     avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
        //   },
        //   createdAt: '2024-01-15 14:30',
        //   likes: 28,
        //   liked: false,
        //   comments: [
        //     {
        //       author: {
        //         username: '美食达人',
        //         avatar: 'https://randomuser.me/api/portraits/men/55.jpg'
        //       },
        //       content: '哪家店？我也想去试试',
        //       createdAt: '2024-01-15 15:00'
        //     },
        //     {
        //       author: {
        //         username: '泉州本地人',
        //         avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
        //       },
        //       content: '推荐你试试加醋肉，味道更好',
        //       createdAt: '2024-01-15 15:30'
        //     }
        //   ],
        //   showComments: false,
        //   newComment: ''
        // },
        // {
        //   id: 2,
        //   content: '自制的姜母鸭，按照泉州传统 recipe 制作，香气四溢，家人都很喜欢！',
        //   image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        //   author: {
        //     username: '厨房新手',
        //     avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
        //   },
        //   createdAt: '2024-01-14 10:15',
        //   likes: 45,
        //   liked: true,
        //   comments: [
        //     {
        //       author: {
        //         username: '烹饪大师',
        //         avatar: 'https://randomuser.me/api/portraits/men/66.jpg'
        //       },
        //       content: '看起来很专业！',
        //       createdAt: '2024-01-14 11:00'
        //     }
        //   ],
        //   showComments: false,
        //   newComment: ''
        // },
        // {
        //   id: 3,
        //   content: '周末去了泉州的美食街，人真的很多，但是各种小吃都很值得尝试。特别是土笋冻，虽然看起来有点奇怪，但是味道真的很棒！',
        //   image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        //   author: {
        //     username: '旅行爱好者',
        //     avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
        //   },
        //   createdAt: '2024-01-13 16:45',
        //   likes: 32,
        //   liked: false,
        //   comments: [],
        //   showComments: false,
        //   newComment: ''
        // }
      ]
    }
  },
  computed: {
    filteredPosts() {
      let result = [...this.posts]
      if (this.activeView === 'self') {
        result = result.filter(post => post.author.username === this.userInfo.username)
      } else if (this.activeView === 'following') {
        result = result.filter(post => post.isFollowing === true)
      }
      // 按时间排序，最新的在前
      return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  },
  mounted() {
    this.username = this.$route.query.username || localStorage.getItem('username') || ''
    // console.log('当前用户名:', this.username)
    if (this.username) {
      localStorage.setItem('username', this.username)
    }
    this.findUserAll()
    this.fetchPosts()
  },
  methods: {
    // 退出登录
    logout() {
      localStorage.removeItem('username')
      this.$message.success('已退出登录')
      this.$router.push('/login')
    },
    // 查找所有用户
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
                this.userInfo = response.data
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
    // 查找所有帖子
    fetchPosts() {
      // 利用计时器延时发送请求，确保用户信息加载完成，再获取帖子信息
      setTimeout(() => {
        axios.get('http://localhost:8081/api/posts', { headers: { 'User-ID': this.userId }})
          .then(response => {
            this.posts = response.data
            console.log('获取到的帖子:', this.posts)
          })
          .catch(error => {
            console.error('获取帖子失败:', error)
          })
      }, 1000)
    },
    handleSelect(key) {
      console.log('点击了导航栏:', key)
    },
    async handleImageChange(file) {
      // console.log('上传的文件:', file, file.raw)
      const formData = new FormData()
      formData.append('file', file.raw)
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
          this.newPost.image = imageUrl
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
    createPost() {
      if (this.newPost.content.trim() === '') {
        this.$message.warning('请输入内容')
        return
      }

      // 违禁词检查
      const forbiddenWords = ['违禁词1', '违禁词2', '敏感词', '不良内容']
      const content = this.newPost.content
      const containsForbiddenWord = forbiddenWords.some(word => content.includes(word))
      if (containsForbiddenWord) {
        this.$message.error('内容包含违禁词，禁止发布')
        return
      }

      const newPost = {
        id: this.posts.length + 1,
        content: this.newPost.content,
        image: this.newPost.image,
        author: {
          username: this.userInfo.username,
          avatar: this.userInfo.avatar
        },
        createdAt: new Date().toLocaleString('zh-CN'),
        likes: 0,
        liked: false,
        comments: [],
        showComments: false,
        newComment: ''
      }

      this.posts.unshift(newPost)
      this.newPost = { content: '', image: '' }
      axios.post('http://localhost:8081/api/posts', {
        content: newPost.content,
        image: newPost.image
      }, {
        headers: { 'User-ID': this.userId }
      })
        .then(response => {
          console.log('发布成功:', response.data)
          // 如果需要，可以用服务器返回的数据更新
          window.location.reload()
          this.posts.unshift(response.data)
          this.$message.success('发布成功')
        })
      this.findUserAll()
    },
    toggleLike(post) {
      // 保存当前状态，用于判断发送什么请求
      const wasLiked = post.liked

      // 乐观更新：先更新UI
      post.liked = !wasLiked
      post.likes += post.liked ? 1 : -1

      // 根据之前的状态决定发送什么请求
      if (!wasLiked) {
        // 之前是未点赞，现在要点赞 -> 发送 POST
        axios.post(`http://localhost:8081/api/likes/post/${post.id}`, null, {
          headers: { 'User-ID': this.userId }
        })
          .then(response => {
            console.log('点赞成功:', response.data)
            // 如果需要，可以用服务器返回的数据更新
            post.likes = response.data.likes
          })
          .catch(error => {
            console.error('点赞失败:', error)
            // 失败时回滚UI
            post.liked = wasLiked
            post.likes = wasLiked ? post.likes + 1 : post.likes - 1
          })
      } else {
        // 之前是已点赞，现在要取消点赞 -> 发送 DELETE
        axios.delete(`http://localhost:8081/api/likes/post/${post.id}`, {
          headers: { 'User-ID': this.userId }
        })
          .then(response => {
            console.log('取消点赞成功:', response.data)
            post.likes = response.data.likes
          })
          .catch(error => {
            console.error('取消点赞失败:', error)
            // 失败时回滚UI
            post.liked = wasLiked
            post.likes = wasLiked ? post.likes + 1 : post.likes - 1
          })
      }
    },
    toggleComments(post) {
      post.showComments = !post.showComments
    },
    addComment(post) {
      if (post.newComment.trim() === '') {
        return
      }

      const newComment = {
        author: {
          username: this.userInfo.username,
          avatar: this.userInfo.avatar
        },
        content: post.newComment,
        createdAt: new Date().toLocaleString('zh-CN')
      }
      // 发送添加评论请求
      axios.post('http://localhost:8081/api/comments', {
        postId: post.id,
        content: post.newComment
      }, { headers: { 'User-ID': this.userId }}).then(response => {
        console.log('评论成功:', response.data)
      })

      post.comments.push(newComment)
      post.newComment = ''
    },
    followAuthor(post) {
      if (post.isFollowing) {
        axios.delete(`http://localhost:8081/api/follow/${post.author_id}`, {
          headers: { 'User-ID': this.userId }
        }).then(response => {
          console.log('取消关注成功:', response.data)
          post.isFollowing = false
          this.findUserAll()
        })
        this.$message.success(`已取消关注 ${post.author.username}`)
      } else {
        axios.post(`http://localhost:8081/api/follow`, {
          followingId: post.author_id
        }, { headers: { 'User-ID': this.userId }}).then(response => {
          console.log('关注成功:', response.data)
          post.isFollowing = true
          this.findUserAll()
        })
        this.$message.success(`已关注 ${post.author.username}`)
      }
    },
    deletePost(post, index) {
      this.$confirm('确定要删除这篇文章吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete(`http://localhost:8081/api/posts/${post.id}`, {
          headers: { 'User-ID': this.userId }
        }).then(() => {
          this.posts.splice(index, 1)
          this.$message.success('删除成功')
          this.findUserAll()
        }).catch(error => {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  }
}
</script>

<style scoped>
.user-community {
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

.community-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.left-section {
  width: 300px;
  flex-shrink: 0;
}

.right-section {
  flex: 1;
}

.user-info-card {
  margin-bottom: 20px;
  text-align: center;
  padding: 20px;
}

.user-avatar {
  margin-bottom: 15px;
}

.user-name {
  margin: 0 0 10px 0;
  color: #333;
}

.user-bio {
  margin: 0 0 20px 0;
  color: #666;
  font-size: 14px;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #E64340;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #999;
}

.post-create-card {
  margin-bottom: 20px;
  padding: 20px;
}

.section-title {
  color: #333;
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: bold;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.post-button {
  background-color: #E64340;
  border-color: #E64340;
}

.post-button:hover {
  background-color: #c43633;
  border-color: #c43633;
}

.preview-image {
  margin-top: 15px;
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 4px;
  overflow: hidden;
}

.preview-image el-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 10;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-card {
  padding: 20px;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.post-author-info {
  margin-left: 10px;
}

.author-name {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 16px;
  font-weight: bold;
}

.post-time {
  font-size: 12px;
  color: #999;
}

.post-content {
  margin-bottom: 15px;
}

.post-content p {
  margin: 0 0 15px 0;
  line-height: 1.6;
  color: #333;
}

.post-image {
  width: 100%;
  height: 300px;
  border-radius: 4px;
}

.post-actions {
  display: flex;
  gap: 30px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.comments-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.comment-item {
  display: flex;
  margin-bottom: 15px;
}

.comment-content {
  margin-left: 10px;
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.comment-author {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-content p {
  margin: 0;
  line-height: 1.5;
  color: #333;
  font-size: 14px;
}

.comment-input {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.comment-input el-input {
  flex: 1;
}

.radio-group {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.radio-group .el-radio-group {
  display: flex;
  flex-direction: column;
  margin-left: 150px;
  gap: 10px;
  width: 100%;
}

.radio-group .el-radio-button {
  width: 100%;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .community-container {
    flex-direction: column;
  }

  .left-section {
    width: 100%;
  }
}
</style>
