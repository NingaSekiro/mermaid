// src/components/__tests__/MermaidRenderer.test.js
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import MermaidRenderer from '../MermaidRenderer.vue'
import { useMethodStore } from '@/stores/useMethodStore'
import { mockMethods } from '@/test/testdata.js'

// 模拟的 methods 数据


describe('MermaidRenderer.vue', () => {
  it('should render mermaid code based on mocked methods', async () => {
    // 创建测试用的 Pinia 实例，并指定 createSpy
    const wrapper = mount(MermaidRenderer, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn, // 👈 添加这一行
            initialState: {
              method: {
                methods: mockMethods
              }
            }
          })
        ]
      }
    })

    // 获取 store 实例
    const store = useMethodStore()

    // 等待组件更新
    await wrapper.vm.$nextTick()

    // 验证 mermaidCode 是否被设置
    expect(wrapper.vm.mermaidCode).toContain('sequenceDiagram') // 假设 mermaid 代码以 graph TD 开头
  })
})