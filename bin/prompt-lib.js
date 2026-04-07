#!/usr/bin/env node

import { loadPrompts, saveCustomPrompt, loadSavedCompositions, saveComposition, findPlaceholders, extractTemplate } from '../src/index.js';
import { searchPrompts } from '../src/search.js';
import { getFrameworks, getFramework, generatePrompt } from '../src/generator.js';
import { lintPrompt, formatLintResult } from '../src/linter.js';
import { optimizePrompt } from '../src/optimizer.js';
import { buildRecommendation } from '../src/recommender.js';
import {
  formatPromptList,
  formatPromptDetail,
  formatCategories,
  formatStats,
  formatSearchResults,
} from '../src/formatter.js';
import readline from 'readline';
import { execSync } from 'child_process';
import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VERSION = '2.3.0';

const HELP = `
  prompt-lib — Expert Prompt Engineering Library v${VERSION}
  by diShine Digital Agency (https://dishine.it)

  Usage:
    prompt-lib <command> [arguments]

  Commands:
    list                  List all prompts grouped by category
    search <query>        Search prompts by keyword
    show <slug>           Show full prompt detail
    use <slug>            Build a prompt interactively (fill placeholders)
    copy <slug>           Copy a prompt template to clipboard
    compose               Combine system prompt + framework + template
    create                Create a new system prompt with custom fields
    generate              Dynamically generate a prompt from a framework
    lint                  Analyze a prompt for quality issues (0-100 score)
    optimize              Rewrite a prompt with best practices
    recommend <query>     Get smart prompt suggestions for your use case
    saved                 List saved compositions and custom prompts
    viewer                Open the visual prompt browser
    categories            List all categories with counts
    random                Show a random prompt
    stats                 Show library statistics

  Options:
    --help, -h            Show this help message
    --version, -v         Show version number
`;

function copyToClipboard(text) {
  try {
    execSync('pbcopy', { input: text, stdio: ['pipe', 'pipe', 'pipe'] });
    console.log('\n  Copied to clipboard.');
  } catch {
    console.log('\n  (clipboard not available — copy manually from above)');
  }
}

async function interactiveUse(slug, prompts) {
  const prompt = prompts.find(p => p.slug === slug);
  if (!prompt) {
    console.error(`Prompt "${slug}" not found. Use "prompt-lib list" to see available prompts.`);
    process.exit(1);
  }

  const template = extractTemplate(prompt.content);
  if (!template) {
    console.log('No template section found in this prompt. Showing full content instead.');
    console.log(formatPromptDetail(prompt));
    return;
  }

  const placeholders = findPlaceholders(template);

  if (placeholders.length === 0) {
    console.log('\nNo placeholders found. Here\'s the template:\n');
    console.log(template);
    copyToClipboard(template.trim());
    return;
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise(resolve => rl.question(q, resolve));

  console.log(`\n  Building prompt: ${prompt.title}`);
  console.log(`  ${placeholders.length} field(s) to fill in\n`);

  const values = {};
  for (const ph of placeholders) {
    const name = ph.replace(/[{}]/g, '').replace(/[_-]/g, ' ');
    const answer = await ask(`  ${name}: `);
    values[ph] = answer;
  }
  rl.close();

  let result = template;
  for (const [ph, val] of Object.entries(values)) {
    result = result.replaceAll(ph, val);
  }

  const line = '\u2500'.repeat(70);
  console.log('\n' + line);
  console.log('  YOUR PROMPT (ready to paste)');
  console.log(line + '\n');
  console.log(result.trim());
  console.log('\n' + line);

  copyToClipboard(result.trim());
}

function copyCommand(slug, prompts) {
  const prompt = prompts.find(p => p.slug === slug);
  if (!prompt) {
    console.error(`Prompt "${slug}" not found. Use "prompt-lib list" to see available prompts.`);
    process.exit(1);
  }

  const template = extractTemplate(prompt.content);
  if (!template) {
    console.log('No template section found in this prompt. Copying full content instead.');
    copyToClipboard(prompt.content.trim());
    return;
  }

  console.log(`\n  Template from: ${prompt.title}\n`);
  console.log(template.trim());
  copyToClipboard(template.trim());
}

async function composeCommand(prompts) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise(resolve => rl.question(q, resolve));

  const systemPrompts = prompts.filter(p => p.category === 'system-prompts');
  const frameworks = prompts.filter(p => p.category === 'frameworks');
  const domainPrompts = prompts.filter(p =>
    !['system-prompts', 'frameworks'].includes(p.category)
  );

  const line = '\u2500'.repeat(70);
  console.log('\n' + line);
  console.log('  COMPOSE — build a combined prompt');
  console.log(line);

  // Step 1: Pick a system prompt
  console.log('\n  System prompts (sets the persona and rules):');
  console.log('    0. (skip)');
  systemPrompts.forEach((p, i) => console.log(`    ${i + 1}. ${p.title}`));
  const sysChoice = await ask('\n  Pick a system prompt [0]: ');
  const sysIdx = parseInt(sysChoice, 10) || 0;
  const selectedSystem = sysIdx > 0 && sysIdx <= systemPrompts.length ? systemPrompts[sysIdx - 1] : null;

  // Step 2: Pick a framework
  console.log('\n  Frameworks (reasoning technique):');
  console.log('    0. (skip)');
  frameworks.forEach((p, i) => console.log(`    ${i + 1}. ${p.title}`));
  const fwChoice = await ask('\n  Pick a framework [0]: ');
  const fwIdx = parseInt(fwChoice, 10) || 0;
  const selectedFramework = fwIdx > 0 && fwIdx <= frameworks.length ? frameworks[fwIdx - 1] : null;

  // Step 3: Pick a domain template
  console.log('\n  Domain templates:');
  domainPrompts.forEach((p, i) => console.log(`    ${i + 1}. ${p.title} (${p.category})`));
  const domChoice = await ask('\n  Pick a template [1]: ');
  const domIdx = (parseInt(domChoice, 10) || 1) - 1;
  if (domIdx < 0 || domIdx >= domainPrompts.length) {
    console.error('  Invalid selection.');
    rl.close();
    process.exit(1);
  }
  const selectedDomain = domainPrompts[domIdx];

  // Build composite
  let composite = '';
  const layers = [];
  if (selectedSystem) {
    const sysTemplate = extractTemplate(selectedSystem.content) || selectedSystem.content;
    composite += '# SYSTEM PROMPT\n\n' + sysTemplate.trim() + '\n\n';
    layers.push(selectedSystem.title);
  }
  if (selectedFramework) {
    const fwTemplate = extractTemplate(selectedFramework.content) || selectedFramework.content;
    composite += '# REASONING FRAMEWORK\n\n' + fwTemplate.trim() + '\n\n';
    layers.push(selectedFramework.title);
  }
  const domTemplate = extractTemplate(selectedDomain.content) || selectedDomain.content;
  composite += '# TASK TEMPLATE\n\n' + domTemplate.trim();
  layers.push(selectedDomain.title);

  // Fill placeholders
  const placeholders = findPlaceholders(composite);
  if (placeholders.length > 0) {
    console.log(`\n  ${placeholders.length} placeholder(s) to fill in:\n`);
    const values = {};
    for (const ph of placeholders) {
      const name = ph.replace(/[{}]/g, '').replace(/[_-]/g, ' ');
      const answer = await ask(`  ${name}: `);
      values[ph] = answer;
    }
    for (const [ph, val] of Object.entries(values)) {
      composite = composite.replaceAll(ph, val);
    }
  }

  console.log('\n' + line);
  console.log('  COMPOSED PROMPT');
  console.log(line + '\n');
  console.log(composite.trim());
  console.log('\n' + line);

  copyToClipboard(composite.trim());

  // Ask to save
  const doSave = await ask('\n  Save this composition? [y/N]: ');
  if (doSave.toLowerCase() === 'y') {
    saveComposition({
      title: 'Composed: ' + layers.join(' + '),
      result: composite.trim(),
      layers,
      type: 'composed',
    });
    console.log('  Saved to ~/.prompt-library/saved-prompts.json');
  }

  rl.close();
}

async function createCommand() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise(resolve => rl.question(q, resolve));

  const line = '\u2500'.repeat(70);
  console.log('\n' + line);
  console.log('  CREATE — build a new system prompt with custom fields');
  console.log(line);

  // Gather metadata
  const title = await ask('\n  Prompt title: ');
  if (!title.trim()) { console.error('  Title is required.'); rl.close(); process.exit(1); }
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const category = await ask('  Category (e.g., system-prompts, marketing, development): ');
  const tagsRaw = await ask('  Tags (comma-separated): ');
  const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
  const difficulty = await ask('  Difficulty (beginner/intermediate/advanced) [intermediate]: ') || 'intermediate';
  const modelsRaw = await ask('  Models (comma-separated) [claude, gpt-4, gemini]: ') || 'claude, gpt-4, gemini';
  const models = modelsRaw.split(',').map(m => m.trim()).filter(Boolean);

  // Gather fields
  console.log('\n  Now define the dynamic fields for this prompt.');
  console.log('  These become {{field_name}} placeholders in the template.');
  console.log('  Enter field names one per line. Empty line to finish.\n');

  const fields = [];
  while (true) {
    const field = await ask('  Field name (empty to finish): ');
    if (!field.trim()) break;
    const fieldSlug = field.trim().replace(/\s+/g, '_').toLowerCase();
    const description = await ask(`    Description for "${fieldSlug}": `);
    fields.push({ name: fieldSlug, description: description || fieldSlug });
  }

  // Build the prompt content
  console.log('\n  Now write the prompt body.');
  console.log('  Use {{field_name}} to reference your fields.');
  console.log('  Available fields: ' + fields.map(f => `{{${f.name}}}`).join(', '));
  console.log('  Type your prompt (multi-line). Enter an empty line twice to finish.\n');

  let body = '';
  let emptyCount = 0;
  while (true) {
    const bodyLine = await ask('  > ');
    if (bodyLine === '') {
      emptyCount++;
      if (emptyCount >= 2) break;
      body += '\n';
    } else {
      emptyCount = 0;
      body += bodyLine + '\n';
    }
  }
  body = body.trim();

  // Build full content with template section
  let content = `# ${title}\n\n`;
  if (fields.length > 0) {
    content += `## Fields\n\n`;
    for (const f of fields) {
      content += `- **${f.name}**: ${f.description}\n`;
    }
    content += `\n`;
  }
  content += `## Template\n\n\`\`\`\n${body}\n\`\`\``;

  const prompt = {
    slug,
    title,
    category: category.trim() || 'custom',
    tags,
    difficulty,
    models,
    content,
    path: 'custom/' + slug + '.md',
    fields,
    custom: true,
  };

  saveCustomPrompt(prompt);

  console.log('\n' + line);
  console.log(`  Created prompt: ${title}`);
  console.log(`  Slug: ${slug}`);
  console.log(`  Fields: ${fields.map(f => '{{' + f.name + '}}').join(', ') || '(none)'}`);
  console.log(`  Saved to: ~/.prompt-library/custom-prompts.json`);
  console.log(line);

  // Offer to use it immediately
  const doUse = await ask('\n  Fill and use this prompt now? [y/N]: ');
  if (doUse.toLowerCase() === 'y') {
    rl.close();
    const prompts = loadPrompts();
    await interactiveUse(slug, prompts);
  } else {
    console.log(`  Use it anytime with: prompt-lib use ${slug}`);
    rl.close();
  }
}

async function generateCommand() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise(resolve => rl.question(q, resolve));

  const line = '\u2500'.repeat(70);
  console.log('\n' + line);
  console.log('  GENERATE — dynamically create a prompt from a framework');
  console.log(line);

  const frameworks = getFrameworks();
  console.log('\n  Available frameworks:\n');
  frameworks.forEach((fw, i) => {
    console.log(`    ${i + 1}. ${fw.name}`);
    console.log(`       ${fw.description}\n`);
  });

  const fwChoice = await ask('  Pick a framework: ');
  const fwIdx = parseInt(fwChoice, 10) - 1;
  if (fwIdx < 0 || fwIdx >= frameworks.length) {
    console.error('  Invalid selection.');
    rl.close();
    process.exit(1);
  }

  const fw = frameworks[fwIdx];
  const fwDetail = getFramework(fw.key);
  console.log(`\n  Using: ${fw.name}`);
  console.log(`  Answer the following questions:\n`);

  const answers = {};
  for (const q of fwDetail.questions) {
    const required = q.required ? ' (required)' : ` [${q.default || 'optional'}]`;
    const answer = await ask(`  ${q.label}${required}: `);
    if (answer.trim()) {
      answers[q.key] = answer.trim();
    } else if (q.default !== undefined) {
      answers[q.key] = q.default;
    }
  }

  let result;
  try {
    result = generatePrompt(fw.key, answers);
  } catch (err) {
    console.error(`\n  Error: ${err.message}`);
    rl.close();
    process.exit(1);
  }

  console.log('\n' + line);
  console.log('  GENERATED PROMPT');
  console.log(line + '\n');
  console.log(result);
  console.log('\n' + line);

  copyToClipboard(result);

  // Offer to save
  const doSave = await ask('\n  Save as a custom prompt? [y/N]: ');
  if (doSave.toLowerCase() === 'y') {
    const title = await ask('  Prompt title: ') || `Generated ${fw.name} prompt`;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const placeholders = findPlaceholders(result);
    const fields = placeholders.map(ph => ({
      name: ph.replace(/[{}]/g, ''),
      description: ph.replace(/[{}]/g, '').replace(/[_-]/g, ' '),
    }));

    const content = `# ${title}\n\n## Template\n\n\`\`\`\n${result}\n\`\`\``;

    saveCustomPrompt({
      slug,
      title,
      category: 'custom',
      tags: [fw.name.toLowerCase(), 'generated'],
      difficulty: 'intermediate',
      models: ['claude', 'gpt-4', 'gemini'],
      content,
      path: 'custom/' + slug + '.md',
      fields,
      custom: true,
    });

    console.log(`  Saved as "${slug}". Use it with: prompt-lib use ${slug}`);
  }

  rl.close();
}

function savedCommand() {
  const line = '\u2500'.repeat(70);
  const saved = loadSavedCompositions();

  console.log('\n' + line);
  console.log('  SAVED — your compositions and custom prompts');
  console.log(line);

  if (saved.length === 0) {
    console.log('\n  No saved compositions yet.');
    console.log('  Use "prompt-lib compose" or "prompt-lib create" to get started.\n');
    return;
  }

  console.log(`\n  ${saved.length} saved item(s):\n`);
  saved.forEach((s, i) => {
    console.log(`    ${i + 1}. ${s.title}`);
    console.log(`       Type: ${s.type} | Saved: ${new Date(s.date).toLocaleDateString()}`);
    if (s.layers) console.log(`       Layers: ${s.layers.join(' + ')}`);
    console.log();
  });
}

async function lintCommand() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise(resolve => rl.question(q, resolve));

  const line = '\u2500'.repeat(70);
  console.log('\n' + line);
  console.log('  LINT — analyze your prompt for quality issues');
  console.log(line);
  console.log('\n  Paste your prompt below (multi-line). Enter an empty line twice to finish.\n');

  let text = '';
  let emptyCount = 0;
  while (true) {
    const inputLine = await ask('  > ');
    if (inputLine === '') {
      emptyCount++;
      if (emptyCount >= 2) break;
      text += '\n';
    } else {
      emptyCount = 0;
      text += inputLine + '\n';
    }
  }
  rl.close();

  text = text.trim();
  if (!text) {
    console.error('  No prompt provided.');
    process.exit(1);
  }

  const result = lintPrompt(text);
  console.log('\n' + line);
  console.log('  LINT RESULTS');
  console.log(line);
  console.log(formatLintResult(result));
}

async function optimizeCommand() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise(resolve => rl.question(q, resolve));

  const line = '\u2500'.repeat(70);
  console.log('\n' + line);
  console.log('  OPTIMIZE — rewrite your prompt with best practices');
  console.log(line);
  console.log('\n  Paste your prompt below (multi-line). Enter an empty line twice to finish.\n');

  let text = '';
  let emptyCount = 0;
  while (true) {
    const inputLine = await ask('  > ');
    if (inputLine === '') {
      emptyCount++;
      if (emptyCount >= 2) break;
      text += '\n';
    } else {
      emptyCount = 0;
      text += inputLine + '\n';
    }
  }

  text = text.trim();
  if (!text) {
    console.error('  No prompt provided.');
    rl.close();
    process.exit(1);
  }

  const result = optimizePrompt(text);

  console.log('\n' + line);
  console.log('  OPTIMIZED PROMPT');
  console.log(line + '\n');
  console.log(result.optimized);
  console.log('\n' + line);

  console.log(`\n  Score: ${result.scoreBefore} → ${result.scoreAfter} (+${result.improvement})`);
  if (result.changes.length > 0) {
    console.log('  Changes made:');
    for (const c of result.changes) {
      console.log(`    • ${c}`);
    }
  }

  copyToClipboard(result.optimized);
  rl.close();
}

function recommendCommand(prompts, query) {
  const line = '\u2500'.repeat(70);

  if (!query) {
    console.log('\n  Usage: prompt-lib recommend <describe what you need>');
    console.log('  Example: prompt-lib recommend "I need to write a landing page for a SaaS product"');
    return;
  }

  console.log('\n' + line);
  console.log(`  RECOMMENDATIONS for: "${query}"`);
  console.log(line);

  const rec = buildRecommendation(prompts, query);

  if (!rec.suggestedCombo) {
    console.log('\n  ' + rec.message);
    return;
  }

  console.log('\n  Suggested combination:\n');
  if (rec.suggestedCombo.systemPrompt) {
    console.log(`    🧠 System prompt:  ${rec.suggestedCombo.systemPrompt.title} (${rec.suggestedCombo.systemPrompt.slug})`);
  }
  if (rec.suggestedCombo.framework) {
    console.log(`    🔧 Framework:      ${rec.suggestedCombo.framework.title} (${rec.suggestedCombo.framework.slug})`);
  }
  if (rec.suggestedCombo.template) {
    console.log(`    📝 Template:       ${rec.suggestedCombo.template.title} (${rec.suggestedCombo.template.slug})`);
  }

  console.log('\n  Top matching prompts:\n');
  for (const p of rec.topPrompts.slice(0, 8)) {
    console.log(`    ${p.title}`);
    console.log(`      slug: ${p.slug} | category: ${p.category} | score: ${p.relevanceScore}`);
  }

  console.log(`\n  Use "prompt-lib use <slug>" to build any prompt interactively.`);
  console.log(`  Use "prompt-lib compose" to combine multiple layers.\n`);
}

function viewerCommand(prompts) {
  const viewerPath = join(__dirname, '..', 'viewer.html');
  let html;
  try {
    html = readFileSync(viewerPath, 'utf-8');
  } catch {
    console.error('viewer.html not found. Expected at:', viewerPath);
    process.exit(1);
  }

  // If viewer.html already has embedded data, regenerate with fresh data
  // If it has the placeholder, inject data into it
  const data = JSON.stringify(prompts, null, 0);
  const injection = `var PROMPTS = ${data};`;

  if (html.includes('/*__PROMPT_DATA__*/')) {
    html = html.replace('/*__PROMPT_DATA__*/', injection);
  } else {
    // Replace existing embedded data (between the script tag and the if check)
    html = html.replace(/var PROMPTS = \[.*?\];/s, injection);
  }

  const outPath = join(tmpdir(), 'prompt-library-viewer.html');
  writeFileSync(outPath, html, 'utf-8');
  console.log(`  Viewer opened with ${prompts.length} prompts`);

  try {
    execSync(`open "${outPath}"`, { stdio: 'ignore' });
  } catch {
    console.log(`  Could not open automatically. Open this file in your browser:\n  ${outPath}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    console.log(HELP);
    process.exit(0);
  }

  if (command === '--version' || command === '-v') {
    console.log(`prompt-lib v${VERSION}`);
    process.exit(0);
  }

  const prompts = loadPrompts();

  switch (command) {
    case 'list': {
      console.log(formatPromptList(prompts));
      break;
    }
    case 'search': {
      const query = args.slice(1).join(' ');
      if (!query) {
        console.error('Usage: prompt-lib search <query>');
        process.exit(1);
      }
      const results = searchPrompts(prompts, query);
      console.log(formatSearchResults(results, query));
      break;
    }
    case 'show': {
      const slug = args[1];
      if (!slug) {
        console.error('Usage: prompt-lib show <slug>');
        process.exit(1);
      }
      const prompt = prompts.find(p => p.slug === slug);
      if (!prompt) {
        console.error(`Prompt "${slug}" not found. Use "prompt-lib list" to see available prompts.`);
        process.exit(1);
      }
      console.log(formatPromptDetail(prompt));
      break;
    }
    case 'use': {
      const slug = args[1];
      if (!slug) {
        console.error('Usage: prompt-lib use <slug>');
        process.exit(1);
      }
      await interactiveUse(slug, prompts);
      break;
    }
    case 'copy': {
      const slug = args[1];
      if (!slug) {
        console.error('Usage: prompt-lib copy <slug>');
        process.exit(1);
      }
      copyCommand(slug, prompts);
      break;
    }
    case 'compose': {
      await composeCommand(prompts);
      break;
    }
    case 'create': {
      await createCommand();
      break;
    }
    case 'generate': {
      await generateCommand();
      break;
    }
    case 'saved': {
      savedCommand();
      break;
    }
    case 'lint': {
      await lintCommand();
      break;
    }
    case 'optimize': {
      await optimizeCommand();
      break;
    }
    case 'recommend': {
      const query = args.slice(1).join(' ');
      recommendCommand(prompts, query);
      break;
    }
    case 'viewer': {
      viewerCommand(prompts);
      break;
    }
    case 'categories': {
      console.log(formatCategories(prompts));
      break;
    }
    case 'random': {
      const idx = Math.floor(Math.random() * prompts.length);
      console.log(formatPromptDetail(prompts[idx]));
      break;
    }
    case 'stats': {
      console.log(formatStats(prompts));
      break;
    }
    default: {
      console.error(`Unknown command: ${command}\nRun "prompt-lib --help" for usage.`);
      process.exit(1);
    }
  }
}

main();
