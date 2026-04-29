import re

def extract_jsx(text):
    # 1. Strip json blocks
    cleaned = re.sub(r"```json\s*\n.*?\n```", "", text, flags=re.DOTALL | re.IGNORECASE)
    
    # 2. Extract code blocks
    matches = re.findall(r"```(?:[a-z]+)?\s*\n(.*?)```", cleaned, flags=re.DOTALL | re.IGNORECASE)
    
    best_match = None
    if matches:
        best_match = matches[-1]
        for m in reversed(matches):
            if "import React" in m or "export default" in m:
                best_match = m
                break
    
    # If no matches found (meaning no closing ```), try just matching from ``` to the end
    if not best_match:
        fallback_match = re.search(r"```(?:[a-z]+)?\s*\n(.*)", cleaned, flags=re.DOTALL | re.IGNORECASE)
        if fallback_match:
            best_match = fallback_match.group(1)
            # Remove any trailing ``` just in case it had partial ones
            best_match = re.sub(r"```\s*$", "", best_match).strip()
    
    if best_match:
        res = best_match.strip()
        # Clean up any inner markdown double tags
        res = re.sub(r"^```(?:[a-z]+)?\s*\n", "", res, flags=re.IGNORECASE)
        return res.strip()
    
    res = cleaned.strip()
    res = re.sub(r"^```(?:[a-z]+)?\s*\n", "", res, flags=re.IGNORECASE)
    res = re.sub(r"```\s*$", "", res)
    return res.strip()

print("3. Double Tag / AI bug:")
print(repr(extract_jsx("```jsx\n```jsx\nimport React from 'react';\n```")))
