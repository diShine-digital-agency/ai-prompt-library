---
title: Code Documentation Generator
category: development
tags: [documentation, code-docs, jsdoc, docstring, api-docs]
difficulty: intermediate
models: [claude, gpt-4, gemini, mistral]
---

# Code Documentation Generator

Generate comprehensive, standards-compliant documentation from source code
including function signatures, parameter descriptions, return types, and
usage examples.

## When to Use

- Documenting undocumented legacy codebases
- Generating API reference documentation from source
- Adding JSDoc, docstrings, or XML doc comments to existing functions
- Onboarding new developers who need to understand a module
- Preparing code for open-source release

## The Technique

Feed the model the raw code and specify the documentation standard. The model
infers intent from naming, types, and control flow, then produces documentation
that a human reviewer can verify and refine. The key is specifying audience and
doc style so the output matches your project conventions.

## Template

```
Generate documentation for the following {{language}} code.

## Code
{{code_snippet}}

## Documentation Style
Use the {{doc_style}} format (e.g., JSDoc, Google-style docstring, Sphinx,
Javadoc, XML doc comments).

## Audience
The documentation is for {{audience}} (e.g., internal team, open-source
contributors, junior developers, API consumers).

## Requirements
1. Document every public function, class, and method.
2. Include:
   - A one-line summary of purpose
   - Parameter names, types, and descriptions
   - Return type and description
   - Thrown exceptions or error conditions
   - At least one usage example per public function
3. Flag any code that appears to have undocumented side effects.
4. Note any parameters that lack validation or have implicit constraints.
5. If the function name or logic is unclear, suggest a clearer name in a
   comment prefixed with "[Naming suggestion]".

## Output
Return the original code with documentation comments inserted directly
above each function/class/method. Do not modify the code itself.
```

## Examples

### Python Function with Google-style Docstring

```python
def calculate_discount(price, tier, is_annual):
    """Calculate the final discount percentage for a subscription.

    Determines the appropriate discount based on the customer's pricing
    tier and billing cycle. Annual billing receives an additional 10%
    discount on top of the tier-based discount.

    Args:
        price (float): The base price in USD. Must be positive.
        tier (str): Customer tier, one of "free", "pro", or "enterprise".
        is_annual (bool): Whether the customer pays annually.

    Returns:
        float: The discount as a decimal between 0.0 and 0.5.

    Raises:
        ValueError: If tier is not one of the recognized values.
        ValueError: If price is negative or zero.

    Example:
        >>> calculate_discount(100.0, "pro", True)
        0.3
    """
```

## Tips

1. **Specify the exact doc format** — "Add documentation" is ambiguous.
   "Use NumPy-style docstrings" is precise and produces consistent output.

2. **Include the full file** — Functions often depend on class state, imports,
   or constants. Providing full context reduces hallucinated parameter types.

3. **Review inferred types carefully** — The model guesses types from usage
   patterns. Verify these against your actual type system or runtime behavior.

4. **Ask for examples that compile** — Specify "usage examples must be valid,
   runnable code" to avoid pseudocode in your documentation.

5. **Iterate on edge cases** — After the first pass, ask the model to
   specifically document error handling paths and boundary conditions.

## Common Mistakes

1. **Documenting the obvious** — `# Increment counter by 1` above `counter += 1`
   adds noise. Good docs explain why, not what.

2. **Accepting hallucinated types** — The model may infer `string` when the
   actual type is `Optional[str]`. Always cross-check generated types.

3. **Skipping private methods** — Internal methods need docs too, especially
   if they contain complex logic that future maintainers must understand.

4. **No examples** — Parameter descriptions alone rarely clarify usage.
   A single example is worth more than five lines of description.

5. **Stale docs after refactoring** — Documentation generated once and never
   updated becomes misleading. Regenerate after significant code changes.
