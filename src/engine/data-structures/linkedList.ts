import type { Algorithm, Step } from '../types'

export const linkedListCode = `// Linked List Node
struct Node {
  int data;
  struct Node* next;
};

// Create node with head insert
struct Node* head = NULL;

// Insert at head (head insert)
newNode->next = head;
head = newNode;

// Show operations
insert 10  // head insert
insert 20  // head insert  
insert 30  // head insert
// Result: 30->20->10->NULL`

export function linkedListRun(_data: number[]): Step[] {
  const steps: Step[] = []
  const nodes: Array<{ id: string; value: number; next: string | null }> = []

  // Initial state
  steps.push({
    line: 1,
    data: { nodes: [], head: 'null', operation: 'init' },
    compareIds: [],
    swapIds: [],
    variables: { head: 'null' },
    description: '创建空链表, head = NULL',
  })

  // Generate random number of nodes
  const nodeCount = 3 + Math.floor(Math.random() * 4)  // 3-6 nodes
  const values = Array.from({ length: nodeCount }, () => Math.floor(Math.random() * 90) + 10)

  // Show operation plan
  const operationPlan = values.map(v => `insert(${v})`).join(' → ')
  steps.push({
    line: 1,
    data: { nodes: [], head: 'null', operation: 'plan', operationPlan },
    compareIds: [],
    swapIds: [],
    variables: {},
    description: '操作计划: ' + operationPlan,
  })

  // Insert nodes at head (head insert - creates reverse order)
  for (let i = 0; i < values.length; i++) {
    const value = values[i]
    const id = `node-${i}`

    steps.push({
      line: 5,
      data: { nodes: [...nodes], head: nodes.length > 0 ? nodes[0].id : 'null', operation: 'create' },
      compareIds: [],
      swapIds: [],
      variables: { value },
      description: `创建新节点, data = ${value}`,
    })

    // Insert at head: new node points to old head, then becomes new head
    const newNodes = [
      { id, value, next: nodes.length > 0 ? nodes[0].id : null },
      ...nodes
    ]

    steps.push({
      line: 6,
      data: { nodes: newNodes.map(n => ({ ...n })), head: id, operation: 'insert' },
      compareIds: [id],
      swapIds: [],
      variables: { head: id },
      description: `插入到头部, head -> node-${i}`,
    })

    nodes.length = 0
    nodes.push(...newNodes)
  }

  // Final state
  steps.push({
    line: 8,
    data: { nodes: nodes.map(n => ({ ...n })), head: nodes.length > 0 ? nodes[0].id : 'null', operation: 'done' },
    compareIds: [],
    swapIds: [],
    variables: { head: nodes.length > 0 ? nodes[0].id : 'null', count: nodes.length },
    description: `链表创建完成, ${nodes.length} 个节点`,
  })

  return steps
}

export const linkedListAlgorithm: Algorithm = {
  id: 'linked-list',
  name: '单链表（头插法）',
  category: 'data-structure',
  description: '使用头插法创建单链表，新节点插入到链表头部。链表是链式存储的线性表，插入删除O(1)，但不支持随机访问。头插法创建顺序与输入顺序相反。',
  code: linkedListCode,
  defaultData: [10, 20, 30, 40, 50],
  run: linkedListRun,
  complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
}