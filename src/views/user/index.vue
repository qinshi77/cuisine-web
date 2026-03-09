<template>
  <div class="user-community">
    <!-- 顶部导航栏 -->
    <el-menu default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1" @click="$router.push('/')">首页</el-menu-item>
      <el-menu-item index="2" @click="$router.push('/login')">登录</el-menu-item>
      <el-menu-item index="3" class="active">社区</el-menu-item>
      <el-menu-item index="4"><i class="el-icon-user" />我的账户</el-menu-item>
    </el-menu>

    <!-- 社区内容区域 -->
    <div class="community-container">
      <!-- 左侧：用户信息和发布区域 -->
      <div class="left-section">
        <!-- 用户信息卡片 -->
        <el-card class="user-info-card" shadow="hover">
          <div class="user-avatar">
            <el-avatar size="80" :src="userInfo.avatar">{{ userInfo.username.charAt(0) }}</el-avatar>
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
              action="#"
              :auto-upload="false"
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
          <el-card v-for="(post, index) in posts" :key="index" class="post-card" shadow="hover">
            <div class="post-header">
              <el-avatar size="40" :src="post.author.avatar">{{ post.author.username.charAt(0) }}</el-avatar>
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
            </div>
            <div v-if="post.showComments" class="comments-section">
              <div v-for="(comment, cIndex) in post.comments" :key="cIndex" class="comment-item">
                <el-avatar size="30" :src="comment.author.avatar">{{ comment.author.username.charAt(0) }}</el-avatar>
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
export default {
  name: 'UserCommunity',
  data() {
    return {
      userInfo: {
        username: '美食爱好者',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        bio: '热爱美食，喜欢分享各种美食体验',
        posts: 12,
        followers: 156,
        following: 89
      },
      newPost: {
        content: '',
        image: ''
      },
      posts: [
        {
          id: 1,
          content: '今天尝试了泉州的面线糊，味道真的很不错！汤底鲜美，面线细腻，配上油条简直绝了。推荐大家去尝尝！',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          author: {
            username: '吃货小王',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
          },
          createdAt: '2024-01-15 14:30',
          likes: 28,
          liked: false,
          comments: [
            {
              author: {
                username: '美食达人',
                avatar: 'https://randomuser.me/api/portraits/men/55.jpg'
              },
              content: '哪家店？我也想去试试',
              createdAt: '2024-01-15 15:00'
            },
            {
              author: {
                username: '泉州本地人',
                avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
              },
              content: '推荐你试试加醋肉，味道更好',
              createdAt: '2024-01-15 15:30'
            }
          ],
          showComments: false,
          newComment: ''
        },
        {
          id: 2,
          content: '自制的姜母鸭，按照泉州传统 recipe 制作，香气四溢，家人都很喜欢！',
          image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          author: {
            username: '厨房新手',
            avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
          },
          createdAt: '2024-01-14 10:15',
          likes: 45,
          liked: true,
          comments: [
            {
              author: {
                username: '烹饪大师',
                avatar: 'https://randomuser.me/api/portraits/men/66.jpg'
              },
              content: '看起来很专业！',
              createdAt: '2024-01-14 11:00'
            }
          ],
          showComments: false,
          newComment: ''
        },
        {
          id: 3,
          content: '周末去了泉州的美食街，人真的很多，但是各种小吃都很值得尝试。特别是土笋冻，虽然看起来有点奇怪，但是味道真的很棒！',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          author: {
            username: '旅行爱好者',
            avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
          },
          createdAt: '2024-01-13 16:45',
          likes: 32,
          liked: false,
          comments: [],
          showComments: false,
          newComment: ''
        }
      ]
    }
  },
  methods: {
    handleSelect(key) {
      console.log('点击了导航栏:', key)
    },
    handleImageChange(file) {
      // 这里只是模拟，实际项目中需要上传图片到服务器
      this.newPost.image = URL.createObjectURL(file.raw)
    },
    createPost() {
      if (this.newPost.content.trim() === '') {
        this.$message.warning('请输入内容')
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
      this.$message.success('发布成功')
    },
    toggleLike(post) {
      post.liked = !post.liked
      post.likes += post.liked ? 1 : -1
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

      post.comments.push(newComment)
      post.newComment = ''
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

@media (max-width: 768px) {
  .community-container {
    flex-direction: column;
  }

  .left-section {
    width: 100%;
  }
}
</style>
