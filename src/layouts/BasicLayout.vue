<template>
  <div class="basic-layout">
    <a-layout>
      <a-layout-header :style="{backgroundColor: 'transparent',paddingInline:'unset'}">
        <Menu />
      </a-layout-header>
      <a-layout-content>
        <router-view />
      </a-layout-content>
    </a-layout>
  </div>
</template>
<script setup>

import Menu from '@/views/Menu.vue'
</script>


<style scoped>

</style>