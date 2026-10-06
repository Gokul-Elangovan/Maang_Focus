# Container with most water problem 
"""
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7].
In this case, the max area of water (blue section) the container can contain is 49.

1.Need to find the area which can hold maximum water
2.Find The height and width to calculate area
3.Things to remember : 
    1.height must be the minimum value from the pair
"""

heights = [1, 8, 6, 2, 5, 4, 8, 1, 9,9]

left=0
right=len(heights)-1
max_area=0
while left<right:
    area=min(heights[left],heights[right])*(right-left)
    print(area," : ",heights[left],heights[right])
    max_area=max(area,max_area)
    if heights[left]<heights[right]:
        left+=1
    elif heights[left]>heights[right]:
        right-=1
    else:
        left+=1

print(max_area)
