---
title: Test Generation Prompt
category: development
tags: [testing, unit-tests, integration-tests, tdd, coverage]
difficulty: intermediate
models: [claude, gpt-4, gemini]
---

# Test Generation Prompt

Generate comprehensive test suites covering unit tests, integration tests,
edge cases, and error scenarios for any codebase.

## When to Use

- Adding tests to untested legacy code
- Writing tests for new features (TDD or test-after)
- Increasing test coverage for critical paths
- Generating edge case tests after finding a bug
- Creating integration test suites for API endpoints

## The Technique

Effective test generation requires understanding the code's intended behavior,
identifying edge cases, and structuring tests for readability and maintainability.

## Template

```
Generate comprehensive tests for the following code:

Language: {{language}}
Test framework: {{framework}} (Jest / pytest / JUnit / etc.)
Code to test:
{{code}}

Requirements:

1. TEST CATEGORIES
Generate tests for each category:

- Happy path: Normal expected inputs and outputs
- Edge cases: Boundary values, empty inputs, maximum values
- Error cases: Invalid inputs, missing data, type errors
- Integration: Component interactions (if applicable)

2. TEST STRUCTURE
Use the Arrange-Act-Assert pattern:
```
test('should [expected behavior] when [condition]', () => {
    // Arrange: Set up test data and dependencies
    // Act: Call the function/method under test
    // Assert: Verify the expected outcome
});
```

3. NAMING CONVENTION
Test names should read as specifications:
- "should return empty array when input is empty"
- "should throw ValidationError when email format is invalid"
- "should calculate total including tax for valid order"

4. MOCK STRATEGY
- Identify external dependencies to mock
- Use appropriate mocking approach (spy, stub, fake)
- Verify mock interactions where relevant

5. COVERAGE TARGETS
- All public methods and functions
- All conditional branches (if/else, switch)
- All error handling paths (try/catch, error callbacks)
- Boundary conditions for loops and ranges

6. TEST DATA
- Use realistic but deterministic test data
- Avoid random values (use fixed seeds if randomness is needed)
- Create test fixtures or factories for complex objects
- Name test data descriptively (validUser, expiredToken, etc.)
```

## Examples

### Python Function Tests

```python
# Code to test:
def calculate_discount(price, customer_type, quantity):
    if price <= 0:
        raise ValueError("Price must be positive")
    if quantity <= 0:
        raise ValueError("Quantity must be positive")

    base_discount = 0
    if customer_type == "premium":
        base_discount = 0.15
    elif customer_type == "business":
        base_discount = 0.10

    volume_discount = 0.05 if quantity >= 100 else 0
    total_discount = min(base_discount + volume_discount, 0.25)
    return round(price * quantity * (1 - total_discount), 2)

# Generated tests:
import pytest

class TestCalculateDiscount:
    # Happy path tests
    def test_regular_customer_no_discount(self):
        result = calculate_discount(10.00, "regular", 5)
        assert result == 50.00

    def test_premium_customer_gets_15_percent(self):
        result = calculate_discount(100.00, "premium", 1)
        assert result == 85.00

    def test_business_customer_gets_10_percent(self):
        result = calculate_discount(100.00, "business", 1)
        assert result == 90.00

    def test_volume_discount_at_100_units(self):
        result = calculate_discount(10.00, "regular", 100)
        assert result == 950.00

    def test_combined_discount_capped_at_25_percent(self):
        result = calculate_discount(100.00, "premium", 100)
        # 15% + 5% = 20%, under cap
        assert result == 8000.00

    # Edge cases
    def test_minimum_valid_price(self):
        result = calculate_discount(0.01, "regular", 1)
        assert result == 0.01

    def test_quantity_of_99_no_volume_discount(self):
        result = calculate_discount(10.00, "regular", 99)
        assert result == 990.00

    # Error cases
    def test_zero_price_raises_error(self):
        with pytest.raises(ValueError, match="Price must be positive"):
            calculate_discount(0, "regular", 1)

    def test_negative_quantity_raises_error(self):
        with pytest.raises(ValueError, match="Quantity must be positive"):
            calculate_discount(10.00, "regular", -1)

    def test_unknown_customer_type_no_discount(self):
        result = calculate_discount(100.00, "unknown", 1)
        assert result == 100.00
```

## Tips

1. **Test behavior, not implementation** — Tests should verify what the code
   does, not how it does it. This makes tests resilient to refactoring.

2. **One assertion per test (ideally)** — Tests with single assertions are
   easier to debug when they fail.

3. **Use descriptive test names** — Test names are documentation. Future
   developers should understand the expected behavior from the name alone.

4. **Provide the test framework** — Jest, pytest, JUnit, and others have
   different syntax and conventions. Specify yours.

5. **Include the code context** — Functions that call databases, APIs, or
   other services need mock strategies. Include dependency information.

## Common Mistakes

1. **Testing only happy paths** — The majority of bugs hide in edge cases
   and error handling. Allocate at least 40% of tests to these.

2. **Brittle tests** — Tests that depend on specific implementation details
   break on every refactor. Focus on input/output contracts.

3. **No assertion messages** — When tests fail, clear assertion messages save
   debugging time. Include context in assert statements.

4. **Shared mutable state** — Tests that modify shared state create order-dependent
   test suites. Use setup/teardown to isolate each test.

5. **Ignoring async behavior** — Async code needs async tests. Missing await
   statements cause tests to pass vacuously.
