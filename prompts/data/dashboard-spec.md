---
title: Dashboard Specification
category: data
tags: [dashboard, visualization, kpi, reporting, business-intelligence]
difficulty: intermediate
models: [claude, gpt-4, gemini]
---

# Dashboard Specification

Create detailed dashboard specifications including KPI definitions,
visualization types, layout, interactivity, and data source mappings.

## When to Use

- Designing executive or operational dashboards
- Specifying requirements for BI teams (Tableau, Looker, Power BI)
- Creating self-serve analytics interfaces
- Standardizing reporting across departments
- Replacing ad-hoc spreadsheet reporting

## The Technique

A dashboard spec bridges the gap between business questions and technical
implementation by defining what to measure, how to display it, and how
users will interact with the data.

## Template

```
Create a dashboard specification for:

Dashboard purpose: {{purpose}}
Primary audience: {{audience}} (role and technical level)
Key business questions: {{questions}}
Data sources: {{sources}}
Refresh frequency: {{frequency}}
Tool: {{bi_tool}} (Tableau / Looker / Power BI / Metabase / custom)

Provide:

1. KPI DEFINITIONS
For each metric:
| KPI | Definition | Calculation | Source Table | Granularity | Target |
|-----|-----------|-------------|-------------|-------------|--------|

2. DASHBOARD LAYOUT
ASCII wireframe showing panel arrangement:
```
+------------------+------------------+
| KPI Card 1       | KPI Card 2       |
+------------------+------------------+
| Main Chart (60%) | Side Panel (40%) |
|                  |                  |
+------------------+------------------+
| Table / Detail View                 |
+-------------------------------------+
```

3. VISUALIZATION SPECIFICATIONS
For each panel:
- Chart type and reasoning
- Dimensions and measures
- Color coding logic
- Drill-down behavior
- Default time range

4. FILTERS AND INTERACTIVITY
- Global filters (date range, segment, region)
- Cross-filtering behavior between panels
- Drill-down paths (summary to detail)
- Export capabilities

5. DATA REQUIREMENTS
- Source tables and joins
- Calculated fields
- Aggregation levels
- Pre-aggregation needs for performance
- Data freshness requirements

6. ACCESS AND DISTRIBUTION
- Who can view vs. edit
- Scheduled email distribution
- Mobile responsiveness
- Embedded analytics needs
```

## Examples

### SaaS Executive Dashboard

```
Purpose: Weekly executive review of SaaS business health
Audience: CEO, CFO, VP Sales (non-technical)

KPIs:
| MRR | Monthly Recurring Revenue | SUM(active subscriptions * price) | subscriptions | Monthly | $2M |
| Churn Rate | % customers lost | lost_customers / start_customers * 100 | customers | Monthly | <3% |
| CAC | Customer Acquisition Cost | total_sales_marketing_cost / new_customers | finance | Monthly | <$500 |
| LTV | Lifetime Value | avg_revenue_per_customer * avg_lifespan_months | subscriptions | Quarterly | >$5000 |

Layout:
+--------+--------+--------+--------+
| MRR    | Churn  | CAC    | LTV    |
| $1.8M  | 2.1%   | $420   | $6,200 |
| +12%   | -0.3%  | -$30   | +$400  |
+--------+--------+--------+--------+
| MRR Trend (Line)     | Revenue by  |
| 12-month view        | Plan (Donut)|
|                      |             |
+----------------------+-------------+
| New vs. Churned Customers (Bar)    |
+------------------------------------+
| Top 10 Accounts Table (sortable)   |
+------------------------------------+
```

## Tips

1. **Start with questions, not charts** — Define what business questions the
   dashboard answers before choosing visualizations.

2. **Less is more** — Executive dashboards should have 4-6 KPIs maximum. Each
   additional metric dilutes attention. Use drill-downs for detail.

3. **Define "good" with targets** — Every KPI needs a target or benchmark.
   Without context, a number is meaningless.

4. **Color means something** — Use green/red only for good/bad indicators.
   Do not use color decoratively on data dashboards.

5. **Design for the question "what changed?"** — Include period-over-period
   comparisons, trend lines, and anomaly highlighting.

## Common Mistakes

1. **Too many metrics** — A dashboard with 20 charts is not a dashboard, it is
   a data dump. Prioritize ruthlessly.

2. **No metric definitions** — "Revenue" means different things to sales, finance,
   and product. Define calculations explicitly.

3. **Missing time context** — Numbers without time ranges are uninterpretable.
   Always show the period and comparison period.

4. **No interactivity** — Static dashboards answer one question. Interactive
   dashboards let users explore follow-up questions.

5. **Ignoring mobile** — Many executives check dashboards on phones. Ensure
   key KPIs are visible on small screens.
