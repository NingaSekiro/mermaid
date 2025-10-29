<template>
  <a-collapse v-model:activeKey="activeKey" accordion>
    <a-collapse-panel
      v-for="(record, index) in methodStore.methodRecords"
      :key="index"
      :header="record"
      @click="updateMethodChains(record)">
      <a-collapse>
        <a-collapse-panel
          v-for="(item, itemIndex) in methodStore.methodChains"
          :key="itemIndex"
          :header="item.methodChain"
          @click.stop="updateMermaidCode(item)">
            <MermaidRenderer :mermaid-code="myMermaidCode" />
        </a-collapse-panel>
      </a-collapse>
    </a-collapse-panel>
  </a-collapse>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useMethodStore } from '@/stores/useMethodStore.js'
import MermaidRenderer from '@/components/MermaidRenderer.vue'

const activeKey = ref([])
const methodStore = useMethodStore()

onMounted(() => {
  updateMethodRecords()
})
const myMermaidCode = ref(`sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!`)
const updateMethodRecords = async () => {
  await methodStore.getMethodRecords()
}

const updateMethodChains = async (record) => {
  await methodStore.getMethodChains(record)
}


const updateMermaidCode = async (item) => {
  await methodStore.getMermaidCode(item.methodChain)
}
</script>


<style scoped>

</style>