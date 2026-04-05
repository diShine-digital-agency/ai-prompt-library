---
title: Conversion Copywriting Templates
category: marketing
tags: [copywriting, conversion, aida, pas, landing-pages, ab-testing, cro]
difficulty: intermediate
models: [claude, gpt-4, gemini, mistral]
---

# Conversion copywriting templates

Frameworks and templates for writing copy that drives specific actions -- signups, purchases, demos, downloads. These are the workhorses of direct response marketing, adapted for LLM generation.

## When to use

- Landing page copy that needs to convert visitors
- Email sequences designed to drive action
- Ad copy for paid campaigns
- Product page descriptions
- Any marketing asset measured by conversion rate

## The technique

### AIDA framework (attention-interest-desire-action)

```
Write landing page copy using the AIDA framework.

Product: {{product}}
Target audience: {{audience}}
Primary action: {{cta}} (e.g., "Start free trial", "Book a demo")
Key differentiator: {{differentiator}}

ATTENTION (headline + subheadline):
- Headline must stop the scroll. Use a specific number, a provocative
  question, or a bold claim. Under 10 words.
- Subheadline explains what you do in one sentence. Under 20 words.

INTEREST (problem recognition):
- Describe the reader's current pain in 2-3 sentences.
- Use "you" language. Be specific about consequences.
- Do NOT mention your product yet.

DESIRE (solution + proof):
- Introduce your product as the solution. One sentence.
- 3 benefit bullets (outcome-focused, not feature-focused):
  "Save 5 hours/week on reporting" not "Automated reporting feature"
- Social proof: one specific result from a real (or realistic) customer.
- Handle the top objection preemptively.

ACTION (CTA):
- Clear, specific button text. "Start my free trial" not "Submit"
- Reduce friction: "No credit card required" / "Takes 2 minutes"
- Urgency if genuine: "Limited to first 100 signups" (only if true)

Generate 3 variations with different headline angles:
- Variant A: lead with the biggest benefit
- Variant B: lead with the biggest pain point
- Variant C: lead with social proof or a specific number
```

### PAS framework (problem-agitate-solve)

```
Write sales copy using the PAS framework.

Product: {{product}}
Audience: {{audience}}
Primary pain point: {{pain_point}}

PROBLEM (2-3 sentences):
State the problem clearly. Use the reader's own language -- how would
they describe this problem to a colleague?

AGITATE (3-4 sentences):
Make the problem feel urgent. What happens if they don't solve it?
What are the hidden costs? How does this problem compound over time?
Be emotionally honest, not manipulative.

SOLVE (3-4 sentences):
Present your product as the solution. Bridge directly from the
agitated problem. Show the transformation -- before vs. after.
Include one specific, quantified result.

CTA:
One clear next step with friction reducer.

TONE RULES:
- Conversational, not salesy
- Empathetic, not fear-mongering
- Specific, not vague
- Honest urgency only (no fake scarcity)
```

### Landing page copy generation

```
Create complete landing page copy.

Product: {{product}}
Target audience: {{audience}}
Conversion goal: {{goal}}
Competitive advantage: {{advantage}}

SECTIONS TO GENERATE:

1. HERO SECTION
- Headline (under 10 words, benefit-driven)
- Subheadline (one sentence explaining what + for whom)
- CTA button text
- Supporting image direction (what the hero image should show)

2. SOCIAL PROOF BAR
- 3-4 logo suggestions for "trusted by" section
- One pull quote from a customer (realistic for this audience)
- A metric: "X companies use [Product]" or "Y% improvement"

3. PROBLEM SECTION
- Section headline
- 3 pain points the audience experiences (specific, relatable)

4. SOLUTION SECTION
- Section headline
- 3 benefit blocks (icon + headline + 2-sentence description)
- Each benefit addresses one pain point from section 3

5. HOW IT WORKS
- 3-step process (simple enough to understand in 10 seconds)
- Step 1: action the user takes
- Step 2: what happens behind the scenes
- Step 3: the outcome they get

6. TESTIMONIAL SECTION
- 2 detailed testimonials (different personas from the target audience)
- Include name, title, company type, specific result

7. OBJECTION HANDLING
- 3 FAQs that address buying objections (not product questions)
- Price objection, time-to-value objection, switching cost objection

8. FINAL CTA
- Headline that reframes the value
- CTA button (same as hero)
- Risk reversal statement (guarantee, free trial, etc.)
```

### A/B test variant generation

```
Generate A/B test variants for this landing page element.

Current copy: "{{current_copy}}"
Element type: {{headline / CTA / subheadline / social proof}}
Current conversion rate: {{rate}}% (if known)
Audience: {{audience}}

Generate 4 test variants, each testing a different hypothesis:

Variant A — Different benefit angle:
Hypothesis: leading with {{alternative_benefit}} resonates more
Copy: [variant]

Variant B — Different emotional trigger:
Hypothesis: {{emotion}} is more motivating than {{current_emotion}}
Copy: [variant]

Variant C — Specificity change:
Hypothesis: more/fewer specific details will improve trust/clarity
Copy: [variant]

Variant D — Format change:
Hypothesis: {{question / statement / number / social proof}} format
will capture more attention
Copy: [variant]

For each variant, explain:
- What you changed and why
- What signal would indicate this variant wins
- Minimum sample size recommendation
```

### Ethical urgency and scarcity

```
Create urgency copy for {{offer}} without using fake scarcity.

ALLOWED urgency techniques:
- Genuine deadlines (sale ends on a real date)
- Real capacity limits (only 20 seats in a workshop)
- Seasonal relevance (tax deadline approaching)
- Opportunity cost framing ("every week without X costs Y")
- Social momentum ("847 teams signed up this month")

PROHIBITED:
- Fake countdown timers that reset
- "Only 3 left!" when stock is not actually limited
- "This offer won't last" without a real expiration
- Manufactured FOMO that does not reflect reality

Generate urgency copy using only truthful, defensible claims.
```

## Template

```
Write {{copy_type}} for:

Product: {{product}}
Audience: {{audience}}
Goal: {{conversion_action}}
Tone: {{tone}}
Framework: {{AIDA / PAS / custom}}

Requirements:
- {{specific_requirement_1}}
- {{specific_requirement_2}}
- Character/word limits: {{limits}}

Generate {{number}} variants with different angles.
For each, explain the strategic choice behind the angle.
```

## Tips

1. **Benefits over features, always** -- "saves 5 hours per week" converts better than "automated workflow engine." The feature enables the benefit; the benefit motivates the action.

2. **One CTA per page** -- every page element should drive toward one action. Multiple CTAs create decision paralysis and lower conversion rates.

3. **Test headlines first** -- the headline is responsible for 80% of the page's performance. Get the headline right before optimizing body copy.

4. **Specific numbers build trust** -- "47% faster" is more credible than "much faster." "2,847 teams" is more believable than "thousands of teams."

5. **Write the CTA before the body** -- knowing the exact action you want helps you structure every element to support that action.

6. **Match ad copy to landing page** -- if the ad says "save 5 hours/week," the landing page headline should echo that exact promise. Mismatches kill conversion.

## Common mistakes

1. **Feature-focused headlines** -- "AI-powered analytics platform" tells the reader nothing about what is in it for them. Lead with the outcome.

2. **No objection handling** -- if you do not address price, complexity, or switching costs on the page, the visitor leaves to think about it and never returns.

3. **Weak CTAs** -- "Submit" and "Learn more" are the lowest-converting CTA texts. "Start my free trial" and "Get my report" are specific and action-oriented.

4. **Fake urgency** -- countdown timers that reset on refresh destroy trust. If your urgency is not genuine, do not use it.

5. **Writing for yourself, not the reader** -- internal jargon, company-centric language ("we're proud to announce"), and technical details that do not serve the reader belong in internal docs, not on a landing page.
