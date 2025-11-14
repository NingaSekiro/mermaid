<template>
  <div class="chain-panel">
    <a-spin :spinning="loading">
      <MethodChainList
        :items="items"
        :selectedIndex="selectedIndex"
        :loading="loading"
        @select="onSelect"
      />
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import MethodChainList from '@/components/MethodChainList.vue'
import type { MethodChainResponse } from '@/types/api.types.ts'

defineProps<{
  items: MethodChainResponse[]
  loading: boolean
  selectedIndex: number
}>()

const emit = defineEmits<{
  select: [index: number]
}>()

const onSelect = (idx: number): void => emit('select', idx)
</script>

<style scoped>
.chain-panel {
  height: 100%;
}
</style>
