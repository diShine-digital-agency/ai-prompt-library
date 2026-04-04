---
title: Llama Prompting Best Practices
category: model-specific
tags: [meta, llama, open-source, instruction-format, quantization]
difficulty: intermediate
models: [llama-2, llama-3, llama-3.1]
---

# Llama Prompting Best Practices

Meta's Llama models are open-weight models with specific instruction formats that
vary by version. Using the correct template is critical for optimal performance.
This guide covers Llama 2 and Llama 3 formats, quantization-aware prompting,
and best practices for self-hosted deployments.

## When to Use

- Self-hosted or private deployments where data cannot leave your infrastructure
- Cost-sensitive applications with high volume
- Custom fine-tuning workflows
- Edge deployment or on-device inference
- When you need full control over the model pipeline

## The Technique

### Llama 2 Instruction Format

```
<s>[INST] <<SYS>>
{{system_prompt}}
<</SYS>>

{{user_message}} [/INST]
```

Multi-turn conversation:
```
<s>[INST] <<SYS>>
You are a helpful assistant.
<</SYS>>

What is the capital of France? [/INST] The capital of France is Paris. </s>
<s>[INST] What about Germany? [/INST]
```

### Llama 3 Instruction Format

Llama 3 uses a completely different template:

```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

{{system_prompt}}<|eot_id|><|start_header_id|>user<|end_header_id|>

{{user_message}}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

```

Multi-turn:
```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are a helpful coding assistant.<|eot_id|><|start_header_id|>user<|end_header_id|>

Write a Python function to sort a list.<|eot_id|><|start_header_id|>assistant<|end_header_id|>

Here is a sorting function:
```python
def sort_list(items):
    return sorted(items)
```<|eot_id|><|start_header_id|>user<|end_header_id|>

Now make it sort in descending order.<|eot_id|><|start_header_id|>assistant<|end_header_id|>

```

### Llama 3.1 with Tool Use

```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

Environment: ipython
Tools: brave_search, wolfram_alpha

You are a helpful assistant with access to tools.
When you need to use a tool, output a JSON function call.<|eot_id|>
<|start_header_id|>user<|end_header_id|>

What is the weather in Tokyo today?<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>

<|python_tag|>brave_search.call(query="weather in Tokyo today")<|eot_id|>
```

### Quantization-Aware Prompting

When running quantized models (4-bit, 8-bit), adjust your expectations:

```
# For quantized models, use these strategies:

1. Simpler instructions — Break complex tasks into steps
2. Shorter prompts — Quantized models handle long contexts less well
3. More explicit formatting — Be very specific about output format
4. Lower temperature — Reduce randomness to compensate for quality loss
5. Stronger few-shot examples — Quantized models rely more on examples
```

Example for quantized deployment:
```
System: You extract product info from text. Return JSON only.

Example:
Text: "Nike Air Max 90, $120, size 10, black"
Output: {"brand": "Nike", "model": "Air Max 90", "price": 120, "size": "10", "color": "black"}

Text: "{{input}}"
Output:
```

## Template

```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

{{role_definition}}

Rules:
- {{rule_1}}
- {{rule_2}}
- {{rule_3}}<|eot_id|><|start_header_id|>user<|end_header_id|>

{{task_description}}

{{input_data}}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

```

## Examples

### Code Generation (Llama 3)

```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are a senior Python developer. Write clean, well-documented code.
Include type hints and docstrings. Handle edge cases.
Do not include explanations outside the code block.<|eot_id|>
<|start_header_id|>user<|end_header_id|>

Write a function that finds the longest palindromic substring
in a given string. Optimize for O(n^2) time complexity.<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>

```

### Data Analysis (Llama 2)

```
<s>[INST] <<SYS>>
You are a data analyst. Given CSV data, provide statistical summaries
and insights. Use markdown tables for presentation. Identify outliers
and trends. Keep analysis concise and actionable.
<</SYS>>

Analyze this sales data and identify the top performing regions:

Region,Q1,Q2,Q3,Q4
North,450000,520000,480000,610000
South,380000,390000,410000,420000
East,290000,310000,350000,380000
West,510000,490000,530000,580000
[/INST]
```

## Tips

1. **Use the correct template for your version** — Llama 2 and Llama 3 have
   incompatible formats. Using the wrong one severely degrades performance.

2. **Keep system prompts concise for Llama 2** — Llama 2's system prompt area
   works best with 2-5 sentences. Long system prompts reduce quality.

3. **Llama 3 handles longer contexts better** — Llama 3.1 supports 128K tokens,
   but quality is best within the first 32K.

4. **Test with your quantization level** — A prompt that works at FP16 may need
   adjustment at 4-bit quantization. Always test at your deployment precision.

5. **Use chat templates from libraries** — Hugging Face transformers and
   llama.cpp have built-in template handling. Use them instead of manual formatting.

6. **Fine-tune for specific domains** — Llama's open weights allow fine-tuning.
   For production, fine-tuned models often outperform prompting alone.

## Common Mistakes

1. **Wrong instruction format** — The most common error. Llama 2's [INST] tags
   and Llama 3's header tags are not interchangeable.

2. **Missing special tokens** — Forgetting `<s>`, `</s>`, `<|begin_of_text|>`,
   or `<|eot_id|>` causes the model to produce garbled output.

3. **Treating Llama like a cloud API model** — Llama models are generally less
   instruction-following than GPT-4 or Claude. Use simpler, more direct prompts.

4. **Ignoring context window limits** — Llama 2 has 4K context. Exceeding it
   causes silent truncation and degraded responses.

5. **Not testing quantized performance** — 4-bit models lose capability.
   Complex reasoning tasks may need the full-precision model.
