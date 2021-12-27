# Third party modules
import numpy
from PIL import Image
import json
import os

f = open("extract_img_data.json", "a", encoding='utf8')
f.write('[')

for p in os.listdir('../public/24px_files/'):
    im = Image.open(
        '../public/24px_files/'+p)
    rgb_im = im.convert('RGB')

    arr = []

    for j in range(24):
        for i in range(24):
            arr.append(rgb_im.getpixel((i, j)))

    output = "{\"img\": " + "\""+p.replace('.png', '')+"\", \"data\": " + \
        str(arr).replace('(', '[').replace(')', ']')+"},"
    # print(output)

    #f.write(','.join(str(e) for e in output))
    f.write(output)

f.write(']')
