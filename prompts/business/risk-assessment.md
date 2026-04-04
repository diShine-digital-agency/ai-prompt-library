---
title: Risk Assessment Framework
category: business
tags: [risk-management, mitigation, probability, impact, planning]
difficulty: intermediate
models: [claude, gpt-4, gemini]
---

# Risk Assessment Framework

Systematic risk identification, evaluation, and mitigation planning for
projects, business decisions, and strategic initiatives.

## When to Use

- Project kickoff risk planning
- Quarterly business risk reviews
- Pre-launch product risk assessment
- Investment or partnership due diligence
- Regulatory compliance risk evaluation

## The Technique

Risk assessment follows a structured process: identify potential risks,
evaluate their likelihood and impact, prioritize them, and create
mitigation plans for the most critical ones.

## Template

```
Conduct a risk assessment for:

Subject: {{project_or_decision}}
Context: {{relevant_background}}
Timeline: {{duration_or_deadline}}
Stakeholders: {{who_is_affected}}
Risk tolerance: {{low_medium_high}}

1. RISK IDENTIFICATION
Systematically identify risks across categories:
- Technical risks (technology, integration, performance)
- Resource risks (people, budget, skills)
- Schedule risks (delays, dependencies, external timelines)
- Market risks (competition, demand, pricing)
- Regulatory risks (compliance, legal, policy changes)
- Operational risks (process, infrastructure, vendor)
- Reputational risks (brand, public perception, trust)

2. RISK REGISTER
For each identified risk:

| ID | Risk | Category | Likelihood | Impact | Risk Score | Priority |
|----|------|----------|-----------|--------|------------|----------|
| R1 | {{description}} | Technical | 1-5 | 1-5 | L x I | H/M/L |

Likelihood scale:
1 = Rare (< 5%), 2 = Unlikely (5-20%), 3 = Possible (20-50%),
4 = Likely (50-80%), 5 = Almost Certain (> 80%)

Impact scale:
1 = Minimal, 2 = Minor, 3 = Moderate, 4 = Major, 5 = Severe

Risk score: Likelihood x Impact (1-25)
Priority: Critical (20-25), High (12-19), Medium (6-11), Low (1-5)

3. RISK MATRIX
                Impact
           1    2    3    4    5
    5  |  5 | 10 | 15 | 20 | 25 |
L   4  |  4 |  8 | 12 | 16 | 20 |
i   3  |  3 |  6 |  9 | 12 | 15 |
k   2  |  2 |  4 |  6 |  8 | 10 |
e   1  |  1 |  2 |  3 |  4 |  5 |

4. MITIGATION PLANS (for High and Critical risks)
For each:
- Risk ID and description
- Mitigation strategy: Avoid / Reduce / Transfer / Accept
- Specific actions to reduce likelihood or impact
- Owner responsible for mitigation
- Cost of mitigation
- Residual risk after mitigation
- Trigger: What event signals this risk is materializing

5. MONITORING PLAN
- Review frequency (weekly / monthly / quarterly)
- Key risk indicators (early warning signs)
- Escalation thresholds
- Reporting format
- Risk register update cadence

6. CONTINGENCY PLANS (for Critical risks)
If the risk materializes despite mitigation:
- Immediate response actions
- Communication plan
- Resource reallocation
- Recovery timeline
```

## Examples

### Product Launch Risk Assessment

```
Subject: Mobile app launch in European market

RISK REGISTER:
| R1 | GDPR non-compliance discovered post-launch | Regulatory | 3 | 5 | 15 | High |
| R2 | App store rejection due to policy violations | Technical | 2 | 4 | 8 | Medium |
| R3 | Key engineer leaves before launch | Resource | 2 | 4 | 8 | Medium |
| R4 | Competitor launches similar product first | Market | 3 | 3 | 9 | Medium |
| R5 | Server infrastructure cannot handle launch traffic | Technical | 3 | 4 | 12 | High |

MITIGATION for R1 (GDPR non-compliance):
Strategy: Reduce
Actions:
- Commission external GDPR audit 6 weeks before launch
- Implement data processing agreement templates
- Build consent management into onboarding flow
- Document all data flows and retention policies
Owner: Legal counsel
Cost: EUR 15,000 (external audit) + 5 engineering days
Residual risk: 6 (Likelihood drops from 3 to 2)
Trigger: Any data protection complaint or regulatory inquiry
```

## Tips

1. **Involve diverse perspectives** — Different team members see different
   risks. Include technical, business, legal, and operations viewpoints.

2. **Be specific** — "Technical risk" is too vague. "Database migration may
   corrupt 2% of customer records" is actionable.

3. **Quantify impact where possible** — "Major impact" is subjective. "$500K
   revenue loss per week of delay" is concrete.

4. **Review and update regularly** — Risk profiles change. New risks emerge
   and old risks resolve. Update the register at every milestone.

5. **Distinguish mitigation from acceptance** — Some risks are worth accepting.
   Document the deliberate decision to accept a risk and the rationale.

## Common Mistakes

1. **Incomplete identification** — Focusing only on technical risks while
   ignoring people, market, and regulatory risks leaves blind spots.

2. **All risks rated "medium"** — If every risk is 3x3, the assessment is
   not differentiated enough. Force ranking requires honest evaluation.

3. **Mitigation without owners** — "The team will monitor" assigns
   responsibility to nobody. Name a specific person for each mitigation.

4. **Set and forget** — A risk register created at project start and never
   updated is useless by month two.

5. **No contingency plans** — Mitigation reduces risk but does not eliminate
   it. High-impact risks need "what if it happens anyway?" plans.
