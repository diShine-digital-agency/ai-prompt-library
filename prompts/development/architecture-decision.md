---
title: Architecture Decision Record
category: development
tags: [architecture, adr, design-decisions, trade-offs, documentation]
difficulty: advanced
models: [claude, gpt-4, gemini]
---

# Architecture Decision Record (ADR)

Generate structured Architecture Decision Records that document why specific
technical decisions were made, what alternatives were considered, and what
trade-offs were accepted.

## When to Use

- Choosing between competing technologies or approaches
- Making irreversible or hard-to-reverse technical decisions
- Documenting existing architectural decisions retroactively
- Justifying technical choices for stakeholders
- Onboarding new team members who need to understand past decisions

## The Technique

ADRs follow a standardized format that captures not just the decision,
but the context, constraints, and trade-offs that led to it.

## Template

```
Generate an Architecture Decision Record for the following decision:

Decision topic: {{topic}}
System context: {{system_description}}
Team context: {{team_size_and_expertise}}
Constraints: {{constraints}} (budget, timeline, existing tech, compliance)

Format the ADR as follows:

# ADR-{{number}}: {{title}}

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-XXX]

## Date
{{date}}

## Context
What is the issue that we're seeing that is motivating this decision?
- Business context and drivers
- Technical context and current state
- What triggered the need for a decision now

## Decision Drivers
- {{driver_1}} (e.g., performance requirements)
- {{driver_2}} (e.g., team expertise)
- {{driver_3}} (e.g., time to market)
- {{driver_4}} (e.g., operational complexity)

## Considered Options
1. {{option_1}}: [Brief description]
2. {{option_2}}: [Brief description]
3. {{option_3}}: [Brief description]
4. Status quo: [What happens if we do nothing]

## Decision
We will use {{chosen_option}} because {{primary_reason}}.

## Detailed Analysis

### Option 1: {{option_1}}
**Pros:**
- [advantage]
- [advantage]
**Cons:**
- [disadvantage]
- [disadvantage]
**Estimated effort:** [time/cost]

### Option 2: {{option_2}}
[same structure]

### Option 3: {{option_3}}
[same structure]

## Consequences

### Positive
- [benefit of this decision]
- [benefit of this decision]

### Negative (accepted trade-offs)
- [trade-off we accept and why]
- [trade-off we accept and why]

### Risks
- [risk and mitigation strategy]
- [risk and mitigation strategy]

## Follow-Up Actions
- [ ] {{action_1}} — Owner: {{person}}, Deadline: {{date}}
- [ ] {{action_2}} — Owner: {{person}}, Deadline: {{date}}

## References
- [relevant documentation, benchmarks, articles]
```

## Examples

### Database Selection ADR

```
# ADR-007: PostgreSQL as Primary Database

## Status
Accepted

## Context
Our application needs a primary database for transactional data.
We expect to reach 10M records within 12 months and need strong
consistency guarantees for financial transactions. Our team of 5
developers has experience primarily with relational databases.

## Decision Drivers
- ACID compliance for financial transactions
- Team expertise and hiring market
- Operational complexity and managed service availability
- Query flexibility (complex joins, aggregations)
- Total cost at projected scale

## Considered Options
1. PostgreSQL (managed via AWS RDS)
2. MongoDB Atlas
3. CockroachDB
4. Status quo: SQLite (current prototype)

## Decision
We will use PostgreSQL on AWS RDS because it provides the ACID
guarantees we need, our team has deep expertise, and managed
hosting reduces operational overhead.

## Consequences
### Positive
- Strong consistency for financial transactions
- Rich SQL query capability for reporting
- Excellent tooling ecosystem
- Team can be productive immediately

### Negative (accepted trade-offs)
- Vertical scaling limits (acceptable for projected growth)
- Schema migrations require careful planning
- Less flexible for unstructured data (mitigated with JSONB columns)
```

## Tips

1. **Write ADRs before implementing** — The decision-making process is the value.
   Documenting after the fact loses the context and alternatives.

2. **Include the "do nothing" option** — The status quo is always an alternative.
   Evaluating it explicitly prevents change for change's sake.

3. **Be honest about trade-offs** — Every decision has downsides. Documenting
   them shows rigor and helps future reviewers understand the reasoning.

4. **Keep them concise** — An ADR should be readable in 5-10 minutes. If it
   takes longer, the decision may need to be decomposed.

5. **Link ADRs together** — When one decision supersedes another, link them.
   This creates a decision history that shows how thinking evolved.

## Common Mistakes

1. **Missing the context** — "We chose PostgreSQL" without explaining why
   is a record, not a decision record. Context is the most important section.

2. **Only one option listed** — If there is only one option, there is no
   decision to make. Include at least 3 alternatives to show due diligence.

3. **No consequences** — Decisions without documented trade-offs create
   surprises later when the downsides materialize.

4. **Written by one person in isolation** — ADRs should be reviewed by the
   team. Different perspectives catch blind spots.

5. **Never updated** — Deprecated decisions should be marked as such with
   a link to the superseding ADR. Stale ADRs mislead new team members.
