---
title: Git Commit Message Generator
category: development
tags: [git, commits, conventional-commits, changelog]
difficulty: beginner
models: [claude, gpt-4, gemini, mistral]
---

# Git Commit Message Generator

Generate clear, conventional commit messages from diffs or change descriptions
that follow project standards and make git history useful.

## When to Use

- Writing commit messages for complex or multi-file changes
- Enforcing Conventional Commits format across a team
- Generating changelogs from commit history
- Squashing multiple commits into a well-described single commit
- Reviewing whether a diff should be split into multiple commits

## The Technique

Provide the diff or a description of changes along with the project's commit
convention. The model analyzes what changed, why it matters, and produces a
message that future developers can understand without reading the diff.

## Template

```
Write a git commit message for the following changes.

## Diff
{{diff}}

## Project Context
{{project_context}}

## Convention
Follow the {{convention}} format (e.g., Conventional Commits, Angular,
kernel-style, project-specific).

Format:
<type>(scope): <subject>

<body>

<footer>

## Related Issues
{{issue_references}}
Include any related issue numbers, ticket IDs, or PR references
(e.g., "Closes #1847", "Relates to JIRA-452").

## Rules
1. Subject line: max 72 characters, imperative mood, no trailing period.
2. Body: explain WHAT changed and WHY, not HOW (the diff shows how).
3. Footer: reference related issues, tickets, or breaking changes.
4. If the diff contains unrelated changes, suggest splitting into
   separate commits and provide a message for each.
5. Choose the correct type: feat, fix, refactor, docs, test, chore,
   perf, ci, build, style.
6. Scope should be the module, component, or area affected.
```

## Examples

### Feature Addition

```
feat(auth): add OAuth2 PKCE flow for mobile clients

Implement the Proof Key for Code Exchange (PKCE) extension to the
existing OAuth2 authorization code flow. Mobile clients cannot safely
store client secrets, making PKCE necessary for security.

- Add code_verifier and code_challenge generation
- Update /authorize endpoint to accept code_challenge_method
- Add PKCE validation to /token endpoint
- Store code_challenge in auth session with 10-minute expiry

Closes #1847
```

### Bug Fix

```
fix(api): prevent duplicate webhook deliveries on retry

The retry logic was not checking delivery status before re-enqueuing,
causing customers to receive the same webhook payload 2-5 times during
transient network failures.

Add idempotency check using delivery_id before retry. Skip enqueue if
a successful delivery record exists within the retry window.

Fixes #2103
```

## Tips

1. **Include the full diff** — Partial diffs lead to vague messages. The
   model needs to see all changed files to choose the right scope and type.

2. **Specify your convention** — "Conventional Commits" and "kernel-style"
   produce very different messages. Be explicit about your project's standard.

3. **Provide issue numbers** — If the change relates to a ticket, include
   it in the prompt so the model adds it to the footer.

4. **Review the type carefully** — A change that fixes a bug AND adds a
   feature should typically be split. Ask the model to recommend splits.

5. **Use imperative mood** — "Add feature" not "Added feature" or "Adds
   feature". This matches git's own conventions (e.g., "Merge branch").

## Common Mistakes

1. **Describing the how, not the why** — "Change line 42 from X to Y" is
   useless. "Fix off-by-one error causing duplicate records" is valuable.

2. **Overly broad scope** — "refactor(app): update stuff" helps nobody.
   Be specific: "refactor(auth): extract token validation to middleware".

3. **Giant commits** — If the model suggests splitting the diff, listen.
   Atomic commits make bisecting, reverting, and reviewing far easier.

4. **Missing breaking change notices** — If the diff changes a public API,
   the footer must include `BREAKING CHANGE:` with migration instructions.

5. **Copy-pasting without review** — The model may miss subtle intent. A
   generated message is a draft — always review before committing.
