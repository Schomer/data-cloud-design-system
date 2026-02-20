import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google.cloud import bigquery
from google.cloud import geminidataanalytics_v1beta as gemini

PROJECT_ID = os.environ.get("GOOGLE_CLOUD_PROJECT", "datagravity-demo")
DATASET_ID = "fin_clearing_fraud_analytics"
TABLE_ID = "flagged_transactions"
LOCATION = "us"

bq_client = bigquery.Client(project=PROJECT_ID)
gemini_client = gemini.DataChatServiceClient()

app = FastAPI(title="Fraud Investigation Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StatusUpdate(BaseModel):
    status: str

class ChatRequestModel(BaseModel):
    message: str
    transaction_id: str
    history: list[dict] = []

@app.get("/api/transactions")
def get_transactions():
    query = f"""
    SELECT
      transaction_id,
      amount,
      currency,
      payment_method,
      status,
      event_ts,
      ingestion_ts,
      payor_name,
      payor_country,
      payor_risk_score,
      payee_name,
      payee_category,
      predicted_is_fraud,
      investigation_status
    FROM `{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}`
    ORDER BY event_ts DESC
    LIMIT 100
    """
    try:
        query_job = bq_client.query(query)
        results = [dict(row) for row in query_job]
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/api/transactions/{transaction_id}")
def update_status(transaction_id: str, update: StatusUpdate):
    query = f"""
    UPDATE `{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}`
    SET investigation_status = @status
    WHERE transaction_id = @tx_id
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter("status", "STRING", update.status),
            bigquery.ScalarQueryParameter("tx_id", "STRING", transaction_id),
        ]
    )
    try:
        query_job = bq_client.query(query, job_config=job_config)
        query_job.result()
        return {"message": "Status updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
def chat(request: ChatRequestModel):
    inline_context = {
        "system_instruction": "You are a fraud analyst assistant. You help the user investigate transactions. Keep your answers concise and text-only. Do not generate charts. Do not suggest actions unless asked.",
        "datasource_references": {
            "bq": {
                "table_references": [{
                    "project_id": PROJECT_ID,
                    "dataset_id": DATASET_ID,
                    "table_id": TABLE_ID
                }]
            }
        },
        "options": {"chart": {}}
    }
    
    prompt = f"[Context: Investigating transaction {request.transaction_id}]\nUser: {request.message}"

    client_history = []
    for msg in request.history:
        if msg.get("role") == "user":
            client_history.append(gemini.Message(user_message=gemini.UserMessage(text=msg.get("content"))))
        elif msg.get("role") == "model":
            # Gemini models use system_message for AI responses in this specific V1 API schema format
            client_history.append(gemini.Message(system_message=gemini.SystemMessage(text=gemini.TextMessage(parts=[msg.get("content")]))))

    chat_request = gemini.ChatRequest(
        parent=f"projects/{PROJECT_ID}/locations/{LOCATION}",
        messages=client_history + [
            gemini.Message(user_message=gemini.UserMessage(text=prompt))
        ],
        inline_context=inline_context
    )

    try:
        response_stream = gemini_client.chat(request=chat_request)
        full_response = ""
        for chunk in response_stream:
            if chunk.system_message and chunk.system_message.text:
                full_response += "".join(chunk.system_message.text.parts)
        return {"response": full_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
