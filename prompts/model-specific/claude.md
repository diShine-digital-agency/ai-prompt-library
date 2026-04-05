---
title: Claude Prompting Best Practices
category: model-specific
tags: [claude, anthropic, xml-tags, extended-thinking, prefill, tool-use, artifacts]
difficulty: intermediate
models: [claude]
---

# Claude prompting best practices

Claude responds exceptionally well to structured prompts using XML tags, clear instruction hierarchies, and explicit output formatting. This guide covers techniques specific to Claude's architecture that working practitioners rely on daily.

## When to use

- Any task involving Claude models (Haiku, Sonnet, Opus)
- Long-context tasks (up to 200K tokens)
- Complex multi-step instructions requiring clear structure
- Tasks needing tool use or function calling
- Projects requiring extended thinking for complex reasoning
- Agentic workflows with tool chaining

## The technique

### XML tag patterns that actually work

Claude treats XML tags as semantic containers. Certain tag names trigger specific behaviors more reliably than others.

**High-value tag patterns:**

```xml
<instructions>
Primary task definition. Claude treats this as the core directive.
</instructions>

<context>
Background information the model should reference but not act on directly.
</context>

<constraints>
Hard rules that override other instructions. Claude respects these strongly.
</constraints>

<examples>
Few-shot demonstrations. Place after instructions, before input.
</examples>

<input>
The actual data to process.
</input>

<output_format>
Explicit structure for the response.
</output_format>
```

**Thinking and reflection tags:**

```xml
<instructions>
Before answering, work through your reasoning inside <scratchpad> tags.
Then provide your final answer inside <answer> tags.
</instructions>

<input>
Should we migrate from PostgreSQL to MongoDB for our e-commerce platform?
</input>
```

Claude will naturally separate reasoning from conclusion using those tags. The `<reflection>` tag works well for self-correction:

```xml
<instructions>
After your initial response, add a <reflection> section where you check
for errors, missing information, or logical gaps. If you find issues,
provide a <revised_answer>.
</instructions>
```

**Nested tags for complex structures** (keep to 2-3 levels max):

```xml
<document>
  <metadata>
    <title>Q4 Revenue Report</title>
    <date>2026-03-31</date>
  </metadata>
  <content>{{document_text}}</content>
</document>
```

### The prefill technique

You can start Claude's response by setting the beginning of the assistant message. This is one of the most powerful and underused techniques available through the API.

**Force JSON output:**

```python
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    messages=[
        {"role": "user", "content": "Analyze this feedback: 'Love the product but shipping took forever.'"},
        {"role": "assistant", "content": '{"sentiment":'}
    ]
)
# Claude continues from '{"sentiment":' and produces valid JSON
```

**Force a specific format:**

```python
messages = [
    {"role": "user", "content": "List the pros and cons of microservices."},
    {"role": "assistant", "content": "## Pros\n\n1."}
]
# Claude continues in the exact format you started
```

**Skip the preamble:**

```python
messages = [
    {"role": "user", "content": "Write a Python function to validate email addresses."},
    {"role": "assistant", "content": "```python\n"}
]
# Claude jumps straight to code without "Sure, here's a function that..."
```

Prefill works because Claude treats the assistant content as its own partial response and continues naturally. This is more reliable than instructions like "respond only with JSON."

### Extended thinking with budget tokens

Extended thinking lets Claude reason through complex problems before producing a visible response. The thinking is hidden from the user but visible through the API.

```python
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000  # how many tokens Claude can use for thinking
    },
    messages=[{"role": "user", "content": "Analyze this contract for risks..."}]
)

# response.content contains both thinking blocks and text blocks
for block in response.content:
    if block.type == "thinking":
        print("Reasoning:", block.thinking)
    elif block.type == "text":
        print("Answer:", block.text)
```

**When to use extended thinking vs. "think step by step":**

| Approach | Use when | Trade-off |
|----------|----------|-----------|
| `"think step by step"` in prompt | You want visible reasoning, simpler setup | Reasoning consumes visible output tokens |
| XML `<thinking>` tags in prompt | You want structured visible reasoning | Same as above, but better formatted |
| API extended thinking | Complex math, code, or analysis where hidden reasoning improves accuracy | Higher token cost, thinking is hidden by default |

Budget tokens control how long Claude can think. Set higher (10K-20K) for complex reasoning, lower (2K-5K) for simpler tasks where you just want a quality bump.

### Temperature recommendations by task

| Task | Temperature | Why |
|------|-------------|-----|
| Code generation, SQL | 0.0 | Determinism matters, one correct answer |
| Data extraction, classification | 0.0 | Consistency across runs |
| Summarization, analysis | 0.3 | Slight variation helps avoid repetitive phrasing |
| Business writing, emails | 0.5 | Natural-sounding prose needs some randomness |
| Creative writing, brainstorming | 0.7-0.9 | Diversity and surprise are the point |
| Poetry, experimental content | 1.0 | Maximum creativity |

Note: with extended thinking enabled, temperature is automatically set to 1.0 and cannot be changed. The thinking process itself handles reasoning quality.

### How Claude handles tool_use

Claude's tool use works differently from other models. Key differences:

```json
{
  "tools": [
    {
      "name": "get_customer_orders",
      "description": "Retrieve recent orders for a customer. Use this when
        the user asks about their order history, shipping status, or past
        purchases. Do NOT use this for product recommendations.",
      "input_schema": {
        "type": "object",
        "properties": {
          "customer_id": {
            "type": "string",
            "description": "The customer's unique ID (format: CUST-XXXXX)"
          },
          "limit": {
            "type": "integer",
            "description": "Number of orders to return. Default 10, max 50."
          }
        },
        "required": ["customer_id"]
      }
    }
  ]
}
```

**What makes Claude's tool use distinctive:**

1. **Description-driven decisions** -- Claude reads tool descriptions carefully and uses them to decide when to call tools. Detailed descriptions with usage guidance dramatically improve tool selection accuracy.

2. **Parallel tool calls** -- Claude can call multiple tools in a single turn when the calls are independent. No special prompting needed.

3. **Tool use with thinking** -- When extended thinking is enabled alongside tools, Claude reasons about which tool to use and why before making the call.

4. **Forced tool use** -- Set `tool_choice: {"type": "tool", "name": "specific_tool"}` to force Claude to use a particular tool, or `tool_choice: {"type": "any"}` to force it to use at least one tool.

5. **Negative instructions in descriptions** -- "Do NOT use this for X" in the description is highly effective at preventing misuse.

### Artifacts and structured outputs

When using Claude through the web interface or API with artifact support, Claude can produce self-contained outputs like code files, documents, SVGs, and interactive HTML.

**Prompting for artifacts:**

```
Create a React component that displays a sortable data table.
Requirements:
- Accept an array of objects as props
- Support column sorting (asc/desc)
- Highlight the currently sorted column
- Responsive design
- No external dependencies beyond React

Output as a single, self-contained component file.
```

Claude creates artifacts automatically when the output is substantial and self-contained. To increase the chance of artifact creation, ask for "a complete file" or "a self-contained document."

### Getting Claude to admit uncertainty

Claude is naturally inclined to be helpful, which sometimes means it fills gaps with plausible-sounding information. These prompt patterns reliably trigger honest uncertainty signals:

```xml
<instructions>
When you are uncertain about a fact:
- Say "I'm not confident about this" and explain what you do know
- Never invent citations, URLs, statistics, or proper nouns
- If asked about a specific person, company, or event, say what you
  can verify and flag anything you're uncertain about
- Distinguish between "I know this" and "this seems likely based on
  general patterns"
</instructions>
```

The key insight: Claude responds better to "distinguish between what you know and what you're inferring" than to "don't hallucinate." The positive framing gives Claude a concrete behavior to follow.

### System prompt design

Claude's system prompt sets persistent behavior. Key principles:

```
You are a financial analyst assistant.

Rules you must always follow:
- Cite data sources for every claim
- Express uncertainty as confidence ranges (e.g., "70-80% likely")
- Use tables for any comparative data
- Default to conservative estimates
- Flag assumptions explicitly with [ASSUMPTION] tags

When you don't know something:
- Say so directly
- Suggest how the user could find the answer
- Never fabricate data points

Style: professional, concise, data-driven.
```

**System prompt placement matters:**

- Put the most critical rules in the system prompt (they persist across turns)
- Keep task-specific instructions in user messages
- If a rule appears in both system and user messages, Claude weighs the user message slightly more in that specific turn
- For very long system prompts (2K+ tokens), put the most critical rules at the very beginning and repeat them at the end

### Long context handling (200K tokens)

```xml
<instructions>
I'm providing multiple documents below. When answering:
- Reference documents by their name attribute
- Quote relevant passages directly
- If information conflicts between documents, note the discrepancy
- If a question cannot be answered from the provided documents, say so
  rather than using your general knowledge
</instructions>

<document name="contract_v3.pdf">
{{file_content_1}}
</document>

<document name="amendment_2026.pdf">
{{file_content_2}}
</document>

<question>
{{user_question}}
</question>
```

Claude handles 200K tokens well, but attention is strongest at the beginning and end of the context. For critical information buried in the middle of a large document set, consider either placing a summary at the top or explicitly directing Claude's attention: "Pay special attention to the section titled X in document Y."

## Template

```xml
<system>
{{role_definition}}

Rules:
{{behavioral_rules}}

Output preferences:
{{formatting_preferences}}

Uncertainty handling:
{{what_to_do_when_unsure}}
</system>

<context>
{{relevant_background}}
</context>

<instructions>
{{specific_task}}
</instructions>

<constraints>
{{hard_requirements}}
</constraints>

<examples>
<example>
<input>{{example_input_1}}</input>
<output>{{example_output_1}}</output>
</example>
</examples>

<input>
{{user_input}}
</input>
```

## Tips

1. **XML tags beat markdown for structure** -- Claude parses XML tags more reliably than markdown headers for separating prompt sections. Use markdown within sections for readability, XML between sections for separation.

2. **Put critical instructions early and late** -- Claude attends most strongly to the beginning and end of prompts. Place the most important rules in both locations.

3. **Use positive instructions** -- "Respond in JSON format" works better than "Don't respond in plain text." Positive instructions give Claude a target rather than a boundary.

4. **Prefill for format control** -- Starting the assistant response with `{"analysis":` or `## Section 1\n` is more reliable than any instruction about output format.

5. **Be explicit about length** -- "Respond in 2-3 paragraphs" or "Keep your response under 200 words" gives Claude clear targets that it follows closely.

6. **Separate thinking from output** -- Whether using XML `<thinking>` tags or API extended thinking, separating reasoning from the final answer improves both the reasoning quality and the output clarity.

7. **Tool descriptions are prompts** -- The description field in tool definitions is effectively a prompt. Write them as carefully as you would any other part of your prompt.

8. **Batch independent requests** -- When using the Messages Batches API, group independent requests for 50% cost savings with 24-hour turnaround.

## Common mistakes

1. **Overly deep XML nesting** -- Tags 4+ levels deep become harder for Claude to track. Flatten your structure where possible.

2. **Contradicting system and user prompts** -- If the system says "be concise" and the user says "be thorough," Claude produces inconsistent output. Resolve conflicts before sending.

3. **Vague tool descriptions** -- "Gets data" tells Claude nothing about when to use a tool. "Retrieves order history for a specific customer by their ID. Use when the user asks about past orders or shipping status" is actionable.

4. **Not using the full context window** -- For document analysis, include the full document rather than summarizing. Claude handles 200K tokens and full documents preserve details that summaries lose.

5. **Ignoring prefill for structured output** -- Many developers add elaborate format instructions when a 5-character prefill would guarantee the format.

6. **Setting budget_tokens too low for complex tasks** -- Extended thinking with a 1K token budget gives Claude barely enough room to reason. Complex analysis tasks benefit from 8K-15K thinking budgets.

7. **Using temperature 0 for everything** -- Temperature 0 works for code and extraction but produces stilted, repetitive prose for writing tasks. Match temperature to task type.
