import re

with open('frontend/src/components/EditorSidebar.jsx', 'r') as f:
    content = f.read()

# 1. Add isDarkMode prop
content = content.replace(
    "export default function EditorSidebar() {",
    "export default function EditorSidebar({ isDarkMode }) {"
)

# 2. We need a way to combine pairs. 
# A pair is like:
# <div>
#     <label ...>Background Color</label>
#     ...
#     <input type="color" value={currentSpec.bg} ...>
# ...
# </div>
# And:
# <div>
#     <label ...>Dark Mode Background</label>
#     ...
#     <input type="color" value={currentSpec.darkBg} ...>
# ...
# </div>

# Let's replace the manual inputs with a helper component.
# Instead of parsing, let's just create a modified version of the file manually by doing targeted string replacements for the known sections.

