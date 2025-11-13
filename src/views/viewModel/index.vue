<template>
  <div class="fujian-cuisine-map">
    <!-- 标题栏 -->
    <div class="header">
      <h1>泉州市非物质文化遗产美食地图</h1>
      <p class="subtitle">探索泉州市的传统美食文化，感受舌尖上的非遗魅力</p>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 地图区域 -->
      <div class="map-section">
        <div class="map-title">泉州市非物质文化遗产美食分布</div>
        <!-- 热力图容器 -->
        <div id="heatmapContainer" ref="heatmapContainer" />
      </div>

      <!-- 右侧美食介绍区域 -->
      <div class="cuisine-intro">
        <h3>非遗美食介绍</h3>
        <div class="cuisine-list">
          <div
            v-for="food in cuisineData"
            :key="food.id"
            class="cuisine-item"
            :class="{ active: selectedFood && selectedFood.name === food.name }"
            @click="showFoodDetail(food)"
          >
            <div class="cuisine-icon">🍜</div>
            <div class="cuisine-name">{{ food.name }}</div>
            <div class="cuisine-desc">{{ food.shortDesc }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="showDetail" class="detail-popup" @click.self="handleClose">
      <div class="popup-content">
        <div class="popup-header">
          <h3>{{ selectedFood.name }}</h3>
          <button class="close-btn" @click="handleClose">×</button>
        </div>
        <div class="popup-body">
          <div class="detail-info">
            <p><strong>非遗等级：</strong>{{ getLevelText(selectedFood.level) }}</p>
            <p><strong>分布区域：</strong>{{ selectedFood.location }}</p>
            <p><strong>简介：</strong>{{ selectedFood.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import * as echarts from 'echarts'

export default {
  name: 'QuanzhouCuisineMap',
  data() {
    return {
      chart: null,
      showDetail: false,
      selectedFood: null,
      // 泉州市非遗美食数据
      cuisineData: [
        {
          id: 1,
          name: '泉州肉粽',
          longitude: 118.58,
          latitude: 24.91,
          value: 100,
          level: 'national',
          location: '泉州市区及周边',
          description: '泉州肉粽是福建泉州传统的地方风味小吃，其选料讲究，配料多样，制作精细，历史悠久，味道香甜，油润不腻，色泽红黄闪亮。',
          shortDesc: '泉州传统风味小吃，配料多样，制作精细，味道香甜，油润不腻。'
        },
        {
          id: 2,
          name: '土笋冻',
          longitude: 118.59,
          latitude: 24.92,
          value: 80,
          level: 'provincial',
          location: '泉州市区、晋江市',
          description: '土笋冻是发源于福建泉州的一种特色传统小吃，由特有产品土笋（沙虫）加工而成，具有滋阴降火、清肺补虚和养颜美容的功效。',
          shortDesc: '特色传统小吃，由沙虫加工而成，具有滋阴降火等功效。'
        },
        {
          id: 3,
          name: '面线糊',
          longitude: 118.57,
          latitude: 24.90,
          value: 75,
          level: 'provincial',
          location: '泉州市区',
          description: '面线糊是泉州人最喜爱的早餐之一，以细面线、地瓜粉为主要原料，配以各种海鲜、肉类，味道鲜美，口感顺滑。',
          shortDesc: '泉州人最喜爱的早餐，配以各种海鲜、肉类，味道鲜美。'
        },
        {
          id: 4,
          name: '四果汤',
          longitude: 118.58,
          latitude: 24.89,
          value: 65,
          level: 'city',
          location: '泉州市区、石狮市',
          description: '四果汤是福建泉州夏季常见的清凉饮品，由薏米、绿豆、红豆、莲子等食材炖煮而成，加入冰糖水，口感清甜爽口。',
          shortDesc: '夏季清凉饮品，清甜爽口，消暑解渴。'
        },
        {
          id: 5,
          name: '姜母鸭',
          longitude: 118.60,
          latitude: 24.93,
          value: 55,
          level: 'provincial',
          location: '泉州市区、安溪县',
          description: '姜母鸭是闽南地区的传统名菜，以红面番鸭为主料，加入老姜、米酒等炖煮而成，具有滋阴降火、温补身体的功效。',
          shortDesc: '传统名菜，滋阴降火、温补身体。'
        },
        {
          id: 6,
          name: '海蛎煎',
          longitude: 118.55,
          latitude: 24.90,
          value: 50,
          level: 'city',
          location: '泉州市区、泉港区',
          description: '海蛎煎是闽南地区传统小吃，以新鲜海蛎、地瓜粉、鸡蛋为主要原料煎制而成，外酥里嫩，鲜味十足。',
          shortDesc: '传统小吃，外酥里嫩，鲜味十足。'
        },
        {
          id: 7,
          name: '醋肉',
          longitude: 118.56,
          latitude: 24.91,
          value: 60,
          level: 'city',
          location: '泉州市区、南安市',
          description: '醋肉是泉州地区特色小吃，以猪里脊肉为主料，用醋、糖、酱油等腌制后炸制而成，外酥里嫩，酸甜可口。',
          shortDesc: '特色小吃，外酥里嫩，酸甜可口。'
        },
        {
          id: 8,
          name: '卤面',
          longitude: 118.61,
          latitude: 24.92,
          value: 45,
          level: 'city',
          location: '泉州市区、惠安县',
          description: '泉州卤面是当地特色面食，以面条、香菇、猪肉、虾干等为原料，用骨汤熬制，味道浓郁，营养丰富。',
          shortDesc: '当地特色面食，味道浓郁，营养丰富。'
        },
        {
          id: 9,
          name: '芋泥',
          longitude: 118.57,
          latitude: 24.88,
          value: 40,
          level: 'city',
          location: '泉州市区、永春县',
          description: '芋泥是闽南地区传统甜点，以槟榔芋为原料，蒸制后压成泥状，加入猪油、糖等炒制而成，口感绵密香甜。',
          shortDesc: '传统甜点，口感绵密香甜。'
        },
        {
          id: 10,
          name: '榜舍龟',
          longitude: 118.59,
          latitude: 24.87,
          value: 35,
          level: 'city',
          location: '安海镇',
          description: '榜舍龟是泉州安海地区传统小吃，以糯米粉为皮，红豆沙为馅，形似龟状，象征长寿吉祥，味道甜美。',
          shortDesc: '安海地区传统小吃，象征长寿吉祥。'
        }
      ]
    }
  },
  methods: {
    // 获取非遗等级文本
    getLevelText(level) {
      const levelMap = {
        national: '国家级',
        provincial: '省级',
        city: '市级'
      }
      return levelMap[level] || '未知级别'
    },

    // 显示美食详情
    showFoodDetail(food) {
      this.selectedFood = food
      this.showDetail = true
    },
    // 关闭详情弹窗
    handleClose() {
      this.showDetail = false
      this.selectedFood = null
    }
  }
}
</script>

<style scoped>
.fujian-cuisine-map {
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
  box-sizing: border-box;
}

.header {
  background-color: #e74c3c;
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: bold;
}

.subtitle {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.main-content {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  min-height: 600px;
}

/* 共享卡片样式 */
.card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.map-section {
  flex: 2;
  position: relative;
  /* 应用共享卡片样式 */
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.map-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
}

#heatmapContainer {
  width: 100%;
  height: 500px;
}

.cuisine-intro {
  flex: 1;
  max-height: 600px;
  overflow-y: auto;
  /* 应用共享卡片样式 */
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.cuisine-intro h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 20px;
  color: #333;
  border-bottom: 2px solid #e74c3c;
  padding-bottom: 10px;
}

.cuisine-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cuisine-item {
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.cuisine-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #e74c3c;
}

.cuisine-item.active {
  background-color: #fef3f2;
  border-color: #e74c3c;
}

.cuisine-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.cuisine-name {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 5px;
  color: #333;
}

.cuisine-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

/* 详情弹窗样式 */
.detail-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.popup-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background-color: #f5f5f5;
  color: #333;
}

.popup-body {
  padding: 20px;
}

.detail-info p {
  margin-bottom: 15px;
  line-height: 1.6;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .map-section, .cuisine-intro {
    flex: none;
  }

  #heatmapContainer {
    height: 350px;
  }
}
</style>
