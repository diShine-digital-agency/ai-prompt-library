# 🧠 AI Prompt Library — Wiki

> **82+ templates de prompt engineering de niveau expert** avec CLI, Prompt Workshop interactif dans le navigateur, et applications de bureau — conçus pour les développeurs, rédacteurs, marketeurs et praticiens de l'IA.

Bienvenue sur le wiki officiel de l'**AI Prompt Library** par [diShine Digital Agency](https://dishine.it). C'est votre point central pour tout apprendre sur l'outil — de l'installation aux techniques avancées de prompting.

---

## Qu'est-ce que l'AI Prompt Library ?

L'AI Prompt Library est une boîte à outils complète et sans dépendances pour le prompt engineering. Elle fournit :

- **82+ templates de prompts prêts pour la production** organisés en 8 catégories
- **Outil CLI** (`prompt-lib`) pour la découverte, la construction et l'optimisation de prompts depuis le terminal
- **Prompt Workshop** — une application monopage interactive dans le navigateur (`viewer.html`) fonctionnant hors ligne
- **Applications de bureau** pour macOS (Swift natif), Linux (GTK) et Windows (mode application Edge)
- **Outils qualité** — Linter (notation sur 14 règles), Optimiseur (réécriture contextuelle), Recommandeur (suggestions basées sur l'intention)
- **AI Playground** — envoyez des prompts directement à GPT, Claude ou Gemini depuis le navigateur
- **Générateur de prompts** — créez dynamiquement des prompts via 5 frameworks
- **Composer et Créer** — combinez invites système + frameworks + templates, ou construisez des prompts personnalisés avec des champs dynamiques

**Version :** 2.3.1 &nbsp;|&nbsp; **Licence :** MIT &nbsp;|&nbsp; **Dépendances :** Zéro (uniquement les modules natifs de Node.js 18+)

---

## Fonctionnalités en un coup d'œil

| Fonctionnalité | CLI | Prompt Workshop | Description |
|----------------|:---:|:---------------:|-------------|
| **Parcourir et rechercher** | ✅ | ✅ | Trouver des prompts par mot-clé, catégorie ou tag |
| **Afficher et utiliser** | ✅ | ✅ | Consulter les prompts et remplir les `{{champs}}` de manière interactive |
| **Copier dans le presse-papiers** | ✅ | ✅ | Copie en un clic des templates de prompts |
| **Composer** | ✅ | ✅ | Combiner invite système + framework + template |
| **Créer** | ✅ | ✅ | Construire des prompts personnalisés avec des champs dynamiques |
| **Générer** | ✅ | ✅ | Générer des prompts à partir de 5 frameworks |
| **Lint** | ✅ | ✅ | Évaluer la qualité d'un prompt (0–100, note A–F) |
| **Optimiser** | ✅ | ✅ | Réécrire les prompts selon les bonnes pratiques |
| **Recommander** | ✅ | ✅ | Suggestions intelligentes basées sur l'intention |
| **AI Playground** | — | ✅ | Envoyer des prompts à GPT/Claude/Gemini |
| **Ma bibliothèque** | ✅ | ✅ | Sauvegarder, modifier, exporter/importer des prompts |
| **Mode sombre** | — | ✅ | Basculer entre thème clair et sombre |

---

## Trois façons de l'utiliser

### 1. CLI (`prompt-lib`)
Un outil en ligne de commande pour rechercher, construire, composer, analyser et optimiser des prompts. Installation globale via npm ou exécution directe depuis le dépôt.

```bash
prompt-lib search "chain of thought"
prompt-lib use code-review
prompt-lib lint
```

### 2. Prompt Workshop (`viewer.html`)
Une application monopage HTML autonome avec 7 onglets — Parcourir, Composer, Créer, Générer, Outils, Playground et Ma bibliothèque. Fonctionne hors ligne, sans serveur, sans Node.js.

### 3. Applications de bureau
Applications natives pour macOS (Swift + WebKit), Linux (Python + GTK + WebKitGTK) et Windows (mode application Edge). Compilez depuis les sources avec `./desktop/build-all.sh`.

---

## Catégories de prompts

| Catégorie | Nombre | Description |
|-----------|:------:|-------------|
| `business` | 12 | Propositions, pitchs, mises à jour pour les parties prenantes, OKRs |
| `data` | 10 | SQL, tableaux de bord, ETL, évaluation ML, qualité des données |
| `development` | 13 | Revue de code, architecture, débogage, tests |
| `frameworks` | 12 | Chain-of-thought, ReAct, few-shot, meta-prompting |
| `image-generation` | 8 | Portraits, logos, scènes, conception de personnages |
| `marketing` | 11 | SEO, campagnes e-mail, rédaction publicitaire, voix de marque |
| `model-specific` | 6 | Bonnes pratiques Claude, GPT, Gemini, Llama, Mistral |
| `system-prompts` | 10 | Assistant de code, chercheur, rédacteur de contenu, tuteur |

---

## Pages du wiki

| Page | Description |
|------|-------------|
| **[Premiers pas](Premiers-Pas)** | Installation, configuration et premiers pas |
| **[Référence CLI](Reference-CLI)** | Documentation complète de l'interface en ligne de commande |
| **[Prompt Workshop](Prompt-Workshop-FR)** | Guide de l'outil interactif dans le navigateur |
| **[Techniques de prompting](Techniques-de-Prompting)** | Frameworks, patterns et bonnes pratiques |
| **[Guide des modèles IA](Guide-Modeles-IA)** | Comparaison des modèles, tarifs, sélection |
| **[Outils : Linter, Optimiseur, Recommandeur](Outils-Linter-Optimizer-Recommender)** | Analyse approfondie des outils qualité |
| **[API et Playground](API-et-Playground)** | AI Playground et utilisation programmatique |
| **[Architecture](Architecture-FR)** | Architecture technique et référence des modules |
| **[Applications de bureau](Applications-Desktop)** | Guide des applications de bureau |
| **[Contribuer](Contribuer)** | Comment contribuer : prompts, code et frameworks |

---

## Liens rapides

- 📦 **npm :** `npm install -g @dishine/prompt-library`
- 🏠 **Dépôt :** [github.com/diShine-digital-agency/ai-prompt-library](https://github.com/diShine-digital-agency/ai-prompt-library)
- 📖 **Guide utilisateur :** [GUIDE.md](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/GUIDE.md)
- 🔧 **Documentation technique :** [TECHNICAL.md](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/TECHNICAL.md)
- 📋 **Référence des fonctions :** [FUNCTIONS.md](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/FUNCTIONS.md)
- 📝 **Journal des modifications :** [CHANGELOG.md](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/CHANGELOG.md)

---

<p align="center">
Conçu avec ❤️ par <a href="https://dishine.it">diShine Digital Agency</a> — v2.3.1
</p>

---

**Navigation :** [Premiers pas →](Premiers-Pas)
