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

<script setup>
const props = defineProps({
  items: { type: Array, default: () => [] },
  selectedIndex: { type: Number, default: -1 },
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['select'])
const onSelect = (index) => emit('select', index)
const displayText = (item) => item?.message || `${item?.threadName || ''} ${item?.methodChain || ''}`
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
