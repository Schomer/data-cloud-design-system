---
name: data_connect_skill
description: Configures connections to various data sources.
---

# Data Connect Skill

This skill is responsible for connecting to various data sources to retrieve data for the application.

## Responsibilities

1.  **Source Identification:** Identify the type of data source based on the user's prompt (e.g., BigQuery, CSV, API).
2.  **Connection Establishment:** Establish a connection to the specified data source using appropriate libraries or tools.
3.  **Data Ingestion:** Ingest data from the connected source, handling different data formats and structures.
4.  **Error Handling:** Implement robust error handling for connection failures and data ingestion issues.

## Supported Data Sources

1.  **Mock Mode (Default fallback):** If no live backend or data source is provided, the data layer MUST synthesize realistic, domain-appropriate mock data locally.
    *   Generate arrays containing at least 15-200 objects.
    *   Include realistic patterns (e.g., for sales: 12 months of data, seasonal variation, 3-5 distinct product categories, ~$50K-$500K monthly range).
    *   Build large datasets dynamically using Javascript generation loops to save token space.
2.  **Paste Mode:** If the user pastes raw CSV, JSON, or unstructured text directly in the prompt, the data layer must instruct the parsing of this inline text into structured state before applying visualization.
3.  **BigQuery:** Connects to Google BigQuery tables and views (if configured).
4.  **APIs & Cloud Storage:** Connects to external endpoints if explicit credentials and paths are provided.

## Workflow

1.  **Extract Connection Details:** Parse the user's prompt to extract necessary connection parameters (e.g., project ID, dataset ID, table name, file path, API endpoint, credentials).
2.  **Validate Details:** Validate the extracted connection details to ensure they are complete and correctly formatted.
3.  **Attempt Connection:** Use the identified data source type and connection details to establish a connection.
4.  **Retrieve Data:** Fetch data based on the connection and any specified filters or queries.
5.  **Return Data Reference:** Return a reference to the connected data (e.g., a DataFrame, a table object) for subsequent skills to use.

## Elicitation Questions

If connection details are ambiguous or missing, ask clarifying questions:
*   "What is the full path to your BigQuery table (project.dataset.table)?"
*   "Where is your CSV/JSON file located in Cloud Storage (gs://bucket/path/to/file)?"
*   "What is the API endpoint you want to connect to, and what authentication method does it require?"
*   "What type of SQL database are you using (e.g., PostgreSQL, MySQL), and what are the connection details (host, port, user, password, database name)?"
