import type { Algorithm, Step } from '../types'

export const queueCode = `// Queue Operations
void enqueue(int queue[], int *front, int *rear, int max, int x) {
  if (*rear >= max - 1) return;
  queue[++*rear] = x;
  if (*front == -1) *front = 0;
}

int dequeue(int queue[], int *front, int *rear) {
  if (*front == -1) return -1;
  if (*front > *rear) return -1;
  return queue[(*front)++];
}`

export function queueRun(_data: number[]): Step[] {
  const steps: Step[] = []
  const maxSize = 10
  const queue: number[] = []
  let front = -1
  let rear = -1

  steps.push({
    line: 1,
    data: { items: [], front: -1, rear: -1, operation: 'init' },
    compareIds: [],
    swapIds: [],
    variables: { front: -1, rear: -1 },
    description: '创建空队列, front = rear = -1',
  })

  // Generate random operations
  const operationCount = 8 + Math.floor(Math.random() * 5)  // 8-12 operations
  const operations: Array<{ op: string; val: number | null }> = []
  
  for (let i = 0; i < operationCount; i++) {
    const isEnqueue = Math.random() > 0.4  // 60% enqueue, 40% dequeue
    if (isEnqueue) {
      operations.push({ op: 'enqueue', val: Math.floor(Math.random() * 90) + 10 })
    } else {
      operations.push({ op: 'dequeue', val: null })
    }
  }

  // Show operation plan
  const operationPlan = operations.map(op => op.op === 'enqueue' ? `enqueue(${op.val})` : 'dequeue()').join(' → ')
  steps.push({
    line: 1,
    data: { items: [], front: -1, rear: -1, operation: 'plan', operationPlan },
    compareIds: [],
    swapIds: [],
    variables: {},
    description: '操作计划: ' + operationPlan,
  })

  for (const op of operations) {
    if (op.op === 'enqueue' && op.val !== null) {
      if (rear >= maxSize - 1) {
        steps.push({
          line: 2,
          data: { items: [...queue], front, rear, operation: 'overflow' },
          compareIds: [],
          swapIds: [],
          variables: { rear, val: op.val },
          description: '队列已满',
        })
        continue
      }

      rear++
      queue.push(op.val)
      if (front === -1) front = 0

      steps.push({
        line: 2,
        data: { items: [...queue], front, rear, operation: 'enqueue' },
        compareIds: [String(rear)],
        swapIds: [],
        variables: { front, rear, val: op.val },
        description: 'enqueue ' + op.val + ', rear = ' + rear,
      })
    } else if (op.op === 'dequeue') {
      if (front === -1 || front > rear) {
        steps.push({
          line: 5,
          data: { items: [...queue], front, rear, operation: 'underflow' },
          compareIds: [],
          swapIds: [],
          variables: { front, rear },
          description: '队列为空',
        })
        continue
      }

      const dequeued = queue.shift() ?? 0  // Remove from front
      const oldFront = front
      front++

      // Reset if queue is empty after dequeue
      if (front > rear) {
        front = -1
        rear = -1
      }

      steps.push({
        line: 5,
        data: { items: [...queue], front, rear, operation: 'dequeue' },
        compareIds: [],
        swapIds: [String(oldFront)],
        variables: { dequeued },
        description: 'dequeue -> ' + dequeued + ', front = ' + (front === -1 ? '空' : front),
      })
    }
  }

  steps.push({
    line: 8,
    data: { items: [...queue], front, rear, operation: 'done' },
    compareIds: [],
    swapIds: [],
    variables: { front, rear, size: queue.length },
    description: '操作完成, 队列大小: ' + queue.length,
  })

  return steps
}

export const queueAlgorithm: Algorithm = {
  id: 'queue',
  name: '队列 (Queue)',
  category: 'data-structure',
  description: '先进先出（FIFO）的线性表, 允许表尾插入(ENQUEUE)、表头删除(DEQUEUE)。常用于任务调度、广度优先搜索、缓冲区。',
  code: queueCode,
  defaultData: [],
  run: queueRun,
  complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
}