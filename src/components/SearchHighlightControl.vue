<template>
  <div class="search-control">
    <input v-model="keyword" class="search-input" placeholder="搜索方法名称" @input="onInput" />
    <div class="match-info">匹配：{{ matches.length }}</div>
    <div v-if="matches.length" class="suggest">
      <div
        v-for="item in displayMatches"
        :key="item.key"
        class="suggest-item"
        @mousedown.prevent
        @click="onSelect(item)"
      >
        <span class="path">{{ item.pathStrShort }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { NodeLike, SearchIndexItem } from '@/lib/search/indexer'
import { buildIndex, findMatches } from '@/lib/search/indexer'

const props = defineProps<{
  root: NodeLike | null
  limit?: number
}>()

const emit = defineEmits<{ (e: 'highlight', pathIds: string[]): void }>()

const keyword = ref('')
const index = computed(() => (props.root ? buildIndex(props.root) : []))
const matches = ref<SearchIndexItem[]>([])
const limit = computed(() => props.limit ?? 5)
const displayMatches = computed(() => {
  const raw = matches.value || []
  return raw.map((it) => {
    const maxLen = 5
    const ids = it.pathIds
    const names = it.pathNames
    const start = Math.max(0, ids.length - maxLen)
    const pathIdsShort = ids.slice(start)
    const pathStrShort = names.slice(start).join(' > ')
    return {
      pathIdsShort,
      fullPathIds: ids,
      pathStrShort,
      name: it.name,
      key: pathIdsShort.join('>'),
    }
  })
})

function onInput() {
  if (!keyword.value) {
    matches.value = []
    return
  }
  const nq = (keyword.value || '').toLowerCase().replace(/\s+/g, '')
  const ranked = findMatches(index.value, keyword.value, index.value.length)
  const strict = ranked.filter(
    (it) => it.name.toLowerCase().includes(nq) || it.pathStr.toLowerCase().includes(nq),
  )
  matches.value = strict.slice(0, limit.value)
}

function onSelect(item: { pathIdsShort: string[]; fullPathIds: string[]; name: string }) {
  keyword.value = item.name
  emit('highlight', item.fullPathIds)
}

watch(
  () => props.root,
  () => {
    matches.value = keyword.value ? findMatches(index.value, keyword.value, limit.value) : []
  },
)
</script>

<style scoped>
.search-control {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  background: #303134;
  border: 1px solid #5f6368;
  border-radius: 8px;
  padding: 8px 12px;
  width: 380px;
}
.search-input {
  width: 100%;
  padding: 8px 10px;
  background: #303134;
  color: #e8eaed;
  border: 1px solid #5f6368;
  border-radius: 6px;
  outline: none;
}
.match-info {
  margin-top: 6px;
  color: #8ab4f8;
  font-size: 12px;
}
.suggest {
  margin-top: 6px;
  background: #303134;
  border: 1px solid #5f6368;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  max-height: 280px;
  overflow: auto;
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
