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

    Why we are using While : 
        [2,3,1,2,4,3,7]

        2=> 2+3 => 2+3+1 => 2+3+1+2  exceed target 

        remove left move the left pointer +1 = > 3+1+2 
        3+1+2+4=> remove left move the left pointer +1 => 1+2+4  min_len=3
        1+2+4 => remove left move the left pointer +1 =>2+4      
        2+4+3 => remove left move the left pointer +1 => 4+3     min_len=2
        4+3 => remove left move the left pointer +1 => 4+3+7     min_len=2
        3+7 => remove left move the left pointer +1 => 7         min_len=1

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
                #   print(window_sum)
                  window_sum-=nums[left]
                  left+=1
                  print("executed")
        if min_length==999:
              return 0
        return min_length
            
        
nums=[2,3,1,2,4,3,7]
# nums=[1,1,1,1,1,1,1,1]
print(float("inf"))
res=minSubArrayLen(7,nums)
print(res)