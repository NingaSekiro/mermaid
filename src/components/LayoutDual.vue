<template>
  <el-splitter>
    <el-splitter-panel size="20%">
      <div style="padding: 8px; display: grid; gap: 6px">
        <slot name="panel" />
      </div>
    </el-splitter-panel>

    <el-splitter-panel size="80%">
      <div :style="{ padding: '24px' }">
        <slot name="chart" />
      </div>
    </el-splitter-panel>
  </el-splitter>
</template>

<script setup lang="ts"></script>

<style scoped></style>
