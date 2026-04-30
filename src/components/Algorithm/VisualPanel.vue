<template>
  <div class="visual-panel">
    <div class="panel-header">
      <span class="panel-title">可视化</span>
      <span class="step-indicator">步骤 {{ currentStep + 1 }} / {{ totalSteps }}</span>
    </div>
    <div class="visual-body">
      <BinarySearchVisual v-if="category === 'search'" :step="step" :steps-key="stepsKey" />
      <ArrayVisual v-else-if="category === 'sort' && hasArray" :step="step" :total-steps="totalSteps" :current-step="currentStep" />
      <StackVisual v-else-if="category === 'data-structure' && showStack" :step="step" />
      <QueueVisual v-else-if="category === 'data-structure' && showQueue" :step="step" />
      <LinkedListVisual v-else-if="category === 'data-structure' && showLinkedList" :step="step" />
      <HashTableVisual v-else-if="category === 'data-structure' && showHashTable" :step="step" />
      <BSTVisual v-else-if="category === 'data-structure' && showBST" :step="step" />
      <div v-else class="empty-state"><p>等待执行...</p></div>
    </div>
    <div v-if="category === 'data-structure'" class="operation-plan-footer">
      <span class="plan-label">操作序列:</span>
      <div class="plan-steps">
        <span v-for="(s, i) in operationSteps" :key="i" 
              class="plan-step" 
              :class="{ 'step-active': i === currentOpIndex, 'step-done': i < currentOpIndex }">
          {{ s }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Step } from '@/engine/types'

import BinarySearchVisual from './BinarySearchVisual.vue'
import ArrayVisual from './ArrayVisual.vue'
import StackVisual from './StackVisual.vue'
import QueueVisual from './QueueVisual.vue'
import LinkedListVisual from './LinkedListVisual.vue'
import HashTableVisual from './HashTableVisual.vue'
import BSTVisual from './BSTVisual.vue'

const props = defineProps<{
  step: Step | null
  totalSteps: number
  currentStep: number
  algorithmCategory: string
  stepsKey?: number
}>()

const category = computed(() => props.algorithmCategory)

// Array check for sort
const hasArray = computed(() => {
  if (!props.step) return false
  const d = props.step.data as Record<string, unknown>
  const arr = d.array
  return Array.isArray(arr) && arr.some((v: unknown) => typeof v === 'number')
})

// Stack check
const showStack = computed(() => {
  if (category.value !== 'data-structure') return false
  const d = props.step?.data as Record<string, unknown> | undefined
  return Array.isArray(d?.items) && typeof d?.front !== 'number'
})

// Queue check
const showQueue = computed(() => {
  if (category.value !== 'data-structure') return false
  const d = props.step?.data as Record<string, unknown> | undefined
  return Array.isArray(d?.items) && typeof d?.front === 'number'
})

// Linked list check
const showLinkedList = computed(() => {
  if (category.value !== 'data-structure') return false
  const d = props.step?.data as Record<string, unknown> | undefined
  return Array.isArray(d?.nodes) && (d.nodes as unknown[]).length > 0
})

// Hash table check (both linear probing and chaining)
const showHashTable = computed(() => {
  if (category.value !== 'data-structure') return false
  const d = props.step?.data as Record<string, unknown> | undefined
  return Array.isArray(d?.table) || Array.isArray(d?.chains)
})

// BST check
const showBST = computed(() => {
  if (category.value !== 'data-structure') return false
  const d = props.step?.data as Record<string, unknown> | undefined
  return Array.isArray(d?.bstNodes) && (d.bstNodes as unknown[]).length > 0
})

// Operation sequence handling
const operationSteps = ref<string[]>([])
const currentOpIndex = ref(0)
const prevStep = ref<Step | null>(null)
const prevCurrentStep = ref(0)

const intermediateOps = ['collision', 'check', 'notFound', 'found', 'inserted', 'overflow', 'underflow', 'create']

watch(() => props.stepsKey, () => {
  operationSteps.value = []
  currentOpIndex.value = 0
  prevStep.value = null
  prevCurrentStep.value = 0
}, { flush: 'post' })

watch(() => props.step, (newStep) => {
  if (newStep === prevStep.value) return
  prevStep.value = newStep
  if (!newStep) return

  const d = newStep.data as Record<string, unknown>
  const op = String(d.operation || '')

  if (op === 'plan') {
    const plan = String(d.operationPlan || '')
    if (plan) {
      operationSteps.value = plan.split(' → ').map(s => s.trim())
      currentOpIndex.value = 0
    }
    return
  }

  if (op === 'done' && operationSteps.value.length > 0) {
    currentOpIndex.value = operationSteps.value.length - 1
    return
  }

  if (op === 'init') {
    currentOpIndex.value = 0
    return
  }

  if (intermediateOps.includes(op)) return

  const isForward = props.currentStep > prevCurrentStep.value
  prevCurrentStep.value = props.currentStep

  if (operationSteps.value.length > 0) {
    if (props.currentStep === 0 && prevCurrentStep.value > 0) {
      currentOpIndex.value = 0
    } else if (isForward) {
      if (currentOpIndex.value < operationSteps.value.length - 1) currentOpIndex.value++
    } else {
      if (currentOpIndex.value > 0) currentOpIndex.value--
    }
  }
}, { immediate: true })
</script>

<style scoped>
.visual-panel {
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border);
  overflow: visible;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}
.panel-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}
.step-indicator {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--text-muted);
}
.visual-body {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 24px;
  overflow: visible;
}
.empty-state { color: var(--text-muted); font-size: 14px; }

.operation-plan-footer { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  padding: 8px 16px; 
  background: var(--bg-tertiary); 
  border-top: 1px solid var(--border); 
  flex-shrink: 0;
}
.operation-plan-footer .plan-label { font-size: 11px; color: var(--text-muted); white-space: nowrap; }
.operation-plan-footer .plan-steps { 
  display: flex; 
  gap: 4px; 
  overflow-x: auto; 
  flex: 1;
  scrollbar-width: thin;
}
.operation-plan-footer .plan-steps::-webkit-scrollbar { height: 4px; }
.operation-plan-footer .plan-steps::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
.operation-plan-footer .plan-step { 
  font-family: 'JetBrains Mono', monospace; 
  font-size: 10px; 
  padding: 2px 6px; 
  background: var(--bg-secondary); 
  border: 1px solid var(--border);
  border-radius: 3px;
  color: var(--text-muted);
  white-space: nowrap;
  flex-shrink: 0;
}
.operation-plan-footer .plan-step.step-active { 
  background: var(--color-primary); 
  color: white; 
  border-color: var(--color-primary);
  font-weight: 600;
}
.operation-plan-footer .plan-step.step-done { 
  background: var(--color-success); 
  color: white; 
  border-color: var(--color-success);
}
</style>