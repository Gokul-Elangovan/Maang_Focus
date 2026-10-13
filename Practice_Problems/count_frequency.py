string="banana"
# {'b': 1, 'a': 3, 'n': 2}

freq={}
for ch in string:
    if ch in freq:
        freq[ch]=freq[ch]+1
    else:
        freq[ch]=1

print(freq)