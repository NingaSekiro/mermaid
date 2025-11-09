<template>
  <div>
    <a-checkbox
      v-model:checked="state.checkAll"
      :indeterminate="state.indeterminate"
      @change="onCheckAllChange"
    >
      录制package
    </a-checkbox>
  </div>
  <a-checkbox-group v-model:value="state.checkedList" :options="packageNames" />
  <br />
  <a-switch
    v-model:checked="recording"
    @change="doHandleClick"
    checked-children="录制中"
    un-checked-children="未录制"
    :disabled="recordDisabled"
  />
  <a-layout class="main-layout" style="height: 100%">
    <!-- 左侧侧边栏 -->
    <a-layout-sider
      width="320"
      :style="{
        overflow: 'auto',
        backgroundColor: 'transparent',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        borderRight: '1px solid rgba(255, 255, 255, 0.12)',
      }"
    >
      <a-list :data-source="recordResp.methodChains" :bordered="false" size="small">
        <template #renderItem="{ item, index: itemIndex }">
          <a-list-item
            @click="updateMermaidCode(itemIndex)"
            :style="{
              cursor: 'pointer',
              padding: '4px 0',
            }"
          >
            <a-typography-text
              :ellipsis="{ tooltip: true }"
              style="display: block; width: 100%"
              :content="item.message?item.message:item.threadName+' '+item.methodChain"
            >
            </a-typography-text>
          </a-list-item>
        </template>
      </a-list>
    </a-layout-sider>
    <a-layout-content class="main-content">
      <div
        :style="{
          padding: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        }"
      >
        <MermaidRenderer
          v-if="mermaidCode"
          :mermaid-code="mermaidCode"
          :record="recordResp.record"
        />
        <div
          v-else
          style="height: 100%; display: flex; align-items: center; justify-content: center"
        >
          <a-empty description="请在录制后从左侧选择一个方法链查看图表" />
        </div>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useMethodStore } from '@/stores/useMethodStore.js'
import { getInitConfig, mermaidAPI, recordAPI } from '@/apis/method.js'
import MermaidRenderer from '@/components/MermaidRenderer.vue'

const methodStore = useMethodStore()
const recordResp = ref([])
const mermaidCode = ref('')
const timer = ref(null)
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
  const res = await mermaidAPI(
    recordResp.value.record,
    recordResp.value.methodChains[index].callChainId,
  )
  mermaidCode.value = res.data.mermaidCode
}

const doHandleClick = async () => {
  if (recording.value) {
    startPolling()
  } else {
    // 停止录制
    await stopPolling()
  }
}
</script>

<style scoped></style>
