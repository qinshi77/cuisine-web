<template>
  <div>
    <!-- 悬浮挂件 -->
    <div class="ai-float-widget" @click="openChat">
      <div class="icon">🤖</div>
      <div class="text">AI 问答</div>
    </div>

    <!-- 弹窗 -->
    <el-dialog
      title="非遗美食 AI 助手"
      :visible.sync="visible"
      width="520px"
      top="10vh"
      :close-on-click-modal="false"
    >
      <div class="chat-wrapper">
        <!-- 对话记录区 -->
        <div ref="historyBox" class="chat-history">
          <div class="msg bot">
            你好！我是泉州非遗美食 AI 助手，有什么可以帮你？
          </div>

          <div
            v-for="(item, i) in history"
            :key="i"
            class="msg"
            :class="item.role"
          >
            {{ item.content }}
          </div>
        </div>

        <!-- 输入框 -->
        <div class="chat-input">
          <el-input
            v-model="question"
            placeholder="请输入你的问题..."
            @keyup.enter.native="sendQuestion"
          />
          <el-button
            type="primary"
            :loading="loading"
            @click="sendQuestion"
          >
            发送
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'AiChatWidget',
  data() {
    return {
      visible: false,
      question: '',
      history: [],
      loading: false
    }
  },
  methods: {
    // 打开弹窗
    openChat() {
      this.visible = true
    },

    // 发送问题
    async sendQuestion() {
      if (!this.question.trim()) return
      const q = this.question
      this.question = ''

      // 加入用户问题
      this.history.push({ role: 'user', content: q })
      this.loading = true

      try {
        const { data } = await axios({
          url: 'http://localhost:8081/api/ai/chat',
          method: 'get',
          params: { prompt: q }
        })

        this.history.push({ role: 'bot', content: data })
      } catch (err) {
        this.history.push({ role: 'bot', content: 'AI 服务异常，请稍后再试' })
      } finally {
        this.loading = false
        this.$nextTick(() => {
          const el = this.$refs.historyBox
          el.scrollTop = el.scrollHeight
        })
      }
    }
  }
}
</script>

<style scoped>
/* 悬浮挂件 */
.ai-float-widget {
  position: fixed;
  right: 22px;
  bottom: 30px;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #E64340, #F39C12);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-shadow: 0 5px 15px rgba(230, 67, 64, 0.3);
  cursor: pointer;
  z-index: 9999;
  transition: all 0.3s ease;
}
.ai-float-widget:hover {
  transform: scale(1.08);
}
.ai-float-widget .icon {
  font-size: 24px;
  margin-bottom: 2px;
}
.ai-float-widget .text {
  font-size: 12px;
}

/* 聊天窗口 */
.chat-wrapper {
  height: 520px;
  display: flex;
  flex-direction: column;
}
.chat-history {
  flex: 1;
  padding: 12px;
  background: #f7f7f7;
  border-radius: 8px;
  overflow-y: auto;
  margin-bottom: 10px;
}
.msg {
  max-width: 75%;
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  line-height: 1.5;
}
.msg.user {
  background: #E64340;
  color: white;
  margin-left: auto;
}
.msg.bot {
  background: white;
  border: 1px solid #eee;
  margin-right: auto;
}
.chat-input {
  display: flex;
  gap: 8px;
}
</style>
