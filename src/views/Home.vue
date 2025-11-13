<template>
  <LayoutDual>
    <template #panel>
      <a-collapse v-model:activeKey="activeOutKey" @change="updateMethodChains">
        <a-collapse-panel v-for="(rec, idx) in methodStore.methodRecords" :key="idx">
          <template #header>
            <a-typography-text :ellipsis="{ tooltip: true }" :content="rec" />
          </template>
          <ChainPanel
            :items="methodStore.methodChains"
            :loading="loadingChains"
            :selectedIndex="selectedIndex"
            @select="onSelectChain"
          />
        </a-collapse-panel>
      </a-collapse>
    </template>
    <template #chart>
      <ChartCard
        :title="record || '方法链图表'"
        :mermaidCode="methodStore.mermaidCode"
        :record="record"
        :loading="loadingMermaid"
        emptyText="请从左侧选择一个方法链查看图表"
      />
    </template>
  </LayoutDual>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useMethodStore } from '@/stores/useMethodStore.js'
import LayoutDual from '@/components/LayoutDual.vue'
import ChartCard from '@/components/ChartCard.vue'
import ChainPanel from '@/components/ChainPanel.vue'

const activeOutKey = ref([])
const methodStore = useMethodStore()
const record = ref('')
const loadingRecords = ref(false)
const loadingChains = ref(false)
const loadingMermaid = ref(false)
const selectedIndex = ref(-1)

onMounted(() => {
  updateMethodRecords()
})

const updateMethodRecords = async () => {
  loadingRecords.value = true
  try {
    await methodStore.getMethodRecords()
    if (Array.isArray(methodStore.methodRecords) && methodStore.methodRecords.length > 0) {
      activeOutKey.value = [0]
      await updateMethodChains([0])
    }
  } finally {
    loadingRecords.value = false
  }
}

const updateMethodChains = async (keys) => {
  if (keys === undefined || keys.length === 0) {
    return
  }
  loadingChains.value = true
  try {
    record.value = methodStore.methodRecords[keys[0]]
    await methodStore.getMethodChains(record.value)
    selectedIndex.value = -1
  } finally {
    loadingChains.value = false
  }
}

const onSelectChain = (index) => {
  if (index === undefined) return
  selectedIndex.value = index
  loadingMermaid.value = true
  methodStore
    .getMermaidCode(record.value, methodStore.methodChains[index].callChainId)
    .finally(() => (loadingMermaid.value = false))
}
</script>

<style scoped>
:deep(.ant-collapse) {
  background: transparent;
  border: none;
}
:deep(.ant-collapse-item) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
:deep(.ant-collapse-header) {
  padding: 8px 10px !important;
  border-radius: 6px;
}
:deep(.ant-collapse-header:hover) {
  background: rgba(255, 255, 255, 0.04);
}
</style>
