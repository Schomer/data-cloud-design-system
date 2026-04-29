import re

def extract_jsx(text):
    text = re.sub(r"```json\s*\n.*?\n```", "", text, flags=re.DOTALL | re.IGNORECASE)
    
    # Match an opening markdown fence, followed by content containing newlines, up to a closing fence
    matches = re.findall(r"```(?:[a-z]+)?\s*\n(.*?)```(?:$|\n)", text, flags=re.DOTALL | re.IGNORECASE)
    
    if matches:
        for m in reversed(matches):
            if "import React" in m or "export default" in m:
                return m.strip()
        return matches[-1].strip()
        
    fallback = re.search(r"```(?:[a-z]+)?\s*\n(.*)", text, flags=re.DOTALL | re.IGNORECASE)
    if fallback:
        val = fallback.group(1)
        # remove anything resembling a trailing closing fence without a newline
        val = re.sub(r"```\s*$", "", val)
        return val.strip()
        
    return text.strip()

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
