---
title: ReAct Agent Framework
category: frameworks
tags: [agents, tool-use, reasoning, actions, automation]
difficulty: advanced
models: [claude, gpt-4, gemini]
---

# ReAct Agent Framework

ReAct (Reasoning + Acting) interleaves chain-of-thought reasoning with concrete actions.
The model thinks about what to do, takes an action, observes the result, and repeats
until the task is complete. This is the foundation of most modern LLM agent architectures.

## When to Use

- Tasks requiring external tool calls (search, APIs, databases, file systems)
- Multi-step workflows where each step depends on prior results
- Information gathering and synthesis from multiple sources
- Complex problem-solving that requires iterative exploration
- Automated research, data collection, or pipeline execution

**When NOT to use:**
- Single-turn Q&A with no external data needs
- Creative writing or open-ended generation
- Tasks where all information is already in the prompt

## The Technique

### Core Loop

```
Thought: [Reason about what to do next]
Action: [tool_name(parameters)]
Observation: [Result from the tool]
... repeat ...
Thought: [I now have enough information to answer]
Answer: [Final response]
```

### Agent System Prompt Template

```
You are a helpful assistant with access to the following tools:

{{#each tools}}
- {{this.name}}: {{this.description}}
  Parameters: {{this.parameters}}
{{/each}}

When answering questions, follow this process:

1. THINK about what information you need and which tool can provide it
2. Call a tool using the format: Action: tool_name(param1="value1", param2="value2")
3. Review the Observation (tool result)
4. Repeat steps 1-3 as needed
5. When you have sufficient information, provide your final Answer

Rules:
- Always think before acting
- Use the most specific tool available
- If a tool call fails, reason about why and try an alternative approach
- Never fabricate tool results — only use actual Observations
- Provide your final answer only when you have verified information

Question: {{user_question}}
```

### Error Recovery Pattern

```
Thought: The API returned a 404 error. This could mean the resource
doesn't exist or the ID format is wrong. Let me try an alternative approach.

Action: search_api(query="{{alternative_query}}")
Observation: [results]

Thought: Found the resource under a different identifier. Proceeding with
the correct ID.
```

## Template

```
You are an autonomous research agent. Your task is to answer the user's
question accurately by gathering information using available tools.

Available tools:
- web_search(query: string) — Search the web for current information
- read_page(url: string) — Read the full content of a webpage
- calculate(expression: string) — Evaluate a mathematical expression
- lookup_database(table: string, filter: string) — Query internal database

Process:
Think -> Act -> Observe -> Repeat until confident -> Answer

Important guidelines:
- Verify claims from multiple sources when possible
- If a tool fails, explain why and try a different approach
- Cite your sources in the final answer
- Acknowledge uncertainty rather than guessing

User question: {{question}}

Begin:

Thought:
```

## Examples

### Research Task

```
Question: What is the current market cap of the top 3 EV companies?

Thought: I need to find the current market capitalizations of the largest
electric vehicle companies. Let me search for this information.

Action: web_search(query="top EV companies by market cap 2026")
Observation: Results show Tesla, BYD, and Rivian as top EV companies...

Thought: I have the companies. Now let me get specific market cap figures
for each one.

Action: web_search(query="Tesla market cap today")
Observation: Tesla market cap: $850B as of April 2026...

Action: web_search(query="BYD market cap today")
Observation: BYD market cap: $120B as of April 2026...

Action: web_search(query="Rivian market cap today")
Observation: Rivian market cap: $18B as of April 2026...

Thought: I now have current market cap data for the top 3 EV companies.

Answer: The top 3 EV companies by market cap are:
1. Tesla — ~$850B
2. BYD — ~$120B
3. Rivian — ~$18B
(Source: web search results, April 2026)
```

### Multi-Tool Workflow

```
Question: Calculate the ROI if we invested $10,000 in the S&P 500 five years ago.

Thought: I need two pieces of data — the S&P 500 price 5 years ago and today.

Action: web_search(query="S&P 500 price April 2021")
Observation: S&P 500 was approximately 4,180 in April 2021.

Action: web_search(query="S&P 500 price today April 2026")
Observation: S&P 500 is approximately 5,900 in April 2026.

Thought: Now I can calculate the return. Growth factor = 5900/4180.

Action: calculate(expression="(5900 - 4180) / 4180 * 100")
Observation: 41.15

Action: calculate(expression="10000 * (5900 / 4180)")
Observation: 14114.83

Thought: I have all the data to provide a complete answer.

Answer: A $10,000 investment in the S&P 500 in April 2021 would be worth
approximately $14,115 today — a return of about 41.1% over 5 years,
or roughly 7.1% annualized.
```

## Tips

1. **Keep tool descriptions precise** — Vague tool descriptions lead to incorrect
   tool selection. Include parameter types and example usage.

2. **Limit available tools** — Models perform better with 5-10 focused tools than
   50 general ones. Group related functionality.

3. **Add guardrails for destructive actions** — For tools that modify data (DELETE,
   UPDATE), require explicit confirmation in the Thought step.

4. **Set a maximum iteration count** — Prevent infinite loops by limiting the
   Thought-Action-Observation cycle to 10-15 iterations.

5. **Log everything** — In production, capture every Thought, Action, and Observation
   for debugging and auditing.

6. **Use structured tool output** — JSON tool responses are easier for the model
   to parse than free-text output.

## Common Mistakes

1. **Skipping the Thought step** — Going straight to Action without reasoning leads
   to poor tool selection and wasted calls.

2. **Not handling tool failures** — If you don't teach the model to recover from
   errors, it will either hallucinate results or get stuck.

3. **Over-relying on a single tool** — Models sometimes fixate on one tool. Encourage
   them to consider alternatives in the system prompt.

4. **Ignoring observation quality** — The model should evaluate whether a tool result
   actually answers the question before proceeding.

5. **No termination condition** — Without clear criteria for when to stop and answer,
   agents can loop indefinitely or answer prematurely.
