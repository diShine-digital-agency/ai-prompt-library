---
title: Meeting Summary Generator
category: business
tags: [meetings, notes, action-items, follow-up, minutes]
difficulty: beginner
models: [claude, gpt-4, gemini, mistral]
---

# Meeting Summary Generator

Transform meeting transcripts or notes into structured summaries with
decisions, action items, and follow-up tracking.

## When to Use

- Post-meeting documentation and distribution
- Executive briefings from lengthy meetings
- Tracking decisions and commitments across projects
- Asynchronous team updates for absent members
- Compliance and audit trail documentation

## The Technique

A good meeting summary captures decisions and actions, not just discussion.
It should be usable by someone who was not in the meeting.

## Template

```
Summarize the following meeting content:

Meeting: {{meeting_title}}
Date: {{date}}
Attendees: {{attendee_list}}
Duration: {{duration}}

Input: {{transcript_or_notes}}

Generate the following structure:

1. EXECUTIVE SUMMARY (3-5 bullet points)
What would someone need to know in 30 seconds?
- Key topic discussed
- Most important decision made
- Critical deadline or milestone mentioned
- Any unresolved issue requiring follow-up

2. DECISIONS MADE
| # | Decision | Rationale | Owner | Effective Date |
|---|----------|-----------|-------|---------------|

3. ACTION ITEMS
| # | Action | Owner | Deadline | Priority | Status |
|---|--------|-------|----------|----------|--------|
| 1 | {{action}} | {{person}} | {{date}} | High/Med/Low | Open |

4. DISCUSSION TOPICS
For each major topic discussed:
- Topic: [name]
- Summary: [2-3 sentence summary of the discussion]
- Key points raised: [bullet list]
- Open questions: [unresolved items]

5. NEXT STEPS
- Next meeting: {{date_and_time}}
- Pre-work required: {{preparation_items}}
- Documents to share: {{deliverables}}

6. PARKING LOT
Items mentioned but deferred for future discussion:
- {{item_1}}
- {{item_2}}

Important guidelines:
- Only include information explicitly stated in the transcript
- Do not infer intent or add context not present in the source
- Flag any ambiguous commitments: "[unclear: did X commit to this?]"
- Attribute statements to specific people when relevant
```

## Examples

### Product Planning Meeting

```
Meeting: Q2 Product Roadmap Review
Date: April 2, 2026
Attendees: Sarah (PM), Mike (Eng Lead), Lisa (Design), Tom (CEO)

EXECUTIVE SUMMARY:
- Team aligned on prioritizing mobile app redesign for Q2
- Decision to delay API v3 launch to Q3 due to resource constraints
- Critical hire needed: Senior mobile developer by end of April
- Beta launch target: June 15, 2026

DECISIONS:
| 1 | Prioritize mobile redesign over API v3 | 60% of support tickets are mobile UX issues | Sarah | Immediately |
| 2 | Hire senior mobile dev | Current team lacks iOS expertise | Mike | April 30 |
| 3 | Beta launch on June 15 | Allows 4 weeks of testing before Q3 | Sarah | June 15 |

ACTION ITEMS:
| 1 | Draft mobile redesign spec | Sarah | April 9 | High | Open |
| 2 | Post job listing for mobile dev | Mike | April 5 | High | Open |
| 3 | Prepare API v3 delay communication for customers | Tom | April 7 | Med | Open |
| 4 | Share competitive mobile app analysis | Lisa | April 8 | Med | Open |
```

## Tips

1. **Provide raw transcript** — The more detailed the input, the more accurate
   the summary. Even rough notes are better than memory-based summaries.

2. **Specify the audience** — A summary for the team differs from one for
   executives. Executives need decisions and impact; teams need action items.

3. **Distinguish decisions from discussions** — Not everything discussed is
   decided. Explicitly separate what was agreed from what was explored.

4. **Track action items rigorously** — Every action needs an owner and deadline.
   "We should look into that" is not an action item.

5. **Send within 24 hours** — Meeting summaries lose value quickly. Same-day
   distribution ensures accuracy and accountability.

## Common Mistakes

1. **Transcribing, not summarizing** — A 20-page meeting transcript condensed
   to 15 pages is not a summary. Focus on outcomes, not process.

2. **Missing owners** — "The team will investigate" assigns responsibility to
   nobody. Name a specific person for every action item.

3. **No deadlines** — Action items without deadlines do not get done. If no
   deadline was set in the meeting, flag it for follow-up.

4. **Adding interpretation** — "Sarah seemed frustrated" or "Tom probably meant"
   introduces bias. Stick to what was explicitly said.

5. **Forgetting the parking lot** — Ideas mentioned but deferred get lost
   without a parking lot section. Capture them for future reference.
