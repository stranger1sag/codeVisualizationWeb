<template>
  <div class="structure-visual">
    <div class="structure-header">
      <span class="structure-name">队列 (Queue) - FIFO</span>
    </div>
    <div class="queue-container">
      <div v-for="(item, index) in items" :key="index" 
           class="structure-item queue-item-layout" 
           :class="{ 'is-front': index === 0, 'is-rear': index === items.length - 1, 'is-active': isActive(index) }">
        <span class="item-index">{{ index }}</span>
        <span class="item-value">{{ item }}</span>
        <div class="pointer-badges">
          <span v-if="index === 0" class="pointer-badge front">Head</span>
          <span v-if="index === items.length - 1" class="pointer-badge rear">Tail</span>
        </div>
      </div>
      <div v-if="items.length === 0" class="structure-empty">空队列</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Step } from '@/engine/types'

const props = defineProps<{ step: Step | null }>()

const items = computed(() => {
  if (!props.step) return []
  const d = props.step.data as Record<string, unknown>
  return (d.items as number[]) || []
})

const isActive = (index: number): boolean => {
  if (!props.step) return false
  const ids = props.step.compareIds ?? []
  return ids.includes(String(index))
}
</script>

<style scoped>
.structure-visual { display: flex; flex-direction: column; align-items: center; gap: 16px; width: 100%; }
.structure-header { font-size: 16px; font-weight: 600; color: var(--text-primary); }
.structure-name { padding: 4px 12px; background: var(--color-primary); color: white; border-radius: 4px; }
.queue-container { display: flex; border: 2px solid var(--border); border-radius: 8px; background: var(--surface-elevated); overflow: hidden; }
.structure-item { display: flex; align-items: center; justify-content: center; padding: 16px 20px; border: 2px solid var(--border); background: var(--bg-secondary); transition: all 0.3s ease; position: relative; min-width: 80px; }
.queue-item-layout { display: flex; flex-direction: column; align-items: center; padding: 12px 14px; position: relative; }
.queue-item-layout .item-index { position: absolute; top: 2px; left: 4px; font-size: 10px; }
.queue-item-layout .item-value { font-size: 20px; margin-top: 4px; }
.pointer-badges { display: flex; gap: 4px; margin-top: 4px; }
.pointer-badge { font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 600; }
.pointer-badge.front { background: #22c55e; color: white; }
.pointer-badge.rear { background: #8b5cf6; color: white; }
.structure-item.is-front { border-color: #22c55e; background: rgba(34, 197, 94, 0.15); }
.structure-item.is-rear { border-color: #8b5cf6; background: rgba(139, 92, 246, 0.15); }
.structure-item.is-active { border-color: #f59e0b; box-shadow: 0 0 12px rgba(245, 158, 11, 0.4); transform: scale(1.05); }
.structure-empty { padding: 24px 48px; color: var(--text-muted); font-size: 14px; }
</style>