<template>
  <div>
    <!--                   顶部导航栏                        -->
    <el-menu default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1" class="active" @click="$router.push('/')">首页</el-menu-item>
      <el-menu-item index="2" @click="$router.push('/community')">社区</el-menu-item>
      <el-menu-item index="3" @click="$router.push('/history')">美食文化</el-menu-item>
      <el-menu-item index="4" @click="$router.push('/heatmap')">热图</el-menu-item>
      <el-menu-item index="5" @click="$router.push('/login')"><i class="el-icon-user" />登录</el-menu-item>
    </el-menu>
    <!--                   轮播图内容区域                        -->
    <div class="img-container">
      <el-carousel :interval="5000" arrow="always" height="400px">
        <el-carousel-item v-for="img in imgs" :key="img">
          <!-- <img :src="img" alt="轮播图图片"> -->
          <el-image :src="img" alt="轮播图图片" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!--                   图标区域                        -->
    <div class="icon-container">
      <div class="icon-item">
        <img src="../assets/icon.png" class="iconImg">
        <span class="icon-text">提示信息</span>
      </div>
      <div class="icon-item">
        <img src="../assets/icon.png" class="iconImg">
        <span class="icon-text">提示信息</span>
      </div>
      <div class="icon-item">
        <img src="../assets/icon.png" class="iconImg">
        <span class="icon-text">提示信息</span>
      </div>
      <div class="icon-item">
        <img src="../assets/icon.png" class="iconImg">
        <span class="icon-text">提示信息</span>
      </div>
      <div class="icon-item">
        <img src="../assets/icon.png" class="iconImg">
        <span class="icon-text">提示信息</span>
      </div>
      <div class="icon-item">
        <img src="../assets/icon.png" class="iconImg">
        <span class="icon-text">提示信息</span>
      </div>
    </div>

    <!--                   美食文章内容管理区域                        -->
    <div class="article-container">
      <h2 class="section-title">美食文章</h2>
      <div class="article-grid">
        <el-card v-for="(article, index) in articles" :key="index" class="article-card" shadow="hover">
          <div class="article-image">
            <el-image :src="article.image" fit="cover" class="card-image" />
          </div>
          <div class="article-content">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-description">{{ article.description }}</p>
            <div class="article-footer">
              <span class="article-author">{{ article.author }}</span>
              <span class="article-date">{{ article.date }}</span>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      imgs: [
        require('@/assets/美食图片1.jpg')
      ],
      articles: [
        {
          title: '泉州传统小吃：面线糊',
          description: '面线糊是泉州最具代表性的传统小吃之一，以其鲜美的汤底和细腻的面线而闻名。搭配各种配料，营养丰富，口感层次分明。',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          author: '美食达人',
          date: '2024-01-15'
        },
        {
          title: '泉州土笋冻：海味珍馐',
          description: '土笋冻是泉州特色海味小吃，以沙虫为原料制作而成，口感Q弹，鲜美可口，是泉州人夏日消暑的佳品。',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          author: '海鲜专家',
          date: '2024-01-14'
        },
        {
          title: '泉州姜母鸭：滋补美味',
          description: '姜母鸭是泉州著名的滋补菜品，选用优质鸭肉和老姜，经过精心炖煮，肉质鲜嫩，汤汁浓郁，具有很好的滋补功效。',
          image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          author: '烹饪大师',
          date: '2024-01-13'
        },
        {
          title: '泉州醋肉：酸甜可口',
          description: '醋肉是泉州传统小吃，以猪肉为主料，经过腌制和油炸，外酥内嫩，酸甜可口，是泉州人喜爱的街头美食。',
          image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          author: '小吃爱好者',
          date: '2024-01-12'
        },
        {
          title: '泉州烧肉粽：传统美味',
          description: '烧肉粽是泉州传统节日食品，以糯米、猪肉、蛋黄等为主要原料，经过精心包裹和蒸煮，口感丰富，香气四溢。',
          image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          author: '传统美食家',
          date: '2024-01-11'
        },
        {
          title: '泉州海蛎煎：鲜美海味',
          description: '海蛎煎是泉州特色海味小吃，以新鲜海蛎为主料，搭配鸡蛋和调料煎制而成，口感鲜美，营养丰富。',
          image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          author: '海鲜达人',
          date: '2024-01-10'
        }
      ]
    }
  },
  methods: {
    handleSelect() {
      console.log('点击了导航栏')
    }
  }
}
</script>

<style scoped>
.icon-container{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 20px;
}
.icon-text {
  text-align: center;
  font-size: 18px;
  margin-top: 5px;
}
.icon-item {
  display: flex;
  flex-direction: column;
  height: 100px;
  width: 100px;
}
.iconImg {
  width: 64px;
  height: 64px;
  margin: 0 auto;
}
.el-menu-demo {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-menu-item.active {
  color: #E64340 !important;
  border-bottom: 2px solid #E64340;
}
.container {
  width: 800px;
  height: 800px;
  border: 1px solid #000;
  margin: 0 auto;
}
.img-container {
  width: 60%;
  margin: 20px auto;
}
.article-container {
  width: 60%;
  margin: 40px auto;
  padding: 20px;
}

.section-title {
  text-align: center;
  color: #E64340;
  margin-bottom: 30px;
  font-size: 28px;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.article-card {
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.article-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
}

.article-content {
  padding: 15px;
}

.article-title {
  color: #333;
  font-size: 18px;
  margin: 0 0 10px 0;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-description {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 15px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.article-author {
  color: #E64340;
  font-size: 12px;
  font-weight: bold;
}

.article-date {
  color: #999;
  font-size: 12px;
}
</style>
