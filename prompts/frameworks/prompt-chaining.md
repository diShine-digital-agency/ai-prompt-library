---
title: Prompt Chaining and Multi-Step Pipelines
category: frameworks
tags: [chaining, pipelines, multi-step, orchestration, error-handling, automation]
difficulty: advanced
models: [claude, gpt-4, gemini, mistral]
---

# Prompt chaining and multi-step pipelines

Prompt chaining breaks complex tasks into sequential steps where each prompt's output feeds into the next. This produces better results than single monolithic prompts because each step can be optimized independently, errors can be caught between steps, and different models can be used for different stages.

## When to use

- Tasks too complex for a single prompt (research reports, full applications, content pipelines)
- Workflows where intermediate results need validation
- Pipelines mixing different capabilities (extraction -> analysis -> generation)
- When you need auditability of each step
- Tasks where different models are optimal for different steps

**When NOT to use:**
- Simple single-turn tasks
- Real-time interactions where latency matters more than quality
- When the entire task fits comfortably in one prompt with good results

## The technique

### Basic output-as-input pattern

```
STEP 1 — EXTRACT
Prompt: "Extract all company names, revenue figures, and growth rates
from this earnings call transcript. Return as JSON."
Input: {{transcript}}
Output: structured_data.json

STEP 2 — ANALYZE
Prompt: "Analyze these financial metrics. For each company, calculate
year-over-year growth, identify outliers, and rank by performance."
Input: structured_data.json (from Step 1)
Output: analysis.json

STEP 3 — GENERATE
Prompt: "Write a 500-word market summary for investors based on this
analysis. Lead with the most significant finding. Use a professional
but accessible tone."
Input: analysis.json (from Step 2)
Output: market_summary.md
```

### Error handling between steps

Each step should validate its input before processing:

```python
def run_chain(transcript):
    # Step 1: Extract
    extraction = llm.generate(
        f"Extract companies and metrics from this transcript as JSON:\n{transcript}"
    )

    # Validate Step 1 output
    try:
        data = json.loads(extraction)
        if not data.get("companies") or len(data["companies"]) == 0:
            return {"error": "No companies extracted", "step": 1, "raw": extraction}
    except json.JSONDecodeError:
        # Retry with stricter prompt
        extraction = llm.generate(
            f"Extract companies and metrics. Return ONLY valid JSON, no other text.\n{transcript}",
            temperature=0
        )
        data = json.loads(extraction)

    # Step 2: Analyze
    analysis = llm.generate(
        f"Analyze these financial metrics:\n{json.dumps(data)}"
    )

    # Validate Step 2
    if "insufficient data" in analysis.lower():
        return {"error": "Insufficient data for analysis", "step": 2, "data": data}

    # Step 3: Generate
    summary = llm.generate(
        f"Write a market summary based on this analysis:\n{analysis}"
    )

    return {"summary": summary, "data": data, "analysis": analysis}
```

**Error handling strategies:**

| Strategy | When to use | Implementation |
|----------|------------|----------------|
| Retry with lower temperature | JSON parsing failures, format errors | Same prompt, temperature=0 |
| Retry with stricter prompt | Model ignoring format instructions | Add "ONLY output JSON" emphasis |
| Fallback to different model | Primary model fails consistently | Route to stronger model |
| Graceful degradation | Non-critical step fails | Skip step, note limitation in output |
| Human-in-the-loop | Critical step fails validation | Queue for manual review |

### Real-world pipeline: research -> outline -> draft -> edit

```python
# Full content creation pipeline

# STEP 1: Research (use a model with web access or RAG)
research_prompt = """Research the topic: "{{topic}}"

Gather:
- 5-8 key facts or statistics with sources
- 3 expert opinions or quotes
- 2-3 counter-arguments or nuances
- Current state of the field

Return as structured JSON:
{
  "facts": [{"claim": "...", "source": "...", "date": "..."}],
  "expert_views": [{"person": "...", "view": "...", "source": "..."}],
  "counter_arguments": ["..."],
  "current_state": "..."
}"""

# STEP 2: Outline (structured planning)
outline_prompt = """Based on this research, create a detailed article outline.

Research data:
{{research_output}}

Target: {{word_count}} words, {{audience}} audience

Create an outline with:
- Working title (compelling, SEO-friendly)
- Thesis statement (one sentence)
- H2 sections (5-7) with:
  - Key point for each section
  - Which research facts/quotes to use
  - Transition to next section
- Conclusion direction
- CTA"""

# STEP 3: Draft (creative generation, can use higher temperature)
draft_prompt = """Write a full article following this outline exactly.

Outline:
{{outline_output}}

Research data to incorporate:
{{research_output}}

Guidelines:
- Write in {{tone}} tone for {{audience}}
- Integrate research naturally (don't just list facts)
- Each section should flow into the next
- Open with a hook, not a definition
- {{word_count}} words target"""

# STEP 4: Edit (critical review, different model or lower temperature)
edit_prompt = """Edit this article for publication quality.

Draft:
{{draft_output}}

Edit checklist:
1. ACCURACY: verify all claims match the source research below
   Research: {{research_output}}
2. FLOW: do sections transition smoothly? Flag abrupt shifts.
3. ENGAGEMENT: is the opening compelling? Would you keep reading?
4. CONCISENESS: cut filler phrases, redundant sentences, weak modifiers
5. SEO: is the target keyword "{{keyword}}" in the title, first paragraph,
   and at least 2 H2 headers?
6. CTA: is there a clear call-to-action at the end?

Return the edited article with a summary of changes made."""
```

### Parallel chains

When steps are independent, run them in parallel to reduce latency:

```python
import asyncio

async def parallel_analysis(document):
    # These three analyses are independent -- run in parallel
    tasks = [
        llm.generate_async(f"Extract key financial metrics:\n{document}"),
        llm.generate_async(f"Identify legal risks and compliance issues:\n{document}"),
        llm.generate_async(f"Summarize competitive positioning:\n{document}"),
    ]
    financial, legal, competitive = await asyncio.gather(*tasks)

    # Synthesis step depends on all three -- runs after
    synthesis = await llm.generate_async(
        f"""Synthesize these three analyses into an executive brief:

        Financial: {financial}
        Legal: {legal}
        Competitive: {competitive}

        Focus on the intersections -- where do financial risks compound
        legal risks? Where does competitive position create financial opportunity?"""
    )
    return synthesis
```

### Chain with different models per step

```python
chain_config = {
    "extract": {"model": "gpt-4o-mini", "temperature": 0},     # cheap, accurate extraction
    "analyze": {"model": "claude-sonnet", "temperature": 0.3},  # strong reasoning
    "generate": {"model": "claude-sonnet", "temperature": 0.7}, # creative generation
    "review": {"model": "gpt-4o", "temperature": 0},            # independent review
}
```

This pattern optimizes cost while maintaining quality where it matters. Extraction does not need an expensive model. Analysis and generation do.

### Conditional branching

```python
# Route based on intermediate results
classification = llm.generate("Classify this support ticket: {{ticket}}")

if classification == "billing":
    response = billing_chain.run(ticket)
elif classification == "technical":
    response = technical_chain.run(ticket)
elif classification == "feature_request":
    response = feature_request_chain.run(ticket)
else:
    response = general_chain.run(ticket)
```

## Template

```
PIPELINE: {{pipeline_name}}

STEP 1 — {{step_1_name}}
Model: {{model}}
Temperature: {{temp}}
Input: {{source}}
Prompt: "{{prompt}}"
Validation: {{what_to_check}}
On failure: {{retry_strategy}}

STEP 2 — {{step_2_name}}
Model: {{model}}
Temperature: {{temp}}
Input: Step 1 output
Prompt: "{{prompt}}"
Validation: {{what_to_check}}
On failure: {{retry_strategy}}

...

OUTPUT: {{final_output_description}}
```

## Tips

1. **Validate between every step** -- the most common chain failure is garbage propagating from one step to the next. Check output format and content quality between steps.

2. **Use structured output for intermediate steps** -- JSON between steps is easier to validate and parse than free text. Save natural language for the final output.

3. **Log everything** -- capture the full input/output of every step. When the final output is wrong, you need to find which step broke.

4. **Different models for different steps** -- extraction with GPT-4o mini, analysis with Claude Sonnet, and review with GPT-4o is often better and cheaper than using one model for everything.

5. **Keep chains under 5 steps** -- each step adds latency, cost, and potential failure points. If your chain has 10 steps, look for steps that can be combined or parallelized.

6. **Test the chain end-to-end first, then optimize** -- get the pipeline working with a single model, then swap in cheaper models per step to find the quality/cost sweet spot.

## Common mistakes

1. **No error handling** -- a chain without validation between steps will silently produce garbage when an intermediate step fails.

2. **Passing too much context** -- each step should receive only the information it needs. Passing the entire conversation history to every step wastes tokens and confuses the model.

3. **Sequential when parallel is possible** -- if two steps do not depend on each other, run them in parallel. This can cut total latency in half.

4. **One model for everything** -- using Claude Opus for a classification step wastes money. Use the cheapest model that handles each step well.

5. **No fallback strategy** -- if a step fails, the entire chain fails. Design fallbacks: retry, use a different model, or gracefully degrade.
