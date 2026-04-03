<template>
  <div class="chat-app-page">
    <div class="chat-messages" ref="messageBox">
      <div v-if="messages.length === 1" class="empty-state">
        <div class="logo">🚀</div>
        <h2>你今天想聊点什么？</h2>
      </div>
      <div class="message-list">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message-wrapper', msg.role]"
          v-show="msg.role !== 'system'"
        >
          <div class="message-inner">
            <!-- AI 侧头像 -->
            <div class="avatar ai-avatar" v-if="msg.role === 'assistant'">
              <span>AI</span>
            </div>
            
            <div class="message-content">
              <div class="message-bubble">
                <div class="markdown-body" v-html="renderMarkdown(msg.content)"></div>
                <!-- 加载中或者正在输出时的闪烁光标 -->
                <span class="cursor" v-if="isLoading && msg.role === 'assistant' && index === messages.length - 1"></span>
              </div>
            </div>

            <!-- 用户侧头像 -->
            <div class="avatar user-avatar" v-if="msg.role === 'user'">
              <span>我</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="input-area-wrapper">
      <div class="input-area">
        <div class="input-box">
          <input
            v-model="userInput"
            @keyup.enter="sendMessage"
            :disabled="isLoading"
            placeholder="给 AI 发送消息..."
          />
          <button v-if="isLoading" class="send-btn stop-btn" @click="stopGenerate" title="停止生成">
            <div class="stop-icon"></div>
          </button>
          <button v-else class="send-btn" @click="sendMessage" :disabled="!userInput.trim()">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
        <div class="footer-text">内容由 AI 生成，请注意甄别。</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { chat } from '@/api/base.js'
import { marked } from 'marked'

const userInput = ref('')
const isLoading = ref(false)
const messageBox = ref(null)
let abortController = null

const messages = ref([{ role: 'system', content: '你是一个懂幽默的资深程序员，说话一针见血。' }])

const scrollToBottom = async (force = false) => {
  await nextTick()
  if (messageBox.value) {
    const el = messageBox.value
    if (force === true) {
      el.scrollTop = el.scrollHeight
    } else {
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150
      if (isAtBottom) {
        el.scrollTop = el.scrollHeight
      }
    }
  }
}

watch(messages, () => {
  scrollToBottom(false)
}, { deep: true })

const renderMarkdown = (text) => {
  if (!text) return ''
  return marked.parse(text)
}

const stopGenerate = () => {
  if (abortController) {
    abortController.abort()
    abortController = null
  }
  isLoading.value = false
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  messages.value.push({ role: 'user', content: userInput.value })
  userInput.value = ''
  isLoading.value = true
  scrollToBottom(true)

  messages.value.push({ role: 'assistant', content: '' })
  const currentAiMessage = messages.value[messages.value.length - 1]
  scrollToBottom(true)

  abortController = new AbortController()

  try {
    const response = await fetch('http://127.0.0.1:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: messages.value }),
      signal: abortController.signal
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let done = false

    while (!done) {
      const { value, done: readerDone } = await reader.read()
      done = readerDone
      if (value) {
        const chunkText = decoder.decode(value, { stream: true })
        currentAiMessage.content += chunkText
      }
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('生成已终止')
    } else {
      console.error('请求报错:', error)
      currentAiMessage.content = '连接服务器失败，请检查 Python 后端是否启动。'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.chat-app-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
  box-sizing: border-box;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 40px 0;
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 隐藏滚动条 */
.chat-messages::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #1a1a1a;
  margin-top: 10vh;
}

.empty-state .logo {
  font-size: 56px;
  margin-bottom: 20px;
}

.empty-state h2 {
  font-size: 28px;
  font-weight: 600;
}

.message-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.message-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid transparent;
}

.message-inner {
  width: 100%;
  max-width: 800px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 0 20px;
}

.message-wrapper.user {
  background-color: #ffffff;
  padding: 12px 0;
}
.message-wrapper.assistant {
  padding: 12px 0;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
  user-select: none;
}

.ai-avatar {
  background: #10a37f;
  color: #ffffff;
}

.user-avatar {
  background: #ecf2f3;
  color: #1a1a1a;
}

.message-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.message-bubble {
  font-size: 16px;
  line-height: 1.6;
  word-break: break-word;
  color: #374151;
}

:deep(.markdown-body p) {
  margin: 0;
  white-space: pre-wrap;
}

:deep(.markdown-body pre) {
  background: #f0f2f5;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 12px 0;
}

:deep(.markdown-body code) {
  font-family: Consolas, Monaco, monospace;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.04);
  padding: 2px 4px;
  border-radius: 4px;
}

:deep(.markdown-body pre code) {
  background: transparent;
  padding: 0;
}

.input-area-wrapper {
  flex-shrink: 0;
  padding: 0;
  background: transparent;
  display: flex;
  justify-content: center;
  position: relative;
  background: linear-gradient(to top, white 85%, rgba(255,255,255,0));
}

.input-area {
  width: 100%;
  max-width: 800px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-box {
  width: 100%;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s, border-color 0.2s;
}

.input-box:focus-within {
  border-color: #10a37f;
  box-shadow: 0 4px 6px -1px rgba(16, 163, 127, 0.1);
}

input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 16px;
  color: #1a1a1a;
  padding: 0 10px;
}

input::placeholder {
  color: #9ca3af;
}

.send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: #10a37f;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  padding: 0;
}

.send-btn:hover:not(:disabled) {
  background: #0d8c6d;
}

.send-btn:disabled {
  background: transparent;
  color: #d1d5db;
  cursor: not-allowed;
}

.stop-btn {
  background: transparent;
  border: 1.5px solid #1a1a1a;
  border-radius: 50%;
}

.stop-btn:hover:not(:disabled) {
  background: rgba(0,0,0,0.05);
}

.stop-icon {
  width: 10px;
  height: 10px;
  background-color: #1a1a1a;
  border-radius: 2px;
}

.footer-text {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 12px;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 16px;
  background-color: #10a37f;
  vertical-align: middle;
  margin-left: 2px;
  animation: blink 0.8s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
