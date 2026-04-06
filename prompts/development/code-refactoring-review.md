---
title: Code Refactoring Review
category: development
tags: [refactoring, code-quality, design-patterns, clean-code, technical-debt]
difficulty: advanced
models: [claude, gpt-4, gemini, mistral]
---

# Code Refactoring Review

Perform deep code refactoring analysis that identifies structural improvements,
design pattern opportunities, and technical debt reduction strategies while
respecting project constraints.

## When to Use

- Reviewing code before a major release or rewrite
- Reducing technical debt in critical modules
- Improving code maintainability for growing teams
- Preparing legacy code for new feature development
- Code review where structural changes are on the table

## The Technique

Provide the code, its language, your refactoring goals, and any constraints.
The model analyzes the code structure, identifies code smells, maps them to
specific refactoring patterns, and provides the refactored output with
explanations for each change. The key is specifying goals and constraints so
the model optimizes for what matters — readability, performance, testability,
or all three.

## Template

```
Perform a refactoring analysis on the following code.

## Code
{{code}}

## Language and Framework
{{language}} (include framework and version if relevant, e.g.,
"TypeScript 5.x with React 18" or "Python 3.11 with FastAPI").

## Refactoring Goals
{{goals}}
What should the refactored code optimize for? Examples:
- Improve readability and reduce cognitive complexity
- Increase testability (dependency injection, pure functions)
- Reduce duplication (DRY violations)
- Improve error handling and resilience
- Prepare for a specific new feature

## Constraints
{{constraints}}
What must NOT change? Examples:
- Public API signatures must remain backward-compatible
- Cannot add new dependencies
- Must maintain current performance characteristics
- Database schema cannot change

## Preferred Patterns
{{patterns_preferred}}
Any design patterns or architectural styles to favor? Examples:
- Repository pattern for data access
- Strategy pattern for varying algorithms
- Composition over inheritance
- Functional style (pure functions, immutability)

## Analysis Format

### 1. Code Smells Identified
For each smell:
- Name (e.g., "Long Method", "Feature Envy", "God Class")
- Location (function/line reference)
- Severity: High / Medium / Low
- Impact on maintainability, testability, or performance

### 2. Refactoring Plan
Ordered list of refactoring steps. Each step:
- Refactoring technique (e.g., Extract Method, Replace Conditional with
  Polymorphism, Introduce Parameter Object)
- What it addresses
- Risk assessment (what could break)

### 3. Refactored Code
The complete refactored code with inline comments explaining each
significant change.

### 4. Trade-offs
What was gained and what was sacrificed. Be honest about increased
complexity, added abstractions, or performance implications.
```

## Examples

### Before and After — Extract Method

```
CODE SMELL: Long Method (38 lines, cyclomatic complexity: 12)
Location: processOrder() in order_service.py

REFACTORING: Extract Method + Introduce Guard Clauses

BEFORE:
def process_order(order):
    if order is not None:
        if order.items:
            total = 0
            for item in order.items:
                if item.quantity > 0:
                    price = item.price * item.quantity
                    if item.discount:
                        price = price * (1 - item.discount)
                    total += price
            if total > 0:
                tax = total * 0.08
                total += tax
                order.total = total
                order.status = "processed"
                db.save(order)
                send_confirmation(order)

AFTER:
def process_order(order):
    if not order or not order.items:
        raise ValueError("Order must exist and contain items")

    total = _calculate_total(order.items)
    total_with_tax = _apply_tax(total, rate=0.08)

    order.total = total_with_tax
    order.status = "processed"
    _finalize_order(order)

def _calculate_total(items):
    return sum(_line_item_price(item) for item in items if item.quantity > 0)

def _line_item_price(item):
    price = item.price * item.quantity
    return price * (1 - item.discount) if item.discount else price

def _apply_tax(amount, rate):
    return amount + (amount * rate)

def _finalize_order(order):
    db.save(order)
    send_confirmation(order)

TRADE-OFFS:
+ Cyclomatic complexity reduced from 12 to 2 per function.
+ Each function is independently testable.
+ Tax rate is now a parameter, not a magic number.
- Added 4 new functions (more symbols to navigate).
- Slight performance overhead from extra function calls (negligible).
```

## Tips

1. **Provide the full module, not just one function** — Refactoring often
   involves moving code between classes or extracting shared utilities.
   Isolated snippets miss these opportunities.

2. **State your goals explicitly** — "Make it better" is too vague. "Reduce
   cyclomatic complexity below 10 per function" is actionable and measurable.

3. **List what cannot change** — Without constraints, the model may suggest
   rewriting public APIs or changing data models, creating breaking changes.

4. **Apply refactorings incrementally** — Do not apply all suggestions at
   once. Each refactoring should pass all existing tests before the next one.

5. **Use the analysis to prioritize** — The severity ratings help you decide
   what to refactor now vs. what to defer. High-severity smells in
   frequently-changed code should be fixed first.

## Common Mistakes

1. **Refactoring without tests** — If there are no tests, write them first.
   Refactoring without a safety net introduces bugs that are hard to trace.

2. **Over-abstracting** — Not every `if` statement needs the Strategy pattern.
   Abstractions have a cost; add them only when the code will actually vary.

3. **Renaming everything at once** — Mass renames across a codebase create
   huge diffs that are impossible to review. Rename in focused, reviewable PRs.

4. **Ignoring trade-offs** — Every refactoring has a cost. Adding a new
   abstraction layer improves extensibility but increases onboarding time.

5. **Refactoring stable code** — Code that works, rarely changes, and has no
   upcoming feature needs should be left alone. Refactor code that is actively
   causing pain, not code that merely looks imperfect.
