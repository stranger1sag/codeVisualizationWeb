<template>
  <div class="linked-list-visual">
    <div class="structure-header">
      <span class="structure-name">单链表 (Linked List)</span>
    </div>
    <div class="nodes-container">
      <div v-for="node in nodes" :key="node.id" class="ll-node">
        <div class="node-value">{{ node.value }}</div>
        <div class="node-arrow" v-if="node.next !== null">→</div>
        <div class="node-null" v-else>NULL</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Step } from '@/engine/types'

interface LLNode { id: string; value: number; next: string | null }

const props = defineProps<{ step: Step | null }>()

const nodes = computed((): LLNode[] => {
  if (!props.step) return []
  const d = props.step.data as Record<string, unknown>
  return (d.nodes as LLNode[]) || []
})
</script>

<style scoped>
.linked-list-visual { display: flex; flex-direction: column; align-items: center; gap: 16px; width: 100%; }
.structure-header { font-size: 16px; font-weight: 600; color: var(--text-primary); }
.structure-name { padding: 4px 12px; background: var(--color-primary); color: white; border-radius: 4px; }
.nodes-container { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; justify-content: center; }
.ll-node { display: flex; align-items: center; gap: 2px; padding: 8px 12px; border: 2px solid var(--border); border-radius: 8px; background: var(--surface-elevated); transition: all 0.3s; }
.ll-node.highlighted { border-color: var(--accent-cyan); box-shadow: 0 0 12px rgba(6, 182, 212, 0.3); }
.node-value { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 600; color: var(--text-primary); }
.node-arrow { font-family: 'JetBrains Mono', monospace; font-size: 16px; color: var(--accent-cyan); margin: 0 2px; }
.node-null { color: var(--text-muted); font-size: 11px; }
</style>