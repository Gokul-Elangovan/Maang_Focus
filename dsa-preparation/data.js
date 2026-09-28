// ============================================================
// DSA_PLAN — 90 days, 160 problems
// ALL problems sourced from:
//   "DSA Questions + Patterns — 500 Curated Problems" PDF
// Strategy: Pattern-first | ~2 problems/day (rest days built in)
// ============================================================

const PATTERNS = {
  "two-pointers": {
    name: "Two Pointers",
    icon: "↔️",
    color: "#6c63ff",
    bgColor: "rgba(108,99,255,0.12)",
    description: "Use two indices moving toward/away from each other to reduce O(n²) to O(n). Ideal for sorted arrays, palindromes, and pair-sum problems.",
    template: `# Two Pointers Template
left, right = 0, len(arr) - 1
while left < right:
    if condition(arr[left], arr[right]):
        # process
        left += 1
        right -= 1
    elif too_small:
        left += 1
    else:
        right -= 1`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)"
  },
  "sliding-window": {
    name: "Sliding Window",
    icon: "🪟",
    color: "#06b6d4",
    bgColor: "rgba(6,182,212,0.12)",
    description: "Maintain a window of elements; expand/shrink to satisfy a constraint. Best for subarray/substring problems with contiguous requirements.",
    template: `# Sliding Window Template
left = 0
for right in range(len(arr)):
    # expand: add arr[right]
    while window_invalid():
        # shrink: remove arr[left]
        left += 1
    # update answer`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) to O(k)"
  },
  "prefix-sum": {
    name: "Prefix Sum",
    icon: "∑",
    color: "#f59e0b",
    bgColor: "rgba(245,158,11,0.12)",
    description: "Precompute cumulative sums for O(1) range queries. Combine with HashMap to find subarrays with a target sum in O(n).",
    template: `# Prefix Sum + HashMap
prefix = {0: -1}  # sum -> index
curr_sum = 0
for i, num in enumerate(arr):
    curr_sum += num
    if curr_sum - target in prefix:
        # found subarray
    prefix[curr_sum] = i`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)"
  },
  "kadane": {
    name: "Kadane's Algorithm",
    icon: "📈",
    color: "#22c55e",
    bgColor: "rgba(34,197,94,0.10)",
    description: "Track local and global maximum for maximum subarray problems. Extend with state variables for product, circular, or multi-state variants.",
    template: `# Kadane's Template
curr_max = global_max = arr[0]
for num in arr[1:]:
    curr_max = max(num, curr_max + num)
    global_max = max(global_max, curr_max)
return global_max`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)"
  },
  "binary-search": {
    name: "Binary Search",
    icon: "🔍",
    color: "#a78bfa",
    bgColor: "rgba(167,139,250,0.12)",
    description: "Repeatedly halve the search space on a monotonic function. Use for classic search, rotated arrays, and 'search on answer' (parametric search).",
    template: `# Binary Search Template
lo, hi = 0, len(arr) - 1
while lo <= hi:
    mid = lo + (hi - lo) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        lo = mid + 1
    else:
        hi = mid - 1
return -1`,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)"
  },
  "binary-search-answer": {
    name: "Binary Search on Answer",
    icon: "🎯",
    color: "#ec4899",
    bgColor: "rgba(236,72,153,0.10)",
    description: "Binary search on the answer space (not the array). Define a feasibility function and binary search to find the minimum/maximum valid answer.",
    template: `# Parametric Search Template
def feasible(x):
    # check if answer 'x' is achievable
    ...

lo, hi = min_answer, max_answer
while lo < hi:
    mid = lo + (hi - lo) // 2
    if feasible(mid):
        hi = mid  # or lo = mid + 1
    else:
        lo = mid + 1
return lo`,
    timeComplexity: "O(n log(max-min))",
    spaceComplexity: "O(1)"
  },
  "fast-slow-ptr": {
    name: "Fast & Slow Pointers",
    icon: "🐢🐇",
    color: "#f97316",
    bgColor: "rgba(249,115,22,0.10)",
    description: "Floyd's Cycle Detection. Two pointers at different speeds to detect cycles, find midpoints, and solve cycle-entry problems.",
    template: `# Floyd's Cycle Detection
slow = fast = head
# Phase 1: detect cycle
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow == fast: break
# Phase 2: find entry
slow = head
while slow != fast:
    slow = slow.next
    fast = fast.next
return slow`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)"
  },
  "in-place-reversal": {
    name: "In-Place Reversal",
    icon: "🔄",
    color: "#06b6d4",
    bgColor: "rgba(6,182,212,0.10)",
    description: "Reverse sublists or entire lists using pointer manipulation. Foundation for reordering, rotating, and group-wise reversal problems.",
    template: `# Linked List Reversal
def reverse(head, stop=None):
    prev, curr = None, head
    while curr != stop:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)"
  },
  "mono-stack": {
    name: "Monotonic Stack",
    icon: "📚",
    color: "#8b5cf6",
    bgColor: "rgba(139,92,246,0.10)",
    description: "Maintain a stack in increasing/decreasing order for next-greater/smaller queries. Also powers largest-rectangle and histogram problems.",
    template: `# Monotonic Decreasing Stack (Next Greater)
stack = []  # indices
result = [-1] * len(arr)
for i, num in enumerate(arr):
    while stack and arr[stack[-1]] < num:
        result[stack.pop()] = num
    stack.append(i)
return result`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)"
  },
  "mono-deque": {
    name: "Monotonic Deque",
    icon: "🚂",
    color: "#06b6d4",
    bgColor: "rgba(6,182,212,0.10)",
    description: "Maintain a deque for sliding window max/min in O(n). Each element enters and exits the deque at most once.",
    template: `# Sliding Window Max (Deque)
from collections import deque
dq, result = deque(), []
for i, num in enumerate(arr):
    while dq and arr[dq[-1]] < num:
        dq.pop()
    dq.append(i)
    if dq[0] == i - k:
        dq.popleft()
    if i >= k - 1:
        result.append(arr[dq[0]])`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(k)"
  },
  "tree-dfs": {
    name: "Tree DFS / Recursion",
    icon: "🌳",
    color: "#22c55e",
    bgColor: "rgba(34,197,94,0.10)",
    description: "Solve sub-problems on left/right subtrees and combine results. Pre/in/post-order traversals are all DFS variants.",
    template: `# DFS Tree Recursion Template
def dfs(node):
    if not node:
        return base_case
    left = dfs(node.left)
    right = dfs(node.right)
    # combine and return
    return combine(left, right, node.val)`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) — h=height"
  },
  "tree-bfs": {
    name: "Tree BFS (Level Order)",
    icon: "🌊",
    color: "#0ea5e9",
    bgColor: "rgba(14,165,233,0.10)",
    description: "Explore tree level by level using a queue. Essential for shortest path, level-order traversal, and right-side view problems.",
    template: `# BFS Level Order
from collections import deque
q = deque([root])
while q:
    level = []
    for _ in range(len(q)):
        node = q.popleft()
        level.append(node.val)
        if node.left:  q.append(node.left)
        if node.right: q.append(node.right)
    result.append(level)`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(w) — w=max width"
  },
  "bst": {
    name: "BST Operations",
    icon: "🔢",
    color: "#a78bfa",
    bgColor: "rgba(167,139,250,0.10)",
    description: "BST property: left < root < right enables O(log n) search, insert, delete. In-order traversal gives sorted order.",
    template: `# BST Validation (DFS)
def validate(node, lo=-inf, hi=inf):
    if not node: return True
    if not (lo < node.val < hi):
        return False
    return (validate(node.left, lo, node.val)
         and validate(node.right, node.val, hi))`,
    timeComplexity: "O(log n) avg, O(n) worst",
    spaceComplexity: "O(h)"
  },
  "trie": {
    name: "Trie (Prefix Tree)",
    icon: "🌐",
    color: "#f97316",
    bgColor: "rgba(249,115,22,0.10)",
    description: "Efficient prefix search and autocomplete in O(L) per query where L is string length. Also powerful for XOR maximization problems.",
    template: `# Trie Implementation
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.is_end = True`,
    timeComplexity: "O(L) per operation",
    spaceComplexity: "O(total chars)"
  },
  "heap-topk": {
    name: "Heap / Top-K Pattern",
    icon: "⛰️",
    color: "#ec4899",
    bgColor: "rgba(236,72,153,0.10)",
    description: "Min-Heap of size K maintains the K largest elements efficiently. Use heapq in Python. Also use for merge K sorted lists and stream problems.",
    template: `# Top-K Largest (Min-Heap of size K)
import heapq
heap = []
for num in arr:
    heapq.heappush(heap, num)
    if len(heap) > k:
        heapq.heappop(heap)
return heap[0]  # kth largest`,
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(k)"
  },
  "two-heaps": {
    name: "Two Heaps",
    icon: "⚖️",
    color: "#f59e0b",
    bgColor: "rgba(245,158,11,0.10)",
    description: "One max-heap and one min-heap to find the median dynamically. The key insight: balance sizes so median is always at the top of one heap.",
    template: `# Two Heaps Median
small = []  # max-heap (negate)
large = []  # min-heap
def addNum(num):
    heappush(small, -num)
    heappush(large, -heappop(small))
    if len(large) > len(small):
        heappush(small, -heappop(large))
def findMedian():
    if len(small) > len(large):
        return -small[0]
    return (-small[0] + large[0]) / 2`,
    timeComplexity: "O(log n) add, O(1) median",
    spaceComplexity: "O(n)"
  },
  "graph-bfs": {
    name: "Graph BFS",
    icon: "🕸️",
    color: "#22c55e",
    bgColor: "rgba(34,197,94,0.10)",
    description: "Explore nodes level by level; guarantees shortest path in unweighted graphs. Multi-source BFS starts from multiple nodes simultaneously.",
    template: `# Graph BFS
from collections import deque
def bfs(graph, start):
    visited = {start}
    q = deque([start])
    while q:
        node = q.popleft()
        for nei in graph[node]:
            if nei not in visited:
                visited.add(nei)
                q.append(nei)`,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)"
  },
  "graph-dfs": {
    name: "Graph DFS",
    icon: "🔁",
    color: "#8b5cf6",
    bgColor: "rgba(139,92,246,0.10)",
    description: "Explore all paths; detect cycles and connected components. Use visited states (0=unvisited, 1=visiting, 2=done) for cycle detection in directed graphs.",
    template: `# Graph DFS (Cycle Detection)
def dfs(node, visited, rec_stack):
    visited[node] = True
    rec_stack[node] = True
    for nei in graph[node]:
        if not visited[nei]:
            if dfs(nei, visited, rec_stack):
                return True  # cycle
        elif rec_stack[nei]:
            return True
    rec_stack[node] = False
    return False`,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)"
  },
  "topo-sort": {
    name: "Topological Sort",
    icon: "📐",
    color: "#06b6d4",
    bgColor: "rgba(6,182,212,0.10)",
    description: "Kahn's Algorithm (BFS) or DFS Post-order for linear ordering of a DAG. Used for course scheduling, dependency resolution, and alien dictionary.",
    template: `# Kahn's Algorithm (BFS Topo Sort)
in_degree = {n: 0 for n in graph}
for n in graph:
    for nei in graph[n]:
        in_degree[nei] += 1
q = deque([n for n in in_degree if in_degree[n]==0])
order = []
while q:
    node = q.popleft()
    order.append(node)
    for nei in graph[node]:
        in_degree[nei] -= 1
        if in_degree[nei] == 0:
            q.append(nei)`,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)"
  },
  "union-find": {
    name: "Union-Find (DSU)",
    icon: "🔗",
    color: "#f97316",
    bgColor: "rgba(249,115,22,0.10)",
    description: "Path compression + union by rank gives near-O(1) amortised operations. Used for connected components, cycle detection, and MST (Kruskal's).",
    template: `# DSU with Path Compression
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py: return False
        if self.rank[px] < self.rank[py]: px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]: self.rank[px] += 1
        return True`,
    timeComplexity: "O(α(n)) ≈ O(1) amortised",
    spaceComplexity: "O(n)"
  },
  "dijkstra": {
    name: "Dijkstra's Algorithm",
    icon: "🗺️",
    color: "#a78bfa",
    bgColor: "rgba(167,139,250,0.10)",
    description: "Weighted shortest path using a min-heap. Works for non-negative weights. BFS variant for 0-1 BFS using deque instead of heap.",
    template: `# Dijkstra
import heapq
def dijkstra(graph, src):
    dist = {src: 0}
    heap = [(0, src)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist.get(u, inf): continue
        for v, w in graph[u]:
            nd = d + w
            if nd < dist.get(v, inf):
                dist[v] = nd
                heapq.heappush(heap, (nd, v))
    return dist`,
    timeComplexity: "O((V+E) log V)",
    spaceComplexity: "O(V + E)"
  },
  "dp-1d": {
    name: "1-D Dynamic Programming",
    icon: "📊",
    color: "#22c55e",
    bgColor: "rgba(34,197,94,0.10)",
    description: "State is a single index; transition from previous states. Always define state, recurrence, base case, and answer extraction.",
    template: `# 1-D DP Template
# State: dp[i] = answer for first i elements
dp = [0] * (n + 1)
dp[0] = base_case
for i in range(1, n + 1):
    for prev in relevant_states:
        dp[i] = optimize(dp[i], dp[prev] + cost)
return dp[n]`,
    timeComplexity: "O(n) or O(n²)",
    spaceComplexity: "O(n) → O(1) if optimized"
  },
  "dp-2d": {
    name: "2-D Dynamic Programming",
    icon: "🗂️",
    color: "#06b6d4",
    bgColor: "rgba(6,182,212,0.10)",
    description: "State is two indices (i, j); fill a table row by row. Common for string comparison (LCS, edit distance) and grid path problems.",
    template: `# 2-D DP (LCS-style)
# dp[i][j] = answer for s1[:i], s2[:j]
dp = [[0]*(m+1) for _ in range(n+1)]
for i in range(1, n+1):
    for j in range(1, m+1):
        if s1[i-1] == s2[j-1]:
            dp[i][j] = dp[i-1][j-1] + 1
        else:
            dp[i][j] = max(dp[i-1][j], dp[i][j-1])`,
    timeComplexity: "O(n·m)",
    spaceComplexity: "O(n·m) → O(m) if optimized"
  },
  "knapsack": {
    name: "Knapsack DP",
    icon: "🎒",
    color: "#ec4899",
    bgColor: "rgba(236,72,153,0.10)",
    description: "0/1 Knapsack: each item used once. Unbounded: items reusable. Key insight: traverse capacity in reverse for 0/1, forward for unbounded.",
    template: `# 0/1 Knapsack
dp = [0] * (capacity + 1)
for weight, value in items:
    for cap in range(capacity, weight - 1, -1):
        dp[cap] = max(dp[cap], dp[cap - weight] + value)

# Unbounded Knapsack
for weight, value in items:
    for cap in range(weight, capacity + 1):
        dp[cap] = max(dp[cap], dp[cap - weight] + value)`,
    timeComplexity: "O(n·W)",
    spaceComplexity: "O(W)"
  },
  "backtracking": {
    name: "Backtracking",
    icon: "🔙",
    color: "#f97316",
    bgColor: "rgba(249,115,22,0.10)",
    description: "Explore all choices recursively; prune branches that violate constraints. State: (current path, remaining choices, start index).",
    template: `# Backtracking Template
def backtrack(start, path):
    if is_solution(path):
        result.append(path[:])
        return
    for i in range(start, len(choices)):
        if is_valid(choices[i], path):
            path.append(choices[i])
            backtrack(i + 1, path)  # or i for reuse
            path.pop()  # UNDO choice`,
    timeComplexity: "O(2^n) to O(n!)",
    spaceComplexity: "O(n)"
  },
  "greedy": {
    name: "Greedy Algorithms",
    icon: "💰",
    color: "#f59e0b",
    bgColor: "rgba(245,158,11,0.10)",
    description: "Always pick the locally optimal choice; prove exchange argument for correctness. Most interval scheduling problems are greedy. Sort is often the key step.",
    template: `# Interval Greedy (Activity Selection)
intervals.sort(key=lambda x: x[1])  # sort by end
count, last_end = 0, float('-inf')
for start, end in intervals:
    if start >= last_end:
        count += 1
        last_end = end
return count`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)"
  },
  "hashmap": {
    name: "HashMap Patterns",
    icon: "#️⃣",
    color: "#6c63ff",
    bgColor: "rgba(108,99,255,0.10)",
    description: "O(1) lookups to avoid nested loops; track frequency, index, or pairs. Two Sum, anagram detection, and duplicate finding are classic hashmap problems.",
    template: `# HashMap — Complement Pattern (Two Sum)
seen = {}
for i, num in enumerate(arr):
    complement = target - num
    if complement in seen:
        return [seen[complement], i]
    seen[num] = i
return []`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)"
  },
  "bit-manip": {
    name: "Bit Manipulation",
    icon: "🔢",
    color: "#8b5cf6",
    bgColor: "rgba(139,92,246,0.10)",
    description: "XOR, AND/OR masks, Brian Kernighan's algorithm. XOR is self-inverse; use it to find single numbers. n&(n-1) removes the lowest set bit.",
    template: `# Common Bit Tricks
n & (n-1)    # remove lowest set bit
n & (-n)     # isolate lowest set bit
n ^ n == 0   # XOR with itself = 0
a ^ 0 == a   # XOR with 0 = itself
# Count bits (Brian Kernighan)
count = 0
while n:
    n &= n - 1
    count += 1`,
    timeComplexity: "O(1) to O(log n)",
    spaceComplexity: "O(1)"
  },
  "design": {
    name: "System/DS Design",
    icon: "🏗️",
    color: "#a78bfa",
    bgColor: "rgba(167,139,250,0.10)",
    description: "Combine hash maps, heaps, doubly linked lists for O(1) operations. LRU uses HashMap + Doubly Linked List. LFU adds a frequency HashMap.",
    template: `# LRU Cache (HashMap + DLL)
class LRUCache:
    def __init__(self, cap):
        self.cap = cap
        self.cache = {}  # key -> node
        self.head, self.tail = Node(), Node()
        self.head.next = self.tail
        self.tail.prev = self.head
    def get(self, key):
        if key in self.cache:
            self._move_to_front(self.cache[key])
            return self.cache[key].val
        return -1`,
    timeComplexity: "O(1) get/put",
    spaceComplexity: "O(capacity)"
  }
};

// ============================================================
// 90-DAY PLAN — 13 Weeks
// Format: { day, title, problems[], isRest }
// Problem format: { id, name, difficulty, pattern, topic,
//   timeComplexity, spaceComplexity, approach[], lcNum? }
// ============================================================

const PLAN = [
  // ═══════════════════════════════════════════════
  // PHASE 1: FOUNDATIONS (Weeks 1-3)
  // ═══════════════════════════════════════════════
  {
    week: 1,
    weekTitle: "Arrays — Two Pointers & Sliding Window",
    weekPattern: "Two Pointers • Sliding Window",
    phase: "Phase 1: Foundations",
    days: [
      {
        day: 1,
        title: "Two Pointers — Pairs & Triplets",
        problems: [
          {
            id: "p1", lcSlug: "two-sum", name: "Two Sum (sorted array)", difficulty: "easy",
            pattern: "two-pointers", topic: "Arrays",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Initialize left=0, right=n-1",
              "If arr[left]+arr[right] == target, return pair",
              "If sum < target, move left right; else move right left"
            ],
            pdfRef: "Q1 — Section 1.1"
          },
          {
            id: "p2", lcSlug: "3sum", name: "Three Sum", difficulty: "medium",
            pattern: "two-pointers", topic: "Arrays",
            timeComplexity: "O(n²)", spaceComplexity: "O(1)",
            approach: [
              "Sort the array",
              "Fix first element, apply Two Pointers for the remaining",
              "Skip duplicates at each level to avoid repeated triplets"
            ],
            pdfRef: "Q2 — Section 1.1"
          }
        ]
      },
      {
        day: 2,
        title: "Two Pointers — Water & Colors",
        problems: [
          {
            id: "p3", lcSlug: "container-with-most-water", name: "Container With Most Water", difficulty: "medium",
            pattern: "two-pointers", topic: "Arrays",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Start with left=0, right=n-1 (widest container)",
              "Width = right-left, height = min(h[left], h[right])",
              "Move the pointer with smaller height inward"
            ],
            pdfRef: "Q4 — Section 1.1"
          },
          {
            id: "p4", lcSlug: "sort-colors", name: "Sort Colors (Dutch National Flag)", difficulty: "medium",
            pattern: "two-pointers", topic: "Arrays",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Use three pointers: lo, mid, hi",
              "If arr[mid]==0: swap with lo, advance both",
              "If arr[mid]==2: swap with hi, decrement hi only",
              "If arr[mid]==1: advance mid"
            ],
            pdfRef: "Q8 — Section 1.1"
          }
        ]
      },
      {
        day: 3,
        title: "Two Pointers — Advanced",
        problems: [
          {
            id: "p5", lcSlug: "trapping-rain-water", name: "Trapping Rain Water", difficulty: "hard",
            pattern: "two-pointers", topic: "Arrays",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Use left and right pointers with leftMax and rightMax",
              "Water at position i = min(leftMax, rightMax) - height[i]",
              "Process from the side with smaller max height"
            ],
            pdfRef: "Q5 — Section 1.1"
          },
          {
            id: "p6", lcSlug: "squares-of-a-sorted-array", name: "Squares of a Sorted Array", difficulty: "easy",
            pattern: "two-pointers", topic: "Arrays",
            timeComplexity: "O(n)", spaceComplexity: "O(n)",
            approach: [
              "Two pointers at both ends (negatives & positives)",
              "Compare absolute values, place larger square from the end",
              "Result is built right to left"
            ],
            pdfRef: "Q10 — Section 1.1"
          }
        ]
      },
      {
        day: 4,
        title: "Sliding Window — Fixed & Variable",
        problems: [
          {
            id: "p7", lcSlug: "maximum-average-subarray-i", name: "Maximum Sum Subarray of Size K", difficulty: "easy",
            pattern: "sliding-window", topic: "Arrays",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Compute sum of first K elements",
              "Slide: add right element, subtract left element",
              "Track maximum window sum"
            ],
            pdfRef: "Q12 — Section 1.2"
          },
          {
            id: "p8", lcSlug: "longest-substring-without-repeating-characters", name: "Longest Substring Without Repeating Characters", difficulty: "medium",
            pattern: "sliding-window", topic: "Arrays",
            timeComplexity: "O(n)", spaceComplexity: "O(min(n,m))",
            approach: [
              "Use HashMap to store last seen index of each character",
              "When duplicate found, move left to max(left, lastSeen+1)",
              "Update answer with (right - left + 1)"
            ],
            pdfRef: "Q11 — Section 1.2"
          }
        ]
      },
      {
        day: 5,
        title: "Sliding Window — Constraints",
        problems: [
          {
            id: "p9", lcSlug: "minimum-window-substring", name: "Minimum Window Substring", difficulty: "hard",
            pattern: "sliding-window", topic: "Arrays",
            timeComplexity: "O(n+m)", spaceComplexity: "O(m)",
            approach: [
              "Use frequency maps for target and current window",
              "Track 'formed' count of satisfied characters",
              "Shrink left when all characters satisfied, updating min"
            ],
            pdfRef: "Q14 — Section 1.2"
          },
          {
            id: "p10", lcSlug: "max-consecutive-ones-iii", name: "Max Consecutive Ones III", difficulty: "medium",
            pattern: "sliding-window", topic: "Arrays",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Maintain window with at most K zeros",
              "Count zeros in window; when > K, shrink from left",
              "Answer is max window size"
            ],
            pdfRef: "Q19 — Section 1.2"
          }
        ]
      },
      {
        day: 6,
        title: "Sliding Window — Anagrams",
        problems: [
          {
            id: "p11", lcSlug: "permutation-in-string", name: "Permutation in String", difficulty: "medium",
            pattern: "sliding-window", topic: "Arrays",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Fixed window of size len(p); use frequency arrays",
              "Slide window and compare character counts",
              "Use 'matches' counter to track equal frequency chars"
            ],
            pdfRef: "Q16 — Section 1.2"
          },
          {
            id: "p12", lcSlug: "find-all-anagrams-in-a-string", name: "Find All Anagrams in a String", difficulty: "medium",
            pattern: "sliding-window", topic: "Arrays",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Same as Permutation in String but collect all start indices",
              "Maintain sliding window of size len(p)",
              "Add start index to result whenever window is an anagram"
            ],
            pdfRef: "Q17 — Section 1.2"
          }
        ]
      },
      {
        day: 7, isRest: true, title: "Rest & Review Day 1",
        problems: []
      }
    ]
  },
  {
    week: 2,
    weekTitle: "Arrays — Prefix Sum, Kadane's & Intervals",
    weekPattern: "Prefix Sum • Kadane's • Greedy",
    phase: "Phase 1: Foundations",
    days: [
      {
        day: 8,
        title: "Prefix Sum — Core Patterns",
        problems: [
          {
            id: "p13", lcSlug: "subarray-sum-equals-k", name: "Subarray Sum Equals K", difficulty: "medium",
            pattern: "prefix-sum", topic: "Arrays",
            timeComplexity: "O(n)", spaceComplexity: "O(n)",
            approach: [
              "Maintain running prefix sum and a HashMap {sum: count}",
              "At each index, check if (prefixSum - k) exists in map",
              "Add count of such prefix sums to result"
            ],
            pdfRef: "Q21 — Section 1.3"
          },
          {
            id: "p14", lcSlug: "product-of-array-except-self", name: "Product of Array Except Self", difficulty: "medium",
            pattern: "prefix-sum", topic: "Arrays",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Left pass: result[i] = product of all elements left of i",
              "Right pass: multiply result[i] with running right product",
              "No division needed, no extra array needed"
            ],
            pdfRef: "Q24 — Section 1.3"
          }
        ]
      },
      {
        day: 9,
        title: "Prefix Sum — Range Queries",
        problems: [
          {
            id: "p15", lcSlug: "continuous-subarray-sum", name: "Continuous Subarray Sum (multiple of k)", difficulty: "medium",
            pattern: "prefix-sum", topic: "Arrays",
            timeComplexity: "O(n)", spaceComplexity: "O(k)",
            approach: [
              "Track running sum modulo k",
              "If same remainder seen before, subarray sum is multiple of k",
              "Store first occurrence of each remainder; check gap >= 2"
            ],
            pdfRef: "Q23 — Section 1.3"
          },
          {
            id: "p16", lcSlug: "subarray-sums-divisible-by-k", name: "Subarray Sums Divisible by K", difficulty: "medium",
            pattern: "prefix-sum", topic: "Arrays",
            timeComplexity: "O(n)", spaceComplexity: "O(k)",
            approach: [
              "Similar to above but count all valid subarrays",
              "Count frequency of each remainder",
              "Answer = sum of C(freq, 2) for each remainder group"
            ],
            pdfRef: "Q27 — Section 1.3"
          }
        ]
      },
      {
        day: 10,
        title: "Kadane's — Maximum Subarray",
        problems: [
          {
            id: "p17", lcSlug: "maximum-subarray", name: "Maximum Subarray (Kadane's)", difficulty: "medium",
            pattern: "kadane", topic: "Arrays",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Track currMax = max ending here, globalMax = best seen",
              "At each element: currMax = max(num, currMax + num)",
              "Update globalMax after each step"
            ],
            pdfRef: "Q31 — Section 1.4"
          },
          {
            id: "p18", lcSlug: "maximum-product-subarray", name: "Maximum Product Subarray", difficulty: "medium",
            pattern: "kadane", topic: "Arrays",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Track both currMax and currMin (negatives flip sign)",
              "At each element: temp = currMax",
              "currMax = max(num, currMax*num, currMin*num)",
              "currMin = min(num, temp*num, currMin*num)"
            ],
            pdfRef: "Q32 — Section 1.4"
          }
        ]
      },
      {
        day: 11,
        title: "Greedy — Stock & Jump Games",
        problems: [
          {
            id: "p19", lcSlug: "best-time-to-buy-and-sell-stock", name: "Best Time to Buy and Sell Stock", difficulty: "easy",
            pattern: "kadane", topic: "Arrays",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Track minimum price seen so far",
              "At each day: profit = price - minPrice",
              "Update maxProfit and minPrice"
            ],
            pdfRef: "Q33 — Section 1.4"
          },
          {
            id: "p20", lcSlug: "jump-game", name: "Jump Game", difficulty: "medium",
            pattern: "greedy", topic: "Arrays",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Track maxReach = furthest index reachable so far",
              "At index i: if i > maxReach, return False",
              "Update maxReach = max(maxReach, i + nums[i])"
            ],
            pdfRef: "Q35 — Section 1.4"
          }
        ]
      },
      {
        day: 12,
        title: "Intervals — Merge & Schedule",
        problems: [
          {
            id: "p21", lcSlug: "merge-intervals", name: "Merge Intervals", difficulty: "medium",
            pattern: "greedy", topic: "Arrays",
            timeComplexity: "O(n log n)", spaceComplexity: "O(n)",
            approach: [
              "Sort intervals by start time",
              "If current start <= prev end: merge (extend end)",
              "Else: add current to result as new interval"
            ],
            pdfRef: "Q41 — Section 1.5"
          },
          {
            id: "p22", lcSlug: "non-overlapping-intervals", name: "Non-overlapping Intervals", difficulty: "medium",
            pattern: "greedy", topic: "Arrays",
            timeComplexity: "O(n log n)", spaceComplexity: "O(1)",
            approach: [
              "Sort by end time (activity selection greedy)",
              "Greedily select intervals that don't overlap",
              "Answer = n - (max non-overlapping intervals)"
            ],
            pdfRef: "Q44 — Section 1.5"
          }
        ]
      },
      {
        day: 13,
        title: "Binary Search in Arrays",
        problems: [
          {
            id: "p23", lcSlug: "find-minimum-in-rotated-sorted-array", name: "Find Minimum in Rotated Sorted Array", difficulty: "medium",
            pattern: "binary-search", topic: "Arrays",
            timeComplexity: "O(log n)", spaceComplexity: "O(1)",
            approach: [
              "If mid > right: minimum is in right half",
              "Else: minimum is in left half (including mid)",
              "Return arr[lo] when lo == hi"
            ],
            pdfRef: "Q47 — Section 1.5"
          },
          {
            id: "p24", lcSlug: "search-in-rotated-sorted-array", name: "Search in Rotated Sorted Array", difficulty: "medium",
            pattern: "binary-search", topic: "Arrays",
            timeComplexity: "O(log n)", spaceComplexity: "O(1)",
            approach: [
              "Determine which half is sorted by comparing mid with boundaries",
              "If target in sorted half, search there; else search the other",
              "Standard binary search within the correct half"
            ],
            pdfRef: "Q48 — Section 1.5"
          }
        ]
      },
      {
        day: 14, isRest: true, title: "Rest & Review Day 2",
        problems: []
      }
    ]
  },
  {
    week: 3,
    weekTitle: "Strings & Hashing",
    weekPattern: "HashMap • Sliding Window • Pattern Matching",
    phase: "Phase 1: Foundations",
    days: [
      {
        day: 15,
        title: "String Fundamentals",
        problems: [
          {
            id: "p25", lcSlug: "valid-anagram", name: "Valid Anagram", difficulty: "easy",
            pattern: "hashmap", topic: "Strings",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Count character frequencies in both strings",
              "Compare frequency maps (or sort both strings)",
              "Return True if maps are equal"
            ],
            pdfRef: "Q51 — Section 2.1"
          },
          {
            id: "p26", lcSlug: "group-anagrams", name: "Group Anagrams", difficulty: "medium",
            pattern: "hashmap", topic: "Strings",
            timeComplexity: "O(n·k log k)", spaceComplexity: "O(n·k)",
            approach: [
              "For each string, create a sorted version as key",
              "Group strings with the same sorted key in a HashMap",
              "Return HashMap values as list of groups"
            ],
            pdfRef: "Q52 — Section 2.1"
          }
        ]
      },
      {
        day: 16,
        title: "Palindromes & Substrings",
        problems: [
          {
            id: "p27", lcSlug: "longest-palindromic-substring", name: "Longest Palindromic Substring", difficulty: "medium",
            pattern: "sliding-window", topic: "Strings",
            timeComplexity: "O(n²)", spaceComplexity: "O(1)",
            approach: [
              "Expand Around Center: for each center (n + n-1 centers)",
              "Expand left/right while characters match",
              "Track the longest palindrome found"
            ],
            pdfRef: "Q67 — Section 2.2"
          },
          {
            id: "p28", lcSlug: "longest-repeating-character-replacement", name: "Longest Repeating Character Replacement", difficulty: "medium",
            pattern: "sliding-window", topic: "Strings",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Window size = right-left+1; maxCount = most frequent char in window",
              "If (windowSize - maxCount) > k: shrink left",
              "Answer is max valid window size"
            ],
            pdfRef: "Q63 — Section 2.2"
          }
        ]
      },
      {
        day: 17,
        title: "String — Stack Problems",
        problems: [
          {
            id: "p29", lcSlug: "valid-parentheses", name: "Valid Parentheses", difficulty: "easy",
            pattern: "mono-stack", topic: "Strings",
            timeComplexity: "O(n)", spaceComplexity: "O(n)",
            approach: [
              "Use a stack; push opening brackets",
              "On closing bracket: check if top of stack matches",
              "At end: stack must be empty"
            ],
            pdfRef: "Q79 — Section 2.4"
          },
          {
            id: "p30", lcSlug: "decode-string", name: "Decode String (k[encoded_string])", difficulty: "medium",
            pattern: "mono-stack", topic: "Strings",
            timeComplexity: "O(n·maxK)", spaceComplexity: "O(n)",
            approach: [
              "Use stack to save (count, currentString) before '['",
              "On ']': pop from stack and repeat current string",
              "Append multiplied string to previous string from stack"
            ],
            pdfRef: "Q82 — Section 2.4"
          }
        ]
      },
      {
        day: 18,
        title: "String — Advanced Stack",
        problems: [
          {
            id: "p31", lcSlug: "remove-k-digits", name: "Remove K Digits", difficulty: "medium",
            pattern: "mono-stack", topic: "Strings",
            timeComplexity: "O(n)", spaceComplexity: "O(n)",
            approach: [
              "Maintain monotonically increasing stack",
              "While k > 0 and stack top > current digit: pop (k--)",
              "Join stack; handle leading zeros and edge cases"
            ],
            pdfRef: "Q84 — Section 2.4"
          },
          {
            id: "p32", lcSlug: "minimum-remove-to-make-valid-parentheses", name: "Minimum Remove to Make Valid Parentheses", difficulty: "medium",
            pattern: "mono-stack", topic: "Strings",
            timeComplexity: "O(n)", spaceComplexity: "O(n)",
            approach: [
              "First pass: use stack to track unmatched '(' indices",
              "Also mark unmatched ')' as invalid",
              "Second pass: build result excluding all invalid indices"
            ],
            pdfRef: "Q80 — Section 2.4"
          }
        ]
      },
      {
        day: 19,
        title: "Word Break & Decode Ways",
        problems: [
          {
            id: "p33", lcSlug: "word-break", name: "Word Break", difficulty: "medium",
            pattern: "dp-1d", topic: "Strings",
            timeComplexity: "O(n²)", spaceComplexity: "O(n)",
            approach: [
              "dp[i] = True if s[:i] can be segmented",
              "For each i, try all j < i: if dp[j] and s[j:i] in wordSet",
              "dp[0] = True (empty string)"
            ],
            pdfRef: "Q76 — Section 2.3"
          },
          {
            id: "p34", lcSlug: "decode-ways", name: "Decode Ways", difficulty: "medium",
            pattern: "dp-1d", topic: "Strings",
            timeComplexity: "O(n)", spaceComplexity: "O(n)",
            approach: [
              "dp[i] = number of ways to decode s[:i]",
              "Single digit: if s[i-1] != '0', dp[i] += dp[i-1]",
              "Two digits: if 10 <= int(s[i-2:i]) <= 26, dp[i] += dp[i-2]"
            ],
            pdfRef: "Q78 — Section 2.3"
          }
        ]
      },
      {
        day: 20,
        title: "HashMap — Frequency Patterns",
        problems: [
          {
            id: "p35", lcSlug: "longest-consecutive-sequence", name: "Longest Consecutive Sequence", difficulty: "medium",
            pattern: "hashmap", topic: "Hashing",
            timeComplexity: "O(n)", spaceComplexity: "O(n)",
            approach: [
              "Put all numbers in a HashSet",
              "Only start counting from numbers where (num-1) is NOT in set",
              "Count consecutive sequence starting from each valid start"
            ],
            pdfRef: "Q443 — Section 12.1"
          },
          {
            id: "p36", lcSlug: "two-sum", name: "Two Sum (HashMap)", difficulty: "easy",
            pattern: "hashmap", topic: "Hashing",
            timeComplexity: "O(n)", spaceComplexity: "O(n)",
            approach: [
              "Use HashMap {value: index}",
              "For each num, check if (target - num) is in map",
              "If yes, return [map[target-num], i]"
            ],
            pdfRef: "Q442 — Section 12.1"
          }
        ]
      },
      {
        day: 21, isRest: true, title: "Rest & Review Day 3",
        problems: []
      }
    ]
  },
  // ═══════════════════════════════════════════════
  // PHASE 2: CORE DATA STRUCTURES (Weeks 4-6)
  // ═══════════════════════════════════════════════
  {
    week: 4,
    weekTitle: "Linked Lists",
    weekPattern: "Fast & Slow Pointers • In-Place Reversal",
    phase: "Phase 2: Core Data Structures",
    days: [
      {
        day: 22,
        title: "Linked List — Cycle Detection",
        problems: [
          {
            id: "p37", lcSlug: "linked-list-cycle", name: "Linked List Cycle Detection", difficulty: "easy",
            pattern: "fast-slow-ptr", topic: "Linked Lists",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "slow moves 1 step, fast moves 2 steps",
              "If they meet: cycle exists",
              "If fast reaches null: no cycle"
            ],
            pdfRef: "Q89 — Section 3.1"
          },
          {
            id: "p38", lcSlug: "linked-list-cycle-ii", name: "Linked List Cycle II (entry point)", difficulty: "medium",
            pattern: "fast-slow-ptr", topic: "Linked Lists",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Phase 1: detect cycle using fast/slow",
              "Phase 2: reset slow to head; move both 1 step at a time",
              "They meet at the cycle entry point (mathematical proof)"
            ],
            pdfRef: "Q90 — Section 3.1"
          }
        ]
      },
      {
        day: 23,
        title: "Linked List — Middle & Palindrome",
        problems: [
          {
            id: "p39", lcSlug: "middle-of-the-linked-list", name: "Find the Middle of Linked List", difficulty: "easy",
            pattern: "fast-slow-ptr", topic: "Linked Lists",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "slow and fast both start at head",
              "Move: slow 1 step, fast 2 steps",
              "When fast reaches end, slow is at middle"
            ],
            pdfRef: "Q91 — Section 3.1"
          },
          {
            id: "p40", lcSlug: "palindrome-linked-list", name: "Palindrome Linked List", difficulty: "easy",
            pattern: "fast-slow-ptr", topic: "Linked Lists",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Find middle using fast/slow pointers",
              "Reverse second half in-place",
              "Compare first and reversed second half node by node"
            ],
            pdfRef: "Q93 — Section 3.1"
          }
        ]
      },
      {
        day: 24,
        title: "Linked List — Reversal",
        problems: [
          {
            id: "p41", lcSlug: "reverse-linked-list", name: "Reverse a Linked List", difficulty: "easy",
            pattern: "in-place-reversal", topic: "Linked Lists",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Use three pointers: prev=None, curr=head, next",
              "For each node: save next, point curr.next to prev",
              "Advance: prev=curr, curr=next"
            ],
            pdfRef: "Q95 — Section 3.2"
          },
          {
            id: "p42", lcSlug: "reverse-linked-list-ii", name: "Reverse Linked List II (sub-list)", difficulty: "medium",
            pattern: "in-place-reversal", topic: "Linked Lists",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Find the node before position 'left'",
              "Reverse from 'left' to 'right' in-place",
              "Reconnect: beforeLeft.next to newHead, tail to afterRight"
            ],
            pdfRef: "Q96 — Section 3.2"
          }
        ]
      },
      {
        day: 25,
        title: "Linked List — Merge Operations",
        problems: [
          {
            id: "p43", lcSlug: "merge-two-sorted-lists", name: "Merge Two Sorted Lists", difficulty: "easy",
            pattern: "in-place-reversal", topic: "Linked Lists",
            timeComplexity: "O(n+m)", spaceComplexity: "O(1)",
            approach: [
              "Use dummy head to simplify edge cases",
              "Compare heads of both lists; attach smaller one",
              "Advance the pointer of the list we took from"
            ],
            pdfRef: "Q99 — Section 3.2"
          },
          {
            id: "p44", lcSlug: "merge-k-sorted-lists", name: "Merge K Sorted Lists", difficulty: "hard",
            pattern: "heap-topk", topic: "Linked Lists",
            timeComplexity: "O(N log k)", spaceComplexity: "O(k)",
            approach: [
              "Push first node of each list into a min-heap",
              "Pop minimum, add to result, push next node from that list",
              "Repeat until heap is empty"
            ],
            pdfRef: "Q100 — Section 3.2"
          }
        ]
      },
      {
        day: 26,
        title: "Linked List — Essential Operations",
        problems: [
          {
            id: "p45", lcSlug: "remove-nth-node-from-end-of-list", name: "Remove Nth Node from End", difficulty: "medium",
            pattern: "fast-slow-ptr", topic: "Linked Lists",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Use dummy head; move fast pointer N+1 steps ahead",
              "Move both slow and fast until fast reaches null",
              "slow.next is the node to remove; skip it"
            ],
            pdfRef: "Q103 — Section 3.2"
          },
          {
            id: "p46", lcSlug: "copy-list-with-random-pointer", name: "Copy List with Random Pointer", difficulty: "medium",
            pattern: "hashmap", topic: "Linked Lists",
            timeComplexity: "O(n)", spaceComplexity: "O(n)",
            approach: [
              "Pass 1: create copy of each node, store in HashMap {orig: copy}",
              "Pass 2: set next and random pointers using the HashMap",
              "Return map[head]"
            ],
            pdfRef: "Q108 — Section 3.2"
          }
        ]
      },
      {
        day: 27,
        title: "Linked List — Design: LRU Cache",
        problems: [
          {
            id: "p47", lcSlug: "lru-cache", name: "LRU Cache (design problem)", difficulty: "medium",
            pattern: "design", topic: "Linked Lists",
            timeComplexity: "O(1) get/put", spaceComplexity: "O(capacity)",
            approach: [
              "Doubly Linked List for O(1) removal/insertion",
              "HashMap {key: DLL node} for O(1) lookup",
              "On get/put: move accessed node to front (MRU position)",
              "On capacity exceeded: evict from tail (LRU position)"
            ],
            pdfRef: "Q109 — Section 3.2"
          },
          {
            id: "p48", lcSlug: "add-two-numbers", name: "Add Two Numbers (LL representation)", difficulty: "medium",
            pattern: "in-place-reversal", topic: "Linked Lists",
            timeComplexity: "O(max(n,m))", spaceComplexity: "O(max(n,m))",
            approach: [
              "Traverse both lists simultaneously with carry",
              "At each step: sum = l1.val + l2.val + carry",
              "Create new node with sum%10; carry = sum//10"
            ],
            pdfRef: "Q112 — Section 3.3"
          }
        ]
      },
      {
        day: 28, isRest: true, title: "Rest & Review Day 4",
        problems: []
      }
    ]
  },
  {
    week: 5,
    weekTitle: "Stacks, Queues & Binary Search",
    weekPattern: "Monotonic Stack • Deque • Binary Search",
    phase: "Phase 2: Core Data Structures",
    days: [
      {
        day: 29,
        title: "Monotonic Stack — Next Greater",
        problems: [
          {
            id: "p49", lcSlug: "next-greater-element-i", name: "Next Greater Element I", difficulty: "easy",
            pattern: "mono-stack", topic: "Stacks & Queues",
            timeComplexity: "O(n)", spaceComplexity: "O(n)",
            approach: [
              "Build nextGreater map for nums2 using monotonic stack",
              "Pop stack elements smaller than current; assign current as their NGE",
              "Look up each element of nums1 in the map"
            ],
            pdfRef: "Q119 — Section 4.1"
          },
          {
            id: "p50", lcSlug: "daily-temperatures", name: "Daily Temperatures", difficulty: "medium",
            pattern: "mono-stack", topic: "Stacks & Queues",
            timeComplexity: "O(n)", spaceComplexity: "O(n)",
            approach: [
              "Stack stores indices of unresolved temperatures",
              "When current temp > stack top temp: pop and calculate days",
              "result[popped] = current_index - popped_index"
            ],
            pdfRef: "Q121 — Section 4.1"
          }
        ]
      },
      {
        day: 30,
        title: "Monotonic Stack — Histogram",
        problems: [
          {
            id: "p51", lcSlug: "largest-rectangle-in-histogram", name: "Largest Rectangle in Histogram", difficulty: "hard",
            pattern: "mono-stack", topic: "Stacks & Queues",
            timeComplexity: "O(n)", spaceComplexity: "O(n)",
            approach: [
              "Maintain monotonically increasing stack of indices",
              "When current bar < stack top: pop and calculate area",
              "Area = heights[top] * (current_index - stack[-1] - 1)",
              "Append 0 to handle remaining elements in stack"
            ],
            pdfRef: "Q122 — Section 4.1"
          },
          {
            id: "p52", lcSlug: "sum-of-subarray-minimums", name: "Sum of Subarray Minimums", difficulty: "medium",
            pattern: "mono-stack", topic: "Stacks & Queues",
            timeComplexity: "O(n)", spaceComplexity: "O(n)",
            approach: [
              "For each element, find previous lesser (PLE) and next lesser (NLE)",
              "Contribution = arr[i] * (i - PLE) * (NLE - i)",
              "Use monotonic stack to find PLE and NLE in O(n)"
            ],
            pdfRef: "Q124 — Section 4.1"
          }
        ]
      },
      {
        day: 31,
        title: "Queue & Deque Patterns",
        problems: [
          {
            id: "p53", lcSlug: "sliding-window-maximum", name: "Sliding Window Maximum", difficulty: "hard",
            pattern: "mono-deque", topic: "Stacks & Queues",
            timeComplexity: "O(n)", spaceComplexity: "O(k)",
            approach: [
              "Monotonic decreasing deque of indices",
              "Remove indices outside window from front",
              "Remove smaller elements from back before adding current",
              "Front of deque is always the window maximum"
            ],
            pdfRef: "Q129 — Section 4.2"
          },
          {
            id: "p54", lcSlug: "task-scheduler", name: "Task Scheduler", difficulty: "medium",
            pattern: "heap-topk", topic: "Stacks & Queues",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Count task frequencies; find max frequency",
              "Formula: max(n, (maxFreq-1)*(n+1) + countOfMaxFreq)",
              "Or use greedy simulation with a max-heap"
            ],
            pdfRef: "Q139 — Section 4.2"
          }
        ]
      },
      {
        day: 32,
        title: "Binary Search — Classic",
        problems: [
          {
            id: "p55", lcSlug: "binary-search", name: "Binary Search (basic)", difficulty: "easy",
            pattern: "binary-search", topic: "Binary Search",
            timeComplexity: "O(log n)", spaceComplexity: "O(1)",
            approach: [
              "lo=0, hi=n-1; while lo <= hi",
              "mid = lo + (hi-lo)//2 (avoid overflow)",
              "If target < mid: hi = mid-1; if target > mid: lo = mid+1"
            ],
            pdfRef: "Q144 — Section 5.1"
          },
          {
            id: "p56", lcSlug: "find-peak-element", name: "Find Peak Element", difficulty: "medium",
            pattern: "binary-search", topic: "Binary Search",
            timeComplexity: "O(log n)", spaceComplexity: "O(1)",
            approach: [
              "If arr[mid] > arr[mid+1]: peak is in left half",
              "Else: peak is in right half",
              "lo==hi when peak is found"
            ],
            pdfRef: "Q148 — Section 5.1"
          }
        ]
      },
      {
        day: 33,
        title: "Binary Search — 2D & Matrix",
        problems: [
          {
            id: "p57", lcSlug: "search-a-2d-matrix", name: "Search a 2D Matrix", difficulty: "medium",
            pattern: "binary-search", topic: "Binary Search",
            timeComplexity: "O(log(m·n))", spaceComplexity: "O(1)",
            approach: [
              "Treat matrix as 1D sorted array of length m*n",
              "mid index maps to: row=mid//n, col=mid%n",
              "Standard binary search on this virtual 1D array"
            ],
            pdfRef: "Q150 — Section 5.1"
          },
          {
            id: "p58", lcSlug: "kth-smallest-element-in-a-sorted-matrix", name: "Kth Smallest Element in Sorted Matrix", difficulty: "medium",
            pattern: "binary-search", topic: "Binary Search",
            timeComplexity: "O(n log(max-min))", spaceComplexity: "O(1)",
            approach: [
              "Binary search on value range [min, max]",
              "Count elements <= mid using staircase method on matrix",
              "Find smallest value where count >= k"
            ],
            pdfRef: "Q152 — Section 5.1"
          }
        ]
      },
      {
        day: 34,
        title: "Binary Search on Answer",
        problems: [
          {
            id: "p59", lcSlug: "koko-eating-bananas", name: "Koko Eating Bananas", difficulty: "medium",
            pattern: "binary-search-answer", topic: "Binary Search",
            timeComplexity: "O(n log(max))", spaceComplexity: "O(1)",
            approach: [
              "Binary search on speed k (1 to max pile)",
              "Feasibility: total hours = sum(ceil(pile/k)) <= h",
              "Find minimum k where hours <= h"
            ],
            pdfRef: "Q156 — Section 5.2"
          },
          {
            id: "p60", lcSlug: "capacity-to-ship-packages-within-d-days", name: "Capacity to Ship Packages Within D Days", difficulty: "medium",
            pattern: "binary-search-answer", topic: "Binary Search",
            timeComplexity: "O(n log(sum))", spaceComplexity: "O(1)",
            approach: [
              "Binary search on capacity (max weight to sum of all)",
              "Feasibility: simulate packing with given capacity, count days",
              "Find minimum capacity where days <= D"
            ],
            pdfRef: "Q154 — Section 5.2"
          }
        ]
      },
      {
        day: 35, isRest: true, title: "Rest & Review Day 5",
        problems: []
      }
    ]
  },
  {
    week: 6,
    weekTitle: "Trees — Traversals & Properties",
    weekPattern: "DFS • BFS • Recursion",
    phase: "Phase 2: Core Data Structures",
    days: [
      {
        day: 36,
        title: "Tree — Level Order & Views",
        problems: [
          {
            id: "p61", lcSlug: "binary-tree-level-order-traversal", name: "Binary Tree Level Order Traversal", difficulty: "medium",
            pattern: "tree-bfs", topic: "Trees",
            timeComplexity: "O(n)", spaceComplexity: "O(w)",
            approach: [
              "Use queue with initial root",
              "At each level: process all nodes in current queue",
              "Add left and right children to queue for next level"
            ],
            pdfRef: "Q178 — Section 6.1"
          },
          {
            id: "p62", lcSlug: "binary-tree-right-side-view", name: "Binary Tree Right Side View", difficulty: "medium",
            pattern: "tree-bfs", topic: "Trees",
            timeComplexity: "O(n)", spaceComplexity: "O(w)",
            approach: [
              "BFS level order traversal",
              "At each level, take the last node's value",
              "That's what's visible from the right side"
            ],
            pdfRef: "Q180 — Section 6.1"
          }
        ]
      },
      {
        day: 37,
        title: "Tree — DFS Recursive Properties",
        problems: [
          {
            id: "p63", lcSlug: "maximum-depth-of-binary-tree", name: "Maximum Depth of Binary Tree", difficulty: "easy",
            pattern: "tree-dfs", topic: "Trees",
            timeComplexity: "O(n)", spaceComplexity: "O(h)",
            approach: [
              "Recursive: 1 + max(depth(left), depth(right))",
              "Base case: null node returns 0",
              "Or BFS: count number of levels"
            ],
            pdfRef: "Q185 — Section 6.2"
          },
          {
            id: "p64", lcSlug: "diameter-of-binary-tree", name: "Diameter of Binary Tree", difficulty: "easy",
            pattern: "tree-dfs", topic: "Trees",
            timeComplexity: "O(n)", spaceComplexity: "O(h)",
            approach: [
              "For each node: diameter through it = depth(left) + depth(right)",
              "Post-order DFS: compute depth bottom-up",
              "Track global max diameter as we compute depths"
            ],
            pdfRef: "Q187 — Section 6.2"
          }
        ]
      },
      {
        day: 38,
        title: "Tree — Path Sum",
        problems: [
          {
            id: "p65", lcSlug: "path-sum-ii", name: "Path Sum II (all paths)", difficulty: "medium",
            pattern: "tree-dfs", topic: "Trees",
            timeComplexity: "O(n²)", spaceComplexity: "O(n)",
            approach: [
              "DFS with current path and remaining sum",
              "At leaf: if remaining == 0, add path copy to result",
              "Backtrack: remove last node after returning from recursion"
            ],
            pdfRef: "Q195 — Section 6.2"
          },
          {
            id: "p66", lcSlug: "binary-tree-maximum-path-sum", name: "Binary Tree Maximum Path Sum", difficulty: "hard",
            pattern: "tree-dfs", topic: "Trees",
            timeComplexity: "O(n)", spaceComplexity: "O(h)",
            approach: [
              "DFS returns max gain from each node going downward",
              "At each node: candidate = node.val + max(0,left) + max(0,right)",
              "Update global max, return node.val + max(0, left, right)"
            ],
            pdfRef: "Q196 — Section 6.2"
          }
        ]
      },
      {
        day: 39,
        title: "BST — Core Operations",
        problems: [
          {
            id: "p67", lcSlug: "validate-binary-search-tree", name: "Validate Binary Search Tree", difficulty: "medium",
            pattern: "bst", topic: "Trees",
            timeComplexity: "O(n)", spaceComplexity: "O(h)",
            approach: [
              "Pass valid range (lo, hi) to each recursive call",
              "At each node: lo < node.val < hi must hold",
              "Left: update hi = node.val; Right: update lo = node.val"
            ],
            pdfRef: "Q200 — Section 6.3"
          },
          {
            id: "p68", lcSlug: "kth-smallest-element-in-a-bst", name: "Kth Smallest Element in a BST", difficulty: "medium",
            pattern: "bst", topic: "Trees",
            timeComplexity: "O(H+k)", spaceComplexity: "O(H)",
            approach: [
              "In-order traversal gives sorted order in BST",
              "Count nodes visited; stop at kth node",
              "Iterative in-order with stack is most efficient"
            ],
            pdfRef: "Q201 — Section 6.3"
          }
        ]
      },
      {
        day: 40,
        title: "BST — LCA & Construction",
        problems: [
          {
            id: "p69", lcSlug: "lowest-common-ancestor-of-a-binary-tree", name: "Lowest Common Ancestor of Binary Tree", difficulty: "medium",
            pattern: "tree-dfs", topic: "Trees",
            timeComplexity: "O(n)", spaceComplexity: "O(h)",
            approach: [
              "If node is null, p, or q: return node",
              "Recurse left and right",
              "If both sides return non-null: current node is LCA",
              "Else return whichever side is non-null"
            ],
            pdfRef: "Q203 — Section 6.3"
          },
          {
            id: "p70", lcSlug: "serialize-and-deserialize-binary-tree", name: "Serialize and Deserialize Binary Tree", difficulty: "hard",
            pattern: "tree-bfs", topic: "Trees",
            timeComplexity: "O(n)", spaceComplexity: "O(n)",
            approach: [
              "Serialize: BFS/DFS, use '#' for null nodes",
              "Deserialize: reconstruct using queue (BFS) or recursion (DFS)",
              "Preorder DFS is cleanest: serialize root, left, right"
            ],
            pdfRef: "Q211 — Section 6.3"
          }
        ]
      },
      {
        day: 41,
        title: "Trie — Prefix Tree",
        problems: [
          {
            id: "p71", lcSlug: "implement-trie-prefix-tree", name: "Implement Trie (Prefix Tree)", difficulty: "medium",
            pattern: "trie", topic: "Trees",
            timeComplexity: "O(L) per op", spaceComplexity: "O(total chars)",
            approach: [
              "Each node has children dict and is_end flag",
              "insert: traverse/create nodes for each character",
              "search: traverse nodes, check is_end at last char",
              "startsWith: same as search but don't check is_end"
            ],
            pdfRef: "Q225 — Section 6.5"
          },
          {
            id: "p72", lcSlug: "design-add-and-search-words-data-structure", name: "Design Add and Search Words Data Structure", difficulty: "medium",
            pattern: "trie", topic: "Trees",
            timeComplexity: "O(L) insert, O(26^L) search", spaceComplexity: "O(total chars)",
            approach: [
              "Trie with support for '.' wildcard",
              "For '.': try all children recursively",
              "For regular char: standard trie traversal"
            ],
            pdfRef: "Q227 — Section 6.5"
          }
        ]
      },
      {
        day: 42, isRest: true, title: "Rest & Review Day 6",
        problems: []
      }
    ]
  },
  // ═══════════════════════════════════════════════
  // PHASE 3: GRAPHS & HEAPS (Weeks 7-8)
  // ═══════════════════════════════════════════════
  {
    week: 7,
    weekTitle: "Heaps & Priority Queues",
    weekPattern: "Top-K • Two Heaps • Stream",
    phase: "Phase 3: Advanced Structures",
    days: [
      {
        day: 43,
        title: "Heap — Top-K Problems",
        problems: [
          {
            id: "p73", lcSlug: "top-k-frequent-elements", name: "Top K Frequent Elements", difficulty: "medium",
            pattern: "heap-topk", topic: "Heaps",
            timeComplexity: "O(n log k)", spaceComplexity: "O(n)",
            approach: [
              "Count frequencies with HashMap",
              "Use min-heap of size K on (freq, element) pairs",
              "Pop smallest freq when heap exceeds K"
            ],
            pdfRef: "Q232 — Section 7.1"
          },
          {
            id: "p74", lcSlug: "k-closest-points-to-origin", name: "K Closest Points to Origin", difficulty: "medium",
            pattern: "heap-topk", topic: "Heaps",
            timeComplexity: "O(n log k)", spaceComplexity: "O(k)",
            approach: [
              "Use max-heap of size K based on distance squared",
              "If new point closer than farthest in heap: replace",
              "Avoids sorting all n points"
            ],
            pdfRef: "Q234 — Section 7.1"
          }
        ]
      },
      {
        day: 44,
        title: "Heap — Scheduling & Frequency",
        problems: [
          {
            id: "p75", lcSlug: "reorganize-string", name: "Reorganize String", difficulty: "medium",
            pattern: "heap-topk", topic: "Heaps",
            timeComplexity: "O(n log 26) = O(n)", spaceComplexity: "O(1)",
            approach: [
              "Count character frequencies; use max-heap",
              "Greedily pick most frequent available char",
              "Alternate with second most frequent if needed"
            ],
            pdfRef: "Q238 — Section 7.1"
          },
          {
            id: "p76", lcSlug: "kth-largest-element-in-a-stream", name: "Kth Largest Element in a Stream", difficulty: "easy",
            pattern: "heap-topk", topic: "Heaps",
            timeComplexity: "O(log k) per add", spaceComplexity: "O(k)",
            approach: [
              "Maintain min-heap of size K",
              "On add: push element, pop if size > K",
              "Kth largest = heap[0] (top of min-heap)"
            ],
            pdfRef: "Q231 — Section 7.1"
          }
        ]
      },
      {
        day: 45,
        title: "Two Heaps — Median Stream",
        problems: [
          {
            id: "p77", lcSlug: "find-median-from-data-stream", name: "Find Median from Data Stream", difficulty: "hard",
            pattern: "two-heaps", topic: "Heaps",
            timeComplexity: "O(log n) add", spaceComplexity: "O(n)",
            approach: [
              "small (max-heap) stores lower half, large (min-heap) stores upper half",
              "Balance: |small| - |large| <= 1",
              "Median: small[0] if odd, average of both tops if even"
            ],
            pdfRef: "Q241 — Section 7.2"
          },
          {
            id: "p78", lcSlug: "furthest-building-you-can-reach", name: "Furthest Building You Can Reach", difficulty: "medium",
            pattern: "heap-topk", topic: "Heaps",
            timeComplexity: "O(n log k)", spaceComplexity: "O(k)",
            approach: [
              "Use ladders for largest jumps (greedy)",
              "Min-heap tracks the k largest jumps using ladders",
              "When out of ladders: if brick count < min in heap, stop"
            ],
            pdfRef: "Q252 — Section 7.2"
          }
        ]
      },
      {
        day: 46,
        title: "Graph — BFS: Islands & Flood Fill",
        problems: [
          {
            id: "p79", lcSlug: "number-of-islands", name: "Number of Islands", difficulty: "medium",
            pattern: "graph-bfs", topic: "Graphs",
            timeComplexity: "O(m·n)", spaceComplexity: "O(m·n)",
            approach: [
              "Iterate grid; on '1': increment count, BFS/DFS to sink island",
              "BFS: mark all connected '1's as '0' (visited)",
              "Count = number of BFS/DFS calls"
            ],
            pdfRef: "Q253 — Section 8.1"
          },
          {
            id: "p80", lcSlug: "01-matrix", name: "01 Matrix (multi-source BFS)", difficulty: "medium",
            pattern: "graph-bfs", topic: "Graphs",
            timeComplexity: "O(m·n)", spaceComplexity: "O(m·n)",
            approach: [
              "Multi-source BFS: initialize queue with all 0 cells",
              "BFS expands outward; first time a 1 is reached = shortest distance",
              "Avoids running BFS from each 1 cell separately"
            ],
            pdfRef: "Q257 — Section 8.1"
          }
        ]
      },
      {
        day: 47,
        title: "Graph — BFS: Shortest Path",
        problems: [
          {
            id: "p81", lcSlug: "rotting-oranges", name: "Rotting Oranges", difficulty: "medium",
            pattern: "graph-bfs", topic: "Graphs",
            timeComplexity: "O(m·n)", spaceComplexity: "O(m·n)",
            approach: [
              "Multi-source BFS from all rotten oranges",
              "Each BFS level = 1 minute",
              "After BFS, check if any fresh orange remains"
            ],
            pdfRef: "Q258 — Section 8.1"
          },
          {
            id: "p82", lcSlug: "word-ladder", name: "Word Ladder", difficulty: "hard",
            pattern: "graph-bfs", topic: "Graphs",
            timeComplexity: "O(M²·N)", spaceComplexity: "O(M²·N)",
            approach: [
              "BFS where each state is a word",
              "Generate all possible 1-char changes; check if in wordList",
              "Return level when target is reached"
            ],
            pdfRef: "Q263 — Section 8.1"
          }
        ]
      },
      {
        day: 48,
        title: "Graph — DFS & Cloning",
        problems: [
          {
            id: "p83", lcSlug: "clone-graph", name: "Clone Graph", difficulty: "medium",
            pattern: "graph-dfs", topic: "Graphs",
            timeComplexity: "O(V+E)", spaceComplexity: "O(V)",
            approach: [
              "Use HashMap {original: copy} to avoid duplicating nodes",
              "DFS/BFS from start node",
              "For each neighbor, recurse/enqueue and connect to copy"
            ],
            pdfRef: "Q268 — Section 8.2"
          },
          {
            id: "p84", lcSlug: "pacific-atlantic-water-flow", name: "Pacific Atlantic Water Flow", difficulty: "medium",
            pattern: "graph-dfs", topic: "Graphs",
            timeComplexity: "O(m·n)", spaceComplexity: "O(m·n)",
            approach: [
              "Reverse: BFS/DFS from Pacific edges and Atlantic edges separately",
              "Pacific: cells reachable going uphill from top/left borders",
              "Answer: intersection of both reachable sets"
            ],
            pdfRef: "Q256 — Section 8.1"
          }
        ]
      },
      {
        day: 49, isRest: true, title: "Rest & Review Day 7",
        problems: []
      }
    ]
  },
  {
    week: 8,
    weekTitle: "Graphs — Topological Sort, Union-Find & Shortest Path",
    weekPattern: "Topo Sort • DSU • Dijkstra",
    phase: "Phase 3: Advanced Structures",
    days: [
      {
        day: 50,
        title: "Topological Sort — Course Schedule",
        problems: [
          {
            id: "p85", lcSlug: "course-schedule", name: "Course Schedule (cycle detection)", difficulty: "medium",
            pattern: "topo-sort", topic: "Graphs",
            timeComplexity: "O(V+E)", spaceComplexity: "O(V+E)",
            approach: [
              "Build adjacency list and in-degree array",
              "Kahn's: start with nodes of in-degree 0",
              "If processed nodes == total nodes: no cycle"
            ],
            pdfRef: "Q269 — Section 8.2"
          },
          {
            id: "p86", lcSlug: "course-schedule-ii", name: "Course Schedule II (topological sort)", difficulty: "medium",
            pattern: "topo-sort", topic: "Graphs",
            timeComplexity: "O(V+E)", spaceComplexity: "O(V+E)",
            approach: [
              "Same as Course Schedule I but also track order",
              "Kahn's: append each popped node to ordering list",
              "Return ordering if valid, else return empty array"
            ],
            pdfRef: "Q270 — Section 8.2"
          }
        ]
      },
      {
        day: 51,
        title: "Topological Sort — Advanced",
        problems: [
          {
            id: "p87", lcSlug: "alien-dictionary", name: "Alien Dictionary", difficulty: "hard",
            pattern: "topo-sort", topic: "Graphs",
            timeComplexity: "O(C) C=total chars", spaceComplexity: "O(U+min(U²,N))",
            approach: [
              "Compare adjacent words to derive character ordering edges",
              "Build directed graph from ordering constraints",
              "Topological sort gives the alien alphabet order"
            ],
            pdfRef: "Q278 — Section 8.3"
          },
          {
            id: "p88", lcSlug: "find-eventual-safe-states", name: "Find Eventual Safe States", difficulty: "medium",
            pattern: "topo-sort", topic: "Graphs",
            timeComplexity: "O(V+E)", spaceComplexity: "O(V)",
            approach: [
              "A safe node is one not on a cycle",
              "Reverse graph: topological sort from terminal nodes",
              "Nodes reachable from terminals in reverse graph are safe"
            ],
            pdfRef: "Q281 — Section 8.3"
          }
        ]
      },
      {
        day: 52,
        title: "Union-Find — Connected Components",
        problems: [
          {
            id: "p89", lcSlug: "number-of-provinces", name: "Number of Provinces", difficulty: "medium",
            pattern: "union-find", topic: "Graphs",
            timeComplexity: "O(n² α(n))", spaceComplexity: "O(n)",
            approach: [
              "DSU: union connected cities",
              "Count distinct roots = number of provinces",
              "Or DFS/BFS from each unvisited city"
            ],
            pdfRef: "Q285 — Section 8.4"
          },
          {
            id: "p90", lcSlug: "redundant-connection", name: "Redundant Connection (Union-Find)", difficulty: "medium",
            pattern: "union-find", topic: "Graphs",
            timeComplexity: "O(n α(n))", spaceComplexity: "O(n)",
            approach: [
              "Process edges one by one",
              "If both endpoints already in same component: this edge is redundant",
              "Else: union them"
            ],
            pdfRef: "Q273 — Section 8.2"
          }
        ]
      },
      {
        day: 53,
        title: "Union-Find — Advanced",
        problems: [
          {
            id: "p91", lcSlug: "accounts-merge", name: "Accounts Merge (Union-Find / DFS)", difficulty: "medium",
            pattern: "union-find", topic: "Graphs",
            timeComplexity: "O(n·k log(n·k))", spaceComplexity: "O(n·k)",
            approach: [
              "Map each email to an account index",
              "Union accounts sharing emails",
              "Group emails by root; sort each group"
            ],
            pdfRef: "Q274 — Section 8.2"
          },
          {
            id: "p92", lcSlug: "making-a-large-island", name: "Making a Large Island", difficulty: "hard",
            pattern: "union-find", topic: "Graphs",
            timeComplexity: "O(n²)", spaceComplexity: "O(n²)",
            approach: [
              "Label each island with an ID and store its size",
              "For each '0': try flipping it, sum sizes of distinct adjacent islands + 1",
              "Track maximum merged island size"
            ],
            pdfRef: "Q287 — Section 8.4"
          }
        ]
      },
      {
        day: 54,
        title: "Shortest Path — Dijkstra",
        problems: [
          {
            id: "p93", lcSlug: "network-delay-time", name: "Network Delay Time (Dijkstra)", difficulty: "medium",
            pattern: "dijkstra", topic: "Graphs",
            timeComplexity: "O((V+E) log V)", spaceComplexity: "O(V+E)",
            approach: [
              "Dijkstra from source node k",
              "Track shortest time to reach each node",
              "Answer = max time; if any node unreachable: return -1"
            ],
            pdfRef: "Q292 — Section 8.5"
          },
          {
            id: "p94", lcSlug: "path-with-maximum-probability", name: "Path with Maximum Probability", difficulty: "medium",
            pattern: "dijkstra", topic: "Graphs",
            timeComplexity: "O((V+E) log V)", spaceComplexity: "O(V+E)",
            approach: [
              "Modified Dijkstra: maximize probability instead of minimizing cost",
              "Use max-heap; multiply probabilities along path",
              "Negate to use Python's min-heap"
            ],
            pdfRef: "Q293 — Section 8.5"
          }
        ]
      },
      {
        day: 55,
        title: "Shortest Path — Bellman-Ford & Floyd",
        problems: [
          {
            id: "p95", lcSlug: "cheapest-flights-within-k-stops", name: "Cheapest Flights Within K Stops (Bellman-Ford)", difficulty: "medium",
            pattern: "dijkstra", topic: "Graphs",
            timeComplexity: "O(K·E)", spaceComplexity: "O(V)",
            approach: [
              "Bellman-Ford variant: relax edges K+1 times",
              "Use copy of dist array per iteration to prevent using same edge twice",
              "Handles negative weights; limited relaxations = K stops"
            ],
            pdfRef: "Q294 — Section 8.5"
          },
          {
            id: "p96", lcSlug: "min-cost-to-connect-all-points", name: "Min Cost to Connect All Points (Prim's)", difficulty: "medium",
            pattern: "dijkstra", topic: "Graphs",
            timeComplexity: "O(n² log n)", spaceComplexity: "O(n)",
            approach: [
              "Prim's MST: start from any node",
              "Min-heap with (cost, node); track visited",
              "At each step: add cheapest edge to unvisited node"
            ],
            pdfRef: "Q302 — Section 8.6"
          }
        ]
      },
      {
        day: 56, isRest: true, title: "Rest & Review Day 8",
        problems: []
      }
    ]
  },
  // ═══════════════════════════════════════════════
  // PHASE 4: DYNAMIC PROGRAMMING (Weeks 9-11)
  // ═══════════════════════════════════════════════
  {
    week: 9,
    weekTitle: "Dynamic Programming — 1D & 2D",
    weekPattern: "1-D DP • 2-D DP • LCS",
    phase: "Phase 4: Dynamic Programming",
    days: [
      {
        day: 57,
        title: "1-D DP — Foundation",
        problems: [
          {
            id: "p97", lcSlug: "climbing-stairs", name: "Climbing Stairs", difficulty: "easy",
            pattern: "dp-1d", topic: "Dynamic Programming",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "dp[i] = ways to reach step i",
              "dp[i] = dp[i-1] + dp[i-2]  (Fibonacci pattern)",
              "Space optimize: only need last two values"
            ],
            pdfRef: "Q307 — Section 9.1"
          },
          {
            id: "p98", lcSlug: "house-robber", name: "House Robber", difficulty: "medium",
            pattern: "dp-1d", topic: "Dynamic Programming",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "dp[i] = max money robbing up to house i",
              "dp[i] = max(dp[i-1], dp[i-2] + nums[i])",
              "Space optimize: track prev2, prev1 only"
            ],
            pdfRef: "Q308 — Section 9.1"
          }
        ]
      },
      {
        day: 58,
        title: "1-D DP — Coin Change",
        problems: [
          {
            id: "p99", lcSlug: "coin-change", name: "Coin Change (minimum coins)", difficulty: "medium",
            pattern: "dp-1d", topic: "Dynamic Programming",
            timeComplexity: "O(amount·n)", spaceComplexity: "O(amount)",
            approach: [
              "dp[i] = min coins to make amount i",
              "dp[0] = 0; dp[i] = min(dp[i-coin]+1) for each coin <= i",
              "Initialize dp to infinity; return -1 if dp[amount] == inf"
            ],
            pdfRef: "Q314 — Section 9.1"
          },
          {
            id: "p100", lcSlug: "coin-change-ii", name: "Coin Change II (number of ways)", difficulty: "medium",
            pattern: "dp-1d", topic: "Dynamic Programming",
            timeComplexity: "O(amount·n)", spaceComplexity: "O(amount)",
            approach: [
              "dp[i] = number of combinations to make amount i",
              "Loop coins in outer; amounts in inner (avoids permutation duplicates)",
              "dp[i] += dp[i - coin] for each valid coin"
            ],
            pdfRef: "Q315 — Section 9.1"
          }
        ]
      },
      {
        day: 59,
        title: "1-D DP — House Robber & Perfect Squares",
        problems: [
          {
            id: "p101", lcSlug: "house-robber-ii", name: "House Robber II (circular)", difficulty: "medium",
            pattern: "dp-1d", topic: "Dynamic Programming",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Circular constraint: can't rob both first and last",
              "Run House Robber I on [0..n-2] and [1..n-1]",
              "Answer = max of both runs"
            ],
            pdfRef: "Q309 — Section 9.1"
          },
          {
            id: "p102", lcSlug: "perfect-squares", name: "Perfect Squares", difficulty: "medium",
            pattern: "dp-1d", topic: "Dynamic Programming",
            timeComplexity: "O(n·√n)", spaceComplexity: "O(n)",
            approach: [
              "dp[i] = min perfect squares summing to i",
              "Precompute all squares <= n",
              "dp[i] = min(dp[i - sq] + 1) for each sq <= i"
            ],
            pdfRef: "Q316 — Section 9.1"
          }
        ]
      },
      {
        day: 60,
        title: "2-D DP — Grid Paths",
        problems: [
          {
            id: "p103", lcSlug: "unique-paths", name: "Unique Paths", difficulty: "medium",
            pattern: "dp-2d", topic: "Dynamic Programming",
            timeComplexity: "O(m·n)", spaceComplexity: "O(n)",
            approach: [
              "dp[i][j] = paths to reach cell (i,j)",
              "dp[i][j] = dp[i-1][j] + dp[i][j-1]",
              "Base: first row and column = 1 (only one way)"
            ],
            pdfRef: "Q322 — Section 9.2"
          },
          {
            id: "p104", lcSlug: "minimum-path-sum", name: "Minimum Path Sum in Grid", difficulty: "medium",
            pattern: "dp-2d", topic: "Dynamic Programming",
            timeComplexity: "O(m·n)", spaceComplexity: "O(1)",
            approach: [
              "Modify grid in-place or use DP table",
              "dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])",
              "Answer at dp[m-1][n-1]"
            ],
            pdfRef: "Q324 — Section 9.2"
          }
        ]
      },
      {
        day: 61,
        title: "2-D DP — String Comparison",
        problems: [
          {
            id: "p105", lcSlug: "longest-common-subsequence", name: "Longest Common Subsequence", difficulty: "medium",
            pattern: "dp-2d", topic: "Dynamic Programming",
            timeComplexity: "O(m·n)", spaceComplexity: "O(m·n)",
            approach: [
              "dp[i][j] = LCS of text1[:i] and text2[:j]",
              "If chars equal: dp[i][j] = dp[i-1][j-1] + 1",
              "Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])"
            ],
            pdfRef: "Q328 — Section 9.2"
          },
          {
            id: "p106", lcSlug: "edit-distance", name: "Edit Distance", difficulty: "hard",
            pattern: "dp-2d", topic: "Dynamic Programming",
            timeComplexity: "O(m·n)", spaceComplexity: "O(m·n)",
            approach: [
              "dp[i][j] = min ops to convert word1[:i] to word2[:j]",
              "If chars equal: dp[i][j] = dp[i-1][j-1]",
              "Else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])"
            ],
            pdfRef: "Q330 — Section 9.2"
          }
        ]
      },
      {
        day: 62,
        title: "2-D DP — Matrices",
        problems: [
          {
            id: "p107", lcSlug: "maximal-square", name: "Maximal Square", difficulty: "medium",
            pattern: "dp-2d", topic: "Dynamic Programming",
            timeComplexity: "O(m·n)", spaceComplexity: "O(n)",
            approach: [
              "dp[i][j] = side length of max square ending at (i,j)",
              "If matrix[i][j]=='1': dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1",
              "Answer = max(dp[i][j])² "
            ],
            pdfRef: "Q326 — Section 9.2"
          },
          {
            id: "p108", lcSlug: "interleaving-string", name: "Interleaving String", difficulty: "medium",
            pattern: "dp-2d", topic: "Dynamic Programming",
            timeComplexity: "O(m·n)", spaceComplexity: "O(m·n)",
            approach: [
              "dp[i][j] = can s3[:i+j] be formed by interleaving s1[:i] and s2[:j]",
              "Transition: dp[i][j] = (dp[i-1][j] and s1[i-1]==s3[i+j-1]) or (dp[i][j-1] and s2[j-1]==s3[i+j-1])",
              "Base: dp[0][0] = True"
            ],
            pdfRef: "Q332 — Section 9.2"
          }
        ]
      },
      {
        day: 63, isRest: true, title: "Rest & Review Day 9",
        problems: []
      }
    ]
  },
  {
    week: 10,
    weekTitle: "DP — Knapsack, Intervals & State Machine",
    weekPattern: "Knapsack • Interval DP • Stock DP",
    phase: "Phase 4: Dynamic Programming",
    days: [
      {
        day: 64,
        title: "Knapsack — Core Variants",
        problems: [
          {
            id: "p109", lcSlug: "partition-equal-subset-sum", name: "Partition Equal Subset Sum", difficulty: "medium",
            pattern: "knapsack", topic: "Dynamic Programming",
            timeComplexity: "O(n·sum)", spaceComplexity: "O(sum)",
            approach: [
              "Find if subset sums to total/2",
              "0/1 Knapsack: dp[j] = can we make sum j",
              "Process amounts in reverse to avoid reuse"
            ],
            pdfRef: "Q339 — Section 9.3"
          },
          {
            id: "p110", lcSlug: "target-sum", name: "Target Sum (assign +/- to reach target)", difficulty: "medium",
            pattern: "knapsack", topic: "Dynamic Programming",
            timeComplexity: "O(n·sum)", spaceComplexity: "O(sum)",
            approach: [
              "Reformulate: P - N = target and P + N = sum → P = (sum+target)/2",
              "Count subsets summing to P (unbounded knapsack style)",
              "dp[j] += dp[j-num] for each num"
            ],
            pdfRef: "Q340 — Section 9.3"
          }
        ]
      },
      {
        day: 65,
        title: "Knapsack — Count Ways",
        problems: [
          {
            id: "p111", lcSlug: "combination-sum-iv", name: "Combination Sum IV", difficulty: "medium",
            pattern: "knapsack", topic: "Dynamic Programming",
            timeComplexity: "O(target·n)", spaceComplexity: "O(target)",
            approach: [
              "dp[i] = number of ways to make sum i (order matters)",
              "Outer loop: amounts; inner loop: nums",
              "dp[i] += dp[i-num] for each valid num"
            ],
            pdfRef: "Q345 — Section 9.3"
          },
          {
            id: "p112", lcSlug: "ones-and-zeroes", name: "Ones and Zeroes (2D knapsack)", difficulty: "medium",
            pattern: "knapsack", topic: "Dynamic Programming",
            timeComplexity: "O(l·m·n)", spaceComplexity: "O(m·n)",
            approach: [
              "2D knapsack: dp[i][j] = max strings with i zeros and j ones",
              "For each string: count its 0s and 1s",
              "Reverse iteration: dp[i][j] = max(dp[i][j], dp[i-z][j-o]+1)"
            ],
            pdfRef: "Q342 — Section 9.3"
          }
        ]
      },
      {
        day: 66,
        title: "Interval DP",
        problems: [
          {
            id: "p113", lcSlug: "burst-balloons", name: "Burst Balloons (interval DP)", difficulty: "hard",
            pattern: "dp-2d", topic: "Dynamic Programming",
            timeComplexity: "O(n³)", spaceComplexity: "O(n²)",
            approach: [
              "dp[i][j] = max coins bursting all balloons in range (i,j)",
              "Think of last balloon to burst (not first)",
              "Add 1 at boundaries; try each k as last burst"
            ],
            pdfRef: "Q336 — Section 9.2"
          },
          {
            id: "p114", lcSlug: "palindrome-partitioning-ii", name: "Palindrome Partitioning II (min cuts)", difficulty: "hard",
            pattern: "dp-1d", topic: "Dynamic Programming",
            timeComplexity: "O(n²)", spaceComplexity: "O(n²)",
            approach: [
              "Precompute isPalin[i][j] using DP",
              "dp[i] = min cuts for s[:i]",
              "For each j <= i where s[j:i] is palindrome: dp[i] = min(dp[i], dp[j]+1)"
            ],
            pdfRef: "Q354 — Section 9.4"
          }
        ]
      },
      {
        day: 67,
        title: "State Machine DP — Stocks",
        problems: [
          {
            id: "p115", lcSlug: "best-time-to-buy-and-sell-stock-iii", name: "Best Time to Buy and Sell Stock III (at most 2 transactions)", difficulty: "hard",
            pattern: "dp-1d", topic: "Dynamic Programming",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Track 4 states: buy1, sell1, buy2, sell2",
              "buy1 = max(buy1, -price), sell1 = max(sell1, buy1+price)",
              "buy2 = max(buy2, sell1-price), sell2 = max(sell2, buy2+price)"
            ],
            pdfRef: "Q357 — Section 9.5"
          },
          {
            id: "p116", lcSlug: "best-time-to-buy-and-sell-stock-with-cooldown", name: "Best Time to Buy and Sell Stock with Cooldown", difficulty: "medium",
            pattern: "dp-1d", topic: "Dynamic Programming",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "States: held (max profit holding), sold (just sold), resting",
              "held = max(held, resting - price)",
              "sold = held + price",
              "resting = max(resting, prev_sold)"
            ],
            pdfRef: "Q359 — Section 9.5"
          }
        ]
      },
      {
        day: 68,
        title: "DP — LIS & Subsequences",
        problems: [
          {
            id: "p117", lcSlug: "longest-increasing-subsequence", name: "Longest Increasing Subsequence (O(n log n))", difficulty: "medium",
            pattern: "binary-search", topic: "Dynamic Programming",
            timeComplexity: "O(n log n)", spaceComplexity: "O(n)",
            approach: [
              "Maintain 'tails' array: tails[i] = smallest tail of LIS of length i+1",
              "For each num: binary search for position in tails",
              "Replace or extend tails array"
            ],
            pdfRef: "Q169 — Section 5.3"
          },
          {
            id: "p118", lcSlug: "distinct-subsequences", name: "Distinct Subsequences", difficulty: "hard",
            pattern: "dp-2d", topic: "Dynamic Programming",
            timeComplexity: "O(m·n)", spaceComplexity: "O(m·n)",
            approach: [
              "dp[i][j] = ways to form t[:i] using s[:j]",
              "If t[i-1]==s[j-1]: dp[i][j] = dp[i-1][j-1] + dp[i][j-1]",
              "Else: dp[i][j] = dp[i][j-1]"
            ],
            pdfRef: "Q331 — Section 9.2"
          }
        ]
      },
      {
        day: 69,
        title: "DP — Paint & Arrangement",
        problems: [
          {
            id: "p119", lcSlug: "paint-house", name: "Paint House", difficulty: "medium",
            pattern: "dp-1d", topic: "Dynamic Programming",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "dp[i][c] = min cost painting house i with color c",
              "dp[i][c] = costs[i][c] + min(dp[i-1] for other colors)",
              "Space optimize: only keep previous row"
            ],
            pdfRef: "Q361 — Section 9.5"
          },
          {
            id: "p120", lcSlug: "maximum-profit-in-job-scheduling", name: "Maximum Profit in Job Scheduling", difficulty: "hard",
            pattern: "binary-search", topic: "Dynamic Programming",
            timeComplexity: "O(n log n)", spaceComplexity: "O(n)",
            approach: [
              "Sort jobs by end time",
              "dp[i] = max profit using jobs from 0..i",
              "For each job: binary search for last non-overlapping job"
            ],
            pdfRef: "Q173 — Section 5.3"
          }
        ]
      },
      {
        day: 70, isRest: true, title: "Rest & Review Day 10",
        problems: []
      }
    ]
  },
  // ═══════════════════════════════════════════════
  // PHASE 5: BACKTRACKING & GREEDY (Week 11)
  // ═══════════════════════════════════════════════
  {
    week: 11,
    weekTitle: "Backtracking",
    weekPattern: "Subsets • Permutations • Constraint Pruning",
    phase: "Phase 5: Backtracking & Greedy",
    days: [
      {
        day: 71,
        title: "Backtracking — Subsets",
        problems: [
          {
            id: "p121", lcSlug: "subsets", name: "Subsets", difficulty: "medium",
            pattern: "backtracking", topic: "Backtracking",
            timeComplexity: "O(2ⁿ·n)", spaceComplexity: "O(n)",
            approach: [
              "Backtrack with start index to avoid duplicates",
              "At each call: add current path to results",
              "Try each element from start to end"
            ],
            pdfRef: "Q387 — Section 10.1"
          },
          {
            id: "p122", lcSlug: "subsets-ii", name: "Subsets II (with duplicates)", difficulty: "medium",
            pattern: "backtracking", topic: "Backtracking",
            timeComplexity: "O(2ⁿ·n)", spaceComplexity: "O(n)",
            approach: [
              "Sort array first to group duplicates together",
              "Skip: if i > start and nums[i] == nums[i-1]: continue",
              "This prevents choosing same element at same level"
            ],
            pdfRef: "Q388 — Section 10.1"
          }
        ]
      },
      {
        day: 72,
        title: "Backtracking — Combinations",
        problems: [
          {
            id: "p123", lcSlug: "combination-sum", name: "Combination Sum", difficulty: "medium",
            pattern: "backtracking", topic: "Backtracking",
            timeComplexity: "O(n^(t/m))", spaceComplexity: "O(t/m)",
            approach: [
              "Each element can be used unlimited times",
              "Pass same index i (not i+1) to allow reuse",
              "Prune: if target < 0, backtrack"
            ],
            pdfRef: "Q390 — Section 10.1"
          },
          {
            id: "p124", lcSlug: "letter-combinations-of-a-phone-number", name: "Letter Combinations of a Phone Number", difficulty: "medium",
            pattern: "backtracking", topic: "Backtracking",
            timeComplexity: "O(4ⁿ·n)", spaceComplexity: "O(n)",
            approach: [
              "Map each digit to its letters",
              "Backtrack: for each digit, try all mapped letters",
              "When path length == digits length: add to results"
            ],
            pdfRef: "Q393 — Section 10.1"
          }
        ]
      },
      {
        day: 73,
        title: "Backtracking — Permutations",
        problems: [
          {
            id: "p125", lcSlug: "permutations", name: "Permutations", difficulty: "medium",
            pattern: "backtracking", topic: "Backtracking",
            timeComplexity: "O(n!·n)", spaceComplexity: "O(n)",
            approach: [
              "Use visited array; try each unvisited element",
              "When path length == n: add copy to results",
              "Alternative: swap elements in-place"
            ],
            pdfRef: "Q397 — Section 10.2"
          },
          {
            id: "p126", lcSlug: "permutations-ii", name: "Permutations II (with duplicates)", difficulty: "medium",
            pattern: "backtracking", topic: "Backtracking",
            timeComplexity: "O(n!·n)", spaceComplexity: "O(n)",
            approach: [
              "Sort; use visited array",
              "Skip: if nums[i]==nums[i-1] and not visited[i-1]: continue",
              "This ensures each unique permutation generated exactly once"
            ],
            pdfRef: "Q398 — Section 10.2"
          }
        ]
      },
      {
        day: 74,
        title: "Backtracking — Generate Parentheses & Partition",
        problems: [
          {
            id: "p127", lcSlug: "generate-parentheses", name: "Generate Parentheses", difficulty: "medium",
            pattern: "backtracking", topic: "Backtracking",
            timeComplexity: "O(4ⁿ/√n)", spaceComplexity: "O(n)",
            approach: [
              "Track open and close count",
              "Add '(' if open < n",
              "Add ')' if close < open",
              "When len(path) == 2n: add to results"
            ],
            pdfRef: "Q394 — Section 10.1"
          },
          {
            id: "p128", lcSlug: "palindrome-partitioning", name: "Palindrome Partitioning", difficulty: "medium",
            pattern: "backtracking", topic: "Backtracking",
            timeComplexity: "O(n·2ⁿ)", spaceComplexity: "O(n)",
            approach: [
              "Try all substrings starting from index",
              "If s[start:end+1] is palindrome: add to path, recurse",
              "When start == len(s): add path to results"
            ],
            pdfRef: "Q401 — Section 10.2"
          }
        ]
      },
      {
        day: 75,
        title: "Backtracking — N-Queens & Sudoku",
        problems: [
          {
            id: "p129", lcSlug: "n-queens", name: "N-Queens", difficulty: "hard",
            pattern: "backtracking", topic: "Backtracking",
            timeComplexity: "O(n!)", spaceComplexity: "O(n²)",
            approach: [
              "Place queens row by row",
              "Track columns, diagonal1 (r-c), diagonal2 (r+c) sets",
              "Try each column; prune if attack detected"
            ],
            pdfRef: "Q403 — Section 10.2"
          },
          {
            id: "p130", lcSlug: "word-search", name: "Word Search", difficulty: "medium",
            pattern: "backtracking", topic: "Backtracking",
            timeComplexity: "O(m·n·4^L)", spaceComplexity: "O(L)",
            approach: [
              "DFS from each cell matching word[0]",
              "Mark cell as visited (modify in-place), then restore",
              "Try all 4 directions; prune if out of bounds or mismatch"
            ],
            pdfRef: "Q402 — Section 10.2"
          }
        ]
      },
      {
        day: 76,
        title: "Greedy — Interval Scheduling",
        problems: [
          {
            id: "p131", lcSlug: "non-overlapping-intervals", name: "Non-overlapping Intervals (Activity Selection)", difficulty: "medium",
            pattern: "greedy", topic: "Greedy",
            timeComplexity: "O(n log n)", spaceComplexity: "O(1)",
            approach: [
              "Sort intervals by end time",
              "Greedily select: keep interval if it doesn't overlap last selected",
              "Min removals = n - max non-overlapping count"
            ],
            pdfRef: "Q417 — Section 11.1"
          },
          {
            id: "p132", lcSlug: "queue-reconstruction-by-height", name: "Queue Reconstruction by Height", difficulty: "medium",
            pattern: "greedy", topic: "Greedy",
            timeComplexity: "O(n²)", spaceComplexity: "O(n)",
            approach: [
              "Sort: taller people first; same height by k ascending",
              "Insert each person at index k in result",
              "Taller people placed first don't affect shorter people's k"
            ],
            pdfRef: "Q424 — Section 11.1"
          }
        ]
      },
      {
        day: 77, isRest: true, title: "Rest & Review Day 11",
        problems: []
      }
    ]
  },
  // ═══════════════════════════════════════════════
  // PHASE 6: ADVANCED & MOCK PREP (Weeks 12-13)
  // ═══════════════════════════════════════════════
  {
    week: 12,
    weekTitle: "Greedy, Bit Manipulation & Math",
    weekPattern: "Greedy • Bit Tricks • Number Theory",
    phase: "Phase 6: Final Sprint",
    days: [
      {
        day: 78,
        title: "Greedy — String & Array",
        problems: [
          {
            id: "p133", lcSlug: "minimum-number-of-arrows-to-burst-balloons", name: "Minimum Number of Arrows to Burst Balloons", difficulty: "medium",
            pattern: "greedy", topic: "Greedy",
            timeComplexity: "O(n log n)", spaceComplexity: "O(1)",
            approach: [
              "Sort balloons by end coordinate",
              "Shoot arrow at end of first balloon",
              "Skip all balloons that overlap (share the arrow)"
            ],
            pdfRef: "Q40 — Section 1.4"
          },
          {
            id: "p134", lcSlug: "gas-station", name: "Gas Station", difficulty: "medium",
            pattern: "greedy", topic: "Greedy",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "If total gas >= total cost: solution exists",
              "Track tank level; when it goes negative: start from next station",
              "The final start is the answer"
            ],
            pdfRef: "Q37 — Section 1.4"
          }
        ]
      },
      {
        day: 79,
        title: "Greedy — Two City & Jump Game II",
        problems: [
          {
            id: "p135", lcSlug: "jump-game-ii", name: "Jump Game II (minimum jumps)", difficulty: "medium",
            pattern: "greedy", topic: "Greedy",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Track current reach, next reach, and jump count",
              "When i reaches current reach: increment jumps, update current reach",
              "Stop when current reach >= n-1"
            ],
            pdfRef: "Q36 — Section 1.4"
          },
          {
            id: "p136", lcSlug: "two-city-scheduling", name: "Two City Scheduling", difficulty: "medium",
            pattern: "greedy", topic: "Greedy",
            timeComplexity: "O(n log n)", spaceComplexity: "O(1)",
            approach: [
              "Send everyone to city A first",
              "Sort by (costA - costB) — cost saving of sending to B",
              "Move n/2 people with highest savings to city B"
            ],
            pdfRef: "Q425 — Section 11.1"
          }
        ]
      },
      {
        day: 80,
        title: "Bit Manipulation",
        problems: [
          {
            id: "p137", lcSlug: "single-number", name: "Single Number", difficulty: "easy",
            pattern: "bit-manip", topic: "Bit Manipulation",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "XOR all elements together",
              "Pairs cancel out (a XOR a = 0)",
              "Remaining value is the single number"
            ],
            pdfRef: "Q462 — Section 12.3"
          },
          {
            id: "p138", lcSlug: "number-of-1-bits", name: "Number of 1 Bits (Hamming Weight)", difficulty: "easy",
            pattern: "bit-manip", topic: "Bit Manipulation",
            timeComplexity: "O(log n)", spaceComplexity: "O(1)",
            approach: [
              "Brian Kernighan's: n &= (n-1) removes lowest set bit",
              "Count iterations until n == 0",
              "Or: count = bin(n).count('1')"
            ],
            pdfRef: "Q465 — Section 12.3"
          }
        ]
      },
      {
        day: 81,
        title: "Bit Manipulation — Advanced",
        problems: [
          {
            id: "p139", lcSlug: "single-number-ii", name: "Single Number II (bit counting)", difficulty: "medium",
            pattern: "bit-manip", topic: "Bit Manipulation",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "For each bit position: count occurrences across all numbers",
              "If count % 3 != 0: that bit belongs to the single number",
              "Or use 'ones' and 'twos' bitmasks approach"
            ],
            pdfRef: "Q463 — Section 12.3"
          },
          {
            id: "p140", lcSlug: "maximum-xor-of-two-numbers-in-an-array", name: "Maximum XOR of Two Numbers in Array", difficulty: "medium",
            pattern: "bit-manip", topic: "Bit Manipulation",
            timeComplexity: "O(n)", spaceComplexity: "O(n)",
            approach: [
              "Greedily build answer bit by bit from MSB to LSB",
              "Use prefix HashSet at each bit level",
              "For bit b: check if (candidate XOR prefix) exists in prefixes"
            ],
            pdfRef: "Q470 — Section 12.3"
          }
        ]
      },
      {
        day: 82,
        title: "Math — Number Theory",
        problems: [
          {
            id: "p141", lcSlug: "count-primes", name: "Count Primes (Sieve of Eratosthenes)", difficulty: "medium",
            pattern: "hashmap", topic: "Math",
            timeComplexity: "O(n log log n)", spaceComplexity: "O(n)",
            approach: [
              "Initialize boolean array, assume all prime",
              "For each prime p: mark all multiples of p as composite",
              "Start marking from p²; count remaining True values"
            ],
            pdfRef: "Q452 — Section 12.2"
          },
          {
            id: "p142", lcSlug: "happy-number", name: "Happy Number (Floyd's cycle)", difficulty: "easy",
            pattern: "fast-slow-ptr", topic: "Math",
            timeComplexity: "O(log n)", spaceComplexity: "O(1)",
            approach: [
              "sumOfSquares(n): compute digit square sum",
              "Apply Floyd's cycle detection on the sequence",
              "If slow == 1: happy; else: cycle detected (not happy)"
            ],
            pdfRef: "Q455 — Section 12.2"
          }
        ]
      },
      {
        day: 83,
        title: "System Design — LRU & LFU",
        problems: [
          {
            id: "p143", lcSlug: "lru-cache", name: "Design LRU Cache", difficulty: "medium",
            pattern: "design", topic: "Design",
            timeComplexity: "O(1) get/put", spaceComplexity: "O(capacity)",
            approach: [
              "HashMap + Doubly Linked List",
              "HashMap: key -> node for O(1) lookup",
              "DLL: O(1) removal and insertion; head=MRU, tail=LRU"
            ],
            pdfRef: "Q472 — Section 13.1"
          },
          {
            id: "p144", lcSlug: "insert-delete-getrandom-o1", name: "Insert Delete GetRandom O(1)", difficulty: "medium",
            pattern: "design", topic: "Design",
            timeComplexity: "O(1) all ops", spaceComplexity: "O(n)",
            approach: [
              "HashMap: value -> index in array",
              "Array: store values for O(1) random access",
              "Delete: swap with last element, update map, pop last"
            ],
            pdfRef: "Q486 — Section 13.2"
          }
        ]
      },
      {
        day: 84, isRest: true, title: "Rest & Review Day 12",
        problems: []
      }
    ]
  },
  {
    week: 13,
    weekTitle: "Mock Interview Week — Pattern Consolidation",
    weekPattern: "Mixed Patterns • Timed Practice",
    phase: "Phase 6: Final Sprint",
    days: [
      {
        day: 85,
        title: "Mock Day 1 — Arrays & Strings Mix",
        problems: [
          {
            id: "p145", lcSlug: "fruit-into-baskets", name: "Fruit Into Baskets (at most 2 distinct)", difficulty: "medium",
            pattern: "sliding-window", topic: "Arrays",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Sliding window with at most 2 distinct fruits",
              "HashMap tracks count of each fruit type in window",
              "Shrink left when more than 2 distinct types"
            ],
            pdfRef: "Q13 — Section 1.2"
          },
          {
            id: "p146", lcSlug: "subarray-product-less-than-k", name: "Number of Subarrays with Product Less Than K", difficulty: "medium",
            pattern: "sliding-window", topic: "Arrays",
            timeComplexity: "O(n)", spaceComplexity: "O(1)",
            approach: [
              "Sliding window tracking product",
              "When product >= k: shrink from left",
              "Each valid window of size (right-left+1) contributes that many subarrays"
            ],
            pdfRef: "Q20 — Section 1.2"
          }
        ]
      },
      {
        day: 86,
        title: "Mock Day 2 — Trees & Graphs Mix",
        problems: [
          {
            id: "p147", lcSlug: "vertical-order-traversal-of-a-binary-tree", name: "Vertical Order Traversal", difficulty: "hard",
            pattern: "tree-bfs", topic: "Trees",
            timeComplexity: "O(n log n)", spaceComplexity: "O(n)",
            approach: [
              "BFS tracking (node, row, col) tuples",
              "Group nodes by column; within column sort by row then value",
              "Return groups in column order"
            ],
            pdfRef: "Q183 — Section 6.1"
          },
          {
            id: "p148", lcSlug: "is-graph-bipartite", name: "Is Graph Bipartite?", difficulty: "medium",
            pattern: "graph-bfs", topic: "Graphs",
            timeComplexity: "O(V+E)", spaceComplexity: "O(V)",
            approach: [
              "2-color graph using BFS",
              "Assign alternating colors to neighbors",
              "If same-color conflict found: not bipartite"
            ],
            pdfRef: "Q276 — Section 8.2"
          }
        ]
      },
      {
        day: 87,
        title: "Mock Day 3 — DP Hard Problems",
        problems: [
          {
            id: "p149", lcSlug: "russian-doll-envelopes", name: "Russian Doll Envelopes", difficulty: "hard",
            pattern: "binary-search", topic: "Dynamic Programming",
            timeComplexity: "O(n log n)", spaceComplexity: "O(n)",
            approach: [
              "Sort by width ASC; same width by height DESC",
              "Apply LIS on heights only",
              "DESC height for same width prevents using same envelope twice"
            ],
            pdfRef: "Q170 — Section 5.3"
          },
          {
            id: "p150", lcSlug: "best-time-to-buy-and-sell-stock-iv", name: "Best Time to Buy and Sell Stock IV (at most k transactions)", difficulty: "hard",
            pattern: "dp-1d", topic: "Dynamic Programming",
            timeComplexity: "O(n·k)", spaceComplexity: "O(k)",
            approach: [
              "dp[j] = max profit with j transactions so far",
              "For each price, update all k transaction states",
              "If k >= n/2: unlimited transactions (greedy)"
            ],
            pdfRef: "Q358 — Section 9.5"
          }
        ]
      },
      {
        day: 88,
        title: "Mock Day 4 — Graph Algorithms",
        problems: [
          {
            id: "p151", lcSlug: "path-with-minimum-effort", name: "Path with Minimum Effort (Dijkstra / Binary Search)", difficulty: "medium",
            pattern: "dijkstra", topic: "Graphs",
            timeComplexity: "O(m·n log(m·n))", spaceComplexity: "O(m·n)",
            approach: [
              "Modified Dijkstra: minimize max absolute difference along path",
              "Heap stores (effort, row, col)",
              "Or binary search on effort + BFS/DFS feasibility check"
            ],
            pdfRef: "Q296 — Section 8.5"
          },
          {
            id: "p152", lcSlug: "minimum-height-trees", name: "Minimum Height Trees", difficulty: "medium",
            pattern: "topo-sort", topic: "Graphs",
            timeComplexity: "O(n)", spaceComplexity: "O(n)",
            approach: [
              "Trim leaves (degree 1) iteratively like Kahn's",
              "The remaining nodes (1 or 2) are the roots",
              "Process level by level until <= 2 nodes remain"
            ],
            pdfRef: "Q280 — Section 8.3"
          }
        ]
      },
      {
        day: 89,
        title: "Mock Day 5 — Backtracking & Design",
        problems: [
          {
            id: "p153", lcSlug: "word-search-ii", name: "Word Search II (Trie + DFS)", difficulty: "hard",
            pattern: "trie", topic: "Trees",
            timeComplexity: "O(m·n·4·3^(L-1))", spaceComplexity: "O(total chars)",
            approach: [
              "Build Trie from all words",
              "DFS on grid; prune branches not in Trie",
              "When Trie node marks word end: add to result"
            ],
            pdfRef: "Q226 — Section 6.5"
          },
          {
            id: "p154", lcSlug: "design-twitter", name: "Design Twitter (top 10 tweets feed)", difficulty: "medium",
            pattern: "design", topic: "Design",
            timeComplexity: "O(n log n)", spaceComplexity: "O(n)",
            approach: [
              "HashMap: user -> list of (timestamp, tweetId)",
              "getNewsFeed: merge tweets from user and followees",
              "Use heap to get top 10; timestamps for ordering"
            ],
            pdfRef: "Q474 — Section 13.1"
          }
        ]
      },
      {
        day: 90,
        title: "Final Day — Wildcards & Regex",
        problems: [
          {
            id: "p155", lcSlug: "wildcard-matching", name: "Wildcard Matching", difficulty: "hard",
            pattern: "dp-2d", topic: "Dynamic Programming",
            timeComplexity: "O(m·n)", spaceComplexity: "O(m·n)",
            approach: [
              "dp[i][j] = does p[:i] match s[:j]",
              "If p[i-1]=='?': dp[i][j] = dp[i-1][j-1]",
              "If p[i-1]=='*': dp[i][j] = dp[i-1][j] or dp[i][j-1]",
              "If match: dp[i][j] = dp[i-1][j-1]"
            ],
            pdfRef: "Q74 — Section 2.3"
          },
          {
            id: "p156", lcSlug: "minimum-cost-to-cut-a-stick", name: "Minimum Cost to Cut a Stick", difficulty: "hard",
            pattern: "dp-2d", topic: "Dynamic Programming",
            timeComplexity: "O(n³)", spaceComplexity: "O(n²)",
            approach: [
              "Add endpoints 0 and L to cuts array, sort it",
              "Interval DP: dp[i][j] = min cost to perform all cuts between cuts[i] and cuts[j]",
              "Cost of cut k between i,j = cuts[j] - cuts[i]"
            ],
            pdfRef: "Q386 — Section 9.7"
          }
        ]
      }
    ]
  }
];

// Flatten all problems for easy lookup
const ALL_PROBLEMS = [];
PLAN.forEach(week => {
  week.days.forEach(day => {
    day.problems.forEach(p => {
      ALL_PROBLEMS.push({ ...p, week: week.week, day: day.day, dayTitle: day.title });
    });
  });
});
