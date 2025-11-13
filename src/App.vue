<template>
  <a-config-provider
    :theme="{
      algorithm: theme.darkAlgorithm,
      token: {
        colorPrimary: '#10b981',
        colorBgLayout: '#0e0e10',
        colorBgContainer: '#1a1a1d',
        borderRadius: 12,
        fontSize: 14,
      },
    }"
  >
    <div class="app">
      <BasicLayout/>
    </div>
  </a-config-provider>
</template>

<script setup>
import { theme } from 'ant-design-vue';
import BasicLayout from '@/layouts/BasicLayout.vue'
</script>

<style scoped>
.app {
  background: radial-gradient(1000px 500px at 20% -10%, rgba(16,185,129,0.25), transparent),
              radial-gradient(800px 400px at 80% 0%, rgba(59,130,246,0.2), transparent),
              #0e0e10;
  height: 100vh;
}
</style>
