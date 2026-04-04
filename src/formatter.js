const NO_COLOR = !!process.env.NO_COLOR;

const c = {
  reset: NO_COLOR ? '' : '\x1b[0m',
  bold: NO_COLOR ? '' : '\x1b[1m',
  dim: NO_COLOR ? '' : '\x1b[2m',
  underline: NO_COLOR ? '' : '\x1b[4m',
  cyan: NO_COLOR ? '' : '\x1b[36m',
  green: NO_COLOR ? '' : '\x1b[32m',
  yellow: NO_COLOR ? '' : '\x1b[33m',
  magenta: NO_COLOR ? '' : '\x1b[35m',
  blue: NO_COLOR ? '' : '\x1b[34m',
  red: NO_COLOR ? '' : '\x1b[31m',
  white: NO_COLOR ? '' : '\x1b[37m',
  gray: NO_COLOR ? '' : '\x1b[90m',
};

function difficultyColor(d) {
  if (d === 'beginner') return c.green;
  if (d === 'advanced') return c.red;
  return c.yellow;
}

export function formatPromptList(prompts) {
  const grouped = {};
  for (const p of prompts) {
    const cat = p.category || 'uncategorized';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p);
  }

  let out = '';
  out += `\n${c.bold}${c.cyan}Prompt Library${c.reset} ${c.dim}(${prompts.length} prompts)${c.reset}\n\n`;

  for (const [cat, items] of Object.entries(grouped).sort()) {
    out += `${c.bold}${c.magenta}${cat}${c.reset} ${c.dim}(${items.length})${c.reset}\n`;
    for (const p of items.sort((a, b) => a.slug.localeCompare(b.slug))) {
      const dc = difficultyColor(p.difficulty);
      out += `  ${c.cyan}${p.slug}${c.reset} ${c.dim}-${c.reset} ${p.title} ${dc}[${p.difficulty}]${c.reset}\n`;
    }
    out += '\n';
  }

  return out;
}

export function formatPromptDetail(prompt) {
  const width = Math.min(process.stdout.columns || 80, 100);
  const hLine = '\u2500'.repeat(width);
  const dLine = '\u2550'.repeat(width);

  let out = '';
  out += `\n${c.dim}${dLine}${c.reset}\n`;
  out += `${c.bold}${c.cyan}${prompt.title}${c.reset}\n`;
  out += `${c.dim}${hLine}${c.reset}\n`;
  out += `${c.yellow}Category:${c.reset}   ${prompt.category}\n`;
  out += `${c.yellow}Difficulty:${c.reset} ${difficultyColor(prompt.difficulty)}${prompt.difficulty}${c.reset}\n`;
  out += `${c.yellow}Tags:${c.reset}       ${prompt.tags.join(', ')}\n`;
  out += `${c.yellow}Models:${c.reset}     ${prompt.models.join(', ')}\n`;
  out += `${c.yellow}File:${c.reset}       ${prompt.path}\n`;
  out += `${c.dim}${hLine}${c.reset}\n\n`;
  out += prompt.content + '\n';
  out += `\n${c.dim}${dLine}${c.reset}\n`;

  return out;
}

export function formatCategories(prompts) {
  const cats = {};
  for (const p of prompts) {
    const cat = p.category || 'uncategorized';
    if (!cats[cat]) cats[cat] = 0;
    cats[cat]++;
  }

  let out = '';
  out += `\n${c.bold}${c.cyan}Categories${c.reset}\n\n`;
  out += `${c.bold}  ${'Category'.padEnd(25)} Count${c.reset}\n`;
  out += `  ${'\u2500'.repeat(25)} ${'─'.repeat(5)}\n`;

  for (const [cat, count] of Object.entries(cats).sort()) {
    out += `  ${c.magenta}${cat.padEnd(25)}${c.reset} ${count}\n`;
  }

  out += `\n  ${c.bold}Total: ${prompts.length} prompts${c.reset}\n\n`;
  return out;
}

export function formatStats(prompts) {
  const cats = {};
  const diffs = {};
  const allTags = {};
  const allModels = {};

  for (const p of prompts) {
    cats[p.category] = (cats[p.category] || 0) + 1;
    diffs[p.difficulty] = (diffs[p.difficulty] || 0) + 1;
    for (const t of p.tags) allTags[t] = (allTags[t] || 0) + 1;
    for (const m of p.models) allModels[m] = (allModels[m] || 0) + 1;
  }

  let out = '';
  out += `\n${c.bold}${c.cyan}Library Statistics${c.reset}\n\n`;
  out += `  ${c.yellow}Total prompts:${c.reset}    ${prompts.length}\n`;
  out += `  ${c.yellow}Categories:${c.reset}       ${Object.keys(cats).length}\n`;
  out += `  ${c.yellow}Unique tags:${c.reset}      ${Object.keys(allTags).length}\n`;
  out += `  ${c.yellow}Models covered:${c.reset}   ${Object.keys(allModels).length}\n\n`;

  out += `  ${c.bold}By Difficulty${c.reset}\n`;
  for (const [d, n] of Object.entries(diffs).sort()) {
    out += `    ${difficultyColor(d)}${d.padEnd(15)}${c.reset} ${n}\n`;
  }

  out += `\n  ${c.bold}Top Tags${c.reset}\n`;
  const topTags = Object.entries(allTags).sort((a, b) => b[1] - a[1]).slice(0, 10);
  for (const [tag, n] of topTags) {
    out += `    ${c.green}${tag.padEnd(20)}${c.reset} ${n}\n`;
  }

  out += '\n';
  return out;
}

export function formatSearchResults(results, query) {
  let out = '';
  out += `\n${c.bold}${c.cyan}Search results for "${query}"${c.reset} ${c.dim}(${results.length} found)${c.reset}\n\n`;

  if (results.length === 0) {
    out += `  ${c.dim}No prompts matched your query.${c.reset}\n\n`;
    return out;
  }

  for (const r of results.slice(0, 20)) {
    const dc = difficultyColor(r.difficulty);
    out += `  ${c.cyan}${r.slug}${c.reset} ${c.dim}(score: ${r.score})${c.reset}\n`;
    out += `    ${r.title} ${dc}[${r.difficulty}]${c.reset} ${c.dim}in ${r.category}${c.reset}\n`;
    out += `    ${c.dim}tags: ${r.tags.join(', ')}${c.reset}\n\n`;
  }

  return out;
}
