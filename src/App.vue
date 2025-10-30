<template>
  <a-config-provider
    :theme="{
      algorithm: theme.darkAlgorithm,
    }"
  >
    <div class="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script setup>
import { theme } from 'ant-design-vue';
</script>

<style scoped>.app {
  background-color: #141414; /* 添加深色背景 */
  min-height: 100vh; /* 确保覆盖整个视口高度 */
}
</style>
