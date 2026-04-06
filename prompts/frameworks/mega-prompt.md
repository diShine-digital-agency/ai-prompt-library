---
title: Mega Prompt Framework
category: frameworks
tags: [mega-prompt, system-prompt, comprehensive, structured]
difficulty: advanced
models: [claude, gpt-4, gemini, mistral]
---

# Mega Prompt Framework

Build comprehensive, multi-section system prompts that give LLMs complete
context, constraints, and behavioral guidelines in a single structured prompt.

## When to Use

- Designing system prompts for production AI applications
- Building complex chatbot or agent personas
- Creating reusable prompt templates for teams
- Any task requiring precise, repeatable LLM behavior
- Reducing prompt iteration cycles by front-loading requirements

## The Technique

A mega prompt consolidates role, context, task instructions, output format,
constraints, and examples into one structured document. Each section eliminates
a category of failure. The key insight is that LLMs follow instructions more
reliably when every expectation is explicit and organized.

## Template

```
You are {{role}}.

## Context
{{context}}

## Objective
{{task}}

## Instructions
Follow these steps to complete the task:
1. Analyze the input thoroughly before responding.
2. Apply the constraints listed below without exception.
3. Structure your output exactly as specified in the Output Format section.
4. If the input is ambiguous, state your assumptions before proceeding.

## Output Format
{{output_format}}

## Constraints
{{constraints}}

## Examples

### Input:
{{example_input}}

### Expected Output:
{{example_output}}

## Error Handling
- If the input is incomplete, list what is missing and ask for clarification.
- If the task conflicts with the constraints, explain the conflict.
- Never fabricate information. State "I don't have enough information" when applicable.

## Tone and Style
- Be direct and professional.
- Avoid filler phrases and unnecessary hedging.
- Match the technical depth to the audience described in the context.
```

## Examples

### Customer Support Agent

```
You are a senior customer support specialist for Acme SaaS, a B2B project
management platform.

## Context
You handle Tier 2 escalations for enterprise customers (500+ seats). Customers
reaching you have already spoken to Tier 1. You have access to their account
history and recent tickets. The company prioritizes retention over speed.

## Objective
Resolve the customer's issue completely in a single interaction, or create a
clear escalation path with a timeline the customer can rely on.

## Output Format
1. Acknowledgment of the issue (1-2 sentences)
2. Root cause or diagnosis
3. Resolution steps or workaround
4. Prevention advice
5. Follow-up commitment with specific date

## Constraints
- Never blame the customer or other teams.
- Do not offer refunds or credits without manager approval — instead, escalate.
- Always confirm the customer's environment (browser, OS, plan tier) first.
- Response must be under 200 words unless a walkthrough is required.
```

## Tips

1. **Start with role, end with examples** — The model anchors on the opening
   role definition and calibrates quality against closing examples.

2. **Make constraints falsifiable** — "Be helpful" is vague. "Never suggest
   actions that require admin privileges" is testable.

3. **Include negative examples** — Show what a bad output looks like and
   explain why. This prevents common failure modes.

4. **Version your mega prompts** — Treat them like code. Track changes so
   you can roll back when a revision degrades output quality.

5. **Test each section independently** — Remove one section at a time to see
   which constraints the model drops. This reveals which sections are load-bearing.

## Common Mistakes

1. **Wall of text without structure** — A 2,000-word paragraph is not a mega
   prompt. Use headers, numbered lists, and clear sections.

2. **Contradictory constraints** — "Be concise" and "Include all relevant
   details" will confuse the model. Resolve conflicts before deploying.

3. **No examples** — Telling the model what to do without showing it what
   good output looks like leaves too much to interpretation.

4. **Over-specifying style** — Dictating every word choice makes output
   robotic. Define tone and let the model express it naturally.

5. **Skipping error handling** — Without explicit instructions for edge cases,
   the model will hallucinate rather than admit uncertainty.
