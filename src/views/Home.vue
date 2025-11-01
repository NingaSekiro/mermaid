<template>
  <a-collapse v-model:activeKey="activeOutKey" @change="updateMethodChains(activeOutKey)" accordion>
    <a-collapse-panel
      v-for="(record, index) in methodStore.methodRecords"
      :key="index"
      :header="record"
    >
      <a-collapse
        v-model:activeKey="activeInKey"
        @change="updateMermaidCode(activeInKey)"
        accordion
      >
        <a-collapse-panel
          v-for="(item, itemIndex) in methodStore.methodChains"
          :key="itemIndex"
          :header="item.methodChain"
        >
          <MermaidRenderer :mermaid-code="methodStore.mermaidCode" />
        </a-collapse-panel>
      </a-collapse>
    </a-collapse-panel>
  </a-collapse>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useMethodStore } from '@/stores/useMethodStore.js'
import MermaidRenderer from '@/components/MermaidRenderer.vue'

const activeOutKey = ref([])
const activeInKey = ref([])
const methodStore = useMethodStore()

onMounted(() => {
  updateMethodRecords()
})

const updateMethodRecords = async () => {
  await methodStore.getMethodRecords()
}

const updateMethodChains = async (item) => {
  if (item === undefined) {
    return
  }
  await methodStore.getMethodChains(methodStore.methodRecords[item])
}

const updateMermaidCode = async (item) => {
  if (item === undefined) {
    return
  }
  await methodStore.getMermaidCode(methodStore.methodChains[item].methodChain)
}
</script>

<style scoped></style>
