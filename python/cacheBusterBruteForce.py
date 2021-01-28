import re
import glob
from datetime import datetime as dt

for name in glob.glob("./*.html"):
	with open(name,"r",encoding="utf-8") as file:
		filedata=file.read()

	filedata=re.sub(r"version=\d+","version=" + dt.now().strftime('%y%m%d%H%M%S'),filedata)

	with open(name,"w",encoding="utf-8") as file:
		file.write(filedata)