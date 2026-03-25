<template>
  <div>
    <!--                   顶部导航栏                        -->
    <el-menu default-active="4" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1" @click="$router.push('/')">首页</el-menu-item>
      <el-menu-item index="2" @click="$router.push({ path: '/community', query: { username: username }})">社区</el-menu-item>
      <el-menu-item index="3" @click="$router.push('/history')">美食文化</el-menu-item>
      <el-menu-item index="4" class="active" @click="$router.push('/coolTool')">美食工具</el-menu-item>
      <el-menu-item index="5" @click="$router.push('/heatmap')">热图</el-menu-item>
      <el-menu-item index="6" @click="$router.push('/games')">小游戏</el-menu-item>
      <el-menu-item index="7" @click="handleLogout"><i class="el-icon-user" />退出登录</el-menu-item>
    </el-menu>
    <div class="cool-tool-page">
      <!-- 左侧用户信息区域 -->
      <div class="sidebar">
        <div class="user-profile">
          <img :src="user.avatar" :alt="user.username" class="profile-avatar">
          <h3 class="profile-name">{{ user.username }}</h3>
          <button class="post-tool-btn" @click="showPostToolDialog = true">发布工具</button>
        </div>

        <div class="user-likes">
          <div class="likes-header">
            <h4>我的点赞</h4>
            <button v-if="selectedTool" class="back-btn" @click="backToAllTools">返回首页</button>
          </div>
          <div v-if="userLikedTools.length > 0" class="liked-tools-list">
            <div
              v-for="tool in userLikedTools"
              :key="tool.id"
              class="liked-tool-item"
              @click="selectLikedTool(tool)"
            >
              <img :src="tool.image" :alt="tool.name" class="liked-tool-image">
              <span class="liked-tool-name">{{ tool.name }}</span>
            </div>
          </div>
          <div v-else class="no-likes">
            <p>暂无点赞记录</p>
          </div>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="main-content">
        <!-- 页面标题 -->
        <div class="page-header">
          <h1>美食制作工具</h1>
          <p>为您的厨房配备专业工具，提升烹饪体验</p>
        </div>

        <!-- 搜索和排序区域 -->
        <div class="filter-section">
          <div class="search-box">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索工具名称..."
              class="search-input"
            >
            <button class="search-btn">搜索</button>
          </div>
          <div class="sort-box">
            <label>排序方式：</label>
            <select v-model="sortBy" class="sort-select">
              <option value="default">默认</option>
              <option value="sales">销量从高到低</option>
            </select>
          </div>
        </div>

        <!-- 工具展示区域 -->
        <div class="tools-grid">
          <div
            v-for="tool in filteredTools"
            :key="tool.id"
            class="tool-card"
          >
            <!-- 工具图片 -->
            <div class="tool-image">
              <img :src="tool.image" :alt="tool.name">
            </div>

            <!-- 工具信息 -->
            <div class="tool-info">
              <h3 class="tool-name">{{ tool.name }}</h3>
              <p class="tool-description">{{ tool.description }}</p>

              <!-- 工具作用介绍 -->
              <div class="tool-details">
                <div class="detail-item">
                  <strong>工具作用：</strong>
                  <span>{{ tool.use }}</span>
                </div>
                <div class="detail-item">
                  <strong>适用菜系：</strong>
                  <span>{{ tool.cuisine }}</span>
                </div>
                <div class="detail-item">
                  <strong>使用方法：</strong>
                  <span>{{ tool.usage }}</span>
                </div>
                <div v-if="tool.buyLink" class="detail-item">
                  <strong>购买链接：</strong>
                  <a :href="tool.buyLink" target="_blank" class="buy-link">点击购买</a>
                </div>
              </div>

              <!-- 互动功能 -->
              <div class="tool-actions">
                <button class="action-btn like-btn" :class="{ 'liked': tool.isLiked }" @click="likeTool(tool)">
                  <i class="el-icon-thumb" />
                  <span>{{ tool.likes }}</span>
                </button>
                <button class="action-btn comment-btn" @click="openCommentDialog(tool)">
                  <i class="el-icon-chat-dot-round" />
                  <span>评论 ({{ tool.comments.length }})</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 评论对话框 -->
        <el-dialog
          :visible.sync="showCommentDialog"
          :title="`${currentTool ? currentTool.name : ''} 的评论`"
          width="500px"
        >
          <div class="comment-dialog">
            <!-- 用户信息和评论输入 -->
            <div class="comment-input-area">
              <div class="user-info">
                <img :src="user.avatar" :alt="user.name" class="user-avatar">
                <span class="user-name">{{ user.name }}</span>
              </div>
              <div class="comment-input">
                <textarea
                  v-model="newComment"
                  placeholder="写下你的评论..."
                  class="comment-textarea"
                />
                <button class="comment-submit" @click="addComment(currentTool)">提交评论</button>
              </div>
            </div>

            <!-- 评论列表 -->
            <div v-if="currentTool && currentTool.comments.length > 0" class="comments-list">
              <div
                v-for="comment in currentTool.comments"
                :key="comment.id"
                class="comment-item"
              >
                <img :src="comment.avatar" :alt="comment.user" class="comment-avatar">
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-user">{{ comment.user }}</span>
                    <span class="comment-time">{{ comment.time }}</span>
                  </div>
                  <p class="comment-text">{{ comment.content }}</p>
                </div>
              </div>
            </div>
            <div v-else class="no-comments">
              <p>暂无评论，快来发表你的看法吧！</p>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showCommentDialog = false">关闭</el-button>
          </span>
        </el-dialog>

        <!-- 发布工具对话框 -->
        <el-dialog
          :visible.sync="showPostToolDialog"
          title="发布新工具"
          width="600px"
        >
          <div class="post-tool-form">
            <div class="form-item">
              <label>工具名称：</label>
              <input v-model="newTool.name" type="text" class="form-input" placeholder="请输入工具名称">
            </div>
            <div class="form-item">
              <label>工具描述：</label>
              <textarea v-model="newTool.description" class="form-textarea" placeholder="请输入工具描述" />
            </div>
            <div class="form-item">
              <label>工具作用：</label>
              <input v-model="newTool.use" type="text" class="form-input" placeholder="请输入工具作用">
            </div>
            <div class="form-item">
              <label>适用菜系：</label>
              <input v-model="newTool.cuisine" type="text" class="form-input" placeholder="请输入适用菜系">
            </div>
            <div class="form-item">
              <label>使用方法：</label>
              <textarea v-model="newTool.usage" class="form-textarea" placeholder="请输入使用方法" />
            </div>
            <div class="form-item">
              <label>购买链接：</label>
              <input v-model="newTool.buyLink" type="text" class="form-input" placeholder="请输入购买链接（可选）">
            </div>
            <div class="form-item">
              <label>工具图片：</label>
              <div class="image-upload">
                <input type="file" accept="image/*" class="file-input" @change="handleImageUpload">
                <button type="button" class="upload-btn">选择图片</button>
                <div v-if="newTool.image" class="image-preview">
                  <img :src="newTool.image" alt="工具图片预览" class="preview-image">
                  <button type="button" class="remove-btn" @click="removeImage">移除</button>
                </div>
              </div>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showPostToolDialog = false">取消</el-button>
            <el-button type="primary" @click="submitNewTool">发布</el-button>
          </span>
        </el-dialog>

        <!-- 无结果提示 -->
        <div v-if="filteredTools.length === 0" class="no-results">
          <p>没有找到匹配的工具</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CoolTool',
  data() {
    return {
      username: '',
      tools: [
        {
          id: 1,
          name: '厨师刀',
          description: '专业厨房刀具，不锈钢材质，锋利耐用',
          use: '适用于切菜、切肉、切鱼等多种厨房操作',
          cuisine: '适用于各种菜系，尤其是中餐和西餐',
          usage: '使用时保持刀刃锋利，切割时要稳准，使用后及时清洗擦干',
          buyLink: 'https://example.com/chef-knife',
          image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=professional%20chef%20knife&size=800x800',
          likes: 125,
          comments: [
            {
              id: 1,
              user: '美食爱好者',
              avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=user%20avatar&size=100x100',
              content: '这把刀非常锋利，用起来很顺手！',
              time: '2024-01-15 10:30'
            },
            {
              id: 2,
              user: '厨房新手',
              avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=user%20avatar%202&size=100x100',
              content: '对于新手来说也很好用，推荐！',
              time: '2024-01-16 14:20'
            }
          ]
        },
        {
          id: 2,
          name: '不粘锅',
          description: '高品质不粘涂层，煎炒煮炸样样精通',
          use: '适用于煎蛋、煎饼、炒菜等多种烹饪方式',
          cuisine: '适用于各种菜系，尤其是需要少油烹饪的菜品',
          usage: '使用时避免使用金属铲，温度不宜过高，清洗时用软布轻轻擦拭',
          buyLink: 'https://example.com/non-stick-pan',
          image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=non-stick%20frying%20pan&size=800x800',
          likes: 189,
          comments: [
            {
              id: 1,
              user: '家庭主妇',
              avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=user%20avatar%203&size=100x100',
              content: '用了半年了，还是很不粘，质量很好！',
              time: '2024-01-10 09:15'
            }
          ]
        },
        {
          id: 3,
          name: '料理机',
          description: '多功能料理机，搅拌、榨汁、研磨一体',
          use: '适用于制作果汁、豆浆、酱料、馅料等',
          cuisine: '适用于各种菜系，尤其是需要细腻口感的菜品',
          usage: '按照说明书操作，不同食材使用不同的功能档位，使用后及时清洗',
          buyLink: '',
          image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=food%20processor&size=800x800',
          likes: 98,
          comments: []
        },
        {
          id: 4,
          name: '蒸锅',
          description: '多层蒸笼，快速蒸熟食物，保留营养',
          use: '适用于蒸包子、馒头、海鲜、蔬菜等',
          cuisine: '特别适合中餐，尤其是粤菜和淮扬菜',
          usage: '根据食物种类调整蒸制时间，水要适量，避免烧干',
          buyLink: 'https://example.com/steamer',
          image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=steamer%20pot&size=800x800',
          likes: 156,
          comments: [
            {
              id: 1,
              user: '健康生活',
              avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=user%20avatar%204&size=100x100',
              content: '蒸出来的食物更健康，这个蒸锅很好用！',
              time: '2024-01-12 11:45'
            }
          ]
        },
        {
          id: 5,
          name: '烘焙套装',
          description: '专业烘焙工具套装，包含各种烘焙模具',
          use: '适用于制作蛋糕、饼干、面包等烘焙食品',
          cuisine: '适用于西式烘焙',
          usage: '按照配方要求使用不同的模具，烘焙前要预热烤箱，使用后及时清洗',
          buyLink: 'https://example.com/baking-tools',
          image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=baking%20tools%20set&size=800x800',
          likes: 87,
          comments: []
        },
        {
          id: 6,
          name: '厨房秤',
          description: '精准电子秤，烘焙必备，精确到0.1g',
          use: '适用于烘焙、烹饪时精确称量食材',
          cuisine: '特别适合烘焙和需要精确配比的菜品',
          usage: '使用前校准，放置在平稳的地方，称量时要轻拿轻放',
          buyLink: '',
          image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=kitchen%20scale&size=800x800',
          likes: 134,
          comments: [
            {
              id: 1,
              user: '烘焙达人',
              avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=user%20avatar%205&size=100x100',
              content: '精准度很高，烘焙必备工具！',
              time: '2024-01-14 16:30'
            }
          ]
        },
        {
          id: 7,
          name: '削皮器',
          description: '多功能削皮器，轻松处理各种水果和蔬菜',
          use: '适用于削水果、蔬菜的皮',
          cuisine: '适用于各种菜系',
          usage: '使用时要注意安全，避免划伤手，使用后及时清洗',
          buyLink: 'https://example.com/peeler',
          image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=vegetable%20peeler&size=800x800',
          likes: 203,
          comments: [
            {
              id: 1,
              user: '素食主义者',
              avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=user%20avatar%206&size=100x100',
              content: '削皮非常轻松，节省时间！',
              time: '2024-01-11 08:50'
            }
          ]
        },
        {
          id: 8,
          name: '擀面杖',
          description: '实木擀面杖，擀面均匀，手感舒适',
          use: '适用于擀面、压面等操作',
          cuisine: '特别适合中餐面食和西式烘焙',
          usage: '擀面时要均匀用力，保持擀面杖清洁，使用后及时擦干',
          buyLink: '',
          image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=wooden%20rolling%20pin&size=800x800',
          likes: 112,
          comments: []
        }
      ],
      user: {

      },
      userLikedTools: [],
      selectedTool: null,
      currentTool: null,
      newComment: '',
      showCommentDialog: false,
      showPostToolDialog: false,
      newTool: {
        name: '',
        description: '',
        use: '',
        cuisine: '',
        usage: '',
        buyLink: '',
        image: ''
      },
      searchKeyword: '',
      sortBy: 'default'
    }
  },
  computed: {
    filteredTools() {
      let result = [...this.tools]

      // 如果选择了工具，则只显示该工具
      if (this.selectedTool) {
        result = result.filter(tool => tool.id === this.selectedTool.id)
      } else if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase()
        result = result.filter(tool =>
          tool.name.toLowerCase().includes(keyword) ||
          tool.description.toLowerCase().includes(keyword)
        )
      }

      // 销量排序
      if (this.sortBy === 'sales') {
        result.sort((a, b) => b.sales - a.sales)
      }

      return result
    }
  },
  mounted() {
    this.username = this.$route.query.username || localStorage.getItem('username') || ''
    this.findUserAll()
  },
  methods: {
    // 查找所有用户,根据用户名查找用户信息
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
                const date = response.data
                this.user = date
                console.log('获取到的用户信息:', date)
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
    handleSelect() {
      console.log('点击了导航栏')
    },
    likeTool(tool) {
      // 检查工具是否已被当前用户点赞
      const isLiked = tool.isLiked || false

      if (isLiked) {
        // 取消点赞
        tool.likes--
        tool.isLiked = false
        // 从用户点赞记录中移除
        this.userLikedTools = this.userLikedTools.filter(t => t.id !== tool.id)
      } else {
        // 添加点赞
        tool.likes++
        tool.isLiked = true
        // 添加到用户点赞记录
        if (!this.userLikedTools.some(t => t.id === tool.id)) {
          this.userLikedTools.push(tool)
        }
      }
    },

    addComment(tool) {
      if (this.newComment.trim()) {
        const newCommentObj = {
          id: tool.comments.length + 1,
          user: this.user.name,
          avatar: this.user.avatar,
          content: this.newComment.trim(),
          time: new Date().toLocaleString('zh-CN')
        }
        tool.comments.push(newCommentObj)
        this.newComment = ''
      }
    },
    openCommentDialog(tool) {
      this.currentTool = tool
      this.newComment = ''
      this.showCommentDialog = true
    },
    submitNewTool() {
      // 验证表单
      if (!this.newTool.name || !this.newTool.description || !this.newTool.use || !this.newTool.cuisine || !this.newTool.usage || !this.newTool.image) {
        alert('请填写所有必填字段')
        return
      }

      // 创建新工具
      const newToolObj = {
        id: this.tools.length + 1,
        name: this.newTool.name,
        description: this.newTool.description,
        use: this.newTool.use,
        cuisine: this.newTool.cuisine,
        usage: this.newTool.usage,
        buyLink: this.newTool.buyLink,
        image: this.newTool.image,
        likes: 0,
        comments: []
      }

      // 添加到工具列表
      this.tools.push(newToolObj)

      // 重置表单
      this.newTool = {
        name: '',
        description: '',
        use: '',
        cuisine: '',
        usage: '',
        buyLink: '',
        image: ''
      }

      // 关闭对话框
      this.showPostToolDialog = false
      alert('工具发布成功！')
    },
    selectLikedTool(tool) {
      this.selectedTool = tool
    },
    backToAllTools() {
      this.selectedTool = null
    },
    handleImageUpload(e) {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          this.newTool.image = event.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    removeImage() {
      this.newTool.image = ''
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
.el-menu-demo {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-menu-item.active {
  color: #E64340 !important;
  border-bottom: 2px solid #E64340;
}

.cool-tool-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  display: flex;
  gap: 30px;
  justify-content: flex-start;
}

/* 左侧边栏 */
.sidebar {
  width: 250px;
  flex-shrink: 0;
  margin-left: 0;
}

.user-profile {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 10px;
  object-fit: cover;
}

.profile-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.post-tool-btn {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.post-tool-btn:hover {
  background-color: #45a049;
}

.user-likes {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.likes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.user-likes h4 {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.back-btn {
  padding: 6px 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background-color: #2980b9;
}

.liked-tools-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.liked-tool-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: all 0.3s ease;
}

.liked-tool-item:hover {
  background-color: #f0f0f0;
  border-color: #3498db;
}

.liked-tool-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.liked-tool-name {
  font-size: 14px;
  color: #333;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-likes {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}

/* 右侧主内容 */
.main-content {
  flex: 1;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
}

.page-header p {
  font-size: 16px;
  color: #666;
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.search-box {
  display: flex;
  flex: 1;
  min-width: 300px;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 16px;
}

.search-btn {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 16px;
}

.search-btn:hover {
  background-color: #45a049;
}

.sort-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.tool-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.tool-image {
  height: 200px;
  overflow: hidden;
}

.tool-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tool-info {
  padding: 15px;
}

.tool-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.tool-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.4;
}

.tool-details {
  margin: 15px 0;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.detail-item {
  margin-bottom: 10px;
  line-height: 1.4;
}

.detail-item strong {
  color: #333;
  margin-right: 5px;
}

.buy-link {
  color: #3498db;
  text-decoration: none;
  transition: color 0.3s ease;
}

.buy-link:hover {
  color: #2980b9;
  text-decoration: underline;
}

.tool-actions {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

.action-btn {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.like-btn:hover {
  background-color: #f8f8f8;
  border-color: #E64340;
  color: #E64340;
}

.like-btn.liked {
  background-color: #E64340;
  border-color: #E64340;
  color: white;
}

.like-btn.liked:hover {
  background-color: #c43532;
  border-color: #c43532;
  color: white;
}

.comment-btn:hover {
  background-color: #f8f8f8;
  border-color: #3498db;
  color: #3498db;
}

.comment-dialog {
  margin: 20px 0;
}

.comment-input-area {
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.comment-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comment-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  min-height: 80px;
  font-size: 14px;
}

.comment-submit {
  align-self: flex-end;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.comment-submit:hover {
  background-color: #45a049;
}

.comments-list {
  margin-top: 15px;
  max-height: 300px;
  overflow-y: auto;
}

.comment-item {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.comment-user {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-text {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  margin: 0;
}

.no-comments {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}

/* 发布工具表单 */
.post-tool-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-item label {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.form-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  min-height: 80px;
  font-size: 14px;
}

.image-upload {
  position: relative;
  margin-top: 5px;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.upload-btn {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.upload-btn:hover {
  background-color: #2980b9;
}

.image-preview {
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.remove-btn {
  padding: 6px 12px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s ease;
}

.remove-btn:hover {
  background-color: #c0392b;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 18px;
}

@media (max-width: 768px) {
  .cool-tool-page {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: 100%;
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }

  .tool-actions {
    flex-direction: column;
  }

  .comment-input {
    align-items: stretch;
  }

  .comment-submit {
    align-self: stretch;
  }

  .comment-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .comment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>
