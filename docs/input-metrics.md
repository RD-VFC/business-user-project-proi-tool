# Input Metrics Guide — BU Project Prioritization

This document explains the input fields used by the BU Project Prioritization tool, with guidance and examples you can share with Business Units.

## Fields

### Project Title
- Short descriptive name (e.g., "Billing API refactor").

### Duration (hrs)
- Unit: hours.
- Estimate the total person-hours required to deliver the project, including planning, dev, QA and deployment.
- Examples: small UI fix = 4–8 hrs; feature = 40–120 hrs; large program > 500 hrs (consider splitting).

### Workforce
- Number of people (FTE) working concurrently on the project.
- If two people each spend 50% time, count as 1.0.

### Frequency
- How often the benefit recurs. The app maps choices to multipliers used in scoring:
  - One-time → 0.1
  - Yearly → 0.25
  - Quarterly → 0.33
  - Bi-monthly → 0.5
  - Monthly → 1
  - Weekly → 4
  - Daily → 20

### Impact (1–10)
- Business benefit magnitude. 1 = negligible, 10 = transformational.

### Strategic Alignment (1–10)
- How directly the project supports current company strategy or OKRs. 10 = directly tied to a top strategic objective.

## Scoring formula
BU Score = (Impact × Strategic Alignment × Frequency) / (Duration × Workforce) × 10

Higher scores indicate higher priority. Use the score to guide prioritization discussions — not as the sole decision factor.

## Tips for BUs
- Be consistent in how you rate Impact and Strategic Alignment across projects.
- Capture assumptions (short note) when estimating duration and workforce.
- For large programs, split into smaller work items for fair comparison.
