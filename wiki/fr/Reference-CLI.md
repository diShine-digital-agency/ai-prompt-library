# Référence CLI

> Documentation complète de chaque commande `prompt-lib`.

---

## Vue d'ensemble

Le CLI `prompt-lib` est l'interface en ligne de commande de l'AI Prompt Library. Il fournit des commandes pour découvrir, construire, composer, analyser, optimiser et gérer des prompts — le tout sans aucune dépendance npm.

```
prompt-lib <commande> [arguments]
```

**Installation globale :**
```bash
npm install -g @dishine/prompt-library
prompt-lib --help
```

**Exécution locale (sans installation) :**
```bash
node bin/prompt-lib.js --help
```

---

## Référence des commandes

### `list` — Lister tous les prompts

Affiche tous les prompts regroupés par catégorie, avec le slug, le titre et le niveau de difficulté.

```bash
prompt-lib list
```

**Sortie :**
```
Prompt Library (82 prompts)

business (12)
  client-communication - Client Communication Template [intermediate]
  competitive-intelligence - Competitive Intelligence Brief [advanced]
  ...

data (10)
  dashboard-spec - Dashboard Specification [intermediate]
  ...
```

---

### `search <query>` — Rechercher des prompts

Recherche des prompts par mot-clé dans les titres, tags, catégories et contenus. Les résultats sont classés par score de pertinence.

```bash
prompt-lib search <query>
```

**Système de notation :**

| Emplacement de la correspondance | Points par terme |
|---------------------------------|:----------------:|
| Titre | 100 |
| Tag | 50 |
| Catégorie | 30 |
| Contenu | 10 |

Les requêtes à plusieurs mots attribuent un score indépendant à chaque mot. Un prompt correspondant à « code » et « review » dans le titre obtient 200 points.

**Exemples :**
```bash
prompt-lib search "chain of thought"
prompt-lib search "marketing email"
prompt-lib search "code review security"
prompt-lib search "claude xml"
prompt-lib search "data pipeline"
```

---

### `show <slug>` — Afficher le prompt complet

Affiche le contenu complet d'un prompt, y compris les métadonnées, le template, les conseils et les exemples.

```bash
prompt-lib show <slug>
```

**Exemple :**
```bash
prompt-lib show chain-of-thought
prompt-lib show code-review
prompt-lib show landing-page-copy
```

La sortie inclut :
- Titre, catégorie, difficulté, tags, modèles compatibles
- Contenu complet du prompt avec toutes les sections
- Chemin du fichier dans la bibliothèque

---

### `use <slug>` — Construire un prompt de manière interactive

Extrait la section template d'un prompt, détecte les `{{champs}}` et vous demande de remplir chacun d'eux. Le prompt complété est copié dans votre presse-papiers.

```bash
prompt-lib use <slug>
```

**Exemple :**
```bash
prompt-lib use code-review
```

```
Building prompt: Code Review Checklist
3 field(s) to fill in

  programming language: Python
  code snippet: def calculate_total(items): return sum(i.price for i in items)
  focus area: security and performance

──────────────────────────────────────────────────────────
  YOUR PROMPT (ready to paste)
──────────────────────────────────────────────────────────

[Filled prompt content here]

  Copied to clipboard.
```

---

### `copy <slug>` — Copier le template dans le presse-papiers

Extrait et copie la section template d'un prompt directement dans le presse-papiers, sans remplissage interactif.

```bash
prompt-lib copy <slug>
```

**Exemple :**
```bash
prompt-lib copy chain-of-thought
prompt-lib copy sql-query-builder
```

---

### `compose` — Combiner plusieurs couches

Commande interactive permettant de superposer une **invite système** + un **framework** + un **template de tâche** en un seul prompt puissant. Les champs dynamiques de toutes les couches sont remplis de manière interactive.

```bash
prompt-lib compose
```

**Flux de travail :**
1. Choisir une invite système (par ex. Coding Assistant, Research Assistant)
2. Choisir un framework de raisonnement (par ex. Chain-of-Thought, Few-Shot Patterns)
3. Choisir un template de domaine (par ex. Code Review, SQL Query Builder)
4. Remplir les `{{champs}}` des trois couches
5. Obtenir le prompt composé copié dans le presse-papiers
6. Optionnellement sauvegarder la composition pour plus tard

**Exemple de sortie :**
```
# SYSTEM PROMPT
You are a senior software engineer...

# REASONING FRAMEWORK
Think through this problem step by step...

# TASK TEMPLATE
Review the following code for...
```

Les compositions sauvegardées sont stockées dans `~/.prompt-library/saved-prompts.json`.

---

### `create` — Créer un prompt personnalisé

Commande interactive pour construire une nouvelle invite système avec des champs dynamiques personnalisés.

```bash
prompt-lib create
```

**Flux de travail :**
1. Saisir un titre, une catégorie, des tags, un niveau de difficulté et les modèles ciblés
2. Définir des champs dynamiques (qui deviennent des placeholders `{{nom_du_champ}}`)
3. Rédiger le corps du prompt en utilisant vos champs
4. Le prompt est sauvegardé dans `~/.prompt-library/custom-prompts.json`
5. Optionnellement le remplir et l'utiliser immédiatement

**Exemple :**
```
CREATE — build a new system prompt with custom fields

  Prompt title: Technical Blog Writer
  Category: custom
  Tags: blog, technical, writing
  Difficulty: intermediate

  Field name: topic
    Description: The topic of the blog post
  Field name: audience
    Description: Target audience level

  > Write a technical blog post about {{topic}} for {{audience}}...
```

Vos prompts personnalisés apparaissent dans `prompt-lib list` et `prompt-lib search` aux côtés des prompts intégrés.

---

### `generate` — Générer un prompt à partir d'un framework

Commande interactive qui vous guide dans la création d'un prompt en utilisant l'un des 5 frameworks intégrés.

```bash
prompt-lib generate
```

**Frameworks disponibles :**

| # | Framework | Description |
|---|-----------|-------------|
| 1 | **Expert Role-Based** | Crée des prompts avec une persona d'expert, des règles et des contraintes |
| 2 | **Chain-of-Thought** | Impose un raisonnement étape par étape |
| 3 | **Structured Output** | Produit une sortie cohérente et formatée |
| 4 | **Task Decomposition** | Décompose les tâches complexes en sous-tâches |
| 5 | **Guardrails & Safety** | Règles de sécurité intégrées et contraintes de sortie |

Chaque framework pose des questions contextuelles et génère un prompt prêt pour la production. Vous pouvez sauvegarder le résultat comme prompt personnalisé.

---

### `lint` — Analyser la qualité d'un prompt

Analyse un prompt selon 14 règles de qualité, produisant un score (0–100), une note (A–F) et des suggestions classées par priorité.

```bash
prompt-lib lint
```

Collez votre prompt (multiligne, terminez par deux lignes vides), et obtenez :

```
LINT RESULTS

  Score: 72/100 (Grade: C)
  Rules: 10/14 passed | 89 words

  ✅ Passing:
     • Role definition
     • Clear task
     • Constraints or rules
     ...

  💡 Suggestions to improve:
     → Specify the output format: "Respond in [format]"
     → Add examples of expected input/output
     ...
```

Consultez [Outils : Linter, Optimiseur, Recommandeur](Outils-Linter-Optimizer-Recommender.md) pour la liste complète des règles et les détails de notation.

---

### `optimize` — Réécrire un prompt selon les bonnes pratiques

Analyse et réécrit votre prompt grâce à une optimisation contextuelle. Fonctionne entièrement hors ligne.

```bash
prompt-lib optimize
```

L'optimiseur :
1. Détecte le domaine (code, rédaction, marketing, données, business, éducation, image)
2. Supprime les mots de remplissage et la politesse excessive
3. Renforce les verbes faibles
4. Remplace le langage vague par des termes précis
5. Ajoute une structure spécifique au domaine (rôle, contraintes, format de sortie)
6. Affiche les scores avant/après et toutes les modifications effectuées

```
Score: 35 → 88 (+53)
Changes made:
  • Removed filler words and redundant phrases
  • Replaced weak/hedging language with direct instructions
  • Added domain-specific role (coding)
  • Organized prompt into clear labeled sections
  • Added coding-specific output format
```

---

### `recommend <query>` — Suggestions intelligentes de prompts

Analyse votre description de cas d'usage et suggère les meilleurs prompts, y compris une combinaison optimale invite système + framework + template.

```bash
prompt-lib recommend <query>
```

**Exemple :**
```bash
prompt-lib recommend "I need to write a landing page for a SaaS product"
```

```
RECOMMENDATIONS for: "I need to write a landing page for a SaaS product"

  Suggested combination:

    🧠 System prompt:  Content Writer (content-writer)
    🔧 Framework:      Few-Shot Patterns (few-shot-patterns)
    📝 Template:       Landing Page Copy (landing-page-copy)

  Top matching prompts:

    Landing Page Copy
      slug: landing-page-copy | category: marketing | score: 65
    ...
```

---

### `saved` — Voir les compositions sauvegardées

Liste toutes les compositions sauvegardées et les prompts personnalisés depuis `~/.prompt-library/`.

```bash
prompt-lib saved
```

---

### `viewer` — Ouvrir le Prompt Workshop

Ouvre le Prompt Workshop (outil visuel dans le navigateur) avec tous les prompts chargés.

```bash
prompt-lib viewer
```

La commande injecte les données des prompts dans `viewer.html` et l'ouvre dans votre navigateur par défaut.

---

### `categories` — Lister toutes les catégories

Affiche toutes les catégories de prompts avec le nombre de prompts dans chacune.

```bash
prompt-lib categories
```

---

### `random` — Afficher un prompt aléatoire

Affiche un prompt au hasard depuis la bibliothèque — idéal pour l'inspiration.

```bash
prompt-lib random
```

---

### `stats` — Statistiques de la bibliothèque

Affiche des statistiques complètes : nombre total de prompts, catégories, tags uniques, modèles couverts, répartition par difficulté et tags les plus utilisés.

```bash
prompt-lib stats
```

---

### `--help`, `-h` — Aide

```bash
prompt-lib --help
```

### `--version`, `-v` — Version

```bash
prompt-lib --version
```

---

## Prise en charge du presse-papiers

Les commandes `copy`, `use` et `compose` copient automatiquement les résultats dans votre presse-papiers. Outils utilisés selon la plateforme :

| Plateforme | Outil presse-papiers | Notes |
|------------|---------------------|-------|
| **macOS** | `pbcopy` | Intégré, toujours disponible |
| **Windows** | `clip` | Intégré, toujours disponible |
| **Linux** | `xclip` ou `xsel` | Installer avec `sudo apt install xclip` |

Si aucun outil de presse-papiers n'est disponible, le CLI affiche le contenu du prompt et vous demande de le copier manuellement.

---

## Flux de travail courants

### Flux 1 : Découverte rapide de prompts

```bash
prompt-lib search "sql"          # Trouver les prompts liés à SQL
prompt-lib show sql-query-builder # Lire le prompt complet
prompt-lib use sql-query-builder  # Remplir les champs et copier
```

### Flux 2 : Construire un prompt composé

```bash
prompt-lib compose               # Superposer système + framework + template
# ou pour des suggestions assistées par IA :
prompt-lib recommend "build a REST API" # Obtenir des recommandations d'abord
```

### Flux 3 : Vérifier la qualité de votre prompt

```bash
prompt-lib lint                  # Évaluer votre prompt
prompt-lib optimize              # Réécrire selon les bonnes pratiques
```

### Flux 4 : Créer et réutiliser des prompts personnalisés

```bash
prompt-lib create                # Créer un prompt personnalisé
prompt-lib saved                 # Voir vos prompts sauvegardés
prompt-lib use my-custom-prompt  # L'utiliser à tout moment
```

---

## Variables d'environnement

| Variable | Effet |
|----------|-------|
| `NO_COLOR` | Désactive les couleurs ANSI lorsque définie à n'importe quelle valeur |

---

**Navigation :** [← Premiers pas](Premiers-Pas.md) &nbsp;|&nbsp; [Prompt Workshop →](Prompt-Workshop.md)
