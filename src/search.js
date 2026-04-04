export function searchPrompts(prompts, query) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const scored = prompts.map(prompt => {
    let score = 0;
    const titleLower = prompt.title.toLowerCase();
    const categoryLower = prompt.category.toLowerCase();
    const tagsLower = prompt.tags.map(t => t.toLowerCase());
    const contentLower = prompt.content.toLowerCase();

    for (const term of terms) {
      // Title word match — highest signal
      if (titleLower.includes(term)) score += 100;

      // Tag match
      if (tagsLower.some(tag => tag.includes(term))) score += 50;

      // Category match
      if (categoryLower.includes(term)) score += 30;

      // Content word match — lowest signal but still relevant
      if (contentLower.includes(term)) score += 10;
    }

    return { ...prompt, score };
  });

  return scored
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score);
}
