<template>
  <a-layout class="main-layout" style="height: 100%">
    <a-layout-sider
      v-show="siderVisible"
      :width="siderWidth"
      :style="{
        position: 'relative',
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: 'transparent',
        borderRight: '1px solid rgba(255, 255, 255, 0.12)',
      }"
    >
      <div style="padding: 8px; display: grid; gap: 6px">
        <slot name="panel" />
      </div>
      <div class="resizer" @mousedown="onResizeStart"></div>
    </a-layout-sider>

    <a-layout-content class="main-content">
      <div :style="{ padding: '24px' }">
        <slot name="chart" />
      </div>
      <div class="toggle-btn">
        <a-tooltip
          :title="siderVisible ? '隐藏侧边栏' : '显示侧边栏'"
          :getPopupContainer="getTooltipContainer"
          placement="top"
          :key="siderVisible ? 'visible' : 'hidden'"
        >
          <div class="toggle-icon" @click="toggleSider">
            <LeftOutlined v-if="siderVisible" />
            <RightOutlined v-else />
          </div>
        </a-tooltip>
      </div>
    </a-layout-content>
  </a-layout>
  
</template>

<script setup>
import { ref } from 'vue'
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue'

const siderWidth = ref(320)
const isResizing = ref(false)
const startX = ref(0)
const startWidth = ref(320)
const minWidth = 240
const maxWidth = 640
const siderVisible = ref(true)
const savedWidth = ref(320)

const onResizeStart = (e) => {
  isResizing.value = true
  startX.value = e.clientX
  startWidth.value = siderWidth.value
  window.addEventListener('mousemove', onResizing)
  window.addEventListener('mouseup', onResizeEnd)
}

const onResizing = (e) => {
  if (!isResizing.value) return
  const dx = e.clientX - startX.value
  let next = startWidth.value + dx
  next = Math.max(minWidth, Math.min(maxWidth, next))
  siderWidth.value = next
}

const onResizeEnd = () => {
  isResizing.value = false
  window.removeEventListener('mousemove', onResizing)
  window.removeEventListener('mouseup', onResizeEnd)
}

const toggleSider = () => {
  if (siderVisible.value) {
    savedWidth.value = siderWidth.value
    siderVisible.value = false
  } else {
    siderWidth.value = savedWidth.value
    siderVisible.value = true
  }
}

const getTooltipContainer = (triggerNode) => triggerNode?.parentElement || document.body
</script>

<style scoped>
.main-content {
  position: relative;
  color: #e5e7eb;
}
.resizer {
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 100%;
  cursor: col-resize;
  background: rgba(255, 255, 255, 0.04);
  transition: background .2s ease;
}
.resizer:hover {
  background: rgba(16, 185, 129, 0.35);
}
.toggle-btn {
  position: absolute;
  left: 8px;    /* 更贴近画布边界 */
  bottom: 8px;  /* 更贴近画布边界 */
}
.toggle-icon {
  width: 28px;
  height: 22px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a1a1aa;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
  transition: all .2s ease;
}
.toggle-icon:hover {
  color: #e5e7eb;
  border-color: rgba(16,185,129,0.45);
}
</style>
