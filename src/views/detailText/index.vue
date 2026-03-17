<template>
  <div class="food-detail">
    <!-- 返回按钮 -->
    <div class="back-btn">
      <el-button type="text" icon="el-icon-close" @click="handleClose">关闭</el-button>
    </div>

    <!-- 美食标题 -->
    <div class="detail-header">
      <h1 class="food-title">{{ foodData.title }}</h1>
      <div class="food-meta">
        <span class="author"><i class="el-icon-user" /> {{ foodData.author }}</span>
        <span class="date"><i class="el-icon-time" /> {{ foodData.date }}</span>
      </div>
    </div>

    <!-- 美食图片 -->
    <div class="food-image-wrapper">
      <el-image :src="foodData.image" fit="cover" class="food-banner-image" />
    </div>

    <!-- 主要内容 -->
    <div class="content-wrapper">
      <!-- 历史介绍 -->
      <el-card class="content-card" shadow="hover">
        <div class="card-header">
          <i class="el-icon-time" />
          <h2>历史介绍</h2>
        </div>
        <div class="card-content">
          <p v-for="(paragraph, index) in foodData.history" :key="index" class="history-paragraph">
            {{ paragraph }}
          </p>
        </div>
      </el-card>

      <!-- 制作过程 -->
      <el-card class="content-card" shadow="hover">
        <div class="card-header">
          <i class="el-icon-s-tools" />
          <h2>制作过程</h2>
        </div>
        <div class="card-content">
          <div class="steps-container">
            <div v-for="(step, index) in foodData.steps" :key="index" class="step-item">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-content">
                <p class="step-text">{{ step }}</p>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 食材清单 -->
      <el-card class="content-card" shadow="hover">
        <div class="card-header">
          <i class="el-icon-shopping-cart-2" />
          <h2>食材清单</h2>
        </div>
        <div class="card-content">
          <el-tag v-for="(ingredient, index) in foodData.ingredients" :key="index" class="ingredient-tag" type="warning" size="medium">
            {{ ingredient }}
          </el-tag>
        </div>
      </el-card>

      <!-- 小贴士 -->
      <el-card class="content-card" shadow="hover">
        <div class="card-header">
          <i class="el-icon-info" />
          <h2>小贴士</h2>
        </div>
        <div class="card-content">
          <div class="tips-container">
            <div v-for="(tip, index) in foodData.tips" :key="index" class="tip-item">
              <i class="el-icon-s-claim" />
              <span>{{ tip }}</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FoodDetail',
  props: {
    foodData: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.food-detail {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.back-btn {
  margin-bottom: 20px;
  text-align: right;
}

.back-btn .el-button {
  color: #E64340;
  font-size: 16px;
}

.detail-header {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.food-title {
  font-size: 36px;
  color: #333;
  margin: 0 0 15px 0;
}

.food-meta {
  display: flex;
  gap: 30px;
  color: #666;
  font-size: 14px;
}

.food-meta span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.food-image-wrapper {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.food-banner-image {
  width: 100%;
  height: 100%;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.content-card {
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

.card-content {
  padding: 10px 0;
}

.history-paragraph {
  line-height: 1.8;
  color: #555;
  font-size: 15px;
  margin-bottom: 15px;
  text-align: justify;
}

.steps-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 8px;
  border-left: 4px solid #E64340;
}

.step-number {
  width: 40px;
  height: 40px;
  background-color: #E64340;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-text {
  margin: 0;
  line-height: 1.7;
  color: #555;
  font-size: 15px;
}

.ingredient-tag {
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: 14px;
}

.tips-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 15px;
  background-color: #fff7e6;
  border-radius: 6px;
  color: #555;
  font-size: 15px;
  line-height: 1.6;
}

.tip-item i {
  color: #E64340;
  margin-top: 2px;
}
</style>
