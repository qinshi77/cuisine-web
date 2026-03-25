<template>
  <div class="games-container">
    <el-menu default-active="6" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1" @click="$router.push('/')">首页</el-menu-item>
      <el-menu-item index="2" @click="$router.push('/community')">社区</el-menu-item>
      <el-menu-item index="3" @click="$router.push('/history')">美食文化</el-menu-item>
      <el-menu-item index="4" @click="$router.push('/coolTool')">美食工具</el-menu-item>
      <el-menu-item index="5" @click="$router.push('/heatmap')">热图</el-menu-item>
      <el-menu-item index="6" class="active" @click="$router.push('/games')">小游戏</el-menu-item>
      <el-menu-item index="7" @click="handleLogout"><i class="el-icon-user" />退出登录</el-menu-item>
    </el-menu>

    <div class="games-content">
      <h1 class="page-title">🎮 泉州非遗美食小游戏</h1>

      <div v-if="currentGame === null" class="game-selection">
        <h2 class="selection-title">选择游戏</h2>
        <div class="game-cards">
          <el-card class="game-card" shadow="hover" @click.native="startGame('match')">
            <div class="game-icon">🥬</div>
            <h3>食材配对</h3>
            <p>将美食与其主要食材配对</p>
            <el-tag type="warning">入门</el-tag>
          </el-card>

          <el-card class="game-card" shadow="hover" @click.native="startGame('sort')">
            <div class="game-icon">📋</div>
            <h3>步骤排序</h3>
            <p>按正确顺序排列美食制作步骤</p>
            <el-tag type="success">进阶</el-tag>
          </el-card>

          <el-card class="game-card" shadow="hover" @click.native="startGame('quiz')">
            <div class="game-icon">❓</div>
            <h3>知识问答</h3>
            <p>测试你对泉州非遗美食的了解</p>
            <el-tag type="danger">挑战</el-tag>
          </el-card>

          <el-card class="game-card" shadow="hover" @click.native="startGame('memory')">
            <div class="game-icon">🧠</div>
            <h3>记忆配对</h3>
            <p>翻转卡片，找到相同的美食图片</p>
            <el-tag type="primary">休闲</el-tag>
          </el-card>

          <el-card class="game-card" shadow="hover" @click.native="startGame('puzzle')">
            <div class="game-icon">🧩</div>
            <h3>美食拼图</h3>
            <p>将打乱的美食图片拼回原样</p>
            <el-tag type="info">创意</el-tag>
          </el-card>

          <el-card class="game-card" shadow="hover" @click.native="startGame('timer')">
            <div class="game-icon">⏱️</div>
            <h3>时间挑战</h3>
            <p>在限定时间内完成美食相关任务</p>
            <el-tag type="warning">刺激</el-tag>
          </el-card>
        </div>
      </div>

      <div v-else class="game-area">
        <div class="game-header">
          <el-button icon="el-icon-arrow-left" @click="backToSelection">返回</el-button>
          <h2>{{ gameTitle }}</h2>
          <div class="score-display">
            <span>得分: {{ score }}</span>
            <span>关卡: {{ currentLevel + 1 }}/{{ totalLevels }}</span>
          </div>
        </div>

        <div v-if="currentGame === 'match'" class="match-game">
          <div class="food-display">
            <el-card class="food-card">
              <el-image :src="currentMatchFood.image" fit="cover" class="food-image" />
              <h3>{{ currentMatchFood.title }}</h3>
            </el-card>
          </div>
          <p class="hint">请选择这道美食的主要食材（可多选）</p>
          <div class="ingredients-grid">
            <el-tag
              v-for="(ingredient, index) in matchIngredients"
              :key="index"
              :class="{ 'selected': selectedIngredients.includes(index) }"
              size="medium"
              @click="toggleIngredient(index)"
            >
              {{ ingredient }}
            </el-tag>
          </div>
          <div class="game-buttons">
            <el-button type="primary" :disabled="selectedIngredients.length === 0" @click="checkMatch">
              确认答案
            </el-button>
          </div>
        </div>

        <div v-if="currentGame === 'sort'" class="sort-game">
          <div class="food-display">
            <el-card class="food-card">
              <el-image :src="currentSortFood.image" fit="cover" class="food-image" />
              <h3>{{ currentSortFood.title }}</h3>
            </el-card>
          </div>
          <p class="hint">拖拽下面的步骤，按正确的制作顺序排列</p>
          <div ref="stepsContainer" class="steps-container">
            <div
              v-for="(step, index) in sortedSteps"
              :key="step.id"
              class="step-item"
              draggable="true"
              @dragstart="onDragStart($event, index)"
              @dragover="onDragOver($event)"
              @drop="onDrop($event, index)"
              @dragend="onDragEnd"
            >
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-text">{{ step.text }}</div>
            </div>
          </div>
          <div class="game-buttons">
            <el-button type="primary" @click="checkSort">确认顺序</el-button>
          </div>
        </div>

        <div v-if="currentGame === 'quiz'" class="quiz-game">
          <div class="quiz-card">
            <h3>{{ currentQuiz.question }}</h3>
            <div class="quiz-options">
              <el-radio-group v-model="selectedAnswer">
                <el-radio
                  v-for="(option, index) in currentQuiz.options"
                  :key="index"
                  :label="index"
                  class="quiz-option"
                >
                  {{ option }}
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="game-buttons">
            <el-button type="primary" :disabled="selectedAnswer === null" @click="checkQuiz">
              确认答案
            </el-button>
          </div>
        </div>

        <div v-if="currentGame === 'memory'" class="memory-game">
          <p class="hint">翻转卡片，找到相同的美食图片</p>
          <div class="memory-cards">
            <div
              v-for="card in memoryCards"
              :key="card.id"
              :class="['memory-card', { 'flipped': card.flipped, 'matched': card.matched }]"
              @click="flipCard(card)"
            >
              <div class="card-inner">
                <div class="card-front">?</div>
                <div class="card-back">
                  <el-image :src="card.image" fit="cover" class="card-image" />
                </div>
              </div>
            </div>
          </div>
          <div class="game-info">
            <span>已配对: {{ matchedPairs }}/{{ totalPairs }}</span>
            <span>得分: {{ score }}</span>
          </div>
        </div>

        <div v-if="currentGame === 'puzzle'" class="puzzle-game">
          <div class="food-display">
            <el-card class="food-card">
              <el-image :src="currentPuzzle.image" fit="cover" class="food-image" />
              <h3>{{ currentPuzzle.title }}</h3>
            </el-card>
          </div>
          <p class="hint">点击空白块旁边的拼图块进行移动，将图片拼回原样</p>
          <div class="puzzle-board">
            <div
              v-for="piece in puzzlePieces"
              :key="piece.id"
              :class="['puzzle-piece', { 'empty': piece.currentPosition === 8 }]"
              :style="{
                gridRow: piece.row + 1,
                gridColumn: piece.col + 1
              }"
              @click="movePuzzlePiece(piece)"
            >
              <div v-if="piece.currentPosition !== 8" class="piece-content">
                <div
                  class="piece-image"
                  :style="{
                    backgroundImage: `url(${currentPuzzle.image})`,
                    backgroundPosition: `${-piece.col * 33.33}% ${-piece.row * 33.33}%`,
                    backgroundSize: '300% 300%'
                  }"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentGame === 'timer'" class="timer-game">
          <div class="timer-display">
            <el-progress type="dashboard" :percentage="(timerSeconds / 60) * 100" :color="timerColor" :stroke-width="20" />
            <div class="timer-text">{{ timerSeconds }}秒</div>
          </div>
          <div class="timer-task">
            <h3>{{ timerTask.question }}</h3>
            <div class="quiz-options">
              <el-radio-group v-model="selectedAnswer">
                <el-radio
                  v-for="(option, index) in timerTask.options"
                  :key="index"
                  :label="index"
                  class="quiz-option"
                >
                  {{ option }}
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="game-buttons">
            <el-button type="primary" :disabled="selectedAnswer === null" @click="submitTimerAnswer(selectedAnswer)">
              提交答案
            </el-button>
          </div>
          <div class="score-info">
            <p>当前得分: {{ timerScore }}</p>
          </div>
        </div>
      </div>

      <el-dialog :visible.sync="resultDialogVisible" title="游戏结果" width="500px" :close-on-click-modal="false">
        <div class="result-content">
          <div class="result-icon" :class="resultType">{{ resultIcon }}</div>
          <h2>{{ resultTitle }}</h2>
          <p>{{ resultMessage }}</p>
          <div v-if="resultType === 'success' && currentLevel < totalLevels - 1" class="score-info">
            <p>当前得分: {{ score }}</p>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button v-if="resultType === 'success' && currentLevel < totalLevels - 1" type="primary" @click="nextLevel">
            下一关
          </el-button>
          <el-button v-else-if="resultType === 'success' && currentLevel >= totalLevels - 1" type="primary" @click="restartGame">
            重新开始
          </el-button>
          <el-button v-else @click="tryAgain">再试一次</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Games',
  data() {
    return {
      currentGame: null,
      score: 0,
      currentLevel: 0,
      totalLevels: 5,
      resultDialogVisible: false,
      resultType: '',
      resultTitle: '',
      resultMessage: '',
      resultIcon: '',
      selectedIngredients: [],
      selectedAnswer: null,
      dragIndex: null,
      foods: [
        {
          title: '泉州传统小吃：面线糊',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          ingredients: ['细面线', '猪骨汤', '虾仁', '瘦肉', '香菇', '鸡蛋', '葱花'],
          steps: [
            '准备材料：细面线、猪骨汤、虾仁、瘦肉、香菇、鸡蛋、葱花等。',
            '将猪骨汤煮沸，加入切好的香菇和瘦肉，煮约10分钟。',
            '将面线掰成小段，放入汤中，用筷子轻轻搅拌，防止面线结块。',
            '加入虾仁，继续煮约2分钟，让虾仁熟透。',
            '将鸡蛋打散，慢慢倒入汤中，形成蛋花。',
            '加入适量的盐、鸡精、胡椒粉调味。',
            '关火，撒上葱花，一碗香喷喷的面线糊就做好了。'
          ]
        },
        {
          title: '泉州土笋冻：海味珍馐',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          ingredients: ['新鲜沙虫', '清水', '盐', '蒜蓉', '酱油', '醋'],
          steps: [
            '准备材料：新鲜沙虫、清水、盐等。',
            '将沙虫清洗干净，用清水浸泡约2小时，让沙虫吐尽泥沙。',
            '将沙虫放入锅中，加入适量清水，用大火煮沸。',
            '转小火继续煮约30分钟，期间不断搅拌，让沙虫的胶质充分溶解。',
            '加入适量盐调味。',
            '将煮好的汤汁倒入容器中，撇去浮沫。',
            '放置在阴凉处，让其自然冷却凝固。'
          ]
        },
        {
          title: '泉州姜母鸭：滋补美味',
          image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          ingredients: ['鸭肉', '老姜', '米酒', '酱油', '冰糖', '八角', '桂皮'],
          steps: [
            '准备材料：鸭肉、老姜、米酒、酱油、冰糖、八角、桂皮、香叶等。',
            '将鸭肉洗净，切成大块，用开水焯一下，去除血水。',
            '老姜洗净，切成厚片，用刀背拍松。',
            '锅中放少量油，放入姜片，用小火慢慢煸炒，直到姜片金黄。',
            '加入焯好的鸭肉，翻炒至鸭肉表面微黄。',
            '加入米酒、酱油、冰糖、八角、桂皮、香叶等调料，翻炒均匀。',
            '加入适量清水，大火煮沸后转小火，炖煮约1.5-2小时。'
          ]
        },
        {
          title: '泉州醋肉：酸甜可口',
          image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          ingredients: ['猪肉', '醋', '酱油', '蒜末', '姜末', '白糖', '地瓜粉'],
          steps: [
            '准备材料：猪肉、醋、酱油、蒜末、姜末、白糖、盐、鸡精、地瓜粉等。',
            '将猪肉洗净，切成薄片或小块。',
            '将醋、酱油、蒜末、姜末、白糖、盐、鸡精等调料混合，调成腌料。',
            '将切好的猪肉放入腌料中，腌制约30分钟，让肉充分入味。',
            '将腌制好的肉裹上一层地瓜粉。',
            '锅中放油，烧至七成热，将裹好粉的肉放入油中油炸。',
            '炸至金黄色捞出，沥干油分。'
          ]
        },
        {
          title: '泉州海蛎煎：鲜美海味',
          image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          ingredients: ['新鲜海蛎', '地瓜粉', '鸡蛋', '葱花', '盐', '胡椒粉'],
          steps: [
            '准备材料：新鲜海蛎、地瓜粉、鸡蛋、葱花、盐、胡椒粉、食用油等。',
            '将海蛎洗净，沥干水分。',
            '将地瓜粉加适量清水，调成糊状。',
            '将海蛎放入地瓜粉糊中，搅拌均匀。',
            '鸡蛋打散，加入葱花、盐、胡椒粉，搅拌均匀。',
            '锅中放油，烧热后将海蛎糊倒入锅中，摊成饼状。',
            '小火慢慢煎至底部金黄，然后翻面继续煎。'
          ]
        }
      ],
      allIngredients: [
        '细面线', '猪骨汤', '虾仁', '瘦肉', '香菇', '鸡蛋', '葱花',
        '新鲜沙虫', '清水', '盐', '蒜蓉', '酱油', '醋', '芥末',
        '鸭肉', '老姜', '米酒', '冰糖', '八角', '桂皮', '香叶',
        '猪肉', '醋', '蒜末', '姜末', '白糖', '地瓜粉', '食用油',
        '糯米', '咸蛋黄', '虾米', '栗子', '粽叶', '粽绳', '五香粉',
        '新鲜海蛎', '胡椒粉', '甜辣酱', '番茄酱'
      ],
      quizQuestions: [
        {
          question: '面线糊起源于哪个朝代？',
          options: ['唐朝', '宋朝', '明朝', '清朝'],
          correct: 1
        },
        {
          question: '土笋冻的主要原料是什么？',
          options: ['竹笋', '沙虫', '海蛎', '粉条'],
          correct: 1
        },
        {
          question: '姜母鸭中的"姜母"是指什么？',
          options: ['生姜', '老姜', '干姜', '嫩姜'],
          correct: 1
        },
        {
          question: '醋肉在炸之前需要做什么？',
          options: ['直接炸', '腌制', '煮熟', '冷冻'],
          correct: 1
        },
        {
          question: '海蛎煎通常搭配什么蘸料？',
          options: ['酱油', '甜辣酱', '醋', '芝麻酱'],
          correct: 1
        },
        {
          question: '泉州是海上丝绸之路的起点吗？',
          options: ['是', '不是'],
          correct: 0
        },
        {
          question: '烧肉粽通常在哪个节日食用？',
          options: ['春节', '中秋节', '端午节', '元宵节'],
          correct: 2
        },
        {
          question: '面线糊最好搭配什么一起吃？',
          options: ['包子', '油条', '馒头', '饼'],
          correct: 1
        }
      ],
      currentMatchFood: null,
      matchIngredients: [],
      currentSortFood: null,
      sortedSteps: [],
      currentQuiz: null,
      memoryCards: [],
      flippedCards: [],
      matchedPairs: 0,
      totalPairs: 6,
      currentPuzzle: null,
      puzzlePieces: [],
      timerSeconds: 60,
      timerInterval: null,
      timerTask: null,
      timerScore: 0
    }
  },
  computed: {
    gameTitle() {
      const titles = {
        'match': '🥬 食材配对',
        'sort': '📋 步骤排序',
        'quiz': '❓ 知识问答',
        'memory': '🧠 记忆配对',
        'puzzle': '🧩 美食拼图',
        'timer': '⏱️ 时间挑战'
      }
      return titles[this.currentGame] || ''
    },
    timerColor() {
      if (this.timerSeconds > 40) {
        return '#67C23A'
      } else if (this.timerSeconds > 20) {
        return '#E6A23C'
      } else {
        return '#F56C6C'
      }
    }
  },
  methods: {
    handleSelect() {
      console.log('点击了导航栏')
    },
    startGame(gameType) {
      this.currentGame = gameType
      this.score = 0
      this.currentLevel = 0
      this.initGame()
    },
    backToSelection() {
      this.currentGame = null
      this.score = 0
      this.currentLevel = 0
      this.selectedIngredients = []
      this.selectedAnswer = null
      this.flippedCards = []
      this.matchedPairs = 0
      this.stopTimer()
    },
    initGame() {
      if (this.currentGame === 'match') {
        this.initMatchGame()
      } else if (this.currentGame === 'sort') {
        this.initSortGame()
      } else if (this.currentGame === 'quiz') {
        this.initQuizGame()
      } else if (this.currentGame === 'memory') {
        this.initMemoryGame()
      } else if (this.currentGame === 'puzzle') {
        this.initPuzzleGame()
      } else if (this.currentGame === 'timer') {
        this.initTimerGame()
      }
    },
    initMemoryGame() {
      this.flippedCards = []
      this.matchedPairs = 0
      const foodImages = this.foods.map(food => food.image)
      const selectedImages = foodImages.slice(0, this.totalPairs)
      const pairedImages = [...selectedImages, ...selectedImages]
      this.memoryCards = this.shuffleArray(pairedImages).map((image, index) => ({
        id: index,
        image,
        flipped: false,
        matched: false
      }))
    },
    initPuzzleGame() {
      const randomFood = this.foods[Math.floor(Math.random() * this.foods.length)]
      this.currentPuzzle = randomFood
      const pieces = []
      const rows = 3
      const cols = 3
      for (let i = 0; i < rows * cols; i++) {
        pieces.push({
          id: i,
          correctPosition: i,
          currentPosition: i,
          row: Math.floor(i / cols),
          col: i % cols
        })
      }
      this.puzzlePieces = this.shuffleArray(pieces)
      this.puzzlePieces.forEach((piece, index) => {
        piece.currentPosition = index
        piece.row = Math.floor(index / cols)
        piece.col = index % cols
      })
    },
    initTimerGame() {
      this.timerSeconds = 60
      this.timerScore = 0
      this.timerTask = this.generateTimerTask()
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
      }
      this.timerInterval = setInterval(() => {
        this.timerSeconds--
        if (this.timerSeconds <= 0) {
          clearInterval(this.timerInterval)
          this.showResult('error', '⏱️ 时间到！', `你的最终得分是 ${this.timerScore} 分！`, '⏱️')
        }
      }, 1000)
    },
    generateTimerTask() {
      const tasks = [
        { type: 'ingredient', question: '面线糊的主要食材是什么？', options: ['细面线', '大米', '面粉', '玉米粉'], correct: 0 },
        { type: 'ingredient', question: '土笋冻的主要原料是什么？', options: ['竹笋', '沙虫', '海蛎', '粉条'], correct: 1 },
        { type: 'ingredient', question: '姜母鸭中的"姜母"是指什么？', options: ['生姜', '老姜', '干姜', '嫩姜'], correct: 1 },
        { type: 'step', question: '制作海蛎煎的第一步是什么？', options: ['将海蛎洗净', '调地瓜粉糊', '打散鸡蛋', '加热油锅'], correct: 0 },
        { type: 'step', question: '制作醋肉的最后一步是什么？', options: ['腌制', '裹粉', '油炸', '调味'], correct: 2 }
      ]
      return tasks[Math.floor(Math.random() * tasks.length)]
    },
    flipCard(card) {
      if (card.flipped || card.matched || this.flippedCards.length >= 2) {
        return
      }
      card.flipped = true
      this.flippedCards.push(card)
      if (this.flippedCards.length === 2) {
        setTimeout(() => {
          this.checkMemoryMatch()
        }, 1000)
      }
    },
    checkMemoryMatch() {
      const [card1, card2] = this.flippedCards
      if (card1.image === card2.image) {
        card1.matched = true
        card2.matched = true
        this.matchedPairs++
        this.score += 50
        if (this.matchedPairs === this.totalPairs) {
          this.showResult('success', '🎉 恭喜！', '你成功完成了记忆配对游戏！', '🎉')
        }
      } else {
        card1.flipped = false
        card2.flipped = false
      }
      this.flippedCards = []
    },
    movePuzzlePiece(piece) {
      const emptyPiece = this.puzzlePieces.find(p => p.currentPosition === 8)
      if (!emptyPiece) return

      const pieceRow = Math.floor(piece.currentPosition / 3)
      const pieceCol = piece.currentPosition % 3
      const emptyRow = Math.floor(emptyPiece.currentPosition / 3)
      const emptyCol = emptyPiece.currentPosition % 3

      if ((Math.abs(pieceRow - emptyRow) === 1 && pieceCol === emptyCol) ||
          (Math.abs(pieceCol - emptyCol) === 1 && pieceRow === emptyRow)) {
        const tempPosition = piece.currentPosition
        piece.currentPosition = emptyPiece.currentPosition
        emptyPiece.currentPosition = tempPosition

        piece.row = Math.floor(piece.currentPosition / 3)
        piece.col = piece.currentPosition % 3
        emptyPiece.row = Math.floor(emptyPiece.currentPosition / 3)
        emptyPiece.col = emptyPiece.currentPosition % 3

        this.checkPuzzleCompletion()
      }
    },
    checkPuzzleCompletion() {
      const isComplete = this.puzzlePieces.every(piece =>
        piece.currentPosition === piece.correctPosition
      )
      if (isComplete) {
        this.score += 200
        this.showResult('success', '🎉 太棒了！', '你成功完成了美食拼图！', '🎉')
      }
    },
    submitTimerAnswer(answer) {
      if (answer === this.timerTask.correct) {
        this.timerScore += 100
        this.timerTask = this.generateTimerTask()
      } else {
        this.timerScore -= 50
      }
    },
    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
    },
    initMatchGame() {
      this.selectedIngredients = []
      this.currentMatchFood = this.foods[this.currentLevel % this.foods.length]
      const correctIngredients = this.currentMatchFood.ingredients
      const wrongIngredients = this.allIngredients.filter(i => !correctIngredients.includes(i))
      const shuffledWrong = this.shuffleArray([...wrongIngredients])
      const selectedWrong = shuffledWrong.slice(0, 4)
      this.matchIngredients = this.shuffleArray([...correctIngredients, ...selectedWrong])
    },
    initSortGame() {
      this.currentSortFood = this.foods[this.currentLevel % this.foods.length]
      const steps = this.currentSortFood.steps.map((text, id) => ({ id, text }))
      this.sortedSteps = this.shuffleArray([...steps])
    },
    initQuizGame() {
      this.selectedAnswer = null
      const shuffledQuizzes = this.shuffleArray([...this.quizQuestions])
      this.currentQuiz = shuffledQuizzes[this.currentLevel % shuffledQuizzes.length]
    },
    shuffleArray(array) {
      const newArray = [...array]
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
      }
      return newArray
    },
    toggleIngredient(index) {
      const idx = this.selectedIngredients.indexOf(index)
      if (idx > -1) {
        this.selectedIngredients.splice(idx, 1)
      } else {
        this.selectedIngredients.push(index)
      }
    },
    checkMatch() {
      const selected = this.selectedIngredients.map(i => this.matchIngredients[i])
      const correct = this.currentMatchFood.ingredients
      const allCorrect = selected.length === correct.length && selected.every(s => correct.includes(s))
      if (allCorrect) {
        this.score += 100
        this.showResult('success', '🎉 太棒了！', '你答对了，这道菜的主要食材都选对了！', '🎉')
      } else {
        this.showResult('error', '😅 再接再厉', '食材选择不正确，再试一次吧！', '😅')
      }
    },
    onDragStart(e, index) {
      this.dragIndex = index
      e.dataTransfer.effectAllowed = 'move'
    },
    onDragOver(e) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    },
    onDrop(e, index) {
      e.preventDefault()
      if (this.dragIndex !== null && this.dragIndex !== index) {
        const item = this.sortedSteps.splice(this.dragIndex, 1)[0]
        this.sortedSteps.splice(index, 0, item)
      }
    },
    onDragEnd() {
      this.dragIndex = null
    },
    checkSort() {
      const correctIds = this.currentSortFood.steps.map((_, id) => id)
      const currentIds = this.sortedSteps.map(s => s.id)
      const isCorrect = correctIds.every((id, i) => id === currentIds[i])
      if (isCorrect) {
        this.score += 150
        this.showResult('success', '🎉 完美！', '你把制作步骤排列得完全正确！', '🎉')
      } else {
        this.showResult('error', '😅 顺序不对', '制作步骤的顺序不正确，再试一次吧！', '😅')
      }
    },
    checkQuiz() {
      if (this.selectedAnswer === this.currentQuiz.correct) {
        this.score += 100
        this.showResult('success', '🎉 回答正确！', '你对泉州非遗美食了解得真多！', '🎉')
      } else {
        this.showResult('error', '😅 回答错误', '没关系，学习更多知识再来挑战吧！', '😅')
      }
    },
    showResult(type, title, message, icon) {
      this.resultType = type
      this.resultTitle = title
      this.resultMessage = message
      this.resultIcon = icon
      this.resultDialogVisible = true
    },
    nextLevel() {
      this.currentLevel++
      this.resultDialogVisible = false
      this.initGame()
    },
    tryAgain() {
      this.resultDialogVisible = false
      this.initGame()
    },
    restartGame() {
      this.resultDialogVisible = false
      this.score = 0
      this.currentLevel = 0
      this.initGame()
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
.games-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
}

.el-menu-demo {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.games-content {
  width: 80%;
  margin: 0 auto;
  padding: 40px 0;
}

.page-title {
  text-align: center;
  color: #E64340;
  font-size: 36px;
  margin-bottom: 40px;
}

.game-selection {
  text-align: center;
}

.selection-title {
  color: #333;
  font-size: 28px;
  margin-bottom: 30px;
}

.game-cards {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.game-card {
  width: 280px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.game-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.game-icon {
  font-size: 64px;
  margin: 20px 0;
}

.game-card h3 {
  color: #333;
  font-size: 22px;
  margin: 10px 0;
}

.game-card p {
  color: #666;
  font-size: 14px;
  margin: 10px 0 20px;
}

.game-area {
  max-width: 900px;
  margin: 0 auto;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.game-header h2 {
  margin: 0;
  color: #E64340;
}

.score-display {
  display: flex;
  gap: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #666;
}

.food-display {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.food-card {
  width: 300px;
  text-align: center;
}

.food-image {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.food-card h3 {
  margin: 0;
  color: #333;
}

.hint {
  text-align: center;
  color: #666;
  font-size: 16px;
  margin-bottom: 20px;
}

.ingredients-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-bottom: 30px;
}

.ingredients-grid .el-tag {
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ingredients-grid .el-tag:hover {
  transform: scale(1.05);
}

.ingredients-grid .el-tag.selected {
  background-color: #E64340;
  border-color: #E64340;
  color: #fff;
}

.steps-container {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.step-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: move;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.step-item:hover {
  background: #fff0f0;
  border-color: #E64340;
}

.step-item:last-child {
  margin-bottom: 0;
}

.step-number {
  width: 40px;
  height: 40px;
  background: #E64340;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  flex-shrink: 0;
}

.step-text {
  flex: 1;
  display: flex;
  align-items: center;
  color: #333;
  font-size: 15px;
  line-height: 1.6;
}

.quiz-card {
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.quiz-card h3 {
  color: #333;
  font-size: 20px;
  margin-bottom: 25px;
  line-height: 1.6;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.quiz-option {
  font-size: 16px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.quiz-option:hover {
  background: #fff0f0;
}

.game-buttons {
  display: flex;
  justify-content: center;
}

.game-buttons .el-button {
  padding: 12px 40px;
  font-size: 16px;
}

.result-content {
  text-align: center;
  padding: 20px 0;
}

.result-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.result-content h2 {
  color: #333;
  font-size: 28px;
  margin-bottom: 15px;
}

.result-content p {
  color: #666;
  font-size: 16px;
  margin-bottom: 20px;
}

.score-info {
  padding: 15px;
  background: #fff5f5;
  border-radius: 8px;
}

.score-info p {
  margin: 0;
  font-weight: bold;
  color: #E64340;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 15px;
}

/* 记忆配对游戏样式 */
.memory-game {
  text-align: center;
}

.memory-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  max-width: 600px;
  margin: 0 auto 30px;
}

.memory-card {
  width: 120px;
  height: 120px;
  perspective: 1000px;
  cursor: pointer;
  margin: 0 auto;
}

.memory-card.flipped .card-inner {
  transform: rotateY(180deg);
}

.memory-card.matched .card-back {
  box-shadow: 0 0 15px #67C23A;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-front {
  background: linear-gradient(135deg, #E64340 0%, #F56C6C 100%);
  color: white;
  font-size: 48px;
  font-weight: bold;
}

.card-back {
  background: white;
  transform: rotateY(180deg);
}

.card-image {
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

.game-info {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #666;
}

/* 美食拼图游戏样式 */
.puzzle-game {
  text-align: center;
}

.puzzle-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 2px;
  max-width: 450px;
  margin: 30px auto;
  background: #333;
  border-radius: 8px;
  padding: 10px;
}

.puzzle-piece {
  width: 140px;
  height: 140px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.puzzle-piece:hover:not(.empty) {
  background: #f9f9f9;
  transform: scale(1.02);
}

.puzzle-piece.empty {
  background: #333;
  cursor: default;
}

.piece-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.piece-image {
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
}

/* 时间挑战游戏样式 */
.timer-game {
  text-align: center;
}

.timer-display {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 30px;
}

.timer-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 36px;
  font-weight: bold;
  color: #333;
}

.timer-task {
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.timer-task h3 {
  color: #333;
  font-size: 20px;
  margin-bottom: 25px;
  line-height: 1.6;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .memory-cards {
    grid-template-columns: repeat(3, 1fr);
  }

  .memory-card {
    width: 100px;
    height: 100px;
  }

  .puzzle-board {
    max-width: 330px;
  }

  .puzzle-piece {
    width: 100px;
    height: 100px;
  }

  .game-cards {
    flex-direction: column;
    align-items: center;
  }

  .game-card {
    width: 80%;
  }
}
</style>
