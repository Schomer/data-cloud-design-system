---
name: data_query_skill
description: Patterns for safely querying data efficiently from connected sources.
---

# Data Querying Skill

This skill is responsible for querying and filtering data based on user requirements. It allows for both simple selections and complex aggregations.

## Responsibilities

1.  **Query Interpretation:** Interpret natural language user requests into structured data queries (e.g., SQL, DataFrame operations).
2.  **Filtering & Selection:** Apply filters and select specific columns from the data.
3.  **Aggregation:** Perform aggregation operations (e.g., sum, average, count, group by).
4.  **Sorting:** Sort data based on specified columns.
5.  **Data Transformation (Query-specific):** Apply transformations that are part of the querying process (e.g., creating new calculated columns).

## Supported Query Methods

*   **SQL:** For relational databases or BigQuery.
*   **DataFrame Operations (ee.g., Pandas, BigFrames):** For in-memory data manipulation or BigQuery DataFrame operations.

## Workflow

1.  **Receive Data Reference:** Obtain the data reference (e.g., DataFrame, table identifier) from a preceding skill (e.g., `connect`, `clean`).
2.  **Interpret User Query:** Translate the user's natural language request into a specific query or series of data manipulation operations.
3.  **Construct Query:** Build the query using the appropriate language/API (SQL, DataFrame methods).
4.  **Execute Query:** Execute the constructed query on the data.
5.  **Return Queried Data Reference:** Return a reference to the resulting data after the query has been applied.

## Elicitation Questions

If the user's query is ambiguous or incomplete, ask clarifying questions:
*   "What specific columns do you want to select?"
*   "What conditions should I use to filter the data (e.g., 'sales > 100', 'date between X and Y')?"
*   "Do you want to group the data by any specific columns? If so, which ones?"
*   "What aggregation function should I apply (e.g., sum, average, count, min, max)?"
*   "How should the results be sorted (e.g., 'sales descending', 'date ascending')?"
*   "Are you looking for a specific time period (e.g., 'last month', 'Q3 2023')?"
