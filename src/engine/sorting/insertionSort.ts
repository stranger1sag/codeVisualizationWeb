import type { Algorithm, Step } from '../types'

export const insertionSortCode = `void insertionSort(int arr[], int n) {
  for (int i = 1; i < n; i++) {
    int key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
}`

export function insertionSortRun(data: number[]): Step[] {
  const steps: Step[] = []
  const arr = [...data]
  const n = arr.length
  const sortedIds: string[] = ['0']

  for (let i = 1; i < n; i++) {
    const key = arr[i]
    let j = i - 1

    steps.push({
      line: 2,
      data: { array: [...arr] },
      compareIds: [],
      swapIds: [],
      sortedIds: [...sortedIds],
      variables: { i, key },
      description: `取 arr[${i}]=${key} 作为待插入元素`,
    })

    while (j >= 0 && arr[j] > key) {
      // Comparison - yellow (comparing)
      steps.push({
        line: 4,
        data: { array: [...arr] },
        compareIds: [String(j)],
        swapIds: [],
        sortedIds: [...sortedIds],
        variables: { i, key, j },
        description: `比较 arr[${j}]=${arr[j]} > key=${key}`,
      })

      // Shift - blue (swapping)
      arr[j + 1] = arr[j]
      steps.push({
        line: 5,
        data: { array: [...arr] },
        compareIds: [],
        swapIds: [String(j + 1), String(j)],
        sortedIds: [...sortedIds],
        variables: { i, key, j },
        description: `将 arr[${j}]=${arr[j]} 右移`,
      })

      j = j - 1
    }

    arr[j + 1] = key
    steps.push({
      line: 7,
      data: { array: [...arr] },
      compareIds: [],
      swapIds: [],
      sortedIds: [...sortedIds],
      variables: { i, key, j: j + 1 },
      description: `插入 key=${key} 到位置 ${j + 1}`,
    })
    
    sortedIds.push(String(i))
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

export const insertionSortAlgorithm: Algorithm = {
  id: 'insertion-sort',
  name: '插入排序',
  category: 'sort',
  description: '将数组分为已排序和未排序两部分，逐个将未排序元素插入已排序部分的正确位置。像整理扑克牌一样，适合接近有序的数据，时间复杂度可达到O(n)。',
  code: insertionSortCode,
  defaultData: [12, 11, 13, 5, 6, 7, 10],
  run: insertionSortRun,
  complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
}
