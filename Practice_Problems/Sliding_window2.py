# Same kind of problem 

# Maximum Sum of a Subarray of Size K

def max_sum_subarray(nums,k):

    window_size=sum(nums[:k])
    max_value=window_size

    for right in range(k,len(nums)-1):
        window_size+=nums[right]
        window_size-=nums[right-k]
        print(right,k)
        max_value=max(max_value,window_size)
    return max_value

nums = [4, 2, 10, 3, 8, 1, 5]
k = 3
result=max_sum_subarray(nums,k)
print(result)