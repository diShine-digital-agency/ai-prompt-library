---
title: Role-Based Prompting
category: frameworks
tags: [personas, expertise, multi-agent, roleplay, system-prompts]
difficulty: beginner
models: [claude, gpt-4, gemini, llama, mistral]
---

# Role-Based Prompting

Role-based prompting assigns the model a specific persona, expertise, or perspective.
When done well, it activates domain-specific knowledge, adjusts communication style,
and produces more focused, authoritative responses.

## When to Use

- Domain-specific tasks requiring specialized vocabulary and reasoning
- When you need a particular communication style (formal, casual, technical)
- Multi-perspective analysis (simulate different stakeholders)
- Educational content at a specific expertise level
- Creative writing with consistent character voice

**When NOT to use:**
- Factual lookups where persona adds no value
- When the role could introduce biased reasoning (e.g., "act as a defense attorney"
  for an objective legal analysis)
- Simple tasks where added persona instructions waste tokens

## The Technique

### Simple Role Assignment

```
You are a senior database administrator with 15 years of experience
in PostgreSQL performance tuning.

{{task}}
```

### Detailed Persona Design

```
You are Dr. Elena Vasquez, a senior data scientist at a Fortune 500
retail company. Your background:
- PhD in Statistics from Stanford
- 10 years in retail analytics
- Expert in demand forecasting and customer segmentation
- Communicate findings to non-technical executives
- Prefer actionable insights over theoretical discussion
- Use data visualization recommendations in every analysis

Your audience today: The VP of Marketing, who has a business background
but limited statistics knowledge.

Task: {{task}}
```

### Multi-Agent Debate

```
We will analyze this decision from three perspectives.

PERSPECTIVE 1 — The CFO:
Evaluate {{decision}} purely from a financial standpoint.
Consider ROI, cash flow impact, payback period, and risk.

PERSPECTIVE 2 — The CTO:
Evaluate {{decision}} from a technical standpoint.
Consider feasibility, technical debt, scalability, and team capacity.

PERSPECTIVE 3 — The CMO:
Evaluate {{decision}} from a market standpoint.
Consider competitive advantage, customer impact, and brand perception.

SYNTHESIS:
After presenting all three perspectives, identify areas of agreement,
tension, and recommend a path forward that addresses all concerns.
```

### Expertise Calibration

```
Explain {{topic}} at three levels:

Level 1 — Explain to a curious 10-year-old:
[simple language, analogies, no jargon]

Level 2 — Explain to a college student studying the field:
[proper terminology, underlying principles, some nuance]

Level 3 — Explain to a fellow expert:
[advanced concepts, edge cases, current research, trade-offs]
```

## Template

```
# Role Definition
You are {{role_title}} with expertise in {{domain}}.

# Background
- {{years}} years of experience in {{specialty}}
- Known for {{approach_or_methodology}}
- Communication style: {{style_description}}

# Audience
You are speaking to {{audience_description}}.

# Constraints
- {{constraint_1}}
- {{constraint_2}}
- {{constraint_3}}

# Task
{{task_description}}

# Output Format
{{expected_format}}
```

## Examples

### Technical Review

```
You are a principal security engineer conducting a code review.
Your priorities:
1. Identify security vulnerabilities (OWASP Top 10)
2. Flag authentication and authorization issues
3. Check for data exposure risks
4. Note injection attack surfaces

Review style: Direct, specific, actionable. Reference CWE IDs
where applicable. Rate severity as Critical/High/Medium/Low.

Review this code:
{{code}}
```

### Content Strategy

```
You are a content strategist who has grown three B2B SaaS blogs
from 0 to 100K monthly organic visitors. You specialize in
bottom-of-funnel content that drives signups.

Your approach:
- Every piece must target a specific buyer persona and search intent
- You prioritize conversion-oriented content over vanity traffic
- You structure recommendations with estimated impact and effort

Create a content strategy for: {{company_description}}
```

### Stakeholder Communication

```
You are an experienced project manager who excels at translating
technical complexity into executive-friendly updates. Your style:
- Lead with impact (business outcomes, not technical details)
- Use the format: Status / Key Wins / Risks / Next Steps
- Flag blockers with proposed solutions, never just problems
- Keep it under 200 words

Write a project update for: {{project_context}}
```

## Tips

1. **Specificity beats generality** — "Senior backend engineer specializing in
   distributed systems" outperforms "experienced developer."

2. **Include behavioral traits** — "You are concise and prefer bullet points"
   shapes output format. "You always consider edge cases" shapes reasoning.

3. **Add anti-behaviors** — "You never provide generic advice. Every
   recommendation is specific and actionable" prevents fluff.

4. **Match role to task complexity** — A simple question doesn't need a
   detailed persona. Save elaborate roles for complex tasks.

5. **Test role combinations** — Sometimes combining two roles works well:
   "You are a UX designer with a background in cognitive psychology."

## Common Mistakes

1. **Contradictory traits** — "You are extremely concise" paired with "provide
   comprehensive details" creates confusion. Pick a consistent direction.

2. **Celebrity impersonation** — "Act as Elon Musk" rarely produces useful output
   and can introduce unwanted biases. Use generic expertise roles instead.

3. **Role overload** — A persona with 20 traits is harder to follow than one
   with 3-5 clear characteristics. Focus on what matters for the task.

4. **Ignoring audience** — The role defines the speaker, but the audience defines
   the communication level. Always specify both.

5. **Static roles for dynamic tasks** — If the task requires multiple perspectives,
   use multi-agent debate rather than forcing one role to cover everything.
