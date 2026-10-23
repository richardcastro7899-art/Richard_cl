import sys
from PIL import Image, ImageDraw
# uso: python3 tools/sheet.py salida.jpg cols archivo1 archivo2 …
out, cols, files = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
tw = 960 if cols <= 2 else 640
ims = [Image.open(f).convert('RGB') for f in files]
th = int(tw * ims[0].height / ims[0].width)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * tw, rows * th), (0, 0, 0))
for i, im in enumerate(ims):
    im = im.resize((tw, th))
    d = ImageDraw.Draw(im); d.rectangle((0, 0, 150, 26), fill=(212, 104, 28)); d.text((6, 6), files[i].split('/')[-1], fill=(255, 255, 255))
    sheet.paste(im, ((i % cols) * tw, (i // cols) * th))
sheet.save(out, quality=88)
