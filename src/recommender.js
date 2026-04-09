/**
 * Smart Prompt Recommender — suggests the best prompts for a use case.
 *
 * Analyzes the user's description of what they need and scores every prompt
 * in the library by relevance. Recommends the best system prompt + framework
 * + template combination.
 */

/**
 * Recommend prompts based on a natural-language use-case description.
 * Returns scored prompts sorted by relevance.
 */
export function recommendPrompts(prompts, description) {
  if (!description || typeof description !== 'string') return [];

  const terms = description.toLowerCase().split(/\s+/).filter(t => t.length > 1);
  const descLower = description.toLowerCase();

  // Detect intent categories from the description
  const intentScores = {};

  const intentMap = {
    'coding': ['code', 'programming', 'developer', 'software', 'api', 'debug', 'refactor', 'test', 'git', 'deploy'],
    'writing': ['write', 'blog', 'article', 'copy', 'content', 'essay', 'email', 'letter', 'documentation'],
    'marketing': ['marketing', 'seo', 'social media', 'campaign', 'ads', 'brand', 'landing page', 'conversion', 'audience'],
    'data': ['data', 'analysis', 'sql', 'database', 'dashboard', 'report', 'statistics', 'visualization', 'etl', 'pipeline'],
    'business': ['business', 'proposal', 'meeting', 'stakeholder', 'strategy', 'okr', 'pitch', 'client', 'project'],
    'image': ['image', 'photo', 'visual', 'design', 'logo', 'illustration', 'portrait', 'scene', 'art'],
    'research': ['research', 'analyze', 'investigate', 'study', 'compare', 'evaluate', 'review'],
    'teaching': ['teach', 'explain', 'tutor', 'learn', 'student', 'course', 'education'],
  };

  for (const [intent, keywords] of Object.entries(intentMap)) {
    let score = 0;
    for (const kw of keywords) {
      if (descLower.includes(kw)) score += 10;
    }
    if (score > 0) intentScores[intent] = score;
  }

  // Score each prompt
  const scored = prompts.map(prompt => {
    let score = 0;
    const titleLower = prompt.title.toLowerCase();
    const tagsLower = prompt.tags.map(t => t.toLowerCase());
    const categoryLower = prompt.category.toLowerCase();
    const contentLower = prompt.content.toLowerCase();

    // Term matching
    for (const term of terms) {
      if (titleLower.includes(term)) score += 20;
      if (tagsLower.some(tag => tag.includes(term))) score += 15;
      if (categoryLower.includes(term)) score += 10;
      if (contentLower.includes(term)) score += 3;
    }

    // Intent bonus
    const categoryIntentMap = {
      'development': 'coding',
      'marketing': 'marketing',
      'data': 'data',
      'business': 'business',
      'image-generation': 'image',
      'system-prompts': null, // system prompts match multiple intents
      'frameworks': null,
    };

    const mappedIntent = categoryIntentMap[categoryLower];
    if (mappedIntent && intentScores[mappedIntent]) {
      score += intentScores[mappedIntent];
    }

    // Boost system prompts and frameworks since they're combinable
    if (categoryLower === 'system-prompts' || categoryLower === 'frameworks') {
      // Only boost if content matches
      if (score > 0) score += 5;
    }

    return { ...prompt, relevanceScore: score };
  });

  return scored
    .filter(p => p.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Build a full recommendation with system prompt + framework + template.
 */
export function buildRecommendation(prompts, description) {
  const results = recommendPrompts(prompts, description);
  if (results.length === 0) {
    return {
      description,
      topPrompts: [],
      suggestedCombo: null,
      message: 'No matching prompts found. Try describing your use case differently.',
    };
  }

  const systemPrompts = results.filter(p => p.category === 'system-prompts');
  const frameworks = results.filter(p => p.category === 'frameworks');
  const templates = results.filter(p => !['system-prompts', 'frameworks'].includes(p.category));

  const suggestedCombo = {
    systemPrompt: systemPrompts[0] || null,
    framework: frameworks[0] || null,
    template: templates[0] || null,
  };

  return {
    description,
    topPrompts: results.slice(0, 8),
    suggestedCombo,
    systemPrompts: systemPrompts.slice(0, 3),
    frameworks: frameworks.slice(0, 3),
    templates: templates.slice(0, 5),
  };
}
