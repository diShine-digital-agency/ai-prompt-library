---
title: Gemini Prompting Best Practices
category: model-specific
tags: [google, gemini, multimodal, grounding, safety-settings]
difficulty: intermediate
models: [gemini, gemini-pro, gemini-ultra]
---

# Gemini Prompting Best Practices

Google's Gemini models excel at multimodal tasks, grounded responses using Google
Search, and handling diverse input types. This guide covers Gemini-specific features
and optimization techniques.

## When to Use

- Multimodal tasks combining text, images, audio, and video
- Tasks requiring grounded, up-to-date information via Google Search
- Long-context processing (up to 1M tokens with Gemini 1.5 Pro)
- Code generation and analysis across multiple languages
- Tasks requiring safety-tuned outputs

## The Technique

### System Instructions

Gemini uses system instructions to set persistent behavior:

```
System instruction:
You are an expert travel planner specializing in sustainable tourism.
Always suggest eco-friendly options first. Provide estimated carbon
footprints for transportation recommendations. Use metric units.
Format itineraries as day-by-day tables.
```

### Multimodal Prompting

Gemini natively handles mixed-media inputs:

```python
model = genai.GenerativeModel('gemini-1.5-pro')

response = model.generate_content([
    "Compare these two product designs. Analyze:",
    "1. Visual hierarchy and layout",
    "2. Color usage and accessibility",
    "3. Typography and readability",
    "4. Which design better serves the target audience (B2B SaaS)?",
    image_1,  # PIL Image or file path
    image_2,
])
```

For video analysis:
```python
video_file = genai.upload_file("presentation.mp4")
response = model.generate_content([
    "Analyze this presentation video. Provide:",
    "- Summary of each slide's key points",
    "- Speaker's presentation style assessment",
    "- Suggested improvements for clarity",
    video_file,
])
```

### Grounding with Google Search

Enable real-time information retrieval:

```python
model = genai.GenerativeModel(
    'gemini-1.5-pro',
    tools=[genai.Tool(google_search_retrieval=genai.GoogleSearchRetrieval())]
)

response = model.generate_content(
    "What are the latest developments in quantum computing this month?"
)
# Response includes grounding citations
```

### Safety Settings

Configure content filtering thresholds:

```python
safety_settings = {
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
}
```

### Context Caching

For repeated queries against the same large document:

```python
cache = genai.caching.CachedContent.create(
    model='gemini-1.5-pro',
    display_name='legal_docs_cache',
    system_instruction="You are a legal document analyst.",
    contents=[large_document],
    ttl=datetime.timedelta(hours=1),
)

model = genai.GenerativeModel.from_cached_content(cache)
# Multiple queries against same cached content at reduced cost
```

## Template

```
System instruction:
{{role_and_behavior}}

User prompt:
{{task_description}}

{{#if has_media}}
[Attached: {{media_description}}]
{{/if}}

Please provide your response in the following format:
{{output_format}}

Important constraints:
- {{constraint_1}}
- {{constraint_2}}
```

## Examples

### Document Analysis with Images

```
I'm uploading a scanned invoice. Please extract:
1. Vendor name and address
2. Invoice number and date
3. Line items (description, quantity, unit price, total)
4. Tax amount and grand total
5. Payment terms

Return as structured JSON.

[Attached: invoice_scan.jpg]
```

### Research with Grounding

```
System instruction: You are a market research analyst. Always ground
claims with sources. Distinguish between verified data and estimates.
Use tables for comparative data.

Prompt: Compare the top 5 cloud computing providers by:
- Market share (latest available data)
- Revenue growth rate
- Key differentiators
- Enterprise pricing tiers

Use Google Search to find the most recent data. Cite all sources.
```

### Long Context Code Review

```
System instruction: You are a senior software architect reviewing
a complete codebase. Focus on architecture patterns, potential
scalability issues, and security vulnerabilities.

[Upload entire repository as text - leveraging 1M token context]

Questions:
1. What architectural pattern does this codebase follow?
2. Identify the top 3 scalability bottlenecks
3. List all hardcoded credentials or API keys
4. Suggest refactoring priorities
```

## Tips

1. **Leverage multimodal natively** — Gemini processes images, audio, and video
   as first-class inputs. No need to describe media in text.

2. **Use context caching for cost savings** — If querying the same large document
   repeatedly, caching reduces costs by up to 75%.

3. **Grounding improves factuality** — Enable Google Search grounding for any
   task requiring current or verifiable information.

4. **Specify output format explicitly** — Gemini follows format instructions well
   but benefits from clear examples of desired structure.

5. **Use system instructions for consistency** — Unlike per-message instructions,
   system instructions persist across the entire conversation.

6. **Token limit awareness** — With 1M token context, response quality
   can degrade when context exceeds roughly 500K tokens. Focus relevant content.

## Common Mistakes

1. **Not using grounding for factual tasks** — Without grounding, Gemini may
   generate plausible but outdated information.

2. **Ignoring safety filter blocks** — If your application gets empty responses,
   check safety ratings. Adjust thresholds if appropriate for your use case.

3. **Uploading unnecessarily large media** — Compress images and trim videos to
   relevant sections. Smaller files process faster and more accurately.

4. **Not specifying media context** — "Analyze this image" is vague. Always state
   what to look for: "Identify all text in this screenshot and correct any typos."

5. **Forgetting cache TTL** — Cached content expires. Set appropriate TTLs and
   handle cache miss scenarios in your application.
