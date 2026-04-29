from google.cloud import bigquery

client = bigquery.Client()
DATASET_ID = "finance_data_analytics"

def batch_inference():
    # Use the model to predict anomalies on the enriched_transactions table.
    # Output to `flagged_transactions` Table.
    
    query = f"""
    CREATE OR REPLACE TABLE `{client.project}.{DATASET_ID}.flagged_transactions` AS
    SELECT
      *
    FROM
      ML.PREDICT(MODEL `{client.project}.{DATASET_ID}.anomaly_model`,
        (
          SELECT
            transaction_id,
            amount,
            currency,
            payment_method,
            status,
            event_ts,
            ingestion_ts,
            payor_id,
            payor_name,
            payor_country,
            payor_account_age_days,
            payor_risk_score,
            payee_id,
            payee_name,
            payee_country,
            payee_category
          FROM
            `{client.project}.{DATASET_ID}.enriched_transactions`
        )
      )
    # Filter only transactions that are predicted as anomalous, or keep all to let the app filter? 
    # For investigation, we list suspicious transactions. 
    # Let's keep all and order by predicted probability or just filter predicted anomalies.
    # We will keep all so the app can show everything and sort by anomaly probability.
    """

    print("Running batch inference job...")
    job = client.query(query)
    job.result()  # Wait for the job to complete
    print(f"Table {DATASET_ID}.flagged_transactions successfully created.")

def augment_table_schema():
    # We want the user to mark the transaction as cleared or anomalous in the app.
    # So we add a column `investigation_status` defaulting to 'PENDING'.
    query = f"""
    ALTER TABLE `{client.project}.{DATASET_ID}.flagged_transactions`
    ADD COLUMN IF NOT EXISTS investigation_status STRING;
    
    UPDATE `{client.project}.{DATASET_ID}.flagged_transactions`
    SET investigation_status = 'PENDING'
    WHERE investigation_status IS NULL;
    """
    print("Augmenting table with investigation status...")
    job = client.query(query)
    job.result()
    print("Table augmented.")

if __name__ == "__main__":
    batch_inference()
    augment_table_schema()
