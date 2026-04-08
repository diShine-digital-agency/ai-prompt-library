# Techniques de prompting

> Guide complet de chaque framework, pattern et bonne pratique de prompting couverts dans l'AI Prompt Library.

---

## Table des matières

- [Chain-of-Thought (CoT)](#chain-of-thought-cot)
- [Few-Shot Patterns](#few-shot-patterns)
- [ReAct Agent](#react-agent)
- [Tree-of-Thought (ToT)](#tree-of-thought-tot)
- [Role-Based Prompting](#role-based-prompting)
- [Meta-Prompting](#meta-prompting)
- [Constitutional AI](#constitutional-ai)
- [Prompt Chaining](#prompt-chaining)
- [Structured Extraction](#structured-extraction)
- [Mega-Prompt](#mega-prompt)
- [Évaluation de prompts](#évaluation-de-prompts)
- [Self-Consistency](#self-consistency)
- [Bonnes pratiques générales](#bonnes-pratiques-générales)
- [Erreurs courantes à éviter](#erreurs-courantes-à-éviter)
- [Conseils par niveau](#conseils-par-niveau)

---

## Chain-of-Thought (CoT)

Le prompting Chain-of-Thought demande à l'IA de montrer son raisonnement étape par étape avant d'arriver à une conclusion. Cela améliore considérablement la précision sur les tâches nécessitant un raisonnement approfondi.

### Variantes

| Variante | Fonctionnement | Quand l'utiliser |
|----------|---------------|-----------------|
| **Zero-Shot CoT** | Ajoutez « Let's think step by step » à la fin de votre prompt | Amélioration rapide du raisonnement, aucun exemple nécessaire |
| **Few-Shot CoT** | Fournissez des exemples avec un raisonnement étape par étape | Raisonnement complexe où le format compte |
| **Auto-CoT** | Laissez le modèle générer ses propres chaînes de raisonnement | Quand vous ne pouvez pas créer de bons exemples |
| **Self-Consistency (CoT-SC)** | Exécutez le CoT plusieurs fois, prenez le vote majoritaire | Décisions à fort enjeu nécessitant de la fiabilité |

### Exemple Zero-Shot CoT

```
Solve the following math problem. Let's think step by step.

A store has 45 apples. They sell 18 in the morning and receive 30 more
in the afternoon. How many apples do they have at the end of the day?
```

### Exemple Few-Shot CoT

```
Q: If a train travels at 60 km/h for 2.5 hours, how far does it go?
A: Let me work through this step by step.
   Step 1: Identify the formula — distance = speed × time
   Step 2: Plug in values — distance = 60 × 2.5
   Step 3: Calculate — distance = 150 km
   Answer: The train travels 150 km.

Q: A car drives at 80 km/h for 3.25 hours. How far does it travel?
A:
```

### Quand utiliser le CoT

✅ **À utiliser pour :**
- Problèmes de mathématiques, de logique ou de raisonnement en plusieurs étapes
- Analyses complexes nécessitant l'évaluation de preuves
- Débogage de code ou traçage du flux d'exécution
- Planification de tâches avec des dépendances
- Tout problème où montrer le travail est important

❌ **À éviter pour :**
- Recherches factuelles simples (« Quelle est la capitale de la France ? »)
- Écriture créative où le raisonnement brise le flux
- Tâches à haut volume où vous payez au token
- Tâches de classification avec des catégories évidentes

### Conseils

- **Soyez explicite :** « Show your reasoning for each step » fonctionne mieux que « think about it »
- **Numérotez vos étapes :** le modèle suit les étapes numérotées de manière plus fiable que le raisonnement libre
- **Ajoutez une vérification :** « After reaching your answer, verify it by working backwards »
- **Combinez avec un rôle :** « You are a math professor. Solve this step by step, explaining each step to a student »

---

## Few-Shot Patterns

Le prompting Few-Shot enseigne à l'IA en fournissant des exemples du format entrée-sortie souhaité. Le modèle apprend le pattern et l'applique aux nouvelles entrées.

### Fonctionnement

```
Convert the following product descriptions to JSON:

Input: "Red running shoes, size 10, $89.99"
Output: {"product": "running shoes", "color": "red", "size": "10", "price": 89.99}

Input: "Blue denim jacket, large, $124.50"
Output: {"product": "denim jacket", "color": "blue", "size": "large", "price": 124.50}

Input: "Black leather wallet, one size, $45.00"
Output:
```

### Combien d'exemples ?

| Nombre | Idéal pour | Compromis |
|:------:|-----------|-----------|
| 0 (zero-shot) | Tâches simples et bien définies | Coût en tokens le plus bas |
| 1–2 | Démonstration du format | Bon équilibre |
| 3–5 | Apprentissage de patterns, cas limites | Meilleure qualité pour la plupart des tâches |
| 6+ | Tâches complexes ou ambiguës | Coût en tokens élevé, rendements décroissants |

### Conseils

- **Format cohérent :** chaque exemple doit suivre exactement la même structure
- **Montrez les cas limites :** incluez au moins un exemple difficile
- **Variez les exemples :** ne rendez pas tous les exemples trop similaires — montrez l'éventail
- **L'ordre compte :** placez les exemples les plus représentatifs en premier
- **Délimitez clairement :** utilisez des séparateurs nets entre les exemples (`---`, `###` ou sauts de ligne)

---

## ReAct Agent

ReAct (Reasoning + Acting) combine le raisonnement Chain-of-Thought avec des actions utilisant des outils. Le modèle suit un cycle **Thought → Action → Observation** (Pensée → Action → Observation).

### Le pattern

```
You are a research assistant with access to these tools:
- search(query): Search the web for information
- calculator(expression): Evaluate a math expression
- lookup(term): Look up a definition

For each step, use this format:
Thought: [What I need to figure out next]
Action: [tool_name(arguments)]
Observation: [Result from the tool]
... (repeat until you have the answer)
Final Answer: [Your conclusion]

Question: What is the GDP per capita of the country with the
tallest building in the world?
```

### Quand l'utiliser

✅ **À utiliser pour :**
- Tâches nécessitant des outils externes (recherche, API, bases de données)
- Questions de recherche en plusieurs étapes
- Problèmes nécessitant des données en temps réel
- Construction d'agents IA avec accès à des outils

❌ **À éviter pour :**
- L'IA dispose de toutes les informations nécessaires dans le contexte
- Tâches simples en une seule étape
- Tâches où la latence des outils est inacceptable

---

## Tree-of-Thought (ToT)

Tree-of-Thought étend le CoT en explorant **plusieurs chemins de raisonnement** simultanément, en évaluant chaque branche et en revenant en arrière depuis les impasses.

### Le pattern

```
Consider the following problem: [PROBLEM]

Generate 3 different approaches to solving this:

Approach 1: [description]
  Step 1: ...
  Step 2: ...
  Evaluation: [How promising is this approach? Rate 1-10]

Approach 2: [description]
  Step 1: ...
  Step 2: ...
  Evaluation: [How promising is this approach? Rate 1-10]

Approach 3: [description]
  Step 1: ...
  Step 2: ...
  Evaluation: [How promising is this approach? Rate 1-10]

Now select the most promising approach and develop it fully.
If you hit a dead end, backtrack and try the next best approach.
```

### Quand l'utiliser

✅ **À utiliser pour :** planification stratégique, résolution créative de problèmes, décisions de conception complexes, problèmes d'optimisation

❌ **À éviter pour :** problèmes simples avec des réponses évidentes, tâches avec des exigences strictes de latence

---

## Role-Based Prompting

Attribuer une persona d'expert améliore considérablement la qualité des réponses. L'IA s'appuie sur les patterns de connaissances associés à ce rôle.

### Pattern de base

```
You are a senior data analyst with 15 years of experience in
financial services. You specialize in risk modeling and have
presented findings to C-level executives at Fortune 500 companies.

[Your task here]
```

### Avancé : Rôle + Contraintes

```
You are a senior DevOps engineer specializing in Kubernetes.

RULES:
- Always suggest the simplest solution first
- Include security implications for every recommendation
- If you're unsure, say so rather than guessing
- Use concrete examples with actual YAML/commands

AUDIENCE: Mid-level developers who know Docker but are new to K8s

TASK: [Your task here]
```

### Conseils

- **Soyez précis :** « Senior Python developer » > « programmer »
- **Ajoutez le niveau d'expérience :** « 10+ years » indique une expertise approfondie
- **Ajoutez le domaine :** « specializing in healthcare data » restreint le périmètre
- **Combinez avec d'autres techniques :** Rôle + CoT, Rôle + Few-Shot, Rôle + Guardrails

---

## Meta-Prompting

Utiliser des prompts pour générer de meilleurs prompts. L'IA devient votre ingénieur de prompts.

### Le pattern

```
You are an expert prompt engineer. Given the following task description,
create an optimized prompt that will produce the best possible output
from a large language model.

Task: {{task_description}}

Your optimized prompt should include:
1. A clear role definition
2. Specific instructions with constraints
3. Output format specification
4. Quality verification step
5. At least one example of expected output

Return the complete prompt, ready to use.
```

### Quand l'utiliser

- Quand vous peinez à obtenir de bons résultats d'un prompt
- Quand vous devez créer des prompts pour des utilisateurs non techniques
- Pour optimiser des prompts destinés à des systèmes de production
- Comme première étape avant un affinage manuel

---

## Constitutional AI

Un cycle d'autocritique et de révision où l'IA évalue et améliore sa propre réponse.

### Le pattern

```
Step 1: Generate an initial response to: [TASK]

Step 2: Critique your response using these principles:
- Is it accurate and factually correct?
- Is it helpful without being harmful?
- Does it avoid bias and stereotypes?
- Is it complete and addresses all parts of the question?

Step 3: Revise your response based on the critique.

Step 4: Present only the revised version as your final answer.
```

### Quand l'utiliser

- Modération de contenu et applications critiques en matière de sécurité
- Réduction des biais dans le contenu généré
- Amélioration de la précision factuelle
- Autocorrection de sorties complexes

---

## Prompt Chaining

Décomposer des tâches complexes en prompts séquentiels, où la sortie de l'un devient l'entrée du suivant.

### Le pattern

```
Chain 1: Research
  "List the 5 most important factors in {{topic}}"

Chain 2: Analysis (receives Chain 1 output)
  "For each factor listed below, provide a detailed analysis:
   {{chain_1_output}}"

Chain 3: Synthesis (receives Chain 2 output)
  "Based on the following analysis, write an executive summary
   with recommendations: {{chain_2_output}}"
```

### Avantages

| Avantage | Description |
|----------|-------------|
| **Meilleure qualité** | Chaque étape a une tâche ciblée et gérable |
| **Débogage plus facile** | Vous pouvez inspecter et corriger chaque étape indépendamment |
| **Plus de contrôle** | Vous pouvez ajouter une validation entre les étapes |
| **Efficacité en tokens** | Chaque prompt peut utiliser un modèle plus petit et moins cher |

### Conseils

- Gardez chaque chaîne concentrée sur une seule tâche
- Validez la sortie entre les chaînes
- Utilisez différents modèles pour différentes chaînes (économique pour les étapes simples, premium pour les complexes)
- Documentez le flux de la chaîne pour la maintenabilité

---

## Structured Extraction

Utilisation de templates pour extraire de manière fiable des données structurées à partir de texte non structuré.

### Le pattern

```
Extract the following information from the text below.
Return the result in this exact JSON format:

{
  "company_name": "string",
  "revenue": "number or null",
  "employees": "number or null",
  "founded_year": "number or null",
  "key_products": ["string"]
}

Rules:
- Use null for any field you can't find
- For revenue, use the most recent annual figure in USD
- For employees, use the most recent approximate count

Text:
{{input_text}}
```

### Conseils

- Spécifiez toujours le format de sortie exact (JSON, tableau, etc.)
- Définissez quoi faire quand des données manquent (`null`, « N/A », ignorer)
- Incluez des exemples de cas limites
- Utilisez des contraintes : « Extract ONLY from the provided text — do not add information »

---

## Mega-Prompt

Une invite système complète en plusieurs sections couvrant tous les aspects d'une tâche complexe en un seul prompt.

### Structure

```
# ROLE
You are [detailed role description]

# CONTEXT
[Background information and domain knowledge]

# TASK
[Primary task with clear objectives]

# RULES
1. [Hard constraint]
2. [Hard constraint]
3. [Quality standard]

# OUTPUT FORMAT
[Exact format specification]

# EXAMPLES
[1-3 examples of expected output]

# QUALITY CHECKS
Before responding, verify:
- [ ] All rules are followed
- [ ] Output matches the specified format
- [ ] Content is accurate and complete
```

### Quand l'utiliser

- Invites système de production devant gérer de nombreux scénarios
- Tâches complexes avec de nombreuses exigences
- Quand vous avez besoin d'une sortie cohérente sur de nombreuses requêtes
- Invites système pour des applications IA destinées au public

---

## Évaluation de prompts

Évaluation et notation systématiques de la qualité des prompts.

### Critères d'évaluation

| Critère | Poids | Que vérifier |
|---------|:-----:|-------------|
| **Clarté** | Élevé | La tâche est-elle sans ambiguïté ? |
| **Spécificité** | Élevé | Les exigences sont-elles suffisamment détaillées ? |
| **Structure** | Moyen | Y a-t-il des sections clairement définies ? |
| **Contraintes** | Moyen | Les limites sont-elles définies ? |
| **Exemples** | Moyen | Les sorties attendues sont-elles montrées ? |
| **Complétude** | Élevé | Tous les cas sont-ils couverts ? |
| **Efficacité** | Faible | Est-ce concis sans perdre en clarté ? |

Utilisez le [Linter de prompts](Outils-Linter-Optimizer-Recommender.md#prompt-linter) intégré pour automatiser la notation de qualité.

---

## Self-Consistency

Exécutez le même prompt plusieurs fois avec différents chemins de raisonnement et prenez la réponse majoritaire.

### Le pattern

```
Solve this problem 3 times using different approaches.
For each attempt, use a different reasoning strategy.

Problem: [PROBLEM]

Attempt 1 (logical deduction): ...
Attempt 2 (working backwards): ...
Attempt 3 (analogy-based reasoning): ...

Final answer: [Select the answer that appears most frequently,
or if all differ, select the one with the strongest reasoning]
```

### Quand l'utiliser

- Décisions à fort enjeu où la précision est critique
- Problèmes mathématiques avec plusieurs chemins de résolution
- Problèmes ambigus où la « bonne » approche n'est pas évidente
- Partout où vous avez besoin d'une calibration de confiance

---

## Bonnes pratiques générales

### Les fondamentaux

| Pratique | Pourquoi c'est important | Exemple |
|----------|-------------------------|---------|
| **Soyez précis** | Les prompts vagues donnent des réponses vagues | ❌ « Write something about dogs » → ✅ « Write a 500-word blog post about the health benefits of adopting senior dogs » |
| **Définissez le rôle** | Établit le contexte de connaissances | « You are a senior security engineer » |
| **Fixez des contraintes** | Empêche les comportements indésirables | « Never make up statistics. Cite sources. » |
| **Fournissez des exemples** | Montre le format attendu | Incluez 1 à 3 exemples entrée/sortie |
| **Spécifiez le format de sortie** | Assure la cohérence | « Respond in JSON with these fields: ... » |
| **Ajoutez une vérification** | Détecte les erreurs de l'IA | « Before responding, verify that your answer addresses all 3 requirements » |

### Template de structure de prompt

```
ROLE: [Who the AI should be]

CONTEXT: [Background information]

TASK: [What to do — be specific]

RULES:
- [Constraint 1]
- [Constraint 2]

OUTPUT FORMAT: [Exact format specification]

QUALITY CHECK: [Verification step]
```

---

## Erreurs courantes à éviter

| Erreur | Problème | Solution |
|--------|----------|----------|
| **Trop vague** | « Help me with my code » | Spécifiez le langage, l'erreur, le comportement attendu |
| **Pas de rôle** | Réponses génériques et superficielles | Ajoutez « You are a [specific expert] » |
| **Pas de format** | Structure de sortie incohérente | Spécifiez JSON, Markdown, tableau, etc. |
| **Trop poli** | « Please kindly help me if you could... » gaspille des tokens | Les instructions directes fonctionnent mieux |
| **Surcharge d'information** | 5000 mots de contexte pour une question d'une ligne | Mettez la question en premier, le contexte après |
| **Périmètre ambigu** | « Tell me about Python » | « Explain Python's GIL and how it affects multi-threading » |
| **Pas de contraintes** | L'IA invente des données, hallucine | « Only use information from the provided text » |
| **Pas d'exemples** | Le modèle devine le format | Ajoutez 1–2 exemples de la sortie attendue |
| **Supposer le contexte** | « Fix the bug from before » | Chaque prompt doit être autonome |
| **Ignorer les forces du modèle** | Utiliser le mauvais modèle pour la tâche | Voir le [Guide des modèles IA](Guide-Modeles-IA) |

---

## Conseils par niveau

### Débutant

1. Commencez par un rôle : « You are a helpful [expert] »
2. Énoncez votre tâche clairement en une phrase
3. Ajoutez « Respond in [format] » (Markdown, listes à puces, JSON)
4. Utilisez le [Linter de prompts](Outils-Linter-Optimizer-Recommender) pour vérifier vos prompts
5. Parcourez les templates de la bibliothèque pour l'inspiration

### Intermédiaire

1. Utilisez des sections structurées (ROLE, TASK, RULES, OUTPUT FORMAT)
2. Ajoutez 2–3 exemples Few-Shot pour les tâches complexes
3. Combinez les techniques : Rôle + CoT, Few-Shot + Guardrails
4. Utilisez la fonctionnalité Composer pour superposer invites système + frameworks
5. Testez les prompts sur plusieurs modèles pour la robustesse

### Avancé

1. Construisez des chaînes de prompts pour des flux de travail complexes en plusieurs étapes
2. Implémentez la Self-Consistency (plusieurs chemins de raisonnement)
3. Utilisez le Meta-Prompting pour générer et optimiser des prompts
4. Concevez des patterns Constitutional AI pour l'autocorrection
5. Construisez un routage multi-modèles avec classification par type de tâche
6. Créez des Mega-Prompts pour les invites système de production
7. Utilisez le Tree-of-Thought pour les décisions stratégiques complexes

---

**Navigation :** [← Prompt Workshop](Prompt-Workshop-FR) &nbsp;|&nbsp; [Guide des modèles IA →](Guide-Modeles-IA)
