# Contribuer

> Comment contribuer des prompts, du code et des frameworks à l'AI Prompt Library.

---

## Table des Matières

- [Ajouter de Nouveaux Prompts](#ajouter-de-nouveaux-prompts)
- [Format des Fichiers Prompt](#format-des-fichiers-prompt)
- [Catégories](#catégories)
- [Ajouter des Frameworks au Générateur](#ajouter-des-frameworks-au-générateur)
- [Ajouter des Commandes CLI](#ajouter-des-commandes-cli)
- [Exécuter les Tests](#exécuter-les-tests)
- [Conventions de Style de Code](#conventions-de-style-de-code)
- [Processus de Pull Request](#processus-de-pull-request)
- [Signalement de Bugs](#signalement-de-bugs)
- [Demandes de Fonctionnalités](#demandes-de-fonctionnalités)

---

## Ajouter de Nouveaux Prompts

C'est la manière la plus simple de contribuer. Chaque prompt est un fichier Markdown unique dans le répertoire `prompts/`.

### Étape par Étape

1. **Choisissez la bonne catégorie** — voir [Catégories](#catégories) ci-dessous
2. **Créez le fichier** — `prompts/<category>/your-prompt-name.md`
3. **Ajoutez le frontmatter YAML** — les métadonnées en début de fichier
4. **Rédigez le contenu** — suivez le [Format des Fichiers Prompt](#format-des-fichiers-prompt)
5. **Exécutez les tests** — `node test/run.js` (tous les tests doivent passer)
6. **Ouvrez une pull request**

### Exemple : Créer un Nouveau Prompt

```bash
# 1. Create the file
touch prompts/development/api-testing.md

# 2. Write the content (see format below)

# 3. Run tests
node test/run.js

# 4. The CLI picks it up automatically — no registration step
node bin/prompt-lib.js show api-testing
```

---

## Format des Fichiers Prompt

Chaque fichier prompt suit cette structure :

```markdown
---
title: Your Prompt Title
category: development
tags: [api, testing, quality, automation]
difficulty: intermediate
models: [claude, gpt-4, gemini]
---

# Your Prompt Title

## When to Use

Describe when this technique or template is most useful.
Include specific scenarios and use cases. Also mention when
NOT to use it — this helps users make better decisions.

## The Technique

Detailed explanation of the approach, methodology, or framework.
Include the reasoning behind why this works and any theory.

## Template

\```
You are a {{role}} specializing in {{domain}}.

TASK:
{{task_description}}

RULES:
- Rule 1
- Rule 2
- {{custom_constraint}}

OUTPUT FORMAT:
Respond in {{format}} with clear sections.

Before responding, verify that your answer is complete and accurate.
\```

## Examples

### Example 1: [Scenario Name]

**Input:**
\```
[Example input with filled placeholders]
\```

**Expected Output:**
\```
[Example of what the AI should produce]
\```

### Example 2: [Another Scenario]
...

## Tips

- Practical tip from real usage experience
- Common adjustment that improves results
- Model-specific advice (e.g., "Claude works best with XML tags here")

## Common Mistakes

- ❌ Mistake 1 — why it's wrong and how to fix it
- ❌ Mistake 2 — the impact and the correct approach
- ❌ Mistake 3 — a subtle pitfall that's easy to miss
```

### Champs de Métadonnées Obligatoires

| Champ | Type | Description | Exemple |
|-------|------|-------------|---------|
| `title` | chaîne | Titre lisible par un humain | `API Testing Prompt` |
| `category` | chaîne | Nom du répertoire de la catégorie | `development` |
| `tags` | tableau | Mots-clés pour la recherche | `[api, testing, automation]` |
| `difficulty` | chaîne | `beginner`, `intermediate` ou `advanced` | `intermediate` |
| `models` | tableau | Modèles IA compatibles | `[claude, gpt-4, gemini]` |

### Règles pour la Section Template

- Placez le template dans un bloc de code délimité (` ``` `)
- Utilisez `{{nom_du_champ}}` pour les champs dynamiques
- Utilisez des underscores ou des tirets dans les noms de champs : `{{task_description}}`, `{{output-format}}`
- Les champs sont détectés automatiquement par `findPlaceholders()` via la regex `/\{\{[\w_\-\s/]+\}\}/g`

---

## Catégories

| Catégorie | Répertoire | Ce qu'on y Trouve |
|-----------|-----------|-------------------|
| `frameworks` | `prompts/frameworks/` | Techniques fondamentales de prompting (Chain-of-Thought, Few-Shot, ReAct, etc.) |
| `model-specific` | `prompts/model-specific/` | Techniques optimisées pour des LLM spécifiques (Claude, GPT, Gemini) |
| `system-prompts` | `prompts/system-prompts/` | Invites système prêtes pour la production (assistant de code, chercheur, etc.) |
| `marketing` | `prompts/marketing/` | Templates pour le marketing et la création de contenu |
| `development` | `prompts/development/` | Templates pour le génie logiciel |
| `data` | `prompts/data/` | Templates pour l'analyse et l'ingénierie des données |
| `business` | `prompts/business/` | Templates pour le business et la communication professionnelle |
| `image-generation` | `prompts/image-generation/` | Templates pour la création d'images par IA |

Pour créer une **nouvelle catégorie**, il suffit de créer un nouveau sous-répertoire dans `prompts/`. La CLI découvre les catégories automatiquement grâce à la structure des répertoires.

---

## Ajouter des Frameworks au Générateur

Les frameworks du générateur sont définis dans `src/generator.js` dans l'objet `FRAMEWORKS`.

### Comment Ajouter un Nouveau Framework

Modifiez `src/generator.js` et ajoutez une nouvelle entrée à `FRAMEWORKS` :

```javascript
'my-framework': {
  name: 'My Framework',
  description: 'What it does in one sentence',
  questions: [
    {
      key: 'field1',
      label: 'Question for the user',
      required: true
    },
    {
      key: 'field2',
      label: 'Optional question',
      required: false,
      default: 'default value'
    },
  ],
  generate: (answers) => {
    return `You are an expert in ${answers.field1}.

TASK:
${answers.field2}

RULES:
- Be specific and actionable
- Show your reasoning

OUTPUT FORMAT:
Structured markdown with clear sections`;
  }
}
```

### Champs de l'Objet Framework

| Champ | Type | Obligatoire | Description |
|-------|------|:-----------:|-------------|
| `name` | chaîne | ✅ | Nom affiché |
| `description` | chaîne | ✅ | Description en une phrase |
| `questions` | tableau | ✅ | Tableau d'objets question |
| `generate` | fonction | ✅ | `(answers) → string` — génère le prompt |

### Champs de l'Objet Question

| Champ | Type | Obligatoire | Description |
|-------|------|:-----------:|-------------|
| `key` | chaîne | ✅ | Clé utilisée dans l'objet des réponses |
| `label` | chaîne | ✅ | Texte de la question affiché à l'utilisateur |
| `required` | booléen | ✅ | Indique si le champ doit être rempli |
| `default` | chaîne | ❌ | Valeur par défaut si non fournie |

Le framework apparaît automatiquement dans :
- CLI : `prompt-lib generate`
- Prompt Workshop : onglet Generate

---

## Ajouter des Commandes CLI

Les commandes CLI sont définies dans `bin/prompt-lib.js`.

### Comment Ajouter une Nouvelle Commande

1. **Ajoutez un cas** dans l'instruction `switch` de `main()` :

```javascript
case 'mycommand': {
  // Your command logic here
  const arg = args[1];
  // ...
  break;
}
```

2. **Ajoutez à la chaîne HELP** en haut du fichier :

```javascript
const HELP = `
  ...
  Commands:
    ...
    mycommand <arg>       Description of what it does
  ...
`;
```

3. **Ajoutez des tests** si la commande implique de nouveaux modules

### Conventions pour les Commandes

- Les commandes interactives utilisent `readline` pour l'entrée utilisateur
- Utilisez `copyToClipboard(text)` pour la copie dans le presse-papiers
- Utilisez `formatPromptDetail()` etc. de `src/formatter.js` pour la sortie
- Respectez la variable d'environnement `NO_COLOR` (gérée par formatter.js)
- Quittez avec `process.exit(1)` en cas d'erreur

---

## Exécuter les Tests

```bash
node test/run.js
```

La suite de tests (`test/run.js`) exécute **46 tests** sans aucune dépendance. Les tests vérifient :

| Domaine de Test | Ce qui est Vérifié |
|----------------|-------------------|
| **Chargement des prompts** | 82+ prompts chargés depuis les fichiers + prompts personnalisés |
| **Champs obligatoires** | Chaque prompt possède slug, title, category, tags, content |
| **Recherche** | Exactitude du scoring et du classement |
| **Catégories** | Validation du nombre de catégories |
| **Prompts personnalisés** | Création et persistance |
| **Générateur** | Validation des frameworks, vérification des champs obligatoires |
| **Linter** | Précision du scoring, évaluation des règles |
| **Optimizer** | Exactitude des transformations |
| **Recommender** | Scoring et construction des combinaisons |

### Exécuter les Tests Avant/Après les Modifications

```bash
# Before changes — establish baseline
node test/run.js

# Make your changes...

# After changes — verify nothing is broken
node test/run.js
```

Tous les tests doivent passer avant de soumettre une pull request.

---

## Conventions de Style de Code

### Modules ESM

Le projet utilise les **ES Modules** (ESM). Utilisez la syntaxe `import`/`export` :

```javascript
// ✅ Correct
import { readFileSync } from 'fs';
export function myFunction() { ... }

// ❌ Incorrect
const fs = require('fs');
module.exports = { myFunction };
```

### Politique Zéro Dépendances

**N'ajoutez aucun paquet npm.** Utilisez uniquement les modules intégrés de Node.js :

| Autorisés | Non Autorisés |
|-----------|---------------|
| `fs`, `path`, `url` | `lodash`, `chalk`, `inquirer` |
| `readline`, `os` | `yargs`, `commander` |
| `child_process` | `clipboardy`, `open` |

C'est un principe de design fondamental. La bibliothèque fonctionne avec une installation vierge de Node.js — aucun `npm install` nécessaire.

### Style Général

- Respectez le style de code existant — observez le code voisin pour les conventions
- Utilisez `const` par défaut, `let` uniquement quand une réaffectation est nécessaire
- Utilisez les template literals pour l'interpolation de chaînes
- Utilisez des noms de variables descriptifs
- Commentez seulement quand le « pourquoi » n'est pas évident dans le code
- `viewer.html` est autonome — toutes les données des prompts sont intégrées en JSON

---

## Processus de Pull Request

1. **Forkez** le dépôt et créez une branche à partir de `main`
2. **Apportez vos modifications** — suivez les conventions ci-dessus
3. **Exécutez les tests :** `node test/run.js` — tous les tests doivent passer
4. **Ouvrez une pull request** avec une description claire de ce que vous avez modifié et pourquoi

### Directives pour les PR

- **Gardez les PR ciblées** — une fonctionnalité ou correction par PR
- **Décrivez la modification** — quoi, pourquoi et comment la tester
- **Incluez des exemples** — si vous ajoutez un prompt, montrez un cas d'utilisation
- **Ne cassez pas le comportement existant** — testez manuellement les commandes CLI : `prompt-lib list`, `prompt-lib search`, etc.

---

## Signalement de Bugs

Ouvrez une issue en incluant :

- **Ce que vous attendiez** qu'il se passe
- **Ce qui s'est réellement passé**
- **Les étapes pour reproduire** le problème
- **Votre environnement :** version de Node.js, système d'exploitation, navigateur (pour les problèmes du Workshop)

---

## Demandes de Fonctionnalités

Ouvrez une issue en décrivant :

- **Ce que vous souhaitez faire**
- **Pourquoi les outils actuels ne répondent pas à ce besoin**
- **Comment vous attendez que cela fonctionne**

---

## Licence

En contribuant, vous acceptez que vos contributions soient licenciées sous la [Licence MIT](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/LICENSE).

---

**Navigation :** [← Applications Desktop](Applications-Desktop) &nbsp;|&nbsp; [Accueil](Accueil)
