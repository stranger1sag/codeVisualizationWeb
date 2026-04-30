import type { Algorithm, Step } from '../types'

export const bubbleSortCode = `void bubbleSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        int temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}`

export function bubbleSortRun(data: number[]): Step[] {
  const steps: Step[] = []
  const arr = [...data]
  const n = arr.length
  const sortedIds: string[] = []

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Comparison step - yellow (comparing)
      steps.push({
        line: 3,
        data: { array: [...arr] },
        compareIds: [String(j), String(j + 1)],
        swapIds: [],
        sortedIds: [...sortedIds],
        variables: { i, j, n },
        description: `比较 arr[${j}]=${arr[j]} 和 arr[${j + 1}]=${arr[j + 1]}`,
      })

      if (arr[j] > arr[j + 1]) {
        // Before swap - blue (swapping)
        steps.push({
          line: 4,
          data: { array: [...arr] },
          compareIds: [],
          swapIds: [String(j), String(j + 1)],
          sortedIds: [...sortedIds],
          variables: { i, j, n },
          description: `${arr[j]} > ${arr[j + 1]}, 需要交换`,
        })

        const temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp

        // After swap - blue (swapping)
        steps.push({
          line: 5,
          data: { array: [...arr] },
          compareIds: [],
          swapIds: [String(j), String(j + 1)],
          sortedIds: [...sortedIds],
          variables: { i, j, n },
          description: `交换完成: arr[${j}]=${arr[j]}, arr[${j + 1}]=${arr[j + 1]}`,
        })
      } else {
        // No swap - red (not swapping)
        steps.push({
          line: 3,
          data: { array: [...arr] },
          compareIds: [],
          swapIds: [],
          noSwapIds: [String(j), String(j + 1)],
          sortedIds: [...sortedIds],
          variables: { i, j, n },
          description: `${arr[j]} <= ${arr[j + 1]}, 不交换`,
        })
      }
    }
    sortedIds.push(String(n - 1 - i))
  }

  // Mark all as sorted - green
  const allSortedIds = Array.from({ length: n }, (_, i) => String(i))
  steps.push({
    line: 9,
    data: { array: [...arr] },
    compareIds: [],
    swapIds: [],
    sortedIds: allSortedIds,
    variables: {},
    description: '排序完成!',
  })

  return steps
}

export const bubbleSortAlgorithm: Algorithm = {
  id: 'bubble-sort',
  name: '冒泡排序',
  category: 'sort',
  description: '重复比较相邻元素并交换，使较大的元素逐渐"冒泡"到数组末尾。时间复杂度O(n²)，空间复杂度O(1)，是基本的排序算法。',
  code: bubbleSortCode,
  defaultData: [64, 34, 25, 12, 22, 11, 90],
  run: bubbleSortRun,
  complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
}
