---
title: Job Description Generator
category: business
tags: [hiring, job-description, recruitment, hr, talent]
difficulty: beginner
models: [claude, gpt-4, gemini, mistral]
---

# Job Description Generator

Create clear, inclusive, and effective job descriptions that attract qualified
candidates and set accurate expectations for the role.

## When to Use

- Opening a new position and drafting the listing
- Rewriting existing job descriptions to improve candidate quality
- Ensuring job descriptions use inclusive language
- Standardizing job description format across departments
- Adapting internal role definitions for external job boards

## The Technique

A great job description sells the opportunity while being honest about the
expectations. It balances specificity (so the right candidates apply) with
openness (so diverse candidates are not discouraged by unnecessary requirements).
Structure it so candidates can self-qualify in under 60 seconds.

## Template

```
Write a job description for the following role.

## Role Details
Job title: {{job_title}}
Company: {{company}}
Department: {{department}}

## Responsibilities
Key responsibilities and day-to-day activities:
{{responsibilities}}

## Requirements
Must-have qualifications and nice-to-have qualifications:
{{requirements}}

## Benefits and Compensation
{{benefits}}

## Culture
Company culture and team environment:
{{culture}}

## Structure

### 1. Opening Hook (2-3 sentences)
Why would a top candidate want this role? Lead with impact, not a
company boilerplate. What will they build, change, or own?

### 2. About the Company (3-4 sentences)
What the company does, stage/size, and mission. Be specific: "Series B
fintech with 120 employees" not "fast-growing startup."

### 3. What You Will Do (5-7 bullet points)
Start each bullet with an action verb. Describe outcomes, not just tasks.
Order from most impactful to least.

### 4. What You Bring (split into two sections)
**Required** (4-5 bullets): Non-negotiable qualifications. Every item here
should be truly necessary — not aspirational.
**Nice to Have** (3-4 bullets): Bonus qualifications. Be honest about what
is actually preferred vs. required.

### 5. What We Offer (5-7 bullets)
Compensation range, benefits, perks, growth opportunities.
Include specifics: "$140K-$170K base" not "competitive salary."

### 6. How to Apply
Clear next steps. What to submit and what to expect.

## Rules
- Use "you" to address the candidate directly.
- Avoid gendered language (he/she). Use "you" and "they."
- Do not list more than 5 required qualifications. Research shows that
  women apply only when they meet 100% of requirements; men apply at 60%.
- Include a salary range. Listings with salary ranges get 30% more applicants.
- Avoid jargon: "synergy", "rockstar", "ninja", "fast-paced" without context.
- State location clearly: remote, hybrid (specify days), or on-site (city).
```

## Examples

### Senior Backend Engineer

```
## Senior Backend Engineer — Payments Platform

Build the payment infrastructure that processes $2B annually for 50,000
merchants. You will own the reliability and scalability of the systems
that move money for our customers every day.

### About Us
Acme Payments is a Series C fintech company (180 employees) building
the next generation of payment processing for mid-market e-commerce.
We process 4M transactions daily and are expanding to 8 new markets
this year.

### What You Will Do
- Design and build high-throughput payment processing services handling
  5,000+ transactions per second.
- Own the availability of critical payment pathways (current SLA: 99.99%).
- Lead the migration from monolith to event-driven microservices.
- Mentor 2-3 mid-level engineers on distributed systems best practices.
- Collaborate with product and compliance teams on new payment methods.

### What You Bring
**Required:**
- 5+ years building backend services in Go, Java, or Python.
- Experience with distributed systems at scale (>1,000 req/sec).
- Familiarity with payment systems, fintech, or regulated industries.
- Strong SQL skills and experience with PostgreSQL or similar.

**Nice to Have:**
- Experience with event streaming (Kafka, Kinesis).
- Knowledge of PCI-DSS compliance requirements.
- Previous startup or high-growth company experience.

### What We Offer
- Salary: $170K–$210K base + equity
- Health, dental, vision — 100% premium covered for employee + dependents
- Remote-first (US time zones) with optional NYC office access
- $3,000 annual learning budget
- 4 weeks Paid Time Off (PTO) + company-wide shutdown the last week of December

### How to Apply
Submit your resume and a brief note about a system you built that you
are proud of. We respond to every application within 5 business days.
```

## Tips

1. **Lead with impact, not requirements** — Top candidates want to know what
   they will accomplish, not just what you need from them.

2. **Keep requirements honest** — If you have successfully hired candidates
   without a CS degree, do not require one. List what actually predicts success.

3. **Include the salary range** — Transparency attracts more and better
   applicants. It also saves time by filtering for alignment early.

4. **Run an inclusivity check** — Tools like Textio or Gender Decoder can
   flag language that discourages diverse candidates from applying.

5. **Describe the team** — Candidates want to know who they will work with.
   "Join a team of 6 engineers" is more helpful than "join our engineering org."

## Common Mistakes

1. **Laundry list of requirements** — 15 required qualifications signal that
   you do not know what you actually need. Narrow it to 4-5 true requirements.

2. **"Competitive salary"** — This phrase tells candidates nothing and suggests
   you are not competitive. State the range or lose top candidates.

3. **Copy-paste company boilerplate** — "We are an equal opportunity employer"
   is legally necessary but insufficient. Show your commitment through specific
   actions and benefits.

4. **Vague responsibilities** — "Work on exciting projects" is meaningless.
   "Design the real-time fraud detection pipeline" is compelling.

5. **No growth path** — Candidates want to know where the role leads. Mention
   promotion timelines, mentorship programs, or skill development opportunities.
