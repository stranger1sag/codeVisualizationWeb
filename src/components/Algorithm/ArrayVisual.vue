<template>
  <div class="array-visual-container">
    <!-- Count array display for counting sort -->
    <div v-if="countArray.length > 0" class="count-array">
      <div class="array-label">计数数组:</div>
      <div class="count-bars">
        <div v-for="(count, idx) in countArray" :key="idx" class="count-bar-wrapper">
          <div class="count-bar" 
               :style="{ height: (count * 20 + 20) + 'px' }"
               :class="{ 'count-active': isCountActive(idx) }">
            <span class="count-value">{{ count }}</span>
          </div>
          <span class="count-index">{{ idx }}</span>
        </div>
      </div>
    </div>
    
    <!-- Main array -->
    <div class="array-visual">
      <div v-for="(val, index) in values" :key="index" class="array-bar-wrapper">
        <div class="array-bar" :style="{ height: barHeight(val) + 'px', backgroundColor: getColor(index) }">
          <span class="bar-value">{{ val }}</span>
        </div>
        <span class="bar-index">{{ index }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Step } from '@/engine/types'
import { STATE_COLORS } from '@/engine/types'

const props = defineProps<{ 
  step: Step | null
  totalSteps: number
  currentStep: number
}>()

const values = computed(() => {
  if (!props.step) return []
  const d = props.step.data as Record<string, unknown>
  const arr = d.array
  if (!Array.isArray(arr)) return []
  return arr.filter((v): v is number => typeof v === 'number')
})

const countArray = computed(() => {
  if (!props.step) return []
  const d = props.step.data as Record<string, unknown>
  const count = d.count as number[] | undefined
  if (!Array.isArray(count)) return []
  return count
})

const compareIds = computed(() => props.step?.compareIds ?? [])
const swapIds = computed(() => props.step?.swapIds ?? [])
const noSwapIds = computed(() => props.step?.noSwapIds ?? [])
const sortedIds = computed(() => props.step?.sortedIds ?? [])

// For highlighting count array during counting phase
const isCountActive = (idx: number): boolean => {
  if (!props.step) return false
  const d = props.step.data as Record<string, unknown>
  const currentVal = d.rebuildVal as number | undefined
  return currentVal === idx
}

const barHeight = (val: number): number => {
  const arr = values.value
  if (arr.length === 0) return 30
  const max = Math.max(...arr)
  const min = Math.min(...arr)
  if (max === min) return 60
  const minHeight = 30, maxHeight = 200
  return Math.round(((val - min) / (max - min)) * (maxHeight - minHeight) + minHeight)
}

const getColor = (index: number) => {
  const total = values.value.length
  if (sortedIds.value.length === total && total > 0) {
    const stepsFromEnd = props.totalSteps - 1 - props.currentStep
    const greenCount = Math.max(0, Math.min(total - stepsFromEnd + 2, total))
    if (index < greenCount) return STATE_COLORS.sorted
  }
  if (swapIds.value?.includes(String(index))) return STATE_COLORS.swapping
  if (noSwapIds.value?.includes(String(index))) return '#ef4444'
  if (compareIds.value?.includes(String(index))) return STATE_COLORS.comparing
  return STATE_COLORS.default
}
</script>

<style scoped>
.array-visual-container { display: flex; flex-direction: column; gap: 16px; }
.count-array { margin-bottom: 8px; }
.array-label { font-size: 12px; color: var(--text-muted); margin-bottom: 8px; }
.count-bars { display: flex; align-items: flex-end; gap: 4px; padding: 8px; background: var(--bg-tertiary); border-radius: 8px; overflow-x: auto; }
.count-bar-wrapper { display: flex; flex-direction: column; align-items: center; gap: 2px; min-width: 24px; }
.count-bar { width: 24px; background: #6366f1; border-radius: 3px; display: flex; align-items: flex-start; justify-content: center; transition: all 0.3s ease; }
.count-bar.count-active { background: #f59e0b; box-shadow: 0 0 8px rgba(245, 158, 11, 0.5); }
.count-value { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600; color: white; padding: 2px; }
.count-index { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-muted); }
.array-visual { display: flex; align-items: flex-end; gap: 8px; padding: 16px 0; }
.array-bar-wrapper { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.array-bar { width: 36px; min-height: 20px; border-radius: 4px 4px 0 0; display: flex; align-items: flex-start; justify-content: center; padding-top: 4px; transition: background-color 0.2s ease; }
.bar-value { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
.bar-index { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--text-muted); }
</style>