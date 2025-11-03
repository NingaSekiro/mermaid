<template>
  <div v-if="error" class="error-message">
    <a-alert type="error">
      <template #message>
        <div style="white-space: pre-wrap">{{ mermaidCode }}</div>
      </template>
    </a-alert>
    {{ error }}
  </div>
  <div
    v-else-if="mermaidCode"
    class="canvas"
    ref="canvasRef"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
    @mousemove="onMouseMove"
    @wheel.prevent="onWheel"
  >
    <div class="stage" :style="transformStyle" v-html="mermaidSvg"></div>
  </div>
  <div v-else class="placeholder">图表将在这里显示</div>
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
          <span class="mono">{{ methodStore.methodDetail.callChainId ?? '-' }}</span>
        </a-descriptions-item>
      </a-descriptions>
    </a-skeleton>
  </a-drawer>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import mermaid from 'mermaid'
import { useMethodStore } from '@/stores/useMethodStore.js'

// 定义 props
const props = defineProps({
  mermaidCode: {
    type: String,
    default: '',
  },
  record: {
    type: String,
    default: '',
  },
})

// 组件状态
const mermaidSvg = ref('')
const error = ref('')

// 抽屉状态
const drawerOpen = ref(false)
const drawerText = ref('')
const detailLoading = ref(false)

// 画布交互状态
const canvasRef = ref(null)
const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const isPanning = ref(false)
const panStartX = ref(0)
const panStartY = ref(0)
const panOriginX = ref(0)
const panOriginY = ref(0)

const transformStyle = computed(() => ({
  transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`,
  transformOrigin: '0 0',
}))

// 初始化 mermaid 配置（保持不变）
let tmpThemeVariables = {
  darkMode: true,
  background: '#2b2b2b',
  lineColor: '#a9b7c5',
  primaryColor: '#2b2b2b',
  primaryTextColor: '#a9b7c5',
  actorBkg: '#373b39',
  activationBkgColor: '#373b39',
  actorBorder: '#373b39',
}

mermaid.initialize({
  startOnLoad: true,
  maxTextSize: 500000,
  maxEdges: 5000,
  darkMode: true,
  fontSize: 12,
  sequence: {
    diagramMarginX: 20,
    diagramMarginY: 10,
    messageMargin: 0,
    height: 40,
    width: 60,
    actorMargin: 10,
    wrap: false,
  },
  theme: 'base',
  themeVariables: tmpThemeVariables,
})
const methodStore = useMethodStore()
const updateDrawerText = async (id, record) => {
  try {
    detailLoading.value = true
    await methodStore.getMethodDetail(id, record)
  } finally {
    detailLoading.value = false
  }
}
// 更新图表
const updateGraph = async () => {
  try {
    if (!props.mermaidCode) {
      mermaidSvg.value = ''
      error.value = ''
      return
    }

    console.log('start update')
    // 不同id 回去时组件不用重新update，同时还保留有原本的dom
    const { svg } = await mermaid.render('graphDiv-' + Date.now(), props.mermaidCode)
    mermaidSvg.value = svg
    // 渲染后重置视图
    scale.value = 1
    translateX.value = 0
    translateY.value = 0
    error.value = ''

    await nextTick(() => {
      // 自定义点击事件（例如时序图中的 actor）
      const actors = document.querySelectorAll('.actor')
      actors.forEach((actor) => {
        actor.addEventListener('click', () => {
          console.log('点击了 Actor:', actor.textContent)
        })
      })

      // messageText（箭头上的文字）- 仅对包含()的项启用抽屉
      const messages = document.querySelectorAll('.messageText')
      messages.forEach((msg) => {
        const text = (msg.textContent || '').trim()
        const hasParen = text.includes('(') && text.includes(')')
        if (!hasParen) return
        const id = text.split('-')[0]

        // 标记可点击
        msg.classList.add('clickable')

        // 绑定点击事件
        msg.addEventListener('click', (e) => {
          e.stopPropagation()
          updateDrawerText(id, props.record)
          drawerText.value = text
          drawerOpen.value = true
        })
      })
    })
  } catch (err) {
    console.error(err)
    error.value = err.message || '渲染失败'
  }
}

// 监听 mermaidCode 变化并重新渲染
watch(
  () => props.mermaidCode,
  () => {
    updateGraph()
  },
  { immediate: true },
)

// 交互：拖拽平移
const onMouseDown = (e) => {
  if (e.button !== 0) return
  isPanning.value = true
  panStartX.value = e.clientX
  panStartY.value = e.clientY
  panOriginX.value = translateX.value
  panOriginY.value = translateY.value
}

const onMouseMove = (e) => {
  if (!isPanning.value) return
  const dx = e.clientX - panStartX.value
  const dy = e.clientY - panStartY.value
  translateX.value = panOriginX.value + dx
  translateY.value = panOriginY.value + dy
}

const onMouseUp = () => {
  isPanning.value = false
}

// 交互：滚轮缩放（以光标为中心）
const clamp = (val, min, max) => Math.min(Math.max(val, min), max)
const onWheel = (e) => {
  const container = canvasRef.value
  if (!container) return

  const rect = container.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top

  const zoomIntensity = 0.1
  const wheel = e.deltaY < 0 ? 1 : -1
  const newScale = clamp(scale.value * (1 + wheel * zoomIntensity), 0.1, 8)

  // 将光标下的点保持不动
  const worldX = (mouseX - translateX.value) / scale.value
  const worldY = (mouseY - translateY.value) / scale.value

  scale.value = newScale
  translateX.value = mouseX - worldX * scale.value
  translateY.value = mouseY - worldY * scale.value
}
</script>

<style scoped>
.canvas {
  position: relative;
  width: 100%;
  height: 100vh; /* 占满可视高度 */
  min-height: 100vh;
  overflow: hidden;
  background: radial-gradient(circle at 25% 25%, #232323 0%, #1f1f1f 60%);
  cursor: grab;
  user-select: none;
}

.canvas:active {
  cursor: grabbing;
}

.stage :deep(svg) {
  display: block;
}

.stage :deep(.messageText.clickable) {
  cursor: pointer;
  fill: #69b1ff; /* 静态：可点击色（暗黑下的次强调） */
  transition: fill 160ms ease;
}

.stage :deep(.messageText.clickable:hover) {
  fill: #91caff; /* 悬浮：略微提亮 */
  text-decoration: underline; /* 悬浮：下划线 */
}

.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 280px;
  color: #999;
}

.code-text {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
  color: #cdd6f4;
}

.mono {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
  color: #a6adc8;
}

.code-block {
  margin: 0;
  padding: 8px 10px;
  max-height: 200px;
  overflow: auto;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  color: #cdd6f4;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.error-message {
  color: #ff4d4f;
  padding: 10px;
  border: 1px solid #ffccc7;
  background-color: #fff2f0;
  border-radius: 4px;
  font-size: 14px;
}
</style>
