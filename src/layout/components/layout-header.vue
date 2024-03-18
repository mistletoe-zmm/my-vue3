<template>
  <div class="layout-header-container">
    <div>
      <SkinOutlined @click="showModal" />
    </div>
  </div>
  <a-modal v-model:open="open" title="选择皮肤" @ok="handleConfirm">
    <div class="tag-group">
      <a-tag v-for="item in colorList" :key="item" :color="item" @click="changeTheme(item)">
        <CheckOutlined v-if="item === currentColor" />
      </a-tag>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SkinOutlined, CheckOutlined } from '@ant-design/icons-vue'
import { useGlobalStore } from '@/stores/global'

const global = useGlobalStore()
const open = ref<Boolean>(false)
const colorList = ref(['#089BAB', '#FA541C'])
const showModal = () => {
  open.value = true;
}
const handleConfirm = () => {
  global.setThemeColor(currentColor.value);
  open.value = false
}
const currentColor = ref(global.themeColor);
const changeTheme = (item: string) => {
  currentColor.value = item;
  
}
</script>

<style scoped lang="less">
.layout-header-container {
  color: #fff;
  display: flex;
  justify-content: flex-end;
}

.tag-group {
  display: flex;
  .ant-tag {
    width: 30px;
    height: 20px;
    cursor: pointer;
  }
}
</style>