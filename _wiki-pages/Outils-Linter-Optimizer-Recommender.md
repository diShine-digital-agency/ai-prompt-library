# Outils : Linter, Optimiseur, Recommandeur

> Analyse approfondie des trois outils qualité — fonctionnement, systèmes de notation et bonnes pratiques d'utilisation.

---

## Table des matières

- [Prompt Linter](#prompt-linter)
- [Prompt Optimizer](#prompt-optimizer)
- [Smart Recommender](#smart-recommender)

---

## Prompt Linter

**CLI :** `prompt-lib lint`
**Workshop :** Onglet Outils → Linter
**Source :** [`src/linter.js`](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/src/linter.js)

Le Prompt Linter analyse n'importe quel prompt selon **14 règles de qualité** et produit un score de 0 à 100, une note (A–F) et des suggestions d'amélioration classées par priorité.

### Les 14 règles

| # | ID de règle | Nom de la règle | Poids | Ce qu'elle vérifie |
|---|------------|----------------|:-----:|-------------------|
| 1 | `has-role` | Définition du rôle | 10 | Le prompt spécifie qui l'IA doit être (`you are`, `act as`, `role:`, `persona:`) |
| 2 | `has-task` | Tâche claire | 12 | Le prompt indique ce que l'IA doit faire (`task:`, `your job`, `please create/write/generate`) |
| 3 | `has-context` | Contexte fourni | 8 | Des informations de fond sont incluses (`context:`, `background:`, `given that`) |
| 4 | `has-output-format` | Format de sortie spécifié | 10 | Le format de sortie attendu est défini (`output format:`, `respond in`, `use markdown/json`) |
| 5 | `has-constraints` | Contraintes ou règles | 8 | Des règles et limites sont définies (`rule`, `never`, `always`, `do not`, `must not`) |
| 6 | `sufficient-length` | Détail suffisant | 8 | Le prompt fait au moins 50 mots |
| 7 | `not-too-long` | Pas excessivement long | 5 | Le prompt fait moins de 2000 mots |
| 8 | `has-examples` | Exemples inclus | 7 | Des exemples de sortie attendue sont fournis (`example:`, `for example`, `such as`) |
| 9 | `has-sections` | Sections structurées | 7 | Le prompt a 2+ en-têtes ou sections nommées (`## Header` ou `LABEL:`) |
| 10 | `no-vague-language` | Langage précis | 7 | Utilise 3 mots vagues ou moins (`good`, `nice`, `proper`, `appropriate`) |
| 11 | `has-audience` | Public cible | 5 | Spécifie qui lira la sortie (`audience:`, `for a beginner/expert/developer`) |
| 12 | `has-tone` | Ton spécifié | 5 | Définit le style de communication (`tone:`, `be professional/casual/technical`) |
| 13 | `no-please-overuse` | Pas trop poli | 3 | Utilise « please » 2 fois ou moins |
| 14 | `has-quality-check` | Étape de vérification qualité | 5 | Demande à l'IA de vérifier son travail (`verify`, `check your`, `double-check`, `ensure accuracy`) |

### Formule de notation

```
score = (somme des poids des règles réussies / poids total) × 100
```

**Poids total :** 100 (somme des 14 poids : 10+12+8+10+8+8+5+7+7+7+5+5+3+5)

### Échelle de notation

| Note | Plage de score | Signification |
|:----:|:--------------:|--------------|
| **A** | 90–100 | Excellent — prompt prêt pour la production |
| **B** | 75–89 | Bon — améliorations mineures possibles |
| **C** | 60–74 | Acceptable — plusieurs points à améliorer |
| **D** | 40–59 | En dessous de la moyenne — problèmes significatifs |
| **F** | 0–39 | Insuffisant — nécessite une refonte majeure |

### Exemple : analyse d'un mauvais prompt

**Prompt en entrée :**
```
Can you please help me write something good about dogs? Please make it nice
and interesting. Please include some good information.
```

**Résultat du lint :**
```
Score: 15/100 (Grade: F)
Rules: 2/14 passed | 23 words

✅ Passing:
   • Not excessively long
   • Specific language

💡 Suggestions to improve:
   → State the task explicitly: "Your task is to…"
   → Add a role definition like "You are a senior [role] expert…"
   → Specify the output format: "Respond in [format]"
   → Add context: "Context: …" or "Given the following information: …"
   → Add constraints: "Rules: …" or "Never do X" / "Always do Y"
   → Your prompt is quite short. Add more detail about what you want.
   → Add examples of expected input/output to guide the AI.
   → Organize your prompt with clear sections using headers or labels.
   → Specify the target audience: "This is for [audience]…"
   → Define the tone: "Use a [professional/casual/technical] tone."
   → Reduce "please" usage — direct instructions work better with AI.
   → Add a quality check: "Before responding, verify that…"
```

### Conseils pour de meilleurs scores

- Ajoutez une définition de rôle (10 points) : `"You are a senior content writer"`
- Énoncez clairement la tâche (12 points) : `"Your task is to write a 500-word blog post"`
- Spécifiez le format de sortie (10 points) : `"Respond in markdown with headings"`
- Ajoutez des contraintes (8 points) : `"Never make up statistics"`
- Ajoutez du contexte (8 points) : `"Context: This is for a pet adoption website"`
- Rédigez au moins 50 mots (8 points)
- Incluez des exemples (7 points)
- Utilisez des en-têtes de section (7 points)

### Détection du Type de Prompt (v2.4.0)

Le linter détecte automatiquement le type de prompt et ajuste les poids des règles :

| Type | Détection | Changements de poids |
|------|-----------|---------------------|
| 🎨 Image | Mots-clés : image, photo, visual, dall-e, midjourney... | Ignore audience, tone, quality-check. Augmente vague-language (×1.5) |
| 💻 Code | Mots-clés : code, function, class, api, debug... | Augmente task, context, output-format, constraints (×1.2) |
| 🤖 Système | Mots-clés : you are, act as, persona... + longueur < 800 | Augmente role (×1.5), constraints (×1.5). Relâche length (×0.5) |
| 📝 Général | Par défaut | Tous les poids à ×1.0 |

> Pour le tableau complet des multiplicateurs, voir [INFRASTRUCTURE.md](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/INFRASTRUCTURE.md#3-prompt-type-detection).

---

## Prompt Optimizer

**CLI :** `prompt-lib optimize`
**Workshop :** Onglet Outils → Optimizer
**Source :** [`src/optimizer.js`](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/src/optimizer.js)

Le Prompt Optimizer réécrit les prompts grâce à une analyse contextuelle. Il détecte le domaine, l'audience et l'intention, puis applique des améliorations ciblées spécifiques au contenu réel du prompt.

### Deux modes

| Mode | Fonctionnement | Pré-requis | Vitesse |
|------|---------------|-----------|:-------:|
| **Instantané (hors ligne)** | Optimisation par règles via le pipeline intégré | Aucun | Instantané |
| **Assisté par IA** | Envoie le prompt à GPT/Claude/Gemini pour une réécriture professionnelle | Clé API | 2–10s |

### Pipeline d'optimisation instantanée

L'optimiseur traite votre prompt à travers ces étapes dans l'ordre :

```
Prompt en entrée
    │
    ├── 1. Détection du domaine (7 domaines)
    ├── 2. Suppression des remplissages (phrases redondantes)
    ├── 3. Réduction de la politesse (excès de « please »)
    ├── 4. Renforcement des verbes faibles (hésitation → direct)
    ├── 5. Remplacement du langage vague (termes précis)
    ├── 6. Décomposition des tâches composées (multi-tâche → étapes)
    ├── 7. Injection de rôle spécifique au domaine
    ├── 8. Détection de l'audience et réglage du ton
    ├── 9. Ajout de contraintes (spécifiques au domaine)
    ├── 10. Spécification du format de sortie
    ├── 11. Placeholder d'exemples
    └── 12. Étape de vérification qualité
    │
    ▼
Prompt optimisé + scores avant/après + journal des modifications
```

### Détection du domaine

L'optimiseur recherche des mots-clés pour identifier l'un des 7 domaines :

| Domaine | Mots-clés exemples | Rôle attribué automatiquement |
|---------|-------------------|------------------------------|
| **Code** | code, programming, api, debug, refactor, javascript, python | Senior software engineer with deep expertise in software architecture |
| **Rédaction** | write, blog, article, essay, email, content, draft | Experienced content strategist and professional writer |
| **Marketing** | marketing, seo, social media, campaign, conversion, funnel | Senior marketing strategist with expertise in digital marketing |
| **Données** | data, analysis, sql, dashboard, statistics, ml, pipeline | Senior data analyst with expertise in statistical analysis |
| **Business** | business, proposal, strategy, stakeholder, budget, revenue | Experienced business consultant with expertise in strategic planning |
| **Éducation** | teach, explain, student, course, lesson, simplify | Experienced educator skilled at breaking down complex concepts |
| **Image** | image, photo, visual, design, logo, midjourney, dall-e | Expert visual artist and AI image prompt engineer |

Chaque domaine fournit :
- Un rôle d'expert spécifique (au lieu du générique « helpful assistant »)
- Des contraintes pertinentes pour le domaine
- Un format de sortie approprié
- Des vérifications qualité spécifiques au domaine
- Des placeholders d'exemples

### Mots de remplissage supprimés

L'optimiseur élimine ces expressions superflues :
- `basically`, `essentially`, `actually`, `literally`, `honestly`
- `obviously`, `clearly`, `simply put`, `in other words`
- `as you know`, `it goes without saying`, `needless to say`
- `I think`, `I believe`, `I feel like`, `in my opinion`

### Verbes faibles renforcés

Ces formulations hésitantes sont supprimées ou remplacées par des instructions directes :

| Avant | Après |
|-------|-------|
| "Can you write..." | "Write..." |
| "Could you create..." | "Create..." |
| "I want you to..." | (supprimé, instruction directe suit) |
| "I need you to..." | (supprimé) |
| "Try to..." | (supprimé) |
| "Maybe..." | (supprimé) |
| "If possible..." | (supprimé) |
| "Just..." | (supprimé) |
| "Kind of..." | (supprimé) |
| "Sort of..." | (supprimé) |

### Remplacements du langage vague

| Vague | Remplacé par |
|-------|-------------|
| "a good way" | "an effective, well-reasoned way" |
| "make it good" | "ensure it is clear, thorough, and well-structured" |
| "something nice" | "a polished, professional result" |
| "properly" | "correctly and following established standards" |
| "appropriate" | "suitable for the stated context and audience" |
| "interesting" | "insightful and thought-provoking" |
| "as much as possible" | "comprehensively, covering all key aspects" |
| "etc." | "and related items" |
| "stuff" | "components" |
| "things" | "elements" |

### Exemple : avant et après

**Avant (Score : 35/100, Note : F) :**
```
Can you please help me write a good blog post about machine learning?
Please make it interesting and cover the basics. I want you to maybe
include some good examples if possible. Thanks!
```

**Après (Score : 88/100, Note : B) :**
```
You are an experienced content strategist and professional writer with
expertise in clear, engaging communication.

TASK:
Write a blog post about machine learning. Cover the basics. Include
insightful and thought-provoking examples.

TARGET AUDIENCE:
This is for beginners.

TONE:
Be clear, engaging, and well-paced.

OUTPUT FORMAT:
Respond in well-structured prose with clear headings, short paragraphs,
and a logical narrative flow. Use markdown formatting.

RULES:
- Use clear, concise language appropriate to the target audience
- Maintain a consistent tone and voice throughout
- Structure content with logical flow and smooth transitions
- Support claims with specific details or examples

Before responding, verify that the writing is clear, free of jargon,
logically structured, and engaging for the target audience.
```

**Modifications effectuées :**
- Suppression des mots de remplissage et des phrases redondantes
- Remplacement du langage hésitant par des instructions directes
- Remplacement du langage vague par des termes précis
- Ajout d'un rôle spécifique au domaine (rédaction)
- Organisation du prompt en sections clairement nommées
- Ajout d'un format de sortie spécifique à la rédaction
- Ajout de contraintes qualité spécifiques à la rédaction
- Ajout d'une étape de vérification qualité

### Vue Différences (v2.4.0)

Après optimisation, basculez entre :
- **Optimisé** — prompt optimisé propre
- **Vue Diff** — comparaison colorée ligne par ligne (🟢 ajouté, 🔴 supprimé, sans marqueur = inchangé)

---

## Smart Recommender

**CLI :** `prompt-lib recommend <query>`
**Workshop :** Onglet Outils → Recommender
**Source :** [`src/recommender.js`](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/src/recommender.js)

Le Smart Recommender analyse votre description en langage naturel et suggère les meilleurs prompts de la bibliothèque, y compris une combinaison optimale.

### Fonctionnement

```
Description de l'utilisateur
    │
    ├── 1. Extraction des termes (découpage en mots recherchables)
    ├── 2. Détection de l'intention (correspondance avec 8 catégories)
    ├── 3. Notation des prompts (correspondance des termes avec tous les prompts)
    ├── 4. Bonus d'intention (promotion des prompts dans les catégories correspondantes)
    └── 5. Construction de la combinaison (invite système + framework + template)
    │
    ▼
8 meilleurs résultats + combinaison suggérée
```

### Système de notation

Pour chaque prompt de la bibliothèque, le recommandeur calcule un score de pertinence :

| Emplacement de la correspondance | Points par terme |
|---------------------------------|:----------------:|
| Titre | 20 |
| Tags | 15 |
| Catégorie | 10 |
| Contenu | 3 |

Les prompts dans les catégories correspondant à l'intention détectée reçoivent un bonus.

### 8 catégories d'intention

| Intention | Mots-clés déclencheurs |
|-----------|----------------------|
| **Code** | code, programming, developer, software, api, debug, refactor, test, git, deploy |
| **Rédaction** | write, blog, article, copy, content, essay, email, letter, documentation |
| **Marketing** | marketing, seo, social media, campaign, ads, brand, landing page, conversion |
| **Données** | data, analysis, sql, database, dashboard, report, statistics, visualization, etl |
| **Business** | business, proposal, meeting, stakeholder, strategy, okr, pitch, client, project |
| **Image** | image, photo, visual, design, logo, illustration, portrait, scene, art |
| **Recherche** | research, analyze, investigate, study, compare, evaluate, review |
| **Enseignement** | teach, explain, tutor, learn, student, course, education |

### Format de sortie

Le recommandeur renvoie :

1. **8 meilleurs prompts** — classés par score de pertinence
2. **Combinaison suggérée** — la meilleure association de :
   - 🧠 **Invite système** — l'invite système la plus pertinente
   - 🔧 **Framework** — le framework le plus pertinent
   - 📝 **Template** — le template de domaine le plus pertinent
3. **Résultats catégorisés** — top 3 invites système, top 3 frameworks, top 5 templates

### Exemple

**Requête :** "I need to build a REST API with authentication"

**Sortie :**
```
Suggested combination:

  🧠 System prompt:  Coding Assistant (coding-assistant)
  🔧 Framework:      Chain-of-Thought (chain-of-thought)
  📝 Template:       API Design (api-design)

Top matching prompts:

  API Design
    slug: api-design | category: development | score: 68
  System Design
    slug: system-design | category: development | score: 43
  Coding Assistant
    slug: coding-assistant | category: system-prompts | score: 38
  ...
```

### Conseils pour de meilleures recommandations

- **Soyez descriptif :** « I need to write marketing emails for a SaaS product » > « email help »
- **Incluez des mots-clés du domaine :** « data analysis SQL dashboard » déclenche l'intention données
- **Mentionnez l'objectif final :** « create a landing page that converts » > « make a web page »
- **Combinez les contextes :** « code review for Python REST API » déclenche à la fois code et développement

---

**Navigation :** [← Guide des modèles IA](Guide-Modeles-IA) &nbsp;|&nbsp; [API et Playground →](API-et-Playground)
