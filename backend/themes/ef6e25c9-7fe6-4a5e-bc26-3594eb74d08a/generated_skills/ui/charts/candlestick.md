---
name: candlestick
category: visualizations
description: Used for financial and stock price movements showing open, high, low, and close values.
intent_keywords: ["candlestick", "ohlc", "financial", "stock"]
schema: timestamp: string, open: number, high: number, low: number, close: number
---

# Candlestick Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Used for financial and stock price movements showing open, high, low, and close values.