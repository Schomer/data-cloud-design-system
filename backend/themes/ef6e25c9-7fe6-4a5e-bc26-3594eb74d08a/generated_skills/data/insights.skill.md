---
name: data_insights_skill
description: Discovers and highlights automatic insights in the data.
---

# Data Insights Skill

This skill is responsible for automatically analyzing data to uncover and highlight potentially interesting or significant insights. It goes beyond simple querying to identify trends, anomalies, and relationships that might not be immediately obvious.

## Responsibilities

1.  **Trend Analysis:** Identify significant upward or downward trends in time-series data.
2.  **Anomaly & Outlier Detection:** Detect data points that deviate significantly from the norm.
3.  **Correlation Analysis:** Identify strong positive or negative correlations between different numerical variables.
4.  **Change Point Detection:** Find points in time where the statistical properties of the data change.
5.  **Key Segment Discovery:** Identify segments or cohorts within the data that have significantly different characteristics or behaviors (e.g., a customer segment with unusually high churn).
6.  **Insight Generation:** Frame the discovered patterns as human-readable insights.

## Insight Discovery Techniques

*   **Statistical Analysis:**
    *   **Regression Analysis:** To understand relationships between variables.
    *   **Hypothesis Testing (e.g., t-tests, ANOVA):** To determine if observed differences are statistically significant.
    *   **Time Series Decomposition:** To separate a time series into trend, seasonal, and residual components.
*   **Machine Learning:**
    *   **Clustering (e.g., k-means):** To automatically group similar data points and identify distinct segments.
    *   **Association Rule Mining (e.g., Apriori):** To discover "if-then" relationships between variables (e.g., "if a customer buys X, they are likely to also buy Y").
    *   **Anomaly Detection Algorithms (e.g., Isolation Forest):** To find unusual data points.

## Workflow

1.  **Receive Cleaned & Queried Data:** Obtain a data reference from a preceding skill (e.g., `clean`, `query`).
2.  **Define Analysis Goals:** Based on user prompt or app archetype, determine the types of insights to look for (e.g., "find biggest drivers of sales", "identify unusual activity").
3.  **Apply Discovery Techniques:** Run a battery of appropriate analysis techniques on the data.
4.  **Filter & Rank Insights:** Filter out noise and rank the discovered patterns by their potential significance or "interestingness".
5.  **Generate Insight Narratives:** Convert the statistical findings into clear, concise, natural language statements. For example:
    *   "Sales in the 'North' region have increased by 35% in the last quarter, which is significantly higher than other regions."
    *   "Found a strong positive correlation (0.85) between 'Marketing Spend' and 'Website Traffic'."
    *   "Identified an outlier: a single order with a value of $50,000, which is 10x the average order value."
6.  **Return Insights:** Provide the generated insights to be displayed in the application, potentially in a dedicated "Key Insights" component.

## Elicitation Questions

If the goal for insight generation is unclear, ask clarifying questions:
*   "What kind of insights are you hoping to find in this data?"
*   "Are you more interested in trends over time, relationships between variables, or finding unusual data points?"
*   "Is there a specific metric you want to understand better (e.g., 'What's driving customer churn?')?"
