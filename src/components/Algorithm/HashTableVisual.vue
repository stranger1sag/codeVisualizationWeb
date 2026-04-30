<template>
  <div class="hash-table-visual">
    <div class="structure-header">
      <span class="structure-name">{{ isChaining ? '哈希表 (链表法)' : '哈希表 (线性探测)' }}</span>
      <span class="operation-badge" :class="'op-' + operation">{{ operationText }}</span>
    </div>
    <div v-if="currentKey !== null" class="key-info">
      <span class="key-label">当前 Key:</span>
      <span class="key-value">{{ currentKey }}</span>
      <span class="key-hash">(hash = {{ currentKey % size }})</span>
    </div>

    <!-- Linear Probing View -->
    <div v-if="!isChaining" class="hash-table-container">
      <div v-for="i in size" :key="i" class="hash-cell">
        <span class="cell-index">{{ i - 1 }}</span>
        <div class="cell-value" :class="{ 
          'cell-active': isActive(i - 1),
          'cell-found': operation === 'found' && getLinearItem(i - 1)?.value === currentKey,
          'cell-collision': operation === 'collision' && isActive(i - 1)
        }">
          {{ getLinearItem(i - 1)?.value ?? '-' }}
        </div>
      </div>
    </div>

    <!-- Chaining View -->
    <div v-else class="chaining-container">
      <div v-for="(chain, idx) in chains" :key="idx" class="chain-cell">
        <span class="cell-index">{{ idx }}</span>
        <div class="chain-list">
          <div v-for="(key, chainIdx) in chain" :key="chainIdx" 
               class="chain-item"
               :class="{ 
                 'cell-active': isChainingActive(idx, chainIdx),
                 'cell-found': operation === 'found' && key === currentKey
               }">
            {{ key }}
          </div>
          <div v-if="chain.length === 0" class="chain-empty">-</div>
        </div>
      </div>
    </div>

    <div class="hash-legend">
      <span class="legend-item"><span class="legend-dot legend-default"></span>空</span>
      <span class="legend-item"><span class="legend-dot legend-filled"></span>已占用</span>
      <span class="legend-item"><span class="legend-dot legend-active"></span>当前操作</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Step } from '@/engine/types'

const props = defineProps<{ step: Step | null }>()

// Check if using chaining
const isChaining = computed(() => {
  if (!props.step) return false
  const d = props.step.data as Record<string, unknown>
  return Array.isArray(d.chains)
})

// Linear probing data
interface LinearItem { value: number; index: number }
const linearItems = computed((): LinearItem[] => {
  if (!props.step) return []
  const d = props.step.data as Record<string, unknown>
  const table = d.table as number[] | undefined
  if (!Array.isArray(table)) return []
  return table.map((value, index) => ({ value, index })).filter(item => item.value !== -1)
})

const size = computed(() => {
  if (!props.step) return 10
  const d = props.step.data as Record<string, unknown>
  const table = d.table as number[] | undefined
  if (Array.isArray(table)) return table.length
  const chains = d.chains as number[][] | undefined
  return Array.isArray(chains) ? chains.length : 10
})

const getLinearItem = (index: number) => linearItems.value.find(h => h.index === index)

// Chaining data
const chains = computed(() => {
  if (!props.step) return []
  const d = props.step.data as Record<string, unknown>
  return (d.chains as number[][]) || []
})

const currentKey = computed(() => {
  if (!props.step) return null
  const d = props.step.data as Record<string, unknown>
  return typeof d.searchKey === 'number' ? d.searchKey : null
})

const operation = computed(() => {
  if (!props.step) return ''
  const d = props.step.data as Record<string, unknown>
  return String(d.operation || '')
})

const operationText = computed(() => {
  const op = operation.value
  if (op === 'insert' || op === 'inserted') return '插入'
  if (op === 'search' || op === 'found' || op === 'notFound') return '查找'
  if (op === 'collision') return '冲突'
  if (op === 'check') return '检查'
  return ''
})

const isActive = (index: number): boolean => {
  if (!props.step) return false
  const ids = props.step.compareIds ?? []
  return ids.includes(String(index))
}

const isChainingActive = (chainIdx: number, _chainItemIdx: number): boolean => {
  if (!props.step) return false
  const d = props.step.data as Record<string, unknown>
  const hashIndex = d.hashIndex as number | undefined
  return hashIndex === chainIdx
}
</script>

<style scoped>
.hash-table-visual { display: flex; flex-direction: column; align-items: center; gap: 16px; width: 100%; }
.structure-header { display: flex; align-items: center; gap: 12px; font-size: 16px; font-weight: 600; }
.structure-name { padding: 4px 12px; background: var(--color-primary); color: white; border-radius: 4px; }
.operation-badge { font-size: 11px; padding: 3px 8px; border-radius: 4px; font-weight: 600; }
.operation-badge.op-insert, .operation-badge.op-inserted { background: #3b82f6; color: white; }
.operation-badge.op-search, .operation-badge.op-check { background: #8b5cf6; color: white; }
.operation-badge.op-collision { background: #f59e0b; color: white; }
.key-info { display: flex; align-items: center; gap: 8px; font-size: 14px; }
.key-label { color: var(--text-muted); }
.key-value { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #3b82f6; font-size: 18px; }
.key-hash { font-family: 'JetBrains Mono', monospace; color: var(--text-muted); font-size: 12px; }

/* Linear probing */
.hash-table-container { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; padding: 16px; background: var(--bg-tertiary); border-radius: 8px; }
.hash-cell { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.cell-index { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--text-muted); }
.cell-value { width: 50px; height: 40px; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; background: var(--bg-secondary); border: 2px solid var(--border); border-radius: 6px; transition: all 0.3s ease; }
.cell-value:not(:empty) { background: #1e40af; color: white; border-color: #1e40af; }
.cell-active { border-color: #f59e0b; box-shadow: 0 0 12px rgba(245, 158, 11, 0.5); transform: scale(1.1); }
.cell-found { border-color: #22c55e; background: #166534; box-shadow: 0 0 16px rgba(34, 197, 94, 0.5); }
.cell-collision { border-color: #f59e0b; background: #92400e; }

/* Chaining */
.chaining-container { display: flex; gap: 8px; padding: 16px; background: var(--bg-tertiary); border-radius: 8px; overflow-x: auto; }
.chain-cell { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 60px; }
.chain-list { display: flex; flex-direction: column; gap: 2px; }
.chain-item { padding: 6px 12px; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; background: #1e40af; color: white; border-radius: 4px; transition: all 0.3s ease; }
.chain-item.cell-active { border-color: #f59e0b; box-shadow: 0 0 12px rgba(245, 158, 11, 0.5); }
.chain-item.cell-found { background: #166534; border: 2px solid #22c55e; }
.chain-empty { padding: 6px 12px; color: var(--text-muted); font-size: 12px; }

.hash-legend { display: flex; gap: 16px; font-size: 11px; color: var(--text-muted); }
.legend-item { display: flex; align-items: center; gap: 4px; }
.legend-dot { width: 12px; height: 12px; border-radius: 3px; }
.legend-default { background: var(--bg-secondary); border: 1px solid var(--border); }
.legend-filled { background: #1e40af; }
.legend-active { border: 2px solid #f59e0b; box-shadow: 0 0 6px rgba(245, 158, 11, 0.5); }
</style>