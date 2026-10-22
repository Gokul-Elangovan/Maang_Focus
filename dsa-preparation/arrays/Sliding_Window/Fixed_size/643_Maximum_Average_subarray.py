
# Maximum average subarray of ke elements

"""
Question :  
Need to develop a code for finding maximum and its average.

Solution Notes : 
    1.Find the sum of the value based on k value.
    2.Start the loop from the k value as right.
    2. to find next window elements sum
        a. add next element of the array and
        b. remove first element => this will give next window of sum.
    3.return the max_sum/k value as float

Error occured : 
    1.I tried with python 2 its not capable of returning float if i do this. 
        max_sum/k: it returns only int value.
        then i changed to python 3.

"""
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