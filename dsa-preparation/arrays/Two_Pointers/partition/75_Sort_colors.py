"""
75. Sort Colors

You are given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.

We will use the integers 0, 1, and 2 to represent the color red, white, and blue, respectively.

You must solve this problem without using the library's sort function.

 

Example 1:

Input: nums = [2,0,2,1,1,0]

Output: [0,0,1,1,2,2]

Explanation:

The array has two 0s, two 1s, and two 2s. Sorting them in-place places all 0s first, then all 1s, then all 2s.

"""
# Bruteforce Method
nums=[2,0,2,1,1,0]
nums=[1,0,2]
nums=[2,0,1]



def sort_colors(nums):

    nums=[1,2,0,0,2,1,1,2,0]

    for i in range(0,len(nums)-1):
        for j in range (i+1,len(nums)):
            if nums[i]>nums[j]:
                temp=nums[i]
                nums[i]=nums[j]
                nums[j]=temp
            
    print(nums)

# Two Pointer Method

def dutch_sort_colors (nums):
    low=0
    mid=0
    high=len(nums)-1
    
    while mid<=high:
        # nums=[2,0,0,1,2,1,1,0,0]
        if nums[mid]==2:
            
            nums[high],nums[mid]=nums[mid],nums[high]
            
            high-=1
        elif nums[mid]==0:
            nums[low],nums[mid]=nums[mid],nums[low]
            mid+=1
            low+=1
        elif nums[mid]==1:
            mid+=1
        print(nums,"Low : ",low,"Mid : ",mid, "High : ",high)
    return nums
# print("original array",nums)
nums=[2,0,0,1,2,1,1,0,0]

# nums=[2,0,1]
print(dutch_sort_colors(nums))

