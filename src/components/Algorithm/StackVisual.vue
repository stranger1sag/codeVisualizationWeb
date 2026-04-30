<template>
  <div class="structure-visual">
    <div class="structure-header">
      <span class="structure-name">栈 (Stack) - LIFO</span>
    </div>
    <div class="stack-container">
      <div v-for="(item, index) in items" :key="index" 
           class="structure-item stack-item-layout" 
           :class="{ 'is-top': index === items.length - 1, 'is-active': isActive(index) }">
        <span class="item-index">{{ index }}</span>
        <span class="item-value">{{ item }}</span>
      </div>
      <div v-if="items.length === 0" class="structure-empty">空栈</div>
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
.stack-container { display: flex; flex-direction: column-reverse; border: 2px solid var(--border); border-radius: 8px; background: var(--surface-elevated); overflow: hidden; min-width: 180px; }
.structure-item { display: flex; align-items: center; justify-content: center; padding: 16px 20px; border: 2px solid var(--border); background: var(--bg-secondary); transition: all 0.3s ease; position: relative; min-width: 80px; }
.stack-item-layout { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; min-width: 140px; }
.structure-item.is-top { border-color: #3b82f6; background: rgba(59, 130, 246, 0.15); }
.structure-item.is-active { border-color: #f59e0b; box-shadow: 0 0 12px rgba(245, 158, 11, 0.4); transform: scale(1.05); }
.item-index { position: static; order: 1; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-muted); }
.item-value { order: 2; font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 700; color: white; }
.structure-empty { padding: 24px 48px; color: var(--text-muted); font-size: 14px; }
</style>