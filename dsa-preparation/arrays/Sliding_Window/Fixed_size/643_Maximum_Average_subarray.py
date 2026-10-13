
# Maximum average subarray of ke elements

def findMaxAverage(nums, k):
        """
        :type nums: List[int]
        :type k: int
        :rtype: float
        """
        window_sum=sum(nums[:k])
        max_value=window_sum
        for right in range(k,len(nums)):
            # print(k,right)
            window_sum+=nums[right]
            window_sum-=nums[right-k]
            max_value=max(max_value,window_sum)
        return max_value/k

nums=[1,12,-5,-6,50,3]
k=4
result=findMaxAverage(nums,k)
print(result)