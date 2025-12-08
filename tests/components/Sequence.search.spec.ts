import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import Sequence from '@/components/Sequence.vue'

const calls: any[] = []

vi.mock('@antv/g6', async () => {
  class Graph {
    constructor() {}
    render() {}
    setData() {}
    updateNodeData(data: any[]) {
      calls.push(...data)
    }
    async expandElement() {
      return
    }
    async layout() {
      return
    }
    frontElement() {}
    async focusElement() {
      return
    }
    resize() {}
  }
  return {
    Graph,
    BaseBehavior: class {},
    BaseNode: class {},
    CubicHorizontal: class {},
    ExtensionCategory: { NODE: 'node', EDGE: 'edge', BEHAVIOR: 'behavior' },
    register: () => {},
    idOf: (d: any) => d.id,
    positionOf: () => [0, 0],
    treeToGraphData: (root: any) => root,
    NodeEvent: { POINTER_ENTER: 'enter', POINTER_LEAVE: 'leave' },
    CommonEvent: { CLICK: 'click' },
    iconfont: { css: '' },
  }
})

describe('Sequence search integration', () => {
  it('highlights path on search', async () => {
    const wrapper = mount(Sequence, {
      props: {
        mermaidResponse: {
          rootNode: {
            id: '0',
            name: 'root',
            children: [
              { id: 'a', name: 'ServiceA', children: [{ id: 'a1', name: 'methodFoo' }] },
              { id: 'b', name: 'ServiceB', children: [{ id: 'b1', name: 'doWork' }] },
            ],
          },
        },
        record: 'rec',
      },
      attachTo: document.body,
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          MethodDetailDrawer: { template: '<div />' },
          'a-descriptions-item': true,
          'a-descriptions': true,
          'a-skeleton': true,
          'a-drawer': true,
        },
      },
    })

    // @ts-ignore
    await wrapper.vm.search('doWork')
    const targetUpdates = calls.filter((c) => c.id === 'b1')
    expect(targetUpdates.length).toBeGreaterThan(0)
    // labelFill should be set to highlight color
    expect(targetUpdates[targetUpdates.length - 1].style.labelFill).toBe('#ff4d4f')
  })
})
