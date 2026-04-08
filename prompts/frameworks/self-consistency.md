---
title: Self-Consistency Prompting
category: frameworks
tags: [reasoning, voting, multi-path, consistency, reliability]
difficulty: advanced
models: [claude, gpt-4, gemini, llama, mistral]
---

# Self-Consistency Prompting

Self-Consistency prompting generates multiple independent reasoning paths for the
same problem and selects the most consistent answer through majority voting,
significantly improving reliability on math, logic, and factual questions.

## When to Use

- Mathematical and arithmetic word problems where a single chain may err
- Logic puzzles and constraint satisfaction with multiple valid approaches
- Factual questions where hallucination risk is high
- High-stakes decisions where confidence in the answer matters
- Any reasoning task where you need a reliability estimate

**When NOT to use:**
- Creative or open-ended tasks with no single correct answer
- Simple factual retrieval that doesn't require multi-step reasoning
- Latency-sensitive applications — multiple paths multiply inference time

## The Technique

Standard chain-of-thought prompting produces a single reasoning path, which
may contain errors that go undetected. Self-Consistency addresses this by
sampling multiple independent solutions and aggregating the results. If four
out of five paths reach the same answer, confidence is high. If answers are
split, the problem may be ambiguous or harder than expected.

The key insight is that correct reasoning tends to converge on the same answer
even when the intermediate steps differ, while errors tend to scatter across
different wrong answers. This makes majority voting a powerful error filter.

## Template

```
Solve the following task by generating {{num_paths}} independent reasoning
chains. Each chain must approach the problem differently — vary your
starting point, method, or perspective.

TASK:
{{task}}

INSTRUCTIONS:
1. For each reasoning path, work through the problem step by step.
2. Label each path clearly (Path 1, Path 2, etc.).
3. Do NOT refer to or build upon previous paths — each must be independent.
4. After all paths are complete, compare the final answers.
5. Select the answer that appears most frequently (majority vote).
6. If there is no majority, explain why the paths diverged and identify
   which reasoning is most sound.

FINAL OUTPUT:
- Majority answer: [the most common result]
- Agreement: [X out of {{num_paths}} paths agree]
- Confidence: [High if ≥80% agree, Medium if 60-79%, Low if <60%]
```

## Examples

### Arithmetic Word Problem

Task: "A bookstore sold 1,250 books in January. In February, sales increased
by 20%. In March, sales decreased by 15% from February. How many books were
sold in March?"

| Path | Method                      | Result |
|------|-----------------------------|--------|
| 1    | Sequential calculation      | 1,275  |
| 2    | Percentage-then-multiply    | 1,275  |
| 3    | Algebraic expression        | 1,275  |

Majority answer: 1,275 books — Agreement: 3/3 — Confidence: High

### Logic Puzzle

Task: "If all Bloops are Razzles, and some Razzles are Lazzles, are some
Bloops definitely Lazzles?"

| Path | Approach            | Result |
|------|---------------------|--------|
| 1    | Venn diagram        | No     |
| 2    | Syllogistic logic   | No     |
| 3    | Counterexample      | No     |
| 4    | Set theory notation | No     |
| 5    | Natural language    | Yes    |

Majority answer: No — Agreement: 4/5 — Confidence: High

## Tips

1. **Use odd numbers of paths** — 3 or 5 paths avoid ties. Five paths
   is the sweet spot for balancing cost and reliability.

2. **Require genuinely different approaches** — If all paths use the
   same method, errors correlate and voting loses its power.

3. **Include a confidence threshold** — Decide in advance what agreement
   level you require before trusting the result (e.g., ≥80%).

4. **Combine with chain-of-thought** — Each path should show its full
   reasoning, not just the final answer. This lets you audit disagreements.

5. **Watch the cost tradeoff** — Five paths cost five times as much as
   one. Reserve self-consistency for problems where accuracy matters more
   than speed or token budget.

## Common Mistakes

1. **Too few paths** — Two paths can only agree or disagree, giving you
   no signal. Use at least three, preferably five.

2. **Letting paths reference each other** — If Path 3 says "as shown in
   Path 1," the paths are no longer independent and errors propagate.

3. **Ignoring minority answers** — A 3-2 split may indicate an ambiguous
   problem. Investigate the disagreement instead of blindly trusting the majority.

4. **Applying to subjective tasks** — Self-consistency assumes one correct
   answer exists. For creative or opinion-based tasks, voting is meaningless.

5. **Using identical prompts for each path** — Without explicit instructions
   to vary approach, the model may produce near-identical reasoning chains
   that provide no diversity benefit.
