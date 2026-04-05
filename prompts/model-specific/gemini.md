---
title: Gemini Prompting Best Practices
category: model-specific
tags: [google, gemini, multimodal, grounding, safety-settings, context-caching, video, code-execution, gemini-3]
difficulty: intermediate
models: [gemini-3-pro, gemini-3-flash, gemini-2.5-pro, gemini-2.5-flash]
---

# Gemini prompting best practices

Google's Gemini models excel at multimodal tasks, grounded responses using Google Search, and processing massive context windows. This guide covers Gemini-specific features including grounding API parameters, context caching strategy, video understanding, and the differences between model variants.

## Current models (as of April 2026)

| Model | Type | Context | Pricing (input/output) | Best for |
|-------|------|---------|----------------------|----------|
| **Gemini 3 Pro** | frontier | very large | premium tier | state-of-the-art reasoning, multimodal understanding, agentic and coding tasks |
| **Gemini 3 Flash** | fast frontier | very large | mid tier | new default in Gemini app — major capability upgrade over 2.5 Flash, lightning speed |
| **Gemini 2.5 Pro** | previous gen | 1M+ tokens | $1.25/$10 per M | still very capable, good value for complex tasks (deprecated June 2026) |
| **Gemini 2.5 Flash** | previous gen | 1M tokens | $0.30/$2.50 per M | budget-friendly, fast (deprecated June 2026) |
| **Gemini 2.5 Flash-Lite** | economy | large | lowest cost | cost-effective upgrade path from 1.5/2.0 Flash, lowest latency |

**Key changes:**
- Gemini 3 series has launched — 3 Flash is now the default in the Gemini app
- Gemini 3 Pro brings significant reasoning improvements over 2.5 Pro
- 2.5 Pro and 2.5 Flash are being deprecated on June 17, 2026 — migrate to 3 series
- all models support native multimodal (text, image, audio, video)

**Which model to pick:**
- **Gemini 3 Pro**: complex reasoning, large codebases, research, tasks where quality matters most
- **Gemini 3 Flash**: general-purpose workhorse — fast, capable, good price/performance
- **Gemini 2.5 Flash-Lite**: high-volume, cost-sensitive workloads where you need speed over depth

## When to use

- Multimodal tasks combining text, images, audio, and video
- Tasks requiring grounded, current information via Google Search
- Long-context processing (up to 1M+ tokens)
- Code generation with built-in code execution
- Tasks requiring safety-tuned outputs with configurable thresholds

## The technique

### System instructions format

Gemini uses a dedicated `system_instruction` parameter rather than embedding system-level instructions in messages:

```python
model = genai.GenerativeModel(
    'gemini-2.5-pro',
    system_instruction="""You are an expert travel planner specializing in sustainable tourism.

Rules:
- Suggest eco-friendly options first
- Provide estimated carbon footprints for transportation
- Use metric units unless the user specifies otherwise
- Format itineraries as day-by-day tables
- Include approximate costs in local currency"""
)
```

This is structurally different from OpenAI's system message or Claude's system prompt. The `system_instruction` is cached separately from the conversation, making it more efficient for multi-turn conversations.

### Grounding with Google Search: actual API parameters

```python
from google.genai import types

model = genai.GenerativeModel('gemini-2.5-pro')

# Basic grounding
response = model.generate_content(
    "What are the latest developments in quantum computing?",
    tools=[types.Tool(google_search_retrieval=types.GoogleSearchRetrieval())],
)

# With dynamic retrieval (controls when grounding activates)
response = model.generate_content(
    "What are the latest developments in quantum computing?",
    tools=[types.Tool(
        google_search_retrieval=types.GoogleSearchRetrieval(
            dynamic_retrieval_config=types.DynamicRetrievalConfig(
                mode="MODE_DYNAMIC",
                dynamic_threshold=0.3  # 0.0 = always ground, 1.0 = never ground
            )
        )
    )],
)

# Access grounding metadata
for candidate in response.candidates:
    grounding = candidate.grounding_metadata
    if grounding:
        for chunk in grounding.grounding_chunks:
            print(f"Source: {chunk.web.title} - {chunk.web.uri}")
```

**Dynamic threshold tuning:**

| Threshold | Behavior | Use when |
|-----------|----------|----------|
| 0.0 | Always use Google Search | Factual queries requiring current data |
| 0.3 | Ground when model is moderately uncertain | General knowledge tasks with freshness needs |
| 0.7 | Ground only when highly uncertain | Tasks where model knowledge is usually sufficient |
| 1.0 | Never ground (effectively disables) | Creative or hypothetical tasks |

### Context caching: when it saves money

Context caching stores processed input tokens and reuses them across multiple requests. The break-even point depends on how many times you query the same content.

```python
from google.genai import caching
import datetime

# Create a cache with a large document
cache = caching.CachedContent.create(
    model='gemini-2.5-pro',
    display_name='annual_report_2025',
    system_instruction="You are a financial analyst. Answer questions about this report with specific page references.",
    contents=[
        types.Content(
            parts=[types.Part.from_text(annual_report_text)]  # e.g., 500K tokens
        )
    ],
    ttl=datetime.timedelta(hours=2),  # cache expires after 2 hours
)

# Use the cached content for multiple queries
model = genai.GenerativeModel.from_cached_content(cache)

response1 = model.generate_content("What was revenue growth YoY?")
response2 = model.generate_content("Summarize the risk factors section.")
response3 = model.generate_content("Compare Q3 and Q4 performance.")
# All three queries use the cached tokens -- significantly cheaper
```

**When caching is worth it:**
- Documents over 32K tokens that you will query 3+ times
- Multi-user scenarios where different users ask different questions about the same content
- Iterative analysis sessions (ask, refine, ask again)
- Context that does not change between requests (reference docs, codebases)

**When caching is not worth it:**
- Single query against a document
- Content that changes with every request
- Short context (under 32K tokens) -- caching overhead exceeds savings

### Video understanding prompting

Gemini natively processes video, which is unique among major LLMs.

```python
# Upload video first
video_file = genai.upload_file("product_demo.mp4")

# Wait for processing
import time
while video_file.state.name == "PROCESSING":
    time.sleep(5)
    video_file = genai.get_file(video_file.name)

# Frame-by-frame analysis
response = model.generate_content([
    """Analyze this product demo video. For each distinct screen or step:
    1. Describe what the user does
    2. Note any UI elements that appear
    3. Flag any usability issues
    4. Timestamp the action (approximate)

    Format as a numbered list, one entry per distinct action.""",
    video_file,
])

# Summary-level analysis
response = model.generate_content([
    """Watch this video and provide:
    - Overall summary (2-3 sentences)
    - Key takeaways (bullet points)
    - Production quality assessment
    - Recommended improvements""",
    video_file,
])
```

**Frame-by-frame vs. summary:**

| Approach | Prompt pattern | Best for |
|----------|---------------|----------|
| Frame-by-frame | "For each scene/step/screen..." | UI reviews, tutorial analysis, QA testing |
| Summary | "Watch the full video and summarize..." | Content review, meeting recordings, presentations |
| Timestamp-based | "At what point does X happen?" | Searching for specific moments |
| Comparative | Upload 2 videos + "Compare these..." | A/B testing video content |

### Code execution tool

Gemini can execute Python code directly during generation, which is useful for calculations, data analysis, and visualization:

```python
model = genai.GenerativeModel(
    'gemini-2.5-pro',
    tools=[types.Tool(code_execution=types.CodeExecution())]
)

response = model.generate_content(
    "Calculate the compound annual growth rate if revenue went from $2.3M in 2022 to $8.7M in 2025. Then plot a projection for the next 3 years."
)

# Response includes both the code that was executed and its output
for part in response.candidates[0].content.parts:
    if part.executable_code:
        print("Code:", part.executable_code.code)
    if part.code_execution_result:
        print("Result:", part.code_execution_result.output)
```

This eliminates the need to parse code from the response and run it yourself. The model writes code, runs it, sees the output, and incorporates results into its answer.

### Safety settings enum values

```python
from google.genai import types

safety_settings = [
    types.SafetySetting(
        category="HARM_CATEGORY_HARASSMENT",
        threshold="BLOCK_ONLY_HIGH"  # most permissive
    ),
    types.SafetySetting(
        category="HARM_CATEGORY_HATE_SPEECH",
        threshold="BLOCK_MEDIUM_AND_ABOVE"
    ),
    types.SafetySetting(
        category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold="BLOCK_LOW_AND_ABOVE"  # most restrictive
    ),
    types.SafetySetting(
        category="HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold="BLOCK_ONLY_HIGH"
    ),
    types.SafetySetting(
        category="HARM_CATEGORY_CIVIC_INTEGRITY",
        threshold="BLOCK_MEDIUM_AND_ABOVE"
    ),
]

response = model.generate_content(
    "...",
    safety_settings=safety_settings
)
```

**Threshold levels (from most to least restrictive):**

| Threshold | Behavior |
|-----------|----------|
| `BLOCK_LOW_AND_ABOVE` | Blocks low, medium, and high probability harmful content |
| `BLOCK_MEDIUM_AND_ABOVE` | Blocks medium and high (default for most categories) |
| `BLOCK_ONLY_HIGH` | Only blocks high probability harmful content |
| `BLOCK_NONE` | Disables safety filtering (requires allowlisting) |
| `OFF` | Safety filter is off |

If your application gets unexpected empty responses, check `response.candidates[0].finish_reason`. A value of `SAFETY` means the safety filter triggered. Adjust thresholds or rephrase the prompt.

### Gemini 2.0 Flash vs. Gemini 2.5 Pro

| Dimension | 2.0 Flash | 2.5 Pro |
|-----------|-----------|---------|
| Context window | 1M tokens | 2M tokens |
| Speed | Very fast | Moderate |
| Cost | Low | Higher |
| Reasoning | Good for simple-moderate | Superior for complex tasks |
| Multimodal | Full support | Full support |
| Code execution | Yes | Yes |
| Grounding | Yes | Yes |
| Best for | High-volume, low-latency tasks | Complex analysis, long documents |

**Prompting differences:** Flash responds better to concise, direct prompts. Pro handles elaborate multi-part instructions better. If a prompt works on Pro but not Flash, simplify the instructions and add more examples instead.

### Multimodal prompt structure

Image placement in the prompt matters for Gemini:

```python
# BETTER: instruction first, then image
response = model.generate_content([
    "Identify all text visible in this store receipt. Extract: store name, date, items with prices, total.",
    receipt_image
])

# WORSE: image first, then instruction
response = model.generate_content([
    receipt_image,
    "What's in this image?"
])
```

For multi-image prompts, interleave text labels with images:

```python
response = model.generate_content([
    "Compare these two versions of our landing page:",
    "Version A (current):",
    image_a,
    "Version B (proposed):",
    image_b,
    "Analyze: conversion-oriented layout, visual hierarchy, CTA placement, mobile readability."
])
```

## Template

```python
model = genai.GenerativeModel(
    'gemini-2.5-pro',
    system_instruction="{{role_and_behavior}}",
    tools=[...],  # grounding, code execution, or custom functions
    safety_settings=[...],
)

response = model.generate_content([
    "{{task_description}}",
    # {{media_attachments if any}},
    "Output format: {{expected_format}}",
    "Constraints: {{constraints}}",
])
```

## Tips

1. **Use context caching for repeated analysis** -- querying the same large document 5 times without caching costs 5x. With caching, queries 2-5 use cached tokens at a fraction of the cost.

2. **Grounding improves factuality** -- enable Google Search grounding for any task requiring current or verifiable information. The dynamic threshold lets you control how aggressively it searches.

3. **Code execution for calculations** -- instead of asking Gemini to calculate in its head, let it write and execute Python code. The results are always accurate.

4. **Label your images** -- "Version A:" before the first image and "Version B:" before the second dramatically improves comparison tasks.

5. **System instruction for consistency** -- unlike per-message instructions, the system instruction persists across all turns and is cached efficiently.

6. **Check finish_reason** -- if you get empty responses, the safety filter likely triggered. Check `finish_reason` before assuming the model failed.

## Common mistakes

1. **Not using grounding for factual tasks** -- without grounding, Gemini may generate plausible but outdated information, same as any LLM.

2. **Ignoring safety filter blocks** -- empty responses almost always mean a safety filter triggered. Adjust thresholds for your use case.

3. **Uploading raw video without trimming** -- compress and trim videos to relevant sections. A 2-hour video processes slowly and often misses the specific moment you care about.

4. **Setting cache TTL too short** -- if your analysis session lasts 2 hours, a 30-minute cache TTL means you pay for re-caching. Estimate your session length and add buffer.

5. **Using Pro for simple tasks** -- Flash handles classification, extraction, and simple generation at a fraction of the cost and latency. Reserve Pro for genuinely complex reasoning.

6. **Forgetting that context quality degrades at extreme lengths** -- 2M tokens is supported, but response quality is strongest within the first ~500K. Place the most important content early.
