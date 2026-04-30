import type { Algorithm } from './types'
import { bubbleSortAlgorithm } from './sorting/bubbleSort'
import { selectionSortAlgorithm } from './sorting/selectionSort'
import { insertionSortAlgorithm } from './sorting/insertionSort'
import { quickSortAlgorithm } from './sorting/quickSort'
import { mergeSortAlgorithm } from './sorting/mergeSort'
import { heapSortAlgorithm } from './sorting/heapSort'
import { shellSortAlgorithm } from './sorting/shellSort'
import { countingSortAlgorithm } from './sorting/countingSort'
import { linkedListAlgorithm } from './data-structures/linkedList'
import { stackAlgorithm } from './data-structures/stack'
import { queueAlgorithm } from './data-structures/queue'
import { dequeAlgorithm } from './data-structures/deque'
import { hashTableLinearAlgorithm, hashTableChainingAlgorithm } from './data-structures/hashTable'
import { bstAlgorithm } from './data-structures/bst'
import { binarySearchAlgorithm } from './search/binarySearch'
import { linearSearchAlgorithm } from './search/linearSearch'
import { interpolationSearchAlgorithm } from './search/interpolationSearch'

export const algorithmRegistry: Algorithm[] = [
  bubbleSortAlgorithm,
  selectionSortAlgorithm,
  insertionSortAlgorithm,
  quickSortAlgorithm,
  mergeSortAlgorithm,
  heapSortAlgorithm,
  shellSortAlgorithm,
  countingSortAlgorithm,
  linkedListAlgorithm,
  stackAlgorithm,
  queueAlgorithm,
  dequeAlgorithm,
  hashTableLinearAlgorithm,
  hashTableChainingAlgorithm,
  bstAlgorithm,
  binarySearchAlgorithm,
  linearSearchAlgorithm,
  interpolationSearchAlgorithm,
]

export function getAlgorithm(id: string): Algorithm | undefined {
  return algorithmRegistry.find((a) => a.id === id)
}

export function getAlgorithmsByCategory(category: string): Algorithm[] {
  return algorithmRegistry.filter((a) => a.category === category)
}
