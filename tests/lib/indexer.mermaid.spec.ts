import { describe, it, expect } from 'vitest'
import { buildIndex, bestMatchPathIds, findMatches } from '../../src/lib/search/indexer'

const mermaidRoot = {
  id: '0',
  children: [
    {
      id: '1',
      children: [
        {
          id: '2',
          children: [],
          data: { id: '1529', name: 'OncePerRequestFilter.isAsyncDispatch()' },
        },
      ],
      data: { id: '100', name: 'FilterChain' },
    },
  ],
  data: { id: 'root', name: 'root' },
}

describe('indexer with mermaidResponse structure', () => {
  it('builds index using data.name and id path', () => {
    const idx = buildIndex(mermaidRoot as any)
    const leaf = idx.find((x) => x.pathIds.join('>') === '0>1>2')!
    expect(leaf.name).toBe('OncePerRequestFilter.isAsyncDispatch()')
    expect(leaf.pathStr).toContain('FilterChain')
  })

  it('matches by substring and returns best path', () => {
    const idx = buildIndex(mermaidRoot as any)
    const matches = findMatches(idx, 'isAsync', 10)
    expect(matches.length).toBeGreaterThan(0)
    const best = bestMatchPathIds(idx, 'OncePerRequestFilter.isAsyncDispatch')
    expect(best).toEqual(['0', '1', '2'])
  })
})

