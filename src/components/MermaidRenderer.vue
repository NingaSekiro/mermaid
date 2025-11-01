<template>
  <div v-if="error" class="error-message">
    <a-alert type="error">
      <template #message>
        <div style="white-space: pre-wrap;">{{ mermaidCode }}</div>
      </template>
    </a-alert>
    {{ error }}
  </div>
  <div v-else-if="mermaidCode" v-html="mermaidSvg" class="mermaid-container"></div>
  <div v-else class="placeholder">图表将在这里显示</div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import mermaid from 'mermaid'


// 定义 props
const props = defineProps({
  mermaidCode: {
    type: String,
    default: ''
  }
})

// 组件状态
const mermaidSvg = ref('')
const error = ref('')

// 初始化 mermaid 配置（保持不变）
let tmpThemeVariables = {
  darkMode: true,
  background: '#2b2b2b',
  lineColor: '#a9b7c5',
  primaryColor: '#2b2b2b',
  primaryTextColor: '#a9b7c5',
  actorBkg: '#373b39',
  activationBkgColor: '#373b39',
  actorBorder: '#373b39'
}

mermaid.initialize({
  'startOnLoad': true,
  'maxTextSize': 500000,
  'maxEdges': 5000,
  darkMode: true,
  fontSize: 12,
  sequence: {
    diagramMarginX: 20,
    diagramMarginY: 10,
    messageMargin: 0,
    height: 40,
    width: 60,
    actorMargin: 10,
    wrap: false
  },
  theme: 'base',
  themeVariables: tmpThemeVariables
})
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
    error.value = ''

    await nextTick(() => {
      // 自定义点击事件（例如时序图中的 actor）
      const actors = document.querySelectorAll('.actor')
      actors.forEach((actor) => {
        actor.addEventListener('click', () => {
          console.log('点击了 Actor:', actor.textContent)
        })
      })

      // 也可以针对 messageText（箭头上的文字）
      const messages = document.querySelectorAll('.messageText')
      messages.forEach((msg) => {
        msg.addEventListener('click', () => {
          console.log('点击了消息:', msg.textContent)
        })
      })
    })
  } catch (err) {
    console.error(err)
    error.value = err.message || '渲染失败'
  }
}
// 监听 mermaidCode 变化并重新渲染
watch(() => props.mermaidCode, () => {
  updateGraph()
}, { immediate: true })


</script>


<style scoped>

.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 280px;
  color: #999;
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
