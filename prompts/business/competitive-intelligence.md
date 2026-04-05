---
title: Competitive intelligence
category: business
tags: [competitive-analysis, market-research, strategy, swot, positioning]
difficulty: intermediate
models: [claude, gpt-4, gemini]
---

# Competitive intelligence

Prompts for systematic competitor analysis, market positioning, and strategic
intelligence gathering. These work best when you feed in real data — pricing
pages, product changelogs, job postings, press releases — rather than asking
the LLM to use its training data.

## When to use

- entering a new market and need to map the competitive landscape
- a competitor just made a move (new product, pricing change, acquisition)
- preparing for a strategy meeting or board presentation
- building a sales battlecard for the team
- evaluating whether to build, buy, or partner

## Template: comprehensive competitor profile

```
Build a competitive profile for {{competitor}} based on the following information.

**Their website/product page:**
{{product_info}}

**Their pricing page:**
{{pricing_info}}

**Recent news or press releases:**
{{news}}

**Their job postings (what they're hiring for tells you where they're investing):**
{{job_postings}}

**What their customers say (reviews, case studies, social mentions):**
{{customer_feedback}}

Analyze:
1. **positioning:** how do they describe themselves? what's their core value prop?
2. **target customer:** who are they selling to? (size, industry, role)
3. **pricing model:** how do they charge? where are the breakpoints?
4. **strengths:** what do they genuinely do better than alternatives?
5. **weaknesses:** where do customers complain? what's missing?
6. **trajectory:** based on job postings and product updates,
   where are they heading in the next 6-12 months?
7. **threat level:** how directly do they compete with us on {{our_focus}}?

Format as a one-page brief I could share with the team.
```

## Template: SWOT analysis

```
Generate a SWOT analysis for {{company}} in the {{market}} market.

**About the company:**
{{company_info}}

**Known competitors:**
{{competitors}}

**Market context:**
{{market_context}}

**Recent developments:**
{{developments}}

Structure the SWOT with:

**Strengths** (internal, current)
- list each strength with a brief "so what" — why does this matter competitively?

**Weaknesses** (internal, current)
- be honest. Generic weaknesses like "limited resources" aren't useful.
  What specifically are we worse at than competitors?

**Opportunities** (external, future)
- market shifts, competitor missteps, underserved segments, tech changes

**Threats** (external, future)
- not just "competition increases" — specific threats with specific mechanisms

For each item, rate the impact (high/medium/low) and urgency (act now / watch / monitor).

End with: "The 3 most important things to act on based on this SWOT are..."
```

## Template: Porter's five forces

```
Analyze the {{industry}} industry using Porter's five forces framework.

**Industry context:**
{{context}}

**Known players:**
{{players}}

For each force, rate it as high/medium/low and explain with specifics:

1. **Competitive rivalry:**
   how many direct competitors? is differentiation real or cosmetic?
   is the market growing (less rivalry) or stagnant (more rivalry)?

2. **Threat of new entrants:**
   what are the actual barriers to entry? (capital, technology, regulation,
   network effects, switching costs) how easy is it to start a competitor tomorrow?

3. **Bargaining power of suppliers:**
   who are the key suppliers/dependencies? how easy is it to switch?
   are there chokepoints?

4. **Bargaining power of buyers:**
   how concentrated are customers? what are their switching costs?
   how price-sensitive is the market?

5. **Threat of substitutes:**
   what could customers use instead of this entire category?
   not just competitor products — completely different approaches to the same problem.

End with: what does this analysis say about the industry's overall attractiveness
and where the real leverage points are?
```

## Template: sales battlecard

```
Create a sales battlecard for our team comparing {{our_product}} to {{competitor}}.

**Our product:**
{{our_info}}

**Their product:**
{{their_info}}

**Common deal scenarios where we compete:**
{{scenarios}}

Build the battlecard with:

1. **Quick comparison table:**
   feature | us | them — focus on the 8-10 things buyers actually ask about

2. **Where we win:**
   3-4 areas where we're genuinely stronger, with proof points
   (not just "better UX" — specific examples)

3. **Where they win:**
   2-3 areas where they're stronger, with our counter-argument for each
   (acknowledge it honestly, then pivot)

4. **Landmines to plant:**
   questions our reps should ask prospects that highlight our strengths
   ("have you asked them about X?")

5. **Objection handling:**
   top 5 objections prospects raise about us when they've talked to {{competitor}},
   with specific responses

6. **Trap questions to watch for:**
   questions the competitor's reps train prospects to ask us, and how to handle them

Keep it to one page. Sales reps won't read more than that.
```

## Template: market opportunity identification

```
Identify market opportunities in {{market}} based on this analysis.

**Current market landscape:**
{{landscape}}

**Underserved segments I've noticed:**
{{observations}}

**Our capabilities:**
{{capabilities}}

**Constraints:**
{{constraints}} (budget, timeline, team size, geography)

Analyze:
1. **Gap analysis:** where is demand unmet? look at customer complaints about
   existing solutions, features people build workarounds for, segments that
   incumbents ignore because they're too small for them (but not for us)

2. **Timing signals:** what's changing in the market that creates new openings?
   (regulation, technology shifts, demographic changes, platform changes)

3. **Feasibility filter:** given our constraints, which opportunities could we
   realistically pursue in the next {{timeframe}}?

4. **Recommended bets:** rank the top 3 opportunities by:
   - market size (even rough estimates)
   - our right to win (why us?)
   - time to revenue
   - risk level

For each recommended bet, outline a 90-day validation plan:
what would we need to learn, build, or test to know if this is real?
```

## Template: competitor move analysis

```
{{competitor}} just {{move}} (e.g., "launched a new product", "raised prices",
"acquired {{company}}", "hired a new CTO from {{origin}}").

**What we know:**
{{details}}

**Our current position relative to them:**
{{our_position}}

Analyze this move:
1. **What are they trying to achieve?** (the strategic intent, not just the surface action)
2. **What does this tell us about their priorities and direction?**
3. **Who does this affect most?** (which of their customers, which of our prospects)
4. **Should we respond? If so, how and when?**
5. **What should we NOT do?** (reactive moves that would be costly and ineffective)
6. **What should we watch for next?** (follow-on moves that would confirm their strategy)

Frame your analysis as a 5-minute briefing for leadership.
```

## Tips

- job postings are one of the best competitive intelligence sources — they reveal priorities
  and capabilities before they become public
- press releases tell you what a competitor wants the market to believe, not necessarily reality
- customer reviews (G2, Capterra, Reddit) tell you the truth about strengths and weaknesses
- don't just analyze competitors in isolation — map the relationships and ecosystem
- update competitive analysis quarterly at minimum — a 12-month-old battlecard is useless

## Common mistakes

- listing features without explaining why they matter to buyers
- being too charitable about competitors (you're not writing a balanced review)
- being too dismissive (underestimating competitors is worse than overestimating)
- focusing only on product comparison when distribution, pricing, and brand matter more
- using the LLM's training data as a source for competitor info — always feed in current data
