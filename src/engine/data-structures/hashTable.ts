import type { Algorithm, Step } from '../types'

export const hashTableCode = `// Hash Table
#define SIZE 10

int hashTable[SIZE];
init to -1

int hash(int key) {
  return key % SIZE;
}

void insert(int key) {
  int index = hash(key);
  while (hashTable[index] != -1) {
    index = (index + 1) % SIZE;
  }
  hashTable[index] = key;
}

int search(int key) {
  int index = hash(key);
  int start = index;
  while (hashTable[index] != key && index != start) {
    index = (index + 1) % SIZE;
  }
  return hashTable[index] == key ? index : -1;
}`

export function hashTableRun(_data: number[]): Step[] {
  const steps: Step[] = []
  const size = 10
  const table: number[] = new Array(size).fill(-1)

  steps.push({
    line: 1,
    data: { table: [...table], operation: 'init' },
    compareIds: [],
    swapIds: [],
    variables: { size },
    description: '创建哈希表, 大小 ' + size,
  })

  // Generate random keys to insert
  const keys = Array.from({ length: 5 + Math.floor(Math.random() * 4) }, 
    () => Math.floor(Math.random() * 90) + 10)

  const allOps: Array<{ op: string; key?: number; found?: boolean }> = []
  
  // Insert keys
  for (const key of keys) {
    allOps.push({ op: 'insert', key })
  }
  
  // Search for some keys (half found, half not)
  for (const key of keys.slice(0, 2)) {
    allOps.push({ op: 'search', key, found: true })
  }
  allOps.push({ op: 'search', key: Math.floor(Math.random() * 90) + 10, found: false })

  // Show operation plan
  const operationPlan = allOps.map(op => op.op === 'insert' ? `insert(${op.key})` : `search(${op.key})`).join(' → ')
  steps.push({
    line: 1,
    data: { table: [...table], operation: 'plan', operationPlan },
    compareIds: [],
    swapIds: [],
    variables: {},
    description: '操作计划: ' + operationPlan,
  })

  for (const op of allOps) {
    if (op.op === 'insert' && op.key !== undefined) {
      let index = op.key % size
      let collisions = 0
      
      steps.push({
        line: 5,
        data: { table: [...table], operation: 'insert', searchKey: op.key },
        compareIds: [],
        swapIds: [],
        variables: { key: op.key, index },
        description: '插入 key=' + op.key + ', hash=' + index,
      })

      while (table[index] !== -1) {
        collisions++
        steps.push({
          line: 6,
          data: { table: [...table], operation: 'collision', searchKey: op.key },
          compareIds: [String(index)],
          swapIds: [],
          variables: { index, collisions },
          description: '冲突! 位置 ' + index + ' 已有值, 探测下一个',
        })
        index = (index + 1) % size
      }

      table[index] = op.key
      steps.push({
        line: 7,
        data: { table: [...table], operation: 'inserted', searchKey: op.key },
        compareIds: [String(index)],
        swapIds: [String(index)],
        variables: { key: op.key, index },
        description: '插入到位置 ' + index,
      })
    } else if (op.op === 'search' && op.key !== undefined) {
      let index = op.key % size
      let searched = 0
      
      steps.push({
        line: 10,
        data: { table: [...table], operation: 'search', searchKey: op.key },
        compareIds: [],
        swapIds: [],
        variables: { key: op.key, index },
        description: '查找 key=' + op.key + ', 从位置 ' + index + ' 开始',
      })

      while (searched < size) {
        if (table[index] === -1) {
          steps.push({
            line: 11,
            data: { table: [...table], operation: 'notFound', searchKey: op.key },
            compareIds: [String(index)],
            swapIds: [],
            variables: { index },
            description: '位置 ' + index + ' 为空, 找不到',
          })
          break
        }
        
        if (table[index] === op.key) {
          steps.push({
            line: 12,
            data: { table: [...table], operation: 'found', searchKey: op.key },
            compareIds: [String(index)],
            swapIds: [],
            variables: { key: op.key, index },
            description: '找到 key=' + op.key + ' 在位置 ' + index,
          })
          break
        }

        searched++
        steps.push({
          line: 11,
          data: { table: [...table], operation: 'check', searchKey: op.key },
          compareIds: [String(index)],
          swapIds: [],
          variables: { index, checked: table[index] },
          description: '位置 ' + index + ' 是 ' + table[index] + ', 不匹配, 继续',
        })
        index = (index + 1) % size
      }
    }
  }

  const finalTable = [...table]
  steps.push({
    line: 15,
    data: { table: finalTable, operation: 'done' },
    compareIds: [],
    swapIds: [],
    variables: { count: finalTable.filter(v => v !== -1).length },
    description: '操作完成, ' + finalTable.filter(v => v !== -1).length + ' 个元素',
  })

  return steps
}

export const hashTableLinearAlgorithm: Algorithm = {
  id: 'hash-table-linear',
  name: '哈希表 (线性探测)',
  category: 'data-structure',
  description: '使用哈希函数将键映射到数组位置，通过线性探测解决哈希冲突。查找时沿冲突链查找直到找到或遇到空位。',
  code: hashTableCode,
  defaultData: [],
  run: hashTableRun,
  complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(n)' },
}

// Chaining Hash Table
export const hashTableChainingCode = `// Hash Table with Chaining
#define SIZE 10

struct Node {
  int key;
  struct Node* next;
} *hashTable[SIZE];

int hash(int key) {
  return key % SIZE;
}

void insert(int key) {
  int index = hash(key);
  struct Node* newNode = malloc(sizeof(struct Node));
  newNode->key = key;
  newNode->next = hashTable[index];
  hashTable[index] = newNode;
}

struct Node* search(int key) {
  int index = hash(key);
  struct Node* ptr = hashTable[index];
  while (ptr != NULL) {
    if (ptr->key == key) return ptr;
    ptr = ptr->next;
  }
  return NULL;
}`

export function hashTableChainingRun(_data: number[]): Step[] {
  const steps: Step[] = []
  const size = 10
  const chains: number[][] = Array.from({ length: size }, () => [])

  steps.push({
    line: 1,
    data: { chains: chains.map(c => [...c]), operation: 'init' },
    compareIds: [],
    swapIds: [],
    variables: { size },
    description: '创建哈希表(链表法), 大小 ' + size,
  })

  // Generate unique random keys
  const keySet = new Set<number>()
  while (keySet.size < 8 + Math.floor(Math.random() * 4)) {
    keySet.add(Math.floor(Math.random() * 90) + 10)
  }
  const keys = Array.from(keySet)

  const allOps: Array<{ op: string; key?: number }> = []
  for (const key of keys) {
    allOps.push({ op: 'insert', key })
  }
  for (const key of keys.slice(0, 3)) {
    allOps.push({ op: 'search', key })
  }
  allOps.push({ op: 'search', key: Math.floor(Math.random() * 90) + 10 })

  const operationPlan = allOps.map(op => op.op === 'insert' ? `insert(${op.key})` : `search(${op.key})`).join(' → ')
  steps.push({
    line: 1,
    data: { chains: chains.map(c => [...c]), operation: 'plan', operationPlan },
    compareIds: [],
    swapIds: [],
    variables: {},
    description: '操作计划: ' + operationPlan,
  })

  for (const op of allOps) {
    if (op.op === 'insert' && op.key !== undefined) {
      const index = op.key % size
      
      steps.push({
        line: 5,
        data: { chains: chains.map(c => [...c]), operation: 'insert', searchKey: op.key, hashIndex: index },
        compareIds: [],
        swapIds: [],
        variables: { key: op.key, index },
        description: '插入 key=' + op.key + ', hash=' + index,
      })

      // Insert at head of chain
      chains[index].unshift(op.key)
      
      steps.push({
        line: 6,
        data: { chains: chains.map(c => [...c]), operation: 'inserted', searchKey: op.key, hashIndex: index },
        compareIds: [String(index)],
        swapIds: [String(index)],
        variables: { key: op.key, index, chainLength: chains[index].length },
        description: '插入到链表头部, 链长 ' + chains[index].length,
      })
    } else if (op.op === 'search' && op.key !== undefined) {
      const index = op.key % size
      
      steps.push({
        line: 10,
        data: { chains: chains.map(c => [...c]), operation: 'search', searchKey: op.key, hashIndex: index },
        compareIds: [],
        swapIds: [],
        variables: { key: op.key, index },
        description: '查找 key=' + op.key + ', hash=' + index,
      })

      const chain = chains[index]
      let found = false
      for (let i = 0; i < chain.length; i++) {
        steps.push({
          line: 11,
          data: { chains: chains.map(c => [...c]), operation: 'check', searchKey: op.key, hashIndex: index, chainIndex: i },
          compareIds: [String(index)],
          swapIds: [],
          variables: { index, chainIndex: i, checked: chain[i] },
          description: `链表[${index}][${i}] = ${chain[i]}`,
        })
        
        if (chain[i] === op.key) {
          found = true
          steps.push({
            line: 12,
            data: { chains: chains.map(c => [...c]), operation: 'found', searchKey: op.key, hashIndex: index, chainIndex: i },
            compareIds: [String(index)],
            swapIds: [],
            variables: { key: op.key, index, chainIndex: i },
            description: `在链表[${index}][${i}]找到 key=${op.key}`,
          })
          break
        }
      }

      if (!found) {
        steps.push({
          line: 11,
          data: { chains: chains.map(c => [...c]), operation: 'notFound', searchKey: op.key, hashIndex: index },
          compareIds: [String(index)],
          swapIds: [],
          variables: { index },
          description: '链表为空或未找到',
        })
      }
    }
  }

  steps.push({
    line: 15,
    data: { chains: chains.map(c => [...c]), operation: 'done' },
    compareIds: [],
    swapIds: [],
    variables: { count: chains.reduce((sum, c) => sum + c.length, 0) },
    description: '操作完成, ' + chains.reduce((sum, c) => sum + c.length, 0) + ' 个元素',
  })

  return steps
}

export const hashTableChainingAlgorithm: Algorithm = {
  id: 'hash-table-chaining',
  name: '哈希表 (链表法)',
  category: 'data-structure',
  description: '使用哈希函数将键映射到链表数组，每个槽位维护一个链表解决冲突。插入在链表头部，查找沿链表遍历。',
  code: hashTableChainingCode,
  defaultData: [],
  run: hashTableChainingRun,
  complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(n)' },
}