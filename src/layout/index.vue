<template>
  <a-layout>
    <!-- 左侧菜单 -->
    <layout-menu></layout-menu>
    <a-layout>
      <!-- 头部 -->
      <a-layout-header :style="headerStyle">
        <layout-header></layout-header>
      </a-layout-header>
      <!-- 内容 -->
      <a-layout-content>
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import type { CSSProperties } from 'vue';

import LayoutMenu from './components/layout-menu.vue';
import LayoutHeader  from './components/layout-header.vue'

const headerStyle: CSSProperties = {
  height: 64,
};

</script>

<style scoped></style>