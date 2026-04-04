---
title: Proposal Generator
category: business
tags: [proposals, sales, scoping, pricing, client-facing]
difficulty: intermediate
models: [claude, gpt-4, gemini]
---

# Proposal Generator

Generate structured business proposals with scope definition, pricing,
timelines, and terms tailored to client needs.

## When to Use

- Responding to RFPs and client requests
- Creating project scoping documents
- Pricing new client engagements
- Renewal and upsell proposals
- Partnership and collaboration proposals

## The Technique

A winning proposal demonstrates understanding of the client's problem,
presents a clear solution, and removes barriers to saying yes.

## Template

```
Create a professional proposal for:

Client: {{client_name}}
Industry: {{industry}}
Project: {{project_description}}
Budget indication: {{budget_range}} (if known)
Timeline expectation: {{timeline}}
Decision maker: {{decision_maker_role}}
Competitive situation: {{competing_against}}

Generate the following sections:

1. EXECUTIVE SUMMARY (1 page max)
- Client challenge in their language
- Proposed solution in one paragraph
- Key outcomes and metrics
- Investment summary
- Why us (2-3 differentiators)

2. UNDERSTANDING OF NEEDS
- Restate the client's situation
- Pain points and business impact
- Success criteria from the client's perspective
- Assumptions and dependencies

3. PROPOSED SOLUTION
- Approach and methodology
- Key deliverables with descriptions
- Technology or tools involved
- Team composition and roles

4. SCOPE DEFINITION (MoSCoW)
Must Have:
- {{deliverable}} — [description] — [effort estimate]

Should Have:
- {{deliverable}} — [description] — [effort estimate]

Could Have:
- {{deliverable}} — [description] — [effort estimate]

Won't Have (this phase):
- {{item}} — [why deferred]

5. TIMELINE AND MILESTONES
| Phase | Deliverables | Duration | Dependencies |
|-------|-------------|----------|--------------|
| Discovery | Requirements doc | 2 weeks | Client stakeholder access |
| Design | Wireframes, specs | 3 weeks | Phase 1 approval |
| Build | Working product | 6 weeks | Phase 2 approval |
| Launch | Deployed solution | 2 weeks | UAT completion |

6. INVESTMENT
| Item | Effort | Rate | Total |
|------|--------|------|-------|
| {{item}} | {{days}} MD | {{rate}} | {{total}} |

Subtotal: {{subtotal}}
Discount ({{pct}}%): -{{discount}}
Total investment: {{total}}

Payment terms: {{terms}}

7. TEAM AND QUALIFICATIONS
- Key team members with relevant experience
- Similar projects completed
- Client testimonials or case studies

8. TERMS AND NEXT STEPS
- Proposal validity period
- Contract terms overview
- Immediate next steps
- Contact information
```

## Examples

### Digital Marketing Proposal

```
Client: GreenTech Solutions
Project: Full digital marketing strategy and execution

EXECUTIVE SUMMARY:
GreenTech has strong product-market fit but limited digital visibility
in a competitive cleantech market. We propose a 6-month digital
marketing program focused on SEO, content marketing, and LinkedIn
lead generation to establish GreenTech as a thought leader and
generate 50+ qualified leads per month.

INVESTMENT:
Strategy & Planning: 5 MD @ EUR 800/MD = EUR 4,000
Content Production: 15 MD @ EUR 800/MD = EUR 12,000
SEO Implementation: 10 MD @ EUR 800/MD = EUR 8,000
LinkedIn Campaigns: 8 MD @ EUR 800/MD = EUR 6,400
Monthly Reporting: 4 MD @ EUR 800/MD = EUR 3,200

Subtotal: EUR 33,600
Early commitment discount (15%): -EUR 5,040
Total: EUR 28,560
```

## Tips

1. **Lead with the client, not yourself** — The first page should be about
   their problem, not your company history.

2. **Use MoSCoW for scope** — Categorizing deliverables as Must/Should/Could/Won't
   prevents scope creep and sets clear expectations.

3. **Include a discount with a deadline** — "15% discount if signed by [date]"
   creates urgency and shows willingness to partner.

4. **Show relevant case studies** — Include 2-3 examples of similar projects
   with measurable outcomes.

5. **Make the next step easy** — End with a specific next step: "Reply to
   schedule a 30-minute walkthrough of this proposal."

## Common Mistakes

1. **Too long** — Proposals over 15 pages rarely get read. Be concise and
   put details in appendices.

2. **Vague pricing** — "Starting from EUR 20,000" feels uncertain. Show exactly
   what they get for what price.

3. **No success metrics** — Without measurable outcomes, the client cannot
   evaluate ROI. Define what success looks like.

4. **Generic language** — Using the same proposal template without customization
   signals that you did not listen to the client's specific needs.

5. **Missing competitive positioning** — If the client is comparing options,
   address why your approach is better without naming competitors.
