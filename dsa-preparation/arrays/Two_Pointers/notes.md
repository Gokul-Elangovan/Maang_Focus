# Two Pointers — When to Use and How to Recognize the Pattern

## 1. What is Two Pointers?

Two pointers is a technique where we use two index variables to traverse an array, string, linked list, or sequence.

Instead of repeatedly checking every possible combination, we move pointers according to a rule that helps us eliminate unnecessary work.

**Main goal:** Reduce time complexity, often from O(n²) to O(n).

## 2. How to Recognize Two Pointers

When reading a problem, ask:

1. Am I comparing elements from opposite ends?
2. Am I modifying an array in place?
3. Am I comparing two sorted arrays or lists?
4. Am I finding a continuous range that grows and shrinks?
5. Am I traversing a linked list to find its middle or detect a cycle?

If one of these situations matches, investigate the corresponding pattern.

## 3. The Five Main Patterns

### Pattern 1: Opposite-Direction Pointers

**Structure:** One pointer starts at the beginning; the other starts at the end.

```python
left = 0
right = len(nums) - 1

while left < right:
    # Process nums[left] and nums[right]
    # Move a pointer according to the problem's rule
```

**When to use:**
- Finding a pair in a sorted array.
- Checking whether a string is a palindrome.
- Reversing an array or character sequence.
- Maximizing an area between two boundaries.
- Calculating trapped rainwater.

**Recognition clues:**
- Sorted array and pair sum.
- Compare first and last elements.
- Find a maximum or minimum using two boundaries.

**Problems:**
- Two Sum II — LeetCode 167
- Valid Palindrome — LeetCode 125
- Container With Most Water — LeetCode 11
- Trapping Rain Water — LeetCode 42
- Squares of a Sorted Array — LeetCode 977

**Important:** You must have a valid rule for deciding which pointer to move.

### Pattern 2: Same-Direction / Read-Write Pointers

**Structure:** Both pointers move forward, but they perform different jobs.

```python
write = 0

for read in range(len(nums)):
    if condition(nums[read]):
        nums[write] = nums[read]
        write += 1
```

**When to use:**
- Removing duplicates from a sorted array.
- Moving zeroes to the end.
- Removing unwanted elements in place.
- Keeping valid elements while filtering an array.

**Recognition clues:**
- Modify the original array.
- Keep only elements satisfying a condition.
- Avoid creating another array.
- Preserve the relative order of elements.

**Problems:**
- Remove Duplicates from Sorted Array — LeetCode 26
- Remove Element — LeetCode 27
- Move Zeroes — LeetCode 283

### Pattern 3: Two Pointers on Two Sequences

**Structure:** Each pointer tracks a position in a different array or list.

```python
i = 0
j = 0

while i < len(a) and j < len(b):
    if a[i] == b[j]:
        # Process matching elements
        i += 1
        j += 1
    elif a[i] < b[j]:
        i += 1
    else:
        j += 1
```

**When to use:**
- Merging two sorted arrays.
- Finding common elements between sorted arrays.
- Comparing source and destination database IDs.
- Identifying missing records in sorted datasets.
- Merging chronological event streams.

**Recognition clues:**
- Two sorted arrays or lists.
- Find common, missing, or matching elements.
- Merge data while preserving order.

**Problems:**
- Merge Sorted Array — LeetCode 88
- Intersection of Two Arrays — LeetCode 349
- Intersection of Two Arrays II — LeetCode 350

### Pattern 4: Sliding Window

**Structure:** Two pointers define the beginning and end of a continuous range.

```python
left = 0

for right in range(len(nums)):
    # Add nums[right] to the current window

    while window_is_invalid:
        # Remove nums[left] from the window
        left += 1
```

**When to use:**
- Finding the longest valid substring.
- Finding the shortest subarray satisfying a condition.
- Processing continuous ranges.
- Tracking a range with constraints.

**Recognition clues:**
- Words such as "longest," "shortest," or "minimum window."
- A contiguous subarray or substring.
- Expand a range and shrink it when necessary.

**Problems:**
- Longest Substring Without Repeating Characters — LeetCode 3
- Minimum Size Subarray Sum — LeetCode 209
- Subarray Product Less Than K — LeetCode 713

**Caution:** Sliding-window logic depends on the condition. For example, negative numbers can invalidate common sum-based shrinking rules.

### Pattern 5: Fast and Slow Pointers

**Structure:** Both pointers move through the same linked list at different speeds.

```python
slow = head
fast = head

while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
```

**When to use:**
- Finding the middle of a linked list.
- Detecting a cycle.
- Finding the starting node of a cycle.

**Recognition clues:**
- Linked list.
- Detect a loop without storing every visited node.
- Find the middle in one traversal.

**Problems:**
- Linked List Cycle — LeetCode 141
- Linked List Cycle II — LeetCode 142
- Middle of the Linked List — LeetCode 876

## 4. Decision Checklist

| Problem clue | Pattern to investigate |
|---|---|
| Sorted array + pair sum | Opposite direction |
| Compare both ends | Opposite direction |
| Remove or filter elements in place | Read-write |
| Two sorted arrays | Two sequences |
| Merge ordered data | Two sequences |
| Longest or shortest continuous range | Sliding window |
| Linked-list cycle or middle | Fast and slow |
| Triplets or quadruplets | Fix one or more elements, then use two pointers |
| Compare time intervals | Interval logic; sometimes two pointers |

## 5. How to Solve a Two-Pointer Problem

Follow these steps for every problem.

1. **Understand the input:** Is it an array, string, linked list, or two sequences?
2. **Identify the objective:** Are you searching, comparing, filtering, merging, or finding a range?
3. **Choose the pointer pattern:** Opposite direction, read-write, two sequences, sliding window, or fast-slow.
4. **Define the invariant:** What must remain true as the pointers move?
5. **Justify pointer movement:** Why is it safe to move the left pointer, right pointer, or both?
6. **Test edge cases:** Empty input, one element, duplicates, no match, and boundary conditions.
7. **Analyze complexity:** Explain the time and auxiliary space complexity.

## 6. Common Mistakes

- Using two pointers without a justified movement rule.
- Assuming every pair-sum problem can use two pointers when the array is unsorted.
- Confusing read-write pointers with opposite-direction pointers.
- Forgetting duplicate handling in 3Sum or 4Sum.
- Using sliding-window sum logic without checking whether negative numbers break the condition.
- Moving both pointers when only one should move.
- Ignoring empty input and boundary conditions.

## 7. Final Revision Rule

Before writing code, complete this sentence:

"I will use ______ pointers because the problem requires ______, and moving ______ is safe because ______."

Example:

"I will use opposite-direction pointers because the array is sorted and I need a target sum. If the current sum is too small, moving the left pointer forward is safe because it is the only way to increase the sum while keeping the right pointer fixed."

**Remember:** Recognizing the pattern is only the first step. The most important skill is proving why the pointer movement does not discard a valid answer.
