import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import Home from '@/views/Home.vue'

const mountHome = () =>
  mount(Home, {
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })],
      stubs: {
        'a-collapse': true,
        'a-collapse-panel': true,
        'a-typography-text': true,
        'a-list': true,
        'a-spin': true,
      },
    },
  })

describe('methodChains record selection', () => {
  it('selects correct record for single key', async () => {
    const wrapper = mountHome()
    // @ts-ignore
    const store: any = wrapper.findComponent(Home).vm.$pinia._s.get('method')
    store.methodRecords = ['r0', 'r1', 'r2']
    store.getMethodChains = vi.fn()
    const comp: any = wrapper.vm
    await comp.updateMethodChains([2])
    expect(store.getMethodChains).toHaveBeenCalledWith('r2')
  })

  it('uses newly opened key when multiple keys', async () => {
    const wrapper = mountHome()
    // @ts-ignore
    const store: any = wrapper.findComponent(Home).vm.$pinia._s.get('method')
    store.methodRecords = ['a', 'b', 'c']
    store.getMethodChains = vi.fn()
    const comp: any = wrapper.vm
    await comp.updateMethodChains([0])
    await comp.updateMethodChains([0, 2])
    expect(store.getMethodChains).toHaveBeenLastCalledWith('c')
  })

  it('does not fetch when keys shrink (closing)', async () => {
    const wrapper = mountHome()
    // @ts-ignore
    const store: any = wrapper.findComponent(Home).vm.$pinia._s.get('method')
    store.methodRecords = ['x', 'y']
    store.getMethodChains = vi.fn()
    const comp: any = wrapper.vm
    await comp.updateMethodChains([0, 1])
    store.getMethodChains.mockClear()
    await comp.updateMethodChains([0])
    expect(store.getMethodChains).not.toHaveBeenCalled()
  })

  it('handles string keys from collapse', async () => {
    const wrapper = mountHome()
    // @ts-ignore
    const store: any = wrapper.findComponent(Home).vm.$pinia._s.get('method')
    store.methodRecords = ['p', 'q']
    store.getMethodChains = vi.fn()
    const comp: any = wrapper.vm
    await comp.updateMethodChains(['1'])
    expect(store.getMethodChains).toHaveBeenCalledWith('q')
  })
})