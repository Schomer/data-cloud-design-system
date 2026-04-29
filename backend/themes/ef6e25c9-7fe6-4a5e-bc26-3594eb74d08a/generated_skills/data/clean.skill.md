---
name: data_clean_skill
description: Handles data cleaning, preprocessing, and normalization rules.
---

# Data Clean Skill

This skill is responsible for cleaning and preprocessing data to ensure its quality and suitability for analysis and visualization.

## Responsibilities

1.  **Issue Identification:** Identify common data quality issues such as missing values, outliers, inconsistencies, and incorrect data types.
2.  **Cleaning Strategy:** Determine appropriate cleaning strategies based on the identified issues and user preferences (e.g., imputation for missing values, outlier removal, data type conversion).
3.  **Data Transformation:** Apply transformations to clean and preprocess the data.
4.  **Validation:** Validate the cleaned data to ensure the cleaning operations were successful and did not introduce new issues.

## Common Cleaning Operations

*   **Handling Missing Values:**
    *   **Removal:** Delete rows or columns with missing values.
    *   **Imputation:** Fill missing values using strategies like mean, median, mode, or predictive models.
*   **Outlier Detection and Treatment:**
    *   Identify outliers using statistical methods (e.g., Z-score, IQR).
    *   Remove or transform outliers.
*   **Data Type Conversion:**
    *   Convert columns to appropriate data types (e.g., string to numeric, object to datetime).
*   **Removing Duplicates:**
    *   Identify and remove duplicate rows.
*   **Standardization/Normalization:**
    *   Scale numerical features to a standard range or distribution.
*   **Text Cleaning:**
    *   Remove special characters, convert to lowercase, tokenization for text data.
*   **Inconsistency Resolution:**
    *   Correct inconsistent data entries (e.g., "USA", "U.S.A.", "United States" -> "United States").

## Workflow

1.  **Receive Data Reference:** Obtain the data reference (e.g., DataFrame) from the `connect` skill or another preceding skill.
2.  **Analyze Data Profile:** Generate a profile of the data to identify potential cleaning issues (e.g., count missing values, describe data types, detect outliers).
3.  **Propose Cleaning Steps:** Based on the data profile and potential user input, propose a series of cleaning steps.
4.  **Apply Cleaning Operations:** Execute the chosen cleaning operations on the data.
5.  **Return Cleaned Data Reference:** Return a reference to the cleaned data for subsequent skills (e.g., `query`, `ui/charts`).

## Elicitation Questions

If cleaning requirements are ambiguous, ask clarifying questions:
*   "How would you like to handle missing values in [column name]?" (e.g., "remove rows," "fill with mean," "fill with a specific value").
*   "Are there any specific columns you want to convert to a different data type? If so, what type?"
*   "Should I remove duplicate rows, or do you need to inspect them first?"
*   "Do you have any specific rules for identifying or treating outliers in certain columns?"
