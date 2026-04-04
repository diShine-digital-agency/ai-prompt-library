---
title: Meta-Prompting
category: frameworks
tags: [prompt-generation, self-refinement, optimization, iterative, advanced]
difficulty: advanced
models: [claude, gpt-4, gemini]
---

# Meta-Prompting

Meta-prompting uses language models to generate, evaluate, and refine prompts.
Instead of hand-crafting prompts, you instruct the model to design prompts for
specific tasks — essentially using prompt engineering to improve prompt engineering.

## When to Use

- Building prompts for production systems where quality matters
- When you're unsure how to prompt for a novel task
- Optimizing existing prompts that underperform
- Creating prompt templates for non-technical team members
- Generating domain-specific prompt libraries

**When NOT to use:**
- Simple one-off queries where iteration isn't worth the time
- Tasks where you already have a well-tested prompt
- When you need deterministic behavior (meta-prompts add variability)

## The Technique

### Prompt Generation

```
You are an expert prompt engineer. Your task is to design the optimal
prompt for the following use case:

Task: {{task_description}}
Target model: {{model_name}}
Desired output format: {{output_format}}
Quality criteria: {{what_makes_a_good_result}}
Known challenges: {{edge_cases_or_difficulties}}

Generate a production-ready prompt that:
1. Clearly defines the role and context
2. Provides structured instructions
3. Includes 2-3 few-shot examples
4. Handles edge cases gracefully
5. Specifies the exact output format

Output the complete prompt between <prompt> tags.
```

### Self-Refinement Loop

```
Here is a prompt designed for {{task}}:

<current_prompt>
{{existing_prompt}}
</current_prompt>

Here are examples where this prompt produced poor results:

<failure_1>
Input: {{input_1}}
Expected: {{expected_1}}
Actual: {{actual_1}}
</failure_1>

<failure_2>
Input: {{input_2}}
Expected: {{expected_2}}
Actual: {{actual_2}}
</failure_2>

Analyze why the prompt failed in these cases, then produce an
improved version that addresses the failure modes while maintaining
performance on normal inputs.

Analysis:
[Explain root causes]

Improved prompt:
<prompt>
[New version]
</prompt>
```

### Prompt Evaluation

```
Evaluate the following prompt on these criteria (score 1-10 each):

<prompt>
{{prompt_to_evaluate}}
</prompt>

Criteria:
1. Clarity — Are instructions unambiguous?
2. Completeness — Does it cover edge cases?
3. Efficiency — Does it use tokens wisely?
4. Robustness — Will it work for varied inputs?
5. Format control — Does it specify output structure?

For each criterion scoring below 7, provide a specific improvement.
```

### Prompt Decomposition

```
This complex task needs to be broken into a prompt chain.

Task: {{complex_task}}

Design a sequence of 2-5 prompts where:
- Each prompt handles one subtask
- The output of each prompt feeds into the next
- Error handling is built into each step
- The chain produces the final result

For each step, provide:
1. The complete prompt
2. Expected input format
3. Expected output format
4. How output connects to the next step
```

## Template

```
You are a prompt engineering specialist. Your job is to create
high-quality, production-ready prompts.

Context:
- Use case: {{use_case}}
- Target audience: {{who_will_use_this_prompt}}
- Model: {{target_model}}
- Constraints: {{constraints}}

Requirements:
- The prompt must be self-contained (usable without additional context)
- Include clear role definition
- Specify output format explicitly
- Handle edge cases: {{edge_cases}}
- Optimize for: {{optimization_target}} (accuracy / speed / cost)

Deliverables:
1. The complete prompt
2. Usage instructions (what to fill in, expected behavior)
3. Test cases (3 input/output pairs to verify it works)
4. Known limitations
```

## Examples

### Generating a Customer Support Prompt

```
Task: Create a prompt for handling customer refund requests.

Generated prompt:
<prompt>
You are a customer support specialist for an e-commerce company.
Handle refund requests following these policies:

- Orders within 30 days: Full refund approved
- Orders 31-60 days: Store credit offered
- Orders 60+ days: Deny with empathy
- Defective items: Always full refund regardless of time

For each request:
1. Acknowledge the customer's concern
2. Determine the order date and reason
3. Apply the correct policy
4. Communicate the decision with empathy
5. Provide next steps

Tone: Warm, professional, solution-oriented.
Never blame the customer. Always offer an alternative if denying.

Customer message: {{message}}
Order date: {{order_date}}
Order total: {{amount}}
</prompt>
```

### Optimizing an Underperforming Prompt

```
Original prompt: "Summarize this article"
Problem: Summaries are too long and miss key points.

Improved prompt:
<prompt>
Summarize the following article in exactly 3 bullet points.
Each bullet must:
- Start with the most important finding or claim
- Be no longer than 25 words
- Cover a distinct aspect (no overlap between bullets)

If the article contains data or statistics, include the most
impactful number in at least one bullet.

Article:
{{article}}

Summary (3 bullets):
</prompt>
```

## Tips

1. **Use the model to critique its own prompts** — After generating a prompt,
   ask the model to find weaknesses in it.

2. **A/B test generated prompts** — Run the same inputs through multiple
   prompt versions and compare outputs.

3. **Include failure modes in the refinement** — Real examples of where the
   prompt failed are more valuable than hypothetical concerns.

4. **Specify the target model** — A prompt optimized for Claude differs from
   one optimized for GPT-4. Include model-specific guidance.

5. **Version your prompts** — Track iterations with version numbers and
   link each version to its test results.

6. **Don't over-optimize** — Prompts that are perfectly tuned for test cases
   may be brittle on real-world inputs. Test with diverse, messy data.

## Common Mistakes

1. **Infinite refinement loops** — Set a maximum of 3-5 refinement iterations.
   Diminishing returns kick in fast.

2. **Optimizing for the wrong metric** — A prompt that produces longer output
   isn't necessarily better. Define success criteria before optimizing.

3. **Ignoring prompt length** — Meta-generated prompts tend to be verbose.
   Always trim unnecessary instructions after generation.

4. **Not testing edge cases** — A meta-generated prompt may handle typical
   inputs well but fail on empty inputs, very long inputs, or adversarial inputs.

5. **Forgetting the end user** — If non-technical users will fill in the template,
   the placeholders and instructions must be crystal clear.
