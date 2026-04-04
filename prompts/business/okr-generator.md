---
title: OKR Generator
category: business
tags: [okrs, objectives, key-results, goal-setting, strategy]
difficulty: intermediate
models: [claude, gpt-4, gemini]
---

# OKR Generator

Create well-structured OKRs (Objectives and Key Results) that are ambitious,
measurable, and aligned with company strategy.

## When to Use

- Quarterly or annual planning cycles
- Translating strategy into measurable goals
- Aligning team objectives with company objectives
- Rewriting vague goals into actionable OKRs
- Cascading top-level OKRs to department and individual level

## The Technique

Good OKRs follow specific criteria: Objectives are qualitative and inspiring;
Key Results are quantitative and measurable. Together, they answer "where do
we want to go?" and "how will we know we got there?"

## Template

```
Generate OKRs for:

Level: {{company / department / team / individual}}
Time period: {{quarter_or_year}}
Strategic context: {{company_strategy_or_priorities}}
Current performance: {{relevant_baseline_metrics}}
Team/Department: {{team_name}}
Constraints: {{resources_or_limitations}}

Rules for OKR quality:
- 3-5 Objectives per level
- 2-4 Key Results per Objective
- Objectives: Qualitative, inspiring, actionable, time-bound
- Key Results: Quantitative, measurable, ambitious but achievable
- Each KR has a baseline (current state) and target (desired state)
- KRs measure outcomes, not activities (not "launch feature X" but
  "increase user engagement by X%")

Format:

OBJECTIVE 1: {{inspiring_statement}}
Owner: {{person_or_team}}
Confidence: {{initial_confidence_level}} (typically 50% for stretch goals)

| # | Key Result | Baseline | Target | Measurement | Status |
|---|-----------|----------|--------|-------------|--------|
| 1.1 | {{measurable_outcome}} | {{current}} | {{target}} | {{how_measured}} | Not started |
| 1.2 | {{measurable_outcome}} | {{current}} | {{target}} | {{how_measured}} | Not started |
| 1.3 | {{measurable_outcome}} | {{current}} | {{target}} | {{how_measured}} | Not started |

Initiatives (how we plan to achieve this):
- {{initiative_1}}
- {{initiative_2}}

OBJECTIVE 2: ...
```

## Examples

### SaaS Company Q2 OKRs

```
OBJECTIVE 1: Become the preferred analytics tool for mid-market SaaS companies
Owner: VP Product
Confidence: 40%

| 1.1 | Increase weekly active users | 2,400 | 4,000 | Product analytics | Not started |
| 1.2 | Achieve Net Promoter Score of 50+ | 38 | 50 | Quarterly survey | Not started |
| 1.3 | Reduce time-to-first-insight for new users | 45 min | 15 min | Onboarding funnel | Not started |

Initiatives:
- Redesign onboarding flow with guided setup wizard
- Launch template gallery with 20 industry-specific dashboards
- Implement in-app feedback collection

OBJECTIVE 2: Build a sustainable growth engine
Owner: VP Marketing
Confidence: 50%

| 2.1 | Increase organic search traffic | 25K/mo | 50K/mo | Google Analytics | Not started |
| 2.2 | Achieve 5% trial-to-paid conversion rate | 3.2% | 5.0% | Billing system | Not started |
| 2.3 | Reduce customer acquisition cost | $480 | $350 | Finance report | Not started |
```

## Tips

1. **Start with Objectives, not Key Results** — First agree on where you want
   to go, then figure out how to measure progress.

2. **Aim for 70% achievement** — If you hit 100% on every OKR, they are not
   ambitious enough. 70% completion on stretch goals is success.

3. **Separate committed from aspirational** — Label OKRs that must be achieved
   (committed) differently from stretch goals (aspirational).

4. **Review weekly, score quarterly** — OKRs are not set-and-forget. Weekly
   check-ins keep them actionable.

5. **Limit the number** — 3-5 objectives with 2-4 KRs each is the sweet spot.
   More than that fragments focus.

## Common Mistakes

1. **Activity-based KRs** — "Launch mobile app" is a task, not a key result.
   "Achieve 10K mobile app monthly active users" is a key result.

2. **Vanity metrics** — "Get 1M page views" means nothing if visitors do not
   convert. Measure outcomes that matter to the business.

3. **No baseline** — "Increase revenue" is unmeasurable without knowing the
   starting point. Always include current state.

4. **Too many OKRs** — 10 objectives with 5 KRs each means 50 things to track.
   Focus on the vital few, not the trivial many.

5. **Using OKRs as a task list** — OKRs define where you are going and how
   you measure progress. The specific tasks live in project management tools.
