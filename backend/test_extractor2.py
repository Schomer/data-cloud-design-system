import re

def extract_jsx_robust(text):
    text = re.sub(r"```json\s*\n.*?\n```", "", text, flags=re.DOTALL | re.IGNORECASE)
    
    # Extract ALL code blocks
    matches = re.findall(r"```(?:[a-z]+)?\s*\n(.*?)```", text, flags=re.DOTALL | re.IGNORECASE)
    
    if matches:
        # Prioritize blocks containing 'import React' or 'export default'
        for m in reversed(matches):
            if "import React" in m or "export default" in m:
                return m.strip()
        # Fallback to the last code block (usually the component)
        return matches[-1].strip()
        
    # If no closing backticks are found (cut-off output), fall back to finding the start
    fallback_match = re.search(r"```(?:[a-z]+)?\s*\n(.*)", text, flags=re.DOTALL | re.IGNORECASE)
    if fallback_match:
        extracted = fallback_match.group(1).strip()
        # Remove any trailing incomplete backticks
        return re.sub(r"```\s*$", "", extracted).strip()
        
    # Worst case, return the raw text (this covers raw payload returns)
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
    print(f"Case {i}:", repr(extract_jsx_robust(c)))
