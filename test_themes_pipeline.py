import requests
import json

BASE_URL = "http://127.0.0.1:8000"

print("Fetching themes...")
themes = requests.get(f"{BASE_URL}/api/themes").json()

test_themes = [t for t in themes if t['id'] != 'dak_default'][:3]

prompts = [
    "A retail dashboard showing daily sales, a map of transactions across the USA, and a table of top customers.",
    "HR analytics page with employee distribution by department and retention metrics."
]

for theme in test_themes:
    print(f"\n--- Testing App Generation for Theme: {theme['name']} ---")
    for prompt in prompts:
        req_data = {
            "theme_id": theme['id'],
            "prompt": prompt,
            "use_skills": True
        }
        
        # We need to stream the response because /api/apps/generate is an ndjson stream
        s = requests.Session()
        print(f"Generating App for prompt: '{prompt[:40]}...'")
        with s.post(f"{BASE_URL}/api/apps/generate", json=req_data, stream=True) as resp:
            for line in resp.iter_lines():
                if line:
                    data = json.loads(line)
                    if data.get("type") in ["status", "error"]:
                        print(f"[{data.get('type').upper()}] {data.get('message')}")
        
    print(f"Finished testing {theme['name']}")
    
print("\\nAll E2E Pipeline Tests Completed.")
