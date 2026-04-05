---
title: Debugging with LLMs
category: development
tags: [debugging, troubleshooting, stack-traces, performance, bugs]
difficulty: intermediate
models: [claude, gpt-4, gemini, llama]
---

# Debugging with LLMs

Using language models as a structured debugging partner — not just pasting
errors and hoping, but systematically narrowing down root causes.

## When to use

- You've been staring at a bug for 20 minutes and aren't making progress
- Stack traces that reference unfamiliar libraries or frameworks
- Performance issues where the bottleneck isn't obvious
- Reproducing intermittent failures
- Understanding legacy code behavior before touching it

## The key insight

LLMs are most useful for debugging when you give them structured context
rather than dumping raw logs. The difference between "help me fix this error"
and a well-structured debugging prompt is usually the difference between
a generic answer and an actual fix.

## Template: systematic bug isolation

```
I'm debugging a {{bug_type}} in a {{language}} {{framework}} application.

**What should happen:**
{{expected_behavior}}

**What actually happens:**
{{actual_behavior}}

**When it started:**
{{when_started}} (e.g., after a deploy, after upgrading a dependency, intermittently)

**What I've already tried:**
{{already_tried}}

**Relevant code:**
```{{language}}
{{code_snippet}}
```

**Error output (if any):**
```
{{error_output}}
```

**Environment:**
- {{language}} version: {{version}}
- OS: {{os}}
- relevant dependencies: {{deps}}

Walk me through a systematic diagnosis. For each hypothesis:
1. state what you think might be wrong
2. explain why this could cause the symptoms
3. tell me exactly what to check or run to confirm/rule it out
4. only move to the next hypothesis after we've addressed this one
```

## Template: stack trace analysis

```
Analyze this stack trace and explain what's happening at each level.
Focus on identifying the root cause vs symptoms.

```
{{stack_trace}}
```

For your analysis:
1. identify which frame is most likely the actual source of the problem
   (not just where it surfaced)
2. explain what each relevant frame is doing
3. suggest the most likely root cause
4. if this is a known pattern (e.g., null pointer from uninitialized state,
   race condition, circular dependency), name it specifically
5. give me the exact code change or check to fix it
```

## Template: performance profiling

```
I have a performance problem in my {{language}} application.

**The symptom:**
{{symptom}} (e.g., "API endpoint takes 3s instead of 200ms",
"memory grows to 2GB over 4 hours", "CPU spikes to 100% every 5 minutes")

**Profiling data:**
```
{{profiling_output}}
```

**Architecture context:**
{{architecture}} (e.g., "Express API → PostgreSQL, Redis cache, 3 microservices")

Analyze this data and:
1. identify the top 3 most likely bottlenecks, ranked by probability
2. for each one, explain the mechanism (why does this cause slowness?)
3. suggest a specific measurement I can do to confirm each one
4. for the most likely bottleneck, give me a concrete fix with code
5. estimate the expected improvement from each fix
```

## Template: memory leak detection

```
I suspect a memory leak in my {{language}} application.

**Evidence:**
- memory usage pattern: {{pattern}} (e.g., "grows 50MB/hour under load")
- heap snapshots or memory profiles: {{snapshots}}
- when it started: {{when}}
- what changed around that time: {{changes}}

**Code areas I suspect:**
```{{language}}
{{suspected_code}}
```

Analyze for common leak patterns:
1. event listeners that aren't removed
2. closures capturing large objects
3. caches without eviction policies
4. circular references preventing garbage collection
5. global state accumulation
6. connection pools that grow but don't shrink
7. timers/intervals that aren't cleared

For each pattern you find, show me exactly where in my code it happens
and what the fix looks like.
```

## Template: rubber duck debugging (structured)

This works surprisingly well. Instead of explaining to a rubber duck,
you explain to the LLM, which can actually ask useful follow-up questions.

```
I need to think through a problem out loud. Act as my debugging partner.

**The system:** {{system_description}}

**The bug:** {{bug_description}}

**My current theory:** {{theory}}

Don't just agree with my theory. Challenge it:
- what assumptions am I making that might be wrong?
- what other explanations fit the same symptoms?
- what's the simplest experiment to distinguish between theories?
- am I looking at the right layer of the stack?

Ask me clarifying questions if my description has gaps.
```

## Template: log analysis

```
Analyze these application logs and identify anomalies, errors, and patterns.

```
{{log_output}}
```

I'm looking for:
1. any errors or warnings, grouped by type with frequency counts
2. timing anomalies (requests that took unusually long)
3. patterns that precede failures (what happens in the 10-30 seconds before each error?)
4. correlations between different log entries that suggest a common root cause
5. anything that looks like it's working but shouldn't be (silent failures)

Present your findings as a timeline: what happened, in what order,
and what the causal chain looks like.
```

## Template: reproducing intermittent failures

```
I have an intermittent bug that I can't reliably reproduce.

**The failure:**
{{failure_description}}

**Frequency:** {{frequency}} (e.g., "about 1 in 50 requests", "a few times a day")

**What I know:**
- it seems more likely when: {{conditions}}
- it never happens when: {{never_conditions}}
- the system state after failure: {{post_failure_state}}

Help me design a reproduction strategy:
1. based on the pattern, what type of bug is this most likely?
   (race condition, resource exhaustion, state corruption, timing-dependent, data-dependent)
2. what specific conditions should I set up to maximize reproduction probability?
3. what instrumentation should I add to capture state at the moment of failure?
4. suggest a minimal test case that isolates the suspected mechanism
```

## Template: dependency upgrade breakage

```
After upgrading {{dependency}} from {{old_version}} to {{new_version}},
the following broke:

{{what_broke}}

Error:
```
{{error}}
```

My code that uses this dependency:
```{{language}}
{{code}}
```

Check:
1. was there a breaking change between these versions? what changed?
2. what's the migration path — show me the exact code changes needed
3. are there any subtle behavioral changes I should watch for
   (things that won't error but will produce different results)?
```

## Tips

- always include the language version and OS — many bugs are environment-specific
- "what I've already tried" saves the LLM from suggesting things you've ruled out
- for performance bugs, raw profiling data beats verbal descriptions
- if the LLM's first suggestion doesn't work, tell it what happened when you tried it
  rather than just asking again
- for race conditions, describe the concurrency model (threads? async? multiprocess?)
- include the test that fails, not just the production code

## Common mistakes

- pasting 500 lines of code with no context — the LLM will focus on surface-level issues
- asking "what's wrong with this code?" without describing what it's supposed to do
- not mentioning what changed recently — most bugs come from recent changes
- accepting the first answer without verifying — LLMs can confidently suggest
  fixes for the wrong root cause
- not following up: "I tried that and now I get this instead..." is how you converge on the fix
