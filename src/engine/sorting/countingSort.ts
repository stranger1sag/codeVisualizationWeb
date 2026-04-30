import type { Algorithm, Step } from '../types'

export const countingSortCode = `void countingSort(int arr[], int n) {
  int max = arr[0];
  for (int i = 1; i < n; i++) {
    if (arr[i] > max) max = arr[i];
  }
  
  // Count each element
  int count[max + 1] = {0};
  for (int i = 0; i < n; i++) {
    count[arr[i]]++;
  }
  
  // Rebuild array
  int index = 0;
  for (int i = 0; i <= max; i++) {
    while (count[i] > 0) {
      arr[index++] = i;
      count[i]--;
    }
  }
}`

export function countingSortRun(data: number[]): Step[] {
  const steps: Step[] = []
  const arr = [...data]
  const n = arr.length

  // Find max value
  const max = Math.max(...arr)
  
  steps.push({
    line: 1,
    data: { array: [...arr], count: new Array(max + 1).fill(0) },
    compareIds: [],
    swapIds: [],
    sortedIds: [],
    variables: { n, max },
    description: `开始计数排序, 数组长度 ${n}, 最大值 ${max}`,
  })

  // Initialize count array
  const count = new Array(max + 1).fill(0)
  
  steps.push({
    line: 3,
    data: { array: [...arr], count: [...count] },
    compareIds: [],
    swapIds: [],
    sortedIds: [],
    variables: { 'count size': max + 1 },
    description: `创建计数数组, 大小 ${max + 1}`,
  })

  // Count occurrences - highlight current element being counted
  for (let i = 0; i < n; i++) {
    count[arr[i]]++
    
    steps.push({
      line: 5,
      data: { array: [...arr], count: [...count] },
      compareIds: [String(i)],  // Highlight current element being counted
      swapIds: [],
      sortedIds: [],
      variables: { i, val: arr[i], countVal: count[arr[i]] },
      description: `统计元素 ${arr[i]} 的出现次数, count[${arr[i]}] = ${count[arr[i]]}`,
    })
  }

  // Show count array after counting
  steps.push({
    line: 5,
    data: { array: [...arr], count: [...count], operation: 'counted' },
    compareIds: [],
    swapIds: [],
    sortedIds: [],
    variables: { count: count.join(', ') },
    description: `计数完成, count数组: [${count.join(', ')}]`,
  })

  // Rebuild array from counts - highlight placement
  let index = 0
  const sortedIds: string[] = []
  
  for (let i = 0; i <= max; i++) {
    // Show which count we're processing
    steps.push({
      line: 8,
      data: { array: [...arr], count: [...count], operation: 'rebuild', rebuildVal: i, rebuildCount: count[i] },
      compareIds: [],
      swapIds: [],
      sortedIds: [...sortedIds],
      variables: { value: i, count: count[i] },
      description: `处理数值 ${i}, 出现 ${count[i]} 次`,
    })
    
    while (count[i] > 0) {
      const oldVal = arr[index]
      arr[index] = i
      sortedIds.push(String(index))
      
      steps.push({
        line: 8,
        data: { array: [...arr], count: [...count], operation: 'placing', placedIndex: index },
        compareIds: [],
        swapIds: [String(index)],
        sortedIds: [...sortedIds],
        variables: { index, oldVal, newVal: i },
        description: `将 ${i} 放入 arr[${index}]`,
      })
      
      count[i]--
      index++
    }
  }

  // Mark all as sorted - green
  const allSortedIds = Array.from({ length: n }, (_, i) => String(i))
  steps.push({
    line: 12,
    data: { array: [...arr], count: [...count], operation: 'done' },
    compareIds: [],
    swapIds: [],
    sortedIds: allSortedIds,
    variables: {},
    description: '排序完成!',
  })

  return steps
}

export const countingSortAlgorithm: Algorithm = {
  id: 'counting-sort',
  name: '计数排序',
  category: 'sort',
  description: '一种特殊的线性时间排序算法，通过计数每个值出现的次数来排序。适用于整数值范围不大的情况，时间复杂度O(n+k)，但需要较大额外空间。',
  code: countingSortCode,
  defaultData: [2, 5, 3, 1, 4, 2, 4, 6, 1, 3],
  run: countingSortRun,
  complexity: { best: 'O(n+k)', average: 'O(n+k)', worst: 'O(n+k)', space: 'O(k)' },
}