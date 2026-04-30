import type { Algorithm, Step } from '../types'

export const binarySearchCode = `int binarySearch(int arr[], int n, int target) {
    int left = 0;
    int right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            return mid;
        }
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}`

export function binarySearchRun(data: number[]): Step[] {
  const steps: Step[] = []
  const arr = [...data].sort((a, b) => a - b)
  const n = arr.length
  // Random target index instead of fixed middle
  const targetIndex = Math.floor(Math.random() * n)
  const target = arr[targetIndex]

  steps.push({
    line: 1,
    data: { array: [...arr], target, left: 0, right: n - 1, mid: null },
    highlights: arr.map((_, i) => String(i)),
    variables: { n, target },
    description: `开始二分查找, target = ${target}, 数组已排序`,
  })

  let left = 0
  let right = n - 1

  steps.push({
    line: 2,
    data: { array: [...arr], target, left, right, mid: null },
    highlights: [String(left)],
    variables: { left, right, target },
    description: `初始化 left = ${left}`,
  })

  steps.push({
    line: 3,
    data: { array: [...arr], target, left, right, mid: null },
    highlights: [String(right)],
    variables: { left, right, target },
    description: `初始化 right = ${right}`,
  })

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2)
    steps.push({
      line: 4,
      data: { array: [...arr], target, left, right, mid },
      highlights: Array.from({ length: right - left + 1 }, (_, i) => String(left + i)),
      variables: { left, right, mid, target },
      description: `left=${left} <= right=${right}, 查找中...`,
    })

    steps.push({
      line: 5,
      data: { array: [...arr], target, left, right, mid },
      highlights: [String(mid)],
      compareIds: [String(mid)],
      variables: { left, right, mid, target },
      description: `mid = ${mid}, arr[mid] = ${arr[mid]}`,
    })

    if (arr[mid] === target) {
      steps.push({
        line: 6,
        data: { array: [...arr], target, left, right, mid },
        highlights: [String(mid)],
        variables: { left, right, mid, target },
        description: `arr[${mid}] = ${arr[mid]} == target = ${target}, 找到目标!`,
      })
      break
    }

    if (arr[mid] < target) {
      steps.push({
        line: 8,
        data: { array: [...arr], target, left, right, mid },
        highlights: [String(mid)],
        variables: { left, right, mid, target },
        description: `arr[${mid}]=${arr[mid]} < target=${target}, 目标在右半部分`,
      })
      left = mid + 1
      steps.push({
        line: 9,
        data: { array: [...arr], target, left, right, mid },
        highlights: [String(left)],
        variables: { left, right, target },
        description: `更新 left = ${left}`,
      })
    } else {
      steps.push({
        line: 10,
        data: { array: [...arr], target, left, right, mid },
        highlights: [String(mid)],
        variables: { left, right, mid, target },
        description: `arr[${mid}]=${arr[mid]} > target=${target}, 目标在左半部分`,
      })
      right = mid - 1
      steps.push({
        line: 11,
        data: { array: [...arr], target, left, right, mid },
        highlights: [String(right)],
        variables: { left, right, target },
        description: `更新 right = ${right}`,
      })
    }
  }

  steps.push({
    line: 14,
    data: { array: [...arr], target, left, right, mid: null },
    highlights: [],
    variables: { target },
    description: `查找结束`,
  })

  return steps
}

export const binarySearchAlgorithm: Algorithm = {
  id: 'binary-search',
  name: '二分查找',
  category: 'search',
  description: '在有序数组中通过反复对半缩小查找范围来定位目标值。时间复杂度O(log n)，是查找有序数据最高效的算法之一。注意：使用[left, right]闭区间进行查找。',
  code: binarySearchCode,
  defaultData: [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91],
  run: binarySearchRun,
  complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
}
