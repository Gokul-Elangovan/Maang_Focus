# Threesum Value

"""
1. Find the number which give 0 when sum

Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]


"""

def threesum():
    nums = [-1,0,1,2,-1,-4]
    # sorted array [-4, -1, -1, 0, 1, 2]
    triplets=[]

    nums.sort()
    for standard in range(0,len(nums)-2):
        if standard>0 and nums[standard]==nums[standard-1]:
            continue
        left=standard+1
        right=len(nums)-1

        while left<right:
            sum_value=nums[standard]+nums[left]+nums[right]

            if sum_value<0:
                left+=1
            elif sum_value>0:
                right-=1
            elif sum_value==0:
                triplets.append([nums[standard],nums[left],nums[right]])
                right-=1
                left+=1
                while left<right and nums[left]==nums[left-1]:
                    left+=1
                    
                while left<right and nums[right]==nums[right+1]:
                    right-=1
                    
    return triplets

# print(threesum())
print(threesum())