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

<script setup>
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useMethodStore } from '@/stores/useMethodStore.js'
import { getInitConfig, mermaidAPI, recordAPI } from '@/apis/method.js'
import LayoutDual from '@/components/LayoutDual.vue'
import ChartCard from '@/components/ChartCard.vue'
import ChainPanel from '@/components/ChainPanel.vue'
import RecordControl from '@/components/RecordControl.vue'

const methodStore = useMethodStore()
const recordResp = ref([])
const mermaidCode = ref('')
const timer = ref(null)
const selectedIndex = ref(-1)
const loadingChains = ref(false)
const loadingMermaid = ref(false)
// 是否禁用录制开关
const recordDisabled = ref(false)
const packageNames = ref([])
// 是否选中录制开关
const recording = ref(false)
const state = reactive({
  indeterminate: false,
  checkAll: true,
  checkedList: [],
})

onMounted(async () => {
  if (!methodStore.projectId) {
    const urlParams = new URLSearchParams(window.location.search)
    const paramsObject = {}
    urlParams.forEach((value, key) => {
      paramsObject[key] = value
    })
    methodStore.setProjectId(paramsObject.projectId)
  }
  const res = await getInitConfig(methodStore.projectId)
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

const startPolling = () => {
  timer.value = setInterval(async () => {
    try {
      const params = {
        projectId: methodStore.projectId,
        config: state.checkedList,
        start: true,
      }
      const res = await recordAPI(params)
      recordResp.value = res.data || []
      loadingChains.value = false
      if (recordResp.value.code !== 0) {
        stopPolling()
        recordDisabled.value = true
        recording.value = false
      }
    } catch (error) {
      console.error('轮询数据失败:', error)
    }
  }, 5000)
}

const stopPolling = async () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
    const params = {
      projectId: methodStore.projectId,
      config: state.checkedList,
      start: false,
    }
    await recordAPI(params)
  }
}

const onCheckAllChange = (e) => {
  Object.assign(state, {
    checkedList: e.target.checked ? packageNames.value : [],
    indeterminate: false,
  })
}

const updateMermaidCode = async (index) => {
  if (index === undefined) {
    return
  }
  loadingMermaid.value = true
  selectedIndex.value = index
  const res = await mermaidAPI(
    recordResp.value.record,
    recordResp.value.methodChains[index].callChainId,
  )
  mermaidCode.value = res.data.mermaidCode
  loadingMermaid.value = false
}

const onSelectChain = (index) => updateMermaidCode(index)

const doHandleClick = () => {
  recording.value ? startPolling() : stopPolling()
}
</script>

<style scoped></style>
