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

## 4. UI Component Anatomy
- **Header**: Simple title left, theme toggle (Sun/Moon from Lucide) right.
- **KPI Row**: 4 cards displaying `Title`, `Value` (3xl font), and a `Trend` badge (green/red background with +/- %).
- **Main Layout**: Uses Flex gap-4. Table takes up full width initially, truncates to 2/3 width when a transaction is selected. The Investigation Panel takes up the right 1/3 width.
- **Transaction Table**:
  - Toolbar above table: Filter, Date, and Category buttons styled as pill badges.
  - Risk Score Column: A visual progress bar spanning 0-100%, color coded (Green < 0.4, Amber < 0.8, Red > 0.8), paired with the decimal value.
  - Active Row: When clicked, the row highlights brightly (e.g., `bg-blue-50` light / `bg-blue-900/40` dark) to stand out from hover states.
- **Investigation Panel**:
  - Information blocks: Risk Level, Amount, Transaction details, Customer details. Each rendered inside bordered soft-background blocks to group data visually.
  - Action Buttons: `Clear Transaction` (default outline/ghost style), `Mark as Fraud` (solid red background `bg-rose-500` for emphasis).
  - Gemini Chat Log: AI chat UI anchored at bottom of the panel with sticky input field. Model responses have gray bubble backgrounds, User responses have blue tinted backgrounds aligned right.
