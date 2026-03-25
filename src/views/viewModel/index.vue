<template>
  <div class="heatmap-page">
    <!-- 顶部导航栏 -->
    <el-menu default-active="5" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1" @click="$router.push('/')">首页</el-menu-item>
      <el-menu-item index="2" @click="$router.push('/community')">社区</el-menu-item>
      <el-menu-item index="3" @click="$router.push('/history')">美食文化</el-menu-item>
      <el-menu-item index="4" @click="$router.push('/coolTool')">美食工具</el-menu-item>
      <el-menu-item index="5" class="active">热图</el-menu-item>
      <el-menu-item index="6" @click="$router.push('/games')">小游戏</el-menu-item>
      <el-menu-item index="7" @click="handleLogout"><i class="el-icon-user" />退出登录</el-menu-item>
    </el-menu>

    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="main-title">泉州非遗美食地图</h1>
        <p class="subtitle">探寻千年古城的非遗美食分布</p>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-container">
      <!-- 地图展示区域 -->
      <el-card class="map-card" shadow="hover">
        <div class="card-header">
          <i class="el-icon-map-location" />
          <h2>泉州市非遗美食分布地图</h2>
        </div>
        <div class="map-container">
          <!-- 地图背景 -->
          <div class="map-background">
            <div class="map-title">泉州市行政区划图</div>

            <!-- 德化县 - 最北边 -->
            <div class="district-area dehua" @click="showDistrictDetail('德化县')">
              <div class="district-label">德化县</div>
              <div class="food-tags-small">
                <span v-for="(food, idx) in getDistrictFoods('德化县')" :key="idx" class="food-tag-mini">{{ food.name.split('泉州').pop().split('制作技艺')[0] }}</span>
              </div>
            </div>

            <!-- 永春县 - 德化南边 -->
            <div class="district-area yongchun" @click="showDistrictDetail('永春县')">
              <div class="district-label">永春县</div>
              <div class="food-tags-small">
                <span v-for="(food, idx) in getDistrictFoods('永春县')" :key="idx" class="food-tag-mini">{{ food.name.split('泉州').pop().split('制作技艺')[0] }}</span>
              </div>
            </div>

            <!-- 安溪县 - 永春西边 -->
            <div class="district-area anxi" @click="showDistrictDetail('安溪县')">
              <div class="district-label">安溪县</div>
              <div class="food-tags-small">
                <span v-for="(food, idx) in getDistrictFoods('安溪县')" :key="idx" class="food-tag-mini">{{ food.name.split('泉州').pop().split('制作技艺')[0] }}</span>
              </div>
            </div>

            <!-- 南安市 - 安溪东边，永春南边 -->
            <div class="district-area nanan" @click="showDistrictDetail('南安市')">
              <div class="district-label">南安市</div>
              <div class="food-tags-small">
                <span v-for="(food, idx) in getDistrictFoods('南安市')" :key="idx" class="food-tag-mini">{{ food.name.split('泉州').pop().split('制作技艺')[0] }}</span>
              </div>
            </div>

            <!-- 洛江区 - 南安东北 -->
            <div class="district-area luojiang" @click="showDistrictDetail('洛江区')">
              <div class="district-label">洛江区</div>
              <div class="food-tags-small">
                <span v-for="(food, idx) in getDistrictFoods('洛江区')" :key="idx" class="food-tag-mini">{{ food.name.split('泉州').pop().split('制作技艺')[0] }}</span>
              </div>
            </div>

            <!-- 惠安县 - 洛江东边 -->
            <div class="district-area huian" @click="showDistrictDetail('惠安县')">
              <div class="district-label">惠安县</div>
              <div class="food-tags-small">
                <span v-for="(food, idx) in getDistrictFoods('惠安县')" :key="idx" class="food-tag-mini">{{ food.name.split('泉州').pop().split('制作技艺')[0] }}</span>
              </div>
            </div>

            <!-- 泉港区 - 惠安北边 -->
            <div class="district-area quangang" @click="showDistrictDetail('泉港区')">
              <div class="district-label">泉港区</div>
              <div class="food-tags-small">
                <span v-for="(food, idx) in getDistrictFoods('泉港区')" :key="idx" class="food-tag-mini">{{ food.name.split('泉州').pop().split('制作技艺')[0] }}</span>
              </div>
            </div>

            <!-- 丰泽区 - 中心区域 -->
            <div class="district-area fengze" @click="showDistrictDetail('丰泽区')">
              <div class="district-label">丰泽区</div>
              <div class="food-tags-small">
                <span v-for="(food, idx) in getDistrictFoods('丰泽区')" :key="idx" class="food-tag-mini">{{ food.name.split('泉州').pop().split('制作技艺')[0] }}</span>
              </div>
            </div>

            <!-- 鲤城区 - 丰泽西边 -->
            <div class="district-area licheng" @click="showDistrictDetail('鲤城区')">
              <div class="district-label">鲤城区</div>
              <div class="food-tags-small">
                <span v-for="(food, idx) in getDistrictFoods('鲤城区')" :key="idx" class="food-tag-mini">{{ food.name.split('泉州').pop().split('制作技艺')[0] }}</span>
              </div>
            </div>

            <!-- 晋江市 - 丰泽南边 -->
            <div class="district-area jinjiang" @click="showDistrictDetail('晋江市')">
              <div class="district-label">晋江市</div>
              <div class="food-tags-small">
                <span v-for="(food, idx) in getDistrictFoods('晋江市')" :key="idx" class="food-tag-mini">{{ food.name.split('泉州').pop().split('制作技艺')[0] }}</span>
              </div>
            </div>

            <!-- 石狮市 - 晋江东南 -->
            <div class="district-area shishi" @click="showDistrictDetail('石狮市')">
              <div class="district-label">石狮市</div>
              <div class="food-tags-small">
                <span v-for="(food, idx) in getDistrictFoods('石狮市')" :key="idx" class="food-tag-mini">{{ food.name.split('泉州').pop().split('制作技艺')[0] }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 选中地区详情 -->
      <el-card v-if="selectedDistrict" class="detail-card" shadow="hover">
        <div class="card-header">
          <i class="el-icon-location" />
          <h2>{{ selectedDistrict.name }} - 非遗美食详情</h2>
        </div>
        <div class="district-food-detail">
          <div v-for="(food, index) in selectedDistrict.foods" :key="index" class="food-detail-item">
            <div class="food-header">
              <h4 class="food-name">{{ food.name }}</h4>
              <div class="food-level-tags">
                <el-tag :type="getLevelType(food.level)" size="small">{{ food.level }}</el-tag>
                <el-tag type="info" size="small">{{ food.year }}</el-tag>
              </div>
            </div>
            <p class="food-desc">{{ food.description }}</p>
          </div>
        </div>
      </el-card>

      <!-- 统计信息 -->
      <el-row :gutter="20" class="stats-row">
        <el-col :span="8">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <i class="el-icon-medal stat-icon" />
              <div class="stat-info">
                <h3>{{ totalHeritage }}</h3>
                <p>非遗美食总数</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <i class="el-icon-location stat-icon" />
              <div class="stat-info">
                <h3>{{ totalDistricts }}</h3>
                <p>覆盖区县</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <i class="el-icon-trophy stat-icon" />
              <div class="stat-info">
                <h3>{{ maxDistrict }}</h3>
                <p>最多区县</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 非遗美食图例 -->
      <el-card class="legend-card" shadow="hover">
        <div class="card-header">
          <i class="el-icon-info" />
          <h2>图例说明</h2>
        </div>
        <div class="legend-content">
          <div class="legend-item">
            <span class="legend-color" style="background-color: #ff6b6b;" />
            <span>国家级非遗</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background-color: #ffa502;" />
            <span>省级非遗</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background-color: #2ed573;" />
            <span>市级非遗</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background-color: #70a1ff;" />
            <span>区级非遗</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeatMap',
  data() {
    return {
      selectedDistrict: null,
      districtData: [
        {
          name: '鲤城区',
          foods: [
            { name: '泉州面线糊制作技艺', description: '泉州最具代表性的传统小吃之一，历史悠久，制作工艺讲究', level: '省级非遗', year: '2007年' },
            { name: '泉州肉粽制作技艺', description: '端午节传统美食，用料讲究，制作精细', level: '市级非遗', year: '2008年' },
            { name: '泉州元宵丸制作技艺', description: '泉州元宵节传统食品，寓意团圆美满', level: '市级非遗', year: '2010年' },
            { name: '泉州春卷制作技艺', description: '又称润饼，清明节传统食品', level: '区级非遗', year: '2012年' }
          ]
        },
        {
          name: '丰泽区',
          foods: [
            { name: '泉州姜母鸭制作技艺', description: '传统滋补菜品，选用优质食材，具有很高的营养价值', level: '市级非遗', year: '2009年' },
            { name: '泉州炸醋肉制作技艺', description: '泉州传统小吃，外酥里嫩，酸甜可口', level: '区级非遗', year: '2011年' }
          ]
        },
        {
          name: '洛江区',
          foods: [
            { name: '洛江土笋冻制作技艺', description: '以沙虫为主料，口感Q弹，鲜美可口', level: '区级非遗', year: '2013年' },
            { name: '洛江九重粿制作技艺', description: '传统米制品，口感软糯，香甜可口', level: '区级非遗', year: '2014年' }
          ]
        },
        {
          name: '泉港区',
          foods: [
            { name: '泉港浮粿制作技艺', description: '泉港特色小吃，外酥里嫩，香气四溢', level: '市级非遗', year: '2015年' },
            { name: '泉港猪脚饭制作技艺', description: '泉港传统美食，肉质鲜嫩，汤汁浓郁', level: '区级非遗', year: '2016年' }
          ]
        },
        {
          name: '石狮市',
          foods: [
            { name: '石狮牛肉羹制作技艺', description: '石狮特色小吃，牛肉鲜嫩，汤汁鲜美', level: '市级非遗', year: '2011年' },
            { name: '石狮甜粿制作技艺', description: '石狮传统糕点，口感软糯，香甜可口', level: '区级非遗', year: '2013年' }
          ]
        },
        {
          name: '晋江市',
          foods: [
            { name: '晋江深沪鱼丸制作技艺', description: '深沪特色小吃，鱼丸鲜嫩，汤汁鲜美', level: '省级非遗', year: '2009年' },
            { name: '晋江壶仔饭制作技艺', description: '晋江传统美食，米饭香糯，配料丰富', level: '市级非遗', year: '2012年' },
            { name: '晋江马鲛鱼羹制作技艺', description: '晋江特色小吃，鱼肉鲜嫩，口感爽滑', level: '区级非遗', year: '2014年' }
          ]
        },
        {
          name: '南安市',
          foods: [
            { name: '南安英都麻糍制作技艺', description: '英都传统糕点，口感软糯，香甜可口', level: '市级非遗', year: '2013年' },
            { name: '南安洪濑鸡爪制作技艺', description: '洪濑特色小吃，鸡爪软烂，香气四溢', level: '区级非遗', year: '2015年' }
          ]
        },
        {
          name: '惠安县',
          foods: [
            { name: '惠安崇武鱼卷制作技艺', description: '崇武特色美食，鱼卷鲜嫩，口感独特', level: '省级非遗', year: '2011年' },
            { name: '惠安萝卜糕制作技艺', description: '惠安传统小吃，口感软糯，香气扑鼻', level: '市级非遗', year: '2014年' }
          ]
        },
        {
          name: '安溪县',
          foods: [
            { name: '安溪湖头米粉制作技艺', description: '湖头特色美食，米粉细滑，口感独特', level: '省级非遗', year: '2007年' },
            { name: '安溪铁观音制作技艺', description: '国家级非物质文化遗产，乌龙茶制作技艺', level: '国家级非遗', year: '2008年' }
          ]
        },
        {
          name: '永春县',
          foods: [
            { name: '永春老醋制作技艺', description: '中国四大名醋之一，历史悠久，风味独特', level: '国家级非遗', year: '2011年' },
            { name: '永春榜舍龟制作技艺', description: '永春传统糕点，口感软糯，香甜可口', level: '省级非遗', year: '2009年' },
            { name: '永春白鸭汤制作技艺', description: '永春特色美食，鸭肉鲜嫩，汤清味美', level: '市级非遗', year: '2013年' }
          ]
        },
        {
          name: '德化县',
          foods: [
            { name: '德化黑鸡制作技艺', description: '德化特色美食，鸡肉鲜嫩，营养丰富', level: '市级非遗', year: '2015年' },
            { name: '德化米粉制作技艺', description: '德化传统美食，米粉细滑，口感独特', level: '区级非遗', year: '2016年' }
          ]
        }
      ]
    }
  },
  computed: {
    totalHeritage() {
      let total = 0
      this.districtData.forEach(district => {
        total += district.foods.length
      })
      return total
    },
    totalDistricts() {
      return this.districtData.length
    },
    maxDistrict() {
      let max = 0
      let name = ''
      this.districtData.forEach(district => {
        if (district.foods.length > max) {
          max = district.foods.length
          name = district.name
        }
      })
      return name
    }
  },
  methods: {
    handleSelect() {
      console.log('点击了导航栏')
    },
    getDistrictFoods(name) {
      const district = this.districtData.find(d => d.name === name)
      return district ? district.foods : []
    },
    showDistrictDetail(name) {
      const district = this.districtData.find(d => d.name === name)
      this.selectedDistrict = district
    },
    getLevelType(level) {
      if (level.includes('国家级')) return 'danger'
      if (level.includes('省级')) return 'warning'
      if (level.includes('市级')) return 'success'
      return 'info'
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
.heatmap-page {
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
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
}

.main-title {
  font-size: 36px;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.subtitle {
  font-size: 18px;
  margin: 0;
  opacity: 0.9;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
}

.map-card,
.detail-card,
.legend-card {
  margin-bottom: 30px;
  border-radius: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #E64340;
}

.card-header i {
  font-size: 24px;
  color: #E64340;
}

.card-header h2 {
  margin: 0;
  font-size: 22px;
  color: #333;
}

.map-container {
  width: 100%;
  min-height: 700px;
}

.map-background {
  position: relative;
  width: 100%;
  height: 700px;
  background: linear-gradient(135deg, #e8f4f8 0%, #d4e8f0 100%);
  border-radius: 8px;
  overflow: hidden;
}

.map-title {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  font-weight: bold;
  color: #333;
  z-index: 10;
}

.district-area {
  position: absolute;
  border: 2px solid #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.district-area:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 5;
}

.district-label {
  font-weight: bold;
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.food-tags-small {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  justify-content: center;
}

.food-tag-mini {
  font-size: 10px;
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 3px;
  color: #666;
  white-space: nowrap;
}

/* 各区县位置和颜色 */
.dehua {
  top: 30px;
  left: 35%;
  width: 18%;
  height: 140px;
  background: linear-gradient(135deg, #a8e6cf 0%, #88d8b0 100%);
}

.yongchun {
  top: 180px;
  left: 30%;
  width: 16%;
  height: 120px;
  background: linear-gradient(135deg, #88d8b0 0%, #6cc79a 100%);
}

.anxi {
  top: 190px;
  left: 10%;
  width: 18%;
  height: 130px;
  background: linear-gradient(135deg, #7fcdcd 0%, #5bb5b5 100%);
}

.nanan {
  top: 310px;
  left: 15%;
  width: 20%;
  height: 130px;
  background: linear-gradient(135deg, #87ceeb 0%, #5cb3d9 100%);
}

.luojiang {
  top: 260px;
  left: 45%;
  width: 12%;
  height: 90px;
  background: linear-gradient(135deg, #ffd3a5 0%, #ffb870 100%);
}

.huian {
  top: 200px;
  left: 60%;
  width: 16%;
  height: 140px;
  background: linear-gradient(135deg, #ffb6c1 0%, #ff8fa3 100%);
}

.quangang {
  top: 100px;
  left: 65%;
  width: 14%;
  height: 90px;
  background: linear-gradient(135deg, #dda0dd 0%, #d08fd0 100%);
}

.fengze {
  top: 350px;
  left: 42%;
  width: 10%;
  height: 80px;
  background: linear-gradient(135deg, #ffd700 0%, #ffcc00 100%);
  z-index: 2;
}

.chengxiang {
  top: 340px;
  left: 38%;
  width: 8%;
  height: 70px;
  background: linear-gradient(135deg, #90ee90 0%, #70d870 100%);
  z-index: 3;
}

.licheng {
  top: 360px;
  left: 35%;
  width: 9%;
  height: 70px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
  z-index: 3;
}

.jinjiang {
  top: 440px;
  left: 38%;
  width: 18%;
  height: 120px;
  background: linear-gradient(135deg, #87cefa 0%, #5db3e6 100%);
}

.shishi {
  top: 510px;
  left: 55%;
  width: 12%;
  height: 90px;
  background: linear-gradient(135deg, #98fb98 0%, #77e877 100%);
}

.district-food-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.food-detail-item {
  padding: 20px;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
  border-radius: 8px;
  border-left: 4px solid #E64340;
}

.food-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.food-header .food-name {
  color: #E64340;
  margin: 0;
  font-size: 18px;
}

.food-level-tags {
  display: flex;
  gap: 8px;
}

.food-detail-item .food-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.stats-row {
  margin-bottom: 30px;
}

.stat-card {
  text-align: center;
}

.stat-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.stat-icon {
  font-size: 48px;
  color: #E64340;
}

.stat-info h3 {
  margin: 0 0 5px 0;
  font-size: 28px;
  color: #333;
}

.stat-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.legend-content {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}
</style>
