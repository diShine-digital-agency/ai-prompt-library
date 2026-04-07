---
title: Prompt Evaluation Framework
category: frameworks
tags: [prompt-evaluation, prompt-testing, quality-assurance, optimization]
difficulty: advanced
models: [claude, gpt-4, gemini, mistral]
---

# Prompt Evaluation Framework

Systematically evaluate and improve prompt quality by scoring against defined
criteria, identifying failure modes, and generating improved variants.

## When to Use

- Auditing prompts before deploying to production
- Comparing prompt variants for A/B testing
- Debugging prompts that produce inconsistent outputs
- Onboarding team members to prompt engineering standards
- Building a prompt review process for quality assurance

## The Technique

Submit a prompt along with its intended task and expected output. The evaluator
scores the prompt on clarity, specificity, robustness, and efficiency, then
generates concrete improvements. This is a meta-prompt — a prompt that evaluates
other prompts — and it works because the same principles that make prompts
effective are systematically checkable.

## Template

```
Evaluate the following prompt and provide an improvement plan.

## Prompt to Evaluate
{{prompt_to_evaluate}}

## Intended Task
{{intended_task}}
What should this prompt accomplish? What is the use case?

## Expected Output
{{expected_output}}
Describe or provide an example of what ideal output looks like.

## Target Model
{{model}} (e.g., GPT-4, Claude, Gemini, Mistral, Llama)

## Evaluation Criteria

Score each criterion from 1 (poor) to 5 (excellent):

### 1. Clarity (Is the instruction unambiguous?)
- Can the prompt be interpreted in only one way?
- Are all technical terms defined or contextually clear?
- Is the structure logical and easy to follow?

### 2. Specificity (Are expectations precise?)
- Does the prompt define the output format?
- Are edge cases addressed?
- Are there concrete constraints (length, tone, format)?

### 3. Completeness (Is all necessary context provided?)
- Does the prompt include role, context, and task?
- Are examples provided for complex outputs?
- Are error handling instructions included?

### 4. Robustness (Will it handle variations in input?)
- Does it work with short and long inputs?
- Does it handle missing or malformed data gracefully?
- Will it produce consistent results across runs?

### 5. Efficiency (Is every token earning its place?)
- Are there redundant instructions?
- Could the prompt be shorter without losing quality?
- Is it within the model's optimal prompt length?

## Output Format
1. Score table with justification for each criterion.
2. Top 3 weaknesses, ranked by impact on output quality.
3. Specific rewrite suggestions for each weakness.
4. An improved version of the full prompt.
5. 3 test cases to verify the improved prompt works.
```

## Examples

### Evaluation Output

```
SCORES:
| Criterion    | Score | Justification                                    |
|-------------|-------|--------------------------------------------------|
| Clarity      | 3/5   | Role is defined but task has two interpretations. |
| Specificity  | 2/5   | No output format. Length is unspecified.           |
| Completeness | 4/5   | Good context, but no error handling instructions. |
| Robustness   | 2/5   | Fails on empty input. No edge case handling.      |
| Efficiency   | 4/5   | Minimal redundancy. Could cut 2 filler sentences. |

OVERALL: 15/25 — Needs revision before production use.

TOP 3 WEAKNESSES:
1. No output format specification — model defaults to different structures
   across runs, making downstream parsing unreliable.
2. Ambiguous task — "analyze the data" could mean statistical summary,
   trend identification, or anomaly detection. Pick one.
3. No input validation — empty or malformed inputs produce hallucinated
   output instead of an error message.

IMPROVED PROMPT:
[Full rewritten prompt with the three weaknesses addressed]

TEST CASES:
1. Normal input: [typical expected input → expected output]
2. Edge case: Empty input → Should return: "No data provided."
3. Edge case: Extremely long input → Should truncate and note truncation.
```

## Tips

1. **Evaluate with the actual model** — A prompt that scores well on paper
   may fail at inference. Run the test cases on the target model.

2. **Score before rewriting** — Understand what is broken before fixing it.
   Random rewrites are less effective than targeted improvements.

3. **Use adversarial test cases** — Include inputs designed to break the
   prompt: empty inputs, conflicting instructions, off-topic queries.

4. **Track scores over time** — Maintain a spreadsheet of prompt versions
   and their scores. This reveals whether iterations actually improve quality.

5. **Have a second person evaluate** — Prompt authors have blind spots.
   A fresh pair of eyes catches ambiguities the author overlooked.

## Common Mistakes

1. **Evaluating in isolation** — A prompt that works alone may fail when
   combined with other system prompts or tool descriptions. Test in context.

2. **Optimizing for one model** — A prompt tuned for GPT-4 may underperform
   on Claude. If multi-model support matters, evaluate on each target.

3. **Ignoring prompt length** — Very long prompts can degrade performance on
   some models. Measure whether added instructions actually improve output.

4. **Subjective scoring** — "This feels like a 4" is not useful. Tie each
   score to observable, testable criteria.

5. **Skipping regression testing** — After improving one aspect, re-test all
   previous test cases. Fixes in one area can cause regressions in another.
