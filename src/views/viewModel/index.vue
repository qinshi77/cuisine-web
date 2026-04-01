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
      <el-menu-item index="7" @click="$router.push('/user/edit')"><i class="el-icon-user" />{{ username }}</el-menu-item>
      <el-menu-item index="8" @click="handleLogout"><i class="el-icon-switch-button" />退出登录</el-menu-item>
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
          <div class="map-title">泉州非遗美食分布地图</div>
          <div class="map-desc">悬浮/点击标记查看特色非遗美食</div>
          <div id="quanzhouMap" ref="mapContainer" />
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

      <!-- 非遗美食统计图 -->
      <el-card class="charts-card" shadow="hover">
        <div class="card-header">
          <i class="el-icon-data-analysis" />
          <h2>非遗美食统计分析</h2>
        </div>
        <div class="charts-container">
          <div class="chart-item">
            <h3>各区县非遗美食数量</h3>
            <div id="districtChart" ref="districtChart" class="chart" />
          </div>
          <div class="chart-item">
            <h3>非遗美食级别分布</h3>
            <div id="levelChart" ref="levelChart" class="chart" />
          </div>
          <div class="chart-item">
            <h3>非遗美食年份分布</h3>
            <div id="yearChart" ref="yearChart" class="chart" />
          </div>
        </div>
      </el-card>
    </div>

    <!-- AI聊天小助手 -->
    <ai-chat-widget />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import AiChatWidget from '@/components/AiChatWidget.vue'

export default {
  name: 'HeatMap',
  components: {
    AiChatWidget
  },
  data() {
    return {
      username: localStorage.getItem('username') || '',
      selectedDistrict: null,
      districtData: [
        {
          name: '鲤城区',
          foods: [
            { name: '泉州面线糊制作技艺', description: '泉州最具代表性的传统小吃之一，历史悠久，制作工艺讲究', level: '省级非遗', year: '2007年' },
            { name: '泉州肉粽制作技艺', description: '端午节传统美食，用料讲究，制作精细', level: '市级非遗', year: '2008年' },
            { name: '泉州元宵丸制作技艺', description: '泉州元宵节传统食品，寓意团圆美满', level: '市级非遗', year: '2010年' },
            { name: '泉州春卷制作技艺', description: '又称润饼，清明节传统食品', level: '区级非遗', year: '2012年' }
          ],
          value: 4
        },
        {
          name: '丰泽区',
          foods: [
            { name: '泉州姜母鸭制作技艺', description: '传统滋补菜品，选用优质食材，具有很高的营养价值', level: '市级非遗', year: '2009年' },
            { name: '泉州炸醋肉制作技艺', description: '泉州传统小吃，外酥里嫩，酸甜可口', level: '区级非遗', year: '2011年' }
          ],
          value: 2
        },
        {
          name: '洛江区',
          foods: [
            { name: '洛江土笋冻制作技艺', description: '以沙虫为主料，口感Q弹，鲜美可口', level: '区级非遗', year: '2013年' },
            { name: '洛江九重粿制作技艺', description: '传统米制品，口感软糯，香甜可口', level: '区级非遗', year: '2014年' }
          ],
          value: 2
        },
        {
          name: '泉港区',
          foods: [
            { name: '泉港浮粿制作技艺', description: '泉港特色小吃，外酥里嫩，香气四溢', level: '市级非遗', year: '2015年' },
            { name: '泉港猪脚饭制作技艺', description: '泉港传统美食，肉质鲜嫩，汤汁浓郁', level: '区级非遗', year: '2016年' }
          ],
          value: 2
        },
        {
          name: '石狮市',
          foods: [
            { name: '石狮牛肉羹制作技艺', description: '石狮特色小吃，牛肉鲜嫩，汤汁鲜美', level: '市级非遗', year: '2011年' },
            { name: '石狮甜粿制作技艺', description: '石狮传统糕点，口感软糯，香甜可口', level: '区级非遗', year: '2013年' }
          ],
          value: 2
        },
        {
          name: '晋江市',
          foods: [
            { name: '晋江深沪鱼丸制作技艺', description: '深沪特色小吃，鱼丸鲜嫩，汤汁鲜美', level: '省级非遗', year: '2009年' },
            { name: '晋江壶仔饭制作技艺', description: '晋江传统美食，米饭香糯，配料丰富', level: '市级非遗', year: '2012年' },
            { name: '晋江马鲛鱼羹制作技艺', description: '晋江特色小吃，鱼肉鲜嫩，口感爽滑', level: '区级非遗', year: '2014年' }
          ],
          value: 3
        },
        {
          name: '南安市',
          foods: [
            { name: '南安英都麻糍制作技艺', description: '英都传统糕点，口感软糯，香甜可口', level: '市级非遗', year: '2013年' },
            { name: '南安洪濑鸡爪制作技艺', description: '洪濑特色小吃，鸡爪软烂，香气四溢', level: '区级非遗', year: '2015年' }
          ],
          value: 2
        },
        {
          name: '惠安县',
          foods: [
            { name: '惠安崇武鱼卷制作技艺', description: '崇武特色美食，鱼卷鲜嫩，口感独特', level: '省级非遗', year: '2011年' },
            { name: '惠安萝卜糕制作技艺', description: '惠安传统小吃，口感软糯，香气扑鼻', level: '市级非遗', year: '2014年' }
          ],
          value: 2
        },
        {
          name: '安溪县',
          foods: [
            { name: '安溪湖头米粉制作技艺', description: '湖头特色美食，米粉细滑，口感独特', level: '省级非遗', year: '2007年' },
            { name: '安溪铁观音制作技艺', description: '国家级非物质文化遗产，乌龙茶制作技艺', level: '国家级非遗', year: '2008年' }
          ],
          value: 2
        },
        {
          name: '永春县',
          foods: [
            { name: '永春老醋制作技艺', description: '中国四大名醋之一，历史悠久，风味独特', level: '国家级非遗', year: '2011年' },
            { name: '永春榜舍龟制作技艺', description: '永春传统糕点，口感软糯，香甜可口', level: '省级非遗', year: '2009年' },
            { name: '永春白鸭汤制作技艺', description: '永春特色美食，鸭肉鲜嫩，汤清味美', level: '市级非遗', year: '2013年' }
          ],
          value: 3
        },
        {
          name: '德化县',
          foods: [
            { name: '德化黑鸡制作技艺', description: '德化特色美食，鸡肉鲜嫩，营养丰富', level: '市级非遗', year: '2015年' },
            { name: '德化米粉制作技艺', description: '德化传统美食，米粉细滑，口感独特', level: '区级非遗', year: '2016年' }
          ],
          value: 2
        }
      ],
      mapChart: null,
      districtChart: null,
      levelChart: null,
      yearChart: null
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
  mounted() {
    this.initMap()
    this.initCharts()
  },
  beforeUnmount() {
    if (this.mapChart) {
      this.mapChart.dispose()
    }
    if (this.districtChart) {
      this.districtChart.dispose()
    }
    if (this.levelChart) {
      this.levelChart.dispose()
    }
    if (this.yearChart) {
      this.yearChart.dispose()
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
    },
    initMap() {
      // 泉州非遗美食数据
      const foodData = [
        { name: '鲤城区', value: [118.58, 24.93], food: '面线糊、润饼、土笋冻、元宵圆' },
        { name: '丰泽区', value: [118.63, 24.90], food: '姜母鸭、肉粽、壶仔饭' },
        { name: '洛江区', value: [118.67, 24.92], food: '土笋冻、九重粿' },
        { name: '泉港区', value: [118.92, 25.13], food: '浮粿、口酥' },
        { name: '石狮市', value: [118.67, 24.73], food: '石狮甜粿、牛肉羹' },
        { name: '晋江市', value: [118.52, 24.75], food: '安海土笋冻、深沪鱼丸' },
        { name: '南安市', value: [118.40, 24.97], food: '洪濑鸡爪、英都麻糍' },
        { name: '惠安县', value: [118.78, 25.02], food: '崇武鱼卷、洛阳猪蹄' },
        { name: '安溪县', value: [118.18, 25.07], food: '湖头米粉、铁观音茶点' },
        { name: '永春县', value: [118.32, 25.33], food: '永春老醋美食、白鸭汤' },
        { name: '德化县', value: [118.23, 25.48], food: '德化黑鸡、米粉汤' }
      ]

      // 初始化地图
      this.mapChart = echarts.init(this.$refs.mapContainer)

      // 核心修复：手动加载 + 注册地图
      fetch('https://geo.datav.aliyun.com/areas_v3/bound/350500_full.json')
        .then(res => res.json())
        .then(mapData => {
          // 注册泉州地图
          echarts.registerMap('quanzhou', mapData)

          // 配置项
          const option = {
            backgroundColor: '#ffffff',
            tooltip: {
              trigger: 'item',
              padding: 10,
              backgroundColor: 'rgba(255,255,255,0.98)',
              borderColor: '#a83228',
              borderWidth: 2,
              formatter: params => {
                if (params.seriesType === 'scatter') {
                  return `
                    <div style="min-width:180px">
                      <div style="font-size:16px; font-weight:bold; color:#a83228;">${params.name}</div>
                      <div style="margin-top:5px; border-top:1px solid #eee; padding-top:5px">
                        非遗美食：<br>${params.data.food}
                      </div>
                    </div>
                  `
                } else if (params.seriesType === 'map') {
                  const district = this.districtData.find(d => d.name === params.name)
                  if (district) {
                    let html = `<div style="font-weight:bold;margin-bottom:5px;">${district.name}</div>`
                    html += '<div style="margin-top:5px;"><strong>代表性美食:</strong></div>'
                    district.foods.slice(0, 3).forEach(food => {
                      html += `<div style="margin-left:10px;">• ${food.name.split('制作技艺')[0]}</div>`
                    })
                    return html
                  }
                }
                return params.name
              }
            },
            geo: {
              map: 'quanzhou',
              roam: false,
              zoom: 1.2,
              itemStyle: {
                areaColor: '#f6eee0',
                borderColor: '#d4b598'
              },
              emphasis: {
                itemStyle: {
                  areaColor: '#f8d9b8',
                  borderColor: '#a83228',
                  borderWidth: 2
                }
              }
            },
            series: [{
              type: 'scatter',
              coordinateSystem: 'geo',
              data: foodData,
              symbol: 'pin',
              symbolSize: 16,
              itemStyle: {
                color: '#a83228',
                shadowBlur: 10
              },
              label: {
                show: true,
                formatter: '{b}',
                fontSize: 12,
                color: '#a83228'
              },
              emphasis: {
                symbolSize: 24,
                itemStyle: {
                  color: '#c93730'
                }
              }
            }]
          }

          // 渲染
          this.mapChart.setOption(option)

          // 点击事件
          this.mapChart.on('click', (params) => {
            if (params.seriesType === 'map') {
              this.showDistrictDetail(params.name)
            } else if (params.seriesType === 'scatter') {
              this.showDistrictDetail(params.name)
            }
          })
        })
        .catch(error => {
          console.error('加载地图数据失败:', error)
          // 加载失败时使用模拟数据
          this.initMapWithMockData()
        })

      // 响应式调整
      window.addEventListener('resize', () => {
        if (this.mapChart) {
          this.mapChart.resize()
        }
      })
    },
    initMapWithMockData() {
      // 模拟泉州地图数据
      const geoJson = {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'properties': { 'name': '鲤城区' },
            'geometry': {
              'type': 'Polygon',
              'coordinates': [[[118.65, 24.86], [118.70, 24.86], [118.70, 24.83], [118.65, 24.83], [118.65, 24.86]]]
            }
          },
          {
            'type': 'Feature',
            'properties': { 'name': '丰泽区' },
            'geometry': {
              'type': 'Polygon',
              'coordinates': [[[118.70, 24.88], [118.78, 24.88], [118.78, 24.84], [118.70, 24.84], [118.70, 24.88]]]
            }
          },
          {
            'type': 'Feature',
            'properties': { 'name': '洛江区' },
            'geometry': {
              'type': 'Polygon',
              'coordinates': [[[118.68, 24.90], [118.75, 24.90], [118.75, 24.86], [118.68, 24.86], [118.68, 24.90]]]
            }
          },
          {
            'type': 'Feature',
            'properties': { 'name': '泉港区' },
            'geometry': {
              'type': 'Polygon',
              'coordinates': [[[118.90, 25.10], [119.00, 25.10], [119.00, 25.00], [118.90, 25.00], [118.90, 25.10]]]
            }
          },
          {
            'type': 'Feature',
            'properties': { 'name': '石狮市' },
            'geometry': {
              'type': 'Polygon',
              'coordinates': [[[118.75, 24.65], [118.85, 24.65], [118.85, 24.55], [118.75, 24.55], [118.75, 24.65]]]
            }
          },
          {
            'type': 'Feature',
            'properties': { 'name': '晋江市' },
            'geometry': {
              'type': 'Polygon',
              'coordinates': [[[118.60, 24.75], [118.85, 24.75], [118.85, 24.55], [118.60, 24.55], [118.60, 24.75]]]
            }
          },
          {
            'type': 'Feature',
            'properties': { 'name': '南安市' },
            'geometry': {
              'type': 'Polygon',
              'coordinates': [[[118.20, 24.90], [118.50, 24.90], [118.50, 24.60], [118.20, 24.60], [118.20, 24.90]]]
            }
          },
          {
            'type': 'Feature',
            'properties': { 'name': '惠安县' },
            'geometry': {
              'type': 'Polygon',
              'coordinates': [[[118.75, 24.95], [119.00, 24.95], [119.00, 24.75], [118.75, 24.75], [118.75, 24.95]]]
            }
          },
          {
            'type': 'Feature',
            'properties': { 'name': '安溪县' },
            'geometry': {
              'type': 'Polygon',
              'coordinates': [[[117.90, 25.20], [118.20, 25.20], [118.20, 24.80], [117.90, 24.80], [117.90, 25.20]]]
            }
          },
          {
            'type': 'Feature',
            'properties': { 'name': '永春县' },
            'geometry': {
              'type': 'Polygon',
              'coordinates': [[[118.10, 25.30], [118.40, 25.30], [118.40, 25.00], [118.10, 25.00], [118.10, 25.30]]]
            }
          },
          {
            'type': 'Feature',
            'properties': { 'name': '德化县' },
            'geometry': {
              'type': 'Polygon',
              'coordinates': [[[117.70, 25.50], [118.00, 25.50], [118.00, 25.20], [117.70, 25.20], [117.70, 25.50]]]
            }
          }
        ]
      }

      // 注册地图
      echarts.registerMap('quanzhou', geoJson)

      // 泉州非遗美食数据
      const foodData = [
        { name: '鲤城区', value: [118.675, 24.845], food: '面线糊、润饼、土笋冻、元宵圆' },
        { name: '丰泽区', value: [118.74, 24.86], food: '姜母鸭、肉粽、壶仔饭' },
        { name: '洛江区', value: [118.715, 24.88], food: '土笋冻、九重粿' },
        { name: '泉港区', value: [118.95, 25.05], food: '浮粿、口酥' },
        { name: '石狮市', value: [118.8, 24.6], food: '石狮甜粿、牛肉羹' },
        { name: '晋江市', value: [118.725, 24.65], food: '安海土笋冻、深沪鱼丸' },
        { name: '南安市', value: [118.35, 24.75], food: '洪濑鸡爪、英都麻糍' },
        { name: '惠安县', value: [118.875, 24.85], food: '崇武鱼卷、洛阳猪蹄' },
        { name: '安溪县', value: [118.05, 25.0], food: '湖头米粉、铁观音茶点' },
        { name: '永春县', value: [118.25, 25.15], food: '永春老醋美食、白鸭汤' },
        { name: '德化县', value: [117.85, 25.35], food: '德化黑鸡、米粉汤' }
      ]

      // 配置项
      const option = {
        backgroundColor: '#ffffff',
        tooltip: {
          trigger: 'item',
          padding: 10,
          backgroundColor: 'rgba(255,255,255,0.98)',
          borderColor: '#a83228',
          borderWidth: 2,
          formatter: params => {
            if (params.seriesType === 'scatter') {
              return `
                <div style="min-width:180px">
                  <div style="font-size:16px; font-weight:bold; color:#a83228;">${params.name}</div>
                  <div style="margin-top:5px; border-top:1px solid #eee; padding-top:5px">
                    非遗美食：<br>${params.data.food}
                  </div>
                </div>
              `
            } else if (params.seriesType === 'map') {
              const district = this.districtData.find(d => d.name === params.name)
              if (district) {
                let html = `<div style="font-weight:bold;margin-bottom:5px;">${district.name}</div>`
                html += '<div style="margin-top:5px;"><strong>代表性美食:</strong></div>'
                district.foods.slice(0, 3).forEach(food => {
                  html += `<div style="margin-left:10px;">• ${food.name.split('制作技艺')[0]}</div>`
                })
                return html
              }
            }
            return params.name
          }
        },
        geo: {
          map: 'quanzhou',
          roam: false,
          zoom: 1.2,
          itemStyle: {
            areaColor: '#f6eee0',
            borderColor: '#d4b598'
          },
          emphasis: {
            itemStyle: {
              areaColor: '#f8d9b8',
              borderColor: '#a83228',
              borderWidth: 2
            }
          }
        },
        series: [{
          type: 'scatter',
          coordinateSystem: 'geo',
          data: foodData,
          symbol: 'pin',
          symbolSize: 16,
          itemStyle: {
            color: '#a83228',
            shadowBlur: 10
          },
          label: {
            show: true,
            formatter: '{b}',
            fontSize: 12,
            color: '#a83228'
          },
          emphasis: {
            symbolSize: 24,
            itemStyle: {
              color: '#c93730'
            }
          }
        }]
      }

      // 渲染
      this.mapChart.setOption(option)

      // 点击事件
      this.mapChart.on('click', (params) => {
        if (params.seriesType === 'map') {
          this.showDistrictDetail(params.name)
        } else if (params.seriesType === 'scatter') {
          this.showDistrictDetail(params.name)
        }
      })
    },
    // 初始化统计图表
    initCharts() {
      this.initDistrictChart()
      this.initLevelChart()
      this.initYearChart()

      // 响应式调整
      window.addEventListener('resize', () => {
        if (this.districtChart) this.districtChart.resize()
        if (this.levelChart) this.levelChart.resize()
        if (this.yearChart) this.yearChart.resize()
      })
    },
    // 初始化各区县非遗美食数量柱状图
    initDistrictChart() {
      this.districtChart = echarts.init(this.$refs.districtChart)

      const data = this.districtData.map(district => ({
        name: district.name,
        value: district.foods.length
      }))

      const option = {
        backgroundColor: '#ffffff',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b}: {c}项'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.name),
          axisLabel: {
            interval: 0,
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          name: '数量',
          minInterval: 1
        },
        series: [{
          name: '非遗美食数量',
          type: 'bar',
          data: data.map(item => item.value),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#a83228' },
              { offset: 1, color: '#c93730' }
            ])
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#c93730' },
                { offset: 1, color: '#e64340' }
              ])
            }
          }
        }]
      }

      this.districtChart.setOption(option)
    },
    // 初始化非遗美食级别分布饼图
    initLevelChart() {
      this.levelChart = echarts.init(this.$refs.levelChart)

      // 统计各级别非遗美食数量
      const levelData = {
        '国家级非遗': 0,
        '省级非遗': 0,
        '市级非遗': 0,
        '区级非遗': 0
      }

      this.districtData.forEach(district => {
        district.foods.forEach(food => {
          levelData[food.level]++
        })
      })

      const data = Object.entries(levelData).map(([name, value]) => ({
        name,
        value
      }))

      const option = {
        backgroundColor: '#ffffff',
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}项 ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: Object.keys(levelData)
        },
        series: [{
          name: '非遗级别',
          type: 'pie',
          radius: '60%',
          center: ['60%', '50%'],
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {d}%'
          }
        }]
      }

      this.levelChart.setOption(option)
    },
    // 初始化非遗美食年份分布折线图
    initYearChart() {
      this.yearChart = echarts.init(this.$refs.yearChart)

      // 统计各年份非遗美食数量
      const yearData = {}

      this.districtData.forEach(district => {
        district.foods.forEach(food => {
          const year = food.year.replace('年', '')
          if (!yearData[year]) {
            yearData[year] = 0
          }
          yearData[year]++
        })
      })

      // 按年份排序
      const sortedYears = Object.keys(yearData).sort()
      const data = sortedYears.map(year => yearData[year])

      const option = {
        backgroundColor: '#ffffff',
        tooltip: {
          trigger: 'axis',
          formatter: '{b}年: {c}项'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: sortedYears,
          name: '年份'
        },
        yAxis: {
          type: 'value',
          name: '数量',
          minInterval: 1
        },
        series: [{
          name: '非遗美食数量',
          type: 'line',
          data: data,
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            width: 3,
            color: '#a83228'
          },
          itemStyle: {
            color: '#a83228'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(168, 50, 40, 0.3)' },
              { offset: 1, color: 'rgba(168, 50, 40, 0.1)' }
            ])
          }
        }]
      }

      this.yearChart.setOption(option)
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
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  background: #fff;
  padding: 15px;
  overflow: hidden;
}

.map-title {
  text-align: center;
  font-size: 28px;
  color: #a83228;
  margin-bottom: 10px;
  font-weight: bold;
}

.map-desc {
  text-align: center;
  color: #7a514d;
  margin-bottom: 20px;
  font-size: 15px;
}

#quanzhouMap {
  width: 100%;
  height: 680px;
  border-radius: 16px;
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

.charts-card {
  margin-bottom: 30px;
  border-radius: 8px;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.chart-item {
  background-color: #fafafa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chart-item h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
  text-align: center;
}

.chart {
  width: 100%;
  height: 300px;
  border-radius: 8px;
}
</style>
