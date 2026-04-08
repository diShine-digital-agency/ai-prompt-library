# Guide des modèles IA

> Comparaison complète des modèles IA couverts dans la Prompt Library — tarifs, capacités, latence, limites de débit et guide de sélection.

**⚠️ Les tarifs et la disponibilité des modèles changent fréquemment.** Ce guide reflète les informations d'avril 2026. Vérifiez toujours les tarifs actuels sur la page de tarification de chaque fournisseur avant toute projection de coûts.

---

## Table des matières

- [Claude (Anthropic)](#claude-anthropic)
- [GPT (OpenAI)](#gpt-openai)
- [Gemini (Google)](#gemini-google)
- [Llama (Meta)](#llama-meta)
- [Mistral](#mistral)
- [Tableau comparatif des tarifs](#tableau-comparatif-des-tarifs)
- [Comparaison par type de tâche](#comparaison-par-type-de-tâche)
- [Comparaison de latence](#comparaison-de-latence)
- [Limites de débit](#limites-de-débit)
- [Arbre de décision : quel modèle utiliser](#arbre-de-décision--quel-modèle-utiliser)
- [Stratégies d'optimisation des coûts](#stratégies-doptimisation-des-coûts)
- [Modèles retirés](#modèles-retirés)

---

## Claude (Anthropic)

Les modèles Claude excellent dans le suivi d'instructions, l'analyse de longs contextes, l'écriture créative et le code. Ils répondent particulièrement bien aux prompts structurés utilisant des balises XML.

### Modèles actuels

| Modèle | Contexte | Prix entrée | Prix sortie | Idéal pour |
|--------|:--------:|:-----------:|:-----------:|-----------|
| **Opus 4.6** | 1M tokens | $5.00/M | $25.00/M | Raisonnement approfondi, multi-agent, analyse de contexte massif |
| **Sonnet 4.6** | 200K tokens | $3.00/M | $15.00/M | Cheval de bataille équilibré — code, conception, travail intellectuel |
| **Haiku 4.5** | 200K tokens | $1.00/M | $5.00/M | Réponse rapide, qualité proche de la frontière, haut volume |

### Techniques spécifiques à Claude

**Balises XML** — Claude traite les balises XML comme des conteneurs sémantiques. Patterns à forte valeur ajoutée :

```xml
<instructions>Primary task definition</instructions>
<context>Background information</context>
<constraints>Hard rules that override other instructions</constraints>
<examples>Input/output examples</examples>
```

**Extended Thinking** — Disponible sur Opus 4.6, permet au modèle de « réfléchir » en profondeur sur des problèmes complexes avant de répondre. Active un raisonnement plus profond au prix d'une latence et d'un nombre de tokens plus élevés.

**Technique Prefill** — Démarrez la réponse de Claude pour orienter le format et le ton :

```json
{
  "messages": [
    {"role": "user", "content": "Analyze this data..."},
    {"role": "assistant", "content": "{\"analysis\":"}
  ]
}
```

### Quel Claude choisir

- **Opus 4.6** — Quand vous avez besoin du meilleur raisonnement possible, du traitement de documents de plus de 200K tokens, ou de workflows multi-agents
- **Sonnet 4.6** — Le cheval de bataille — à utiliser pour 90 % des tâches (code, analyse, rédaction, utilisation d'outils)
- **Haiku 4.5** — Classification à haut volume, routage, extractions rapides, ou quand la latence/le coût prime

---

## GPT (OpenAI)

Les modèles GPT offrent de solides performances généralistes, des sorties structurées et l'appel de fonctions.

### Modèles actuels

| Modèle | Notes |
|--------|-------|
| **GPT-5.4** | GPT le plus capable, mode « Thinking » disponible |
| **GPT-5.4 Pro** | Niveau de qualité maximum, tarification premium |
| **GPT-5.3 Instant** | ChatGPT par défaut — cheval de bataille rapide au quotidien |
| **GPT-5.3-Codex** | Modèle de code agentique |
| **GPT-5.2-Codex** | Modèle de code de génération précédente |

### Techniques spécifiques à GPT

**Mode JSON** — Forcer la sortie en JSON valide :

```json
{
  "response_format": { "type": "json_object" }
}
```

**Structured Outputs** — Définir un schéma JSON exact que le modèle doit suivre :

```json
{
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "analysis",
      "schema": {
        "type": "object",
        "properties": {
          "summary": { "type": "string" },
          "score": { "type": "number" }
        },
        "required": ["summary", "score"]
      }
    }
  }
}
```

**Function Calling** — Définir des outils que le modèle peut invoquer, permettant un comportement de type agent avec une utilisation structurée des outils.

---

## Gemini (Google)

Les modèles Gemini offrent des capacités multimodales natives, l'ancrage via Google Search et l'exécution de code.

### Modèles actuels

| Modèle | Notes |
|--------|-------|
| **Gemini 3 Pro** | Raisonnement de pointe, multimodal, agentique |
| **Gemini 3 Flash** | Nouveau modèle par défaut — rapide, performant |
| **Gemini 2.5 Pro** | $1.25/$10.00 par M tokens, contexte 1M+ — **déprécié juin 2026** |
| **Gemini 2.5 Flash** | $0.30/$2.50 par M tokens, contexte 1M — **déprécié juin 2026** |

### Techniques spécifiques à Gemini

**Entrée multimodale** — Prise en charge native des images, vidéos et audio dans les prompts. Pas besoin de décrire le contenu visuel en texte.

**Ancrage Google Search** — Ancrer les réponses dans les résultats de recherche web en temps réel pour des informations à jour.

**Exécution de code** — Le modèle peut exécuter du code dans le cadre de sa réponse, utile pour l'analyse de données et les tâches de calcul.

---

## Llama (Meta)

Modèles à poids ouverts que vous pouvez auto-héberger. Aucun coût d'API — vous ne payez que le calcul.

### Modèles actuels

| Modèle | Paramètres | Contexte | Notes |
|--------|:----------:|:--------:|-------|
| **Llama 4 Scout** | MoE | 10M tokens | Compatible avec un seul H100, fenêtre de contexte de 10M |
| **Llama 4 Maverick** | 400B total (MoE) | Grand | Surpasse GPT-4o sur les benchmarks, poids ouverts |
| **Llama 4 Behemoth** | 2T (MoE) | Grand | Aperçu uniquement, modèle enseignant |
| **Llama 3.3** | 70B (dense) | 128K | Idéal pour le fine-tuning, écosystème mature |
| **Llama 3.2** | 1B–3B | Variable | Déploiement edge/mobile |

### Avantages clés

- **Poids ouverts** — téléchargez et exécutez sur votre propre infrastructure
- **Aucun coût d'API** — uniquement les coûts de calcul (location ou possession de GPU)
- **Fine-tuning** — personnalisez pour votre domaine spécifique
- **Architecture MoE** (Llama 4) — nombre élevé de paramètres avec inférence efficace
- **Confidentialité** — les données ne quittent jamais votre infrastructure

### Quand choisir Llama

- Les données doivent rester sur votre infrastructure (réglementaire, confidentialité)
- Inférence à haut volume où les coûts d'API seraient prohibitifs
- Fine-tuning pour des domaines spécialisés
- Déploiement edge/mobile (Llama 3.2)
- Recherche et expérimentation

---

## Mistral

Laboratoire d'IA européen proposant une gamme de modèles du plus petit au plus performant, avec d'excellents ratios prix-performance.

### Modèles actuels

| Modèle | Paramètres | Notes |
|--------|:----------:|-------|
| **Mistral Large 3** | MoE 41B/675B | Score 9.4/10 global, qualité de pointe |
| **Mistral Medium 3** | — | $0.40/$2.00 par M — **meilleur rapport qualité-prix de sa catégorie** |
| **Codestral** | — | 86.6 % HumanEval, 80+ langages, contexte 256K |
| **Devstral 2** | — | Modèle de code agentique |
| **Magistral** | — | Modèle axé raisonnement |
| **Pixtral** | — | Modèle avec capacités visuelles |
| **Ministral 3** | — | Minuscule, rapide, déploiement edge |

### Avantages clés

- **Meilleur rapport qualité-prix :** Mistral Medium 3 à $0.40/M en entrée offre une qualité de classe GPT-4 à 1/5 du coût
- **Excellence multilingue :** performant dans les langues européennes et mondiales
- **Architecture MoE :** inférence efficace avec un nombre élevé de paramètres
- **Spécialisation code :** Codestral et Devstral pour les flux de développement
- **Souveraineté des données UE :** options d'hébergement européen

---

## Tableau comparatif des tarifs

Prix par million de tokens (avril 2026) :

| Modèle | Entrée | Sortie | Contexte | Idéal pour |
|--------|:------:|:------:|:--------:|-----------|
| Claude Opus 4.6 | $5.00 | $25.00 | 1M | Raisonnement approfondi, multi-agent |
| Claude Sonnet 4.6 | $3.00 | $15.00 | 200K | Cheval de bataille équilibré |
| Claude Haiku 4.5 | $1.00 | $5.00 | 200K | Haut volume, rapide |
| GPT-5.4 | variable | variable | Grand | GPT le plus capable |
| GPT-5.3 Instant | moyen | moyen | Grand | Tâches quotidiennes |
| Gemini 2.5 Pro | $1.25 | $10.00 | 1M+ | Long contexte (déprécié juin 2026) |
| Gemini 2.5 Flash | $0.30 | $2.50 | 1M | Économique (déprécié juin 2026) |
| Mistral Medium 3 | $0.40 | $2.00 | Grand | Meilleur rapport qualité-prix |
| Llama 4 Maverick | Gratuit* | Gratuit* | Grand | Auto-hébergé |
| Llama 4 Scout | Gratuit* | Gratuit* | 10M | Contexte extrême |

*\*Les modèles Llama sont à poids ouverts — vous ne payez que le calcul (hébergement/location GPU).*

**Remises API par lots :**
- OpenAI Batch API : 50 % de réduction (délai 24h)
- Anthropic Batches API : 50 % de réduction (délai 24h)
- Google Batch API : variable selon le modèle

---

## Comparaison par type de tâche

Vue praticien des performances relatives par catégorie de tâche :

| Tâche | Tier 1 (Meilleur) | Tier 2 | Tier 3 |
|-------|:-----------------:|:------:|:------:|
| **Raisonnement complexe** | Claude Opus 4.6, GPT-5.4 Pro | Gemini 3 Pro, Mistral Large 3 | Llama 4 Maverick, Magistral |
| **Génération de code** | Claude Sonnet 4.6, GPT-5.3-Codex | Codestral, Devstral 2 | Gemini 3 Flash, Llama 4 Maverick |
| **Suivi d'instructions** | Claude Sonnet/Opus 4.6 | GPT-5.4, Gemini 3 Pro | Mistral Large 3 |
| **Écriture créative** | Claude Opus 4.6, GPT-5.4 | Gemini 3 Pro | Mistral Large 3 |
| **Extraction de données** | GPT-5.4 (structured outputs) | Claude Sonnet 4.6 | Gemini 3 Flash, Mistral Medium 3 |
| **Analyse de longs documents** | Claude Opus 4.6 (1M), Llama 4 Scout (10M) | Gemini 3 Pro | GPT-5.4 |
| **Multilingue** | Gemini 3 Pro, Mistral Large 3 | GPT-5.4, Claude 4.6 | Llama 4 |
| **Vision (images)** | Gemini 3 Pro, GPT-5.4 | Claude Sonnet 4.6, Pixtral | Llama 4 Maverick |
| **Compréhension vidéo** | Gemini 3 Pro (natif) | GPT-5.4 | Llama 4 Maverick |
| **Code agentique** | GPT-5.3-Codex, Devstral 2 | Claude Sonnet 4.6 | Codestral |
| **Classification (volume)** | Gemini 3 Flash, Mistral Medium 3 | Claude Haiku 4.5 | Ministral 3, Llama 3.2 |
| **Chain-of-thought** | GPT-5.4 Thinking, Magistral | Claude Opus 4.6 (extended thinking) | Gemini 3 Pro |
| **Sécurité/refus** | Claude (le plus prudent) | GPT-5.4 | Gemini, Mistral |

---

## Comparaison de latence

Plages approximatives pour des requêtes typiques (varie selon la région, la charge et la longueur du prompt) :

| Catégorie de modèle | TTFT (médiane) | Débit | Exemples |
|---------------------|:--------------:|:-----:|----------|
| **Rapide/économique** | ~150–300ms | ~100–150 tok/s | Gemini 3 Flash, Claude Haiku 4.5, Mistral Medium 3, GPT-5.3 Instant |
| **Équilibré** | ~300–600ms | ~50–80 tok/s | Claude Sonnet 4.6, GPT-5.4, Gemini 3 Pro, Mistral Large 3 |
| **Frontière/raisonnement** | ~500–1000ms | ~30–50 tok/s | Claude Opus 4.6, GPT-5.4 Pro, modes thinking/reasoning |
| **Auto-hébergé (A100/H100)** | ~200–500ms | ~40–100 tok/s | Llama 4 Scout, Llama 3.3 70B |

TTFT = Time To First Token (temps jusqu'au premier token). Ce sont des médianes approximatives à titre indicatif, pas des SLA.

---

## Limites de débit

| Fournisseur | Niveau gratuit | Niveau payant (typique) | Entreprise |
|-------------|:-------------:|:----------------------:|:----------:|
| **OpenAI** | 3 RPM, 200 RPD | 500–10K RPM | Personnalisé |
| **Anthropic** | 5 RPM, 300 RPD | 1K–4K RPM | Personnalisé |
| **Google** | 15 RPM, 1500 RPD | 360–1000 RPM | Personnalisé |
| **Mistral** | 1 RPM | 100–500 RPM | Personnalisé |

RPM = requêtes par minute, RPD = requêtes par jour. Les limites varient selon le modèle au sein de chaque fournisseur.

---

## Arbre de décision : quel modèle utiliser

```
DÉBUT : Quelle est votre exigence principale ?

[Les données doivent rester sur votre infrastructure ?]
  OUI → Llama 3.3 70B (qualité) ou Llama 3.2 3B (edge/mobile)
  NON → continuer

[Traitement natif de vidéo ou audio ?]
  OUI → Gemini 3 Pro (vidéo/audio natif)
  NON → continuer

[Documents dépassant 200K tokens ?]
  OUI → Claude Opus 4.6 (1M) ou Llama 4 Scout (10M)
  NON → continuer

[Besoin de conformité garantie au schéma JSON ?]
  OUI → GPT-5.4 avec structured outputs
  NON → continuer

[Raisonnement complexe ou rédaction longue ?]
  OUI → Claude Sonnet (rapport qualité-prix) ou Opus (qualité maximale)
  NON → continuer

[Haut volume, sensible aux coûts (>10K req/jour) ?]
  OUI → Quelle complexité ?
    Simple → Gemini Flash ou Mistral Medium 3
    Modérée → Claude Haiku 4.5
    Complexe → Claude Sonnet avec traitement par lots
  NON → continuer

[Génération ou revue de code ?]
  OUI → Claude Sonnet 4.6, GPT-5.3-Codex, ou Codestral
  NON → continuer

[Par défaut / usage général]
  Économique → Mistral Medium 3
  Qualité → Claude Sonnet 4.6 ou GPT-5.4
  Maximum → Claude Opus 4.6
```

---

## Stratégies d'optimisation des coûts

### Pattern 1 : Routage par classification

Utilisez un modèle économique pour classifier la complexité de la requête, puis routez vers le modèle approprié :

```python
# Classify with a cheap model
classification = cheap_model.classify(
    request, categories=["simple", "moderate", "complex"]
)

model_map = {
    "simple":   "gemini-flash",      # lowest cost
    "moderate": "claude-haiku",      # balanced
    "complex":  "claude-sonnet",     # highest quality
}
model = model_map[classification]
```

### Pattern 2 : Cascade (essayer l'économique d'abord)

```python
response = cheap_model.generate(prompt)

if not passes_quality_check(response):
    response = expensive_model.generate(prompt)  # escalate
```

### Pattern 3 : Routage par type de tâche

```python
task_routing = {
    "classification": "gemini-flash",
    "extraction":     "mistral-medium",
    "summarization":  "claude-haiku",
    "reasoning":      "claude-sonnet",
    "code":           "codestral",
}
```

### Économies attendues

Un routeur bien implémenté permet d'économiser **60 à 80 %** par rapport à l'envoi de tout au modèle le plus cher.

---

## Modèles retirés

Ne pas utiliser dans les nouveaux projets :

| Modèle | Statut |
|--------|--------|
| GPT-4o | Retiré |
| GPT-4.1 | Retiré |
| GPT-4.1 mini | Retiré |
| GPT-4 Turbo | Retiré |
| o4-mini | Retiré |
| Gemini 2.0 Flash | Retiré |
| Claude 3.5 Haiku | Retiré |

---

**Navigation :** [← Techniques de prompting](Techniques-de-Prompting.md) &nbsp;|&nbsp; [Outils : Linter, Optimiseur, Recommandeur →](Outils-Linter-Optimizer-Recommender.md)
