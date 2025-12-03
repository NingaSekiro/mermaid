<template>
  <div class="chart-card">
    <a-spin :spinning="loading">
      <Sequence v-if="mermaidResponse" :mermaidResponse="mermaidResponse" :record="record" />
      <div v-else class="chart-empty">
        <a-empty :description="emptyText" />
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import type { MermaidResponse } from '@/types/api.types.ts'
import Sequence from '@/components/Sequence.vue'

defineProps<{
  title: string
  mermaidResponse: MermaidResponse | undefined
  record: string
  loading: boolean
  emptyText?: string
}>()
</script>

<style scoped>
.chart-card {
  width: 100%;
  height: 100%;
}
.chart-empty {
  height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
