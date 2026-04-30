import type { Algorithm, Step } from '../types'

export const selectionSortCode = `void selectionSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    int minIdx = i;
    for (int j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx != i) {
      swap(arr, i, minIdx);
    }
  }
}`

export function selectionSortRun(data: number[]): Step[] {
  const steps: Step[] = []
  const arr = [...data]
  const n = arr.length
  const sortedIds: string[] = []

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i

    steps.push({
      line: 2,
      data: { array: [...arr] },
      compareIds: [],
      swapIds: [],
      sortedIds: [...sortedIds],
      variables: { i },
      description: `第 ${i + 1} 轮: 假设 arr[${i}]=${arr[i]} 为最小值`,
    })

    for (let j = i + 1; j < n; j++) {
      steps.push({
        line: 4,
        data: { array: [...arr] },
        compareIds: [String(j), String(minIdx)],
        swapIds: [],
        sortedIds: [...sortedIds],
        variables: { i, j, minIdx },
        description: `比较 arr[${j}]=${arr[j]} 和当前最小值 arr[${minIdx}]=${arr[minIdx]}`,
      })

      if (arr[j] < arr[minIdx]) {
        minIdx = j
        steps.push({
          line: 5,
          data: { array: [...arr] },
          compareIds: [],
          swapIds: [],
          sortedIds: [...sortedIds],
          variables: { i, j, minIdx },
          description: `找到更小值 arr[${j}]=${arr[j]}, 更新 minIdx = ${j}`,
        })
      }
    }

    if (minIdx !== i) {
      steps.push({
        line: 9,
        data: { array: [...arr] },
        compareIds: [],
        swapIds: [String(i), String(minIdx)],
        sortedIds: [...sortedIds],
        variables: { i, minIdx },
        description: `交换 arr[${i}]=${arr[i]} 和 arr[${minIdx}]=${arr[minIdx]}`,
      })

      const temp = arr[i]
      arr[i] = arr[minIdx]
      arr[minIdx] = temp

      steps.push({
        line: 10,
        data: { array: [...arr] },
        compareIds: [],
        swapIds: [String(i), String(minIdx)],
        sortedIds: [...sortedIds],
        variables: { i, minIdx },
        description: `交换完成`,
      })
    }
    
    sortedIds.push(String(i))
  }

  // Mark all as sorted - green
  const allSortedIds = Array.from({ length: n }, (_, i) => String(i))
  steps.push({
    line: 14,
    data: { array: [...arr] },
    compareIds: [],
    swapIds: [],
    sortedIds: allSortedIds,
    variables: {},
    description: '排序完成!',
  })

  return steps
}

export const selectionSortAlgorithm: Algorithm = {
  id: 'selection-sort',
  name: '选择排序',
  category: 'sort',
  description: '每轮从未排序部分选择最小（或最大）元素放到已排序部分末尾。虽然时间复杂度固定为O(n²)，但交换次数最少，适合写入操作昂贵的场景。',
  code: selectionSortCode,
  defaultData: [64, 25, 12, 22, 11, 90, 34],
  run: selectionSortRun,
  complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
}