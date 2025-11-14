<template>
  <div class="chart-card">
    <a-spin :spinning="loading">
      <MermaidRenderer
        v-if="mermaidCode"
        :mermaidCode="mermaidCode"
        :record="record"
      />
      <div v-else class="chart-empty">
        <a-empty :description="emptyText" />
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import MermaidRenderer from '@/components/MermaidRenderer.vue'

defineProps<{
  title: string
  mermaidCode: string
  record: string
  loading: boolean
  emptyText?: string
}>()
</script>

<style scoped>
.chart-card {
  width: 100%;
}
.chart-empty {
  height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
