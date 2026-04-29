from google.cloud import bigquery

client = bigquery.Client()
DATASET_ID = "finance_data_analytics"

def train_model():
    # Train directly on `fin_clearing.anomalous_transactions` using features that can be
    # mapped to the new transactions coming from kafka_logs.
    # We will map `merchant_category` to `payee_category`,
    # `account_age_days` to `payor_account_age_days`, and `amount`.
    
    query = f"""
    CREATE OR REPLACE MODEL `{client.project}.{DATASET_ID}.anomaly_model`
    OPTIONS(
        model_type='BOOSTED_TREE_CLASSIFIER',
        input_label_cols=['is_anomaly'],
        DATA_SPLIT_METHOD='AUTO_SPLIT'
    ) AS
    SELECT
        amount,
        account_age_days as payor_account_age_days,
        merchant_category as payee_category,
        is_anomaly
    FROM `fin_clearing.anomalous_transactions`
    WHERE is_anomaly IS NOT NULL
    """

    print("Submitting training job to BigQuery ML...")
    job = client.query(query)
    job.result()  # Wait for training to complete
    print(f"Model {DATASET_ID}.anomaly_model successfully trained.")

def evaluate_model():
    query = f"""
    SELECT
      *
    FROM
      ML.EVALUATE(MODEL `{client.project}.{DATASET_ID}.anomaly_model`)
    """
    print("Evaluating model...")
    job = client.query(query)
    for row in job:
        print(f"AUC: {row.get('roc_auc')}, Precision: {row.get('precision')}, Recall: {row.get('recall')}")

if __name__ == "__main__":
    train_model()
    evaluate_model()
