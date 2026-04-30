import type { Algorithm, Step } from '../types'

export const interpolationSearchCode = `int interpolationSearch(int arr[], int n, int target) {
    int left = 0;
    int right = n - 1;
    while (left <= right && target >= arr[left] && target <= arr[right]) {
        // 估算目标位置
        int pos = left + ((target - arr[left]) * (right - left) / (arr[right] - arr[left]));
        if (arr[pos] == target) return pos;
        if (arr[pos] < target) left = pos + 1;
        else right = pos - 1;
    }
    return -1;
}`

export function interpolationSearchRun(data: number[]): Step[] {
  const steps: Step[] = []
  // 70% 有序, 30% 无序
  const sortedPart = [...data].sort((a, b) => a - b)
  const n = sortedPart.length
  const splitIndex = Math.floor(n * 0.7)
  
  // 前70%有序，后30%随机打乱
  const sorted = sortedPart.slice(0, splitIndex)
  const unsorted = sortedPart.slice(splitIndex).sort(() => Math.random() - 0.5)
  const arr = [...sorted, ...unsorted]
  
  // 随机选择一个目标（优先选有序部分的）
  const targetIndex = Math.random() < 0.7 ? Math.floor(Math.random() * splitIndex) : splitIndex + Math.floor(Math.random() * (n - splitIndex))
  const target = arr[targetIndex]

  steps.push({
    line: 1,
    data: { array: [...arr], target, left: 0, right: n - 1, pos: null },
    compareIds: [],
    swapIds: [],
    variables: { n, target },
    description: `开始插值查找, target = ${target}`,
  })

  let left = 0
  let right = n - 1

  // 检查边界条件
  steps.push({
    line: 2,
    data: { array: [...arr], target, left, right, pos: null },
    compareIds: [],
    swapIds: [],
    variables: { left, right, target, arrLeft: arr[left], arrRight: arr[right] },
    description: `检查边界: target=${target}`,
  })

  while (left <= right && target >= arr[left] && target <= arr[right]) {
    // 计算估算位置
    let pos: number
    if (arr[right] === arr[left]) {
      pos = left
    } else {
      pos = left + Math.floor(((target - arr[left]) * (right - left)) / (arr[right] - arr[left]))
    }
    
    // 限制 pos 在有效范围内
    pos = Math.max(left, Math.min(right, pos))

    steps.push({
      line: 3,
      data: { array: [...arr], target, left, right, pos },
      compareIds: [String(pos)],
      swapIds: [],
      variables: { left, right, pos, estimated: arr[pos], target },
      description: `估算位置 pos = ${pos}, arr[pos] = ${arr[pos]}`,
    })

    if (arr[pos] === target) {
      steps.push({
        line: 4,
        data: { array: [...arr], target, left, right, pos },
        compareIds: [String(pos)],
        swapIds: [String(pos)],
        variables: { pos, found: arr[pos] },
        description: `arr[${pos}] = ${arr[pos]} == target = ${target}, 找到目标!`,
      })
      break
    }

    if (arr[pos] < target) {
      steps.push({
        line: 5,
        data: { array: [...arr], target, left, right, pos },
        compareIds: [],
        swapIds: [],
        variables: { pos, arrPos: arr[pos], target },
        description: `arr[${pos}]=${arr[pos]} < target=${target}, 搜索右半部分`,
      })
      left = pos + 1
    } else {
      steps.push({
        line: 6,
        data: { array: [...arr], target, left, right, pos },
        compareIds: [],
        swapIds: [],
        variables: { pos, arrPos: arr[pos], target },
        description: `arr[${pos}]=${arr[pos]} > target=${target}, 搜索左半部分`,
      })
      right = pos - 1
    }

    steps.push({
      line: 2,
      data: { array: [...arr], target, left, right, pos: null },
      compareIds: [],
      swapIds: [],
      variables: { left, right },
      description: `更新范围: left = ${left}, right = ${right}`,
    })
  }

  if (left > right || target < arr[left] || target > arr[right]) {
    steps.push({
      line: 7,
      data: { array: [...arr], target, left, right, pos: null },
      compareIds: [],
      swapIds: [],
      variables: { target },
      description: `目标不在数组范围内, 查找失败`,
    })
  }

  return steps
}

export const interpolationSearchAlgorithm: Algorithm = {
  id: 'interpolation-search',
  name: '插值查找',
  category: 'search',
  description: '改进的二分查找，根据目标值估算在数组中的位置。对于均匀分布的有序数据，时间复杂度可达O(log(log n))，比二分查找更快。',
  code: interpolationSearchCode,
  defaultData: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  run: interpolationSearchRun,
  complexity: { best: 'O(1)', average: 'O(log(log n))', worst: 'O(n)', space: 'O(1)' },
}