/**
 * Prompt Optimizer — rewrites prompts following best practices.
 *
 * Rule-based: works without any API. Analyzes the prompt, identifies
 * missing elements, and produces an improved version with clear structure.
 *
 * Optionally calls an LLM API for AI-powered refinement (when keys are set).
 */

import { lintPrompt } from './linter.js';

/**
 * Extracts probable intent from a raw prompt.
 */
function extractIntent(text) {
  // Try to detect the core task
  const taskPatterns = [
    /(?:please |can you |i want you to |i need you to )(.+?)(?:\.|$)/im,
    /(?:your (?:task|job|goal) (?:is to |: ))(.+?)(?:\.|$)/im,
    /(?:write|create|generate|analyze|review|build|design|explain|summarize) (.+?)(?:\.|$)/im,
  ];

  for (const pattern of taskPatterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return null;
}

/**
 * Detects if a role is specified and extracts it.
 */
function extractRole(text) {
  const rolePatterns = [
    /you are (?:a |an )?(.+?)(?:\.|,|$)/im,
    /act as (?:a |an )?(.+?)(?:\.|,|$)/im,
    /role:\s*(.+?)(?:\n|$)/im,
  ];

  for (const pattern of rolePatterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return null;
}

/**
 * Rule-based prompt optimization — works entirely offline.
 * Restructures the prompt with best practices.
 */
export function optimizePrompt(text) {
  if (!text || typeof text !== 'string' || text.trim().length < 10) {
    return { optimized: text, changes: ['Prompt too short to optimize.'], lint: null };
  }

  const lint = lintPrompt(text);
  const changes = [];
  const sections = [];
  const existingRole = extractRole(text);
  const existingTask = extractIntent(text);

  // 1. Add role if missing
  if (!lint.passed.find(r => r.id === 'has-role')) {
    if (existingTask) {
      sections.push(`You are an expert assistant specialized in the following task.`);
      changes.push('Added role definition (generic expert — customize for better results)');
    }
  }

  // 2. Restructure the core prompt
  // Clean up the original text: remove excessive "please", tighten language
  let cleaned = text.trim();

  // Remove excessive politeness
  const pleaseCount = (cleaned.match(/\bplease\b/gi) || []).length;
  if (pleaseCount > 2) {
    let count = 0;
    cleaned = cleaned.replace(/\bplease\b/gi, (match) => {
      count++;
      return count <= 1 ? match : '';
    });
    cleaned = cleaned.replace(/\s{2,}/g, ' ');
    changes.push('Reduced excessive "please" usage (direct instructions work better)');
  }

  // 3. Build structured sections
  const hasHeaders = /^(#{1,3} |[A-Z][A-Z ]+:)/m.test(cleaned);

  if (hasHeaders) {
    // Already structured — keep as-is but ensure we add missing elements
    sections.push(cleaned);
  } else {
    // Restructure into sections
    if (existingRole) {
      sections.push(`ROLE:\n${existingRole}`);
    }

    // Extract the main content as the task
    let taskContent = cleaned;
    if (existingRole) {
      // Remove the role sentence from the main content
      taskContent = taskContent.replace(/you are (?:a |an )?.+?(?:\.|,)/i, '').trim();
      taskContent = taskContent.replace(/act as (?:a |an )?.+?(?:\.|,)/i, '').trim();
    }

    sections.push(`TASK:\n${taskContent}`);
    changes.push('Organized prompt into clear labeled sections');
  }

  // 4. Add output format if missing
  if (!lint.passed.find(r => r.id === 'has-output-format')) {
    sections.push(`OUTPUT FORMAT:\nProvide your response in a clear, structured format with headings where appropriate.`);
    changes.push('Added output format specification');
  }

  // 5. Add constraints if missing
  if (!lint.passed.find(r => r.id === 'has-constraints')) {
    sections.push(`RULES:\n- Be accurate and specific\n- Acknowledge uncertainty rather than guessing\n- Provide actionable recommendations`);
    changes.push('Added basic quality constraints');
  }

  // 6. Add quality check if missing
  if (!lint.passed.find(r => r.id === 'has-quality-check')) {
    sections.push(`Before responding, verify that your answer is complete, accurate, and directly addresses the task.`);
    changes.push('Added quality verification step');
  }

  const optimized = sections.join('\n\n');
  const newLint = lintPrompt(optimized);

  return {
    original: text,
    optimized,
    changes,
    scoreBefore: lint.score,
    scoreAfter: newLint.score,
    improvement: newLint.score - lint.score,
    lint: newLint,
  };
}

/**
 * AI-powered optimization — sends the prompt to an LLM for rewriting.
 * Requires an API key. Supports OpenAI, Anthropic, and Google.
 */
export async function optimizeWithAI(text, provider, apiKey, model) {
  const systemPrompt = `You are an expert prompt engineer. Your task is to optimize the following prompt.

RULES:
1. Keep the original intent and meaning exactly the same
2. Add structure with clear sections (ROLE, TASK, CONTEXT, OUTPUT FORMAT, RULES)
3. Make instructions more specific and actionable
4. Add constraints that prevent common AI mistakes
5. Add a quality verification step
6. Remove vague language and replace with specific criteria
7. Keep the optimized prompt concise — don't add unnecessary padding

Return ONLY the optimized prompt, nothing else. No explanations, no commentary.`;

  const userMessage = `Optimize this prompt:\n\n${text}`;

  if (provider === 'openai') {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });
    if (!resp.ok) throw new Error(`OpenAI API error: ${resp.status} ${resp.statusText}`);
    const data = await resp.json();
    return data.choices[0].message.content;
  }

  if (provider === 'anthropic') {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });
    if (!resp.ok) throw new Error(`Anthropic API error: ${resp.status} ${resp.statusText}`);
    const data = await resp.json();
    return data.content[0].text;
  }

  if (provider === 'google') {
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-2.0-flash'}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 2000 },
      }),
    });
    if (!resp.ok) throw new Error(`Google API error: ${resp.status} ${resp.statusText}`);
    const data = await resp.json();
    return data.candidates[0].content.parts[0].text;
  }

  throw new Error(`Unsupported provider: ${provider}`);
}

/**
 * Send a prompt to an AI model and get a response (Playground).
 */
export async function sendToAI(prompt, systemPrompt, provider, apiKey, model) {
  if (provider === 'openai') {
    const messages = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: prompt });

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model: model || 'gpt-4o-mini', messages, temperature: 0.7, max_tokens: 4000 }),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(`OpenAI: ${err.error?.message || resp.statusText}`);
    }
    const data = await resp.json();
    return {
      text: data.choices[0].message.content,
      model: data.model,
      usage: data.usage,
    };
  }

  if (provider === 'anthropic') {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: systemPrompt || undefined,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(`Anthropic: ${err.error?.message || resp.statusText}`);
    }
    const data = await resp.json();
    return {
      text: data.content[0].text,
      model: data.model,
      usage: data.usage,
    };
  }

  if (provider === 'google') {
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-2.0-flash'}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4000 },
      }),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(`Google: ${err.error?.message || resp.statusText}`);
    }
    const data = await resp.json();
    return {
      text: data.candidates[0].content.parts[0].text,
      model: model || 'gemini-2.0-flash',
      usage: null,
    };
  }

  throw new Error(`Unsupported provider: ${provider}`);
}
