# Architecture

> Architecture technique, référence des modules, formats de données et structure du projet de l'AI Prompt Library.

---

## Table des matières

- [Vue d'ensemble de l'architecture](#vue-densemble-de-larchitecture)
- [Référence des modules](#référence-des-modules)
- [Formats de données](#formats-de-données)
- [Clés localStorage](#clés-localstorage)
- [Structure des fichiers du projet](#structure-des-fichiers-du-projet)
- [Modules natifs Node.js utilisés](#modules-natifs-nodejs-utilisés)
- [Fonctionnement de viewer.html](#fonctionnement-de-viewerhtml)

---

## Vue d'ensemble de l'architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Interface utilisateur                  │
│                                                         │
│   CLI (bin/prompt-lib.js)    HTML (viewer.html)          │
│   ├── list, search, show     ├── Onglet Parcourir        │
│   ├── use, copy              ├── Onglet Composer         │
│   ├── compose                ├── Onglet Créer            │
│   ├── create                 ├── Onglet Générer          │
│   ├── generate               ├── Onglet Outils           │
│   ├── lint                   │   ├── Linter              │
│   ├── optimize               │   ├── Optimiseur          │
│   ├── recommend              │   └── Recommandeur        │
│   ├── saved                  ├── Onglet Playground       │
│   └── viewer                 └── Onglet Ma bibliothèque  │
│                                                         │
│   Applications de bureau (desktop/)                     │
│   ├── macOS natif (Swift + WebKit)                      │
│   ├── Linux natif (Python + GTK + WebKitGTK)            │
│   └── Windows (mode application Edge/Chrome)            │
├─────────────────────────────────────────────────────────┤
│                    Modules principaux                    │
│                                                         │
│   src/index.js     — Chargeur de prompts, persistance    │
│   src/search.js    — Algorithme de recherche pondéré     │
│   src/formatter.js — Formatage ANSI pour le terminal     │
│   src/generator.js — Génération dynamique de prompts     │
│   src/linter.js    — Analyseur qualité à 14 règles       │
│   src/optimizer.js — Optimiseur contextuel de prompts    │
│   src/recommender.js — Correspondance par intention      │
├─────────────────────────────────────────────────────────┤
│                    Couche de données                     │
│                                                         │
│   prompts/**/*.md           — Fichiers de prompts        │
│   ~/.prompt-library/        — Répertoire utilisateur     │
│     custom-prompts.json     — Prompts créés              │
│     saved-prompts.json      — Compositions sauvegardées  │
│   localStorage (navigateur) — Persistance de l'app HTML  │
└─────────────────────────────────────────────────────────┘
```

---

## Référence des modules

### `src/index.js` — Chargeur de prompts et persistance

Le module principal qui charge les prompts depuis le système de fichiers et gère les données utilisateur.

**Exports :**

| Fonction | Signature | Description |
|----------|-----------|-------------|
| `loadPrompts()` | `() → Array<Prompt>` | Charge tous les prompts depuis le répertoire `prompts/` + les prompts personnalisés depuis `~/.prompt-library/custom-prompts.json` |
| `loadCustomPrompts()` | `() → Array<Prompt>` | Charge uniquement les prompts personnalisés créés par l'utilisateur |
| `saveCustomPrompt(prompt)` | `(Prompt) → Prompt` | Sauvegarde un prompt personnalisé. Écrase si le slug existe, sinon ajoute |
| `loadSavedCompositions()` | `() → Array<Composition>` | Charge les compositions sauvegardées depuis `~/.prompt-library/saved-prompts.json` |
| `saveComposition(composition)` | `(Object) → Composition` | Ajoute une composition avec un `id` auto-généré (timestamp) et une `date` (chaîne ISO) |
| `findPlaceholders(text)` | `(string) → Array<string>` | Extrait les tokens `{{placeholder}}` uniques du texte via la regex `/\{\{[\w_\-\s/]+\}\}/g` |
| `extractTemplate(content)` | `(string) → string\|null` | Extrait le contenu entre les blocs de code de la section `## Template` |

**Constantes exportées :**

| Nom | Valeur | Description |
|-----|--------|-------------|
| `PROMPTS_DIR` | `<project>/prompts/` | Chemin absolu vers les prompts intégrés |
| `USER_DATA_DIR` | `~/.prompt-library/` | Répertoire des données utilisateur |
| `USER_PROMPTS_FILE` | `~/.prompt-library/custom-prompts.json` | Fichier des prompts personnalisés |
| `USER_SAVED_FILE` | `~/.prompt-library/saved-prompts.json` | Fichier des compositions sauvegardées |

**Fonctions internes :**
- `parseFrontmatter(content)` — analyse le frontmatter YAML (entre les marqueurs `---`) en un objet `{meta, body}`. Gère les tableaux entre crochets (`[tag1, tag2]`).
- `walkDir(dir)` — recherche récursivement tous les fichiers `.md` dans une arborescence.
- `ensureUserDir()` — crée `~/.prompt-library/` s'il n'existe pas.

---

### `src/search.js` — Algorithme de recherche

**Exports :**

| Fonction | Signature | Description |
|----------|-----------|-------------|
| `searchPrompts(prompts, query)` | `(Array, string) → Array` | Note et classe les prompts par pertinence par rapport à la requête |

**Notation :**

| Emplacement de la correspondance | Points par terme |
|---------------------------------|:----------------:|
| Titre | 100 |
| Tag | 50 |
| Catégorie | 30 |
| Contenu | 10 |

**Algorithme :**
1. Découper la requête en termes en minuscules
2. Pour chaque prompt, noter chaque terme par rapport au titre, aux tags, à la catégorie et au contenu
3. Additionner tous les points
4. Filtrer les prompts à score nul
5. Trier par score décroissant

---

### `src/formatter.js` — Formatage terminal

Fournit le formatage ANSI en couleur pour la sortie CLI. Respecte la variable d'environnement `NO_COLOR` (quand définie, tous les codes couleur sont des chaînes vides).

**Exports :**

| Fonction | Description |
|----------|-------------|
| `formatPromptList(prompts)` | Formate tous les prompts groupés par catégorie |
| `formatPromptDetail(prompt)` | Formate un prompt avec toutes ses métadonnées |
| `formatCategories(prompts)` | Formate la liste des catégories avec compteurs |
| `formatStats(prompts)` | Formate les statistiques de la bibliothèque (totaux, répartition par difficulté, tags principaux) |
| `formatSearchResults(results, query)` | Formate les résultats de recherche avec scores |

**Schéma de couleurs :**
- Cyan : titres, slugs, en-têtes de section
- Magenta : noms de catégorie
- Jaune : labels de métadonnées, difficulté intermédiaire
- Vert : difficulté débutant, tags
- Rouge : difficulté avancée
- Gris/atténué : séparateurs, informations secondaires

---

### `src/generator.js` — Génération dynamique de prompts

**Exports :**

| Fonction | Signature | Description |
|----------|-----------|-------------|
| `getFrameworks()` | `() → Array<FrameworkInfo>` | Renvoie tous les frameworks avec métadonnées et questions |
| `getFramework(key)` | `(string) → Framework\|null` | Renvoie un framework par sa clé |
| `generatePrompt(key, answers)` | `(string, Object) → string` | Génère un prompt complet. Valide les champs requis et applique les valeurs par défaut. |

**Frameworks disponibles :**

| Clé | Nom | Questions |
|-----|-----|:---------:|
| `expert-role` | Expert Role-Based | 8 |
| `chain-of-thought` | Chain-of-Thought | 5 |
| `structured-output` | Structured Output | 5 |
| `task-decomposition` | Task Decomposition | 4 |
| `guardrails` | Guardrails & Safety | 6 |

Chaque framework définit une fonction `generate(answers)` qui produit la chaîne de prompt finale à partir des réponses de l'utilisateur.

---

### `src/linter.js` — Analyseur de qualité des prompts

**Exports :**

| Fonction | Signature | Description |
|----------|-----------|-------------|
| `lintPrompt(text)` | `(string) → LintResult` | Analyse un prompt selon 14 règles. Renvoie score, note, règles réussies/échouées, suggestions, nombre de mots |
| `formatLintResult(result)` | `(LintResult) → string` | Formate le résultat du lint en chaîne lisible |
| `LINT_RULES` | `Array<Rule>` | Tableau des 14 objets de règles |

**Structure LintResult :**
```javascript
{
  score: 72,              // 0-100
  grade: 'C',             // A, B, C, D, F
  totalRules: 14,
  passedCount: 10,
  failedCount: 4,
  passed: [...],           // Tableau des règles réussies
  failed: [...],           // Tableau des règles échouées
  suggestions: [...],      // Tableau de suggestions (triées par poids)
  wordCount: 89
}
```

**Notation :** `score = Math.round((earnedWeight / totalWeight) × 100)` où totalWeight = 100.

Voir [Outils : Linter, Optimiseur, Recommandeur](Outils-Linter-Optimizer-Recommender.md#prompt-linter) pour la liste complète des règles.

---

### `src/optimizer.js` — Optimiseur contextuel de prompts

**Exports :**

| Fonction | Signature | Description |
|----------|-----------|-------------|
| `optimizePrompt(text)` | `(string) → OptimizeResult` | Optimisation hors ligne par règles |
| `optimizeWithAI(text, provider, apiKey, model)` | `(string, string, string, string?) → Promise<string>` | Réécriture assistée par IA |
| `sendToAI(prompt, systemPrompt, provider, apiKey, model)` | `(string, string?, string, string, string?) → Promise<AIResponse>` | Envoie un prompt au modèle IA (Playground) |

**Structure OptimizeResult :**
```javascript
{
  original: "...",         // Texte du prompt original
  optimized: "...",        // Texte du prompt optimisé
  changes: [...],          // Tableau des descriptions de modifications
  scoreBefore: 35,
  scoreAfter: 88,
  improvement: 53,
  lint: { ... },           // Résultat lint complet du prompt optimisé
  domain: "coding",        // Domaine détecté
  audience: "developers"   // Audience détectée (ou null)
}
```

**Pipeline d'optimisation :** détection du domaine → suppression des remplissages → réduction de la politesse → renforcement des verbes faibles → remplacement du langage vague → décomposition des tâches composées → injection de rôle → détection audience/ton → contraintes → format de sortie → exemples → vérification qualité.

**7 domaines détectés :** code, rédaction, marketing, données, business, éducation, image.

---

### `src/recommender.js` — Correspondance par intention

**Exports :**

| Fonction | Signature | Description |
|----------|-----------|-------------|
| `recommendPrompts(prompts, description)` | `(Array, string) → Array` | Note tous les prompts par pertinence |
| `buildRecommendation(prompts, description)` | `(Array, string) → Recommendation` | Construit une recommandation complète avec combinaison |

**Structure Recommendation :**
```javascript
{
  description: "...",
  topPrompts: [...],          // 8 meilleurs résultats
  suggestedCombo: {
    systemPrompt: { ... },    // Meilleure invite système
    framework: { ... },       // Meilleur framework
    template: { ... }         // Meilleur template de domaine
  },
  systemPrompts: [...],       // Top 3 invites système
  frameworks: [...],          // Top 3 frameworks
  templates: [...]            // Top 5 templates
}
```

**8 catégories d'intention :** code, rédaction, marketing, données, business, image, recherche, enseignement.

---

## Formats de données

### Objet Prompt

```json
{
  "slug": "code-review",
  "title": "Code Review Checklist",
  "category": "development",
  "tags": ["code-review", "quality", "checklist"],
  "difficulty": "intermediate",
  "models": ["claude", "gpt-4", "gemini"],
  "content": "# Code Review Checklist\n\n## Template\n\n```\n...\n```",
  "path": "development/code-review.md"
}
```

Les prompts personnalisés ajoutent :
```json
{
  "fields": [
    { "name": "language", "description": "Programming language" }
  ],
  "custom": true
}
```

### Composition sauvegardée

```json
{
  "id": 1712430000000,
  "title": "Composed: Coding Assistant + Chain-of-Thought + Code Review",
  "result": "# SYSTEM PROMPT\n\n...\n\n# REASONING FRAMEWORK\n\n...",
  "layers": ["Coding Assistant", "Chain-of-Thought", "Code Review"],
  "type": "composed",
  "date": "2026-04-06T12:00:00.000Z"
}
```

### Format de fichier de prompt (frontmatter YAML)

```markdown
---
title: My Prompt Title
category: frameworks
tags: [tag1, tag2, tag3]
difficulty: intermediate
models: [claude, gpt-4, gemini]
---

# My Prompt Title

## When to Use
[description]

## Template

\```
Your prompt template with {{placeholders}} here
\```

## Tips
[expert tips]

## Common Mistakes
[pitfalls to avoid]
```

---

## Clés localStorage

Ces clés sont utilisées par le Prompt Workshop (`viewer.html`) :

| Clé | Type | Description |
|-----|------|-------------|
| `pl_dark` | `boolean` | Préférence de mode sombre (`true`/`false`) |
| `pl_saved` | `JSON array` | Tous les prompts sauvegardés, templates remplis, prompts composés, prompts personnalisés. Les éléments de la base de données sont marqués avec `source: 'database'` |
| `pl_sidebar_width` | `number` | Largeur de la barre latérale en pixels (260–600). Persiste entre les sessions |
| `api_settings` | `JSON object` | Clés API et préférences de modèles pour le Playground et l'optimiseur IA. Contient le fournisseur, les clés pour OpenAI/Anthropic/Google, et les modèles sélectionnés |

---

## Structure des fichiers du projet

```
ai-prompt-library/
├── bin/
│   └── prompt-lib.js            # Point d'entrée CLI (ESM, #!/usr/bin/env node)
├── src/
│   ├── index.js                 # Chargeur de prompts, persistance, placeholders
│   ├── search.js                # Algorithme de recherche pondéré
│   ├── formatter.js             # Formatage ANSI pour le terminal
│   ├── generator.js             # 5 frameworks, génération dynamique
│   ├── linter.js                # Analyseur qualité à 14 règles
│   ├── optimizer.js             # Optimiseur contextuel + API IA
│   └── recommender.js           # Correspondance par intention
├── prompts/
│   ├── business/                # 12 templates business
│   ├── data/                    # 10 templates d'analyse de données
│   ├── development/             # 13 templates de développement
│   ├── frameworks/              # 12 guides de frameworks de prompting
│   ├── image-generation/        # 8 templates de génération d'images
│   ├── marketing/               # 11 templates marketing
│   ├── model-specific/          # 6 guides spécifiques aux modèles
│   └── system-prompts/          # 10 invites système
├── desktop/
│   ├── build-all.sh             # Compilation toutes plateformes
│   ├── build-macos.sh           # Script de compilation macOS
│   ├── build-linux.sh           # Script de compilation Linux
│   ├── build-windows.bat        # Script de compilation Windows
│   ├── macos-native/            # Source Swift pour l'app native macOS
│   ├── linux-native/            # Source Python + GTK pour l'app native Linux
│   ├── icons/                   # Icônes pour toutes les plateformes
│   └── images/                  # Captures d'écran et images de documentation
├── test/
│   └── run.js                   # Suite de tests (46 tests, zéro dépendances)
├── wiki/
│   ├── en/                      # Pages wiki en anglais
│   ├── fr/                      # Pages wiki en français
│   └── it/                      # Pages wiki en italien
├── viewer.html                  # Prompt Workshop (SPA autonome)
├── package.json                 # Configuration du package (zéro dépendances)
├── README.md                    # Vue d'ensemble du projet
├── GUIDE.md                     # Guide utilisateur
├── TECHNICAL.md                 # Documentation technique
├── FUNCTIONS.md                 # Référence des fonctions
├── CONTRIBUTING.md              # Guide de contribution
├── CHANGELOG.md                 # Historique des versions
├── CODE_OF_CONDUCT.md           # Code de conduite
├── SECURITY.md                  # Politique de sécurité
└── LICENSE                      # Licence MIT
```

---

## Modules natifs Node.js utilisés

Le projet utilise **zéro dépendance npm**. Uniquement les modules natifs de Node.js :

| Module | Utilisation |
|--------|------------|
| `fs` | Lecture de fichiers (`readFileSync`), écriture (`writeFileSync`), parcours de répertoires (`readdirSync`, `statSync`), vérifications d'existence (`existsSync`), création de répertoires (`mkdirSync`) |
| `path` | Manipulation de chemins (`join`, `dirname`, `relative`, `basename`) |
| `url` | `fileURLToPath` pour un `__dirname` compatible ESM |
| `readline` | Saisie interactive CLI (questions et entrée multiligne) |
| `child_process` | Copie dans le presse-papiers via `execSync` (`pbcopy`, `clip`, `xclip`, `xsel`), ouverture du navigateur (`open`, `xdg-open`, `start`) |
| `os` | Répertoire personnel (`homedir`), répertoire temporaire (`tmpdir`) |

---

## Fonctionnement de viewer.html

Le fichier `viewer.html` est une **application monopage autonome** :

1. **Aucune dépendance externe** — HTML, CSS et JavaScript vanilla purs dans un seul fichier
2. **Données de prompts intégrées** — les 82+ prompts sont sérialisés en JSON dans une balise `<script>`
3. **localStorage pour la persistance** — prompts personnalisés, compositions sauvegardées, favoris, clés API et préférences d'interface
4. **Design responsive** — fonctionne sur bureau, tablette et mobile
5. **Mode sombre/clair** — commutable avec préférence sauvegardée dans localStorage

Quand lancé via `prompt-lib viewer`, le CLI :
1. Lit `viewer.html`
2. Charge tous les prompts (y compris les prompts personnalisés)
3. Injecte les données des prompts en JSON dans le HTML
4. Écrit le HTML modifié dans un fichier temporaire
5. Ouvre le fichier temporaire dans le navigateur par défaut

Quand ouvert directement, les données de prompts intégrées (compilées au moment du release) sont utilisées.

---

**Navigation :** [← API et Playground](API-et-Playground) &nbsp;|&nbsp; [Applications de bureau →](Applications-Desktop)
