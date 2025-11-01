<template>
  <a-layout class="main-layout" style="height: 100%">
    <!-- 左侧侧边栏 -->
    <a-layout-sider
      width="320"
      :style="{
        overflow: 'auto',
        backgroundColor: 'transparent',
        borderRight: '1px solid rgba(255, 255, 255, 0.12)',
      }"
    >
      <div style="padding: 16px">
        <a-collapse v-model:activeKey="activeOutKey" @change="updateMethodChains(activeOutKey)">
          <a-collapse-panel v-for="(record, index) in methodStore.methodRecords" :key="index">
            <template #header>
              <a-typography-text
                :ellipsis="{ tooltip: true }"
                :content="record"
              >
              </a-typography-text>
            </template>
            <a-list :data-source="methodStore.methodChains" :bordered="false" size="small">
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
                    :content="item.methodChain"
                  >
                  </a-typography-text>
                </a-list-item>
              </template>
            </a-list>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </a-layout-sider>

    <!-- 主内容区域 -->
    <a-layout-content class="main-content">
      <div
        :style="{
          padding: '24px',
        }"
      >
        <MermaidRenderer v-if="methodStore.mermaidCode" :mermaid-code="methodStore.mermaidCode" />
        <div
          v-else
          style="height: 100%; display: flex; align-items: center; justify-content: center"
        >
          <a-empty description="请从左侧选择一个方法链查看图表" />
        </div>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useMethodStore } from '@/stores/useMethodStore.js'
import MermaidRenderer from '@/components/MermaidRenderer.vue'

const activeOutKey = ref([])
const methodStore = useMethodStore()

onMounted(() => {
  updateMethodRecords()
})

const updateMethodRecords = async () => {
  await methodStore.getMethodRecords()
}

const updateMethodChains = async (item) => {
  if (item === undefined || item.length === 0) {
    return
  }
  await methodStore.getMethodChains(methodStore.methodRecords[item[0]])
}

const updateMermaidCode = async (index) => {
  if (index === undefined) {
    return
  }
  await methodStore.getMermaidCode(methodStore.methodChains[index].methodChain)
}
</script>

<style scoped>

</style>
