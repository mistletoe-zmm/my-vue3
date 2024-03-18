<template>
  <div>
    <a-button @click="handleLogin">登陆</a-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter()
const handleLogin = ()=>{
  router.push('/index')
}
</script>

<style scoped></style>