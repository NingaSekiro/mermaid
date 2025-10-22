<template>
  <div class="mermaid-renderer">
    <h2 class="title">Mermaid图表实时渲染</h2>
    <div class="editor-section">
      <h3>输入Mermaid代码</h3>
      <a-textarea
        v-model:value="mermaidCode"
        placeholder="在此输入Mermaid图表代码"
        :auto-size="{ minRows: 8, maxRows: 12 }"
      />
    </div>
    <div class="preview-section">
      <h3>预览</h3>
      <div class="preview-container">
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-else-if="mermaidCode" v-html="mermaidSvg" class="mermaid-container"></div>
        <div v-else class="placeholder">图表将在这里显示</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref, watchEffect } from 'vue'
import mermaid from 'mermaid'

// 组件状态
const mermaidCode = ref('')
const mermaidSvg = ref('')
const error = ref('')

// 从方法调用列表生成mermaid时序图代码
const generateMermaidFromMethods = (methodCalls) => {
  const regex = /([\w$.]+)\.(\w+\([^)]*\))$/
  //             ↑类全名部分      ↑方法及参数

  let code = 'sequenceDiagram\n'
  const match = methodCalls[0].methodName.match(regex)
  const fullClassName = match[1]
  let lastComponent = fullClassName.substring(fullClassName.lastIndexOf('.') + 1)

  // 解析方法调用列表
  methodCalls.forEach((call, index) => {
    // 格式: public void com.example.demo.controller.DemoController.testScheduled5()
    const methodPrefix = call.methodName.split(' ').slice(0, 2).join(' ') + ' '
    const match = call.methodName.match(regex)
    const fullClassName = match[1]
    const methodName = methodPrefix + match[2]
    // 提取 simple class 名
    const simpleClassName = fullClassName.substring(fullClassName.lastIndexOf('.') + 1)
    // 根据是否为入参调用确定箭头方向和样式
    if (call.isInboundCall) {
      // 入参调用：使用实线箭头
      code += `    ${lastComponent}->>${simpleClassName}: ${methodName}\n`
    } else {
      // 非入参调用（返回）：使用虚线箭头
      code += `    ${lastComponent}-->>${simpleClassName}: ${methodName}\n`
    }
    lastComponent = simpleClassName
  })

  return code
}

// 示例用法
const exampleMethodCalls = [
  {
    methodName: 'public void com.example.demo.controller.DemoController.testScheduled5()',
    isInboundCall: true
  },
  {
    methodName: 'public void com.example.demo.controller.DemoController.middle(java.lang.Integer)',
    isInboundCall: true
  },
  {
    methodName: 'public void com.example.demo.controller.DemoController.middle(java.lang.Integer)',
    isInboundCall: false
  },
  {
    methodName: 'public void com.example.demo.controller.DemoController.testScheduled5()',
    isInboundCall: false
  }
]

// 可以通过调用此函数并将结果赋给mermaidCode来生成图表
mermaidCode.value = generateMermaidFromMethods(exampleMethodCalls)

// 配置mermaid默认设置
mermaid.initialize({
  startOnLoad: false,
  theme: 'forest',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true
  }
})

watchEffect(
  () => {
    updateGraph()
  },
  { flush: 'post' }
)

// 更新图表
const updateGraph = async () => {
  try {
    const { svg } = await mermaid.render('graphDiv', mermaidCode.value)
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
    error.value = err.message || '渲染失败'
  }
}
</script>


<style scoped>
.mermaid-renderer {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #1a1a1a;
}

.editor-section,
.preview-section {
  background-color: #fafafa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-size: 16px;
}

.preview-container {
  min-height: 300px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 12px;
  background-color: white;
  overflow: auto;
}

.mermaid-container {
  width: 100%;
  height: 100%;
  min-height: 280px;
  display: flex;
  justify-content: center;
  align-items: center;
}

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
