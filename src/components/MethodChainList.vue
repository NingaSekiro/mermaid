<template>
  <a-spin :spinning="loading">
    <a-list :data-source="items" :bordered="false" size="small">
      <template #renderItem="{ item, index }">
        <a-list-item
          class="item"
          :class="{ selected: selectedIndex===index }"
          @click="onSelect(index)"
        >
          <a-tooltip :title="displayText(item)">
            <div class="truncate">{{ displayText(item) }}</div>
          </a-tooltip>
        </a-list-item>
      </template>
    </a-list>
  </a-spin>
</template>

<script setup lang="ts">
import type { MethodChainResponse } from '@/types/api.types.ts'

defineProps<{
  items: MethodChainResponse[]
  selectedIndex: number
  loading: boolean
}>()

const emit = defineEmits<{
  select: [index: number]
}>()

const onSelect = (index: number): void => emit('select', index)
const displayText = (item: MethodChainResponse): string => {
  // 如果 message 存在且不为 null，优先使用 message
  if (item?.message) {
    return item.message
  }
  const threadName = item?.threadName || ''
  const methodChain = item?.methodChain || ''
  return `${threadName} ${methodChain}`.trim() || 'Unknown Method'
}
</script>

<style scoped>
.truncate {
  display: block;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.item {
  position: relative;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
}
.item:hover {
  background: rgba(255,255,255,0.06);
}
.item.selected {
  background: rgba(255,255,255,0.08);
}
.item.selected::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #10b981;
  border-radius: 2px;
}
</style>
