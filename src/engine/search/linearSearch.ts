import type { Algorithm, Step } from '../types'

export const linearSearchCode = `int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i;  // 找到返回下标
        }
    }
    return -1;  // 未找到
}`

export function linearSearchRun(data: number[]): Step[] {
  const steps: Step[] = []
  // 不排序，保持原始顺序
  const arr = [...data]
  const n = arr.length
  // 随机选择一个目标
  const targetIndex = Math.floor(Math.random() * n)
  const target = arr[targetIndex]

  steps.push({
    line: 1,
    data: { array: [...arr], target, index: null },
    compareIds: [],
    swapIds: [],
    variables: { n, target },
    description: `开始顺序查找, target = ${target}`,
  })

  for (let i = 0; i < n; i++) {
    steps.push({
      line: 2,
      data: { array: [...arr], target, index: i },
      compareIds: [String(i)],
      swapIds: [],
      variables: { i, current: arr[i], target },
      description: `检查 arr[${i}] = ${arr[i]}`,
    })

    if (arr[i] === target) {
      steps.push({
        line: 3,
        data: { array: [...arr], target, index: i },
        compareIds: [String(i)],
        swapIds: [String(i)],
        variables: { i, found: arr[i] },
        description: `arr[${i}] = ${arr[i]} == target = ${target}, 找到目标!`,
      })
      break
    } else {
      steps.push({
        line: 2,
        data: { array: [...arr], target, index: i },
        compareIds: [],
        swapIds: [],
        variables: { i, current: arr[i], target },
        description: `arr[${i}] = ${arr[i]} != target = ${target}, 继续下一个`,
      })
    }
  }

  steps.push({
    line: 5,
    data: { array: [...arr], target, index: null },
    compareIds: [],
    swapIds: [],
    variables: { target },
    description: `查找结束`,
  })

  return steps
}

export const linearSearchAlgorithm: Algorithm = {
  id: 'linear-search',
  name: '顺序查找',
  category: 'search',
  description: '最简单的查找算法，从数组一端逐个遍历直到找到目标。时间复杂度O(n)，适用于无序数据或小规模数据。',
  code: linearSearchCode,
  defaultData: [23, 5, 67, 12, 89, 34, 56, 9, 45, 78],
  run: linearSearchRun,
  complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
}