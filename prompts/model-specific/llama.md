---
title: Llama Prompting Best Practices
category: model-specific
tags: [meta, llama, open-source, instruction-format, quantization, tool-use, llama-guard, llama-4, moe]
difficulty: intermediate
models: [llama-4-scout, llama-4-maverick, llama-3.3, llama-3.2, llama-3.1]
---

# Llama prompting best practices

Meta's Llama models are open-weight models with specific instruction formats that vary by version. This guide covers the latest Llama 4 series (mixture-of-experts architecture) as well as the Llama 3.x line for self-hosted deployments.

## Current models (as of April 2026)

| Model | Architecture | Active params | Total params | Context | Key features |
|-------|-------------|--------------|-------------|---------|--------------|
| **Llama 4 Scout** | MoE, 16 experts | 17B | ~109B | 10M tokens | fits on a single H100, natively multimodal, industry-leading context window |
| **Llama 4 Maverick** | MoE, 128 experts | 17B | ~400B | large | beats GPT-4o and Gemini 2.0 Flash on benchmarks, half the active params of DeepSeek v3 |
| **Llama 4 Behemoth** | MoE, 16 experts | 288B | ~2T | large | preview only — outperforms GPT-4.5, Claude Sonnet 3.7, Gemini 2.0 Pro on STEM |
| **Llama 3.3** | dense | 70B | 70B | 128K | best dense model, great for fine-tuning |
| **Llama 3.2** | dense | 1B / 3B / 11B / 90B | same | 128K | edge deployment, on-device, vision (11B/90B) |
| **Llama 3.1** | dense | 8B / 70B / 405B | same | 128K | established workhorse, most fine-tunes available |

**Key changes with Llama 4:**
- mixture-of-experts architecture — 17B active parameters route to different experts per token, so you get much larger model capacity with reasonable compute
- natively multimodal — text, image, and video understanding built in (not bolted on)
- Llama 4 Scout has a 10M token context window, the longest of any open model
- Scout fits on a single H100 GPU despite its effective parameter count
- Maverick matches or beats closed models (GPT-4o, Gemini 2.0 Flash) while being open-weight
- all Llama 4 models are available on Hugging Face and via Meta AI (WhatsApp, Messenger, Instagram)

**Which model to pick:**
- **Llama 4 Maverick**: highest quality open model — use when you want closed-model quality with open weights
- **Llama 4 Scout**: when you need massive context (10M tokens) or single-GPU deployment
- **Llama 3.3 70B**: best option for fine-tuning — mature ecosystem, well-understood behavior
- **Llama 3.2 1B/3B**: edge/mobile deployment, on-device inference
- **Llama 3.1 405B**: when you need the largest dense model and have the compute

## When to use

- Self-hosted or private deployments where data cannot leave your infrastructure
- Cost-sensitive applications with high volume
- Custom fine-tuning workflows (Llama 3.x especially)
- Edge deployment or on-device inference (Llama 3.2 1B/3B)
- When you need full control over the model pipeline
- Applications requiring safety classification (Llama Guard)
- Massive context analysis (Llama 4 Scout, 10M tokens)

## The technique

### Llama 4 vs. Llama 3.x prompt format differences

Llama 4 models use the same chat template format as Llama 3.x but with improved multimodal handling. The MoE architecture is transparent to the prompt — you don't need to change your prompting approach, but you'll notice better instruction-following and reasoning.

### Llama 3.1 vs. 3.2 vs. 3.3 prompt format differences

All Llama 3.x models share the same base template, but capabilities differ:

**Base format (all Llama 3.x):**

```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

{{system_prompt}}<|eot_id|><|start_header_id|>user<|end_header_id|>

{{user_message}}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

```

**Multi-turn:**

```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are a helpful coding assistant.<|eot_id|><|start_header_id|>user<|end_header_id|>

Write a Python sort function.<|eot_id|><|start_header_id|>assistant<|end_header_id|>

Here's a sorting function:
```python
def sort_list(items):
    return sorted(items)
```<|eot_id|><|start_header_id|>user<|end_header_id|>

Make it descending.<|eot_id|><|start_header_id|>assistant<|end_header_id|>

```

**Key differences between versions:**

| Feature | 3.1 (8B/70B/405B) | 3.2 (1B/3B/11B/90B) | 3.3 (70B) |
|---------|-------------------|-----------------------|-----------|
| Context window | 128K | 128K | 128K |
| Tool use | Yes (all sizes) | Yes (11B+ only) | Yes |
| Vision | No | Yes (11B/90B only) | No |
| Multilingual | 8 languages | Same + more | Same |
| On-device | No | Yes (1B/3B) | No |
| Instruction following | Baseline | Improved for small models | Best at 70B class |

### How to handle the BOS token correctly

The `<|begin_of_text|>` token (BOS) should appear exactly once at the start of the conversation. Common mistakes:

```
# WRONG: BOS token on every turn
<|begin_of_text|><|start_header_id|>user<|end_header_id|>
First message<|eot_id|>
<|begin_of_text|><|start_header_id|>user<|end_header_id|>  # WRONG: second BOS
Second message<|eot_id|>

# CORRECT: BOS only at the start
<|begin_of_text|><|start_header_id|>system<|end_header_id|>
System prompt<|eot_id|><|start_header_id|>user<|end_header_id|>
First message<|eot_id|><|start_header_id|>assistant<|end_header_id|>
Response<|eot_id|><|start_header_id|>user<|end_header_id|>
Second message<|eot_id|><|start_header_id|>assistant<|end_header_id|>
```

If you are using Hugging Face `transformers`, `vLLM`, or `llama.cpp`, the chat template handles this automatically. Only worry about manual BOS handling if you are building your own tokenization pipeline.

### Quantization impact on prompt following

Different quantization methods affect how well the model follows instructions. This matters for production deployments.

**GGUF (llama.cpp, Ollama):**

| Quantization | Size (70B) | Quality impact | Recommended for |
|-------------|------------|----------------|-----------------|
| Q8_0 | ~70GB | Minimal loss | When you have the VRAM |
| Q6_K | ~54GB | Very slight loss | Good balance |
| Q5_K_M | ~48GB | Noticeable on complex reasoning | General use |
| Q4_K_M | ~40GB | Degraded instruction following | Simple tasks, chat |
| Q3_K_M | ~30GB | Significant quality loss | Only if hardware-constrained |
| Q2_K | ~25GB | Severe degradation | Not recommended |

**GPTQ vs. GGUF vs. AWQ:**

| Method | Best for | Key trade-off |
|--------|----------|---------------|
| GGUF | CPU + GPU mixed inference (llama.cpp) | Flexible but slower on pure GPU |
| GPTQ | Pure GPU inference (transformers, vLLM) | Fast on GPU, no CPU offloading |
| AWQ | Pure GPU with activation-aware quantization | Better quality than GPTQ at same bit width |

**Prompting adjustments for quantized models:**

```
# For Q4 and below, these strategies help:

1. Use explicit few-shot examples instead of complex instructions
2. Reduce system prompt length (under 200 tokens)
3. Use temperature 0.1-0.3 (lower than full precision)
4. Break complex tasks into multiple simpler turns
5. Add format enforcement: "Output ONLY a JSON object, nothing else"
```

### Llama Guard for safety

Llama Guard is a separate model that classifies inputs and outputs for safety. Use it as a filter before and after your main model:

```python
# Llama Guard 3 prompt format
guard_prompt = """<|begin_of_text|><|start_header_id|>user<|end_header_id|>

Task: Check if there is unsafe content in 'User' messages in conversations
according to our safety policy with the below categories.

<BEGIN UNSAFE CONTENT CATEGORIES>
S1: Violent Crimes
S2: Non-Violent Crimes
S3: Sex-Related Crimes
S4: Child Sexual Exploitation
S5: Defamation
S6: Specialized Advice
S7: Privacy
S8: Intellectual Property
S9: Indiscriminate Weapons
S10: Hate
S11: Suicide & Self-Harm
S12: Sexual Content
S13: Elections
<END UNSAFE CONTENT CATEGORIES>

<BEGIN CONVERSATION>

User: {{user_message}}

<END CONVERSATION>

Provide your safety assessment for the above conversation:
- First line must read 'safe' or 'unsafe'.
- If unsafe, a second line must include a comma-separated list of violated categories.<|eot_id|><|start_header_id|>assistant<|end_header_id|>

"""
# Response will be "safe" or "unsafe\nS1,S6" etc.
```

Deploy Llama Guard as a lightweight filter (the 8B variant is fast enough for real-time filtering) before sending user input to your main model and after generating a response.

### Tool use format for Llama 3.1+

```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

Environment: ipython
Tools: brave_search, wolfram_alpha, code_interpreter

Cutting Knowledge Date: December 2023
Today Date: 04 Apr 2026

You are a helpful assistant with tool access. When you need current information
or complex calculations, use the appropriate tool.<|eot_id|>
<|start_header_id|>user<|end_header_id|>

What is the current price of Bitcoin?<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>

<|python_tag|>brave_search.call(query="bitcoin price today USD")<|eot_id|>
<|start_header_id|>ipython<|end_header_id|>

{"results": [{"title": "Bitcoin Price", "snippet": "BTC: $67,432.15 USD"}]}<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>

Based on current data, Bitcoin is trading at approximately $67,432 USD.<|eot_id|>
```

**Custom tool definitions:**

```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

Environment: ipython

You have access to the following functions:

def get_weather(location: str, units: str = "celsius") -> dict:
    """Get current weather for a location.

    Args:
        location: City name or coordinates
        units: Temperature units - "celsius" or "fahrenheit"

    Returns:
        dict with temperature, conditions, humidity
    """
    ...

Use functions by writing Python-style calls inside <|python_tag|> tags.<|eot_id|>
```

### Context window management for 128K

Llama 3.x supports 128K tokens, but quality degrades beyond certain thresholds:

| Model size | Sweet spot | Usable | Quality drops |
|------------|-----------|--------|---------------|
| 8B | 0-8K | 8K-32K | 32K+ |
| 70B | 0-32K | 32K-64K | 64K+ |
| 405B | 0-64K | 64K-100K | 100K+ |

**Strategies for long context:**
- Place the question/instruction both at the beginning and end of long prompts
- Use explicit markers: "The most relevant section is labeled CRITICAL below"
- For RAG, retrieve and place the most relevant chunks first
- If you must use the full window, add periodic reminders of the task

### Prompting by model size

**Llama 3.2 1B/3B (on-device):**

```
# Keep it dead simple. No elaborate system prompts.
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You classify customer messages. Respond with exactly one word: positive, negative, or neutral.<|eot_id|><|start_header_id|>user<|end_header_id|>

Great product, fast shipping!<|eot_id|><|start_header_id|>assistant<|end_header_id|>

```

**Llama 3.1/3.3 8B (server, moderate tasks):**

```
# Can handle structured output with examples
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

Extract entities from text. Return JSON only.

Example:
Input: "Apple CEO Tim Cook visited Tokyo"
Output: {"people": ["Tim Cook"], "orgs": ["Apple"], "locations": ["Tokyo"]}

Input: "No entities here"
Output: {"people": [], "orgs": [], "locations": []}<|eot_id|>
```

**Llama 3.1 70B / 3.3 70B (server, complex tasks):**

```
# Can handle nuanced multi-step instructions
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are a senior code reviewer. For each code submission:
1. Identify bugs and security issues (categorize as Critical/High/Medium/Low)
2. Suggest performance improvements with Big-O analysis
3. Evaluate readability and suggest refactoring
4. Provide the corrected code

Be thorough but concise. Reference specific line numbers.<|eot_id|>
```

**Llama 3.1 405B (maximum capability):**

Full-complexity prompts work here, comparable to GPT-4 class prompts. This is where you can use elaborate system prompts, multi-step reasoning, and complex output schemas.

### Common failure modes and workarounds

| Failure | Cause | Fix |
|---------|-------|-----|
| Repeating text endlessly | Repetition penalty too low or missing | Set `repetition_penalty: 1.1-1.2` |
| Ignoring system prompt | System prompt too long for model size | Shorten to under 200 tokens for 8B |
| Wrong output format | Instruction not explicit enough | Add a few-shot example of the exact format |
| Hallucinating function names | Tools not defined in system prompt | List available tools explicitly |
| Mixing languages | Multilingual training data bleeding through | Add "Respond only in English" to system prompt |
| Cutting off mid-response | `max_tokens` too low | Increase max_tokens, check context length |
| Garbled special tokens | Wrong chat template applied | Use the library's built-in chat template |

## Template

```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

{{role_definition}}

Rules:
- {{rule_1}}
- {{rule_2}}

{{#if tools}}
Environment: ipython
Tools: {{tool_list}}
{{/if}}<|eot_id|><|start_header_id|>user<|end_header_id|>

{{task_description}}

{{input_data}}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

```

## Tips

1. **Use the library's chat template** -- Hugging Face transformers and llama.cpp handle template formatting automatically. Manual formatting invites bugs.

2. **Match prompt complexity to model size** -- an 8B model cannot follow 500-word system prompts reliably. Scale complexity with model capacity.

3. **Test at your quantization level** -- a prompt that works at FP16 may need simplification at Q4. Always test at deployment precision.

4. **Llama Guard for safety-critical applications** -- running Llama Guard as a classifier before and after your main model is cheaper and more reliable than trying to embed all safety rules in the system prompt.

5. **Repetition penalty is essential** -- unlike API models that handle this internally, self-hosted Llama models need explicit `repetition_penalty` (1.1-1.15) to avoid loops.

6. **Fine-tune for production** -- for specific domains, a fine-tuned 8B model often outperforms a prompted 70B model at a fraction of the cost.

## Common mistakes

1. **Wrong template version** -- Llama 2's `[INST]` format and Llama 3's header tags are completely incompatible. Using the wrong one produces garbled output.

2. **Multiple BOS tokens** -- adding `<|begin_of_text|>` on every turn instead of only at the start confuses the model.

3. **Treating Llama like a cloud API model** -- Llama models, especially smaller variants, are less instruction-following than GPT-4 or Claude. Use simpler, more direct prompts with examples.

4. **Ignoring quantization effects** -- complex reasoning tasks at Q4 may need the full-precision model. Test critical prompts at your deployment precision.

5. **Over-relying on the context window** -- 128K is supported but 8B models lose coherence well before that limit. Use RAG to keep prompts focused.

6. **Not setting stop tokens** -- without proper stop sequences (`<|eot_id|>`, `<|end_of_text|>`), the model may generate multi-turn conversations with itself.
