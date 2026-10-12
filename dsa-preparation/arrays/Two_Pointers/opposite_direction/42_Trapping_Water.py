"""

42. Trapping Rain Water


Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. 
In this case, 6 units of rain water (blue section) are being trapped.


Solution :
need to process the value of min height because max value wall will overflow the water

should keep only the min value from the both

subtract the value if left max is less than current value: = >

otherwise  store current value in left max : because the value is greater than max value value we set.


"""

def trapping_Rain_water(heights):

    left=0
    right=len(heights)-1
    left_max=0
    right_max=0
    water=0
    nums=[0,1,0,2,1,0,1,3,2,1,2,1]
    
    while left<right :
        if heights[left]<=heights[right]:
            if heights[left]>=left_max:
                left_max=heights[left]
            else:
                water+=(left_max-heights[left])
                # print(left_max-heights[left])
            left+=1
        else:
            if heights[right]>=right_max:
                right_max=heights[right]
            else:
                water+=(right_max-heights[right])
                # print(right_max-heights[right])
            right-=1
        # print(water)
    # print(left_max,right_max)
    return water
# nums=[4,2,0,3,2,5]
nums=[0,1,0,2,1,0,1,3,2,1,2,1]

Results=trapping_Rain_water(nums)
print(Results)