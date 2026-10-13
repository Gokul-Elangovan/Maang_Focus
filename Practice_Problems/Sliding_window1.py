def max_sum(nums, k):
    window_sum = sum(nums[:k])
    max_sum = window_sum

    for right in range(k, len(nums)):
        # print(max_sum)
        window_sum += nums[right]
        window_sum -= nums[right - k]

        max_sum = max(max_sum, window_sum)
        
    return max_sum


print(max_sum([2, 1, 5, 1, 3, 2], 3))
# 70