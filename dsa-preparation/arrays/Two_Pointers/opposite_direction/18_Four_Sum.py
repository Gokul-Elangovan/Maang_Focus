# Four Sum 
"""
Example 1:

Input: nums = [1,0,-1,0,-2,2], target = 0
sorted value =>  [-2,-1,1,0,0,2]
Output: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]

"""

def four_sum(nums,target):
    nums.sort()
    # print(nums)

    n=len(nums)
    new_value=[]
    for s1 in range(n-3):
        if s1>0 and nums[s1]==nums[s1-1]:
             continue
        for s2 in range(s1+1,n-2):
            if s2>s1+1 and nums[s2]==nums[s2-1]:
                 continue
            left=s2+1
            right=n-1
            # [-2,-1,-1,1,1,2,2]
            # print(nums[s1],nums[s2],nums[left],nums[right])
            while left<right:
                sum=nums[s1]+nums[s2]+nums[left]+nums[right]
                
                if sum==target:
                    new_value.append([nums[s1],nums[s2],nums[left],nums[right]])
                    left+=1
                    right-=1
                    while left<right and nums[left]==nums[left-1]:
                            left+=1
                    while left<right and nums[right]==nums[right+1]:
                            right-=1
                elif sum>target:
                    right-=1
                elif sum<target:
                    left+=1
    return new_value
                    

# print(four_sum([1,0,-1,0,-2,2],0))
nums=[2,2,2,2]
target=4
nums=[1,2,3,-2,1-2,-3,1,1,0]
target=3

nums=[1,0,-1,0,-2,2]
target=8
nums=[2,2,2,2,2]
nums=[-2,-1,-1,1,1,2,2]
# print(four_sum(nums,target))

print(four_sum([1, 0, -1, 0, -2, 2], 0))
print(four_sum([2, 2, 2, 2, 2], 8))
print(four_sum([0, 0, 0, 0], 0))
print(four_sum([-2,-1,-1,1,1,2,2],0))

# [[-3, 1, 2, 3], [-3, 1, 2, 3], [-3, 1, 2, 3], [-2, 0, 2, 3], [-2, 1, 1, 3], [-2, 1, 1, 3], [-1, 0, 1, 3], [-1, 1, 1, 2],[-1, 1, 1, 2], [0, 1, 1, 1]]