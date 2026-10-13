# redo traping water problem 

# Input: height = [4,2,0,3,2,5]
# Output: 9

def trapping_rain_water(heights):
    left_max=0
    right_max=0
    left=0
    right=len(heights)-1
    water=0

    while left<right:
        if heights[left]<=heights[right]:
            if heights[left]>=left_max:
                left_max=heights[left]
            else:
                water+=(left_max-heights[left])
            left+=1
        else:
            if heights[right]>=right_max:
                right_max=heights[right]
            else:
                water+=(right_max-heights[right])
            right-=1
        
    return water

res=trapping_rain_water(heights = [4,2,0,3,2,5])

print(res)