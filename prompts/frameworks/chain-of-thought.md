---
title: Chain-of-Thought Prompting
category: frameworks
tags: [reasoning, step-by-step, problem-solving, logic, math]
difficulty: intermediate
models: [claude, gpt-4, gemini, llama, mistral]
---

# Chain-of-Thought Prompting

Chain-of-Thought (CoT) prompting elicits step-by-step reasoning from language models,
dramatically improving performance on tasks that require multi-step logic, arithmetic,
commonsense reasoning, or symbolic manipulation.

## When to Use

- Mathematical word problems or multi-step calculations
- Logic puzzles and constraint satisfaction problems
- Debugging code where you need to trace execution flow
- Complex decision-making with multiple factors
- Any task where showing work improves accuracy

**When NOT to use:**
- Simple factual retrieval ("What is the capital of France?")
- Creative writing where step-by-step reasoning breaks flow
- Tasks with trivially obvious answers — CoT adds latency without benefit

## The Technique

### Zero-Shot CoT

The simplest form: append "Let's think step by step" to your prompt.

```
Solve the following problem. Let's think step by step.

{{problem}}
```

This single phrase can boost accuracy by 10-40% on reasoning benchmarks.

### Few-Shot CoT

Provide examples that demonstrate the reasoning chain:

```
I will solve problems by showing my reasoning step by step.

Example 1:
Problem: A store sells apples for $2 each. If Maria buys 5 apples and pays with a $20 bill, how much change does she receive?
Reasoning:
- Cost of 5 apples: 5 x $2 = $10
- Change from $20: $20 - $10 = $10
Answer: Maria receives $10 in change.

Example 2:
Problem: {{example_2_problem}}
Reasoning:
{{example_2_reasoning}}
Answer: {{example_2_answer}}

Now solve:
Problem: {{problem}}
Reasoning:
```

### Auto-CoT

Let the model generate its own reasoning demonstrations:

```
For the following type of problem, first create 3 example problems with
step-by-step solutions, then use the same approach to solve the target problem.

Problem type: {{problem_type}}
Target problem: {{problem}}
```

### Self-Consistency (CoT-SC)

Generate multiple reasoning paths and take the majority answer:

```
Solve this problem 5 different ways, showing your reasoning each time.
Then compare your answers and select the one that appears most frequently.

{{problem}}
```

## Template

```
You are an expert problem solver. For every problem:

1. Restate the problem in your own words to confirm understanding
2. Identify the key information and unknowns
3. Plan your approach before calculating
4. Execute each step, showing all work
5. Verify your answer by checking it against the original constraints

Problem:
{{problem}}

Step-by-step solution:
```

## Examples

### Math Reasoning
```
Problem: A train travels at 60 km/h for 2 hours, then at 90 km/h for 1.5 hours.
What is the average speed for the entire journey?

Step-by-step:
1. Distance at 60 km/h for 2h: 60 x 2 = 120 km
2. Distance at 90 km/h for 1.5h: 90 x 1.5 = 135 km
3. Total distance: 120 + 135 = 255 km
4. Total time: 2 + 1.5 = 3.5 hours
5. Average speed: 255 / 3.5 = 72.86 km/h
```

### Debugging
```
Problem: This function should return the sum of even numbers in a list,
but it returns the wrong answer. Find the bug.

def sum_evens(nums):
    total = 0
    for n in nums:
        if n % 2 == 0:
            total += n
        return total

Step-by-step:
1. Read the function line by line
2. The return statement is inside the for loop (indentation error)
3. This means it returns after processing only the first element
4. Fix: unindent "return total" to be outside the for loop
```

### Logic
```
Problem: Five people are in a room. Each person shakes hands with every other
person exactly once. How many handshakes occur?

Step-by-step:
1. Person A shakes hands with B, C, D, E = 4 handshakes
2. Person B already shook with A, shakes with C, D, E = 3 new handshakes
3. Person C already shook with A, B, shakes with D, E = 2 new handshakes
4. Person D already shook with A, B, C, shakes with E = 1 new handshake
5. Person E already shook with everyone = 0 new handshakes
6. Total: 4 + 3 + 2 + 1 + 0 = 10 handshakes
```

## Tips

1. **Match example complexity to target** — If your problem is complex, your CoT
   examples should demonstrate similarly complex reasoning.

2. **Be explicit about format** — "Show each step on a new line with the step number"
   produces more consistent output than vague instructions.

3. **Combine with role prompting** — "You are a mathematics professor. Think through
   this step by step" often outperforms bare CoT.

4. **Use verification steps** — Adding "Now verify your answer" at the end catches
   roughly 15-20% of errors.

5. **Adjust granularity** — For simple problems, overly detailed CoT wastes tokens.
   For hard problems, coarse steps miss critical reasoning.

## Common Mistakes

1. **Using CoT for simple lookups** — "Let's think step by step about what the capital
   of France is" adds latency without improving accuracy.

2. **Inconsistent example formats** — If one example uses numbered steps and another
   uses bullets, the model may produce inconsistent output.

3. **Too few or too many steps** — Extremely fine-grained steps slow inference;
   too-coarse steps skip critical reasoning.

4. **Ignoring the self-consistency option** — For high-stakes calculations, generating
   3-5 reasoning paths and taking the majority answer is significantly more reliable.

5. **Not providing domain context** — CoT works best when the model understands the
   domain. Pair with relevant context or system prompts for technical problems.
