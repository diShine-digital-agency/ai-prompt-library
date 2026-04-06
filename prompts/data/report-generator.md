---
title: Structured Report Generator
category: data
tags: [reports, data-analysis, visualization, insights, dashboard]
difficulty: intermediate
models: [claude, gpt-4, gemini, mistral]
---

# Structured Report Generator

Transform raw data into structured, insight-driven reports with clear
narratives, key metrics, and actionable recommendations tailored to the
audience and purpose.

## When to Use

- Creating weekly, monthly, or quarterly business reports
- Summarizing data analysis results for non-technical stakeholders
- Generating consistent report formats from varying data sources
- Building narrative around dashboard metrics for presentations
- Preparing data-driven proposals or case studies

## The Technique

Provide raw data, the report type, audience, and key metrics. The model
structures the data into a narrative that leads with insights, supports
them with evidence, and closes with recommendations. The key is defining
the KPIs upfront so the report focuses on what matters instead of
describing every number in the dataset.

## Template

```
Generate a structured report from the following data.

## Data
{{data}}
Include the raw data, a data dictionary explaining each field, and the
time period covered.

## Report Type
{{report_type}} (e.g., weekly performance review, monthly executive
report, quarterly business review, incident post-mortem, campaign
analysis, cohort analysis).

## Audience
{{audience}} (e.g., executive team, marketing manager, engineering lead,
board of directors, external client).

## Time Period
{{time_period}} (e.g., "Q3 2025", "Week of Jan 6-12, 2026",
"Last 30 days vs. previous 30 days").

## Key Performance Indicators
{{kpis}}
List the 3-7 metrics that matter most. For each KPI, include:
- Metric name
- Target or benchmark
- How it is calculated

## Output Format
{{format}} (e.g., markdown report, slide deck outline, email summary,
PDF-ready with sections).

## Report Structure

### 1. Executive Summary (3-5 sentences)
Lead with the single most important insight. State whether the period
was above, below, or at target. Flag any anomalies.

### 2. KPI Dashboard
| KPI | Current | Target | Previous | Trend |
|-----|---------|--------|----------|-------|
Present each KPI with current value, target, prior period comparison,
and directional trend (↑ ↓ →).

### 3. Key Insights (3-5 bullets)
Each insight follows the pattern: "[What happened] + [Why it matters]
+ [What to do about it]."

### 4. Deep Dive Sections
For each KPI that is significantly above or below target, provide:
- Root cause analysis (what drove the change)
- Contributing factors
- Comparison to historical baseline

### 5. Risks and Watch Items
Issues that are not yet critical but require monitoring.

### 6. Recommendations (3-5 bullets)
Specific, actionable recommendations. Each must include:
- What to do
- Who should own it
- By when

### 7. Appendix
Supporting data tables, methodology notes, and definitions.

## Rules
- Round numbers appropriately (no "$4,127,384.29" — use "$4.1M").
- Always include period-over-period comparison.
- Distinguish correlation from causation in insights.
- Flag data quality issues that may affect conclusions.
```

## Examples

### Monthly SaaS Metrics Report

```
EXECUTIVE SUMMARY:
MRR grew 6.2% to $1.84M in October, exceeding the 5% monthly target.
Growth was driven by enterprise expansion revenue (+$82K), partially
offset by elevated SMB churn (4.8% vs. 3.5% target). Net revenue
retention hit 112%, the highest in 6 months.

KPI DASHBOARD:
| KPI                   | Oct 2025  | Target | Sep 2025  | Trend |
|-----------------------|-----------|--------|-----------|-------|
| MRR                   | $1.84M    | $1.80M | $1.73M    | ↑ 6.2%|
| Net Revenue Retention | 112%      | 110%   | 108%      | ↑     |
| SMB Churn Rate        | 4.8%      | 3.5%   | 3.7%      | ↑ Bad |
| CAC Payback (months)  | 11.2      | 12.0   | 12.8      | ↓ Good|
| NPS                   | 47        | 45     | 44        | ↑     |

KEY INSIGHTS:
- Enterprise expansion drove 71% of net new MRR. Three accounts upgraded
  from Pro to Enterprise tier, contributing $82K in expansion ARR.
  Action: Sales should prioritize upsell pipeline for Q4.
- SMB churn spiked to 4.8% after September's pricing change. Exit surveys
  cite price as the #1 reason (62% of churned accounts).
  Action: Product to evaluate a lower-cost SMB tier by Nov 15.
- CAC payback improved to 11.2 months due to organic traffic growth (+18%).
  Content marketing ROI is compounding. Action: Maintain current content
  investment; do not reallocate to paid channels.

RECOMMENDATIONS:
1. Launch SMB retention campaign targeting accounts at risk of churn.
   Owner: Customer Success. Deadline: November 8.
2. Accelerate enterprise upsell playbook rollout to full sales team.
   Owner: Sales Enablement. Deadline: November 15.
3. Investigate NPS drivers to sustain upward trend.
   Owner: Product. Deadline: November 20.
```

## Tips

1. **Lead with the insight, not the number** — "Enterprise expansion drove
   71% of growth" is more useful than "MRR was $1.84M." Numbers support
   stories, not the other way around.

2. **Compare to something** — A number in isolation is meaningless. Always
   include target, prior period, or historical average for context.

3. **Limit KPIs to 5-7** — More metrics dilute focus. If a metric does not
   drive a decision, it does not belong in the main report.

4. **Separate observations from recommendations** — The insights section
   describes what happened. The recommendations section says what to do.

5. **Tailor depth to audience** — Executives want the summary and
   recommendations. Analysts want the appendix. Write for both.

## Common Mistakes

1. **Data dump without narrative** — A table of numbers is not a report. Every
   data point needs context: is this good, bad, or expected?

2. **Confusing correlation and causation** — "Revenue increased after we
   changed the homepage" does not mean the homepage caused the increase.

3. **Burying bad news** — Putting the negative KPIs at the end or omitting
   them entirely destroys credibility. Address problems directly and early.

4. **No action items** — A report that describes the past without guiding
   the future is an academic exercise. Always close with recommendations.

5. **Inconsistent time periods** — Comparing a 31-day month to a 28-day month
   without normalizing skews every metric. Use daily averages or same-day counts.
