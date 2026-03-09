<template>
  <div class="history-page">
    <!-- 顶部导航栏 -->
    <el-menu default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1" @click="$router.push('/')">首页</el-menu-item>
      <el-menu-item index="2" @click="$router.push('/community')">社区</el-menu-item>
      <el-menu-item index="3" class="active">美食文化</el-menu-item>
      <el-menu-item index="4"><i class="el-icon-user" />我的账户</el-menu-item>
    </el-menu>

    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="main-title">泉州美食文化</h1>
        <p class="subtitle">探寻千年古城的味蕾记忆</p>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-container">
      <!-- 泉州简介 -->
      <el-card class="intro-card" shadow="hover">
        <div class="section-header">
          <i class="el-icon-location-information" />
          <h2>泉州简介</h2>
        </div>
        <div class="intro-content">
          <el-row :gutter="20">
            <el-col :span="12">
              <p>泉州，简称"鲤"，别名"鲤城"、"刺桐城"，位于福建省东南沿海，是福建省三大中心城市之一。</p>
              <p>泉州是国务院首批公布的24个历史文化名城之一，是中国古代海上丝绸之路的起点，被誉为"东方第一大港"。</p>
              <p>悠久的历史孕育了泉州丰富的美食文化，形成了独具特色的闽南风味。</p>
            </el-col>
            <el-col :span="12">
              <el-image
                src="https://images.unsplash.com/photo-1568691540442-4c61c9f76b7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                fit="cover"
                class="intro-image"
              />
            </el-col>
          </el-row>
        </div>
      </el-card>

      <!-- 美食发展历史 -->
      <el-card class="history-card" shadow="hover">
        <div class="section-header">
          <i class="el-icon-time" />
          <h2>美食发展历史</h2>
        </div>
        <el-timeline>
          <el-timeline-item timestamp="唐宋时期" placement="top">
            <el-card>
              <h3>海上丝绸之路带来的繁荣</h3>
              <p>随着海上丝绸之路的开通，泉州成为重要的对外贸易港口，来自阿拉伯、东南亚等地的香料和食材传入泉州，与本地饮食文化融合，形成了独特的风味。</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="明清时期" placement="top">
            <el-card>
              <h3>闽南饮食文化的形成</h3>
              <p>明清时期，泉州饮食文化进入繁荣期，形成了以"鲜、香、淡"为特色的闽南菜系。许多传统小吃就是在这一时期定型并传承至今。</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="近现代" placement="top">
            <el-card>
              <h3>美食文化的传承与发展</h3>
              <p>近现代以来，泉州美食在传承传统的基础上不断创新，涌现出众多特色美食和餐饮品牌，成为泉州文化的重要组成部分。</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="当代" placement="top">
            <el-card>
              <h3>走向世界的泉州味道</h3>
              <p>如今，泉州美食已经走向全国乃至世界，成为传播泉州文化的重要载体。越来越多的游客来到泉州，品尝地道的闽南美食。</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-card>

      <!-- 特色美食 -->
      <el-card class="food-card" shadow="hover">
        <div class="section-header">
          <i class="el-icon-food" />
          <h2>特色美食</h2>
        </div>
        <el-row :gutter="20">
          <el-col v-for="(food, index) in specialFoods" :key="index" :span="8">
            <el-card class="food-item" shadow="hover">
              <div class="food-image">
                <el-image :src="food.image" fit="cover" />
              </div>
              <h3 class="food-name">{{ food.name }}</h3>
              <p class="food-desc">{{ food.description }}</p>
              <div class="food-tags">
                <el-tag v-for="tag in food.tags" :key="tag" size="mini">{{ tag }}</el-tag>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>

      <!-- 美食文化内涵 -->
      <el-card class="culture-card" shadow="hover">
        <div class="section-header">
          <i class="el-icon-reading" />
          <h2>美食文化内涵</h2>
        </div>
        <el-row :gutter="20">
          <el-col v-for="(culture, index) in cultureContent" :key="index" :span="12">
            <div class="culture-item">
              <div class="culture-icon">
                <i :class="culture.icon" />
              </div>
              <div class="culture-text">
                <h3>{{ culture.title }}</h3>
                <p>{{ culture.description }}</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 传统节日美食 -->
      <el-card class="festival-card" shadow="hover">
        <div class="section-header">
          <i class="el-icon-present" />
          <h2>传统节日美食</h2>
        </div>
        <el-table :data="festivalFoods" style="width: 100%">
          <el-table-column prop="festival" label="节日" width="180">
            <template slot-scope="scope">
              <span class="festival-name">{{ scope.row.festival }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="food" label="传统美食" width="200" />
          <el-table-column prop="meaning" label="文化寓意" />
        </el-table>
      </el-card>

      <!-- 美食地图 -->
      <el-card class="map-card" shadow="hover">
        <div class="section-header">
          <i class="el-icon-map-location" />
          <h2>泉州美食地图</h2>
        </div>
        <el-row :gutter="20">
          <el-col v-for="(area, index) in foodAreas" :key="index" :span="8">
            <div class="area-card">
              <h3><i class="el-icon-location" /> {{ area.name }}</h3>
              <p>{{ area.description }}</p>
              <ul>
                <li v-for="dish in area.dishes" :key="dish">{{ dish }}</li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 非遗美食 -->
      <el-card class="heritage-card" shadow="hover">
        <div class="section-header">
          <i class="el-icon-medal" />
          <h2>非物质文化遗产</h2>
        </div>
        <el-row :gutter="20">
          <el-col v-for="(heritage, index) in intangibleHeritage" :key="index" :span="12">
            <el-card class="heritage-item" shadow="hover">
              <el-row :gutter="15">
                <el-col :span="8">
                  <el-image :src="heritage.image" fit="cover" class="heritage-image" />
                </el-col>
                <el-col :span="16">
                  <h3>{{ heritage.name }}</h3>
                  <p>{{ heritage.description }}</p>
                  <el-tag type="success" size="mini">{{ heritage.year }}</el-tag>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 页脚 -->
    <div class="page-footer">
      <p>© 2024 泉州美食网 - 传承千年美食文化</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FoodHistory',
  data() {
    return {
      specialFoods: [
        {
          name: '面线糊',
          description: '泉州传统小吃，以细面线为主料，配以各种海鲜、肉类等配料，汤鲜味美，是泉州人早餐的首选。',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          tags: ['传统小吃', '早餐', '必吃']
        },
        {
          name: '土笋冻',
          description: '泉州特色小吃，以沙虫为主料制成，口感Q弹，富含胶原蛋白，是夏季消暑佳品。',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          tags: ['特色小吃', '凉菜', '非遗']
        },
        {
          name: '姜母鸭',
          description: '泉州传统名菜，选用优质鸭肉与老姜炖煮，具有滋补养颜的功效，是冬季进补佳品。',
          image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          tags: ['传统名菜', '进补', '特色']
        },
        {
          name: '肉粽',
          description: '泉州烧肉粽以糯米、猪肉、咸蛋黄等为原料，经过独特工艺制作，香气扑鼻，是端午节的传统美食。',
          image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          tags: ['传统节日', '粽子', '必吃']
        },
        {
          name: '海蛎煎',
          description: '泉州特色海味小吃，以新鲜海蛎为主料，裹以地瓜粉煎制，外酥里嫩，鲜美可口。',
          image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          tags: ['海鲜', '特色小吃', '街头美食']
        },
        {
          name: '润饼',
          description: '泉州传统春卷，以薄饼包裹各种馅料制成，是清明节传统食品，寓意"包金包银"。',
          image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          tags: ['传统节日', '春卷', '时令']
        }
      ],
      cultureContent: [
        {
          icon: 'el-icon-connection',
          title: '海丝文化融合',
          description: '泉州作为海上丝绸之路的起点，融合了闽南、阿拉伯、东南亚等多元饮食文化，形成了独特的风味体系。'
        },
        {
          icon: 'el-icon-s-home',
          title: '闽南家族传统',
          description: '泉州美食蕴含着深厚的家族观念，许多传统美食的制作技艺代代相传，体现了闽南人重视家庭和传承的美德。'
        },
        {
          icon: 'el-icon-sunny',
          title: '节庆礼仪文化',
          description: '泉州人讲究"不时不食"，根据不同节日准备相应的美食，体现了对传统节庆的重视和对自然的敬畏。'
        },
        {
          icon: 'el-icon-star-on',
          title: '匠人精神',
          description: '泉州美食的制作讲究精细工序，许多老字号传承人一生专注一道菜，体现了精益求精的匠人精神。'
        }
      ],
      festivalFoods: [
        {
          festival: '春节',
          food: '年糕、炸醋肉、菜头粿',
          meaning: '寓意"年年高"、"步步高升"'
        },
        {
          festival: '元宵节',
          food: '元宵、汤圆',
          meaning: '团圆美满、阖家欢乐'
        },
        {
          festival: '清明节',
          food: '润饼、鼠曲粿',
          meaning: '纪念先人、踏青游春'
        },
        {
          festival: '端午节',
          food: '肉粽、碱粽',
          meaning: '纪念屈原、驱邪避瘟'
        },
        {
          festival: '中秋节',
          food: '月饼、芋头',
          meaning: '团圆美满、丰收寓意'
        },
        {
          festival: '冬至',
          food: '搓圆、汤圆',
          meaning: '团圆相聚、迎接寒冬'
        }
      ],
      foodAreas: [
        {
          name: '西街区域',
          description: '泉州最古老的商业街区，汇聚了众多传统老字号',
          dishes: ['面线糊', '肉粽', '花生汤', '炸菜粿']
        },
        {
          name: '中山路区域',
          description: '骑楼建筑群，品尝地道闽南小吃的好去处',
          dishes: ['土笋冻', '海蛎煎', '润饼', '石花膏']
        },
        {
          name: '天后宫区域',
          description: '紧邻天后宫，附近有众多传统美食店',
          dishes: ['姜母鸭', '四果汤', '元宵', '咸饭']
        }
      ],
      intangibleHeritage: [
        {
          name: '泉州面线糊制作技艺',
          description: '福建省非物质文化遗产，历史悠久，制作工艺讲究，是泉州最具代表性的小吃之一。',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          year: '省级非遗'
        },
        {
          name: '泉州姜母鸭制作技艺',
          description: '传统滋补菜品制作技艺，选用优质食材，经过精心炖煮，具有很高的营养价值。',
          image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          year: '市级非遗'
        }
      ]
    }
  },
  methods: {
    handleSelect(key) {
      console.log('点击了导航栏:', key)
    }
  }
}
</script>

<style scoped>
.history-page {
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

.page-header {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80');
  background-size: cover;
  background-position: center;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
}

.main-title {
  font-size: 48px;
  margin: 0 0 15px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.subtitle {
  font-size: 20px;
  margin: 0;
  opacity: 0.9;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.el-card {
  margin-bottom: 30px;
  border-radius: 8px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #E64340;
}

.section-header i {
  font-size: 28px;
  color: #E64340;
  margin-right: 10px;
}

.section-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.intro-content p {
  line-height: 1.8;
  color: #666;
  margin-bottom: 15px;
  text-align: justify;
}

.intro-image {
  width: 100%;
  height: 250px;
  border-radius: 8px;
}

.history-card h3 {
  color: #E64340;
  margin: 0 0 10px 0;
}

.history-card p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.food-item {
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.food-item:hover {
  transform: translateY(-5px);
}

.food-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 15px;
}

.food-name {
  color: #E64340;
  margin: 0 0 10px 0;
  font-size: 18px;
}

.food-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 15px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.food-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.culture-item {
  display: flex;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.culture-icon {
  width: 60px;
  height: 60px;
  background-color: #E64340;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  flex-shrink: 0;
}

.culture-icon i {
  font-size: 28px;
  color: #fff;
}

.culture-text h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.culture-text p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.festival-name {
  color: #E64340;
  font-weight: bold;
}

.area-card {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 20px;
}

.area-card h3 {
  color: #E64340;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.area-card p {
  color: #666;
  margin: 0 0 15px 0;
}

.area-card ul {
  margin: 0;
  padding-left: 20px;
}

.area-card li {
  color: #333;
  margin-bottom: 5px;
}

.heritage-item {
  margin-bottom: 20px;
}

.heritage-image {
  width: 100%;
  height: 120px;
  border-radius: 4px;
}

.heritage-item h3 {
  color: #E64340;
  margin: 0 0 10px 0;
}

.heritage-item p {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 10px 0;
}

.page-footer {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 20px;
  margin-top: 40px;
}

.page-footer p {
  margin: 0;
}
</style>
