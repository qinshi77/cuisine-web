<template>
  <div>
    <!--                   顶部导航栏                        -->
    <el-menu default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1" class="active" @click="$router.push('/')">首页</el-menu-item>
      <el-menu-item index="2" @click="$router.push({ path: '/community', query: { username: username }})">社区</el-menu-item>
      <el-menu-item index="3" @click="$router.push('/history')">美食文化</el-menu-item>
      <el-menu-item index="4" @click="$router.push('/coolTool')">美食工具</el-menu-item>
      <el-menu-item index="5" @click="$router.push('/heatmap')">热图</el-menu-item>
      <el-menu-item index="6" @click="$router.push('/games')">小游戏</el-menu-item>
      <el-menu-item index="7" @click="$router.push('/login')"><i class="el-icon-user" />登录</el-menu-item>
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
    <!-- <div class="icon-container">
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
    </div> -->

    <!--                   美食文章内容管理区域                        -->
    <div class="article-container">
      <h2 class="section-title">美食文章</h2>
      <div class="article-grid">
        <el-card v-for="(article, index) in articles" :key="index" class="article-card" shadow="hover" @click.native="openDetail(article)">
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

    <!-- 美食详情对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="90%"
      :close-on-click-modal="false"
      class="food-detail-dialog"
      top="20px"
    >
      <food-detail v-if="currentFood" :food-data="currentFood" />
    </el-dialog>
  </div>
</template>

<script>
import FoodDetail from './detailText/index.vue'

export default {
  name: 'Home',
  components: {
    FoodDetail
  },
  data() {
    return {
      username: '',
      imgs: [
        require('@/assets/lunbotu/泉州海蛎煎.jpg'),
        require('@/assets/lunbotu/泉州面线糊.jpg'),
        require('@/assets/lunbotu/泉州姜母鸭.jpg')
      ],
      articles: [
        {
          title: '泉州传统小吃：面线糊',
          description: '面线糊是泉州最具代表性的传统小吃之一，以其鲜美的汤底和细腻的面线而闻名。搭配各种配料，营养丰富，口感层次分明。',
          image: require('@/assets/lunbotu/泉州面线糊.jpg'),
          author: '美食达人',
          date: '2024-01-15',
          history: [
            '面线糊起源于福建省泉州市，是一道历史悠久的传统美食。据史料记载，面线糊的历史可以追溯到唐宋时期。',
            '相传，面线糊最初是为了满足渔民和商人快速进食的需求而发明的。由于泉州是海上丝绸之路的起点，往来商人和渔民众多，需要一种方便快捷又营养丰富的食物。',
            '经过几百年的发展，面线糊逐渐成为泉州人日常生活中不可或缺的一部分，尤其是早餐的首选。如今，面线糊已经成为泉州美食文化的重要代表之一。'
          ],
          steps: [
            '准备材料：细面线、猪骨汤、虾仁、瘦肉、香菇、鸡蛋、葱花等。',
            '将猪骨汤煮沸，加入切好的香菇和瘦肉，煮约10分钟。',
            '将面线掰成小段，放入汤中，用筷子轻轻搅拌，防止面线结块。',
            '加入虾仁，继续煮约2分钟，让虾仁熟透。',
            '将鸡蛋打散，慢慢倒入汤中，形成蛋花。',
            '加入适量的盐、鸡精、胡椒粉调味。',
            '关火，撒上葱花，一碗香喷喷的面线糊就做好了。'
          ],
          ingredients: ['细面线', '猪骨汤', '虾仁', '瘦肉', '香菇', '鸡蛋', '葱花', '盐', '鸡精', '胡椒粉'],
          tips: [
            '面线要掰成小段，这样更容易煮熟，也更容易食用。',
            '汤要保持微沸状态，不要用大火，以免面线煮烂。',
            '可以根据个人口味添加不同的配料，如大肠、鸭血、醋肉等。',
            '吃的时候可以搭配油条或菜粿，味道更佳。'
          ]
        },
        {
          title: '泉州土笋冻：海味珍馐',
          description: '土笋冻是泉州特色海味小吃，以沙虫为原料制作而成，口感Q弹，鲜美可口，是泉州人夏日消暑的佳品。',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          author: '海鲜专家',
          date: '2024-01-14',
          history: [
            '土笋冻是福建泉州的传统特色小吃，历史悠久。关于土笋冻的起源，有多种说法。',
            '一种说法是，土笋冻是由明代泉州著名学者何乔远发明的。据说他在海边游玩时，发现当地渔民食用沙虫后受到启发，经过多次尝试，最终发明了土笋冻。',
            '另一种说法是，土笋冻的历史可以追溯到更早的时期，早在唐代就已经有类似的食品。经过历代泉州人的不断改进，形成了今天独特的土笋冻。',
            '无论起源如何，土笋冻已经成为泉州美食文化中不可或缺的一部分，深受当地人和游客的喜爱。'
          ],
          steps: [
            '准备材料：新鲜沙虫、清水、盐等。',
            '将沙虫清洗干净，用清水浸泡约2小时，让沙虫吐尽泥沙。',
            '将沙虫放入锅中，加入适量清水，用大火煮沸。',
            '转小火继续煮约30分钟，期间不断搅拌，让沙虫的胶质充分溶解。',
            '加入适量盐调味。',
            '将煮好的汤汁倒入容器中，撇去浮沫。',
            '放置在阴凉处，让其自然冷却凝固，或者放入冰箱冷藏加速凝固。',
            '凝固后，切成小块，配上蘸料即可食用。'
          ],
          ingredients: ['新鲜沙虫', '清水', '盐', '蒜蓉', '酱油', '醋', '芥末', '香菜'],
          tips: [
            '一定要选用新鲜的沙虫，这样制作出来的土笋冻才会鲜美。',
            '清洗沙虫时要彻底，否则会影响口感。',
            '煮的时间要足够，让沙虫的胶质充分溶解。',
            '蘸料可以根据个人口味调配，蒜蓉酱油醋是经典搭配。',
            '土笋冻最好现做现吃，不要放置太久。'
          ]
        },
        {
          title: '泉州姜母鸭：滋补美味',
          description: '姜母鸭是泉州著名的滋补菜品，选用优质鸭肉和老姜，经过精心炖煮，肉质鲜嫩，汤汁浓郁，具有很好的滋补功效。',
          image: require('@/assets/lunbotu/泉州姜母鸭.jpg'),
          author: '烹饪大师',
          date: '2024-01-13',
          history: [
            '姜母鸭是福建泉州的传统名菜，历史悠久，是闽南地区秋冬季节进补的佳品。',
            '关于姜母鸭的起源，有一种说法是，它起源于古代泉州的宫廷御膳。后来流传到民间，经过不断改进，成为深受百姓喜爱的美食。',
            '另一种说法是，姜母鸭是由泉州当地的渔民发明的。渔民在海上捕鱼时，需要一种能够御寒保暖的食物，于是用老姜和鸭肉炖煮，逐渐形成了独特的姜母鸭。',
            '无论起源如何，姜母鸭以其独特的风味和滋补功效，成为泉州美食文化的重要组成部分。'
          ],
          steps: [
            '准备材料：鸭肉、老姜、米酒、酱油、冰糖、八角、桂皮、香叶等。',
            '将鸭肉洗净，切成大块，用开水焯一下，去除血水。',
            '老姜洗净，切成厚片，用刀背拍松。',
            '锅中放少量油，放入姜片，用小火慢慢煸炒，直到姜片金黄。',
            '加入焯好的鸭肉，翻炒至鸭肉表面微黄。',
            '加入米酒、酱油、冰糖、八角、桂皮、香叶等调料，翻炒均匀。',
            '加入适量清水，大火煮沸后转小火，炖煮约1.5-2小时，直到鸭肉软烂。',
            '收汁至浓稠，即可出锅。'
          ],
          ingredients: ['鸭肉', '老姜', '米酒', '酱油', '冰糖', '八角', '桂皮', '香叶', '盐', '鸡精'],
          tips: [
            '鸭肉最好选用土鸭，肉质更加鲜美。',
            '老姜要多放一些，这是姜母鸭的关键。',
            '米酒可以用黄酒代替，但最好用福建当地的米酒。',
            '炖煮时间要足够，让鸭肉充分入味。',
            '可以根据个人口味加入一些配菜，如香菇、金针菇等。'
          ]
        },
        {
          title: '泉州醋肉：酸甜可口',
          description: '醋肉是泉州传统小吃，以猪肉为主料，经过腌制和油炸，外酥内嫩，酸甜可口，是泉州人喜爱的街头美食。',
          image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          author: '小吃爱好者',
          date: '2024-01-12',
          history: [
            '醋肉是福建泉州的传统特色小吃，历史悠久，深受当地人和游客的喜爱。',
            '关于醋肉的起源，有一种说法是，它起源于清代。当时泉州有一位厨师，为了让肉类更容易保存，用醋和其他调料腌制肉类，然后油炸，结果发现这样制作出来的肉非常美味。',
            '另一种说法是，醋肉是由泉州的渔民发明的。渔民在捕鱼时，需要一种能够快速补充能量又不容易变质的食物，于是发明了醋肉。',
            '经过历代泉州人的不断改进，醋肉的制作工艺越来越完善，成为泉州街头最受欢迎的小吃之一。'
          ],
          steps: [
            '准备材料：猪肉、醋、酱油、蒜末、姜末、白糖、盐、鸡精、地瓜粉等。',
            '将猪肉洗净，切成薄片或小块。',
            '将醋、酱油、蒜末、姜末、白糖、盐、鸡精等调料混合，调成腌料。',
            '将切好的猪肉放入腌料中，腌制约30分钟，让肉充分入味。',
            '将腌制好的肉裹上一层地瓜粉。',
            '锅中放油，烧至七成热，将裹好粉的肉放入油中油炸。',
            '炸至金黄色捞出，沥干油分。',
            '可以直接食用，也可以配上番茄酱或甜辣酱。'
          ],
          ingredients: ['猪肉', '醋', '酱油', '蒜末', '姜末', '白糖', '盐', '鸡精', '地瓜粉', '食用油'],
          tips: [
            '猪肉最好选用里脊肉，肉质更加嫩滑。',
            '腌制时间要足够，让肉充分入味。',
            '地瓜粉要裹匀，但不要太厚。',
            '油温要控制好，不要太高也不要太低。',
            '可以炸两次，第一次炸至定型，第二次复炸至金黄酥脆。'
          ]
        },
        {
          title: '泉州烧肉粽：传统美味',
          description: '烧肉粽是泉州传统节日食品，以糯米、猪肉、蛋黄等为主要原料，经过精心包裹和蒸煮，口感丰富，香气四溢。',
          image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          author: '传统美食家',
          date: '2024-01-11',
          history: [
            '烧肉粽是福建泉州的传统美食，历史悠久，是端午节的传统食品之一。',
            '粽子的历史可以追溯到春秋战国时期，最初是为了纪念爱国诗人屈原。经过两千多年的发展，粽子的种类越来越多，各地都有自己的特色粽子。',
            '泉州烧肉粽是闽南粽子的代表，以其独特的风味和丰富的配料著称。它的特点是用料讲究，制作精细，口感香糯。',
            '如今，泉州烧肉粽不仅是端午节的传统食品，也成为泉州人日常生活中喜爱的美食之一，一年四季都可以品尝到。'
          ],
          steps: [
            '准备材料：糯米、猪肉、咸蛋黄、香菇、虾米、栗子、粽叶、粽绳等。',
            '将糯米洗净，用清水浸泡约4-6小时。',
            '猪肉洗净，切成块，用酱油、盐、糖、五香粉等调料腌制。',
            '香菇、虾米泡发，栗子去皮。',
            '粽叶洗净，用开水煮一下，使其变软。',
            '将粽叶折成漏斗形，先放一些糯米，然后放入猪肉、咸蛋黄、香菇、虾米、栗子等配料，再放一些糯米盖住配料。',
            '将粽叶包好，用粽绳捆紧。',
            '将包好的粽子放入锅中，加入足量的水，大火煮沸后转小火，煮约3-4小时。',
            '煮好后捞出，稍放凉即可食用。'
          ],
          ingredients: ['糯米', '猪肉', '咸蛋黄', '香菇', '虾米', '栗子', '粽叶', '粽绳', '酱油', '盐', '糖', '五香粉'],
          tips: [
            '糯米要浸泡足够的时间，这样煮出来的粽子才会软糯。',
            '猪肉最好选用五花肉，肥瘦相间，口感更好。',
            '包粽子时要注意不要装得太满，否则煮的时候容易破裂。',
            '煮粽子的水要足量，中途不要加水。',
            '可以配上甜辣酱或花生酱食用，味道更佳。'
          ]
        },
        {
          title: '泉州海蛎煎：鲜美海味',
          description: '海蛎煎是泉州特色海味小吃，以新鲜海蛎为主料，搭配鸡蛋和调料煎制而成，口感鲜美，营养丰富。',
          image: require('@/assets/lunbotu/泉州海蛎煎.jpg'),
          author: '海鲜达人',
          date: '2024-01-10',
          history: [
            '海蛎煎是福建泉州的传统特色小吃，历史悠久，是闽南地区最受欢迎的海味小吃之一。',
            '关于海蛎煎的起源，有一种说法是，它起源于泉州沿海的渔民。渔民在捕鱼之余，用新鲜的海蛎和地瓜粉煎制，作为家常菜。',
            '另一种说法是，海蛎煎的历史可以追溯到清代。当时泉州有一位厨师，将海蛎、地瓜粉和鸡蛋一起煎制，结果发现味道非常鲜美，于是流传开来。',
            '经过历代泉州人的不断改进，海蛎煎的制作工艺越来越完善，成为泉州街头最受欢迎的小吃之一。'
          ],
          steps: [
            '准备材料：新鲜海蛎、地瓜粉、鸡蛋、葱花、盐、胡椒粉、食用油等。',
            '将海蛎洗净，沥干水分。',
            '将地瓜粉加适量清水，调成糊状。',
            '将海蛎放入地瓜粉糊中，搅拌均匀。',
            '鸡蛋打散，加入葱花、盐、胡椒粉，搅拌均匀。',
            '锅中放油，烧热后将海蛎糊倒入锅中，摊成饼状。',
            '小火慢慢煎至底部金黄，然后翻面继续煎。',
            '将蛋液倒入锅中，均匀分布在海蛎煎上。',
            '继续煎至蛋液凝固，两面金黄即可出锅。',
            '可以配上甜辣酱或番茄酱食用。'
          ],
          ingredients: ['新鲜海蛎', '地瓜粉', '鸡蛋', '葱花', '盐', '胡椒粉', '食用油', '甜辣酱'],
          tips: [
            '海蛎一定要新鲜，这样才能保证味道鲜美。',
            '地瓜粉糊不要太稀也不要太稠。',
            '要用小火慢慢煎，这样才能煎得外酥里嫩。',
            '可以根据个人口味加入一些韭菜或大蒜叶。',
            '最好现煎现吃，不要放置太久，否则会影响口感。'
          ]
        }
      ],
      dialogVisible: false,
      currentFood: null
    }
  },
  mounted() {
    this.username = this.$route.query.username || ''
  },
  methods: {
    handleSelect() {
      console.log('点击了导航栏')
    },
    openDetail(article) {
      console.log('点击了详情按钮', article)
      this.currentFood = article
      this.dialogVisible = true
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
  cursor: pointer;
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

