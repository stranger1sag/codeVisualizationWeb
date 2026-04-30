<template>
  <div class="bst-visual">
    <div class="structure-header">
      <span class="structure-name">二叉搜索树 (BST)</span>
      <span class="operation-badge" :class="operation === 'insert' ? 'op-insert' : operation === 'inserted' ? 'op-inserted' : ''">
        {{ operation === 'insert' ? '插入中' : operation === 'inserted' ? '已插入' : '' }}
      </span>
    </div>
    <div v-if="insertKey !== null" class="key-info">
      <span class="key-label">插入 Key:</span>
      <span class="key-value">{{ insertKey }}</span>
    </div>
    <div class="bst-container">
      <svg class="bst-svg" :viewBox="viewBox">
        <template v-for="(node, idx) in nodes" :key="'edge-l-' + idx">
          <line v-if="node.left !== null"
            :x1="node.x" :y1="node.y"
            :x2="getLeftChildPos(node)?.x ?? node.x"
            :y2="getLeftChildPos(node)?.y ?? node.y"
            class="bst-edge" />
        </template>
        <template v-for="(node, idx) in nodes" :key="'edge-r-' + idx">
          <line v-if="node.right !== null"
            :x1="node.x" :y1="node.y"
            :x2="getRightChildPos(node)?.x ?? node.x"
            :y2="getRightChildPos(node)?.y ?? node.y"
            class="bst-edge" />
        </template>
        <g v-for="(node, idx) in nodes" :key="'node-' + idx">
          <circle :cx="node.x" :cy="node.y" r="22" class="bst-node"
            :class="{ 
              'node-inserting': insertKey === node.value && operation === 'insert',
              'node-inserted': insertKey === node.value && operation === 'inserted'
            }" />
          <text :x="node.x" :y="node.y + 5" class="bst-node-text">{{ node.value }}</text>
        </g>
      </svg>
    </div>
    <div class="bst-stats">
      <span>节点数: {{ nodes.length }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Step } from '@/engine/types'

interface BSTNode { value: number; left: number | null; right: number | null; x: number; y: number }

const props = defineProps<{ step: Step | null }>()

const nodes = computed((): BSTNode[] => {
  if (!props.step) return []
  const d = props.step.data as Record<string, unknown>
  return (d.bstNodes as BSTNode[]) || []
})

const insertKey = computed(() => {
  if (!props.step) return null
  const d = props.step.data as Record<string, unknown>
  return typeof d.insertKey === 'number' ? d.insertKey : null
})

const operation = computed(() => {
  if (!props.step) return ''
  const d = props.step.data as Record<string, unknown>
  return String(d.operation || '')
})

const viewBox = computed(() => {
  if (nodes.value.length === 0) return '0 0 600 400'
  const minX = Math.min(...nodes.value.map(n => n.x))
  const maxX = Math.max(...nodes.value.map(n => n.x))
  const minY = Math.min(...nodes.value.map(n => n.y))
  const maxY = Math.max(...nodes.value.map(n => n.y))
  const padding = 60
  const width = Math.max(maxX - minX + padding * 2, 600)
  const height = Math.max(maxY - minY + padding * 2, 400)
  return `${minX - padding} ${minY - padding} ${width} ${height}`
})

const getLeftChildPos = (node: BSTNode) => {
  if (node.left === null) return null
  const child = nodes.value[node.left]
  return child ? { x: child.x, y: child.y } : null
}

const getRightChildPos = (node: BSTNode) => {
  if (node.right === null) return null
  const child = nodes.value[node.right]
  return child ? { x: child.x, y: child.y } : null
}
</script>

<style scoped>
.bst-visual { display: flex; flex-direction: column; align-items: center; gap: 12px; width: 100%; }
.structure-header { display: flex; align-items: center; gap: 12px; font-size: 16px; font-weight: 600; }
.structure-name { padding: 4px 12px; background: var(--color-primary); color: white; border-radius: 4px; }
.operation-badge { font-size: 11px; padding: 3px 8px; border-radius: 4px; font-weight: 600; }
.operation-badge.op-insert { background: #f59e0b; color: white; }
.operation-badge.op-inserted { background: #22c55e; color: white; }
.key-info { display: flex; align-items: center; gap: 8px; font-size: 14px; }
.key-label { color: var(--text-muted); }
.key-value { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #3b82f6; font-size: 18px; }
.bst-container { width: 100%; flex: 1; display: flex; justify-content: center; align-items: center; padding: 12px; min-height: 0; }
.bst-svg { width: 100%; max-width: 600px; min-height: 150px; }
.bst-edge { stroke: var(--text-muted); stroke-width: 2.5; opacity: 0.7; }
.bst-node { fill: var(--bg-secondary); stroke: var(--color-primary); stroke-width: 2.5; transition: all 0.3s ease; }
.bst-node.node-inserting { fill: rgba(245, 158, 11, 0.3); stroke: #f59e0b; stroke-width: 4; }
.bst-node.node-inserted { fill: rgba(34, 197, 94, 0.3); stroke: #22c55e; stroke-width: 4; }
.bst-node-text { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; fill: var(--text-primary); text-anchor: middle; }
.bst-stats { font-size: 12px; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; }
</style>