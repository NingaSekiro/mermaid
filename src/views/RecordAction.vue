<template>
  <div>
    <a-checkbox
      v-model:checked="state.checkAll"
      :indeterminate="state.indeterminate"
      @change="onCheckAllChange"
      :disabled="checked"
    >
      录制package
    </a-checkbox>
  </div>
  <a-checkbox-group
    v-model:value="state.checkedList"
    :options="methodStore.packageNames"
    :disabled="checked"
  />
  <br />
  <a-switch
    v-model:checked="checked"
    @click="doHandleClick"
    checked-children="录制中"
    un-checked-children="未录制"
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
      <a-list :data-source="recordingMethodChains" :bordered="false" size="small">
        <template #renderItem="{ item, index: itemIndex }">
          <a-list-item
            @click="updateMermaidCode(itemIndex)"
            :style="{
              cursor: 'pointer',
              padding: '4px 0',
            }"
          >
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
        <MermaidRenderer v-if="mermaidCode" :mermaid-code="mermaidCode" />
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
import { onMounted, reactive, ref, watch } from 'vue'
import { useMethodStore } from '@/stores/useMethodStore.js'
import { mermaidAPI, recordAPI } from '@/apis/method.js'
import MermaidRenderer from '@/components/MermaidRenderer.vue'

const methodStore = useMethodStore()
const recordingMethodChains = ref([])
const mermaidCode = ref('')
const checked = ref(false)
const timer = ref(null)

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const paramsObject = {}
  urlParams.forEach((value, key) => {
    paramsObject[key] = value
  })
  methodStore.setProjectId(paramsObject.projectId)

  await methodStore.getPackageNames(methodStore.projectId)
  state.checkedList = [...methodStore.packageNames]
})

const startPolling = () => {
  timer.value = setInterval(async () => {
    try {
      const params = {
        projectId: methodStore.projectId,
        config: state.checkedList,
        start: true,
      }
      const res = await recordAPI(params)
      recordingMethodChains.value = res.data|| []
    } catch (error) {
      console.error('轮询数据失败:', error)
    }
  }, 5000)
}

const stopPolling = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}
const state = reactive({
  indeterminate: false,
  checkAll: true,
  checkedList: [],
})
const onCheckAllChange = (e) => {
  Object.assign(state, {
    checkedList: e.target.checked ? methodStore.packageNames : [],
    indeterminate: false,
  })
}

const updateMermaidCode = async (index) => {
  if (index === undefined) {
    return
  }
  const res = await mermaidAPI(recordingMethodChains.value[index].methodChain)
  mermaidCode.value = res.data.mermaidCode
}
watch(
  () => state.checkedList,
  (val) => {
    state.indeterminate = !!val.length && val.length < methodStore.packageNames.length
    state.checkAll = val.length === methodStore.packageNames.length
  },
)
const doHandleClick = async () => {
  if (checked.value) {
    startPolling()
  } else {
    // 停止录制
    stopPolling()
    const params = {
      projectId: methodStore.projectId,
      config: state.checkedList,
      start: false,
    }
    await recordAPI(params)
  }
}
</script>

<style scoped></style>
