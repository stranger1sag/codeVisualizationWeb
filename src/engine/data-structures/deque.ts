import type { Algorithm, Step } from '../types'

export const dequeCode = `// Deque Operations
void insertFront(int deque[], int *front, int *rear, int max, int x) {
  if (*front == 0) return;  // cannot insert at front
  deque[--*front] = x;
}

void insertRear(int deque[], int *front, int *rear, int max, int x) {
  if (*rear >= max - 1) return;
  deque[++*rear] = x;
}

int deleteFront(int deque[], int *front, int *rear) {
  if (*front > *rear) return -1;
  return deque[(*front)++];
}

int deleteRear(int deque[], int *front, int *rear) {
  if (*front > *rear) return -1;
  return deque[(*rear)--];
}`

export function dequeRun(_data: number[]): Step[] {
  const steps: Step[] = []
  const deque: number[] = []
  let front = 0
  let rear = -1

  steps.push({
    line: 1,
    data: { items: [], front, rear, operation: 'init' },
    compareIds: [],
    swapIds: [],
    variables: { front, rear },
    description: '创建空双端队列',
  })

  // Generate random operations
  const ops = ['insertFront', 'insertRear', 'deleteFront', 'deleteRear']
  const operationCount = 8 + Math.floor(Math.random() * 4)
  const operations: Array<{ op: string; val: number | null }> = []
  
  for (let i = 0; i < operationCount; i++) {
    const op = ops[Math.floor(Math.random() * 4)]
    operations.push({ op, val: op.includes('insert') ? Math.floor(Math.random() * 90) + 10 : null })
  }

  const operationPlan = operations.map(op => op.val !== null ? `${op.op}(${op.val})` : `${op.op}()`).join(' → ')
  steps.push({
    line: 1,
    data: { items: [], front, rear, operation: 'plan', operationPlan },
    compareIds: [],
    swapIds: [],
    variables: {},
    description: '操作计划: ' + operationPlan,
  })

  for (const op of operations) {
    if (op.op === 'insertFront' && op.val !== null) {
      deque.unshift(op.val)  // Add to front
      front = 0
      rear = deque.length - 1
      steps.push({
        line: 2,
        data: { items: [...deque], front, rear, operation: 'insertFront' },
        compareIds: ['0'],
        swapIds: [],
        variables: { val: op.val },
        description: 'insertFront(' + op.val + ')',
      })
    } else if (op.op === 'insertRear' && op.val !== null) {
      deque.push(op.val)  // Add to rear
      front = 0
      rear = deque.length - 1
      steps.push({
        line: 3,
        data: { items: [...deque], front, rear, operation: 'insertRear' },
        compareIds: [String(deque.length - 1)],
        swapIds: [],
        variables: { val: op.val },
        description: 'insertRear(' + op.val + ')',
      })
    } else if (op.op === 'deleteFront') {
      if (deque.length === 0) {
        steps.push({
          line: 4,
          data: { items: [], front, rear, operation: 'empty' },
          compareIds: [],
          swapIds: [],
          variables: {},
          description: '队列为空',
        })
        continue
      }
      const deleted = deque.shift()!
      front = 0
      rear = deque.length - 1
      steps.push({
        line: 4,
        data: { items: [...deque], front, rear, operation: 'deleteFront' },
        compareIds: [],
        swapIds: ['0'],
        variables: { deleted },
        description: 'deleteFront() -> ' + deleted,
      })
    } else if (op.op === 'deleteRear') {
      if (deque.length === 0) {
        steps.push({
          line: 5,
          data: { items: [], front, rear, operation: 'empty' },
          compareIds: [],
          swapIds: [],
          variables: {},
          description: '队列为空',
        })
        continue
      }
      const deleted = deque.pop()!
      front = 0
      rear = deque.length - 1
      steps.push({
        line: 5,
        data: { items: [...deque], front, rear, operation: 'deleteRear' },
        compareIds: [],
        swapIds: [String(deque.length)],
        variables: { deleted },
        description: 'deleteRear() -> ' + deleted,
      })
    }
  }

  steps.push({
    line: 8,
    data: { items: [...deque], front, rear, operation: 'done' },
    compareIds: [],
    swapIds: [],
    variables: { size: deque.length },
    description: '操作完成, ' + deque.length + ' 个元素',
  })

  return steps
}

export const dequeAlgorithm: Algorithm = {
  id: 'deque',
  name: '双端队列 (Deque)',
  category: 'data-structure',
  description: '双端队列允许在两端（头部和尾部）进行插入和删除操作。结合了栈和队列的特性。',
  code: dequeCode,
  defaultData: [],
  run: dequeRun,
  complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
}