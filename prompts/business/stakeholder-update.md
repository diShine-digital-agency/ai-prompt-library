---
title: Stakeholder Update Generator
category: business
tags: [status-reports, communication, project-management, executive-updates]
difficulty: beginner
models: [claude, gpt-4, gemini, mistral]
---

# Stakeholder Update Generator

Create concise, structured project updates tailored to different
stakeholder audiences with clear status, risks, and next steps.

## When to Use

- Weekly or biweekly project status reports
- Executive committee briefings
- Board update preparation
- Cross-functional team alignments
- Client-facing progress reports

## The Technique

Effective stakeholder updates lead with status, highlight what changed,
flag risks with proposed solutions, and define clear next steps.

## Template

```
Generate a stakeholder update for:

Project: {{project_name}}
Reporting period: {{date_range}}
Audience: {{stakeholder_group}} (executives / board / team / client)
Overall status: {{green_yellow_red}}

Raw input (notes, data, issues from this period):
{{raw_notes}}

Structure the update as:

1. TRAFFIC LIGHT STATUS
Overall: [GREEN / YELLOW / RED]
- Schedule: [G/Y/R] — [one-line explanation]
- Budget: [G/Y/R] — [one-line explanation]
- Quality: [G/Y/R] — [one-line explanation]
- Risks: [G/Y/R] — [one-line explanation]

2. EXECUTIVE SUMMARY (3-5 bullets, under 100 words)
Lead with the most important change since last update.
- What was accomplished
- What is on track
- What needs attention

3. KEY ACCOMPLISHMENTS (this period)
- {{accomplishment_1}} — impact or significance
- {{accomplishment_2}} — impact or significance

4. UPCOMING MILESTONES
| Milestone | Target Date | Status | Confidence |
|-----------|-------------|--------|-----------|

5. RISKS AND ISSUES
| # | Risk/Issue | Impact | Likelihood | Mitigation | Owner |
|---|-----------|--------|-----------|-----------|-------|
Status: [New / Open / Mitigated / Closed]

6. DECISIONS NEEDED
- {{decision}} — needed by {{date}} — from {{who}}
- Impact of delay: {{consequence}}

7. NEXT PERIOD PLAN
- {{planned_activity_1}}
- {{planned_activity_2}}

8. METRICS (if applicable)
| Metric | Last Period | This Period | Trend | Target |
|--------|-----------|-------------|-------|--------|

Formatting rules:
- Total length: under 1 page for executives, up to 2 pages for detailed
- Lead with status, not narrative
- Use data over adjectives ("completed 12 of 15 tasks" not "good progress")
- Flag issues with proposed solutions, never problems without plans
- Keep tone: {{professional / casual / formal}}
```

## Examples

### Software Development Project Update

```
Project: Customer Portal Redesign
Period: March 25 - April 4, 2026
Status: YELLOW

TRAFFIC LIGHT:
Overall: YELLOW
- Schedule: YELLOW — 3-day delay on authentication module
- Budget: GREEN — 78% of budget consumed at 75% completion
- Quality: GREEN — 0 critical bugs in staging
- Risks: YELLOW — Dependency on third-party API migration

EXECUTIVE SUMMARY:
- Authentication module delayed 3 days due to unexpected OAuth
  provider deprecation; new provider integration in progress
- Dashboard and reporting modules completed ahead of schedule
- Beta testing now scheduled for April 15 (was April 12)
- No budget impact expected from the delay

RISKS:
| 1 | OAuth provider migration | Med | High | Switched to Auth0; 80% complete | Alex | Open |
| 2 | Beta tester recruitment | Low | Med | Email campaign sent; 45 of 50 confirmed | Maria | Mitigated |

DECISIONS NEEDED:
- Approve 3-day schedule extension — needed by April 7 — from Sarah (PM Director)
- Impact of delay: Beta testing shifts by 3 days; launch date unchanged
```

## Tips

1. **Write for skimmers** — Use traffic lights, bold key figures, and bullets.
   Most stakeholders spend 30 seconds on an update.

2. **Never surprise upward** — If status is going to change from green to
   yellow, communicate early with context. Surprises erode trust.

3. **Propose solutions with problems** — "We are delayed" is a problem.
   "We are delayed by 3 days; here is the recovery plan" is professional.

4. **Adapt detail to audience** — Executives want impact and decisions.
   Teams want specifics and blockers. Clients want progress and timelines.

5. **Be consistent** — Same format every time builds trust and makes updates
   scannable. Change the format only if the current one is not working.

## Common Mistakes

1. **Burying the lead** — Starting with background and history before getting
   to status wastes the reader's attention.

2. **Everything is green** — If every project is always green, the status
   system is meaningless. Be honest about yellow and red status.

3. **No metrics** — "Good progress" is subjective. "Completed 12 of 15
   deliverables (80%)" is objective and verifiable.

4. **Too detailed for executives** — Technical details belong in team updates,
   not executive summaries. Translate to business impact.

5. **Missing next steps** — An update that does not look forward leaves
   stakeholders wondering what happens next.
