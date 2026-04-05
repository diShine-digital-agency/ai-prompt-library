---
title: Prompt as code
category: development
tags: [prompt-engineering, version-control, testing, ci-cd, templates]
difficulty: advanced
models: [claude, gpt-4, gemini, llama, mistral]
---

# Prompt as code

Treating prompts as version-controlled, testable, deployable artifacts rather than
ad-hoc text strings. This approach becomes essential once prompts move from
experimentation to production systems.

## When to use

- Any production system that relies on LLM calls
- Teams where multiple people edit prompts
- When you need reproducible, auditable outputs
- A/B testing different prompt versions
- Regulatory environments that require change tracking

## The problem

Most teams store prompts as inline strings in application code, or worse, in a
database field someone edits through a UI. When something breaks, nobody knows
what changed, when, or why. There's no diff, no rollback, no test suite.

## Template: prompt file format

Store each prompt as a standalone file with metadata:

```yaml
# prompts/order-summarizer/v2.3.yaml
id: order-summarizer
version: 2.3
model: claude-sonnet-4-20250514
temperature: 0.2
max_tokens: 500
description: summarizes customer order details for support agents
last_tested: 2025-11-15
owner: backend-team

system: |
  You are an order summarization assistant for {{company_name}}.
  Extract key details from the order data and present them in a
  scannable format for support agents.

  Rules:
  - always include order ID, date, status, and total
  - flag anything unusual (returns, partial shipments, payment issues)
  - keep it under 200 words
  - use plain language, no jargon

user_template: |
  Summarize this order for a support agent:

  {{order_data}}

  Customer's question: {{customer_question}}

test_cases:
  - input:
      order_data: "Order #12345, 2 items, $89.99, shipped 2025-11-01, delivered"
      customer_question: "Where is my order?"
    assertions:
      - contains: "12345"
      - contains: "delivered"
      - max_length: 200
  - input:
      order_data: "Order #67890, 1 item, $299.00, payment_failed"
      customer_question: "Why was I charged?"
    assertions:
      - contains: "payment"
      - sentiment: "neutral"
```

## Template: prompt testing framework

```python
# test_prompts.py
import yaml
import asyncio
from pathlib import Path

class PromptTest:
    def __init__(self, prompt_dir="./prompts"):
        self.prompt_dir = Path(prompt_dir)

    def load_prompt(self, prompt_id):
        for f in self.prompt_dir.rglob("*.yaml"):
            with open(f) as fh:
                data = yaml.safe_load(fh)
                if data.get("id") == prompt_id:
                    return data
        raise FileNotFoundError(f"no prompt with id: {prompt_id}")

    async def run_test_case(self, prompt, test_case, llm_client):
        """render the template, call the model, check assertions"""
        rendered = prompt["user_template"]
        for key, value in test_case["input"].items():
            rendered = rendered.replace("{{" + key + "}}", str(value))

        response = await llm_client.complete(
            system=prompt["system"],
            user=rendered,
            model=prompt["model"],
            temperature=prompt["temperature"]
        )

        results = []
        for assertion in test_case["assertions"]:
            if "contains" in assertion:
                passed = assertion["contains"].lower() in response.lower()
                results.append({"check": f"contains '{assertion['contains']}'", "passed": passed})
            if "max_length" in assertion:
                word_count = len(response.split())
                passed = word_count <= assertion["max_length"]
                results.append({"check": f"max {assertion['max_length']} words", "passed": passed})

        return results

    async def run_all(self, prompt_id, llm_client):
        prompt = self.load_prompt(prompt_id)
        all_results = []
        for i, tc in enumerate(prompt.get("test_cases", [])):
            results = await self.run_test_case(prompt, tc, llm_client)
            all_results.append({"case": i, "results": results})
        return all_results
```

## Template: A/B testing prompts

```python
# ab_test.py
import random
import json
from datetime import datetime

class PromptExperiment:
    def __init__(self, experiment_id, variants, traffic_split=None):
        """
        variants: {"control": prompt_v1, "variant_a": prompt_v2}
        traffic_split: {"control": 0.5, "variant_a": 0.5}
        """
        self.experiment_id = experiment_id
        self.variants = variants
        self.traffic_split = traffic_split or {k: 1/len(variants) for k in variants}
        self.results = {k: [] for k in variants}

    def assign_variant(self, user_id=None):
        """deterministic assignment if user_id provided, random otherwise"""
        if user_id:
            hash_val = hash(f"{self.experiment_id}:{user_id}") % 100
            cumulative = 0
            for variant, weight in self.traffic_split.items():
                cumulative += weight * 100
                if hash_val < cumulative:
                    return variant
        # random fallback
        return random.choices(
            list(self.variants.keys()),
            weights=list(self.traffic_split.values())
        )[0]

    def log_result(self, variant, input_data, output, metrics):
        """log for later analysis"""
        self.results[variant].append({
            "timestamp": datetime.utcnow().isoformat(),
            "input": input_data,
            "output": output,
            "metrics": metrics  # e.g. {"quality_score": 4, "latency_ms": 230}
        })

    def summary(self):
        summary = {}
        for variant, logs in self.results.items():
            if not logs:
                continue
            metrics_keys = logs[0]["metrics"].keys()
            summary[variant] = {
                "n": len(logs),
                "avg_metrics": {
                    k: sum(l["metrics"][k] for l in logs) / len(logs)
                    for k in metrics_keys
                }
            }
        return summary
```

## Template: CI/CD pipeline for prompts

```yaml
# .github/workflows/prompt-ci.yml
name: prompt quality checks
on:
  pull_request:
    paths: ['prompts/**']

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: validate prompt yaml
        run: |
          python -c "
          import yaml, sys
          from pathlib import Path
          errors = []
          required = ['id', 'version', 'model', 'system']
          for f in Path('prompts').rglob('*.yaml'):
              data = yaml.safe_load(f.read_text())
              missing = [r for r in required if r not in data]
              if missing:
                  errors.append(f'{f}: missing {missing}')
          if errors:
              print('\n'.join(errors))
              sys.exit(1)
          print(f'all prompts valid')
          "

      - name: check for template variable consistency
        run: |
          python -c "
          import yaml, re
          from pathlib import Path
          for f in Path('prompts').rglob('*.yaml'):
              data = yaml.safe_load(f.read_text())
              template_vars = set(re.findall(r'\{\{(\w+)\}\}', data.get('user_template', '')))
              if data.get('test_cases'):
                  for tc in data['test_cases']:
                      test_vars = set(tc.get('input', {}).keys())
                      missing = template_vars - test_vars
                      if missing:
                          print(f'WARNING: {f} test case missing vars: {missing}')
          "

      - name: run prompt regression tests
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: python test_prompts.py --all --report
```

## Prompt template engine pattern

Instead of f-strings or `.format()`, use a proper template system that handles
edge cases like missing variables, escaping, and conditional sections:

```python
import re

def render_prompt(template, variables, strict=True):
    """
    render a prompt template with variables.

    {{variable}} — required substitution
    {{?variable}} — optional, removed if not provided
    {{#condition}}...{{/condition}} — conditional block
    """
    result = template

    # handle conditional blocks
    for match in re.finditer(r'\{\{#(\w+)\}\}(.*?)\{\{/\1\}\}', result, re.DOTALL):
        key, block = match.group(1), match.group(2)
        if variables.get(key):
            result = result.replace(match.group(0), block.strip())
        else:
            result = result.replace(match.group(0), '')

    # handle optional variables
    for match in re.finditer(r'\{\{\?(\w+)\}\}', result):
        key = match.group(1)
        result = result.replace(match.group(0), str(variables.get(key, '')))

    # handle required variables
    for match in re.finditer(r'\{\{(\w+)\}\}', result):
        key = match.group(1)
        if key not in variables and strict:
            raise ValueError(f"missing required variable: {key}")
        result = result.replace(match.group(0), str(variables.get(key, f'[MISSING:{key}]')))

    return result.strip()
```

## Tips

- version prompts semantically: breaking changes = major, output tweaks = minor
- keep a changelog per prompt — future you will thank you
- store evaluation results alongside the prompt version that produced them
- use git blame on prompt files to trace when regressions were introduced
- separate the prompt template from runtime configuration (model, temperature)
- tag releases: `prompt-order-summarizer-v2.3` as a git tag works fine

## Common mistakes

- editing prompts directly in production without version control
- no test cases means no way to detect regressions
- testing prompts manually once and assuming they'll always work
- mixing template rendering with business logic
- not tracking which prompt version produced which output in production logs
