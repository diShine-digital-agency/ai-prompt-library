---
title: Incident Response Playbook Generator
category: development
tags: [incident-response, postmortem, debugging, on-call, sre]
difficulty: intermediate
models: [claude, gpt-4, gemini, mistral]
---

# Incident Response Playbook Generator

Generate structured incident response playbooks and post-incident reviews
from incident descriptions, producing actionable runbooks that on-call
engineers can follow under pressure.

## When to Use

- Creating runbooks for known failure modes before they happen
- Writing post-incident reviews (postmortems) after an outage
- Onboarding new on-call engineers who need structured procedures
- Documenting incident response for compliance or audit requirements
- Standardizing how your team handles severity levels

## The Technique

Effective incident response requires clear, step-by-step procedures that
work under stress. This prompt generates playbooks structured around the
standard incident lifecycle: detect, triage, mitigate, resolve, and review.
The playbook prioritizes restoring service first and root-cause analysis second.

## Template

```
Generate an incident response playbook for the following scenario.

INCIDENT DESCRIPTION:
{{incident_description}}

SEVERITY: {{severity}} (SEV1: critical / SEV2: major / SEV3: minor)

AFFECTED SYSTEMS:
{{affected_systems}}

TIMELINE (if known):
{{timeline}}

---

Create a playbook with these sections:

1. DETECTION & ALERTING
   - What alerts or signals indicate this incident is occurring?
   - What dashboards or metrics should be checked first?
   - What is the expected alert threshold and escalation path?

2. INITIAL TRIAGE (first 5 minutes)
   - Quick assessment checklist to confirm the incident
   - Severity classification criteria
   - Who to notify and through what channels
   - Initial communication template for stakeholders

3. MITIGATION (first 30 minutes)
   - Immediate actions to reduce customer impact
   - Rollback procedures if a deploy caused the issue
   - Failover or traffic-shifting steps

4. DIAGNOSIS & RESOLUTION
   - Step-by-step debugging procedure for this failure mode
   - Key logs, metrics, and queries to run
   - Common root causes and their fixes
   - Escalation criteria — when to involve additional teams

5. POST-INCIDENT REVIEW
   - Timeline reconstruction template
   - Root cause analysis framework (5 Whys or Fishbone)
   - Action items with owners and due dates
   - What went well / what could be improved
```

## Examples

### Database Connection Pool Exhaustion

Incident: "Production API returning 500 errors. Connection pool exhausted
due to long-running queries from a reporting feature deployed 2 hours ago."

Expected playbook output:
- **Detection**: Alert on 5xx rate > 1%, connection pool utilization > 90%
- **Mitigation**: Kill long-running queries, roll back reporting feature
- **Diagnosis**: Missing index on reporting query, add query timeout
- **Communication**: Status page update, engineering channel notification
- **Post-incident**: Add query timeout defaults, require query plan review
  for new features touching production DB

### Memory Leak in Background Workers

Incident: "Background job workers consuming increasing memory over 48
hours. Pods OOM-killed every 6-8 hours, causing job processing delays."

Expected playbook output:
- **Detection**: Alert on pod restart count > 3/hour, memory growth rate
- **Triage**: Check pod memory graphs, correlate with deploy timeline
- **Mitigation**: Rolling restarts, reduce batch size
- **Diagnosis**: Heap dump analysis, check unclosed connections, bisect deploys
- **Communication**: Internal update on processing delays
- **Post-incident**: Add memory limits and automatic recycling

## Tips

1. **Write playbooks before incidents happen** — A playbook written at
   3 AM during an outage is worse than one written calmly on a Tuesday.

2. **Keep mitigation and diagnosis separate** — Mitigation restores service;
   diagnosis finds root cause. Mixing them delays recovery.

3. **Include exact commands** — "Check the database" is vague. "Run
   `SELECT * FROM pg_stat_activity WHERE state = 'active'`" is actionable.

4. **Tailor to severity** — A SEV1 playbook needs communication templates
   and escalation paths. A SEV3 playbook may just need a debugging checklist.

5. **Review and update after every incident** — Playbooks are living
   documents. Each incident teaches you something the playbook missed.

## Common Mistakes

1. **Writing playbooks that assume expertise** — The on-call engineer may
   be a junior developer. Spell out every step explicitly.

2. **No escalation criteria** — Without clear "when to escalate" rules,
   engineers either escalate too early (noise) or too late (extended outage).

3. **Skipping the communication section** — Engineering fixes the system,
   but customers and stakeholders need timely updates. Silence erodes trust.

4. **Root cause analysis as blame assignment** — Postmortems should be
   blameless. Focus on systemic improvements, not individual mistakes.

5. **One-size-fits-all severity handling** — Define severity criteria
   explicitly. Treating every alert as SEV1 causes fatigue; treating a
   real SEV1 as SEV3 causes extended outages.
