# API et Playground

> Utilisation de l'AI Playground et de la Prompt Library de manière programmatique.

---

## Table des matières

- [AI Playground (navigateur)](#ai-playground-navigateur)
- [Configuration des clés API](#configuration-des-clés-api)
- [Fournisseurs pris en charge](#fournisseurs-pris-en-charge)
- [Suivi de l'utilisation des tokens](#suivi-de-lutilisation-des-tokens)
- [Utilisation programmatique (JavaScript)](#utilisation-programmatique-javascript)
- [Référence des fonctions API](#référence-des-fonctions-api)

---

## AI Playground (navigateur)

L'AI Playground est disponible dans le **Prompt Workshop** (navigateur/bureau uniquement — pas dans le CLI). Il vous permet d'envoyer des prompts directement aux modèles d'IA et d'obtenir des réponses, le tout dans le navigateur.

### Comment y accéder

1. Ouvrez le Prompt Workshop (`viewer.html` ou `prompt-lib viewer`)
2. Cliquez sur l'onglet **6** (Playground) ou appuyez sur la touche `6`

### Fonctionnalités

- **Sélecteur de fournisseur** — choisissez entre OpenAI, Anthropic ou Google
- **Remplacement du modèle** — utilisez un modèle spécifique au lieu du modèle par défaut
- **Invite système** — invite système optionnelle pour définir le contexte
- **Saisie du prompt** — rédigez, collez ou chargez un prompt depuis la bibliothèque
- **Envoyer** — envoie le prompt à l'API du fournisseur sélectionné
- **Affichage de la réponse** — réponse IA formatée avec rendu Markdown
- **Suivi des tokens** — affiche l'utilisation des tokens en entrée/sortie par requête
- **Copie en un clic** — copiez la réponse IA dans le presse-papiers

### Flux de travail

1. Configurez votre clé API dans les Paramètres (bouton ⚙) — configuration unique
2. Sélectionnez un fournisseur (OpenAI, Anthropic ou Google)
3. Entrez optionnellement une invite système
4. Rédigez ou collez votre prompt
5. Cliquez sur « Send »
6. Consultez la réponse IA, l'utilisation des tokens et les informations du modèle
7. Copiez la réponse ou itérez

---

## Configuration des clés API

Cliquez sur le bouton **⚙** (engrenage) dans le Prompt Workshop pour ouvrir les Paramètres API.

### Champs de configuration

| Champ | Description |
|-------|-------------|
| **Fournisseur** | Fournisseur actif : OpenAI, Anthropic ou Google |
| **Clé API OpenAI** | Votre clé API OpenAI (commence par `sk-`) |
| **Clé API Anthropic** | Votre clé API Anthropic (commence par `sk-ant-`) |
| **Clé API Google** | Votre clé API Google AI Studio |
| **Modèle** | Remplacement optionnel du modèle pour chaque fournisseur |

### Sécurité

- **Les clés sont stockées dans `localStorage`** — elles ne quittent jamais votre navigateur
- Les clés sont envoyées directement de votre navigateur à l'API du fournisseur (aucun serveur intermédiaire)
- Les clés sont stockées sous la clé `api_settings` du localStorage
- Pour effacer vos clés : Paramètres → supprimez les champs de clés, ou videz le localStorage du navigateur

### Obtenir des clés API

| Fournisseur | Où obtenir une clé |
|-------------|--------------------|
| **OpenAI** | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| **Anthropic** | [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) |
| **Google** | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |

---

## Fournisseurs pris en charge

### OpenAI

| Paramètre | Valeur par défaut |
|-----------|-------------------|
| **Modèle par défaut** | `gpt-4o-mini` |
| **Point d'accès API** | `https://api.openai.com/v1/chat/completions` |
| **En-tête d'authentification** | `Authorization: Bearer <key>` |
| **Température** | 0.7 (playground), 0.3 (optimiseur) |
| **Tokens max** | 4000 (playground), 2000 (optimiseur) |

**Format des messages :**
```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {"role": "system", "content": "System prompt here"},
    {"role": "user", "content": "User prompt here"}
  ]
}
```

### Anthropic

| Paramètre | Valeur par défaut |
|-----------|-------------------|
| **Modèle par défaut** | `claude-sonnet-4-20250514` |
| **Point d'accès API** | `https://api.anthropic.com/v1/messages` |
| **En-tête d'authentification** | `x-api-key: <key>` |
| **Version API** | `2023-06-01` |
| **Température** | 0.7 (playground), 0.3 (optimiseur) |
| **Tokens max** | 4000 (playground), 2000 (optimiseur) |

**Format des messages :**
```json
{
  "model": "claude-sonnet-4-20250514",
  "system": "System prompt here",
  "messages": [
    {"role": "user", "content": "User prompt here"}
  ]
}
```

### Google

| Paramètre | Valeur par défaut |
|-----------|-------------------|
| **Modèle par défaut** | `gemini-2.0-flash` |
| **Point d'accès API** | `https://generativelanguage.googleapis.com/v1beta/models/<model>:generateContent` |
| **Authentification** | Clé API dans le paramètre d'URL |
| **Température** | 0.7 (playground), 0.3 (optimiseur) |
| **Tokens max** | 4000 (playground), 2000 (optimiseur) |

**Format des messages :**
```json
{
  "contents": [
    {"parts": [{"text": "System prompt + user prompt"}]}
  ],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 4000
  }
}
```

> **Note :** L'API de Google combine l'invite système et le prompt utilisateur en un seul bloc de contenu.

---

## Suivi de l'utilisation des tokens

Le Playground suit l'utilisation des tokens pour chaque requête :

| Fournisseur | Informations sur les tokens disponibles |
|-------------|:--------------------------------------:|
| **OpenAI** | ✅ Tokens en entrée, tokens en sortie, total |
| **Anthropic** | ✅ Tokens en entrée, tokens en sortie |
| **Google** | ❌ Non fourni par l'API |

Le nombre de tokens est affiché après chaque réponse, vous aidant à surveiller les coûts et à optimiser la longueur des prompts.

---

## ⚖ Comparaison Multi-Modèle (v2.4.0)

Envoyez le même prompt à tous les fournisseurs configurés simultanément et comparez les réponses côte à côte.

**Comment l'utiliser :**
1. Configurez 2+ clés API via ⚙ Paramètres
2. Rédigez votre prompt dans le Playground
3. Cliquez sur **« ⚖ Comparer (N modèles) »**
4. Les résultats s'affichent en grille : texte de la réponse, durée, utilisation des tokens, bouton copier

**Détails techniques :**
- Utilise `Promise.allSettled()` — l'échec d'un fournisseur ne bloque pas les autres
- Chaque requête a un timeout de 30 secondes via AbortController
- Le bouton Envoyer est désactivé pendant la comparaison

## Sécurité (v2.4.0)

- Toutes les appels API imposent un **timeout de 30 secondes** via AbortController
- Le modal Paramètres API affiche un **avertissement de sécurité** sur le stockage en clair dans localStorage
- Les clés API ne sont jamais envoyées ailleurs qu'au point d'accès du fournisseur sélectionné

---

## Utilisation programmatique (JavaScript)

La Prompt Library peut être importée et utilisée de manière programmatique dans vos propres projets JavaScript/Node.js.

### Installation

```bash
npm install @dishine/prompt-library
```

### Module principal — Chargement et recherche de prompts

```javascript
import {
  loadPrompts,
  findPlaceholders,
  extractTemplate,
  saveCustomPrompt,
  loadSavedCompositions,
  saveComposition,
  loadCustomPrompts
} from '@dishine/prompt-library';

// Load all 82+ prompts
const prompts = loadPrompts();
console.log(`Loaded ${prompts.length} prompts`);

// Find placeholders in a template
const template = '{{role}} should {{task}} for {{audience}}';
const placeholders = findPlaceholders(template);
// → ['{{role}}', '{{task}}', '{{audience}}']

// Extract the template section from a prompt's content
const prompt = prompts.find(p => p.slug === 'code-review');
const tmpl = extractTemplate(prompt.content);
```

### Module de recherche

```javascript
import { searchPrompts } from '@dishine/prompt-library/src/search.js';

const prompts = loadPrompts();
const results = searchPrompts(prompts, 'chain of thought');

for (const r of results) {
  console.log(`${r.slug} (score: ${r.score})`);
}
```

### Module générateur

```javascript
import {
  generatePrompt,
  getFrameworks,
  getFramework
} from '@dishine/prompt-library/src/generator.js';

// List available frameworks
const frameworks = getFrameworks();
frameworks.forEach(fw => {
  console.log(`${fw.key}: ${fw.name} — ${fw.description}`);
});

// Generate a prompt from a framework
const result = generatePrompt('expert-role', {
  role: 'senior data analyst',
  experience: '10+ years',
  domain: 'financial services',
  task: 'Analyze quarterly revenue trends and identify anomalies',
  audience: 'executive team',
  tone: 'professional',
  constraints: 'Use only provided data, cite specific numbers',
  output_format: 'structured markdown with tables'
});

console.log(result);
```

### Module linter

```javascript
import { lintPrompt, formatLintResult } from '@dishine/prompt-library/src/linter.js';

const result = lintPrompt('Write me something good about dogs');
console.log(`Score: ${result.score}/100 (Grade: ${result.grade})`);
console.log(`Passed: ${result.passedCount}/${result.totalRules}`);

// Human-readable output
console.log(formatLintResult(result));
```

### Module optimiseur

```javascript
import { optimizePrompt } from '@dishine/prompt-library/src/optimizer.js';

const result = optimizePrompt('Can you help me write a blog post about AI?');
console.log(`Score: ${result.scoreBefore} → ${result.scoreAfter}`);
console.log(`Domain: ${result.domain}`);
console.log('Changes:', result.changes);
console.log('Optimized:', result.optimized);
```

### Module recommandeur

```javascript
import { buildRecommendation } from '@dishine/prompt-library/src/recommender.js';

const prompts = loadPrompts();
const rec = buildRecommendation(prompts, 'I need to build a REST API');

console.log('Suggested combo:');
if (rec.suggestedCombo.systemPrompt) {
  console.log(`  System: ${rec.suggestedCombo.systemPrompt.title}`);
}
if (rec.suggestedCombo.framework) {
  console.log(`  Framework: ${rec.suggestedCombo.framework.title}`);
}
if (rec.suggestedCombo.template) {
  console.log(`  Template: ${rec.suggestedCombo.template.title}`);
}
```

---

## Référence des fonctions API

### `sendToAI(prompt, systemPrompt, provider, apiKey, model)`

Envoie un prompt à un modèle d'IA et renvoie la réponse. Utilisé par le Playground.

**Paramètres :**

| Paramètre | Type | Requis | Description |
|-----------|------|:------:|-------------|
| `prompt` | string | ✅ | Le prompt utilisateur à envoyer |
| `systemPrompt` | string | ❌ | Invite système optionnelle |
| `provider` | string | ✅ | `'openai'`, `'anthropic'` ou `'google'` |
| `apiKey` | string | ✅ | Clé API du fournisseur |
| `model` | string | ❌ | Remplacement du modèle (utilise le modèle par défaut du fournisseur si omis) |

**Retour :**

```javascript
{
  text: "AI response text",
  model: "model-name",
  usage: { prompt_tokens: 50, completion_tokens: 200, total_tokens: 250 }
  // usage is null for Google provider
}
```

### `optimizeWithAI(text, provider, apiKey, model)`

Envoie un prompt à un modèle d'IA pour une réécriture professionnelle. Renvoie uniquement le texte du prompt optimisé.

**Paramètres :**

| Paramètre | Type | Requis | Description |
|-----------|------|:------:|-------------|
| `text` | string | ✅ | Le prompt à optimiser |
| `provider` | string | ✅ | `'openai'`, `'anthropic'` ou `'google'` |
| `apiKey` | string | ✅ | Clé API |
| `model` | string | ❌ | Remplacement du modèle |

**Retour :** `string` — le texte du prompt optimisé.

L'optimiseur assisté par IA utilise une invite système soigneusement conçue qui ordonne au modèle de :
1. Conserver l'intention et le sens originaux
2. Ajouter de la structure avec des sections claires
3. Rendre les instructions plus précises
4. Ajouter des contraintes et une vérification qualité
5. Supprimer le langage vague
6. Renvoyer uniquement le prompt optimisé (aucun commentaire)

---

**Navigation :** [← Outils : Linter, Optimiseur, Recommandeur](Outils-Linter-Optimizer-Recommender) &nbsp;|&nbsp; [Architecture →](Architecture-FR)
