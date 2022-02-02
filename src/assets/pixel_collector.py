# Third party modules
import numpy
from PIL import Image
import json
import os

f = open("./asset_pixels/head5_heads_pixels_2.json", "a", encoding='utf8')
f.write('[')

for p in os.listdir('./head5/'):
    im = Image.open(
        './head5/'+p)
    rgb_im = im.convert('RGBA')

    arr = []

    for j in range(24):
        for i in range(24):
            arr.append(rgb_im.getpixel((i, j)))

    output = "{\"trait_name\": " + "\""+p.replace('.png', '')+"\", \"data\": " + \
        str(arr).replace('(', '[').replace(')', ']')+"},"
    # print(output)

    #f.write(','.join(str(e) for e in output))
    f.write(output)

f.write(']')
