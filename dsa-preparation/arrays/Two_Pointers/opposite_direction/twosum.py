# Two Sum  = > finding the the sum of two nums is equal to target sum
# Example : [2, 7, 11, 15], target = 9 => [0, 1]


print("Two Sum Problem")

nums=[2, 7, 11, 15]


# print(left,right)

def TwoSum(nums):
    left=0
    right=len(nums)-1
    target=21
    while left < right :
        sum=nums[left]+nums[right]
        if sum==target:
            return left,right
        elif sum>target:
            right-=1
        elif sum<target:
            left+=1
    return "No Found"
print(TwoSum(nums))
