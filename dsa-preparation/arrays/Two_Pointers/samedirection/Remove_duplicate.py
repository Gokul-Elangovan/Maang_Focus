# Remove Duplicate 
#  [1,1,2,2,3,4,4,5,6,7]  =>  return [1,2,3,4,5,6,7]

""" Notes:
        The fast variable Scans the array 
        The slow variable stores the previous valid element
        
"""
def remove_duplicates(nums):
    slow=0
    fast=1
    for fast in range(1,len(nums)):
        if nums[slow]!=nums[fast]:
            slow+=1
            nums[slow]=nums[fast]
            
    # print(nums)
    del nums[slow+1:]
    return nums
# nums=[1,1,2,2,3,4,4,5,6,7]
nums=[1,2,3,3,4,4]
print(remove_duplicates(nums))