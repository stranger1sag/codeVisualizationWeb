# 算法可视化学习平台

一个基于 Vue 3 + TypeScript + Vite 构建的交互式算法与数据结构可视化学习工具，帮助用户通过动画直观理解各类算法的执行过程。

## 功能模块

### 排序算法
- 冒泡排序、选择排序、插入排序
- 快速排序、归并排序、堆排序
- 希尔排序、计数排序

### 搜索算法
- 二分查找
- 顺序查找
- 插值查找

### 数据结构
- 栈 (Stack) - LIFO
- 队列 (Queue) - FIFO
- 双端队列 (Deque)
- 单链表 (Linked List) - 头插法
- 哈希表 (Hash Table) - 线性探测法 / 链表法
- 二叉搜索树 (BST)

## 技术栈

- Vue 3 (Composition API)
- TypeScript
- Vite

## 运行方式

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build
```

## 项目结构

```
src/
├── components/Algorithm/   # 可视化组件
│   ├── VisualPanel.vue     # 主容器
│   ├── ArrayVisual.vue     # 数组可视化
│   ├── BinarySearchVisual.vue
│   ├── StackVisual.vue
│   ├── QueueVisual.vue
│   ├── LinkedListVisual.vue
│   ├── HashTableVisual.vue
│   └── BSTVisual.vue
├── engine/                 # 算法引擎
│   ├── data-structures/    # 数据结构
│   ├── search/            # 搜索算法
│   ├── sorting/           # 排序算法
│   └── registry.ts         # 算法注册
└── views/                  # 页面视图
```