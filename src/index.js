import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, relative, basename } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROMPTS_DIR = join(__dirname, '..', 'prompts');
const USER_DATA_DIR = join(homedir(), '.prompt-library');
const USER_PROMPTS_FILE = join(USER_DATA_DIR, 'custom-prompts.json');
const USER_SAVED_FILE = join(USER_DATA_DIR, 'saved-prompts.json');

function ensureUserDir() {
  if (!existsSync(USER_DATA_DIR)) {
    mkdirSync(USER_DATA_DIR, { recursive: true });
  }
}

function parseFrontmatter(content) {
  const lines = content.split('\n');
  if (lines[0].trim() !== '---') return { meta: {}, body: content };

  let endIndex = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      endIndex = i;
      break;
    }
  }
  if (endIndex === -1) return { meta: {}, body: content };

  const meta = {};
  const frontmatterLines = lines.slice(1, endIndex);
  for (const line of frontmatterLines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Handle bracket arrays: [tag1, tag2, tag3]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean);
    }
    meta[key] = value;
  }

  const body = lines.slice(endIndex + 1).join('\n').trim();
  return { meta, body };
}

function walkDir(dir) {
  let files = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(walkDir(fullPath));
    } else if (entry.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

export function loadPrompts() {
  const files = walkDir(PROMPTS_DIR);
  const prompts = [];

  for (const filePath of files) {
    const raw = readFileSync(filePath, 'utf-8');
    const { meta, body } = parseFrontmatter(raw);

    const slug = basename(filePath, '.md');
    const relPath = relative(PROMPTS_DIR, filePath);
    const category = dirname(relPath).replace(/\\/g, '/');

    prompts.push({
      slug,
      title: meta.title || slug,
      category: meta.category || category,
      tags: Array.isArray(meta.tags) ? meta.tags : (meta.tags ? [meta.tags] : []),
      difficulty: meta.difficulty || 'intermediate',
      models: Array.isArray(meta.models) ? meta.models : (meta.models ? [meta.models] : []),
      content: body,
      path: relPath,
    });
  }

  // Load custom user-created prompts
  const custom = loadCustomPrompts();
  prompts.push(...custom);

  return prompts;
}

export function loadCustomPrompts() {
  ensureUserDir();
  if (!existsSync(USER_PROMPTS_FILE)) return [];
  try {
    return JSON.parse(readFileSync(USER_PROMPTS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

export function saveCustomPrompt(prompt) {
  ensureUserDir();
  const prompts = loadCustomPrompts();
  // Overwrite if slug exists, else append
  const idx = prompts.findIndex(p => p.slug === prompt.slug);
  if (idx !== -1) {
    prompts[idx] = prompt;
  } else {
    prompts.push(prompt);
  }
  writeFileSync(USER_PROMPTS_FILE, JSON.stringify(prompts, null, 2), 'utf-8');
  return prompt;
}

export function loadSavedCompositions() {
  ensureUserDir();
  if (!existsSync(USER_SAVED_FILE)) return [];
  try {
    return JSON.parse(readFileSync(USER_SAVED_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

export function saveComposition(composition) {
  ensureUserDir();
  const saved = loadSavedCompositions();
  composition.id = Date.now();
  composition.date = new Date().toISOString();
  saved.push(composition);
  writeFileSync(USER_SAVED_FILE, JSON.stringify(saved, null, 2), 'utf-8');
  return composition;
}

export function findPlaceholders(text) {
  return [...new Set(text.match(/\{\{[\w_\-\s/]+\}\}/g) || [])];
}

export function extractTemplate(content) {
  const templateMatch = content.match(/## Template[ \t]*\n(?:[ \t]*\n)*```[^\n]*\n([\s\S]*?)```/);
  return templateMatch ? templateMatch[1] : null;
}

export { PROMPTS_DIR, USER_DATA_DIR, USER_PROMPTS_FILE, USER_SAVED_FILE };
