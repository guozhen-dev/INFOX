import os

fileset = []
for a, _, c in os.walk("../static"):
    for file in c:
        fileset.append(os.path.join(a, file))

filestr = ""
for file in fileset:
    if fileset.index(file) != len(fileset) - 1:
        file = file.replace("../", "")
        filestr += f'"{file}",\n'
    else:
        file = file.replace("../", "")
        filestr += f'"{file}"\n'

mapping = {"files": filestr}

# find js files
filestr = ""
for file in fileset:
    if not file.endswith(".js"):
        continue  # skip non-js files
    if fileset.index(file) != len(fileset) - 1:
        file = file.replace("../", "")
        filestr += f'"{file}",\n'
    else:
        file = file.replace("../", "")
        filestr += f'"{file}"\n'

if filestr.endswith(",\n"):
    filestr = filestr[:-2] + "\n"

mapping['jsfiles'] = filestr
with open("manifest.json.template", "r") as f:
    template = f.read()
    template = template.replace("{{files}}", mapping["files"])
    template = template.replace("{{jsfiles}}", mapping["jsfiles"])
    with open("manifest.json", "w") as f:
        f.write(template)
