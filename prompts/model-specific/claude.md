---
title: Claude Prompting Best Practices
category: model-specific
tags: [claude, anthropic, xml-tags, extended-thinking, system-prompts]
difficulty: intermediate
models: [claude]
---

# Claude Prompting Best Practices

Claude responds exceptionally well to structured prompts using XML tags, clear
instruction hierarchies, and explicit output formatting. This guide covers
techniques specific to Claude's architecture and capabilities.

## When to Use

- Any task involving Claude models (Haiku, Sonnet, Opus)
- Long-context tasks (up to 200K tokens)
- Complex multi-step instructions requiring clear structure
- Tasks needing tool use or function calling
- Projects requiring extended thinking for complex reasoning

## The Technique

### XML Tag Structure

Claude interprets XML tags as semantic containers. Use them to separate
sections of your prompt clearly:

```xml
<instructions>
You are a senior code reviewer. Analyze the provided code for bugs,
security issues, and performance problems.
</instructions>

<context>
This is a Python web application using Flask. The code handles user
authentication and processes payment information.
</context>

<code>
{{code_to_review}}
</code>

<output_format>
Provide your review as:
1. Critical issues (security/data loss risks)
2. Bugs (incorrect behavior)
3. Performance concerns
4. Style suggestions
</output_format>
```

### System Prompt Best Practices

Claude's system prompt sets persistent behavior across the conversation:

```
System: You are a financial analyst assistant. Rules:
- Always cite data sources
- Express uncertainty as confidence ranges
- Use tables for comparative data
- Default to conservative estimates
- Flag assumptions explicitly

Style: Professional, concise, data-driven. Avoid hedging language
unless genuinely uncertain.
```

Key principles for system prompts:
- Put the most important behavioral rules in the system prompt
- Use the system prompt for persistent identity and constraints
- Keep task-specific instructions in the user message

### Extended Thinking

For complex reasoning tasks, Claude can use extended thinking to work
through problems before responding:

```xml
<instructions>
This is a complex optimization problem. Take time to think through
all constraints before proposing a solution.

Consider:
- Budget constraints
- Timeline dependencies
- Resource availability
- Risk factors

Think step by step through each constraint before synthesizing
your recommendation.
</instructions>

<problem>
{{complex_problem}}
</problem>
```

### Long Context Handling (200K tokens)

When working with large documents:

```xml
<instructions>
I'm providing a large codebase below. I will ask specific questions
about it. When answering:
- Reference specific file names and line numbers
- Quote relevant code snippets
- If a question cannot be answered from the provided code, say so
</instructions>

<document name="main.py">
{{file_content_1}}
</document>

<document name="utils.py">
{{file_content_2}}
</document>

<document name="config.py">
{{file_content_3}}
</document>

<question>
{{user_question}}
</question>
```

### Tool Use Format

Claude's native tool use follows a specific structure:

```json
{
  "tools": [
    {
      "name": "get_weather",
      "description": "Get current weather for a location",
      "input_schema": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "City name or coordinates"
          },
          "units": {
            "type": "string",
            "enum": ["celsius", "fahrenheit"],
            "description": "Temperature units"
          }
        },
        "required": ["location"]
      }
    }
  ]
}
```

Best practices for tool definitions:
- Write detailed descriptions — Claude uses them to decide when to call tools
- Include example values in parameter descriptions
- Mark required vs optional parameters explicitly
- Group related tools logically

### Structured Output

```xml
<instructions>
Analyze this customer feedback and return a JSON object.
</instructions>

<desired_output>
{
  "sentiment": "positive | neutral | negative",
  "topics": ["array", "of", "topics"],
  "urgency": "low | medium | high",
  "suggested_action": "string",
  "confidence": 0.0 to 1.0
}
</desired_output>

<feedback>
{{customer_feedback}}
</feedback>
```

## Template

```xml
<system>
{{role_definition}}

Behavioral rules:
{{rules}}

Output preferences:
{{formatting_preferences}}
</system>

<context>
{{relevant_background}}
</context>

<instructions>
{{specific_task}}
</instructions>

<constraints>
{{limitations_and_requirements}}
</constraints>

<examples>
{{few_shot_examples}}
</examples>

<input>
{{user_input}}
</input>
```

## Tips

1. **XML tags are your best friend** — Claude parses them more reliably than
   markdown headers or numbered sections for separating prompt components.

2. **Put critical instructions early and late** — Claude attends strongly to the
   beginning and end of prompts. Put the most important rules in both places.

3. **Use "do" not "don't"** — "Respond in JSON format" works better than
   "Don't respond in plain text." Positive instructions are clearer.

4. **Prefill the assistant response** — You can start Claude's response to
   guide the format: set the assistant message to `{"analysis":` to force JSON.

5. **Be explicit about length** — "Respond in 2-3 paragraphs" or "Keep your
   response under 200 words" gives Claude clear targets.

6. **Use thinking tags for transparency** — Ask Claude to put reasoning in
   `<thinking>` tags and the final answer outside them.

## Common Mistakes

1. **Overly complex XML nesting** — Keep tags to 1-2 levels deep. Deeply nested
   XML is harder for the model to parse correctly.

2. **Contradicting system and user prompts** — If the system says "be concise"
   and the user says "be thorough," Claude may produce inconsistent behavior.

3. **Ignoring Claude's strengths** — Claude excels at nuance, following complex
   instructions, and producing well-structured output. Don't use it for tasks
   where simpler models suffice.

4. **Not using the full context window** — For document analysis, include the
   full document rather than summarizing. Claude handles 200K tokens well.

5. **Vague tool descriptions** — Claude decides when to use tools based on their
   descriptions. Poor descriptions lead to missed or incorrect tool calls.
