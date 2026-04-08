---
title: Growth Experiment Designer
category: marketing
tags: [growth, experiments, a-b-testing, metrics, hypothesis]
difficulty: intermediate
models: [claude, gpt-4, gemini, mistral]
---

# Growth Experiment Designer

Design structured growth experiments with clear hypotheses, measurable success
metrics, and analysis plans. The output gives you everything you need to pitch
an experiment to stakeholders, run it, and interpret the results — without
the common pitfalls that waste cycles on inconclusive tests.

## When to Use

- You have a growth goal but no clear next action to test
- Designing A/B tests and need to define sample size, duration, and metrics
- Building a growth experiment backlog prioritized by impact and effort
- Documenting past experiments so the team stops re-running failed ideas
- Presenting an experiment proposal to leadership for resource approval

## The Technique

Feed the model your growth goal, current baseline metrics, target audience,
and available channels. It generates a structured experiment brief including
the hypothesis, primary and guardrail metrics, test design, sample size
estimate, and a pre-registered analysis plan. Most failed experiments fail
because the hypothesis was vague or the metric was wrong, not because the
idea was bad.

## Template

```
Design a growth experiment to achieve the following goal.

## Growth Goal
{{growth_goal}}
A specific, measurable outcome, e.g.: "Increase 7-day activation rate
from 22% to 30%" or "Reduce month-2 churn from 8% to 5%."

## Current Metrics
{{current_metrics}}
Baseline numbers: conversion rate, traffic volume, user count, and any
historical experiment results on the same metric.

## Target Audience
{{target_audience}}
Who is the experiment aimed at, e.g.: "Free-tier users who signed up in
the last 14 days" or "Enterprise accounts with 50+ seats."

## Available Channels
{{channels}}
Where you can run experiments: in-product, email, paid acquisition, organic.

## Output
Produce an experiment brief with:
1. **Hypothesis** — "We believe [change] for [audience] will cause [metric]
   to [move] because [rationale]."
2. **Experiment type** — A/B test, multivariate, holdout, or sequential.
3. **Variants** — control and treatment(s) described in detail.
4. **Primary metric** — the one number that determines success or failure.
5. **Guardrail metrics** — metrics that must not degrade.
6. **Sample size and duration** — estimated from baseline rate, MDE, and
   80% power / 95% significance.
7. **Segmentation plan** — how to slice results (device, plan, cohort).
8. **Analysis plan** — statistical test, when to call it, how to handle
   inconclusive results.
9. **Rollout plan** — what happens if the experiment wins, loses, or is flat.
10. **Risks** — what could invalidate the experiment.
```

## Examples

### Onboarding Activation Experiment

```
Hypothesis: We believe that replacing the current 8-step onboarding wizard
with a single "quick win" task (importing one data source) for new free-tier
users will increase 7-day activation from 22% to 28% because users who see
value in the first session retain at 3x the rate of those who don't.

Experiment type: A/B test (50/50 split, user-level randomization).

Variants:
  Control: Existing 8-step onboarding wizard.
  Treatment: Single-screen prompt — "Import your first data source in
  2 minutes" with a guided flow.

Primary metric: 7-day activation rate (defined as completing ≥1 core action).
Guardrail metrics: 30-day retention, support ticket volume, feature adoption
breadth (ensure users aren't activating but then stalling).

Sample size: 4,200 users per variant (MDE = 6 percentage points, α = 0.05,
β = 0.20). At 300 signups/day, run for 28 days.

Analysis: Two-proportion z-test. Call the experiment after 28 days
regardless of trajectory. No peeking.
```

## Tips

1. **One primary metric per experiment** — If you have two primary metrics,
   you have zero. Pick the one that matters most; everything else is a
   guardrail or secondary metric.

2. **Pre-register your analysis plan** — Decide how you will analyze results
   before the experiment starts. Post-hoc analysis finds patterns in noise.

3. **Calculate sample size before you start** — Running for "a couple of
   weeks" without a power calculation wastes time.

4. **Include guardrail metrics** — A change that lifts conversion but tanks
   retention is not a win.

5. **Document every experiment** — Wins, losses, and flats. The most valuable
   experiment log prevents re-running tests that already failed twice.

## Common Mistakes

1. **Vague hypotheses** — "We think a new design will improve things" is not
   a hypothesis. State the change, audience, expected effect, and reasoning.

2. **Stopping experiments early** — Peeking at results and stopping when they
   "look good" inflates false positives. Commit to planned duration.

3. **Testing too many things at once** — Changing headline, CTA, layout, and
   pricing in one variant means you learn nothing about what worked.

4. **Ignoring seasonality** — An experiment over Black Friday or a product
   launch is contaminated. Check the calendar before scheduling.

5. **No rollout plan** — The experiment won. Now what? Without a pre-planned
   rollout, winning experiments sit in limbo while the lift decays.
