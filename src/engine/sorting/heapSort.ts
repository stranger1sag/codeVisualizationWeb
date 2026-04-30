import type { Algorithm, Step } from '../types'

export const heapSortCode = `void heapSort(int arr[], int n) {
  // Build max heap
  for (int i = n / 2 - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from heap
  for (int i = n - 1; i > 0; i--) {
    swap(arr[0], arr[i]);
    heapify(arr, i, 0);
  }
}

void heapify(int arr[], int n, int i) {
  int largest = i;
  int left = 2 * i + 1;
  int right = 2 * i + 2;
  
  if (left < n && arr[left] > arr[largest])
    largest = left;
  if (right < n && arr[right] > arr[largest])
    largest = right;
  
  if (largest != i) {
    swap(arr[i], arr[largest]);
    heapify(arr, n, largest);
  }
}`

function heapify(arr: number[], n: number, i: number, steps: Step[], sortedIds: string[]): void {
  let largest = i
  const left = 2 * i + 1
  const right = 2 * i + 2

  steps.push({
    line: 10,
    data: { array: [...arr] },
    compareIds: [String(i)],
    swapIds: [],
    sortedIds: [...sortedIds],
    variables: { i, largest, left, right },
    description: `heapify: 检查节点 ${i}, left=${left < n ? left : 'N'}, right=${right < n ? right : 'N'}`,
  })

  if (left < n && arr[left] > arr[largest]) {
    largest = left
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right
  }

  if (largest !== i) {
    steps.push({
      line: 14,
      data: { array: [...arr] },
      compareIds: [],
      swapIds: [String(i), String(largest)],
      sortedIds: [...sortedIds],
      variables: { i, largest },
      description: `交换 arr[${i}]=${arr[i]} 和 arr[${largest}]=${arr[largest]}`,
    })

    const temp = arr[i]
    arr[i] = arr[largest]
    arr[largest] = temp

    heapify(arr, n, largest, steps, sortedIds)
  }
}

export function heapSortRun(data: number[]): Step[] {
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
    description: `开始堆排序, 数组长度 ${n}`,
  })

  // Build max heap (heapify from first non-leaf to root)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    steps.push({
      line: 3,
      data: { array: [...arr] },
      compareIds: [],
      swapIds: [],
      sortedIds: [...sortedIds],
      variables: { i },
      description: `构建最大堆: 调整子堆根节点 ${i}`,
    })
    heapify(arr, n, i, steps, sortedIds)
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    steps.push({
      line: 7,
      data: { array: [...arr] },
      compareIds: [],
      swapIds: ['0', String(i)],
      sortedIds: [...sortedIds],
      variables: { i },
      description: `将堆顶 arr[0]=${arr[0]} 与 arr[${i}]=${arr[i]} 交换`,
    })

    const temp = arr[0]
    arr[0] = arr[i]
    arr[i] = temp

    sortedIds.push(String(i))

    steps.push({
      line: 8,
      data: { array: [...arr] },
      compareIds: [],
      swapIds: [],
      sortedIds: [...sortedIds],
      variables: { i },
      description: `已将最大元素放到位置 ${i}`,
    })

    heapify(arr, i, 0, steps, sortedIds)
  }

  // Mark all as sorted - green
  const allSortedIds = Array.from({ length: n }, (_, idx) => String(idx))
  steps.push({
    line: 16,
    data: { array: [...arr] },
    compareIds: [],
    swapIds: [],
    sortedIds: allSortedIds,
    variables: {},
    description: '排序完成!',
  })

  return steps
}

export const heapSortAlgorithm: Algorithm = {
  id: 'heap-sort',
  name: '堆排序',
  category: 'sort',
  description: '利用堆数据结构进行排序的算法。先构建最大堆，然后逐步提取堆顶最大元素到数组末尾。时间复杂度始终为O(n log n)，空间复杂度O(1)，是不稳定的原地排序。',
  code: heapSortCode,
  defaultData: [4, 10, 3, 5, 1, 8, 7, 2, 9, 6],
  run: heapSortRun,
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
}