---
title: Executive Summary Generator
category: business
tags: [executive-summary, reports, briefing, stakeholders]
difficulty: beginner
models: [claude, gpt-4, gemini, mistral]
---

# Executive Summary Generator

Distill long documents, reports, or research into concise executive summaries
tailored to the decision-making needs of senior stakeholders.

## When to Use

- Condensing quarterly reports for board presentations
- Summarizing research papers for non-technical leadership
- Preparing briefing documents before executive meetings
- Distilling vendor proposals for procurement decisions
- Creating TL;DR sections for lengthy internal documents

## The Technique

An executive summary is not a shortened version of the document — it is a
decision-support tool. Lead with the conclusion, provide just enough evidence
to justify it, and close with the specific decisions or actions required. Busy
executives read the summary and skip the full document unless something demands
deeper investigation.

## Template

```
Create an executive summary from the following document.

## Source Document
{{document}}

## Audience
This summary is for {{audience}} (e.g., C-suite, board of directors, VP of
Engineering, department heads).

## Length
Maximum {{max_length}} words.

## Key Decisions Needed
The reader needs to make or understand these decisions:
{{key_decisions}}

## Structure
1. BOTTOM LINE (2-3 sentences)
   State the single most important takeaway. What does the reader need to
   know if they read nothing else?

2. KEY FINDINGS (3-5 bullet points)
   The evidence supporting the bottom line. Use specific numbers and dates.
   Each bullet: one fact, one implication.

3. RISKS AND CONCERNS (2-3 bullet points)
   What could go wrong? What assumptions are being made?

4. RECOMMENDATION
   What specific action should the reader take? Include timeline.

5. NEXT STEPS
   What happens after the decision is made? Who owns execution?

## Rules
- Lead with conclusions, not background.
- Use numbers over adjectives: "Revenue grew 23%" not "Revenue grew significantly."
- Do not introduce information not present in the source document.
- Flag any gaps in the source data that affect the recommendation.
- Write at a level that requires no domain expertise to understand.
```

## Examples

### Quarterly Business Review

```
BOTTOM LINE:
Q3 revenue exceeded target by 8%, but customer acquisition cost increased
34% quarter-over-quarter, making current growth unsustainable beyond Q1
next year without channel diversification.

KEY FINDINGS:
- Revenue: $4.2M actual vs. $3.9M target (+8%). Growth driven by enterprise
  segment (42% of new ARR).
- CAC: Increased from $340 to $456 per customer. Paid search costs rose 28%
  due to competitor bidding.
- Churn: Reduced from 4.1% to 3.2% after onboarding improvements launched
  in August.
- Pipeline: Q4 pipeline is $6.1M, 1.5x target coverage. 60% is enterprise.

RISKS:
- Paid search dependency: 71% of leads come from Google Ads. A 20% budget
  cut would reduce lead volume by an estimated 40%.
- Enterprise sales cycle: Average 87 days. Q4 pipeline may not close until Q1.

RECOMMENDATION:
Approve $200K budget reallocation from paid search to content marketing and
partnerships. Target: reduce paid search dependency to 50% of leads by Q2.

NEXT STEPS:
- Marketing to present channel diversification plan by October 15.
- Finance to model CAC scenarios at 50%, 60%, and 70% paid search mix.
```

## Tips

1. **Start with the decision, not the data** — Executives do not read
   sequentially. Put the recommendation in the first paragraph.

2. **One page maximum** — If it exceeds one page, it is not an executive
   summary. Cut ruthlessly. Every sentence must earn its place.

3. **Quantify everything** — "Customer satisfaction improved" is meaningless.
   "NPS increased from 32 to 47" is actionable.

4. **Name the risks** — Executives distrust summaries that present only
   good news. Acknowledging risks builds credibility and prepares for questions.

5. **Specify the ask** — End with exactly what you need from the reader:
   approval, budget, headcount, a decision by a date.

## Common Mistakes

1. **Burying the lead** — Starting with methodology or background instead of
   the conclusion. Executives will stop reading before they reach your point.

2. **Including everything** — A summary that covers every detail is just a
   shorter version of the original. Prioritize what affects the decision.

3. **Vague recommendations** — "We should consider improving our marketing"
   is not actionable. "Reallocate $200K to content marketing by Q2" is.

4. **No audience awareness** — A summary for the CFO needs different emphasis
   than one for the CTO. Tailor the metrics and framing to the reader.

5. **Editorializing** — "The team did an amazing job" does not belong in an
   executive summary. Stick to facts, evidence, and recommendations.
