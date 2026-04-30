import type { Algorithm, Step } from '../types'

export const stackCode = `// Stack Operations
void push(int stack[], int *top, int max, int x) {
  if (*top >= max - 1) return;  // overflow
  stack[++*top] = x;
}

int pop(int stack[], int *top) {
  if (*top < 0) return -1;  // underflow
  return stack[(*top)--];
}

// Example operations
push(5);    // push 5
push(10);   // push 10
pop();      // pop -> 10
push(15);   // push 15
pop();      // pop -> 15
pop();      // pop -> 5`

export function stackRun(_data: number[]): Step[] {
  const steps: Step[] = []
  const maxSize = 10
  const stack: number[] = []
  let top = -1

  // Initial state
  steps.push({
    line: 1,
    data: { items: [], top: -1, operation: 'init' },
    compareIds: [],
    swapIds: [],
    variables: { top: -1, maxSize },
    description: '创建空栈, top = -1 (空栈标志)',
  })

  // Generate random operations
  const operationCount = 8 + Math.floor(Math.random() * 5)  // 8-12 operations
  const operations: Array<{ op: string; val: number | null }> = []
  
  for (let i = 0; i < operationCount; i++) {
    const isPush = Math.random() > 0.4  // 60% push, 40% pop
    if (isPush) {
      operations.push({ op: 'push', val: Math.floor(Math.random() * 90) + 10 })
    } else {
      operations.push({ op: 'pop', val: null })
    }
  }

  // Show operation plan
  const operationPlan = operations.map(op => op.op === 'push' ? `push(${op.val})` : 'pop()').join(' → ')
  steps.push({
    line: 1,
    data: { items: [], top: -1, operation: 'plan', operationPlan },
    compareIds: [],
    swapIds: [],
    variables: {},
    description: '操作计划: ' + operationPlan,
  })

  for (const op of operations) {
    if (op.op === 'push' && op.val !== null) {
      if (top >= maxSize - 1) {
        steps.push({
          line: 2,
          data: { items: [...stack], top, operation: 'overflow' },
          compareIds: [],
          swapIds: [],
          variables: { top, val: op.val },
          description: `栈已满，无法push ${op.val}`,
        })
        continue
      }

      top++
      stack.push(op.val)

      steps.push({
        line: 2,
        data: { items: [...stack], top, operation: 'push' },
        compareIds: [String(top)],
        swapIds: [],
        variables: { top, val: op.val },
        description: `push ${op.val}, top = ${top}`,
      })
    } else if (op.op === 'pop') {
      if (top < 0) {
        steps.push({
          line: 5,
          data: { items: [...stack], top, operation: 'underflow' },
          compareIds: [],
          swapIds: [],
          variables: { top },
          description: '栈为空, 无法pop',
        })
        continue
      }

      const popped = stack.pop() ?? 0
      top--

      steps.push({
        line: 5,
        data: { items: [...stack], top: top + 1, operation: 'pop' },
        compareIds: [],
        swapIds: [String(top + 1)],
        variables: { popped: popped as number },
        description: `pop -> ${popped}, top = ${top}`,
      })
    }
  }

  // Final state
  steps.push({
    line: 8,
    data: { items: [...stack], top, operation: 'done' },
    compareIds: [],
    swapIds: [],
    variables: { top, size: stack.length },
    description: '操作完成!',
  })

  return steps
}

export const stackAlgorithm: Algorithm = {
  id: 'stack',
  name: '栈 (Stack)',
  category: 'data-structure',
  description: '后进先出（LIFO）的线性数据结构，只允许在表尾进行插入（push）和删除（pop）操作。常用于函数调用栈、表达式求值、括号匹配等场景。',
  code: stackCode,
  defaultData: [],
  run: stackRun,
  complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
}