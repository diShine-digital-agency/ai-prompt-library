---
title: Tree-of-Thought Reasoning
category: frameworks
tags: [reasoning, branching, evaluation, multi-path, planning]
difficulty: advanced
models: [claude, gpt-4, gemini]
---

# Tree-of-Thought Reasoning

Tree-of-Thought (ToT) extends chain-of-thought by exploring multiple reasoning
paths simultaneously, evaluating each branch, and selecting the most promising one.
It mimics how humans solve complex problems by considering alternatives and
backtracking when a path seems unproductive.

## When to Use

- Complex planning problems with multiple valid approaches
- Creative tasks where exploring alternatives improves quality
- Puzzle-solving (24 game, crosswords, Sudoku-style problems)
- Strategic decisions with trade-offs
- Any task where the first approach may not be optimal

**When NOT to use:**
- Simple questions with one clear answer path
- Time-sensitive tasks where latency matters (ToT is token-heavy)
- Tasks where chain-of-thought alone achieves > 95% accuracy

## The Technique

### BFS (Breadth-First) Approach

Explore all branches at each level before going deeper:

```
Problem: {{problem}}

Generate 3 possible first steps:

Step 1A: [approach A]
Step 1B: [approach B]
Step 1C: [approach C]

Evaluate each step (score 1-10 for promise):
- Step 1A: [score] — [reasoning]
- Step 1B: [score] — [reasoning]
- Step 1C: [score] — [reasoning]

Select the top 2 and continue each:

Branch A, Step 2: [next step for A]
Branch B, Step 2: [next step for B]

Evaluate again and continue until solution is reached.
```

### DFS (Depth-First) Approach

Follow one path deeply, backtrack if it fails:

```
Problem: {{problem}}

Attempt 1:
Step 1: [action]
Step 2: [action]
Step 3: [action]
Evaluation: Does this solve the problem? [yes/no + reasoning]

If no, backtrack to Step 2 and try alternative:
Step 2 (alt): [different action]
Step 3: [action]
Evaluation: [assessment]
```

### Self-Evaluation Voting

```
Problem: {{problem}}

I will generate 3 complete solution paths, evaluate each,
and select the best.

Solution Path 1:
[complete solution]
Self-assessment: [strengths and weaknesses]
Confidence: [1-10]

Solution Path 2:
[complete solution]
Self-assessment: [strengths and weaknesses]
Confidence: [1-10]

Solution Path 3:
[complete solution]
Self-assessment: [strengths and weaknesses]
Confidence: [1-10]

Final selection: Path [N] because [reasoning]
Final answer: [selected solution]
```

## Template

```
You are a strategic problem solver. For complex problems, you explore multiple
approaches before committing to one.

Process:
1. Understand the problem and identify key constraints
2. Generate 3 distinct approaches
3. Evaluate each approach against the constraints
4. Develop the most promising approach in detail
5. Verify the solution

Problem: {{problem}}

Step 1 — Understanding:
[Restate problem, list constraints]

Step 2 — Brainstorm approaches:
Approach A: [brief description]
Approach B: [brief description]
Approach C: [brief description]

Step 3 — Evaluate:
[Score and reason about each approach]

Step 4 — Develop best approach:
[Detailed solution]

Step 5 — Verify:
[Check against constraints]
```

## Examples

### Strategic Planning

```
Problem: A startup has $500K runway and needs to reach profitability
in 12 months. They have a B2B SaaS product with 50 free users.

Approach A: Focus on converting free users to paid
- Pros: Existing users, lower CAC, faster path
- Cons: Small pool, may not scale fast enough
- Score: 7/10

Approach B: Aggressive outbound sales to new enterprise accounts
- Pros: Higher ACV, fewer deals needed
- Cons: Long sales cycle, expensive team
- Score: 5/10

Approach C: Product-led growth with freemium-to-paid funnel
- Pros: Scalable, lower cost, compounds over time
- Cons: Slower to show results, may exceed runway
- Score: 6/10

Selected: Approach A with elements of C
Reasoning: Convert existing users (quick revenue) while building
PLG mechanics for sustainable growth.
```

### Algorithm Design

```
Problem: Design an algorithm to find the k-th largest element
in an unsorted array.

Approach A: Sort the array, return arr[n-k]
- Time: O(n log n), Space: O(1)
- Simple but not optimal

Approach B: Use a min-heap of size k
- Time: O(n log k), Space: O(k)
- Better for large n with small k

Approach C: QuickSelect (modified QuickSort)
- Time: O(n) average, O(n^2) worst, Space: O(1)
- Optimal average case but unpredictable worst case

Selected: Approach B for production use
Reasoning: Guaranteed O(n log k) with no worst-case blowup,
and works well for streaming data.
```

## Tips

1. **Force genuine diversity** — Tell the model "each approach must differ
   fundamentally in strategy, not just in minor details."

2. **Use structured evaluation criteria** — Define what "good" means before
   evaluating: feasibility, cost, time, risk, scalability.

3. **Limit branching factor** — 3 branches is usually optimal. More than 5
   spreads reasoning too thin.

4. **Combine with CoT** — Use chain-of-thought within each branch for
   detailed reasoning.

5. **Prune early** — Explicitly state "eliminate approaches scoring below
   5/10 before developing further."

## Common Mistakes

1. **Superficial alternatives** — Generating three nearly identical approaches
   defeats the purpose. Push for structural differences.

2. **Biased evaluation** — The model may favor the first approach it generated.
   Evaluate all approaches against the same criteria.

3. **Too many branches** — Exploring 10+ paths consumes context window without
   proportional quality improvement.

4. **No backtracking** — If the selected branch hits a dead end, the model
   should be instructed to revisit alternatives.

5. **Forgetting to synthesize** — The best solution often combines elements
   from multiple branches rather than following one path exclusively.
