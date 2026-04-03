<template>
  <a-layout-sider :collapsed="state.collapsed" class="sider-container" :width="260">
    <div class="sider-header">
      <a-button type="primary" block class="new-chat-btn" @click="newChat" v-show="!state.collapsed">
        <span style="font-size: 15px; font-weight: 500;">+ 新建对话</span>
      </a-button>
      <a-button type="primary" class="new-chat-btn-small" @click="newChat" v-show="state.collapsed">
        <span style="font-size: 16px; font-weight: 500;">+</span>
      </a-button>
    </div>
    
    <div class="history-list" v-show="!state.collapsed">
      <div class="history-group-title">今天</div>
      <div class="history-item active">
        <MessageOutlined class="icon" />
        <span class="text">Vue 3 性能优化</span>
      </div>
      <div class="history-item">
        <MessageOutlined class="icon" />
        <span class="text">Ant Design UI 升级</span>
      </div>
      
      <div class="history-group-title">昨天</div>
      <div class="history-item">
        <MessageOutlined class="icon" />
        <span class="text">如何学习大模型开发</span>
      </div>
    </div>

    <!-- 用户栏 -->
    <div class="user-footer" v-show="!state.collapsed">
      <a-avatar src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin" size="small" />
      <span class="user-name">开发者 Demo</span>
      <SettingOutlined class="settings-icon" />
    </div>

    <div class="collapse-btn">
      <a-button type="text" class="toggle-btn" @click="toggleCollapsed">
        <MenuUnfoldOutlined v-if="state.collapsed" />
        <MenuFoldOutlined v-else />
      </a-button>
    </div>
  </a-layout-sider>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  SettingOutlined
} from '@ant-design/icons-vue';

const state = reactive({
  collapsed: false,
});

const toggleCollapsed = () => {
  state.collapsed = !state.collapsed;
};

const newChat = () => {
  // Clear chat trigger here
  console.log('New chat')
}
</script>

<style scoped>
.sider-container {
  background-color: #202123 !important;
  color: #fff;
  height: 100vh;
  display: flex !important;
  flex-direction: column !important;
}

:deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sider-header {
  padding: 16px;
  flex-shrink: 0;
}

.new-chat-btn {
  background-color: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  border-radius: 6px;
  height: 44px;
  transition: all 0.2s;
  box-shadow: none;
}

.new-chat-btn:hover {
  background-color: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.3);
}

.new-chat-btn-small {
  width: 100%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px;
}

/* 隐藏滚动条 */
.history-list::-webkit-scrollbar {
  width: 4px;
}
.history-list::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.2);
  border-radius: 2px;
}

.history-group-title {
  font-size: 12px;
  color: #8e8ea0;
  padding: 12px 12px 8px;
  font-weight: 500;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  color: #ececf1;
  font-size: 14px;
  transition: background 0.2s;
  margin-bottom: 4px;
}

.history-item:hover {
  background-color: rgba(255,255,255,0.08);
}

.history-item.active {
  background-color: rgba(255,255,255,0.12);
}

.history-item .icon {
  font-size: 14px;
  opacity: 0.8;
}

.history-item .text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.user-footer {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-top: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
  transition: background 0.2s;
}

.user-footer:hover {
  background-color: rgba(255,255,255,0.08);
}

.user-name {
  color: #ececf1;
  font-size: 14px;
  font-weight: 500;
  flex: 1;
}

.settings-icon {
  color: #8e8ea0;
  font-size: 16px;
}

.collapse-btn {
  padding: 8px;
  text-align: center;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.toggle-btn {
  color: #8e8ea0;
  width: 100%;
}

.toggle-btn:hover {
  color: #fff;
  background-color: rgba(255,255,255,0.08);
}
</style>