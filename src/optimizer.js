/**
 * Prompt Optimizer — dynamically rewrites prompts following best practices.
 *
 * Content-aware: detects the domain, intent, audience, and task type then
 * applies targeted improvements specific to the prompt's actual content.
 *
 * Optionally calls an LLM API for AI-powered refinement (when keys are set).
 */

import { lintPrompt } from './linter.js';

/* ── Domain detection ── */

const DOMAIN_SIGNALS = {
  coding: {
    keywords: /\b(code|programming|developer|software|api|debug|refactor|test|function|class|module|deploy|git|bug|feature|backend|frontend|fullstack|algorithm|database|sql|javascript|python|typescript|java|c\+\+|rust|go|html|css|react|node|docker|ci\/cd|pull request|commit|repository)\b/i,
    role: 'senior software engineer with deep expertise in software architecture and clean code practices',
    constraints: [
      'Follow established coding conventions and style guides',
      'Prioritize readability, maintainability, and testability',
      'Include error handling and edge cases',
      'Suggest relevant design patterns when applicable',
    ],
    outputFormat: 'Respond with well-commented code blocks. Use markdown code fences with the appropriate language tag. Explain key decisions briefly above each code block.',
    qualityCheck: 'Before responding, verify that the code compiles/runs correctly, handles edge cases, follows best practices, and includes appropriate error handling.',
  },
  writing: {
    keywords: /\b(write|blog|article|copy|content|essay|email|letter|documentation|story|narrative|draft|publish|headline|paragraph|outline|creative writing|copywriting|technical writing|editing|proofread)\b/i,
    role: 'experienced content strategist and professional writer with expertise in clear, engaging communication',
    constraints: [
      'Use clear, concise language appropriate to the target audience',
      'Maintain a consistent tone and voice throughout',
      'Structure content with logical flow and smooth transitions',
      'Support claims with specific details or examples',
    ],
    outputFormat: 'Respond in well-structured prose with clear headings, short paragraphs, and a logical narrative flow. Use markdown formatting.',
    qualityCheck: 'Before responding, verify that the writing is clear, free of jargon (unless appropriate), logically structured, and engaging for the target audience.',
  },
  marketing: {
    keywords: /\b(marketing|seo|social media|campaign|ads|brand|landing page|conversion|funnel|audience|engagement|roi|analytics|a\/b test|growth|lead|cta|value proposition|positioning|competitor|market research)\b/i,
    role: 'senior marketing strategist with expertise in digital marketing, brand positioning, and conversion optimization',
    constraints: [
      'Ground recommendations in data and measurable outcomes',
      'Consider the target audience demographics and psychographics',
      'Align suggestions with brand voice and positioning',
      'Include specific, actionable next steps with expected impact',
    ],
    outputFormat: 'Respond with clear sections covering strategy, tactics, and metrics. Use bullet points for actionable items. Include specific KPIs to track success.',
    qualityCheck: 'Before responding, verify that recommendations are actionable, measurable, aligned with the stated goals, and realistic for the described context.',
  },
  data: {
    keywords: /\b(data|analysis|sql|database|dashboard|report|statistics|visualization|csv|excel|analytics|metrics|dataset|query|aggregate|trend|forecast|machine learning|ml|ai model|prediction|regression|classification|etl|pipeline)\b/i,
    role: 'senior data analyst with expertise in statistical analysis, data visualization, and deriving actionable insights from complex datasets',
    constraints: [
      'Cite specific data points and statistical measures',
      'Distinguish between correlation and causation',
      'Acknowledge data limitations and confidence levels',
      'Present findings with appropriate precision — avoid false accuracy',
    ],
    outputFormat: 'Respond with structured analysis including: summary of findings, methodology, key insights (with supporting data), and recommended actions. Use tables for comparative data.',
    qualityCheck: 'Before responding, verify that the analysis is statistically sound, conclusions are supported by the data, limitations are acknowledged, and recommendations are actionable.',
  },
  business: {
    keywords: /\b(business|proposal|meeting|stakeholder|strategy|okr|pitch|client|budget|revenue|profit|operations|management|leadership|negotiation|contract|vendor|project plan|risk assessment|swot|roi|kpi|quarterly|annual)\b/i,
    role: 'experienced business consultant with expertise in strategic planning, operations management, and stakeholder communication',
    constraints: [
      'Frame recommendations in terms of business impact and ROI',
      'Consider risks, dependencies, and resource constraints',
      'Use concrete numbers and timelines where possible',
      'Address stakeholder concerns and alignment',
    ],
    outputFormat: 'Respond with an executive summary followed by detailed analysis. Use bullet points for recommendations. Include timeline, resource requirements, and risk considerations.',
    qualityCheck: 'Before responding, verify that recommendations are financially sound, risks are addressed, timelines are realistic, and the proposal is ready for stakeholder review.',
  },
  education: {
    keywords: /\b(teach|explain|tutor|learn|student|course|education|lesson|curriculum|quiz|assessment|pedagogy|simplify|break down|step by step|beginner|concept|understand)\b/i,
    role: 'experienced educator and subject matter expert skilled at breaking down complex concepts into clear, digestible explanations',
    constraints: [
      'Build from foundational concepts to advanced topics',
      'Use analogies and real-world examples to illustrate abstract ideas',
      'Check for understanding with questions or summaries',
      'Adapt complexity to the learner\'s stated level',
    ],
    outputFormat: 'Respond with a clear explanation structured from simple to complex. Use numbered steps for processes, include examples for each concept, and end with a brief summary.',
    qualityCheck: 'Before responding, verify that the explanation is accurate, accessible to the target audience, logically ordered, and includes helpful examples.',
  },
  image: {
    keywords: /\b(image|photo|visual|design|logo|illustration|portrait|scene|art|render|drawing|graphic|aesthetic|composition|lighting|style|midjourney|dall-e|stable diffusion|prompt engineering|photorealistic|cinematic)\b/i,
    role: 'expert visual artist and AI image prompt engineer with deep knowledge of art styles, composition, lighting, and how to translate visual concepts into effective AI image prompts',
    constraints: [
      'Include specific details about composition, lighting, and mood',
      'Reference concrete art styles or artists for clarity',
      'Specify aspect ratio, resolution, and technical parameters',
      'Use descriptive, sensory language rather than abstract terms',
    ],
    outputFormat: 'Respond with a detailed image prompt that includes: subject, style, composition, lighting, mood, color palette, and any technical parameters. Separate negative prompts if applicable.',
    qualityCheck: 'Before responding, verify that the image description is specific enough to produce consistent results, includes all necessary visual parameters, and avoids ambiguous language.',
  },
};

/**
 * Detects the primary domain of the prompt content.
 * Returns the top-matching domain key and match details.
 */
function detectDomain(text) {
  const lower = text.toLowerCase();
  let best = { domain: null, score: 0 };

  for (const [domain, config] of Object.entries(DOMAIN_SIGNALS)) {
    const matches = lower.match(config.keywords);
    const score = matches ? matches.length : 0;
    if (score > best.score) {
      best = { domain, score, config };
    }
  }

  return best.score > 0 ? best : { domain: 'general', score: 0, config: null };
}

/* ── Vague language replacement ── */

const VAGUE_REPLACEMENTS = [
  { pattern: /\b(a |the )?good (way|approach|method|solution)\b/gi, replacement: 'an effective, well-reasoned $2' },
  { pattern: /\bmake it good\b/gi, replacement: 'ensure it is clear, thorough, and well-structured' },
  { pattern: /\bdo a good job\b/gi, replacement: 'produce high-quality, accurate work' },
  { pattern: /\bsomething good\b/gi, replacement: 'a well-crafted, effective result' },
  { pattern: /\bsomething nice\b/gi, replacement: 'a polished, professional result' },
  { pattern: /\bnice (\w+)\b/gi, replacement: 'well-crafted, polished $1' },
  { pattern: /\bgood (\w+)\b/gi, replacement: 'high-quality $1' },
  { pattern: /\bproper(ly)?\b/gi, replacement: 'correct$1 and following established standards' },
  { pattern: /\bappropriate\b/gi, replacement: 'suitable for the stated context and audience' },
  { pattern: /\binteresting\b/gi, replacement: 'insightful and thought-provoking' },
  { pattern: /\bas much as possible\b/gi, replacement: 'comprehensively, covering all key aspects' },
  { pattern: /\betc\.?\b/gi, replacement: 'and related items' },
  { pattern: /\bstuff\b/gi, replacement: 'components' },
  { pattern: /\bthings\b/gi, replacement: 'elements' },
];

/**
 * Replaces vague language with specific alternatives.
 * Returns the improved text and list of changes made.
 */
function replaceVagueLanguage(text) {
  let result = text;
  const replacements = [];

  for (const { pattern, replacement } of VAGUE_REPLACEMENTS) {
    const before = result;
    result = result.replace(pattern, replacement);
    if (result !== before) {
      replacements.push(`Replaced vague language: "${before.match(pattern)?.[0] || ''}" → more specific`);
    }
  }

  return { text: result, replacements };
}

/* ── Weak verb strengthening ── */

const WEAK_VERB_PATTERNS = [
  { pattern: /\b(can you|could you) /gi, replacement: '' },
  { pattern: /\bi want you to /gi, replacement: '' },
  { pattern: /\bi need you to /gi, replacement: '' },
  { pattern: /\bi would like you to /gi, replacement: '' },
  { pattern: /\btry to /gi, replacement: '' },
  { pattern: /\bmaybe /gi, replacement: '' },
  { pattern: /\bif possible,? /gi, replacement: '' },
  { pattern: /\bkind of /gi, replacement: '' },
  { pattern: /\bsort of /gi, replacement: '' },
  { pattern: /\bjust /gi, replacement: '' },
];

/**
 * Replaces weak, hedging language with direct instructions.
 */
function strengthenVerbs(text) {
  let result = text;
  let count = 0;

  for (const { pattern, replacement } of WEAK_VERB_PATTERNS) {
    const before = result;
    result = result.replace(pattern, replacement);
    if (result !== before) count++;
  }

  // Capitalize the first letter of sentences after removing weak openings
  result = result.replace(/(^|[.!?]\s+)([a-z])/g, (_, pre, letter) => pre + letter.toUpperCase());

  return { text: result, count };
}

/* ── Filler and redundancy removal ── */

/**
 * Removes filler phrases and redundant content.
 */
function removeFiller(text) {
  const fillers = [
    /\b(basically|essentially|actually|literally|honestly|obviously|clearly|simply put|in other words|as you know|it goes without saying|needless to say)\b,?\s*/gi,
    /\b(I think|I believe|I feel like|in my opinion|from my perspective)\s+/gi,
  ];

  let result = text;
  let count = 0;
  for (const pattern of fillers) {
    const before = result;
    result = result.replace(pattern, '');
    if (result !== before) count++;
  }

  result = result.replace(/\s{2,}/g, ' ').trim();
  return { text: result, count };
}

/* ── Task decomposition ── */

/**
 * Detects if a prompt contains a compound task that should be broken into steps.
 */
function detectCompoundTask(text) {
  // Look for "and" joining multiple verbs or multiple sentences without structure
  const verbPhrases = text.match(/\b(write|create|generate|analyze|review|build|design|explain|summarize|compare|evaluate|implement|test|debug|optimize|format|translate|research|plan|organize|draft|edit)\b/gi);
  return verbPhrases ? [...new Set(verbPhrases.map(v => v.toLowerCase()))] : [];
}

/**
 * Decomposes compound tasks into numbered steps.
 */
function decomposeTask(text, verbs) {
  if (verbs.length < 2) return null;

  // Split by conjunctions and sentence boundaries to find discrete sub-tasks
  const parts = text.split(/\s*(?:,\s*(?:and|then)\s+|\.\s+|;\s*|\s+and\s+then\s+|\s+then\s+)/i)
    .map(p => p.trim())
    .filter(p => p.length > 10);

  if (parts.length >= 2) {
    return parts.map((p, i) => `${i + 1}. ${p.charAt(0).toUpperCase() + p.slice(1)}`).join('\n');
  }
  return null;
}

/* ── Audience and tone detection ── */

function detectAudience(text) {
  const audienceMap = [
    { pattern: /\b(beginner|newbie|novice|introductory|basic|simple)\b/i, audience: 'beginners', tone: 'approachable and jargon-free' },
    { pattern: /\b(expert|advanced|senior|experienced|deep dive|in-depth)\b/i, audience: 'experts', tone: 'technical and detailed' },
    { pattern: /\b(executive|c-suite|leadership|board|stakeholder|ceo|cfo|cto)\b/i, audience: 'executives', tone: 'concise, strategic, and results-focused' },
    { pattern: /\b(student|learner|class|course|assignment|homework)\b/i, audience: 'students', tone: 'clear, educational, and encouraging' },
    { pattern: /\b(client|customer|user|end.user|consumer)\b/i, audience: 'clients', tone: 'professional and clear' },
    { pattern: /\b(developer|engineer|programmer|tech team)\b/i, audience: 'developers', tone: 'technical and precise' },
  ];

  for (const { pattern, audience, tone } of audienceMap) {
    if (pattern.test(text)) return { audience, tone };
  }
  return null;
}

/* ── Intent extraction ── */

function extractIntent(text) {
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

/* ── Role extraction ── */

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

/* ── Main optimizer ── */

/**
 * Dynamic, content-aware prompt optimization — works entirely offline.
 * Analyzes the prompt's actual content and applies targeted improvements.
 */
export function optimizePrompt(text) {
  if (!text || typeof text !== 'string' || text.trim().length < 10) {
    return { optimized: text, changes: ['Prompt too short to optimize.'], lint: null };
  }

  const lint = lintPrompt(text);
  const changes = [];
  let working = text.trim();

  // ── Step 1: Detect domain and context ──
  const domain = detectDomain(working);
  const audience = detectAudience(working);
  const existingRole = extractRole(working);
  const compoundVerbs = detectCompoundTask(working);

  // ── Step 2: Clean up — remove filler and redundancy ──
  const filler = removeFiller(working);
  if (filler.count > 0) {
    working = filler.text;
    changes.push('Removed filler words and redundant phrases for clarity');
  }

  // ── Step 3: Remove excessive politeness ──
  const pleaseCount = (working.match(/\bplease\b/gi) || []).length;
  if (pleaseCount > 2) {
    let count = 0;
    working = working.replace(/\bplease\b/gi, (match) => {
      count++;
      return count <= 1 ? match : '';
    });
    working = working.replace(/\s{2,}/g, ' ');
    changes.push('Reduced excessive "please" usage (direct instructions work better)');
  }

  // ── Step 4: Strengthen weak verbs ──
  const strengthened = strengthenVerbs(working);
  if (strengthened.count > 0) {
    working = strengthened.text;
    changes.push('Replaced weak/hedging language with direct instructions');
  }

  // ── Step 5: Replace vague language ──
  const vagueResult = replaceVagueLanguage(working);
  if (vagueResult.replacements.length > 0) {
    working = vagueResult.text;
    changes.push('Replaced vague language with specific, measurable terms');
  }

  // ── Step 6: Build structured sections ──
  const sections = [];
  const hasHeaders = /^(#{1,3} |[A-Z][A-Z ]+:)/m.test(working);

  // Role — domain-specific instead of generic
  if (!lint.passed.find(r => r.id === 'has-role')) {
    if (domain.config) {
      sections.push(`You are a ${domain.config.role}.`);
      changes.push(`Added domain-specific role (${domain.domain})`);
    } else {
      // Infer a role from the task
      const intent = extractIntent(text);
      if (intent) {
        sections.push(`You are an expert assistant specialized in: ${intent}.`);
        changes.push('Added role definition based on detected task');
      }
    }
  }

  // Task content — restructure if needed
  if (hasHeaders) {
    sections.push(working);
  } else {
    let taskContent = working;
    if (existingRole) {
      sections.push(`ROLE:\n${existingRole}`);
      taskContent = taskContent.replace(/you are (?:a |an )?.+?(?:\.|,)/i, '').trim();
      taskContent = taskContent.replace(/act as (?:a |an )?.+?(?:\.|,)/i, '').trim();
    }

    // Decompose compound tasks into steps
    const decomposed = decomposeTask(taskContent, compoundVerbs);
    if (decomposed && compoundVerbs.length >= 3) {
      sections.push(`TASK:\n${decomposed}`);
      changes.push(`Decomposed compound task into ${compoundVerbs.length} clear steps`);
    } else {
      sections.push(`TASK:\n${taskContent}`);
    }
    changes.push('Organized prompt into clear labeled sections');
  }

  // Context — add if the prompt references external data
  if (!lint.passed.find(r => r.id === 'has-context')) {
    if (/\b(this|these|the above|below|following data|attached|provided)\b/i.test(text)) {
      sections.push(`CONTEXT:\nProvide the relevant data, documents, or background information here.`);
      changes.push('Added context placeholder — fill in your specific background information');
    }
  }

  // Audience — add if detected but not stated
  if (!lint.passed.find(r => r.id === 'has-audience') && audience) {
    sections.push(`TARGET AUDIENCE:\nThis is for ${audience.audience}.`);
    changes.push(`Added detected target audience: ${audience.audience}`);
  }

  // Tone — add based on audience or domain
  if (!lint.passed.find(r => r.id === 'has-tone')) {
    if (audience) {
      sections.push(`TONE:\nBe ${audience.tone}.`);
      changes.push(`Added tone guidance: ${audience.tone}`);
    } else if (domain.config) {
      const domainTones = {
        coding: 'technical, precise, and practical',
        writing: 'clear, engaging, and well-paced',
        marketing: 'persuasive, data-driven, and actionable',
        data: 'analytical, precise, and objective',
        business: 'professional, strategic, and concise',
        education: 'clear, encouraging, and accessible',
        image: 'descriptive, vivid, and specific',
      };
      if (domainTones[domain.domain]) {
        sections.push(`TONE:\nBe ${domainTones[domain.domain]}.`);
        changes.push(`Added domain-appropriate tone guidance`);
      }
    }
  }

  // Output format — domain-specific instead of generic
  if (!lint.passed.find(r => r.id === 'has-output-format')) {
    if (domain.config) {
      sections.push(`OUTPUT FORMAT:\n${domain.config.outputFormat}`);
      changes.push(`Added ${domain.domain}-specific output format`);
    } else {
      sections.push(`OUTPUT FORMAT:\nProvide your response in a clear, structured format with headings where appropriate.`);
      changes.push('Added output format specification');
    }
  }

  // Constraints — domain-specific instead of generic
  if (!lint.passed.find(r => r.id === 'has-constraints')) {
    if (domain.config) {
      const rules = domain.config.constraints.map(c => `- ${c}`).join('\n');
      sections.push(`RULES:\n${rules}`);
      changes.push(`Added ${domain.domain}-specific quality constraints`);
    } else {
      sections.push(`RULES:\n- Be accurate and specific\n- Acknowledge uncertainty rather than guessing\n- Provide actionable recommendations`);
      changes.push('Added quality constraints');
    }
  }

  // Examples — suggest adding them if missing
  if (!lint.passed.find(r => r.id === 'has-examples') && domain.domain !== 'general') {
    const exampleHints = {
      coding: 'Example input:\n```\n// Paste a sample input here\n```\n\nExpected output:\n```\n// Describe the expected result\n```',
      writing: 'Example of desired style:\n> Paste a paragraph in the tone/style you want here.',
      marketing: 'Example campaign brief or reference:\n> Describe a successful campaign you want to emulate.',
      data: 'Sample data:\n```\n| Column1 | Column2 |\n|---------|----------|\n| value   | value    |\n```',
      business: 'Example deliverable:\n> Describe or paste a sample of the output format you expect.',
      education: 'Example explanation level:\n> "Explain it like I\'m a college freshman studying computer science."',
      image: 'Example reference:\n> "Style similar to Studio Ghibli backgrounds — soft lighting, pastel colors, detailed nature."',
    };
    if (exampleHints[domain.domain]) {
      sections.push(`EXAMPLES:\n${exampleHints[domain.domain]}`);
      changes.push(`Added ${domain.domain}-specific example placeholder`);
    }
  }

  // Quality check — domain-specific instead of generic
  if (!lint.passed.find(r => r.id === 'has-quality-check')) {
    if (domain.config) {
      sections.push(domain.config.qualityCheck);
      changes.push(`Added ${domain.domain}-specific quality verification step`);
    } else {
      sections.push('Before responding, verify that your answer is complete, accurate, and directly addresses the task.');
      changes.push('Added quality verification step');
    }
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
    domain: domain.domain,
    audience: audience ? audience.audience : null,
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
