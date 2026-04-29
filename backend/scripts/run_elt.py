from google.cloud import bigquery

client = bigquery.Client()

# Dataset for analytics output
DATASET_ID = "finance_data_analytics"

def create_dataset():
    dataset = bigquery.Dataset(f"{client.project}.{DATASET_ID}")
    dataset.location = "US"
    try:
        client.create_dataset(dataset, exists_ok=True)
        print(f"Dataset {DATASET_ID} ensured.")
    except Exception as e:
        print(f"Error creating dataset: {e}")

def run_elt():
    # We create a new table `enriched_transactions` holding all the data 
    # joined together from kafka_logs, payors, and payees.
    # Note: Using BigQuery-native SQL to do the transformations.
    
    query = f"""
    CREATE OR REPLACE TABLE `{client.project}.{DATASET_ID}.enriched_transactions` AS
    WITH raw_logs AS (
        SELECT 
            transaction_id,
            amount,
            currency,
            payee_id,
            payment_method,
            payor_id,
            status,
            CAST(event_ts AS TIMESTAMP) as event_ts,
            ingestion_ts
        FROM `fin_clearing.kafka_logs`
        WHERE transaction_id IS NOT NULL 
          AND amount IS NOT NULL
    ),
    payors AS (
        SELECT 
            payor_id,
            payor_name,
            cntry AS payor_country,
            account_age_days AS payor_account_age_days,
            risk_score_initial AS payor_risk_score
        FROM `reference_data.payors`
    ),
    payees AS (
        SELECT 
            payee_id,
            payee_name,
            payee_country,
            payee_category
        FROM `reference_data.payees`
    )
    SELECT 
        l.transaction_id,
        l.amount,
        l.currency,
        l.payment_method,
        l.status,
        l.event_ts,
        l.ingestion_ts,
        
        -- Payor details
        l.payor_id,
        p_or.payor_name,
        p_or.payor_country,
        p_or.payor_account_age_days,
        p_or.payor_risk_score,
        
        -- Payee details
        l.payee_id,
        p_ee.payee_name,
        p_ee.payee_country,
        p_ee.payee_category
        
    FROM raw_logs l
    LEFT JOIN payors p_or ON l.payor_id = p_or.payor_id
    LEFT JOIN payees p_ee ON l.payee_id = p_ee.payee_id;
    """

    print("Running ELT query to create enriched_transactions...")
    job = client.query(query)
    job.result()  # Wait for the job to complete
    print(f"Table {DATASET_ID}.enriched_transactions successfully created.")

if __name__ == "__main__":
    create_dataset()
    run_elt()
