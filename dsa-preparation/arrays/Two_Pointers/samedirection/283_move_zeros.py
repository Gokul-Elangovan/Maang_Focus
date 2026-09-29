"""
Leetcode 283 - Move Zeroes

Pattern : Two Pointers : Same Direction
"""

nums = [0,1,2,0,0,0,3,4,5,0]
print(nums)
def move_zeros(nums):
    slow=0
    for fast in range(0,len(nums)):
        if nums[fast]!=0:
            nums[slow]=nums[fast]
            slow+=1
    nums[slow:]=[0] * (len(nums)-slow)
    print(nums)
    return nums[:slow]

print(move_zeros(nums))
