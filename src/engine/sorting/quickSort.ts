import type { Algorithm, Step } from '../types'

export const quickSortCode = `void quickSort(int arr[], int low, int high) {
  if (low < high) {
    int pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

int partition(int arr[], int low, int high) {
  int pivot = arr[high];
  int i = low - 1;
  for (int j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      swap(arr[i], arr[j]);
    }
  }
  swap(arr[i + 1], arr[high]);
  return i + 1;
}`

function partition(arr: number[], low: number, high: number, steps: Step[], sortedIds: string[]): number {
  const pivot = arr[high]
  steps.push({
    line: 9,
    data: { array: [...arr], low, high, pivot },
    compareIds: [],
    swapIds: [],
    sortedIds: [...sortedIds],
    variables: { low, high, pivot },
    description: `选择基准值 pivot = ${pivot}`,
  })

  let i = low - 1

  for (let j = low; j < high; j++) {
    steps.push({
      line: 11,
      data: { array: [...arr] },
      compareIds: [String(j), String(high)],
      swapIds: [],
      sortedIds: [...sortedIds],
      variables: { i, j, pivot },
      description: `比较 arr[${j}]=${arr[j]} 和 pivot=${pivot}`,
    })

    if (arr[j] <= pivot) {
      i++

      if (i !== j) {
        steps.push({
          line: 13,
          data: { array: [...arr] },
          compareIds: [],
          swapIds: [String(i), String(j)],
          sortedIds: [...sortedIds],
          variables: { i, j },
          description: `交换 arr[${i}] 和 arr[${j}]`,
        })

        const temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
      }
    }
  }

  steps.push({
    line: 15,
    data: { array: [...arr] },
    compareIds: [],
    swapIds: [String(i + 1), String(high)],
    sortedIds: [...sortedIds],
    variables: { i, pivot },
    description: `将基准值与 arr[${i + 1}] 交换`,
  })

  const temp = arr[i + 1]
  arr[i + 1] = arr[high]
  arr[high] = temp
  const pi = i + 1

  steps.push({
    line: 16,
    data: { array: [...arr] },
    compareIds: [],
    swapIds: [],
    sortedIds: [...sortedIds, String(pi)],
    variables: { pi },
    description: `基准值归位, pivot=${pivot} 在位置 ${pi}`,
  })

  return pi
}

function quickSortRecursive(arr: number[], low: number, high: number, steps: Step[], sortedIds: string[], depth = 0): void {
  steps.push({
    line: 1,
    data: { array: [...arr] },
    compareIds: [],
    swapIds: [],
    sortedIds: [...sortedIds],
    variables: { low, high, depth },
    description: `quickSort(arr, ${low}, ${high})${depth > 0 ? ' (递归深度 ' + depth + ')' : ''}`,
  })

  if (low < high) {
    const pi = partition(arr, low, high, steps, sortedIds)

    steps.push({
      line: 3,
      data: { array: [...arr] },
      compareIds: [],
      swapIds: [],
      sortedIds: [...sortedIds, String(pi)],
      variables: { pi },
      description: `分区完成, pi=${pi}`,
    })

    quickSortRecursive(arr, low, pi - 1, steps, [...sortedIds, String(pi)], depth + 1)
    quickSortRecursive(arr, pi + 1, high, steps, [...sortedIds, String(pi)], depth + 1)
  }
}

export function quickSortRun(data: number[]): Step[] {
  const steps: Step[] = []
  const arr = [...data]
  const sortedIds: string[] = []
  
  steps.push({
    line: 1,
    data: { array: [...arr] },
    compareIds: [],
    swapIds: [],
    sortedIds: [],
    variables: { n: arr.length },
    description: `开始快速排序, 数组长度为 ${arr.length}`,
  })

  quickSortRecursive(arr, 0, arr.length - 1, steps, sortedIds, 0)

  // Mark all as sorted - green
  const allSortedIds = Array.from({ length: arr.length }, (_, i) => String(i))
  steps.push({
    line: 18,
    data: { array: [...arr] },
    compareIds: [],
    swapIds: [],
    sortedIds: allSortedIds,
    variables: {},
    description: '排序完成!',
  })

  return steps
}

export const quickSortAlgorithm: Algorithm = {
  id: 'quick-sort',
  name: '快速排序',
  category: 'sort',
  description: '选择一个基准值，将数组分为小于和大于基准值的两部分，递归排序。是实践中常用的排序算法，平均时间复杂度O(n log n)，但最坏情况为O(n²)。',
  code: quickSortCode,
  defaultData: [10, 7, 8, 9, 1, 5],
  run: quickSortRun,
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
}