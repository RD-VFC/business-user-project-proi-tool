# BU (Business Unit) Project Prioritization Framework

## Purpose
This document describes the BU prioritization method that evaluates business value across projects using impact, strategic alignment, frequency, duration, and workforce.

## BU Metrics and Formula
- Project Title: text
- Manual Duration: hours
- Manual Workforce: people
- Frequency: dropdown (One-time, Yearly, Quarterly, Bi-monthly, Monthly, Weekly, Daily)
- Impact: 1-10
- Strategic Alignment: 1-10

BU Score formula:
```
BU Score = (Impact × Strategic Alignment × Frequency) / (Duration × Workforce) × 10
```

## Interpretation
- 80-100: Critical
- 50-79: High
- 30-49: Medium
- 10-29: Low
- 0-9: Minimal

## Implementation Notes
- Frequency acts as multiplier for recurring value
- Ensure durations are realistic and reflect person-hours
- Use historical data for better estimates

## Governance
- BU Product Owners provide BU inputs
- PMO oversees prioritization decisions

