# API & Playground

> Using the AI Playground and the Prompt Library programmatically.

---

## Table of Contents

- [AI Playground (Browser)](#ai-playground-browser)
- [Setting Up API Keys](#setting-up-api-keys)
- [Supported Providers](#supported-providers)
- [Token Usage Tracking](#token-usage-tracking)
- [Programmatic Usage (JavaScript)](#programmatic-usage-javascript)
- [API Functions Reference](#api-functions-reference)

---

## AI Playground (Browser)

The AI Playground is available in the **Prompt Workshop** (browser/desktop only — not in the CLI). It lets you send prompts directly to AI models and get responses, all within the browser.

### How to Access

1. Open the Prompt Workshop (`viewer.html` or `prompt-lib viewer`)
2. Click tab **6** (Playground) or press the `6` key

### Features

- **Provider selector** — choose between OpenAI, Anthropic, or Google
- **Model override** — use a specific model instead of the default
- **System prompt** — optional system prompt for context setting
- **Prompt input** — write, paste, or load a prompt from the library
- **Send** — sends the prompt to the selected provider's API
- **Response display** — formatted AI response with markdown rendering
- **Token tracking** — shows input/output token usage per request
- **One-click copy** — copy the AI response to clipboard

### Workflow

1. Configure your API key in Settings (⚙ button) — one-time setup
2. Select a provider (OpenAI, Anthropic, or Google)
3. Optionally enter a system prompt
4. Write or paste your prompt
5. Click "Send"
6. View the AI response, token usage, and model info
7. Copy the response or iterate

---

## Setting Up API Keys

Click the **⚙** (gear) button in the Prompt Workshop to open API Settings.

### Configuration Fields

| Field | Description |
|-------|-------------|
| **Provider** | Active provider: OpenAI, Anthropic, or Google |
| **OpenAI API Key** | Your OpenAI API key (starts with `sk-`) |
| **Anthropic API Key** | Your Anthropic API key (starts with `sk-ant-`) |
| **Google API Key** | Your Google AI Studio API key |
| **Model** | Optional model override for each provider |

### Security

- **Keys are stored in `localStorage`** — they never leave your browser
- Keys are sent directly from your browser to the provider's API (no intermediate server)
- Keys are stored under the `api_settings` localStorage key
- To clear your keys: Settings → delete the key fields, or clear browser localStorage

### Getting API Keys

| Provider | Where to Get a Key |
|----------|--------------------|
| **OpenAI** | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| **Anthropic** | [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) |
| **Google** | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |

---

## Supported Providers

### OpenAI

| Setting | Default |
|---------|---------|
| **Default model** | `gpt-4o-mini` |
| **API endpoint** | `https://api.openai.com/v1/chat/completions` |
| **Auth header** | `Authorization: Bearer <key>` |
| **Temperature** | 0.7 (playground), 0.3 (optimizer) |
| **Max tokens** | 4000 (playground), 2000 (optimizer) |

**Message format:**
```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {"role": "system", "content": "System prompt here"},
    {"role": "user", "content": "User prompt here"}
  ]
}
```

### Anthropic

| Setting | Default |
|---------|---------|
| **Default model** | `claude-sonnet-4-20250514` |
| **API endpoint** | `https://api.anthropic.com/v1/messages` |
| **Auth header** | `x-api-key: <key>` |
| **API version** | `2023-06-01` |
| **Temperature** | 0.7 (playground), 0.3 (optimizer) |
| **Max tokens** | 4000 (playground), 2000 (optimizer) |

**Message format:**
```json
{
  "model": "claude-sonnet-4-20250514",
  "system": "System prompt here",
  "messages": [
    {"role": "user", "content": "User prompt here"}
  ]
}
```

### Google

| Setting | Default |
|---------|---------|
| **Default model** | `gemini-2.0-flash` |
| **API endpoint** | `https://generativelanguage.googleapis.com/v1beta/models/<model>:generateContent` |
| **Auth** | API key in URL query parameter |
| **Temperature** | 0.7 (playground), 0.3 (optimizer) |
| **Max tokens** | 4000 (playground), 2000 (optimizer) |

**Message format:**
```json
{
  "contents": [
    {"parts": [{"text": "System prompt + user prompt"}]}
  ],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 4000
  }
}
```

> **Note:** Google's API combines system and user prompts into a single content block.

---

## Token Usage Tracking

The Playground tracks token usage for each request:

| Provider | Token Info Available |
|----------|:------------------:|
| **OpenAI** | ✅ Input tokens, output tokens, total |
| **Anthropic** | ✅ Input tokens, output tokens |
| **Google** | ❌ Not provided by API |

Token counts are displayed after each response, helping you monitor costs and optimize prompt length.

---

## ⚖ Multi-Model Compare (v2.4.0)

Send the same prompt to all configured providers simultaneously and compare responses side-by-side.

**How to use:**
1. Configure 2+ API keys via ⚙ Settings
2. Write your prompt in the Playground
3. Click **"⚖ Compare (N models)"**
4. Results appear in a grid: response text, timing, token usage, copy button

**Technical details:**
- Uses `Promise.allSettled()` — one provider failing doesn't block others
- Each request has a 30-second timeout via AbortController
- Send button is disabled during comparison

## Security (v2.4.0)

- All API calls enforce a **30-second timeout** via AbortController
- API Settings modal shows a **security warning** about plaintext localStorage storage
- API keys are never sent anywhere except the selected provider's endpoint

---

## Programmatic Usage (JavaScript)

The Prompt Library can be imported and used programmatically in your own JavaScript/Node.js projects.

### Installation

```bash
npm install @dishine/prompt-library
```

### Core Module — Loading and Searching Prompts

```javascript
import {
  loadPrompts,
  findPlaceholders,
  extractTemplate,
  saveCustomPrompt,
  loadSavedCompositions,
  saveComposition,
  loadCustomPrompts
} from '@dishine/prompt-library';

// Load all 82+ prompts
const prompts = loadPrompts();
console.log(`Loaded ${prompts.length} prompts`);

// Find placeholders in a template
const template = '{{role}} should {{task}} for {{audience}}';
const placeholders = findPlaceholders(template);
// → ['{{role}}', '{{task}}', '{{audience}}']

// Extract the template section from a prompt's content
const prompt = prompts.find(p => p.slug === 'code-review');
const tmpl = extractTemplate(prompt.content);
```

### Search Module

```javascript
import { searchPrompts } from '@dishine/prompt-library/src/search.js';

const prompts = loadPrompts();
const results = searchPrompts(prompts, 'chain of thought');

for (const r of results) {
  console.log(`${r.slug} (score: ${r.score})`);
}
```

### Generator Module

```javascript
import {
  generatePrompt,
  getFrameworks,
  getFramework
} from '@dishine/prompt-library/src/generator.js';

// List available frameworks
const frameworks = getFrameworks();
frameworks.forEach(fw => {
  console.log(`${fw.key}: ${fw.name} — ${fw.description}`);
});

// Generate a prompt from a framework
const result = generatePrompt('expert-role', {
  role: 'senior data analyst',
  experience: '10+ years',
  domain: 'financial services',
  task: 'Analyze quarterly revenue trends and identify anomalies',
  audience: 'executive team',
  tone: 'professional',
  constraints: 'Use only provided data, cite specific numbers',
  output_format: 'structured markdown with tables'
});

console.log(result);
```

### Linter Module

```javascript
import { lintPrompt, formatLintResult } from '@dishine/prompt-library/src/linter.js';

const result = lintPrompt('Write me something good about dogs');
console.log(`Score: ${result.score}/100 (Grade: ${result.grade})`);
console.log(`Passed: ${result.passedCount}/${result.totalRules}`);

// Human-readable output
console.log(formatLintResult(result));
```

### Optimizer Module

```javascript
import { optimizePrompt } from '@dishine/prompt-library/src/optimizer.js';

const result = optimizePrompt('Can you help me write a blog post about AI?');
console.log(`Score: ${result.scoreBefore} → ${result.scoreAfter}`);
console.log(`Domain: ${result.domain}`);
console.log('Changes:', result.changes);
console.log('Optimized:', result.optimized);
```

### Recommender Module

```javascript
import { buildRecommendation } from '@dishine/prompt-library/src/recommender.js';

const prompts = loadPrompts();
const rec = buildRecommendation(prompts, 'I need to build a REST API');

console.log('Suggested combo:');
if (rec.suggestedCombo.systemPrompt) {
  console.log(`  System: ${rec.suggestedCombo.systemPrompt.title}`);
}
if (rec.suggestedCombo.framework) {
  console.log(`  Framework: ${rec.suggestedCombo.framework.title}`);
}
if (rec.suggestedCombo.template) {
  console.log(`  Template: ${rec.suggestedCombo.template.title}`);
}
```

---

## API Functions Reference

### `sendToAI(prompt, systemPrompt, provider, apiKey, model)`

Sends a prompt to an AI model and returns the response. Used by the Playground.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `prompt` | string | ✅ | The user prompt to send |
| `systemPrompt` | string | ❌ | Optional system prompt |
| `provider` | string | ✅ | `'openai'`, `'anthropic'`, or `'google'` |
| `apiKey` | string | ✅ | API key for the provider |
| `model` | string | ❌ | Model override (uses provider default if omitted) |

**Returns:**

```javascript
{
  text: "AI response text",
  model: "model-name",
  usage: { prompt_tokens: 50, completion_tokens: 200, total_tokens: 250 }
  // usage is null for Google provider
}
```

### `optimizeWithAI(text, provider, apiKey, model)`

Sends a prompt to an AI model for professional rewriting. Returns only the optimized prompt text.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `text` | string | ✅ | The prompt to optimize |
| `provider` | string | ✅ | `'openai'`, `'anthropic'`, or `'google'` |
| `apiKey` | string | ✅ | API key |
| `model` | string | ❌ | Model override |

**Returns:** `string` — the optimized prompt text.

The AI-powered optimizer uses a carefully crafted system prompt that instructs the model to:
1. Keep the original intent and meaning
2. Add structure with clear sections
3. Make instructions more specific
4. Add constraints and quality verification
5. Remove vague language
6. Return only the optimized prompt (no commentary)

---

**Navigation:** [← Tools: Linter, Optimizer, Recommender](Tools-Linter-Optimizer-Recommender) &nbsp;|&nbsp; [Architecture →](Architecture)
