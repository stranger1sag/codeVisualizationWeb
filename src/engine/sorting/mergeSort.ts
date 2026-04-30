import type { Algorithm, Step } from '../types'

export const mergeSortCode = `void mergeSort(int arr[], int l, int r) {
  if (l < r) {
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
  }
}

void merge(int arr[], int l, int m, int r) {
  int n1 = m - l + 1;
  int n2 = r - m;
  int L[n1], R[n2];
  
  for (int i = 0; i < n1; i++) L[i] = arr[l + i];
  for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
  
  int i = 0, j = 0, k = l;
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) arr[k++] = L[i++];
    else arr[k++] = R[j++];
  }
  while (i < n1) arr[k++] = L[i++];
  while (j < n2) arr[k++] = R[j++];
}`

function merge(arr: number[], l: number, m: number, r: number, steps: Step[], sortedIds: string[]): void {
  const n1 = m - l + 1
  const n2 = r - m
  const L: number[] = []
  const R: number[] = []

  // Copy data to temp arrays
  for (let i = 0; i < n1; i++) L[i] = arr[l + i]
  for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j]

  steps.push({
    line: 10,
    data: { array: [...arr] },
    compareIds: [],
    swapIds: [],
    sortedIds: [...sortedIds],
    variables: { l, m, r },
    description: `合并区间 [${l}..${r}], 左子数组 ${n1}个, 右子数组 ${n2}个`,
  })

  let i = 0, j = 0, k = l
  while (i < n1 && j < n2) {
    steps.push({
      line: 15,
      data: { array: [...arr] },
      compareIds: [String(l + i), String(m + 1 + j)],
      swapIds: [],
      sortedIds: [...sortedIds],
      variables: { k, leftVal: L[i], rightVal: R[j] },
      description: `比较 L[${i}]=${L[i]} 和 R[${j}]=${R[j]}`,
    })

    if (L[i] <= R[j]) {
      arr[k] = L[i]
      steps.push({
        line: 16,
        data: { array: [...arr] },
        compareIds: [],
        swapIds: [String(k)],
        sortedIds: [...sortedIds],
        variables: { k, val: L[i] },
        description: `L[${i}] <= R[${j}], 写入 arr[${k}]=${L[i]}`,
      })
      i++
    } else {
      arr[k] = R[j]
      steps.push({
        line: 17,
        data: { array: [...arr] },
        compareIds: [],
        swapIds: [String(k)],
        sortedIds: [...sortedIds],
        variables: { k, val: R[j] },
        description: `L[${i}] > R[${j}], 写入 arr[${k}]=${R[j]}`,
      })
      j++
    }
    k++
  }

  while (i < n1) {
    arr[k] = L[i]
    steps.push({
      line: 19,
      data: { array: [...arr] },
      compareIds: [],
      swapIds: [String(k)],
      sortedIds: [...sortedIds],
      variables: { k, val: L[i] },
      description: `复制剩余左元素 arr[${k}]=${L[i]}`,
    })
    i++
    k++
  }

  while (j < n2) {
    arr[k] = R[j]
    steps.push({
      line: 20,
      data: { array: [...arr] },
      compareIds: [],
      swapIds: [String(k)],
      sortedIds: [...sortedIds],
      variables: { k, val: R[j] },
      description: `复制剩余右元素 arr[${k}]=${R[j]}`,
    })
    j++
    k++
  }
}

function mergeSortRecursive(arr: number[], l: number, r: number, steps: Step[], sortedIds: string[]): void {
  if (l < r) {
    const m = l + Math.floor((r - l) / 2)

    steps.push({
      line: 2,
      data: { array: [...arr] },
      compareIds: [],
      swapIds: [],
      sortedIds: [...sortedIds],
      variables: { l, r, m },
      description: `递归排序 arr[${l}..${r}], 中点 m=${m}`,
    })

    mergeSortRecursive(arr, l, m, steps, sortedIds)
    mergeSortRecursive(arr, m + 1, r, steps, sortedIds)
    merge(arr, l, m, r, steps, sortedIds)
  }
}

export function mergeSortRun(data: number[]): Step[] {
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
    description: `开始归并排序, 数组长度 ${arr.length}`,
  })

  mergeSortRecursive(arr, 0, arr.length - 1, steps, sortedIds)

  // Mark all as sorted - green
  const allSortedIds = Array.from({ length: arr.length }, (_, i) => String(i))
  steps.push({
    line: 21,
    data: { array: [...arr] },
    compareIds: [],
    swapIds: [],
    sortedIds: allSortedIds,
    variables: {},
    description: '排序完成!',
  })

  return steps
}

export const mergeSortAlgorithm: Algorithm = {
  id: 'merge-sort',
  name: '归并排序',
  category: 'sort',
  description: '采用分治法将数组递归分成两半，分别排序后再合并。稳定排序算法，时间复杂度固定O(n log n)，但需要O(n)额外空间。适合大规模数据排序和外部排序。',
  code: mergeSortCode,
  defaultData: [38, 27, 43, 3, 9, 82, 10],
  run: mergeSortRun,
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
}
