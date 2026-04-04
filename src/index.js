import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, relative, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROMPTS_DIR = join(__dirname, '..', 'prompts');

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

  return prompts;
}

export { PROMPTS_DIR };
