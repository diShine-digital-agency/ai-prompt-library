# Premiers pas

> Installation, configuration et premiers pas avec l'AI Prompt Library.

---

## Configuration requise

| Pré-requis | Détails |
|------------|---------|
| **Node.js** | 18 ou supérieur (pour le CLI et la compilation des applications de bureau) |
| **Dépendances npm** | **Aucune** — zéro package externe |
| **Navigateur** | Tout navigateur moderne (pour le Prompt Workshop) |
| **Espace disque** | ~2 Mo (la bibliothèque complète) |

> **Vous n'avez pas Node.js ?** Téléchargez-le depuis [nodejs.org](https://nodejs.org/) — prenez la version LTS. Ou ignorez complètement Node et utilisez l'[option navigateur uniquement](#option-4--navigateur-uniquement-sans-nodejs).

---

## Options d'installation

### Option 1 : Cloner et exécuter (aucune installation requise)

Le moyen le plus rapide de commencer. Clonez le dépôt et exécutez le CLI directement :

```bash
git clone https://github.com/diShine-digital-agency/ai-prompt-library.git
cd ai-prompt-library
node bin/prompt-lib.js --help
```

C'est tout. Pas de `npm install`, pas de dépendances, rien à configurer.

### Option 2 : Installation globale via npm

Installez une fois et utilisez la commande `prompt-lib` depuis n'importe où :

```bash
npm install -g @dishine/prompt-library
prompt-lib --help
```

Cela enregistre la commande `prompt-lib` au niveau du système.

### Option 3 : Lier pour le développement

Si vous avez cloné le dépôt et souhaitez que la commande `prompt-lib` soit disponible globalement pendant que vous travaillez sur le code :

```bash
cd ai-prompt-library
npm link
prompt-lib --help
```

Les modifications des fichiers sources prennent effet immédiatement — aucune recompilation nécessaire.

### Option 4 : Navigateur uniquement (sans Node.js)

Ouvrez simplement `viewer.html` dans n'importe quel navigateur. C'est le **Prompt Workshop** — un fichier autonome avec tout intégré :

- Aucun serveur requis
- Aucune connexion internet requise
- Aucun Node.js requis
- Les 82+ prompts sont intégrés dans le fichier

Double-cliquez sur `viewer.html` ou glissez-le dans votre navigateur.

### Option 5 : Application de bureau (compilation depuis les sources)

Compilez des applications de bureau natives pour macOS, Linux ou Windows :

```bash
git clone https://github.com/diShine-digital-agency/ai-prompt-library.git
cd ai-prompt-library
./desktop/build-all.sh
```

Les fichiers de sortie sont dans `dist/`. Consultez la page [Applications de bureau](Applications-Desktop) pour les guides spécifiques à chaque plateforme.

| Plateforme | Script de compilation | Pré-requis |
|------------|----------------------|------------|
| macOS | `./desktop/build-macos.sh` | Outils en ligne de commande Xcode pour l'application native |
| Linux | `./desktop/build-linux.sh` | Python 3, GTK, WebKitGTK |
| Windows | `./desktop/build-all.sh` | Git Bash ou WSL |
| Toutes | `./desktop/build-all.sh` | Node.js 18+, Bash |

---

## Premières commandes à essayer

Une fois installé, essayez ces commandes pour explorer la bibliothèque :

```bash
# Lister les 82+ prompts par catégorie
prompt-lib list

# Rechercher des prompts par mot-clé
prompt-lib search "chain of thought"

# Afficher les détails complets d'un prompt
prompt-lib show chain-of-thought

# Voir toutes les catégories avec leurs compteurs
prompt-lib categories

# Obtenir les statistiques de la bibliothèque
prompt-lib stats

# Afficher un prompt aléatoire pour l'inspiration
prompt-lib random
```

---

## Ouvrir le Prompt Workshop

Le Prompt Workshop est un outil visuel dans le navigateur avec 7 onglets. Ouvrez-le depuis le CLI :

```bash
prompt-lib viewer
```

Ou ouvrez `viewer.html` directement dans n'importe quel navigateur — aucun serveur nécessaire.

Le Workshop offre tout ce que le CLI propose, plus :
- Recherche et filtrage visuels
- AI Playground (envoyer des prompts à GPT/Claude/Gemini)
- Mode sombre/clair
- Ma bibliothèque (sauvegarder, modifier, exporter/importer des prompts)
- Raccourcis clavier

---

## Tutoriel rapide : trouver et utiliser un prompt

### Étape 1 : Trouver un prompt

```bash
prompt-lib search "code review"
```

Le résultat affiche les prompts correspondants classés par pertinence :

```
Search results for "code review" (3 found)

  code-review (score: 200)
    Code Review Checklist [intermediate] in development
    tags: code-review, quality, checklist

  code-refactoring-review (score: 110)
    Code Refactoring Review [intermediate] in development
    tags: refactoring, review, patterns
```

### Étape 2 : Voir le prompt complet

```bash
prompt-lib show code-review
```

Cela affiche le contenu complet du prompt, y compris le template, les conseils et les exemples.

### Étape 3 : Construire le prompt de manière interactive

```bash
prompt-lib use code-review
```

Le CLI détecte les `{{champs}}` dans le template et vous demande de remplir chacun d'eux :

```
Building prompt: Code Review Checklist
3 field(s) to fill in

  programming language: Python
  code snippet: def calculate_total(items): ...
  focus area: security and error handling
```

Le prompt rempli est automatiquement copié dans votre presse-papiers — prêt à être collé dans n'importe quel modèle d'IA.

### Étape 4 : Composer un prompt multicouche

```bash
prompt-lib compose
```

Cela vous permet de combiner :
1. **Invite système** (persona et règles) — par ex. « Coding Assistant »
2. **Framework** (technique de raisonnement) — par ex. « Chain-of-Thought »
3. **Template de tâche** (spécifique au domaine) — par ex. « Code Review »

Le résultat est un prompt multicouche puissant qui surpasse n'importe quel template individuel.

---

## Et ensuite ?

| Vous voulez... | Consultez... |
|---------------|-------------|
| Apprendre toutes les commandes CLI | [Référence CLI](Reference-CLI) |
| Explorer l'outil navigateur | [Prompt Workshop](Prompt-Workshop-FR) |
| Maîtriser les techniques de prompting | [Techniques de prompting](Techniques-de-Prompting) |
| Comparer les modèles IA | [Guide des modèles IA](Guide-Modeles-IA) |
| Utiliser les outils qualité | [Outils : Linter, Optimiseur, Recommandeur](Outils-Linter-Optimizer-Recommender) |
| Compiler les applications de bureau | [Applications de bureau](Applications-Desktop) |
| Contribuer | [Contribuer](Contribuer) |

---

**Navigation :** [← Accueil](Accueil) &nbsp;|&nbsp; [Référence CLI →](Reference-CLI)
