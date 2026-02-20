# Implementation Plan: Fraud Investigation Platform

Build an end-to-end fraud investigation system: raw event ELT in BigQuery → BQML training → batch inference → React + Vite UI.

## User Review Required

> [!IMPORTANT]
> **Cloud Resources to be Created:**
>
> | Resource | Type | Notes |
> |----------|------|-------|
> | `fraud_analytics` | BigQuery Dataset | Storing clean, joined, and scored data |
> | `fraud_model` | BQML Model | Trained binary classification model |
> | React Frontend | Cloud Run | App hosting (pay-per-request) |
> | Python Backend | Cloud Run | API serving BQ data and Gemini Analytics |
>
> **APIs:** Required APIs (`bigquery`, `run`, `aiplatform`) are assumed enabled or will be enabled.
>
> **Data Sensitivity:** Assuming PII might exist in reference tables (names). Column-level security or masking should be considered if unauthorized users access the raw dataset.
>
> **Deviation Note**: The project standards specify Streamlit, but per your explicit instruction, we are using React + Vite + Tailwind CSS. We will still use the required `google-cloud-geminidataanalytics` SDK on a Python backend.

---

## Proposed Changes

### Phase 0: Repository & Plan Commit
**Skill Reference**: Git Integration Standards

#### [NEW] `.gitignore`
- Standard Python/Node/GCP ignores

#### Commit Plan
- Copy this file to project root, `git commit -m "doc: add implementation plan"`

---

### Phase 1: React & Backend Setup
#### [NEW] `frontend/`
- Initialize React + Vite app with Tailwind CSS.
#### [NEW] `backend/`
- Initialize Python FastAPI app for Gemini Analytics and BigQuery client.
#### Verification
- Confirm `npm run dev` and `uvicorn` run locally.
#### Git Checkpoint
#### User Checkpoint
- Summarize phase results and ask user to approve before proceeding

---

### Phase 2: Data Engineering — BigQuery ELT
**Skill Reference**: `bigquery-optimization/SKILL.md`

#### [NEW] `backend/scripts/run_elt.py`
**Stage 1 — Clean & Standardize:** Clean `fin_clearing.kafka_logs` and normalize.
**Stage 2 — Enrich:** Join logs with `reference_data.payors` and `reference_data.payees`.
**Stage 3 — Sink:** Write to `fraud_analytics.enriched_transactions`.
#### Verification
- Confirm `fraud_analytics.enriched_transactions` exists.
- Report row counts and null rates.
#### Git Checkpoint
#### User Checkpoint
- Summarize phase results and ask user to approve before proceeding

---

### Phase 3: Machine Learning — BQML Model Training
#### [NEW] `backend/scripts/train_bqml.py`
- **Input:** `fin_clearing.fraud_transactions` joined with enriched data.
- **Algorithm:** XGBoost via BQML (`CREATE MODEL`).
- **Baseline:** Majority-class baseline.
- **Output:** Save model in BigQuery as `fraud_analytics.fraud_model`.
#### Verification
- Confirm model exists in BQ.
- Evaluation Report: AUC, precision, recall via `ML.EVALUATE`.
#### Git Checkpoint
#### User Checkpoint
- Summarize phase results and ask user to approve before proceeding

---

### Phase 4: Batch Inference in BigQuery
#### [NEW] `backend/scripts/batch_inference.py`
- **Input:** Unscored transactions in `fraud_analytics.enriched_transactions`.
- **Logic:** Generate fraud probability scores using `ML.PREDICT`.
- **Sink:** Write flagged transactions to `fraud_analytics.flagged_transactions`.
#### Verification
- Confirm rows in BigQuery sink.
#### Git Checkpoint
#### User Checkpoint
- Summarize phase results and ask user to approve before proceeding

---

### Phase 5: Backend API Implementation
#### [NEW] `backend/main.py`
- Endpoints to fetch transactions from `fraud_analytics.flagged_transactions`.
- Endpoints to mark transactions as cleared/fraudulent (update BQ).
- Gemini Data Analytics API integration for conversational interface.
#### Verification
- Test API endpoints locally.
#### Git Checkpoint
#### User Checkpoint
- Summarize phase results and ask user to approve before proceeding

---

### Phase 6: React User Interface
#### [MODIFY] `frontend/src/App.jsx`
- List of transactions ordered by arrival time.
- Detail view for deep investigation via Gemini chat interface.
- Action buttons: Clear or Mark Fraud.
- Update `SKILL.md` with layout/feature patterns.
#### Verification
- Verify React UI functionality with backend.
#### Git Checkpoint
#### User Checkpoint
- Summarize phase results and ask user to approve before proceeding

---

### Phase 7: Deployment
- Deploy frontend and backend to Cloud Run.
#### Verification
- Confirm Cloud Run services are serving.
#### Git Checkpoint
#### User Checkpoint
- Summarize phase results and ask user to approve before proceeding
