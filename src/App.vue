<template>
  <a-config-provider :theme="theme" :locale="locale">
    <router-view></router-view>
  </a-config-provider>

</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useGlobalStore } from '@/stores/global'
import { computed } from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

const locale = zhCN;

const global = useGlobalStore()

const theme = computed(() => {
  return {
    token: {
      colorPrimary: global.themeColor
    }
  }
})

</script>
