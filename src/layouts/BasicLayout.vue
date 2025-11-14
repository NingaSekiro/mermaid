<template>
  <a-layout style="height: 100%">
    <a-layout-header class="app-header">
      <Menu />
    </a-layout-header>
    <a-layout-content class="app-content">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>
<script setup lang="ts">
import Menu from '@/views/Menu.vue'
</script>

<style scoped>
.app-header {
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0));
  backdrop-filter: blur(6px);
  padding-inline: 24px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.app-content {
  padding: 16px 24px;
}
</style>
