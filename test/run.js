import { loadPrompts } from '../src/index.js';
import { searchPrompts } from '../src/search.js';

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

// Test: Load prompts
const prompts = loadPrompts();
assert(prompts.length > 0, `Loaded ${prompts.length} prompts (expected > 0)`);
assert(prompts.length >= 42, `Loaded at least 42 prompts (got ${prompts.length})`);

// Test: Each prompt has required fields
const first = prompts[0];
assert(typeof first.slug === 'string' && first.slug.length > 0, 'Prompt has slug');
assert(typeof first.title === 'string' && first.title.length > 0, 'Prompt has title');
assert(typeof first.category === 'string', 'Prompt has category');
assert(Array.isArray(first.tags), 'Prompt tags is an array');
assert(typeof first.content === 'string' && first.content.length > 0, 'Prompt has content');

// Test: Search returns results
const results = searchPrompts(prompts, 'chain of thought');
assert(results.length > 0, `Search "chain of thought" returned ${results.length} results`);
assert(results[0].score > 0, 'Top result has positive score');

// Test: Search ranking — title match ranks higher
const cot = results.find(r => r.slug === 'chain-of-thought');
if (cot) {
  assert(cot.score >= 100, 'chain-of-thought prompt scores >= 100 for its own title');
}

// Test: Categories exist
const categories = [...new Set(prompts.map(p => p.category))];
assert(categories.length >= 7, `Found ${categories.length} categories (expected >= 7)`);

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
