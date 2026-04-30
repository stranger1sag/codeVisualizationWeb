<template>
  <div class="tree-visual">
    <div class="tree-container">
      <div class="tree-info">
        <span class="info-label">查找目标: </span>
        <span class="info-value target-value">{{ targetValue }}</span>
      </div>
      <!-- Binary search: show left/right range -->
      <div class="tree-info" v-if="!isLinearSearch && !isInterpolationSearch">
        <span class="info-label">搜索范围: </span>
        <span class="info-value range">[{{ left }}, {{ right }}]</span>
      </div>
      <!-- Binary search: show mid value -->
      <div class="tree-info" v-if="midValue !== null && !isLinearSearch && !isInterpolationSearch">
        <span class="info-label">中间值: </span>
        <span class="info-value mid-value" :class="{ 'is-found': midValue === targetValue }">arr[mid = {{ midIndex }}] = {{ midValue }}</span>
      </div>
      <!-- Interpolation search: show pos value -->
      <div class="tree-info" v-if="posValue !== null && isInterpolationSearch">
        <span class="info-label">估算位置: </span>
        <span class="info-value mid-value" :class="{ 'is-found': posValue === targetValue }">arr[pos = {{ posIndex }}] = {{ posValue }}</span>
      </div>
      <!-- Linear search: show current index -->
      <div class="tree-info" v-if="isLinearSearch && currentIndex !== null">
        <span class="info-label">当前索引: </span>
        <span class="info-value mid-value">index = {{ currentIndex }}</span>
      </div>
    </div>
    <div class="array-display">
      <div v-for="(val, index) in arrayValues" :key="index" 
           class="tree-node" 
           :class="getNodeClass(index)">
        <span class="node-val">{{ val }}</span>
        <span class="node-index">{{ index }}</span>
      </div>
    </div>
    <!-- Binary/Interpolation search: show range bar -->
    <div class="range-bar" v-if="left !== null && right !== null && !isLinearSearch">
      <div class="range-label">left = {{ left }}</div>
      <div class="range-track">
        <div class="range-fill" :style="{ left: (left / arrayValues.length * 100) + '%', right: (100 - (right + 1) / arrayValues.length * 100) + '%' }"></div>
      </div>
      <div class="range-label">right = {{ right }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Step } from '@/engine/types'

const props = defineProps<{ step: Step | null; stepsKey?: number }>()

const arrayValues = computed(() => {
  if (!props.step) return []
  const d = props.step.data as Record<string, unknown>
  const arr = d.array
  if (!Array.isArray(arr)) return []
  return arr.filter((v): v is number => typeof v === 'number')
})

const targetValue = computed(() => {
  if (!props.step) return null
  const d = props.step.data as Record<string, unknown>
  return d.target as number ?? null
})

// For binary search - return null when no step or when using linear search
const left = computed(() => {
  if (!props.step) return null
  if (isLinearSearch.value) return null
  const d = props.step.data as Record<string, unknown>
  return typeof d.left === 'number' ? d.left : 0
})

const right = computed(() => {
  if (!props.step) return null
  if (isLinearSearch.value) return null
  const d = props.step.data as Record<string, unknown>
  return typeof d.right === 'number' ? d.right : (arrayValues.value.length > 0 ? arrayValues.value.length - 1 : 0)
})

const midIndex = computed(() => {
  if (!props.step) return null
  const d = props.step.data as Record<string, unknown>
  return typeof d.mid === 'number' ? d.mid : null
})

const midValue = computed(() => {
  if (midIndex.value === null) return null
  return arrayValues.value[midIndex.value] ?? null
})

// For interpolation search - uses 'pos' instead of 'mid'
const posIndex = computed(() => {
  if (!props.step) return null
  const d = props.step.data as Record<string, unknown>
  return typeof d.pos === 'number' ? d.pos : null
})

const posValue = computed(() => {
  if (posIndex.value === null) return null
  return arrayValues.value[posIndex.value] ?? null
})

// For linear search
const currentIndex = computed(() => {
  if (!props.step) return null
  const d = props.step.data as Record<string, unknown>
  return typeof d.index === 'number' ? d.index : null
})

// Track the found index - keep it green once found
const foundIndex = ref<number | null>(null)

// Reset when stepsKey changes (randomize/reset)
watch(() => props.stepsKey, () => {
  foundIndex.value = null
})

watch(() => props.step, (newStep) => {
  if (!newStep) return
  const d = newStep.data as Record<string, unknown>
  const mid = typeof d.mid === 'number' ? d.mid : null
  const pos = typeof d.pos === 'number' ? d.pos : null
  const linearIndex = typeof d.index === 'number' ? d.index : null
  const target = d.target as number | undefined
  
  // Check binary search found
  if (mid !== null && target !== undefined && arrayValues.value[mid] === target) {
    foundIndex.value = mid
  }
  // Check interpolation search found
  if (pos !== null && target !== undefined && arrayValues.value[pos] === target) {
    foundIndex.value = pos
  }
  // Check linear search found
  if (linearIndex !== null && target !== undefined && arrayValues.value[linearIndex] === target) {
    foundIndex.value = linearIndex
  }
  // Reset when starting new search
  if (d.operation === 'init') {
    foundIndex.value = null
  }
}, { immediate: true })

// Determine search type
const isLinearSearch = computed(() => {
  if (!props.step) return false
  const d = props.step.data as Record<string, unknown>
  return 'index' in d
})

const isInterpolationSearch = computed(() => {
  if (!props.step) return false
  const d = props.step.data as Record<string, unknown>
  return 'pos' in d
})

const getNodeClass = (index: number): string => {
  // Keep found index green
  if (foundIndex.value !== null && index === foundIndex.value) {
    return 'node-found'
  }
  // Binary search mid
  if (midIndex.value === index) {
    return midValue.value === targetValue.value ? 'node-found' : 'node-mid'
  }
  // Interpolation search pos (purple)
  if (posIndex.value === index && foundIndex.value === null) {
    return posValue.value === targetValue.value ? 'node-found' : 'node-mid'
  }
  // Linear search current index (purple)
  if (currentIndex.value === index && foundIndex.value === null) {
    return 'node-mid'
  }
  // Binary/Interpolation search range - only apply for these, not linear search
  if (!isLinearSearch.value && left.value !== null && right.value !== null) {
    if (index < left.value || index > right.value) {
      return 'node-inactive'
    }
  }
  return 'node-active'
}
</script>

<style scoped>
.tree-visual { display: flex; flex-direction: column; align-items: center; gap: 24px; width: 100%; }
.tree-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; }
.tree-info { display: flex; align-items: center; gap: 8px; font-size: 14px; }
.info-label { color: var(--text-muted); }
.info-value { font-family: 'JetBrains Mono', monospace; font-weight: 600; }
.target-value { color: #f59e0b; font-size: 18px; }
.range-value { color: #3b82f6; }
.mid-value { color: #8b5cf6; }
.mid-value.is-found { color: #22c55e; }
.array-display { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.tree-node { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 8px; border: 2px solid; transition: all 0.3s ease; }
.tree-node.node-active { border-color: #3b82f6; background: rgba(59, 130, 246, 0.1); }
.tree-node.node-inactive { border-color: #374151; background: rgba(55, 65, 81, 0.3); opacity: 0.5; }
.tree-node.node-mid { border-color: #8b5cf6; background: rgba(139, 92, 246, 0.2); box-shadow: 0 0 12px rgba(139, 92, 246, 0.4); }
.tree-node.node-found { border-color: #22c55e; background: rgba(34, 197, 94, 0.3); box-shadow: 0 0 16px rgba(34, 197, 94, 0.5); }
.node-val { font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; color: white; }
.node-index { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--text-muted); }
.range-bar { display: flex; align-items: center; gap: 12px; width: 100%; max-width: 500px; }
.range-label { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-muted); min-width: 80px; text-align: center; }
.range-track { flex: 1; height: 8px; background: #374151; border-radius: 4px; position: relative; }
.range-fill { position: absolute; height: 100%; background: rgba(59, 130, 246, 0.5); border-radius: 4px; transition: all 0.3s ease; }
</style>