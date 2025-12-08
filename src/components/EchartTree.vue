<template>
  <div class="chart-wrap">
    <div id="chart-container" ref="chartRef" class="echarts-tree"></div>
    <div class="toolbar">
      <input
        v-model="query"
        class="search"
        placeholder="搜索方法名称"
        @focus="isSuggestVisible = true"
        @input="isSuggestVisible = true"
        @blur="hideSuggest"
      />
      <div v-if="isSuggestVisible && suggestList.length" class="suggest">
        <div
          v-for="item in suggestList"
          :key="item.key"
          class="suggest-item"
          @mousedown.prevent
          @click="onSelect(item)"
        >
          <span class="path">{{ item.pathStr }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, onBeforeUnmount, ref, reactive, computed, watch } from 'vue'
const props = defineProps({
  mermaidResponse: Object,
  record: String,
})

const chartRef = ref(null)
let chart
let resizeObserver
function styleByChildren(root) {
  const clone = JSON.parse(JSON.stringify(root))
  const dfs = (node) => {
    const hasChildren = Array.isArray(node.children) && node.children.length > 0
    const isHighlighted = node.itemStyle && (node.itemStyle.borderColor || node.itemStyle.color)
    if (hasChildren) {
      node.symbol = 'circle'
      node.symbolSize = Math.max(8, node.symbolSize || 8)
      node.itemStyle = Object.assign({ color: '#3c4043' }, node.itemStyle || {})
      node.label = Object.assign({ color: '#4d8bf4', fontWeight: 'bold' }, node.label || {})
    } else {
      node.symbol = 'circle'
      node.symbolSize = Math.min(6, node.symbolSize || 6)
      node.itemStyle = Object.assign({ color: '#202124' }, node.itemStyle || {})
      node.label = Object.assign({ color: '#8ab4f8' }, node.label || {})
    }
    if (hasChildren && node.children) node.children.forEach(dfs)
  }
  dfs(clone)
  return clone
}
const render = (data) => {
  if (!chart) return
  chart.hideLoading()
  const styled = styleByChildren(data)
  chart.setOption({
    tooltip: { trigger: 'item', triggerOn: 'mousemove' },
    series: [
      {
        type: 'tree',
        data: [styled],
        top: '1%',
        left: '7%',
        bottom: '1%',
        right: '10%',
        symbolSize: 7,
        label: {
          position: 'top',
          verticalAlign: 'middle',
          align: 'right',
          fontSize: 12,
          color: '#8ab4f8',
          width: 200,
          overflow: 'break',
          ellipsis: '…',
          lineHeight: 16,
          padding: [0, 4],
        },
        leaves: {
          label: {
            position: 'top',
            verticalAlign: 'middle',
            align: 'left',
            color: '#8ab4f8',
            width: 200,
            overflow: 'break',
            ellipsis: '…',
            lineHeight: 16,
            padding: [0, 4],
          },
        },
        labelLayout: {
          hideOverlap: true,
        },
        lineStyle: { color: '#5f6368' },
        emphasis: { focus: 'descendant' },
        expandAndCollapse: true,
        animationDuration: 300,
        animationDurationUpdate: 450,
        roam: true,
        initialTreeDepth: 8,
      },
    ],
  })
}
const state = reactive({
  base: props.mermaidResponse,
  index: [],
  selected: null,
})
const query = ref('')
const isSuggestVisible = ref(false)
const normalize = (s) => (s || '').toLowerCase().replace(/\s+/g, '')
const score = (q, name) => {
  const nq = normalize(q)
  const nn = normalize(name)
  if (!nq) return 0
  if (nn === nq) return 1000
  const i = nn.indexOf(nq)
  if (i >= 0) return 800 - i
  const a = nn
  const b = nq
  const la = a.length
  const lb = b.length
  const dp = Array.from({ length: la + 1 }, () => Array(lb + 1).fill(0))
  for (let i2 = 0; i2 <= la; i2++) dp[i2][0] = i2
  for (let j2 = 0; j2 <= lb; j2++) dp[0][j2] = j2
  for (let i2 = 1; i2 <= la; i2++) {
    for (let j2 = 1; j2 <= lb; j2++) {
      const c = a[i2 - 1] === b[j2 - 1] ? 0 : 1
      dp[i2][j2] = Math.min(dp[i2 - 1][j2] + 1, dp[i2][j2 - 1] + 1, dp[i2 - 1][j2 - 1] + c)
    }
  }
  const dist = dp[la][lb]
  return 600 - dist * 10
}
const suggestList = computed(() => {
  const q = query.value
  if (!q) return []
  return state.index
    .map((it) => ({ ...it, score: Math.max(score(q, it.name), score(q, it.pathStr)) }))
    .filter((it) => it.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
})
const onSelect = (item) => {
  state.selected = item
  query.value = item.name
  const expanded = expandPath(state.base, item.path)
  isSuggestVisible.value = false
  render(expanded)
}
const hideSuggest = () => {
  setTimeout(() => {
    isSuggestVisible.value = false
  }, 120)
}
const buildIndex = (root) => {
  const res = []
  const dfs = (node, path) => {
    const p = [...path, node.name]
    res.push({ key: p.join('>'), name: node.name, path: p, pathStr: p.join(' > ') })
    if (Array.isArray(node.children)) node.children.forEach((c) => dfs(c, p))
  }
  dfs(root, [])
  return res
}
const expandPath = (root, path) => {
  const cloned = JSON.parse(JSON.stringify(root))
  let node = cloned
  node.collapsed = false
  for (let i = 1; i < path.length; i++) {
    const targetName = path[i]
    const children = node.children || []
    children.forEach((c) => {
      const onPath = c.name === targetName
      c.collapsed = onPath ? false : true
      if (onPath) {
        c.itemStyle = { borderColor: '#faad14', borderWidth: 2 }
        c.label = Object.assign({}, c.label || {}, { color: '#faad14' })
      }
    })
    const next = children.find((c) => c.name === targetName)
    if (!next) break
    node = next
  }
  node.itemStyle = { borderColor: '#ff4d4f', borderWidth: 2 }
  node.label = Object.assign({}, node.label || {}, { color: '#ff4d4f', fontWeight: 'bold' })
  node.symbolSize = 10
  return cloned
}

onMounted(async () => {
  chart = echarts.init(chartRef.value)
  chart.showLoading()
  state.index = buildIndex(state.base)
  render(state.base)
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      if (chart) chart.resize()
    })
    resizeObserver.observe(chartRef.value)
  }
})

onBeforeUnmount(() => {
  if (chart) chart.dispose()
  if (resizeObserver) resizeObserver.disconnect()
})

function resetChart() {
  if (!chart) return
  chart.clear()
  chart.showLoading()
  state.base = props.mermaidResponse
  state.index = buildIndex(state.base)
  state.selected = null
  query.value = ''
  isSuggestVisible.value = false
  render(state.base)
}

watch(
  () => props.mermaidResponse,
  () => {
    resetChart()
  },
  { deep: true },
)
</script>

<style scoped>
.chart-wrap {
  position: relative;
}
.echarts-tree {
  width: 100%;
  min-height: 100vh;
  background: #1f1f1f;
}
.toolbar {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #303134;
  z-index: 10;
  padding: 8px 12px;
  border: 1px solid #5f6368;
  border-radius: 8px;
}
.search {
  width: 360px;
  padding: 8px 10px;
  background: #303134;
  color: #e8eaed;
  border: 1px solid #5f6368;
  border-radius: 6px;
}
.suggest {
  width: 480px;
  background: #303134;
  border: 1px solid #5f6368;
  margin-top: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.suggest-item {
  padding: 8px 12px;
  cursor: pointer;
}
.suggest-item:hover {
  background: #3c4043;
}
.path {
  color: #8ab4f8;
  font-size: 13px;
}
</style>
