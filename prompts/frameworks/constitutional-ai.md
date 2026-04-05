---
title: Constitutional AI and Self-Correcting Prompts
category: frameworks
tags: [constitutional-ai, self-correction, critique, alignment, evaluation]
difficulty: advanced
models: [claude, gpt-4, gemini]
---

# Constitutional AI and self-correcting prompts

Constitutional AI (CAI) uses critique-revision loops to improve outputs without human feedback at every step. In prompt engineering, this translates to self-correcting prompts where the model generates, critiques, and revises its own work. The result is higher quality output from a single prompt interaction.

## When to use

- Tasks where first-draft quality is not sufficient (proposals, reports, code)
- Content that must meet specific quality criteria (brand voice, compliance, accuracy)
- Scenarios where you cannot iterate with the user between drafts
- Building automated pipelines that need quality assurance built in
- Any output that will be used without human review

**When NOT to use:**
- Simple factual lookups where critique adds no value
- Time-critical tasks where the extra processing is not worth the delay
- Tasks where the model consistently produces good first drafts

## The technique

### Basic critique-revision pattern

```
You are a technical writer creating API documentation.

STEP 1 — DRAFT:
Write documentation for the following API endpoint:
{{endpoint_spec}}

STEP 2 — CRITIQUE:
Review your draft against these criteria:
- Are all parameters documented with types and descriptions?
- Are error responses listed with status codes?
- Is there a working code example?
- Would a developer with no context understand how to use this endpoint?
- Is there any ambiguity in the descriptions?

List every issue you find. Be harsh.

STEP 3 — REVISE:
Rewrite the documentation, fixing every issue identified in the critique.
Mark what changed with [REVISED] annotations.
```

### Multi-principle constitution

Define explicit principles that the model uses as a rubric for self-evaluation:

```
Generate a customer-facing email about a service disruption.

After writing, evaluate your draft against these principles:

PRINCIPLE 1 — HONESTY: Does the email acknowledge the problem clearly
without deflecting or minimizing? Does it avoid corporate euphemisms
like "challenges" or "intermittent issues" when the service was down?

PRINCIPLE 2 — EMPATHY: Does it acknowledge impact on the customer's
work or day? Does it sound like a human wrote it, not a legal team?

PRINCIPLE 3 — ACTIONABILITY: Does the customer know exactly what
happened, when it will be fixed, and what they should do in the meantime?

PRINCIPLE 4 — TRUST: Does it explain what you are doing to prevent
recurrence? Does it avoid making promises you cannot keep?

For each principle, score your draft 1-5 and explain why.
If any principle scores below 4, revise to improve it.

Provide both the scored critique and the final revised email.
```

### Self-evaluation scoring

```
You are an expert evaluator. Rate the following {{content_type}} on these
dimensions. Use a 1-10 scale where:
- 1-3: fails to meet basic standards
- 4-6: acceptable but has clear gaps
- 7-8: good, minor improvements possible
- 9-10: exceptional, ready for publication

DIMENSIONS:
1. Accuracy: are all claims factually correct and properly qualified?
2. Completeness: does it cover all necessary aspects of the topic?
3. Clarity: would the target audience understand this on first read?
4. Actionability: can the reader act on this information directly?
5. Conciseness: is every sentence necessary? Any filler?

CONTENT TO EVALUATE:
{{content}}

For each dimension:
- Score (1-10)
- One specific example supporting your score
- One specific improvement suggestion

Overall assessment: [READY / NEEDS REVISION / REWRITE]
```

### Iterative constitution (multi-round)

For critical content, chain multiple critique rounds:

```
ROUND 1 — Generate:
Write a press release for {{announcement}}.

ROUND 2 — Factual critique:
Check every claim in the press release. Flag anything that is not
directly supported by the provided information. Remove or qualify
any unsupported claims.

ROUND 3 — Tone critique:
Evaluate the tone. Is it appropriately confident without being
arrogant? Does it read as newsworthy rather than self-promotional?
Adjust any sentences that feel like marketing copy rather than news.

ROUND 4 — Audience critique:
Read this as a journalist who receives 50 press releases per day.
Is the headline compelling? Is the lead paragraph newsworthy?
Would you read past the first paragraph? Revise for journalist
appeal.

FINAL OUTPUT:
The press release after all three critique rounds.
```

### Alignment techniques in prompts

These patterns keep outputs aligned with intended behavior:

**Boundary testing:**
```
After generating your response, test it against these boundary cases:
- Would this response be appropriate if taken out of context?
- Could this be misinterpreted in a harmful way?
- Does this response assume information not provided by the user?
If any test fails, revise the problematic sections.
```

**Perspective checking:**
```
Before finalizing your recommendation, consider it from three angles:
1. The person who benefits most from this recommendation
2. The person who is most disadvantaged by this recommendation
3. A skeptical observer who questions your reasoning
Address concerns from all three perspectives in your final output.
```

**Confidence calibration:**
```
For each major claim in your analysis:
- Rate your confidence (HIGH / MEDIUM / LOW)
- HIGH: supported by multiple reliable sources or clear logical deduction
- MEDIUM: supported by one source or reasonable inference
- LOW: based on pattern matching or limited information
Flag all LOW confidence claims visibly so the reader knows what to verify.
```

## Template

```
You are {{role}}.

TASK: {{task_description}}

CONSTITUTION (evaluate your output against these principles):
1. {{principle_1}}: {{description}}
2. {{principle_2}}: {{description}}
3. {{principle_3}}: {{description}}

PROCESS:
1. Generate your initial response
2. Critique it against each principle (score 1-5, explain)
3. If any principle scores below {{threshold}}, revise
4. Present the final version with a brief note on what changed

INPUT:
{{input}}
```

## Examples

### Contract clause review

```
Review this contract clause and identify risks for the client.

CONSTITUTION:
1. COMPLETENESS: did you identify all material risks, not just obvious ones?
2. PRACTICALITY: are your concerns realistic, or are you flagging theoretical risks that would never occur?
3. BALANCE: did you note any favorable terms, or only negatives?
4. ACTIONABILITY: for each risk, did you suggest a specific revision?

CLAUSE:
"The Service Provider shall not be liable for any indirect, incidental,
or consequential damages arising from the provision of services under
this agreement, regardless of the cause of action."
```

### Code review with self-correction

```
Review this function for bugs, security issues, and performance.

After your review, critique your own findings:
- Did I miss any edge cases? Check: null inputs, empty arrays, negative numbers, very large inputs, concurrent access.
- Are my severity ratings calibrated? Would a security engineer agree with my Critical/High/Medium/Low assignments?
- Did I provide a fix for every issue, not just a description?

If your self-critique reveals gaps, add them before presenting the final review.
```

## Tips

1. **Explicit principles beat vague quality requests** -- "make it better" produces generic revisions. "Check that every claim has a source" produces targeted improvements.

2. **Three principles is optimal** -- models handle 3-5 evaluation criteria well. More than 7 spreads attention too thin and revisions become superficial.

3. **Score thresholds drive action** -- "revise if any score is below 4" is more effective than "revise if needed" because it creates a concrete decision boundary.

4. **Self-critique is not perfect** -- models tend to be generous self-evaluators. If you need rigorous quality, use a separate model call for the critique step.

5. **Show the critique** -- asking the model to show its critique (not just the revised output) helps you debug prompt quality and understand where outputs fall short.

## Common mistakes

1. **Critique without revision** -- asking the model to identify problems but not fix them produces good analysis and unchanged output.

2. **Too many revision rounds** -- beyond 3 rounds, revisions become marginal and can even degrade quality as the model over-optimizes for the criteria.

3. **Vague principles** -- "be better" is not a principle. "Every recommendation must include a specific next step with a timeline" is a principle.

4. **Not testing the constitution** -- your principles might conflict with each other. Test with real inputs and verify that the critique-revision cycle actually improves output.

5. **Applying to trivial tasks** -- self-correction adds 30-50% more tokens. Use it where quality matters, not for simple lookups or classification.
