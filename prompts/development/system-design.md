---
title: System Design Document Generator
category: development
tags: [system-design, architecture, scalability, infrastructure, design-doc]
difficulty: advanced
models: [claude, gpt-4, gemini, mistral]
---

# System Design Document Generator

Generate comprehensive system design documents from a set of requirements,
constraints, and scale expectations. The output covers high-level architecture,
component design, data flow, scalability strategy, and the trade-offs behind
each decision — ready for engineering review.

## When to Use

- Kicking off a new service or platform and need to align the team on architecture
- Preparing for a system design review or architecture decision record
- Documenting an existing system that was never formally designed on paper
- Evaluating trade-offs between competing approaches before committing to one
- Onboarding new engineers who need to understand how the pieces fit together

## The Technique

Provide the system name, functional and non-functional requirements, expected
scale (users, requests per second, data volume), and hard constraints such as
compliance rules, budget limits, or existing technology choices. The model
produces a structured design document that walks through each layer of the
system — from API surface to data storage — with explicit reasoning for every
decision.

The key is being specific about numbers. "Handle a lot of traffic" is useless.
"Handle 10,000 requests per second with p99 latency under 200ms" gives the
model enough to make real architecture choices.

## Template

```
Generate a system design document for {{system_name}}.

## Functional Requirements
{{requirements}}
Core capabilities the system must provide.

## Scale Expectations
{{scale_expectations}}
Concrete numbers: DAU/MAU, requests per second (avg and peak), data volume,
growth rate, and latency targets (p50, p99).

## Constraints
{{constraints}}
Hard boundaries: cloud provider, compliance requirements, team experience,
budget ceiling, existing technology commitments.

## Output
Produce a design document covering:
1. **Overview** — one-paragraph summary of the system.
2. **High-level architecture** — major components and interactions with
   a text-based diagram.
3. **API design** — key endpoints with request/response shapes.
4. **Data model** — entities, relationships, storage choices (SQL vs. NoSQL).
5. **Data flow** — request path from client to storage and back.
6. **Scalability strategy** — how the system handles 10x growth.
7. **Reliability** — failure modes, retries, circuit breakers, replication.
8. **Security** — auth, encryption, and compliance controls.
9. **Trade-offs** — what was chosen, what was rejected, and why.
10. **Open questions** — unresolved decisions needing team input.
```

## Examples

### URL Shortener at Scale

```
Overview: A URL shortening service supporting 100M short links with 10,000
redirects/second at peak.

High-level architecture:
  Client → API Gateway → Shortening Service → Cache (Redis) → DB (PostgreSQL)
                                           → Analytics Pipeline (async)

Key decisions:
- Base62 encoding of auto-increment ID for short codes (no collisions,
  no coordination between nodes).
- Read-heavy workload (100:1 read/write) → Redis cache with write-through.
- Analytics written to Kafka, consumed by batch pipeline into ClickHouse.
  Decoupled from the redirect hot path.

Trade-off: Chose Postgres over DynamoDB — simpler ops for the team size.
Will revisit at 1B links when single-node write throughput bottlenecks.
```

## Tips

1. **Include real numbers** — "High availability" means nothing. State
   "99.95% uptime" so the model can design appropriate redundancy.

2. **Describe the team** — A design for a 3-person startup and a 50-person
   platform team should look very different. State who will build and
   operate this system.

3. **Specify the read/write ratio** — This single number drives more
   architecture decisions than almost anything else.

4. **Ask for a text diagram** — Request ASCII or Mermaid diagrams. They are
   version-controllable and easy to paste into design docs or PRs.

5. **Iterate in layers** — Start with the high-level architecture, review
   it, then zoom into specific components. One-pass designs are shallow.

## Common Mistakes

1. **Skipping the constraints section** — Without constraints, the model
   defaults to a "perfect world" architecture. Real designs are shaped
   by limits.

2. **Over-engineering for scale you don't have** — Designing for 1M users
   when you have 100 adds complexity that slows you down.

3. **Ignoring operational complexity** — A design with Kafka, Redis,
   Elasticsearch, and three databases might be technically optimal, but
   if nobody can operate Kafka, it is a liability.

4. **No failure mode analysis** — Every component will fail. If the design
   does not cover what happens when the cache or database is down, it
   is incomplete.

5. **Treating the output as final** — An LLM-generated design doc is a
   strong first draft. Review with the team and validate with prototypes.
