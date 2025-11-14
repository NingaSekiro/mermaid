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

const updateMethodChains = async (keys: number[]): Promise<void> => {
  if (keys === undefined || keys.length === 0) {
    return
  }
  loadingChains.value = true
  try {
    const selectedRecord = methodStore.methodRecords[keys[0]]
    if (selectedRecord) {
      // selectedRecord是字符串，直接作为record参数
      record.value = selectedRecord
      await methodStore.getMethodChains(selectedRecord)
      selectedIndex.value = -1
    }
  } finally {
    loadingChains.value = false
  }
}

const onSelectChain = (index: number): void => {
  if (index === undefined) return
  selectedIndex.value = index
  loadingMermaid.value = true

  const chainItem = methodStore.methodChains[index]

  // 调试信息：查看实际数据结构
  console.log('Selected chain item from Home:', chainItem)
  console.log('callChainId:', chainItem?.callChainId)
  console.log('id:', chainItem?.id)

  // 修复：确保 callChainId 有有效值
  let callChainId = chainItem?.callChainId || chainItem?.id || 0

  // 如果 callChainId 是 0 或者无效值，尝试使用其他可能的字段
  if (!callChainId || callChainId === 0) {
    // 尝试使用 methodChain 或其他唯一标识符
    const methodChain =
      chainItem?.methodChain?.toString() || chainItem?.threadName || index.toString()
    // 将字符串转换为数字，如果无法转换则使用索引
    callChainId = parseInt(methodChain) || index
  }

  console.log('Final callChainId from Home:', callChainId)

  methodStore
    .getMermaidCode(record.value, callChainId)
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
