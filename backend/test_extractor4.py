import re

def extract_jsx(text):
    text = re.sub(r"```json\s*\n.*?\n```", "", text, flags=re.DOTALL | re.IGNORECASE)
    
    matches = re.findall(r"```(?:[a-z]+)?\s*\n(.*?)```(?:$|\n)", text, flags=re.DOTALL | re.IGNORECASE)
    
    val = ""
    if matches:
        val = matches[-1].strip()
        for m in reversed(matches):
            if "import React" in m or "export default" in m:
                val = m.strip()
                break
    else:
        fallback = re.search(r"```(?:[a-z]+)?\s*\n(.*)", text, flags=re.DOTALL | re.IGNORECASE)
        if fallback:
            val = fallback.group(1).strip()
        else:
            val = text.strip()
            
    # Recursive clean newly extracted chunk
    while True:
        match = re.match(r"^\s*```(?:[a-z]+)?\s*\n", val, flags=re.IGNORECASE)
        if match:
            val = val[match.end():].strip()
        else:
            break
            
    while True:
        match = re.search(r"\n\s*```\s*$", val)
        if match:
            val = val[:match.start()].strip()
        else:
            break
            
    # Handle the weird single-line cut-off trailing backticks
    val = re.sub(r"```\s*$", "", val).strip()
    return val

cases = [
    "Analyzing stuff...\n```jsx\nimport React\n```",
    "```javascript\n```jsx\nimport React\n```\nHere is info",
    "```\n```\n```jsx\nimport React",
    "No backticks at all",
    "```json\n{}\n```\n```jsx\nimport React\n```",
    "```jsx\nimport React\n// no closing backtick"
]

for i, c in enumerate(cases):
    print(f"Case {i}:", repr(extract_jsx(c)))
