<template>
  <div id="container"></div>
  <MethodDetailDrawer ref="methodDetailDrawer"></MethodDetailDrawer>
</template>
<script setup>
import {
  Badge,
  BaseBehavior,
  BaseNode,
  CommonEvent,
  CubicHorizontal,
  ExtensionCategory,
  Graph,
  iconfont,
  idOf,
  NodeEvent,
  positionOf,
  register,
  treeToGraphData,
} from '@antv/g6'
import { Rect, Text } from '@antv/g'

import { onMounted, ref, toRaw, watch, onBeforeUnmount } from 'vue'
import MethodDetailDrawer from '@/components/MethodDetailDrawer.vue'

const methodDetailDrawer = ref()
const props = defineProps({
  mermaidResponse: Object,
  record: String,
})
let graph
let resizeObserver

const style = document.createElement('style')
style.innerHTML = `@import url('${iconfont.css}');`
document.head.appendChild(style)

const RootNodeStyle = {
  fill: '#EFF0F0',
  labelFill: '#262626',
  labelFontSize: 24,
  labelFontWeight: 600,
  labelOffsetY: 8,
  labelPlacement: 'center',
  ports: [{ placement: 'right' }, { placement: 'left' }],
  radius: 8,
}

const NodeStyle = {
  fill: 'transparent',
  // 蓝色
  labelFill: '#007bff',
  radius: 6,
  labelPlacement: 'center',
  labelFontSize: 16,
  ports: [{ placement: 'right-bottom' }, { placement: 'left-bottom' }],
}

const TreeEvent = {
  COLLAPSE_EXPAND: 'collapse-expand',
}

let textShape
const measureText = (text) => {
  if (!textShape) textShape = new Text({ style: text })
  textShape.attr(text)
  return textShape.getBBox().width
}

const getNodeWidth = (nodeId, isRoot) => {
  const padding = isRoot ? 40 : 30
  const nodeStyle = isRoot ? RootNodeStyle : NodeStyle
  return (
    measureText({ text: nodeId, fontSize: nodeStyle.labelFontSize, fontFamily: 'Gill Sans' }) +
    padding
  )
}

const getNodeSize = (nodeId, isRoot) => {
  const width = getNodeWidth(nodeId, isRoot)
  const height = isRoot ? 48 : 32
  return [width, height]
}

class MindmapNode extends BaseNode {
  static defaultStyleProps = {
    showIcon: false,
  }

  constructor(options) {
    Object.assign(options.style, MindmapNode.defaultStyleProps)
    super(options)
  }

  get childrenData() {
    return this.context.model.getChildrenData(this.id)
  }

  isShowCollapse(attributes) {
    const { collapsed, showIcon } = attributes
    return !collapsed && showIcon && this.childrenData.length > 0
  }

  getCollapseStyle(attributes) {
    const { showIcon, color, direction } = attributes
    if (!this.isShowCollapse(attributes)) return false
    const [width, height] = this.getSize(attributes)

    return {
      backgroundFill: color,
      backgroundHeight: 48,
      backgroundWidth: 48,
      cursor: 'pointer',
      // 蓝色
      fill: '#007bff',
      fontFamily: 'iconfont',
      fontSize: 48,
      text: '\ue6e4',
      textAlign: 'center',
      transform: direction === 'left' ? [['rotate', 90]] : [['rotate', -90]],
      visibility: showIcon ? 'visible' : 'hidden',
      x: direction === 'left' ? -6 : width + 6,
      y: height,
    }
  }

  drawCollapseShape(attributes, container) {
    const iconStyle = this.getCollapseStyle(attributes)
    const btn = this.upsert('collapse-expand', Badge, iconStyle, container)

    this.forwardEvent(btn, CommonEvent.CLICK, (event) => {
      event.stopPropagation()
      this.context.graph.emit(TreeEvent.COLLAPSE_EXPAND, {
        id: this.id,
        collapsed: !attributes.collapsed,
      })
    })
  }

  getCountStyle(attributes) {
    const { collapsed, color, direction } = attributes
    const count = this.context.model.getDescendantsData(this.id).length
    if (!collapsed || count === 0) return false
    const [width, height] = this.getSize(attributes)
    return {
      backgroundFill: color,
      backgroundHeight: 24,
      backgroundWidth: 24,
      cursor: 'pointer',
      fill: '#007bff',
      fontSize: 16,
      text: count.toString(),
      textAlign: 'center',
      x: direction === 'left' ? -8 : width + 8,
      y: height,
    }
  }

  drawCountShape(attributes, container) {
    const countStyle = this.getCountStyle(attributes)
    const btn = this.upsert('count', Badge, countStyle, container)

    this.forwardEvent(btn, CommonEvent.CLICK, (event) => {
      event.stopPropagation()
      this.context.graph.emit(TreeEvent.COLLAPSE_EXPAND, {
        id: this.id,
        collapsed: false,
      })
    })
  }

  forwardEvent(target, type, listener) {
    if (target && !Reflect.has(target, '__bind__')) {
      Reflect.set(target, '__bind__', true)
      target.addEventListener(type, listener)
    }
  }

  getKeyStyle(attributes) {
    const [width, height] = this.getSize(attributes)
    const keyShape = super.getKeyStyle(attributes)
    return { width, height, ...keyShape }
  }

  drawKeyShape(attributes, container) {
    const keyStyle = this.getKeyStyle(attributes)
    return this.upsert('key', Rect, keyStyle, container)
  }

  render(attributes = this.parsedAttributes, container = this) {
    super.render(attributes, container)
    this.drawCollapseShape(attributes, container)
    this.drawCountShape(attributes, container)
  }
}

class MindmapEdge extends CubicHorizontal {
  get rootId() {
    return idOf(this.context.model.getRootsData()[0])
  }

  getKeyPath(attributes) {
    const path = super.getKeyPath(attributes)
    const isRoot = this.targetNode.id === this.rootId
    const targetData = this.context.model.getNodeLikeDatum(this.targetNode.id)
    const labelWidth = getNodeWidth(targetData.data.name, isRoot)

    const [, tp] = this.getEndpoints(attributes)
    const sign = this.sourceNode.getCenter()[0] < this.targetNode.getCenter()[0] ? 1 : -1
    return [...path, ['L', tp[0] + labelWidth * sign, tp[1]]]
  }
}

class CollapseExpandTree extends BaseBehavior {
  constructor(context, options) {
    super(context, options)
    this.bindEvents()
  }

  update(options) {
    this.unbindEvents()
    super.update(options)
    this.bindEvents()
  }

  bindEvents() {
    const { graph } = this.context

    graph.on(NodeEvent.POINTER_ENTER, this.showIcon)
    graph.on(NodeEvent.POINTER_LEAVE, this.hideIcon)
    graph.on(TreeEvent.COLLAPSE_EXPAND, this.onCollapseExpand)
    graph.on('node:dblclick', this.openMethodDetailDrawer)
  }

  unbindEvents() {
    const { graph } = this.context

    graph.off(NodeEvent.POINTER_ENTER, this.showIcon)
    graph.off(NodeEvent.POINTER_LEAVE, this.hideIcon)
    graph.off(TreeEvent.COLLAPSE_EXPAND, this.onCollapseExpand)
    graph.off('node:dblclick', this.openMethodDetailDrawer)
  }

  status = 'idle'
  openMethodDetailDrawer = (event) => {
    const { target } = event
    const nodeData = graph.getNodeData(target.id)
    methodDetailDrawer.value.updateDrawerText(nodeData.data.id, props.record)
  }

  showIcon = (event) => {
    this.setIcon(event, true)
  }

  hideIcon = (event) => {
    this.setIcon(event, false)
  }

  setIcon = (event, show) => {
    if (this.status !== 'idle') return
    const { target } = event
    const id = target.id
    const { graph, element } = this.context
    graph.updateNodeData([{ id, style: { showIcon: show } }])
    element.draw({ animation: false, silence: true })
  }

  onCollapseExpand = async (event) => {
    this.status = 'busy'
    const { id, collapsed } = event
    const { graph } = this.context
    if (collapsed) {
      await graph.collapseElement(id)
    } else {
      await graph.expandElement(id)
      await graph.layout()
      await graph.focusElement(id)
    }
    await graph.frontElement(id)
    this.status = 'idle'
  }
}

register(ExtensionCategory.NODE, 'mindmap', MindmapNode)
register(ExtensionCategory.EDGE, 'mindmap', MindmapEdge)
register(ExtensionCategory.BEHAVIOR, 'collapse-expand-tree', CollapseExpandTree)

const getNodeSide = (nodeData, parentData) => {
  if (!parentData) return 'center'

  const nodePositionX = positionOf(nodeData)[0]
  const parentPositionX = positionOf(parentData)[0]
  return parentPositionX > nodePositionX ? 'left' : 'right'
}

onMounted(() => {
  const root = toRaw(props.mermaidResponse.rootNode)
  graph = new Graph({
    autoFit: 'view',
    data: treeToGraphData(root, {
      getNodeData: (datum, depth) => {
        if (!datum.style) {
          datum.style = {}
        }
        datum.style.collapsed = depth >= 10
        if (!datum.children) {
          return datum
        }
        const { children, ...restDatum } = datum
        return { ...restDatum, children: children.map((child) => child.id) }
      },
    }),
    node: {
      type: 'mindmap',
      style: function (datum) {
        const isRoot = idOf(datum) === '0'

        return {
          labelText: datum.data.name,
          size: getNodeSize(datum.data.name, isRoot),
          labelFontFamily: 'Gill Sans',
          // 通过设置节点标签背景来扩大交互区域 | Expand the interaction area by setting the node label background
          labelBackground: true,
          labelBackgroundFill: 'transparent',
          // labelPadding: direction === 'left' ? [2, 0, 10, 40] : [2, 40, 10, 0],
          ...(isRoot ? RootNodeStyle : NodeStyle),
        }
      },
    },
    edge: {
      type: 'mindmap',
      style: {
        lineWidth: 3,
        stroke: function (data) {
          return this.getNodeData(data.target).style.color || '#99ADD1'
        },
      },
    },
    layout: {
      type: 'mindmap',
      direction: 'LR',
      getHeight: () => 30,
      getWidth: (node) => getNodeWidth(node.data.name, node.id === '0'),
      getVGap: () => 6,
      getHGap: () => 60,
      animation: false,
    },
    behaviors: ['drag-canvas', 'zoom-canvas', 'collapse-expand-tree'],
    animation: false,
  })
  graph.render()
  const el = document.getElementById('container')
  if (el && 'ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => {
      if (graph) {
        graph.resize()
      }
    })
    resizeObserver.observe(el)
  }
})

watch(
  () => props.mermaidResponse,
  () => {
    updateGraphData()
  },
)

function updateGraphData() {
  const root = toRaw(props.mermaidResponse.rootNode)
  const data = treeToGraphData(root)
  graph.setData(data)
  graph.render()
}

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<style scoped>
#container {
  width: 100%;
  min-height: 100vh;
  position: absolute;
  overflow: hidden;
}
</style>
