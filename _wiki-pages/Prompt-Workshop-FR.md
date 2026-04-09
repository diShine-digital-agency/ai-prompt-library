# Prompt Workshop

> Guide complet de l'atelier de prompts interactif dans le navigateur (`viewer.html`).

---

## Vue d'ensemble

Le **Prompt Workshop** est une application HTML monopage autonome qui fournit une interface visuelle à l'ensemble de l'AI Prompt Library. Il fonctionne :

- **Hors ligne** — aucune connexion internet nécessaire
- **Sans serveur** — ouvrez simplement le fichier HTML directement
- **Sans Node.js** — HTML, CSS et JavaScript vanilla purs
- **Sur tout appareil** — navigateur de bureau, tablette ou mobile

### Comment l'ouvrir

```bash
# Option 1 : Depuis le CLI (injecte les dernières données de prompts)
prompt-lib viewer

# Option 2 : Ouvrir directement dans n'importe quel navigateur
open viewer.html          # macOS
xdg-open viewer.html      # Linux
start viewer.html         # Windows
```

Le Workshop offre tout ce que le CLI propose, plus un AI Playground visuel, un mode sombre/clair, des raccourcis clavier, la gestion de Ma bibliothèque, et plus encore.

---

## Les 7 onglets

### Onglet 1 : Parcourir

L'onglet par défaut. Recherchez, filtrez et explorez les 82+ prompts.

**Fonctionnalités :**
- **Barre de recherche** — recherche en temps réel dans les titres, tags, catégories et contenus (ou appuyez sur `Ctrl+K`)
- **Filtre par catégorie** — filtrer par l'une des 8 catégories
- **Filtre par difficulté** — filtrer par débutant, intermédiaire ou avancé
- **Cartes de prompts** — chaque carte affiche le titre, la catégorie, la difficulté, les tags et les modèles compatibles
- **Remplissage rapide** — cliquez sur un prompt pour l'ouvrir, puis remplissez les `{{champs}}` de manière interactive
- **Barre de progression** — affiche la progression du remplissage des champs
- **Aperçu en direct** — voyez le prompt rempli se mettre à jour en temps réel
- **Bouton copier** — copie en un clic du prompt rempli

**Fonctionnement du remplissage rapide :**
1. Cliquez sur une carte de prompt pour la sélectionner
2. La section template est extraite et les `{{champs}}` sont détectés
3. Des champs de saisie apparaissent pour chaque placeholder
4. Au fur et à mesure de votre saisie, l'aperçu se met à jour en temps réel
5. Une barre de progression indique combien de champs sont remplis
6. Cliquez sur « Copy » pour copier le résultat, ou sauvegardez-le dans Ma bibliothèque

---

### Onglet 2 : Composer

Superposez plusieurs prompts en un seul prompt composite puissant.

**Flux de travail :**
1. **Invite système** — sélectionnez une persona (par ex. Coding Assistant, Research Assistant, Data Analyst). Définit le rôle et les règles de comportement de l'IA.
2. **Framework** — sélectionnez une technique de raisonnement (par ex. Chain-of-Thought, Few-Shot Patterns, Tree-of-Thought). Ajoute une structure de réflexion.
3. **Template de tâche** — sélectionnez un template spécifique au domaine (par ex. Code Review, SQL Query Builder, Landing Page Copy). Définit la tâche à accomplir.
4. **Remplir les champs** — les `{{champs}}` des trois couches sont détectés et présentés pour le remplissage.
5. **Aperçu et copie** — visualisez le résultat composé et copiez-le en un clic.
6. **Sauvegarder** — sauvegardez optionnellement la composition dans Ma bibliothèque.

Le prompt composé suit cette structure :
```
# SYSTEM PROMPT
[Contenu de l'invite système sélectionnée]

# REASONING FRAMEWORK
[Contenu du framework sélectionné]

# TASK TEMPLATE
[Contenu du template de tâche sélectionné]
```

---

### Onglet 3 : Créer

Construisez des invites système personnalisées avec des champs dynamiques de A à Z.

**Fonctionnalités :**
- **Modèles de Départ (v2.4.0)** — 6 squelettes pré-construits (Assistant Expert, Rédacteur, Générateur de Code, Analyste de Données, Stratégiste Marketing, Prompt Image) — cliquez pour pré-remplir, puis personnalisez
- **Constructeur de champs** — définissez des champs dynamiques qui deviennent des placeholders `{{nom_du_champ}}`
- **Métadonnées des champs** — chaque champ reçoit un nom et une description
- **Éditeur de prompt** — rédigez le corps du prompt en utilisant vos champs définis
- **Aperçu en direct** — visualisez le prompt final avec les placeholders mis en évidence
- **Métadonnées** — définissez le titre, la catégorie, les tags, la difficulté et les modèles compatibles
- **Sauvegarder** — les prompts personnalisés sont sauvegardés dans Ma bibliothèque et apparaissent aux côtés des prompts intégrés

**Exemple :**
```
Title: Technical Blog Writer
Category: custom
Fields:
  - topic: The subject of the blog post
  - audience: Target audience (beginner/expert)
  - word_count: Target word count

Template:
Write a {{word_count}}-word technical blog post about {{topic}}
for {{audience}} audience...
```

---

### Onglet 4 : Générer

Créez des prompts dynamiquement en utilisant 5 frameworks intégrés. Chaque framework pose des questions guidées et produit un prompt prêt pour la production.

**Frameworks disponibles :**

| Framework | Description | Questions clés |
|-----------|-------------|----------------|
| **Expert Role-Based** | Persona d'expert avec règles et contraintes | Rôle, domaine, tâche, audience, ton, format de sortie |
| **Chain-of-Thought** | Raisonnement étape par étape imposé | Tâche, domaine, étapes de raisonnement, sortie, inclure des exemples |
| **Structured Output** | Templates de sortie cohérents et formatés | Tâche, description de l'entrée, champs de sortie, format |
| **Task Decomposition** | Décomposition de tâches complexes en sous-tâches | Tâche, contexte, livrables, critères de qualité |
| **Guardrails & Safety** | Règles de sécurité et contraintes de sortie | Rôle, tâche, sujets autorisés, sujets interdits, escalade |

**Flux de travail :**
1. Sélectionnez un framework
2. Répondez aux questions guidées (les champs obligatoires sont marqués)
3. Cliquez sur « Generate » pour produire le prompt
4. Prévisualisez le résultat
5. Copiez ou sauvegardez dans Ma bibliothèque

---

### Onglet 5 : Outils

Trois outils qualité dans un seul onglet — basculez entre eux via des sous-onglets.

#### Linter

Analyse votre prompt selon 14 règles de qualité. Produit un score (0–100), une note (A–F), les règles réussies/échouées et des suggestions classées par priorité.

- Collez n'importe quel prompt dans la zone de texte
- Cliquez sur « Lint » pour analyser
- Les résultats affichent les ✅ règles réussies et les 💡 suggestions d'amélioration
- Les règles sont triées par impact (les échecs les plus lourds en premier)

**Détection du Type de Prompt (v2.4.0) :** Le linter détecte automatiquement le type de prompt (🎨 Image, 💻 Code, 🤖 Système, 📝 Général) et ajuste les poids des règles. Les prompts image ignorent les règles non pertinentes comme audience/ton ; les prompts code pèsent davantage les contraintes.

Consultez [Outils : Linter, Optimiseur, Recommandeur](Outils-Linter-Optimizer-Recommender) pour la liste complète des règles.

#### Optimiseur

Réécrit votre prompt grâce à une optimisation contextuelle. Deux modes :

| Mode | Fonctionnement | Pré-requis |
|------|---------------|------------|
| **Instantané** | Optimisation hors ligne par règles. Détecte le domaine, supprime les remplissages, renforce les verbes, ajoute de la structure. | Aucun |
| **Assisté par IA** | Envoie le prompt à GPT/Claude/Gemini pour une réécriture professionnelle. | Clé API (configurée dans ⚙ Paramètres) |

Affiche les scores avant/après, toutes les modifications et le domaine détecté.

**Vue Différences (v2.4.0) :** Basculez entre « Optimisé » (résultat propre) et « Vue Diff » (comparaison colorée avant/après : vert = ajouté, rouge barré = supprimé).

#### Recommandeur

Décrivez votre besoin en langage naturel, et le Recommandeur suggère les meilleurs prompts de la bibliothèque, y compris une combinaison optimale invite système + framework + template.

- Saisissez une description (par ex. « I need to write marketing emails »)
- Cliquez sur « Recommend »
- Consultez les 8 meilleurs prompts classés par pertinence
- Obtenez une combinaison suggérée (invite système + framework + template)

---

### Onglet 6 : Playground

Envoyez des prompts directement aux modèles d'IA et obtenez des réponses — le tout dans le navigateur.

**Fournisseurs pris en charge :**

| Fournisseur | Modèle par défaut | En-tête |
|-------------|------------------|---------|
| **OpenAI** | `gpt-4o-mini` | `Authorization: Bearer` |
| **Anthropic** | `claude-sonnet-4-20250514` | `x-api-key` |
| **Google** | `gemini-2.0-flash` | Clé API dans l'URL |

**Fonctionnalités :**
- **Sélecteur de fournisseur** — basculez entre OpenAI, Anthropic et Google
- **Champ d'invite système** — invite système optionnelle pour le contexte
- **Saisie du prompt** — rédigez ou collez votre prompt
- **Bouton envoyer** — envoie le prompt et affiche la réponse
- **Suivi des tokens** — affiche l'utilisation des tokens en entrée/sortie par requête
- **Copie en un clic** — copiez la réponse de l'IA
- **⚖ Comparaison Multi-Modèle (v2.4.0)** — configurez 2+ clés API, cliquez « Comparer » pour envoyer le même prompt à tous les fournisseurs simultanément. Les résultats s'affichent côte à côte avec temps, tokens et boutons de copie.
- **Affichage de la réponse** — réponse IA formatée avec rendu Markdown

Les clés API sont stockées dans `localStorage` — elles ne quittent jamais votre navigateur.

---

### Onglet 7 : Ma bibliothèque

Gérez tous vos prompts sauvegardés, compositions et prompts personnalisés.

**Fonctionnalités :**
- **Recherche, Filtre et Tri (v2.4.0)** — recherchez par titre/contenu, filtrez par type (Favoris/Remplis/Composés/Personnalisés), triez (Plus récents/Plus anciens/A→Z/Z→A)
- **Voir les éléments sauvegardés** — consultez tous les prompts sauvegardés avec titres, dates et types
- **Modifier** — modifiez le contenu des prompts sauvegardés en ligne
- **Copier** — copiez n'importe quel prompt sauvegardé dans le presse-papiers
- **Supprimer** — supprimez des éléments individuels
- **Favoris** — marquez des prompts comme favoris pour un accès rapide
- **Exporter** — exportez toutes les données sauvegardées au format JSON
- **Importer** — importez des prompts depuis un fichier JSON
- **Bouton flottant 📚** — accès rapide à Ma bibliothèque depuis n'importe quel onglet

**Types d'éléments dans Ma bibliothèque :**
- Templates remplis (depuis le remplissage rapide de l'onglet Parcourir)
- Prompts composés (depuis l'onglet Composer)
- Prompts personnalisés (depuis l'onglet Créer)
- Prompts générés (depuis l'onglet Générer)

Les éléments sauvegardés depuis la base de données sont marqués avec `source: 'database'` et peuvent être modifiés sans affecter le prompt original.

---

## Raccourcis clavier

| Raccourci | Action |
|-----------|--------|
| `1` – `7` | Basculer vers les onglets 1–7 (Parcourir, Composer, Créer, Générer, Outils, Playground, Ma bibliothèque) |
| `Ctrl+K` | Mettre le focus sur la barre de recherche |
| `H` | Afficher/masquer l'aide contextuelle |
| `D` | Basculer entre mode sombre et clair |
| `Esc` | Effacer la recherche / fermer la superposition |

---

## Mode débutant

Cliquez sur le bouton **?** pour activer l'aide contextuelle. Cela fournit :
- Des infobulles expliquant chaque section
- Des parcours guidés pour les nouveaux utilisateurs
- De la documentation intégrée pour les fonctionnalités

---

## Paramètres API

Cliquez sur le bouton **⚙** (engrenage) pour configurer les clés API du Playground et de l'optimiseur assisté par IA.

**Champs de configuration :**
- **Fournisseur** — OpenAI, Anthropic ou Google
- **Clé API OpenAI** — votre clé API OpenAI
- **Clé API Anthropic** — votre clé API Anthropic
- **Clé API Google** — votre clé API Google AI
- **Modèle** — remplacer le modèle par défaut de chaque fournisseur

Tous les paramètres sont stockés dans `localStorage` sous la clé `api_settings`. Les clés ne quittent jamais votre navigateur.

---

## Barre latérale redimensionnable

La barre latérale de la liste des prompts peut être redimensionnée en faisant glisser son bord :
- **Largeur minimale :** 260px
- **Largeur maximale :** 600px
- La largeur est mémorisée dans `localStorage` (clé `pl_sidebar_width`)

---

## Mode sombre/clair

Basculez avec la touche `D` ou le bouton de thème. La préférence est sauvegardée dans `localStorage` (clé `pl_dark`) et persiste entre les sessions.

---

## Persistance des données (localStorage)

Le Prompt Workshop stocke toutes les données dans le `localStorage` de votre navigateur :

| Clé | Type | Description |
|-----|------|-------------|
| `pl_dark` | `boolean` | Préférence de mode sombre |
| `pl_saved` | `array` | Tous les prompts sauvegardés, templates remplis, prompts composés, prompts personnalisés |
| `pl_sidebar_width` | `number` | Largeur de la barre latérale en pixels (260–600) |
| `api_settings` | `object` | Clés API et préférences de modèles pour le Playground et l'optimiseur IA |

> **⚠️ Important :** Effacer les données/cookies de votre navigateur supprimera les prompts sauvegardés. Utilisez **Ma bibliothèque → Exporter tout en JSON** pour sauvegarder vos données.

---

## Utilisation hors ligne

Le Prompt Workshop fonctionne entièrement hors ligne. Les 82+ prompts sont intégrés directement dans le fichier HTML au format JSON. Aucune ressource externe n'est chargée.

Les seules fonctionnalités nécessitant internet sont :
- **AI Playground** — envoie des appels API à OpenAI/Anthropic/Google
- **Optimiseur assisté par IA** — envoie des appels API pour la réécriture

Tout le reste fonctionne sans aucune connexion réseau.

---

**Navigation :** [← Référence CLI](Reference-CLI) &nbsp;|&nbsp; [Techniques de prompting →](Techniques-de-Prompting)
