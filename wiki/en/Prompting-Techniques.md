# Prompting Techniques

> Comprehensive guide to every prompting framework, pattern, and best practice covered in the AI Prompt Library.

---

## Table of Contents

- [Chain-of-Thought (CoT)](#chain-of-thought-cot)
- [Few-Shot Patterns](#few-shot-patterns)
- [ReAct Agent](#react-agent)
- [Tree-of-Thought (ToT)](#tree-of-thought-tot)
- [Role-Based Prompting](#role-based-prompting)
- [Meta-Prompting](#meta-prompting)
- [Constitutional AI](#constitutional-ai)
- [Prompt Chaining](#prompt-chaining)
- [Structured Extraction](#structured-extraction)
- [Mega-Prompt](#mega-prompt)
- [Prompt Evaluation](#prompt-evaluation)
- [Self-Consistency](#self-consistency)
- [General Best Practices](#general-best-practices)
- [Common Mistakes to Avoid](#common-mistakes-to-avoid)
- [Tips by Skill Level](#tips-by-skill-level)

---

## Chain-of-Thought (CoT)

Chain-of-Thought prompting instructs the AI to show its reasoning step by step before reaching a conclusion. This dramatically improves accuracy on reasoning-heavy tasks.

### Variants

| Variant | How It Works | When to Use |
|---------|-------------|-------------|
| **Zero-Shot CoT** | Add "Let's think step by step" to the end of your prompt | Quick reasoning boost, no examples needed |
| **Few-Shot CoT** | Provide examples with step-by-step reasoning | Complex reasoning where format matters |
| **Auto-CoT** | Let the model generate its own reasoning chains | When you can't craft good examples |
| **Self-Consistency (CoT-SC)** | Run CoT multiple times, take majority vote | High-stakes decisions needing reliability |

### Zero-Shot CoT Example

```
Solve the following math problem. Let's think step by step.

A store has 45 apples. They sell 18 in the morning and receive 30 more
in the afternoon. How many apples do they have at the end of the day?
```

### Few-Shot CoT Example

```
Q: If a train travels at 60 km/h for 2.5 hours, how far does it go?
A: Let me work through this step by step.
   Step 1: Identify the formula — distance = speed × time
   Step 2: Plug in values — distance = 60 × 2.5
   Step 3: Calculate — distance = 150 km
   Answer: The train travels 150 km.

Q: A car drives at 80 km/h for 3.25 hours. How far does it travel?
A:
```

### When to Use CoT

✅ **Use when:**
- Math, logic, or multi-step reasoning problems
- Complex analysis requiring evidence evaluation
- Debugging code or tracing execution flow
- Planning tasks with dependencies
- Any problem where showing work matters

❌ **Don't use when:**
- Simple factual lookups ("What is the capital of France?")
- Creative writing where reasoning breaks flow
- High-volume tasks where you're paying per token
- Classification tasks with clear categories

### Tips

- **Be explicit:** "Show your reasoning for each step" works better than "think about it"
- **Number your steps:** The model follows numbered steps more reliably than free-form reasoning
- **Add verification:** "After reaching your answer, verify it by working backwards"
- **Combine with role:** "You are a math professor. Solve this step by step, explaining each step to a student"

---

## Few-Shot Patterns

Few-shot prompting teaches the AI by providing examples of the desired input-output format. The model learns the pattern and applies it to new inputs.

### How It Works

```
Convert the following product descriptions to JSON:

Input: "Red running shoes, size 10, $89.99"
Output: {"product": "running shoes", "color": "red", "size": "10", "price": 89.99}

Input: "Blue denim jacket, large, $124.50"
Output: {"product": "denim jacket", "color": "blue", "size": "large", "price": 124.50}

Input: "Black leather wallet, one size, $45.00"
Output:
```

### How Many Examples?

| Count | Best For | Tradeoff |
|:-----:|----------|----------|
| 0 (zero-shot) | Simple, well-defined tasks | Lowest token cost |
| 1–2 | Format demonstration | Good balance |
| 3–5 | Pattern learning, edge cases | Best quality for most tasks |
| 6+ | Complex or ambiguous tasks | High token cost, diminishing returns |

### Tips

- **Consistent format:** Every example must follow the exact same structure
- **Show edge cases:** Include at least one tricky example
- **Vary examples:** Don't make all examples too similar — show the range
- **Order matters:** Put the most representative examples first
- **Delimiter clearly:** Use clear separators between examples (`---`, `###`, or line breaks)

---

## ReAct Agent

ReAct (Reasoning + Acting) combines chain-of-thought reasoning with tool-using actions. The model follows a **Thought → Action → Observation** cycle.

### The Pattern

```
You are a research assistant with access to these tools:
- search(query): Search the web for information
- calculator(expression): Evaluate a math expression
- lookup(term): Look up a definition

For each step, use this format:
Thought: [What I need to figure out next]
Action: [tool_name(arguments)]
Observation: [Result from the tool]
... (repeat until you have the answer)
Final Answer: [Your conclusion]

Question: What is the GDP per capita of the country with the
tallest building in the world?
```

### When to Use

✅ **Use when:**
- Tasks requiring external tool use (search, APIs, databases)
- Multi-step research questions
- Problems requiring real-time data
- Building AI agents with tool access

❌ **Don't use when:**
- The AI has all needed information in context
- Simple single-step tasks
- Tasks where tool latency is unacceptable

---

## Tree-of-Thought (ToT)

Tree-of-Thought extends CoT by exploring **multiple reasoning paths** simultaneously, evaluating each branch, and backtracking from dead ends.

### The Pattern

```
Consider the following problem: [PROBLEM]

Generate 3 different approaches to solving this:

Approach 1: [description]
  Step 1: ...
  Step 2: ...
  Evaluation: [How promising is this approach? Rate 1-10]

Approach 2: [description]
  Step 1: ...
  Step 2: ...
  Evaluation: [How promising is this approach? Rate 1-10]

Approach 3: [description]
  Step 1: ...
  Step 2: ...
  Evaluation: [How promising is this approach? Rate 1-10]

Now select the most promising approach and develop it fully.
If you hit a dead end, backtrack and try the next best approach.
```

### When to Use

✅ **Use for:** Strategic planning, creative problem-solving, complex design decisions, optimization problems

❌ **Avoid for:** Simple problems with obvious answers, tasks with tight latency requirements

---

## Role-Based Prompting

Assigning an expert persona dramatically improves response quality. The AI draws on knowledge patterns associated with that role.

### Basic Pattern

```
You are a senior data analyst with 15 years of experience in
financial services. You specialize in risk modeling and have
presented findings to C-level executives at Fortune 500 companies.

[Your task here]
```

### Advanced: Role + Constraints

```
You are a senior DevOps engineer specializing in Kubernetes.

RULES:
- Always suggest the simplest solution first
- Include security implications for every recommendation
- If you're unsure, say so rather than guessing
- Use concrete examples with actual YAML/commands

AUDIENCE: Mid-level developers who know Docker but are new to K8s

TASK: [Your task here]
```

### Tips

- **Be specific:** "Senior Python developer" > "programmer"
- **Add experience level:** "10+ years" signals depth of knowledge
- **Add domain:** "specializing in healthcare data" narrows the focus
- **Combine with other techniques:** Role + CoT, Role + Few-Shot, Role + Guardrails

---

## Meta-Prompting

Using prompts to generate better prompts. The AI becomes your prompt engineer.

### The Pattern

```
You are an expert prompt engineer. Given the following task description,
create an optimized prompt that will produce the best possible output
from a large language model.

Task: {{task_description}}

Your optimized prompt should include:
1. A clear role definition
2. Specific instructions with constraints
3. Output format specification
4. Quality verification step
5. At least one example of expected output

Return the complete prompt, ready to use.
```

### When to Use

- When you're struggling to get good results from a prompt
- When you need to create prompts for non-technical users
- When optimizing prompts for production systems
- As a first step before manual refinement

---

## Constitutional AI

A self-critique and revision cycle where the AI evaluates and improves its own output.

### The Pattern

```
Step 1: Generate an initial response to: [TASK]

Step 2: Critique your response using these principles:
- Is it accurate and factually correct?
- Is it helpful without being harmful?
- Does it avoid bias and stereotypes?
- Is it complete and addresses all parts of the question?

Step 3: Revise your response based on the critique.

Step 4: Present only the revised version as your final answer.
```

### When to Use

- Content moderation and safety-critical applications
- Reducing bias in generated content
- Improving factual accuracy
- Self-correcting complex outputs

---

## Prompt Chaining

Breaking complex tasks into sequential prompts, where the output of one becomes the input of the next.

### The Pattern

```
Chain 1: Research
  "List the 5 most important factors in {{topic}}"

Chain 2: Analysis (receives Chain 1 output)
  "For each factor listed below, provide a detailed analysis:
   {{chain_1_output}}"

Chain 3: Synthesis (receives Chain 2 output)
  "Based on the following analysis, write an executive summary
   with recommendations: {{chain_2_output}}"
```

### Benefits

| Benefit | Description |
|---------|-------------|
| **Better quality** | Each step has a focused, manageable task |
| **Easier debugging** | You can inspect and fix each step independently |
| **More control** | You can add validation between steps |
| **Token efficiency** | Each prompt can use a smaller, cheaper model |

### Tips

- Keep each chain focused on a single task
- Validate output between chains
- Use different models for different chains (cheap for simple steps, expensive for complex ones)
- Document the chain flow for maintainability

---

## Structured Extraction

Using templates to reliably extract structured data from unstructured text.

### The Pattern

```
Extract the following information from the text below.
Return the result in this exact JSON format:

{
  "company_name": "string",
  "revenue": "number or null",
  "employees": "number or null",
  "founded_year": "number or null",
  "key_products": ["string"]
}

Rules:
- Use null for any field you can't find
- For revenue, use the most recent annual figure in USD
- For employees, use the most recent approximate count

Text:
{{input_text}}
```

### Tips

- Always specify the exact output format (JSON, table, etc.)
- Define what to do when data is missing (`null`, "N/A", skip)
- Include examples of edge cases
- Use constraints: "Extract ONLY from the provided text — do not add information"

---

## Mega-Prompt

A comprehensive, multi-section system prompt that covers all aspects of a complex task in a single prompt.

### Structure

```
# ROLE
You are [detailed role description]

# CONTEXT
[Background information and domain knowledge]

# TASK
[Primary task with clear objectives]

# RULES
1. [Hard constraint]
2. [Hard constraint]
3. [Quality standard]

# OUTPUT FORMAT
[Exact format specification]

# EXAMPLES
[1-3 examples of expected output]

# QUALITY CHECKS
Before responding, verify:
- [ ] All rules are followed
- [ ] Output matches the specified format
- [ ] Content is accurate and complete
```

### When to Use

- Production system prompts that need to handle many scenarios
- Complex tasks with many requirements
- When you need consistent output across many requests
- System prompts for customer-facing AI applications

---

## Prompt Evaluation

Systematically evaluating and scoring prompt quality.

### Evaluation Criteria

| Criterion | Weight | What to Check |
|-----------|:------:|---------------|
| **Clarity** | High | Is the task unambiguous? |
| **Specificity** | High | Are requirements detailed enough? |
| **Structure** | Medium | Are there clear sections? |
| **Constraints** | Medium | Are boundaries defined? |
| **Examples** | Medium | Are expected outputs shown? |
| **Completeness** | High | Does it cover all cases? |
| **Efficiency** | Low | Is it concise without losing clarity? |

Use the built-in [Prompt Linter](Tools-Linter-Optimizer-Recommender.md#prompt-linter) to automate quality scoring.

---

## Self-Consistency

Run the same prompt multiple times with different reasoning paths and take the majority answer.

### The Pattern

```
Solve this problem 3 times using different approaches.
For each attempt, use a different reasoning strategy.

Problem: [PROBLEM]

Attempt 1 (logical deduction): ...
Attempt 2 (working backwards): ...
Attempt 3 (analogy-based reasoning): ...

Final answer: [Select the answer that appears most frequently,
or if all differ, select the one with the strongest reasoning]
```

### When to Use

- High-stakes decisions where accuracy is critical
- Math problems with multiple solution paths
- Ambiguous problems where the "right" approach isn't clear
- Anywhere you need confidence calibration

---

## General Best Practices

### The Fundamentals

| Practice | Why It Matters | Example |
|----------|---------------|---------|
| **Be specific** | Vague prompts get vague answers | ❌ "Write something about dogs" → ✅ "Write a 500-word blog post about the health benefits of adopting senior dogs" |
| **Define the role** | Sets the knowledge context | "You are a senior security engineer" |
| **Set constraints** | Prevents unwanted behavior | "Never make up statistics. Cite sources." |
| **Provide examples** | Shows the expected format | Include 1-3 input/output examples |
| **Specify output format** | Ensures consistency | "Respond in JSON with these fields: ..." |
| **Add verification** | Catches AI errors | "Before responding, verify that your answer addresses all 3 requirements" |

### Prompt Structure Template

```
ROLE: [Who the AI should be]

CONTEXT: [Background information]

TASK: [What to do — be specific]

RULES:
- [Constraint 1]
- [Constraint 2]

OUTPUT FORMAT: [Exact format specification]

QUALITY CHECK: [Verification step]
```

---

## Common Mistakes to Avoid

| Mistake | Problem | Fix |
|---------|---------|-----|
| **Too vague** | "Help me with my code" | Specify language, error, expected behavior |
| **No role** | Generic, surface-level responses | Add "You are a [specific expert]" |
| **No format** | Inconsistent output structure | Specify JSON, markdown, table, etc. |
| **Too polite** | "Please kindly help me if you could..." wastes tokens | Direct instructions work better |
| **Information overload** | 5000 words of context with a 1-line question | Put the question first, context after |
| **Ambiguous scope** | "Tell me about Python" | "Explain Python's GIL and how it affects multi-threading" |
| **No constraints** | AI makes up data, hallucinates | "Only use information from the provided text" |
| **No examples** | Model guesses the format | Add 1-2 examples of expected output |
| **Assuming context** | "Fix the bug from before" | Every prompt should be self-contained |
| **Ignoring model strengths** | Using the wrong model for the task | See [AI Models Guide](AI-Models-Guide.md) |

---

## Tips by Skill Level

### Beginner

1. Start with a role: "You are a helpful [expert]"
2. State your task clearly in one sentence
3. Add "Respond in [format]" (markdown, bullet points, JSON)
4. Use the [Prompt Linter](Tools-Linter-Optimizer-Recommender.md) to check your prompts
5. Browse the library templates for inspiration

### Intermediate

1. Use structured sections (ROLE, TASK, RULES, OUTPUT FORMAT)
2. Add 2-3 few-shot examples for complex tasks
3. Combine techniques: Role + CoT, Few-Shot + Guardrails
4. Use the Compose feature to layer system prompts + frameworks
5. Test prompts against multiple models for robustness

### Advanced

1. Build prompt chains for complex multi-step workflows
2. Implement self-consistency (multiple reasoning paths)
3. Use meta-prompting to generate and optimize prompts
4. Design constitutional AI patterns for self-correction
5. Build multi-model routing with task-type classification
6. Create mega-prompts for production system prompts
7. Use Tree-of-Thought for complex strategic decisions

---

**Navigation:** [← Prompt Workshop](Prompt-Workshop.md) &nbsp;|&nbsp; [AI Models Guide →](AI-Models-Guide.md)
