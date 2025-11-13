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

<script setup>
import MermaidRenderer from '@/components/MermaidRenderer.vue'

defineProps({
  title: String,
  mermaidCode: String,
  record: String,
  loading: Boolean,
  emptyText: { type: String, default: '请从左侧选择一个方法链查看图表' }
})
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
