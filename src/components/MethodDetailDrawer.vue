<template>
  <a-drawer v-model:open="drawerOpen" placement="right" :width="480" :title="drawerText">
    <a-skeleton active :loading="detailLoading">
      <a-descriptions bordered :column="1" size="small">
        <a-descriptions-item label="方法名">
          <span class="code-text">{{ methodStore.methodDetail.method || '-' }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="参数">
          <pre class="code-block">{{ methodStore.methodDetail.args || '-' }}</pre>
        </a-descriptions-item>
        <a-descriptions-item label="返回值">
          <pre class="code-block">{{ methodStore.methodDetail.returnValue || '-' }}</pre>
        </a-descriptions-item>
        <a-descriptions-item label="目标对象">
          <span class="mono">{{ methodStore.methodDetail.target || '-' }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="时间戳">
          <span class="mono">{{ methodStore.methodDetail.timestamp || '-' }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="记录ID">
          <span class="mono">{{ methodStore.methodDetail.id ?? '-' }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="调用链ID">
          <span class="mono">{{ (methodStore.methodDetail as any).callChainId || '-' }}</span>
        </a-descriptions-item>
      </a-descriptions>
    </a-skeleton>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMethodStore } from '@/stores/useMethodStore.ts'

const drawerOpen = ref<boolean>(false)
const drawerText = ref<string>('')
const detailLoading = ref<boolean>(false)
const methodStore = useMethodStore()
const updateDrawerText = async (id: string, record: string): Promise<void> => {
  try {
    detailLoading.value = true
    await methodStore.getMethodDetail(id, record)
    drawerOpen.value = true
  } finally {
    detailLoading.value = false
  }
}
defineExpose({
  updateDrawerText
})
</script>

<style scoped></style>
