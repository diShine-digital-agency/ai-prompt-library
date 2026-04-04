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
    categories            List all categories with counts
    random                Show a random prompt
    stats                 Show library statistics

  Options:
    --help, -h            Show this help message
    --version, -v         Show version number
`;

function main() {
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
