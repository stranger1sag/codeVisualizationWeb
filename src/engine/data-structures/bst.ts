import type { Algorithm, Step } from '../types'

export const bstCode = `// Binary Search Tree
struct Node {
  int key;
  struct Node *left, *right;
};

struct Node* insert(struct Node* node, int key) {
  if (node == NULL) return newNode(key);
  if (key < node->key)
    node->left = insert(node->left, key);
  else if (key > node->key)
    node->right = insert(node->right, key);
  return node;
}

void inorder(struct Node* node) {
  if (node == NULL) return;
  inorder(node->left);
  printf("%d ", node->key);
  inorder(node->right);
}`

interface BSTNode {
  value: number
  left: number | null
  right: number | null
  x: number
  y: number
}

export function bstRun(_data: number[]): Step[] {
  const steps: Step[] = []
  const nodes: BSTNode[] = []
  
  steps.push({
    line: 1,
    data: { bstNodes: [], operation: 'init' },
    compareIds: [],
    swapIds: [],
    variables: {},
    description: '创建空二叉搜索树',
  })

  // Generate random keys
  const keys = Array.from({ length: 6 + Math.floor(Math.random() * 3) }, 
    () => Math.floor(Math.random() * 50) + 10)

  // Show operation plan
  const operationPlan = keys.map(k => `insert(${k})`).join(' → ')
  steps.push({
    line: 1,
    data: { bstNodes: [], operation: 'plan', operationPlan },
    compareIds: [],
    swapIds: [],
    variables: {},
    description: '操作计划: ' + operationPlan,
  })
  
  // Sort keys to use in-order position for x coordinate
  // This ensures nodes never overlap
  const sortedKeys = [...keys].sort((a, b) => a - b)
  
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const inOrderPos = sortedKeys.indexOf(key)
    
    steps.push({
      line: 3,
      data: { bstNodes: [...nodes], operation: 'insert', insertKey: key },
      compareIds: [],
      swapIds: [],
      variables: { key, index: nodes.length },
      description: '插入 key=' + key,
    })
    
    // Build visual nodes - copy existing nodes
    const newNodes: BSTNode[] = nodes.map(n => ({ ...n }))
    
    // Determine parent and whether to go left or right
    let parentIndex = 0
    let goLeft = true
    if (nodes.length > 0) {
      let current = 0
      while (current < newNodes.length) {
        if (key < newNodes[current].value) {
          if (newNodes[current].left === null) {
            parentIndex = current
            goLeft = true
            break
          }
          current = newNodes[current].left!
        } else {
          if (newNodes[current].right === null) {
            parentIndex = current
            goLeft = false
            break
          }
          current = newNodes[current].right!
        }
      }
    }
    
    // Calculate y based on depth
    const depth = nodes.length > 0 ? Math.floor(newNodes[parentIndex].y / 60) + 1 : 0
    const y = depth * 60 + 50
    
    // Calculate x based on in-order position - ensures no overlap
    // Total width = 600, divide into equal slots
    const totalSlots = Math.max(keys.length, 10)
    const slotWidth = 600 / (totalSlots + 1)
    const x = (inOrderPos + 1) * slotWidth
    
    const newIndex = newNodes.length
    newNodes.push({ value: key, left: null, right: null, x, y })
    
    if (nodes.length > 0) {
      if (goLeft) {
        newNodes[parentIndex].left = newIndex
      } else {
        newNodes[parentIndex].right = newIndex
      }
    }
    
    steps.push({
      line: 4,
      data: { bstNodes: [...newNodes], operation: 'inserted', insertKey: key },
      compareIds: [String(newIndex)],
      swapIds: [],
      variables: { key, index: newIndex },
      description: '已插入 key=' + key + ' 到位置 ' + newIndex,
    })
    
    nodes.length = 0
    nodes.push(...newNodes)
  }

  // Show final tree
  steps.push({
    line: 8,
    data: { bstNodes: [...nodes], operation: 'done' },
    compareIds: [],
    swapIds: [],
    variables: { count: nodes.length },
    description: '操作完成, ' + nodes.length + ' 个节点',
  })

  return steps
}

export const bstAlgorithm: Algorithm = {
  id: 'bst',
  name: '二叉搜索树',
  category: 'data-structure',
  description: '二叉搜索树是一种有序的二叉树,左子树所有节点小于根节点,右子树所有节点大于根节点。查找、插入、删除平均时间复杂度O(log n)。',
  code: bstCode,
  defaultData: [],
  run: bstRun,
  complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(n)', space: 'O(n)' },
}