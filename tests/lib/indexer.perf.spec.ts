import { describe, it, expect } from 'vitest'
import { buildIndex, bestMatchPathIds } from '../../src/lib/search/indexer'

function makeTree(depth: number, breadth: number) {
  const root: any = { id: '0', name: 'root', children: [] }
  let idCounter = 1
  const build = (node: any, d: number) => {
    if (d === depth) return
    node.children = []
    for (let i = 0; i < breadth; i++) {
      const id = String(idCounter++)
      const child = { id, name: `node_${d}_${i}_${id}` }
      node.children.push(child)
      build(child, d + 1)
    }
  }
  build(root, 0)
  return root
}

describe('indexer performance', () => {
  it('builds and searches efficiently on large tree', () => {
    const root = makeTree(4, 20) // ~16800 nodes
    const t0 = performance.now()
    const idx = buildIndex(root)
    const t1 = performance.now()
    const path = bestMatchPathIds(idx, 'node_3_19')
    const t2 = performance.now()
    expect(idx.length).toBeGreaterThan(10000)
    expect(path && path.length).toBeTruthy()
    expect(t1 - t0).toBeLessThan(3000)
    expect(t2 - t1).toBeLessThan(3000)
  })
})
