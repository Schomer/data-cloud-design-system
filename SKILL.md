---
name: fraud-investigation-app-ui
description: Detailed guidelines for layout, visuals, and feature implementation of the Fraud Investigation React + Tailwind App.
---

# Fraud Investigation App UI Skill

This file documents the layout, visual design, and feature implementations for the Fraud Investigation app, so these patterns can be reused in future applications.

## 1. Overall Architecture
- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Backend/API integration**: Python FastAPI serving BigQuery data and Gemini data analytics chat.

## 2. Layout & Visuals
- Use a **dark mode** color palette by default using Tailwind's `bg-slate-900`, `text-slate-200`.
- The dashboard will consist of an intuitive table for flagged transactions.
- Selecting a transaction slides out a detail panel on the right (Gemini deep investigation).

## 3. Core Features
- **Transaction List**: 
  - Displays `transaction_id`, `amount`, `payor_name`, `payee_name`, `timestamp`.
  - Ordered by arrival time (`event_ts`).
- **Deep Investigation**: 
  - Gemini chat interface for asking questions about payors and payees.
- **Action Mechanism**: 
  - Buttons near the transaction detail to clearly mark as `Cleared` or `Fraudulent`.
