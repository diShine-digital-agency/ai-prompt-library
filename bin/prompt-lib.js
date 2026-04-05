#!/usr/bin/env node

import { loadPrompts } from '../src/index.js';
import { searchPrompts } from '../src/search.js';
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

const VERSION = '1.0.0';

const HELP = `
  prompt-lib — Expert Prompt Engineering Library
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

function extractTemplate(content) {
  const templateMatch = content.match(/## Template\s*\n+```[^\n]*\n([\s\S]*?)```/);
  return templateMatch ? templateMatch[1] : null;
}

function findPlaceholders(text) {
  return [...new Set(text.match(/\{\{[\w_-]+\}\}/g) || [])];
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
  if (selectedSystem) {
    const sysTemplate = extractTemplate(selectedSystem.content) || selectedSystem.content;
    composite += '# SYSTEM PROMPT\n\n' + sysTemplate.trim() + '\n\n';
  }
  if (selectedFramework) {
    const fwTemplate = extractTemplate(selectedFramework.content) || selectedFramework.content;
    composite += '# REASONING FRAMEWORK\n\n' + fwTemplate.trim() + '\n\n';
  }
  const domTemplate = extractTemplate(selectedDomain.content) || selectedDomain.content;
  composite += '# TASK TEMPLATE\n\n' + domTemplate.trim();

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

  rl.close();

  console.log('\n' + line);
  console.log('  COMPOSED PROMPT');
  console.log(line + '\n');
  console.log(composite.trim());
  console.log('\n' + line);

  copyToClipboard(composite.trim());
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
