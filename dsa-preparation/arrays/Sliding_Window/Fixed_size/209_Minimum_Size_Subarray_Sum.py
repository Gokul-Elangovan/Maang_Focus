# problem : 209. Minimum Size Subarray Sum

"""
Given an array of positive integers nums and a positive integer target,
return the minimal length of a subarray whose sum is greater than or equal to target.
If there is no such subarray, return 0 instead.

Input: target = 7, nums = [2,3,1,2,4,3]
Output: 2
Explanation: The subarray [4,3] has the minimal length under the problem constraint.
"""

"""
Solution : 
    1.fix windowsum,right ,left,min_length values
    2.Loop through elements array 
    3.add new element each iteration
    4.while the sum >= target
        i.store the current _length and check the min of it using min_length value
        ii.Remove left value from window_sum and increase left by 1
    5.return min value based on the conditions

"""


def minSubArrayLen( target: int, nums: list[int]) -> int:
        
        left=0
        window_sum=0
        min_length=999
        window_sum=0

        for right in range(0,len(nums)):

            window_sum+=nums[right]      #Adding new element

            while window_sum>=target:
                  current_length=right-left+1

                  min_length=min(current_length,min_length)

                  window_sum-=nums[left]
                  left+=1
        if min_length==999:
              return 0
        return min_length
            
        
nums=[2,3,1,2,4,3,7]
nums=[1,1,1,1,1,1,1,1]
print(float("inf"))
res=minSubArrayLen(11,nums)
print(res)