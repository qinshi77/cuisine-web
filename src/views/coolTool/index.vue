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
      <el-menu-item index="7" @click="$router.push('/login')"><i class="el-icon-user" />登录</el-menu-item>
    </el-menu>
    <div class="cool-tool-page">
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
          <div class="tool-image">
            <img :src="tool.image" :alt="tool.name">
          </div>
          <div class="tool-info">
            <h3 class="tool-name">{{ tool.name }}</h3>
            <p class="tool-description">{{ tool.description }}</p>
            <div class="tool-price">¥{{ tool.price }}</div>
            <div class="tool-sales">销量: {{ tool.sales }}件</div>
            <button class="add-to-cart">加入购物车</button>
          </div>
        </div>
      </div>

      <!-- 无结果提示 -->
      <div v-if="filteredTools.length === 0" class="no-results">
        <p>没有找到匹配的工具</p>
      </div>
    </div>
  </div>
</template>

<script>
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
          price: 299,
          sales: 1250,
          image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=professional%20chef%20knife&size=800x800'
        },
        {
          id: 2,
          name: '不粘锅',
          description: '高品质不粘涂层，煎炒煮炸样样精通',
          price: 399,
          sales: 2100,
          image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=non-stick%20frying%20pan&size=800x800'
        },
        {
          id: 3,
          name: '料理机',
          description: '多功能料理机，搅拌、榨汁、研磨一体',
          price: 899,
          sales: 850,
          image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=food%20processor&size=800x800'
        },
        {
          id: 4,
          name: '蒸锅',
          description: '多层蒸笼，快速蒸熟食物，保留营养',
          price: 249,
          sales: 1500,
          image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=steamer%20pot&size=800x800'
        },
        {
          id: 5,
          name: '烘焙套装',
          description: '专业烘焙工具套装，包含各种烘焙模具',
          price: 499,
          sales: 680,
          image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=baking%20tools%20set&size=800x800'
        },
        {
          id: 6,
          name: '厨房秤',
          description: '精准电子秤，烘焙必备，精确到0.1g',
          price: 129,
          sales: 1800,
          image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=kitchen%20scale&size=800x800'
        },
        {
          id: 7,
          name: '削皮器',
          description: '多功能削皮器，轻松处理各种水果和蔬菜',
          price: 39,
          sales: 3200,
          image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=vegetable%20peeler&size=800x800'
        },
        {
          id: 8,
          name: '擀面杖',
          description: '实木擀面杖，擀面均匀，手感舒适',
          price: 89,
          sales: 950,
          image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=wooden%20rolling%20pin&size=800x800'
        }
      ],
      searchKeyword: '',
      sortBy: 'default'
    }
  },
  computed: {
    filteredTools() {
      let result = [...this.tools]

      // 搜索过滤
      if (this.searchKeyword) {
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
    this.username = this.$route.query.username || ''
  },
  methods: {
    handleSelect() {
      console.log('点击了导航栏')
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

.tool-price {
  font-size: 20px;
  font-weight: bold;
  color: #e74c3c;
  margin-bottom: 5px;
}

.tool-sales {
  font-size: 12px;
  color: #999;
  margin-bottom: 15px;
}

.add-to-cart {
  width: 100%;
  padding: 10px;
  background-color: #f39c12;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.add-to-cart:hover {
  background-color: #e67e22;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 18px;
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: 100%;
  }

  .tools-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}
</style>
