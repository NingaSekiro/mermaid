export type NodeLike = {
  id?: string | number
  name?: string
  data?: { id?: string | number; name?: string }
  children?: NodeLike[]
}

export type SearchIndexItem = {
  key: string
  id?: string
  name: string
  pathNames: string[]
  pathIds: string[]
  pathStr: string
}

const normalize = (s: string) => (s || '').toLowerCase().replace(/\s+/g, '')

export const score = (q: string, nameOrPath: string) => {
  const nq = normalize(q)
  const nn = normalize(nameOrPath)
  if (!nq) return 0
  if (nn === nq) return 1000
  const i = nn.indexOf(nq)
  if (i >= 0) return 800 - i
  const a = nn
  const b = nq
  const la = a.length
  const lb = b.length
  const dp: number[][] = Array.from({ length: la + 1 }, () => Array(lb + 1).fill(0))
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

const getName = (node: NodeLike): string => {
  const dn = node.data && node.data.name
  const nn = node.name
  const id = node.id
  return (dn ?? nn ?? String(id ?? ''))
}

const getId = (node: NodeLike): string => String(node.id ?? getName(node))

export const buildIndex = (root: NodeLike): SearchIndexItem[] => {
  const res: SearchIndexItem[] = []
  const stack: { node: NodeLike; names: string[]; ids: string[] }[] = [{ node: root, names: [], ids: [] }]
  while (stack.length) {
    const { node, names, ids } = stack.pop()!
    const pNames = [...names, getName(node)]
    const pIds = [...ids, getId(node)]
    res.push({
      key: pNames.join('>'),
      id: String(node.id ?? ''),
      name: getName(node),
      pathNames: pNames,
      pathIds: pIds,
      pathStr: pNames.join(' > '),
    })
    if (Array.isArray(node.children)) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push({ node: node.children[i], names: pNames, ids: pIds })
      }
    }
  }
  return res
}

export const findMatches = (index: SearchIndexItem[], keyword: string, limit = 10) => {
  return index
    .map((it) => ({
      ...it,
      _score: Math.max(score(keyword, it.name), score(keyword, it.pathStr)),
    }))
    .filter((it) => it._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, limit)
}

export const bestMatchPathIds = (index: SearchIndexItem[], keyword: string): string[] | null => {
  const matches = findMatches(index, keyword, 1)
  return matches.length ? matches[0].pathIds : null
}
