"""
977. Squares of a Sorted Array
Given an integer array nums sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.

Pattern : Two Pointer : Opposite Direction

Find the abs value and store the largest square on the right side
create new array to store the values sorted

"""

slow=0
nums=[-7,-3,2,3,11]
result=[0]*len(nums)
# print(result)
def sorted_array(nums):
    left=0
    right=len(nums)-1
    pos=right

    while not left>right:
        if abs(nums[left])<abs(nums[right]):
            result[pos]=nums[right]*nums[right]
            right-=1
            pos-=1
           
        elif abs(nums[left])>=abs(nums[right]):
            result[pos]=nums[left]* nums[left]
            left+=1
            pos-=1
            

        # elif abs(nums[left])==abs(nums[right]):
        #     result
sorted_array(nums)
print(result)