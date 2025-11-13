<template>
  <div class="chain-panel">
    <a-spin :spinning="loading">
      <MethodChainList
        :items="items"
        :selectedIndex="selectedIndex"
        @select="onSelect"
      />
    </a-spin>
  </div>
</template>

<script setup>
import MethodChainList from '@/components/MethodChainList.vue'

defineProps({
  items: Array,
  loading: Boolean,
  selectedIndex: { type: Number, default: -1 }
})
const emit = defineEmits(['select'])
const onSelect = (idx) => emit('select', idx)
</script>

<style scoped>
.chain-panel {
  height: 100%;
}
</style>
