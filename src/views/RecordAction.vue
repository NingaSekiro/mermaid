<template>
  <RecordControl
    :checkAll="state.checkAll"
    :indeterminate="state.indeterminate"
    :checkedList="state.checkedList"
    :packageNames="packageNames"
    :recording="recording"
    :recordDisabled="recordDisabled"
    @checkAllChange="onCheckAllChange"
    @update:checkedList="state.checkedList = $event"
    @update:recording="recording = $event; doHandleClick()"
  />

<LayoutDual>
  <template #panel>
    <ChainPanel
      :items="recordResp.methodChains"
      :loading="loadingChains"
      :selectedIndex="selectedIndex"
      @select="onSelectChain"
    />
  </template>
  <template #chart>
    <ChartCard
      :title="recordResp.record"
      :mermaidCode="mermaidCode"
      :record="recordResp.record"
      :loading="loadingMermaid"
      emptyText="请在录制后从左侧选择一个方法链查看图表"
    />
  </template>
</LayoutDual>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useMethodStore } from '@/stores/useMethodStore'
import { getInitConfig, mermaidAPI, recordAPI } from '@/apis/method'
import LayoutDual from '@/components/LayoutDual.vue'
import ChartCard from '@/components/ChartCard.vue'
import ChainPanel from '@/components/ChainPanel.vue'
import RecordControl from '@/components/RecordControl.vue'
import type { MethodRecordResponse } from '@/types/api.types.ts'

const methodStore = useMethodStore()
const recordResp = ref<MethodRecordResponse>({ record: '', methodChains: [], code: 0 })
const mermaidCode = ref<string>('')
const timer = ref<NodeJS.Timeout | null>(null)
const selectedIndex = ref<number>(-1)
const loadingChains = ref<boolean>(false)
const loadingMermaid = ref<boolean>(false)
// 是否禁用录制开关
const recordDisabled = ref<boolean>(false)
const packageNames = ref<string[]>([])
// 是否选中录制开关
const recording = ref<boolean>(false)
const state = reactive<{
  indeterminate: boolean
  checkAll: boolean
  checkedList: string[]
}>({
  indeterminate: false,
  checkAll: true,
  checkedList: [],
})

onMounted(async () => {
  if (!methodStore.projectId) {
    const urlParams = new URLSearchParams(window.location.search)
    const paramsObject: Record<string, string> = {}
    urlParams.forEach((value, key) => {
      paramsObject[key] = value
    })
    methodStore.setProjectId(paramsObject.projectId || '')
  }
  const res = await getInitConfig(methodStore.projectId || '')
  // 初始化选中所有package
  state.checkedList = res.data.packageNames || []
  packageNames.value = res.data.packageNames || []
  recordDisabled.value = !res.data.status
})

onUnmounted(() => {
  stopPolling()
})
watch(
  () => state.checkedList,
  (val) => {
    state.indeterminate = !!val.length && val.length < packageNames.value.length
    state.checkAll = val.length === packageNames.value.length
  },
)

const startPolling = (): void => {
  timer.value = setInterval(async () => {
    try {
      const params = {
        projectId: methodStore.projectId || '',
        config: state.checkedList,
        start: true
      }
      const res = await recordAPI(params)
      if (res.data && typeof res.data === 'object' && 'record' in res.data && 'methodChains' in res.data && 'code' in res.data) {
        recordResp.value = res.data as MethodRecordResponse
      } else if (res.data && typeof res.data === 'object' && 'record' in res.data) {
        recordResp.value = { 
          record: (res.data as any).record || '', 
          methodChains: (res.data as any).methodChains || [], 
          code: (res.data as any).code || 0 
        }
      } else {
        recordResp.value = { record: '', methodChains: [], code: 0 }
      }
      loadingChains.value = false
      if (recordResp.value.code !== 0) {
        await stopPolling()
        recordDisabled.value = true
        recording.value = false
      }
    } catch (error) {
      console.error('轮询数据失败:', error)
    }
  }, 5000)
}

const stopPolling = async (): Promise<void> => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
    const params = {
      projectId: methodStore.projectId || '',
      config: state.checkedList,
      start: false
    }
    await recordAPI(params)
  }
}

const onCheckAllChange = (e: Event): void => {
  const target = e.target as HTMLInputElement
  Object.assign(state, {
    checkedList: target.checked ? packageNames.value : [],
    indeterminate: false,
  })
}

const updateMermaidCode = async (index: number): Promise<void> => {
  loadingMermaid.value = true
  selectedIndex.value = index
  
  // 调试信息：查看实际数据结构
  const chainItem = recordResp.value.methodChains[index]

  
  // 修复：确保 callChainId 有有效值
  let callChainId = chainItem?.callChainId || chainItem?.id || 0
  
  // 如果 callChainId 是 0 或者无效值，尝试使用其他可能的字段
  if (!callChainId || callChainId === 0) {
    // 尝试使用 methodChain 或其他唯一标识符
    const methodChain = chainItem?.methodChain?.toString() || chainItem?.threadName || index.toString()
    // 将字符串转换为数字，如果无法转换则使用索引
    callChainId = parseInt(methodChain) || index
  }
  
  console.log('Final callChainId from RecordAction:', callChainId)
  
  const res = await mermaidAPI(
    recordResp.value.record,
    callChainId,
  )
  mermaidCode.value = res.data.mermaidCode || res.data.code
  loadingMermaid.value = false
}

const onSelectChain = (index: number): void => {
  updateMermaidCode(index)
}

const doHandleClick = (): void => {
  recording.value ? startPolling() : stopPolling()
}
</script>

<style scoped></style>
