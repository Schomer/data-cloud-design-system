import os
from google.cloud import geminidataanalytics_v1beta as gemini
PROJECT_ID = "malloy-data"
client = gemini.DataChatServiceClient()
context = {
    "system_instruction": "You are a data analyst assistant.",
    "datasource_references": {
        "bq": {
            "table_references": [{
                "project_id": PROJECT_ID,
                "dataset_id": "ecomm",
                "table_id": "order_items"
            }]
        }
    },
    "options": {"chart": {}}
}
req = gemini.ChatRequest(
    parent=f"projects/{PROJECT_ID}/locations/us",
    messages=[gemini.Message(user_message=gemini.UserMessage(text="how many total orders are there?"))],
    inline_context=context
)
res = client.chat(request=req)
for chunk in res:
    if chunk.system_message and chunk.system_message.text:
       print("".join(chunk.system_message.text.parts))
