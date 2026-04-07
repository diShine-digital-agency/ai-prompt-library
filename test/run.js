import { loadPrompts, findPlaceholders, extractTemplate, saveCustomPrompt, loadCustomPrompts, USER_DATA_DIR } from '../src/index.js';
import { searchPrompts } from '../src/search.js';
import { getFrameworks, getFramework, generatePrompt } from '../src/generator.js';
import { existsSync, mkdirSync, writeFileSync, unlinkSync, rmSync } from 'fs';
import { join } from 'path';

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    console.log(`  PASS: ${msg}`);
    passed++;
  } else {
    console.error(`  FAIL: ${msg}`);
    failed++;
  }
}

console.log('Running tests...\n');

// ── Core: Load prompts ──
const prompts = loadPrompts();
assert(prompts.length > 0, `Loaded ${prompts.length} prompts (expected > 0)`);
assert(prompts.length >= 42, `Loaded at least 42 prompts (got ${prompts.length})`);

// ── Core: Required fields ──
const first = prompts[0];
assert(typeof first.slug === 'string' && first.slug.length > 0, 'Prompt has slug');
assert(typeof first.title === 'string' && first.title.length > 0, 'Prompt has title');
assert(typeof first.category === 'string', 'Prompt has category');
assert(Array.isArray(first.tags), 'Prompt tags is an array');
assert(typeof first.content === 'string' && first.content.length > 0, 'Prompt has content');

// ── Search ──
const results = searchPrompts(prompts, 'chain of thought');
assert(results.length > 0, `Search "chain of thought" returned ${results.length} results`);
assert(results[0].score > 0, 'Top result has positive score');

const cot = results.find(r => r.slug === 'chain-of-thought');
if (cot) {
  assert(cot.score >= 100, 'chain-of-thought prompt scores >= 100 for its own title');
}

// ── Categories ──
const categories = [...new Set(prompts.map(p => p.category))];
assert(categories.length >= 7, `Found ${categories.length} categories (expected >= 7)`);

// ── findPlaceholders ──
const phs = findPlaceholders('Hello {{name}}, your {{task}} is {{name}} again');
assert(phs.length === 2, `findPlaceholders found ${phs.length} unique placeholders (expected 2)`);
assert(phs.includes('{{name}}'), 'findPlaceholders found {{name}}');
assert(phs.includes('{{task}}'), 'findPlaceholders found {{task}}');

const noPhs = findPlaceholders('No placeholders here');
assert(noPhs.length === 0, 'findPlaceholders returns empty for no placeholders');

// ── extractTemplate ──
const sampleContent = `# Title\n\n## Template\n\n\`\`\`\nHello {{name}}\n\`\`\`\n\n## Tips`;
const tpl = extractTemplate(sampleContent);
assert(tpl !== null, 'extractTemplate extracts template section');
assert(tpl.includes('{{name}}'), 'extractTemplate preserves placeholders');

const noTplContent = '# Title\n\nNo template section here';
assert(extractTemplate(noTplContent) === null, 'extractTemplate returns null when no template');

// ── Generator: Framework listing ──
const frameworks = getFrameworks();
assert(frameworks.length >= 5, `Generator has ${frameworks.length} frameworks (expected >= 5)`);
assert(frameworks.every(f => f.key && f.name && f.description), 'All frameworks have key, name, description');
assert(frameworks.every(f => Array.isArray(f.questions)), 'All frameworks have questions array');

// ── Generator: Prompt generation ──
const expertResult = generatePrompt('expert-role', {
  role: 'data analyst',
  domain: 'business intelligence',
  task: 'Build SQL queries from natural language',
});
assert(typeof expertResult === 'string' && expertResult.length > 100, 'expert-role generates a prompt');
assert(expertResult.includes('data analyst'), 'Generated prompt includes the role');

const cotResult = generatePrompt('chain-of-thought', {
  task: 'Solve math problems',
  domain: 'mathematics',
  output: 'Step-by-step solution with final answer',
});
assert(typeof cotResult === 'string' && cotResult.length > 100, 'chain-of-thought generates a prompt');

// ── Generator: Error handling ──
let errorCaught = false;
try {
  generatePrompt('nonexistent-framework', {});
} catch {
  errorCaught = true;
}
assert(errorCaught, 'generatePrompt throws for unknown framework');

// ── Linter ──
import { lintPrompt, LINT_RULES } from '../src/linter.js';

const goodPrompt = `You are a senior data analyst with 10 years of experience.

TASK:
Your task is to analyze the provided dataset and generate insights.

CONTEXT:
Given the following sales data for Q4 2025.

OUTPUT FORMAT:
Respond in structured markdown with headings.

RULES:
- Always provide specific numbers
- Never guess — acknowledge uncertainty
- Be professional and concise

Before responding, verify that your analysis is complete and accurate.

For example, if you see a spike in December, explain possible seasonal factors.`;

const lintGood = lintPrompt(goodPrompt);
assert(lintGood.score >= 70, `Linter scores good prompt at ${lintGood.score} (expected >= 70)`);
assert(lintGood.grade === 'A' || lintGood.grade === 'B', `Linter grades good prompt as ${lintGood.grade}`);
assert(lintGood.passedCount > lintGood.failedCount, 'Good prompt has more passes than fails');

const badPrompt = 'please help me write something good and nice';
const lintBad = lintPrompt(badPrompt);
assert(lintBad.score < 40, `Linter scores bad prompt at ${lintBad.score} (expected < 40)`);
assert(lintBad.suggestions.length > 3, `Bad prompt gets ${lintBad.suggestions.length} suggestions (expected > 3)`);

assert(LINT_RULES.length >= 10, `Linter has ${LINT_RULES.length} rules (expected >= 10)`);

// ── Optimizer ──
import { optimizePrompt } from '../src/optimizer.js';

const optimized = optimizePrompt('please please please write me a nice blog post about AI');
assert(optimized.scoreAfter > optimized.scoreBefore, `Optimizer improves score: ${optimized.scoreBefore} → ${optimized.scoreAfter}`);
assert(optimized.changes.length > 0, `Optimizer made ${optimized.changes.length} changes`);
assert(optimized.optimized.length > optimized.original.length, 'Optimized prompt is more detailed');

// ── Recommender ──
import { recommendPrompts, buildRecommendation } from '../src/recommender.js';

const recs = recommendPrompts(prompts, 'write marketing copy for a landing page');
assert(recs.length > 0, `Recommender found ${recs.length} matches for marketing query`);
assert(recs[0].relevanceScore > 0, 'Top recommendation has positive score');

const combo = buildRecommendation(prompts, 'I need to review code for security issues');
assert(combo.topPrompts.length > 0, `Recommendation combo has ${combo.topPrompts.length} prompts`);

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
