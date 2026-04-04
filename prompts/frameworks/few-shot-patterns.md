---
title: Few-Shot Prompting Patterns
category: frameworks
tags: [examples, in-context-learning, pattern-matching, formatting]
difficulty: beginner
models: [claude, gpt-4, gemini, llama, mistral]
---

# Few-Shot Prompting Patterns

Few-shot prompting provides the model with example input-output pairs before presenting
the actual task. The model learns the pattern from examples and applies it to new inputs.
This is one of the most reliable techniques for controlling output format and behavior.

## When to Use

- You need consistent output formatting (JSON, tables, specific structures)
- Classification tasks where examples define categories
- Style transfer or tone matching
- Any task where "show, don't tell" works better than instructions
- When zero-shot results are inconsistent

**When NOT to use:**
- Tasks requiring genuine novelty (examples can anchor the model)
- Very long contexts where examples consume too many tokens
- When the task is already well-specified by instructions alone

## The Technique

### Basic Pattern

```
{{task_description}}

{{examples}}

Input: {{new_input}}
Output:
```

### Example Selection Strategies

**1. Representative sampling** — Choose examples that cover the range of expected inputs:

```
Classify the sentiment of product reviews.

Review: "Absolutely love this product! Best purchase ever."
Sentiment: Positive

Review: "It's okay. Does what it says but nothing special."
Sentiment: Neutral

Review: "Broke after two days. Complete waste of money."
Sentiment: Negative

Review: "{{user_review}}"
Sentiment:
```

**2. Boundary examples** — Include edge cases to teach nuance:

```
Classify whether these emails are spam or legitimate.

Email: "You won $1,000,000! Click here to claim."
Classification: Spam

Email: "Your Amazon order #123 has shipped."
Classification: Legitimate

Email: "Special offer for existing customers: 20% off your next purchase"
Classification: Legitimate (promotional but from known sender)

Email: "{{user_email_subject}}"
Classification:
```

**3. Difficulty-graduated** — Order from simple to complex:

```
Extract the company name from these descriptions.

Text: "Google announced new AI features today."
Company: Google

Text: "The Cupertino-based tech giant released quarterly earnings."
Company: Apple

Text: "Sources say the e-commerce company founded by Jeff Bezos is expanding into healthcare."
Company: Amazon

Text: "{{user_text}}"
Company:
```

### Ordering Effects

Example order matters. Research shows:

- **Recency bias**: Models weight later examples more heavily
- **Primacy effect**: First examples set expectations
- **Best practice**: Put your most representative example last, closest to the actual task

### Format Consistency

Every example must use identical structure:

```
# GOOD - Consistent format
Input: "Hello"
Language: English
Confidence: High

Input: "Bonjour"
Language: French
Confidence: High

# BAD - Inconsistent format
Input: "Hello" -> English (high confidence)
Input: "Bonjour"
Language: French
Confidence: High
```

## Template

```
{{task_instruction}}

{{#each examples}}
Input: {{this.input}}
Output: {{this.output}}

{{/each}}
Input: {{new_input}}
Output:
```

## Examples

### Structured Data Extraction

```
Extract contact information into structured format.

Text: "Reach out to Sarah Chen at sarah@example.com or call 555-0123"
Result:
- Name: Sarah Chen
- Email: sarah@example.com
- Phone: 555-0123

Text: "For inquiries, email support@acme.co. Our office is at 123 Main St."
Result:
- Name: N/A
- Email: support@acme.co
- Phone: N/A
- Address: 123 Main St

Text: "{{input_text}}"
Result:
```

### Code Translation

```
Convert Python functions to JavaScript.

Python:
def greet(name):
    return f"Hello, {name}!"

JavaScript:
function greet(name) {
    return `Hello, ${name}!`;
}

Python:
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

JavaScript:
function factorial(n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

Python:
{{python_code}}

JavaScript:
```

### Dynamic Few-Shot

Programmatically select examples based on similarity to the input:

```
// Pseudocode for dynamic few-shot selection
const examples = embeddingSearch(userInput, exampleDB, topK=3);
const prompt = buildPrompt(taskDescription, examples, userInput);
```

## Tips

1. **3-5 examples is the sweet spot** — Fewer may not establish the pattern;
   more waste tokens without proportional gains.

2. **Use diverse examples** — If all examples are positive sentiment, the model
   biases toward positive classification.

3. **Label your delimiters clearly** — Use "Input:" / "Output:" or "Q:" / "A:"
   consistently. Ambiguous boundaries confuse the model.

4. **Test with adversarial inputs** — After building your few-shot prompt, test
   with edge cases that differ from your examples.

5. **Consider negative examples** — Showing what NOT to do can be as valuable
   as showing correct behavior.

## Common Mistakes

1. **Cherry-picking easy examples** — If all examples are trivial, the model
   struggles with complex inputs. Include varied difficulty.

2. **Inconsistent formatting** — Even minor format differences between examples
   (trailing spaces, different delimiters) degrade performance.

3. **Too many examples for simple tasks** — For straightforward classification,
   2-3 examples suffice. More can over-constrain the model.

4. **Ignoring token limits** — Long examples eat into your context window.
   Calculate total prompt size before adding more examples.

5. **Not updating examples** — As your use case evolves, your few-shot examples
   should evolve too. Stale examples produce stale outputs.
