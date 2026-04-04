---
title: Competitor Analysis Framework
category: marketing
tags: [competitive-intelligence, market-analysis, positioning, benchmarking, strategy]
difficulty: intermediate
models: [claude, gpt-4, gemini]
---

# Competitor Analysis Framework

Structured competitive analysis covering market positioning, product comparison,
pricing strategy, and strategic recommendations.

## When to Use

- Market entry and positioning decisions
- Product roadmap prioritization
- Pricing strategy development
- Sales enablement (battlecards)
- Investor presentations and market sizing

## The Technique

A thorough competitor analysis goes beyond feature comparison to examine
business model, go-to-market strategy, and sustainable competitive advantages.

## Template

```
Conduct a comprehensive competitor analysis.

Your company: {{company}}
Key competitors: {{competitors}} (list 3-5)
Market/Industry: {{market}}

Analyze the following dimensions:

1. COMPANY OVERVIEW (per competitor)
- Founded, HQ, employee count, funding/revenue
- Mission and positioning statement
- Target customer profile
- Key differentiator (their claim)

2. PRODUCT COMPARISON

| Feature | {{company}} | {{competitor_1}} | {{competitor_2}} | {{competitor_3}} |
|---------|-------------|------------------|------------------|------------------|
| Core feature 1 | | | | |
| Core feature 2 | | | | |
| Integration ecosystem | | | | |
| Mobile support | | | | |
| API availability | | | | |
| Customization | | | | |

3. PRICING ANALYSIS
- Pricing model (per seat / usage-based / flat / freemium)
- Price points by tier
- Free trial or freemium offering
- Enterprise pricing transparency
- Pricing trend (increasing / stable / decreasing)

4. GO-TO-MARKET STRATEGY
- Primary acquisition channels
- Content marketing approach
- Paid advertising presence
- Partnership and integration strategy
- Sales model (self-serve / inside sales / field sales)

5. STRENGTHS AND VULNERABILITIES
For each competitor:
- Top 3 strengths (what they do better than you)
- Top 3 vulnerabilities (where you can win)
- Customer complaints (from reviews, social media)

6. MARKET POSITIONING MAP
- Plot competitors on 2x2 matrix:
  X-axis: {{dimension_1}} (e.g., price: low to high)
  Y-axis: {{dimension_2}} (e.g., complexity: simple to enterprise)
- Identify white space opportunities

7. STRATEGIC RECOMMENDATIONS
- Where to compete head-on
- Where to differentiate
- Features to prioritize based on competitive gaps
- Positioning adjustments
- Pricing strategy recommendations
```

## Examples

### SaaS Analytics Market

```
Company: DataPulse (early-stage analytics platform)
Competitors: Mixpanel, Amplitude, PostHog
Market: Product analytics for SaaS companies

Excerpt:

POSITIONING MAP:
                    Enterprise
                        |
           Amplitude    |
                        |
    Simple ------------|------------ Complex
                        |
           PostHog      |    Mixpanel
                        |
                    Startup

White space: Simple + Enterprise (underserved)
Recommendation: Position DataPulse as "enterprise analytics
that any team can set up in 30 minutes"
```

## Tips

1. **Use real data** — Pair this prompt with web research tools to pull actual
   pricing, feature lists, and review data for accuracy.

2. **Update regularly** — Competitive landscapes change fast. Re-run this
   analysis quarterly at minimum.

3. **Include customer voice** — Review sites (G2, Capterra, Trustpilot) reveal
   real customer pain points that competitors have not solved.

4. **Create battlecards** — Distill the analysis into one-page battlecards
   for sales teams to use in competitive deals.

5. **Focus on actionable insights** — Every comparison point should lead to
   a strategic recommendation. Data without direction is noise.

## Common Mistakes

1. **Feature checklist mentality** — Listing features without analyzing
   why they matter to customers misses the strategic point.

2. **Ignoring indirect competitors** — "We have no competitors" is never true.
   Include substitute solutions and the status quo (spreadsheets, manual processes).

3. **Bias toward your own product** — Honest assessment of where competitors
   are genuinely better is more valuable than a flattering comparison.

4. **Stale data** — Using last year's pricing or feature set leads to incorrect
   strategic decisions. Verify data freshness.

5. **No so-what** — A comparison table without strategic recommendations
   is informational but not actionable.
