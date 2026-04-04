---
title: Email Campaign Generator
category: marketing
tags: [email-marketing, campaigns, copywriting, conversion, nurture]
difficulty: intermediate
models: [claude, gpt-4, gemini, mistral]
---

# Email Campaign Generator

Create high-converting email campaigns with subject lines, preview text,
body copy, and CTAs tailored to specific products, audiences, and goals.

## When to Use

- Product launch email sequences
- Nurture campaigns for lead warming
- Re-engagement campaigns for dormant users
- Promotional and seasonal campaigns
- Onboarding email sequences

## The Technique

Effective email campaigns combine psychological triggers, clear structure,
and strategic sequencing to move recipients toward the desired action.

## Template

```
Create an email campaign with the following specifications:

Product/Service: {{product}}
Target audience: {{audience}}
Campaign goal: {{goal}} (awareness / consideration / conversion / retention)
Number of emails: {{count}} (typically 3-7 for a sequence)
Sending cadence: {{frequency}} (daily / every 2-3 days / weekly)

For EACH email in the sequence, provide:

1. EMAIL METADATA
- Subject line (under 50 characters, A/B variant included)
- Preview text (under 90 characters)
- Send timing: Day X of sequence
- Segment: {{audience_segment}}

2. EMAIL BODY
- Opening hook (personalized, 1-2 sentences)
- Value proposition (what's in it for them)
- Supporting content (proof points, testimonials, data)
- Single CTA (one clear action, button text specified)
- P.S. line (optional secondary hook)

3. DESIGN NOTES
- Recommended layout (text-only / hero image / multi-column)
- Key visual elements
- Mobile optimization notes

4. SEQUENCE LOGIC
- Purpose of this email in the overall sequence
- Trigger conditions (time-based / behavior-based)
- What happens if they click vs. don't click

Campaign-wide guidelines:
- Tone: {{tone}}
- From name: {{sender_name}}
- Unsubscribe compliance: Include unsubscribe link
- Personalization fields: {{available_merge_tags}}
```

## Examples

### SaaS Product Launch

```
Product: TeamFlow — AI-powered project management tool
Audience: Marketing managers at mid-size companies (50-500 employees)
Goal: Free trial signups
Emails: 5-email sequence

Email 1: Announcement
Subject A: "Your team meetings just got 3x shorter"
Subject B: "We built what your PM tool is missing"
Preview: "See how TeamFlow uses AI to eliminate status meetings"

Body:
Hi {{first_name}},

What if your project updates wrote themselves?

TeamFlow uses AI to analyze your team's work and generate real-time
status reports — so you can cancel half your weekly meetings.

[CTA: Start your free trial]

P.S. No credit card required. Set up in under 5 minutes.
```

## Tips

1. **Write subject lines last** — Create the email body first, then craft
   subject lines that tease the most compelling element.

2. **One CTA per email** — Multiple CTAs dilute click-through rates. Choose
   the single most important action for each email.

3. **Test send timing** — Tuesday through Thursday, 9-11 AM local time
   typically performs best for B2B. Test for your specific audience.

4. **Personalize beyond first name** — Use company name, industry, past
   behavior, or purchase history for deeper personalization.

5. **Include plain-text versions** — Some email clients and spam filters
   prefer plain text. Always provide a text alternative.

6. **Design for mobile first** — Over 60% of emails are read on mobile.
   Single-column layouts with large CTAs perform best.

## Common Mistakes

1. **Too many CTAs** — "Read our blog, follow us on social, and buy now"
   in one email means none of them get clicked.

2. **No sequence logic** — Sending the same type of email 5 times in a row
   bores recipients. Each email should serve a different purpose.

3. **Ignoring the preview text** — The preview text is prime real estate.
   Leaving it blank wastes the second-most-visible text after the subject.

4. **Feature-focused copy** — "Our tool has 47 features" is less compelling
   than "Save 5 hours per week on project updates."

5. **No segmentation** — Sending the same campaign to your entire list ignores
   differences in buyer stage, industry, and engagement level.
