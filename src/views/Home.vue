<template>
  <LayoutDual>
    <template #panel>
      <a-collapse v-model:activeKey="activeOutKey" @change="updateMethodChains">
        <a-collapse-panel v-for="(rec, idx) in methodStore.methodRecords" :key="idx">
          <template #header>
            <a-typography-text :ellipsis="{ tooltip: true }" :content="rec" />
          </template>
          <ChainPanel
            :items="chainsByRecord[rec] || []"
            :loading="loadingChains"
            :selectedIndex="selectedIndex"
            @select="(i) => onSelectChain(rec, i)"
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

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useMethodStore } from '@/stores/useMethodStore'
import LayoutDual from '@/components/LayoutDual.vue'
import ChartCard from '@/components/ChartCard.vue'
import ChainPanel from '@/components/ChainPanel.vue'

const activeOutKey = ref<number[]>([])
const methodStore = useMethodStore()
const record = ref<string>('')
const loadingRecords = ref<boolean>(false)
const loadingChains = ref<boolean>(false)
const loadingMermaid = ref<boolean>(false)
const selectedIndex = ref<number>(-1)
const lastActiveKeys = ref<number[]>([])
const chainsByRecord = ref<Record<string, any[]>>({})

onMounted(() => {
  // 确保projectId已设置，如果没有则从URL获取
  if (!methodStore.projectId) {
    const urlParams = new URLSearchParams(window.location.search)
    const paramsObject: Record<string, string> = {}
    urlParams.forEach((value, key) => {
      paramsObject[key] = value
    })
    methodStore.setProjectId(paramsObject.projectId || 'default-project')
  }
  updateMethodRecords()
})

const updateMethodRecords = async (): Promise<void> => {
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

const updateMethodChains = async (keys: any): Promise<void> => {
  if (keys === undefined || (Array.isArray(keys) && keys.length === 0)) {
    return
  }
  const arr = Array.isArray(keys) ? keys : [keys]
  const curr = arr.map((k) => Number(k))
  // 仅在新增展开时触发请求；关闭或相同集合不请求
  const opened = curr.filter((k) => !lastActiveKeys.value.includes(k))
  if (opened.length === 0) {
    lastActiveKeys.value = curr
    return
  }
  const newKey = opened[0]
  const selectedRecord = methodStore.methodRecords[newKey]
  if (!selectedRecord) {
    lastActiveKeys.value = curr
    return
  }
  loadingChains.value = true
  try {
    record.value = selectedRecord
    await methodStore.getMethodChains(selectedRecord)
    chainsByRecord.value[selectedRecord] = Array.isArray(methodStore.methodChains)
      ? [...methodStore.methodChains]
      : []
    selectedIndex.value = -1
  } finally {
    loadingChains.value = false
    lastActiveKeys.value = curr
  }
}

const onSelectChain = (rec: string, index: number): void => {
  if (index === undefined || !rec) return
  selectedIndex.value = index
  loadingMermaid.value = true
  const list = chainsByRecord.value[rec] || []
  const chainItem = list[index]
  const callChainId = Number(chainItem?.callChainId)
  record.value = rec
  methodStore
    .getMermaidCode(rec, callChainId)
    .finally(() => (loadingMermaid.value = false))
}

defineExpose({ updateMethodChains })
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
