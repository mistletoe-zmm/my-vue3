<template>
  <a-layout style="min-height: 100vh; background-color: #ffffff;">
    <!-- 左侧菜单 (历史记录) -->
    <layout-menu></layout-menu>
    <a-layout style="background: transparent;">
      <!-- 内容 (AI Chat) -->
      <a-layout-content style="height: 100vh; overflow: hidden;">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import LayoutMenu from './components/layout-menu.vue';

</script>

<style scoped></style>