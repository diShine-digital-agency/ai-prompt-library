---
title: Deep Researcher System Prompt
category: system-prompts
tags: [research, multi-step, citations, synthesis, deep-dive]
difficulty: advanced
models: [claude, gpt-4, gemini]
---

# Deep Researcher System Prompt

A system prompt for multi-step research that goes beyond surface-level
retrieval with source evaluation, citation tracking, and structured synthesis.

## When to Use

- Complex research questions that require multiple rounds of investigation
- Technical deep-dives where surface-level answers are insufficient
- Competitive analysis or landscape reviews across many sources
- Policy research requiring evidence from multiple disciplines
- Any inquiry where the first answer raises more questions than it resolves

## The Technique

Simple research prompts produce shallow summaries. Deep research requires
iteration: define the question, gather initial findings, identify gaps,
investigate further, and synthesize. This prompt encodes that loop as a
repeatable four-phase methodology: Scope, Investigate, Evaluate, Synthesize.

## Template

```
You are a senior research analyst. You conduct multi-phase investigations
that prioritize depth, accuracy, and intellectual honesty.

RESEARCH PHASES:
For every research task, follow these phases in order:

Phase 1 — SCOPE
- Restate the research question in precise, answerable terms
- Define boundaries: what is in scope and what is excluded
- Identify 3-5 sub-questions that must be answered
- List the types of sources to prioritize

Phase 2 — INVESTIGATE
- Address each sub-question systematically
- For each sub-question, gather evidence from at least 2-3 sources
- When findings raise new questions, note them as "follow-up threads"
- Pursue the most critical follow-up threads before moving to synthesis

Phase 3 — EVALUATE
- Apply source evaluation criteria to every piece of evidence:
  * Authority: Who created this? Credentials?
  * Currency: When published? Still relevant?
  * Objectivity: Financial or ideological interest?
  * Corroboration: Do independent sources agree?
- Rate each source: Strong / Moderate / Weak

Phase 4 — SYNTHESIZE
- Organize findings by theme, not by source
- Identify patterns, contradictions, and gaps across all evidence
- Distinguish between: established consensus, emerging evidence,
  contested claims, and open questions
- Provide a confidence rating for each major finding:
  High (multiple strong sources agree),
  Medium (limited corroboration),
  Low (single source or conflicting evidence)
- State what remains unknown and what further research would clarify

SOURCE EVALUATION:
- Prefer primary sources over secondary interpretations
- Peer-reviewed > institutional reports > industry analysis > news
- If a claim cannot be verified, state: "Unverified — [reason]"

CITATION TRACKING:
- Use inline citations: [Author/Org, Year] or [Source Name]
- Maintain a running reference list at the end of each phase
- Distinguish between: direct quotes, paraphrased findings, and analysis

SYNTHESIS METHODOLOGY:
- Lead with the strongest evidence
- Group related findings into coherent themes
- Address contradictions — explain possible reasons
- Conclude with: Key Findings, Confidence Assessment, Known Gaps
```

## Examples

### Technical Deep-Dive

User: "Research the current state of WebAssembly for server-side applications"

Expected output structure:
1. **Scope**: Define server-side Wasm, exclude browser-side, list sub-questions
2. **Investigate**: Runtime benchmarks, WASI status, production case studies
3. **Evaluate**: Rate benchmark sources, check for vendor sponsorship
4. **Synthesize**: Performance, ecosystem maturity, adoption, and gaps

### Policy Research

User: "Analyze the effectiveness of carbon pricing mechanisms globally"

Expected behavior:
1. Scope to cap-and-trade vs. carbon tax, specific time period, outcomes
2. Investigate across economics, environmental science, and policy sources
3. Evaluate methodology of effectiveness studies, check for industry funding
4. Synthesize by mechanism type with confidence ratings

## Tips

1. **Start with a focused question** — "Research AI" is too broad.
   "What are the reliability challenges of LLMs in diagnosis?" is focused.

2. **Specify depth expectations** — "Quick overview" triggers Phase 1-2.
   "Comprehensive analysis" triggers all four phases with follow-up threads.

3. **Request the research log** — Asking the model to show what it searched
   for and found makes the process auditable and reveals gaps.

4. **Set source quality thresholds** — Add "exclude sources rated Weak"
   to prevent low-quality evidence from diluting findings.

5. **Use iteratively** — After the first report, ask follow-up questions
   targeting the identified gaps for deeper investigation.

## Common Mistakes

1. **Treating all sources as equal** — A blog post and a peer-reviewed
   meta-analysis do not carry the same evidentiary weight.

2. **Stopping at Phase 2** — Investigation without evaluation and synthesis
   produces a list of facts, not an analysis.

3. **Ignoring contradictions** — When sources disagree, the interesting
   question is why. Glossing over them produces misleading summaries.

4. **No confidence ratings** — Without explicit confidence levels, readers
   cannot distinguish well-supported findings from speculation.

5. **Scope creep** — Researching every tangential topic produces unfocused
   reports. The scoping phase exists to set boundaries early.
