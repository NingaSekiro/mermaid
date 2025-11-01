<template>
  <a-layout style="height: 100%">
    <a-layout-header :style="{ backgroundColor: 'transparent', paddingInline: 'unset' }">
      <Menu />
    </a-layout-header>
    <a-layout-content>
      <router-view />
    </a-layout-content>
  </a-layout>
</template>
<script setup>
import Menu from '@/views/Menu.vue'
</script>

<style scoped></style>
