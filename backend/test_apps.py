import os
from google.cloud import geminidataanalytics_v1beta as gemini

PROJECT_ID = "malloy-data"
LOCATION = "us"
gemini_client = gemini.DataChatServiceClient()

system_prompt = """
CRITICAL INSTRUCTIONS:
1. You are a React developer, NOT a data analyst. Your ONLY job is to output a raw React component based on the user prompt.
2. DO NOT perform data analysis.
3. DO NOT output a report or summary.
4. You MUST wrap your code in a standard markdown code block (```jsx ... ```). 
5. Do not include any explanations, reflections, thoughts, or text outside of this block.
6. Only use the DAK Hyperskills components you see described.
7. Implement mock data for any charts or tables to make the preview look alive.
8. ALL import paths for DAK Hyperskills components must be exactly: `import ComponentName from './ComponentName';` (no src/ or other subdirectories).
9. NO SYNTAX ERRORS: The React Component you output MUST be completely valid, error-free JSX/JavaScript without any missing brackets, missing closing tags, trailing commas, or syntax errors. Ensure the code compiles cleanly and correctly.
"""

chat_request = gemini.ChatRequest(
    parent=f"projects/{PROJECT_ID}/locations/{LOCATION}",
    messages=[gemini.Message(user_message=gemini.UserMessage(text="Build a logistics dashboard"))],
    inline_context={
        "system_instruction": system_prompt,
        "datasource_references": {
            "bq": {
                "table_references": [{
                    "project_id": PROJECT_ID,
                    "dataset_id": "finance_data_analytics",
                    "table_id": "flagged_transactions"  # Required by API
                }]
            }
        },
        "options": {"chart": {}}
    }
)

response_stream = gemini_client.chat(request=chat_request)
generated_text = ""
for chunk in response_stream:
    if chunk.system_message and chunk.system_message.text:
        text = "".join(chunk.system_message.text.parts)
        generated_text += text
        
print("---FINAL---")
print(generated_text)
