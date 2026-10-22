# 904. Fruit Into Baskets

"""
### Subtopic: Variable-Size Sliding Window — At Most K Distinct Elements

**What I learned:**

- Maintain a window containing at most `K` distinct elements. Here, `K = 2` because I can carry only two types of fruit.
- Use a **frequency dictionary** to track how many times each distinct element appears in the current window.
- Expand the window using `right`. If the number of distinct elements exceeds `K`, shrink it using `left`.
- When shrinking, decrease the outgoing element's frequency and remove its key only when its frequency reaches zero.
- Once the window becomes valid, calculate its length and update the maximum.

**Pattern to remember:** Longest contiguous subarray with at most `K` distinct elements.

**Core logic:** Expand → Count distinct elements → Shrink while invalid → Update maximum length.

**Reusable template:** This pattern can solve problems involving the longest contiguous window with at most `K` distinct values.

"""

def totalFruit(fruits: list[int]) -> int:
    fruite_count={}
    left=0
    max_length=0

    for right in range(len(fruits)):
        fruit=fruits[right]
        fruite_count[fruit]=fruite_count.get(fruit,0)+1
        while len(fruite_count)>2:
            left_fruit=fruits[left]
            fruite_count[left_fruit]-=1
            if fruite_count[left_fruit]==0:
                del fruite_count[left_fruit]
            left+=1
        current_length=right-left+1
        # print(current_length)
        
        max_length=max(current_length,max_length)
    return max_length
fruits = [1,2,3,2,2]
fruits=[1,2,1,1,1,1,1,3,3,3,3,3]
fruits=[0,1,2,2]
res=totalFruit(fruits)
print(res)