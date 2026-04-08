---
title: Sales Battlecard Creator
category: business
tags: [sales, competitive-analysis, battlecard, objection-handling, positioning]
difficulty: intermediate
models: [claude, gpt-4, gemini]
---

# Sales Battlecard Creator

Create competitive sales battlecards that help reps win deals against specific
competitors. Covers positioning, feature comparison, objection handling,
win/loss patterns, and talk tracks — formatted for quick reference during
live sales conversations.

## When to Use

- A competitor keeps coming up in deals and reps need a playbook
- Launching into a market where established players already own the conversation
- Win rates against a specific competitor are dropping and you need to retool
- Onboarding new sales reps who need to get competitive fast

## The Technique

Provide details about your product, the competitor, the target market, and
your key differentiators. Include real data wherever possible — customer
feedback, win/loss notes, competitor pricing, and feature comparisons. The
model produces a structured battlecard covering positioning, objection
responses, landmine questions, and proof points.

The best battlecards are honest. If the competitor is better at something,
acknowledge it and provide a pivot.

## Template

```
Create a sales battlecard for {{your_product}} against {{competitor}}.

## Our Product
{{your_product}}
Core value proposition, ideal customer profile, and pricing model.

## Competitor
{{competitor}}
Product capabilities, pricing, target market, recent launches, positioning.

## Target Market
{{target_market}}
Industry, company size, buyer persona, and typical deal size.

## Key Differentiators
{{key_differentiators}}
The 3-5 real differences that change the buyer's decision.

## Output
Produce a battlecard with:
1. **Positioning summary** — two sentences on how we differ and why it
   matters to the buyer.
2. **Quick comparison table** — 8-10 capabilities buyers evaluate, rated
   honestly for both products.
3. **Where we win** — 3-4 strengths with proof points (quotes, benchmarks).
4. **Where they win** — 2-3 areas they are stronger, with a pivot for each.
5. **Objection handling** — top 5 objections with word-for-word responses.
6. **Landmine questions** — 3-5 questions reps should ask prospects early
   to highlight our advantages.
7. **Trap questions** — questions the competitor trains prospects to ask us.
8. **Win/loss patterns** — when we win and when we lose, for early
   qualification.
9. **Competitive talk track** — a 60-second pitch for when a prospect says
   "We're also looking at {{competitor}}."

Keep the entire battlecard under two pages.
```

## Examples

### CRM Platform vs. Established Incumbent

```
Positioning: "Unlike [Incumbent] which requires a dedicated admin team
and 6-month implementation, [Our Product] gives mid-market sales teams
a CRM they can set up in a week and actually want to use."

Where we win:
- Time to value: 7-day avg implementation vs. their 90-180 days.
  Proof: "We were live in 5 days. Our old CRM took 4 months." — VP Sales,
  Acme Corp (200 employees).
- Usability: 92% daily active usage vs. industry avg of 47%.
- Total cost of ownership: No implementation partner required. Their
  ecosystem averages $3-5 in services for every $1 in license fees.

Where they win (with pivots):
- Enterprise reporting: Their reporting suite is more mature. Pivot:
  "For the reports that matter — pipeline, forecast, activity — ours
  are stronger out of the box. Their advanced reports require a BI
  consultant to build."
- Brand recognition: Buyers feel safe choosing them. Pivot: "Ask their
  mid-market customers about their support experience. Enterprise
  vendors treat mid-market accounts as an afterthought."

Objection: "They have more integrations."
Response: "They list 500+ integrations. How many do you actually need?
We integrate with the 50 tools mid-market teams use every day, and
our integrations are native — no middleware, no Zapier tax."
```

## Tips

1. **Use real win/loss data** — Interview reps after wins and losses against
   this competitor. Generic battlecards get generic results.

2. **Write responses as dialogue** — "When they say X, you say Y" is more
   useful than paragraphs of talking points.

3. **Update quarterly at minimum** — A battlecard from six months ago may
   be harmful if it references capabilities they have since added.

4. **Test with reps before distributing** — Have 2-3 experienced reps review
   the card. They will add field-tested responses the model cannot generate.

5. **Include disqualification criteria** — State clearly when a prospect is
   a better fit for the competitor so reps stop wasting cycles.

## Common Mistakes

1. **Being dishonest about weaknesses** — Reps who deny obvious competitor
   strengths lose credibility. Acknowledge, then pivot.

2. **Listing features instead of outcomes** — "We have real-time sync"
   means nothing. "Reps see updated data instantly, so they stop calling
   leads that were already contacted" means everything.

3. **Writing for marketing, not sales** — Battlecards are not brochures.
   Skip brand language. Use the words buyers and reps actually say.

4. **No competitive talk track** — A comparison table without a script for
   when prospects say "We're also looking at X" is a map without directions.

5. **Making it too long** — If the battlecard exceeds two pages, reps will
   not read it. Cut anything that does not directly help win a deal.
