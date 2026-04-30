<template>
  <div class="algorithm-page">
    <div class="page-header">
      <div class="page-header-inner">
        <router-link to="/" class="back-link">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          返回首页
        </router-link>
        <div class="algorithm-info">
          <h1 class="algorithm-title">{{ algo.name }}</h1>
          <p class="algorithm-description">{{ algo.description }}</p>
        </div>
        <div class="algorithm-complexity">
          <div class="complexity-badge"><span class="complexity-label">Best</span><code>{{ algo.complexity.best }}</code></div>
          <div class="complexity-badge"><span class="complexity-label">Average</span><code>{{ algo.complexity.average }}</code></div>
          <div class="complexity-badge"><span class="complexity-label">Worst</span><code>{{ algo.complexity.worst }}</code></div>
          <div class="complexity-badge"><span class="complexity-label">Space</span><code>{{ algo.complexity.space }}</code></div>
        </div>
      </div>
    </div>
    <div class="page-content">
      <ControlBar :is-playing="isPlaying" :current-step="currentStep" :total-steps="mockSteps.length"
        :speed="speed" :custom-input="customInput" :show-custom-input="algo.category !== 'data-structure'"
        @toggle-play="togglePlay" @step-forward="stepForward"
        @step-back="stepBack" @reset="reset" @update-speed="updateSpeed" @randomize="randomize"
        @update-custom-input="customInput = $event" @apply-custom-input="applyCustomInput" />
      <div class="split-layout">
        <div class="code-panel-wrapper">
          <CodePanel :code="algo.code" :active-line="stepData?.line ?? 0" />
        </div>
        <div class="viz-panel-wrapper">
          <VisualPanel :step="stepData ?? null" :total-steps="mockSteps.length" :current-step="currentStep" :algorithm-category="algo.category" :steps-key="stepsKey" />
        </div>
      </div>
      <div class="variable-panel-wrapper">
        <VariablePanel :variables="stepData?.variables ?? {}" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ControlBar from '@/components/Algorithm/ControlBar.vue'
import CodePanel from '@/components/Algorithm/CodePanel.vue'
import VisualPanel from '@/components/Algorithm/VisualPanel.vue'
import VariablePanel from '@/components/Algorithm/VariablePanel.vue'
import type { Step } from '@/engine/types'
import { getAlgorithm } from '@/engine/registry'

interface AlgorithmInfo {
  name: string
  slug: string
  category: string
  description: string
  icon: string
  complexity: { best: string; average: string; worst: string; space: string }
  code: string
}

const props = defineProps<{ name: string }>()
const isPlaying = ref(false)
const currentStep = ref(0)
const speed = ref(1)
const customInput = ref('')
const playInterval = ref<number | null>(null)
const customArray = ref<number[] | null>(null)

// Trigger to force regenerate steps when randomizing
const stepsKey = ref(0)

// Get algorithm from engine registry
function makeAlgo(): AlgorithmInfo {
  const algorithm = getAlgorithm(props.name)
  if (algorithm) {
    const icons: Record<string, string> = {
      'sort': '📊',
      'data-structure': '🏗️',
      'search': '🔍'
    }
    return {
      name: algorithm.name,
      slug: algorithm.id,
      category: algorithm.category,
      description: algorithm.description,
      icon: icons[algorithm.category] || '📊',
      complexity: algorithm.complexity || { best: '-', average: '-', worst: '-', space: '-' },
      code: algorithm.code,
    }
  }
  return {
    name: props.name ?? '未知算法',
    slug: props.name,
    category: 'sort',
    description: '算法详情加载中...',
    icon: '🔧',
    complexity: { best: '-', average: '-', worst: '-', space: '-' },
    code: '// 算法实现加载中...',
  }
}

const algo = computed<AlgorithmInfo>(() => makeAlgo())

// Get appropriate array size for different algorithm categories
function getArraySize(category: string): number {
  if (category === 'data-structure') return 5  // Smaller for data structures
  if (category === 'search') return 10
  return 10
}

// Generate steps using real algorithm implementations from engine
function makeSteps(): Step[] {
  const algorithm = getAlgorithm(props.name)
  if (algorithm) {
    // Use custom array if provided, otherwise random array
    let arr: number[]
    if (customArray.value && customArray.value.length > 0) {
      arr = [...customArray.value]
    } else {
      const size = getArraySize(algorithm.category)
      arr = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1)
    }
    return algorithm.run(arr)
  }
  
  // Fallback: random array for unknown algorithms
  const steps: Step[] = []
  const arr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1)
  const arrCopy = [...arr]

  for (let i = 0; i < arrCopy.length - 1; i++) {
    for (let j = 0; j < arrCopy.length - i - 1; j++) {
      steps.push({
        line: 5,
        data: { array: [...arrCopy] },
        compareIds: [String(j), String(j + 1)],
        swapIds: [],
        variables: { i, j, n: arrCopy.length },
        description: `比较 arr[${j}]=${arrCopy[j]} 和 arr[${j + 1}]=${arrCopy[j + 1]}`,
      })

      if (arrCopy[j] > arrCopy[j + 1]) {
        const temp = arrCopy[j]
        arrCopy[j] = arrCopy[j + 1]
        arrCopy[j + 1] = temp

        steps.push({
          line: 7,
          data: { array: [...arrCopy] },
          compareIds: [],
          swapIds: [String(j), String(j + 1)],
          variables: { i, j, n: arrCopy.length },
          description: `交换: ${arrCopy[j]} < ${arrCopy[j + 1]}`,
        })
      }
    }
  }

  steps.push({
    line: 13,
    data: { array: [...arrCopy] },
    compareIds: [],
    swapIds: [],
    variables: { n: arrCopy.length },
    description: '排序完成！',
  })

  return steps
}

const mockSteps = computed<Step[]>(() => {
  void stepsKey.value
  return makeSteps()
})
const stepData = computed<Step | undefined>(() => mockSteps.value[currentStep.value])

function togglePlay() { isPlaying.value = !isPlaying.value }
function stepForward() { if (currentStep.value < mockSteps.value.length - 1) currentStep.value++; else isPlaying.value = false }
function stepBack() { if (currentStep.value > 0) currentStep.value-- }
function reset() { isPlaying.value = false; currentStep.value = 0; stopAutoPlay() }
function updateSpeed(v: number) { speed.value = v; if (isPlaying.value) { stopAutoPlay(); startAutoPlay() } }
function startAutoPlay() { stopAutoPlay(); playInterval.value = window.setInterval(() => stepForward(), 800 / speed.value) }
function stopAutoPlay() { if (playInterval.value) { clearInterval(playInterval.value); playInterval.value = null } }
watch(isPlaying, p => { p ? startAutoPlay() : stopAutoPlay() })

// Randomize - regenerate steps with new random array, clear custom array
function randomize() { 
  customArray.value = null
  stepsKey.value++
  currentStep.value = 0 
}

function applyCustomInput() {
  if (!customInput.value.trim()) return
  
  // Parse custom input: "5,3,8,1" → [5, 3, 8, 1]
  const parsed = customInput.value
    .split(',')
    .map(s => parseInt(s.trim(), 10))
    .filter(n => !isNaN(n) && n >= 0 && n <= 100)
  
  // Limit array size to 10 items max
  const limited = parsed.slice(0, 10)
  
  if (limited.length === 0) return
  
  // Set custom array, makeSteps will use it
  customArray.value = limited
  stepsKey.value++
  currentStep.value = 0
}
</script>

<style scoped>
.algorithm-page { display: flex; flex-direction: column; height: 100vh; padding-top: var(--header-height); box-sizing: border-box; }
.page-header { background: var(--bg-secondary); border-bottom: 1px solid var(--border-light); padding: var(--space-md) var(--space-lg); }
.page-header-inner { max-width: 1400px; margin: 0 auto; }
.back-link { display: inline-flex; align-items: center; gap: var(--space-sm); font-size: 13px; color: var(--text-muted); margin-bottom: var(--space-sm); transition: color var(--transition-fast); }
.back-link:hover { color: var(--color-primary); }
.algorithm-info { margin-bottom: var(--space-md); }
.algorithm-title { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; color: var(--text-primary); }
.algorithm-description { font-size: 14px; color: var(--text-secondary); margin-top: var(--space-xs); }
.algorithm-complexity { display: flex; gap: var(--space-sm); flex-wrap: wrap; }
.complexity-badge { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: var(--space-xs) var(--space-md); background: var(--bg-primary); border: 1px solid var(--border-light); border-radius: var(--radius-md); }
.complexity-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); }
.complexity-badge code { font-family: var(--font-mono); font-size: 13px; font-weight: 600; color: var(--color-primary); }
.page-content { flex: 1; display: flex; flex-direction: column; gap: var(--space-md); padding: var(--space-md) var(--space-lg); overflow: hidden; }
.split-layout { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); overflow: hidden; min-height: 0; }
.code-panel-wrapper { display: flex; flex-direction: column; overflow: hidden; min-height: 0; }
.viz-panel-wrapper { display: flex; flex-direction: column; overflow: hidden; min-height: 0; }
.variable-panel-wrapper { flex: 0 0 80px; overflow: hidden; }
@media (max-width: 1024px) { .split-layout { grid-template-columns: 1fr; grid-template-rows: auto 1fr; } .page-content { padding: var(--space-sm); } .page-header { padding: var(--space-sm) var(--space-md); } }
</style>