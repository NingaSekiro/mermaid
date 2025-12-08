import { describe, it, expect } from 'vitest'
import { buildIndex, findMatches, bestMatchPathIds, score } from '../../src/lib/search/indexer'

const sample = {
  id: '0',
  name: 'root',
  children: [
    {
      id: 'a',
      name: 'ServiceA',
      children: [{ id: 'a1', name: 'methodFoo' }, { id: 'a2', name: 'methodBar' }],
    },
    {
      id: 'b',
      name: 'ServiceB',
      children: [{ id: 'b1', name: 'doWork' }, { id: 'b2', name: 'doMore' }],
    },
  ],
}

describe('indexer', () => {
  it('builds index with path ids and names', () => {
    const idx = buildIndex(sample)
    const leaf = idx.find((x) => x.id === 'a1')!
    expect(leaf.pathIds).toEqual(['0', 'a', 'a1'])
    expect(leaf.pathNames).toEqual(['root', 'ServiceA', 'methodFoo'])
    expect(leaf.pathStr).toBe('root > ServiceA > methodFoo')
  })

  it('scores exact > substring > fuzzy', () => {
    expect(score('methodFoo', 'methodFoo')).toBe(1000)
    expect(score('Foo', 'methodFoo')).toBeGreaterThan(0)
    expect(score('mthdFo', 'methodFoo')).toBeGreaterThan(0)
  })

  it('finds matches and best path', () => {
    const idx = buildIndex(sample)
    const matches = findMatches(idx, 'do')
    expect(matches.length).toBeGreaterThan(0)
    const best = bestMatchPathIds(idx, 'doWork')
    expect(best).toEqual(['0', 'b', 'b1'])
  })
})

