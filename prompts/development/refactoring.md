---
title: Code Refactoring Prompt
category: development
tags: [refactoring, clean-code, design-patterns, technical-debt, maintenance]
difficulty: advanced
models: [claude, gpt-4, gemini]
---

# Code Refactoring Prompt

Systematic code refactoring that identifies code smells, applies appropriate
design patterns, and improves maintainability while preserving behavior.

## When to Use

- Legacy code modernization projects
- Pre-feature technical debt reduction
- Performance optimization of existing code
- Preparing code for scaling (team or traffic)
- Post-incident code quality improvement

## The Technique

Refactoring must preserve external behavior while improving internal structure.
The key is identifying the right refactoring for each code smell.

## Template

```
Refactor the following code. Preserve all existing behavior.

Language: {{language}}
Context: {{what_the_code_does}}
Pain points: {{why_refactoring_is_needed}}
Constraints: {{things_that_cannot_change}} (e.g., public API, database schema)

Analyze and refactor in this order:

1. CODE SMELL IDENTIFICATION
For each smell found:
- Smell name (e.g., Long Method, Feature Envy, God Class)
- Location in the code
- Impact (maintenance burden, bug risk, performance)
- Severity: High / Medium / Low

2. REFACTORING PLAN
For each smell, propose a specific refactoring:
- Refactoring technique (Extract Method, Move Method, Strategy Pattern, etc.)
- Expected improvement
- Risk level of the change
- Dependencies affected

3. REFACTORED CODE
- Present the complete refactored code
- Use comments to mark significant changes: // REFACTORED: reason
- Maintain the same public API unless explicitly allowed to change it

4. BEFORE/AFTER COMPARISON
Show specific improvements:
- Lines of code: before vs. after
- Cyclomatic complexity: before vs. after
- Number of responsibilities per class/module
- Testability improvement

5. TESTING STRATEGY
- Tests to write BEFORE refactoring (characterization tests)
- Tests to verify refactoring preserved behavior
- New tests enabled by improved structure

6. MIGRATION PLAN
- Can this be refactored incrementally or all-at-once?
- Feature flag strategy for gradual rollout
- Rollback plan if refactoring introduces issues

Original code:
{{code}}
```

## Examples

### God Class Refactoring

```
Before:
class OrderProcessor:
    def create_order(self, items, customer): ...
    def calculate_tax(self, subtotal, state): ...
    def apply_discount(self, total, code): ...
    def charge_payment(self, amount, card): ...
    def send_confirmation_email(self, order): ...
    def update_inventory(self, items): ...
    def generate_invoice_pdf(self, order): ...
    def calculate_shipping(self, address, weight): ...

Code smells:
- God Class: OrderProcessor has 8+ responsibilities
- Tight coupling: Payment, email, inventory all in one class
- Untestable: Cannot test pricing without payment dependency

Refactored:
class OrderService:
    def __init__(self, pricing, payment, notifications, inventory):
        self._pricing = pricing
        self._payment = payment
        self._notifications = notifications
        self._inventory = inventory

    def create_order(self, items, customer):
        subtotal = self._pricing.calculate_subtotal(items)
        tax = self._pricing.calculate_tax(subtotal, customer.state)
        total = subtotal + tax
        # REFACTORED: Single responsibility — orchestration only
        ...

class PricingService:
    def calculate_subtotal(self, items): ...
    def calculate_tax(self, subtotal, state): ...
    def apply_discount(self, total, code): ...
    def calculate_shipping(self, address, weight): ...

class PaymentService:
    def charge(self, amount, payment_method): ...

class NotificationService:
    def send_order_confirmation(self, order): ...
    def generate_invoice(self, order): ...

class InventoryService:
    def reserve_items(self, items): ...
    def release_items(self, items): ...
```

## Tips

1. **Refactor in small steps** — Each step should be a standalone commit that
   passes all tests. Never combine multiple refactorings in one change.

2. **Write tests first** — Before touching any code, write characterization
   tests that capture current behavior. These are your safety net.

3. **Name the patterns** — When applying design patterns (Strategy, Observer,
   Factory), name them explicitly so future developers understand the intent.

4. **Measure improvement** — Quantify the before/after difference in complexity,
   test coverage, and lines of code. This justifies the refactoring effort.

5. **Prioritize by impact** — Refactor the code that changes most frequently
   first. Stable code, even if ugly, has lower refactoring ROI.

## Common Mistakes

1. **Refactoring without tests** — Changing code without tests is not refactoring,
   it is rewriting. Rewriting introduces new bugs.

2. **Big bang refactoring** — Attempting to refactor everything at once increases
   risk and makes rollback impossible. Work incrementally.

3. **Over-abstracting** — Extracting every 3-line block into a method or
   creating interfaces for single implementations adds complexity without benefit.

4. **Changing behavior during refactoring** — Refactoring means improving
   structure without changing behavior. New features go in separate commits.

5. **Not communicating the plan** — Team members working on the same code
   need to know about ongoing refactoring to avoid merge conflicts.
