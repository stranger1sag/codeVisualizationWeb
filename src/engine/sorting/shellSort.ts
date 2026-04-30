import type { Algorithm, Step } from '../types'

export const shellSortCode = `void shellSort(int arr[], int n) {
  // Start with a large gap, then reduce it
  for (int gap = n / 2; gap > 0; gap /= 2) {
    // Do a gapped insertion sort
    for (int i = gap; i < n; i++) {
      int temp = arr[i];
      int j;
      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
        arr[j] = arr[j - gap];
      }
      arr[j] = temp;
    }
  }
}`

export function shellSortRun(data: number[]): Step[] {
  const steps: Step[] = []
  const arr = [...data]
  const n = arr.length
  const sortedIds: string[] = []

  steps.push({
    line: 1,
    data: { array: [...arr] },
    compareIds: [],
    swapIds: [],
    sortedIds: [],
    variables: { n },
    description: `开始希尔排序, 数组长度 ${n}`,
  })

  // Start with a large gap, then reduce it
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    steps.push({
      line: 2,
      data: { array: [...arr] },
      compareIds: [],
      swapIds: [],
      sortedIds: [...sortedIds],
      variables: { gap },
      description: `gap = ${gap}, 开始间隔插入排序`,
    })

    // Do a gapped insertion sort
    for (let i = gap; i < n; i++) {
      const temp = arr[i]

      steps.push({
        line: 4,
        data: { array: [...arr] },
        compareIds: [String(i)],
        swapIds: [],
        sortedIds: [...sortedIds],
        variables: { i, temp },
        description: `取出 arr[${i}]=${temp} 待插入`,
      })

      // Compare and shift elements using the gap
      let j = i
      while (j >= gap && arr[j - gap] > temp) {
        steps.push({
          line: 5,
          data: { array: [...arr] },
          compareIds: [String(j), String(j - gap)],
          swapIds: [],
          sortedIds: [...sortedIds],
          variables: { j, 'j-gap': j - gap },
          description: `比较 arr[${j}]=${arr[j]} 和 arr[${j - gap}]=${arr[j - gap]}`,
        })

        // Shift element right
        arr[j] = arr[j - gap]
        
        steps.push({
          line: 6,
          data: { array: [...arr] },
          compareIds: [],
          swapIds: [String(j), String(j - gap)],
          sortedIds: [...sortedIds],
          variables: { j, 'j-gap': j - gap },
          description: `将 arr[${j - gap}]=${arr[j - gap]} 右移到 arr[${j}]`,
        })

        j -= gap
      }

      arr[j] = temp
      
      steps.push({
        line: 7,
        data: { array: [...arr] },
        compareIds: [],
        swapIds: [String(j)],
        sortedIds: [...sortedIds],
        variables: { j, temp },
        description: `将 temp=${temp} 插入到位置 ${j}`,
      })
    }
  }

  // Mark all as sorted - green
  const allSortedIds = Array.from({ length: n }, (_, i) => String(i))
  steps.push({
    line: 10,
    data: { array: [...arr] },
    compareIds: [],
    swapIds: [],
    sortedIds: allSortedIds,
    variables: {},
    description: '排序完成!',
  })

  return steps
}

export const shellSortAlgorithm: Algorithm = {
  id: 'shell-sort',
  name: '希尔排序',
  category: 'sort',
  description: '插入排序的改进版，通过设置间隔（gap）逐步缩小进行排序。先对间隔较大的子数组进行插入排序，再逐步缩小间隔。平均时间复杂度约O(n^1.3)，优于直接插入排序。',
  code: shellSortCode,
  defaultData: [12, 34, 54, 2, 3, 67, 25, 24, 22, 11],
  run: shellSortRun,
  complexity: { best: 'O(n log n)', average: 'O(n^1.3)', worst: 'O(n²)', space: 'O(1)' },
}