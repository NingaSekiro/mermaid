import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchHighlightControl from '@/components/SearchHighlightControl.vue'

const root = {
  id: '0',
  data: { id: 'root', name: 'root' },
  children: [
    {
      id: '1',
      data: { id: '100', name: 'FilterChain' },
      children: [
        { id: '2', data: { id: '1529', name: 'OncePerRequestFilter.isAsyncDispatch()' } },
      ],
    },
  ],
}

describe('SearchHighlightControl interaction', () => {
  it('does not emit highlight on input, only on select', async () => {
    const wrapper = mount(SearchHighlightControl, { props: { root } })
    const input = wrapper.find('input')
    await input.setValue('isAsync')
    await input.trigger('input')

    expect(wrapper.emitted('highlight')).toBeFalsy()

    const items = wrapper.findAll('.suggest-item')
    expect(items.length).toBeGreaterThan(0)
    await items[0].trigger('click')

    const emitted = wrapper.emitted('highlight')
    expect(emitted && emitted.length).toBe(1)
    expect(Array.isArray(emitted![0][0])).toBe(true)
  })

  it('shows only actual substring matches (no padding)', async () => {
    const wrapper = mount(SearchHighlightControl, { props: { root } })
    const input = wrapper.find('input')
    await input.setValue('zzzz-not-match')
    await input.trigger('input')
    const items = wrapper.findAll('.suggest-item')
    expect(items.length).toBe(0)
  })
})
