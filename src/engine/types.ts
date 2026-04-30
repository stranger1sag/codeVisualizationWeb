/**
 * Core type definitions for the algorithm visualization engine
 */

export type AlgorithmCategory = 'sort' | 'data-structure' | 'search'

export type ElementState =
  | 'default'
  | 'comparing'
  | 'swapping'
  | 'sorted'
  | 'pivot'
  | 'selected'
  | 'inserting'
  | 'searching'
  | 'found'
  | 'not-found'

/** Visual element for array/bar visualization */
export interface VisualElement {
  id: string
  value: number
  state: ElementState
}

/** A single step in the algorithm execution */
export interface Step {
  line: number
  data: Record<string, unknown>
  compareIds?: string[]
  swapIds?: string[]
  sortedIds?: string[]
  /** Elements that were compared but not swapped (no swap) */
  noSwapIds?: string[]
  variables: Record<string, number | string>
  description: string
  /** Optional - for backward compatibility */
  highlights?: string[]
}

/** Variable for variable panel */
export interface Variable {
  name: string
  value: number | string
  type: 'number' | 'string'
}

/** Stack frame for call stack visualization */
export interface StackFrame {
  functionName: string
  variables: Variable[]
  level: number
}

/** Algorithm definition for the visualization engine */
export interface Algorithm {
  id: string
  name: string
  category: AlgorithmCategory
  description: string
  code: string
  defaultData: number[]
  run: (data: number[]) => Step[]
  complexity?: { best: string; average: string; worst: string; space: string }
}

/** Catalog entry for the landing page */
export interface CatalogItem {
  id: string
  name: string
  slug: string
  category: AlgorithmCategory
  description: string
  icon: string
}

export const CATEGORIES: Record<AlgorithmCategory, { label: string; icon: string }> = {
  sort: { label: '排序算法', icon: '📊' },
  'data-structure': { label: '数据结构', icon: '🏗️' },
  search: { label: '搜索算法', icon: '🔍' },
}

export const STATE_COLORS: Record<ElementState, string> = {
  default: '#64748b',
  comparing: '#eab308',  // 黄色 - 检测/比较
  swapping: '#3b82f6',  // 蓝色 - 替换
  sorted: '#22c55e',  // 绿色 - 排序成功
  pivot: '#ef4444',
  selected: '#a855f7',
  inserting: '#06b6d4',
  searching: '#eab308',
  found: '#10b981',
  'not-found': '#ef4444',
}
