/**
 * Prompt Linter — analyzes prompts for common anti-patterns and quality issues.
 *
 * Produces a 0–100 score plus actionable suggestions. No external dependencies.
 * Works both in CLI (Node.js) and browser (viewer.html embeds a copy).
 */

const RULES = [
  {
    id: 'has-role',
    name: 'Role definition',
    weight: 10,
    description: 'Good prompts specify who the AI should be',
    test: (text) => /you are|act as|role:|persona:|as a/i.test(text),
    suggestion: 'Add a role definition like "You are a senior [role] expert…"',
  },
  {
    id: 'has-task',
    name: 'Clear task',
    weight: 12,
    description: 'The prompt states what the AI should do',
    test: (text) => /task:|your (job|goal|task)|objective:|you (will|should|must)|please (help|create|write|generate|analyze)/i.test(text),
    suggestion: 'State the task explicitly: "Your task is to…" or "Please [action]…"',
  },
  {
    id: 'has-context',
    name: 'Context provided',
    weight: 8,
    description: 'Background information helps the AI understand the situation',
    test: (text) => /context:|background:|situation:|given (that|the)|here is|the following/i.test(text),
    suggestion: 'Add context: "Context: …" or "Given the following information: …"',
  },
  {
    id: 'has-output-format',
    name: 'Output format specified',
    weight: 10,
    description: 'Specifying the expected output format improves consistency',
    test: (text) => /output( format)?:|format:|respond (in|with|using)|use (markdown|json|bullet|table|list)|structured as/i.test(text),
    suggestion: 'Specify the output format: "Respond in [format]" or "Output format: …"',
  },
  {
    id: 'has-constraints',
    name: 'Constraints or rules',
    weight: 8,
    description: 'Rules and constraints prevent unwanted behavior',
    test: (text) => /rule|constraint|never|always|do not|must not|important:|don't|avoid|ensure/i.test(text),
    suggestion: 'Add constraints: "Rules: …" or "Never do X" / "Always do Y"',
  },
  {
    id: 'sufficient-length',
    name: 'Sufficient detail',
    weight: 8,
    description: 'Short prompts often produce vague results (aim for 50+ words)',
    test: (text) => text.split(/\s+/).length >= 50,
    suggestion: 'Your prompt is quite short. Add more detail about what you want.',
  },
  {
    id: 'not-too-long',
    name: 'Not excessively long',
    weight: 5,
    description: 'Very long prompts can confuse the model (aim for under 2000 words)',
    test: (text) => text.split(/\s+/).length <= 2000,
    suggestion: 'Your prompt is very long. Consider breaking it into sections or simplifying.',
  },
  {
    id: 'has-examples',
    name: 'Examples included',
    weight: 7,
    description: 'Examples help the AI understand what you expect',
    test: (text) => /example:|for example|e\.g\.|such as|here is an example|sample:/i.test(text),
    suggestion: 'Add examples of expected input/output to guide the AI.',
  },
  {
    id: 'has-sections',
    name: 'Structured sections',
    weight: 7,
    description: 'Well-organized prompts with headers are easier for AI to follow',
    test: (text) => {
      const headers = text.match(/^(#{1,3} |[A-Z][A-Z ]+:)/gm);
      return headers && headers.length >= 2;
    },
    suggestion: 'Organize your prompt with clear sections using headers or labels.',
  },
  {
    id: 'no-vague-language',
    name: 'Specific language',
    weight: 7,
    description: 'Avoid vague words like "good", "nice", "proper" without definition',
    test: (text) => {
      const vague = text.match(/\b(good|nice|proper|appropriate|best|great|interesting|relevant)\b/gi);
      return !vague || vague.length <= 3;
    },
    suggestion: 'Replace vague words (good, nice, proper) with specific criteria.',
  },
  {
    id: 'has-audience',
    name: 'Target audience',
    weight: 5,
    description: 'Specifying who will read the output improves quality',
    test: (text) => /audience:|target:|for (a |an )?(beginner|expert|developer|manager|executive|student|client|user|reader)/i.test(text),
    suggestion: 'Specify the target audience: "This is for [audience]…"',
  },
  {
    id: 'has-tone',
    name: 'Tone specified',
    weight: 5,
    description: 'Defining the tone ensures consistent communication style',
    test: (text) => /tone:|style:|voice:|be (professional|casual|formal|friendly|technical|concise|detailed)/i.test(text),
    suggestion: 'Define the tone: "Use a [professional/casual/technical] tone."',
  },
  {
    id: 'no-please-overuse',
    name: 'Not overly polite',
    weight: 3,
    description: '"Please" once is fine; repeating it wastes tokens and weakens instructions',
    test: (text) => {
      const pleaseCount = (text.match(/\bplease\b/gi) || []).length;
      return pleaseCount <= 2;
    },
    suggestion: 'Reduce "please" usage — direct instructions work better with AI.',
  },
  {
    id: 'has-quality-check',
    name: 'Quality verification step',
    weight: 5,
    description: 'Asking the AI to verify its work improves accuracy',
    test: (text) => /verif|check your|review your|double.check|ensure (accuracy|quality)|before (responding|answering)/i.test(text),
    suggestion: 'Add a quality check: "Before responding, verify that…"',
  },
];

export function lintPrompt(text) {
  if (!text || typeof text !== 'string') {
    return { score: 0, grade: 'F', passed: [], failed: RULES.map(r => ({ ...r, passed: false })), suggestions: ['Provide a prompt to analyze.'] };
  }

  const passed = [];
  const failed = [];
  let earnedWeight = 0;
  let totalWeight = 0;

  for (const rule of RULES) {
    totalWeight += rule.weight;
    const result = rule.test(text);
    if (result) {
      earnedWeight += rule.weight;
      passed.push({ ...rule, passed: true });
    } else {
      failed.push({ ...rule, passed: false });
    }
  }

  const score = Math.round((earnedWeight / totalWeight) * 100);
  const grade = score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 40 ? 'D' : 'F';

  const suggestions = failed
    .sort((a, b) => b.weight - a.weight)
    .map(r => r.suggestion);

  return {
    score,
    grade,
    totalRules: RULES.length,
    passedCount: passed.length,
    failedCount: failed.length,
    passed,
    failed,
    suggestions,
    wordCount: text.split(/\s+/).length,
  };
}

/** Quick summary string for CLI / display */
export function formatLintResult(result) {
  let out = '';
  out += `\n  Score: ${result.score}/100 (Grade: ${result.grade})\n`;
  out += `  Rules: ${result.passedCount}/${result.totalRules} passed | ${result.wordCount} words\n\n`;

  if (result.passed.length > 0) {
    out += `  ✅ Passing:\n`;
    for (const r of result.passed) {
      out += `     • ${r.name}\n`;
    }
    out += '\n';
  }

  if (result.suggestions.length > 0) {
    out += `  💡 Suggestions to improve:\n`;
    for (const s of result.suggestions) {
      out += `     → ${s}\n`;
    }
    out += '\n';
  }

  return out;
}

export { RULES as LINT_RULES };
