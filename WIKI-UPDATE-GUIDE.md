# Wiki Update Guide — v2.3.1 → v2.4.0

> **Purpose:** This document tells you exactly what to change in each GitHub Wiki page to reflect v2.4.0.
> It's organized page-by-page, with copy-paste ready text where possible.
> After updating, you can delete this file from the repo — it's a one-time update guide.

---

## Summary of all v2.4.0 changes

| Change | Type | What's new |
|--------|------|-----------|
| Prompt-type aware linter | Feature | Linter auto-detects prompt type (🎨 Image, 💻 Code, 🤖 System, 📝 General) and adjusts rule weights |
| Optimizer diff view | Feature | Toggle between "Optimized" and "Diff view" (color-coded before/after comparison) |
| Starter templates in Create | Feature | 6 pre-built skeletons: Expert Assistant, Content Writer, Code Generator, Data Analyst, Marketing Strategist, Image Prompt |
| My Library search/filter/sort | Feature | Search bar, type filter (All/Favorites/Filled/Composed/Custom), sort (Newest/Oldest/A→Z/Z→A) |
| Multi-Model Testing | Feature | "⚖ Compare" button in Playground sends same prompt to all configured providers simultaneously; side-by-side results |
| Accessibility | Feature | ARIA landmarks, skip-link, focus-visible, arrow-key tab navigation, improved contrast |
| API timeout | Security | 30-second timeout on all API calls via AbortController |
| API key warning | Security | Security notice in API Settings modal about localStorage plaintext storage |
| extractTemplate null guard | Bugfix | No longer crashes on null/undefined input |
| Linter rule sync | Bugfix | 4 regex divergences between src/linter.js and viewer.html fixed |
| Recommender acronyms | Bugfix | Short terms (AI, ML, UI, DB) no longer filtered out |
| Version consistency | Bugfix | GUIDE.md version corrected |

---

## Page-by-page update instructions

---

### 1. `Home.md` (🇬🇧 English)

**Change:** Update version number

Find:
```
v2.3.1
```
Replace with:
```
v2.4.0
```

**Add under "Key Features at a Glance"** (or wherever features are listed):

```markdown
- **Prompt-Type Aware Linter** — auto-detects if your prompt is for image generation, coding, system instructions, or general use, and adjusts scoring rules accordingly
- **Multi-Model Compare** — send the same prompt to OpenAI + Anthropic + Google simultaneously and compare responses side-by-side in the Playground
- **Optimizer Diff View** — see exactly what the optimizer changed with color-coded before/after comparison
- **Create Tab Templates** — 6 starter templates so you don't face a blank page
- **My Library Filtering** — search, filter by type, and sort your saved prompts
- **Accessibility** — ARIA landmarks, keyboard navigation, improved contrast
```

---

### 2. `Home-IT.md` (🇮🇹 Italiano)

Same as Home.md but in Italian:

```markdown
- **Linter consapevole del tipo di prompt** — rileva automaticamente se il prompt è per generazione immagini, codice, istruzioni di sistema o uso generale, e adegua le regole di punteggio
- **Confronto Multi-Modello** — invia lo stesso prompt a OpenAI + Anthropic + Google simultaneamente e confronta le risposte affiancate nel Playground
- **Vista Diff dell'Ottimizzatore** — visualizza esattamente cosa ha cambiato l'ottimizzatore con confronto colorato prima/dopo
- **Template nel tab Crea** — 6 template predefiniti per non partire da una pagina vuota
- **Filtri nella Libreria** — cerca, filtra per tipo e ordina i prompt salvati
- **Accessibilità** — ARIA landmarks, navigazione da tastiera, contrasto migliorato
```

---

### 3. `Accueil.md` (🇫🇷 Français)

Same as Home.md but in French:

```markdown
- **Linter sensible au type de prompt** — détecte automatiquement si votre prompt est pour la génération d'images, le code, les instructions système ou l'usage général, et ajuste les règles de notation
- **Comparaison Multi-Modèle** — envoyez le même prompt à OpenAI + Anthropic + Google simultanément et comparez les réponses côte à côte dans le Playground
- **Vue Diff de l'Optimiseur** — voyez exactement ce que l'optimiseur a changé avec un comparatif coloré avant/après
- **Templates dans l'onglet Créer** — 6 modèles prédéfinis pour ne pas partir d'une page blanche
- **Filtres dans Ma Bibliothèque** — recherchez, filtrez par type et triez vos prompts sauvegardés
- **Accessibilité** — repères ARIA, navigation au clavier, contraste amélioré
```

---

### 4. `Prompt-Workshop.md` (🇬🇧 English)

**Updates needed in these sections:**

#### Tools tab section — update Linter description:

Add after existing linter description:
```markdown
**New in v2.4.0:** The linter now auto-detects your prompt type:
- 🎨 **Image** — skips irrelevant rules (audience, tone, quality check); weights vague language detection higher
- 💻 **Code** — weights output format, constraints, and task definition higher
- 🤖 **System** — weights role definition and constraints higher; relaxes length requirements
- 📝 **General** — standard weights (no adjustment)

The detected type is displayed below the score.
```

#### Tools tab section — update Optimizer description:

Add after existing optimizer description:
```markdown
**New in v2.4.0:** After optimizing, toggle between "Optimized" (clean result) and "Diff view" (color-coded line-by-line comparison showing what was added, removed, or unchanged).
```

#### Create tab section — add:

```markdown
**New in v2.4.0:** The Create tab now includes **6 starter templates** at the top:
- 🤖 Expert Assistant
- 📝 Content Writer
- 💻 Code Generator
- 📊 Data Analyst
- 📣 Marketing Strategist
- 🎨 Image Prompt

Click any template to pre-fill the title, tags, body, and dynamic fields. Customize and save.
```

#### Playground tab section — add Multi-Model Compare:

```markdown
#### ⚖ Multi-Model Compare (New in v2.4.0)

If you have 2 or more API keys configured (e.g., OpenAI + Anthropic), a **"⚖ Compare"** button appears next to "Send". Clicking it:

1. Sends the same prompt to **all configured providers simultaneously**
2. Shows responses **side-by-side in a grid** (up to 3 columns)
3. Each card shows: response text, elapsed time, token usage, and a copy button
4. A summary bar shows the total comparison time

This is perfect for:
- Choosing the best model for your specific use case
- Comparing response quality, speed, and cost
- A/B testing prompts across providers

**Requirement:** 2+ API keys configured via ⚙ Settings. If only 1 key is set, a hint suggests adding more.
```

#### My Library tab section — update:

```markdown
**New in v2.4.0:** My Library now includes:
- **🔍 Search bar** — search within your saved prompts by title or content
- **Type filter dropdown** — filter by: All / ⭐ Favorites / 📝 Filled / 🔗 Composed / ✨ Custom
- **Sort controls** — Newest first, Oldest first, A→Z, Z→A
- **Item counts** — shows total items and counts per type
```

#### Keyboard Shortcuts section — add:

```markdown
| `←` `→` | Navigate between tabs (when a tab is focused) |
```

---

### 5. `Prompt-Workshop-IT.md` (🇮🇹 Italiano)

Apply the same changes as Prompt-Workshop.md, translated to Italian.

---

### 6. `Prompt-Workshop-FR.md` (🇫🇷 Français)

Apply the same changes as Prompt-Workshop.md, translated to French.

---

### 7. `Tools-Linter-Optimizer-Recommender.md` (🇬🇧 English)

#### Linter section — add after scoring formula:

```markdown
### Prompt-Type Awareness (v2.4.0)

The linter now auto-detects prompt types and adjusts rule weights:

| Type | Detection | Key weight changes |
|------|-----------|-------------------|
| 🎨 Image | Keywords: image, photo, visual, dall-e, midjourney... | Skips audience, tone, quality-check (×0). Boosts vague-language detection (×1.5) |
| 💻 Code | Keywords: code, function, class, api, debug... | Boosts task, context, output-format, constraints (×1.2) |
| 🤖 System | Keywords: you are, act as, persona... + length < 800 chars | Boosts role (×1.5), constraints (×1.5). Relaxes length (×0.5) |
| 📝 General | (fallback) | All weights at ×1.0 (default) |

A weight multiplier of **0** means the rule is skipped entirely. A multiplier > 1.0 makes the rule count more toward the total score.
```

#### Optimizer section — add:

```markdown
### Diff View (v2.4.0)

After optimization, toggle between two views:
- **Optimized** — shows the clean, optimized prompt
- **Diff view** — line-by-line color-coded comparison:
  - 🟢 Green = added lines
  - 🔴 Red (strikethrough) = removed lines
  - No marker = unchanged lines
```

---

### 8. `Strumenti-Linter-Optimizer-Recommender.md` (🇮🇹)

Same changes as Tools-Linter-Optimizer-Recommender.md, translated to Italian.

---

### 9. `Outils-Linter-Optimizer-Recommender.md` (🇫🇷)

Same changes as Tools-Linter-Optimizer-Recommender.md, translated to French.

---

### 10. `API-and-Playground.md` (🇬🇧 English)

#### Add new section after "Token Usage Tracking":

```markdown
### ⚖ Multi-Model Compare (v2.4.0)

Send the same prompt to all configured providers simultaneously and compare responses side-by-side.

**How it works:**
1. Configure 2+ API keys via ⚙ Settings
2. Write your prompt in the Playground
3. Click **"⚖ Compare (N models)"** instead of "Send"
4. All providers receive the request in parallel
5. Results appear in a grid showing: response, timing, tokens, and copy button

**Technical details:**
- Uses `Promise.allSettled()` — one provider failing doesn't block others
- Each request has a 30-second timeout
- Send button is disabled during comparison to prevent double-sends

### Security Notes (v2.4.0)

- All API calls now enforce a **30-second timeout** via AbortController
- The API Settings modal includes a **security warning** about localStorage plaintext storage
- API keys are never sent anywhere except the selected API provider
```

---

### 11. `API-e-Playground.md` (🇮🇹) and `API-et-Playground.md` (🇫🇷)

Same changes as API-and-Playground.md, translated to the respective language.

---

### 12. `Architecture.md` (🇬🇧 English)

#### Update tab structure table:

Replace the existing tab descriptions with:

```markdown
| **Create** | Build custom system prompts with field definitions. 6 starter templates available. |
| **Tools** | Prompt Linter (type-aware quality scoring), Prompt Optimizer (content-aware rewriting with diff view), Smart Recommender (personalized suggestions). |
| **Playground** | Send prompts to AI models. System prompts, token tracking, one-click copy. Multi-model comparison (⚖ Compare). |
| **My Library** | View saved prompts with search, type filter, and sort controls. Edit, copy, delete, export/import. |
```

#### Add to localStorage Keys table:

```markdown
| `pg_prefill` | Temporary prefill for playground | Cleared after use |
```

#### Add link to INFRASTRUCTURE.md:

```markdown
> For detailed algorithms, scoring formulas, and engine internals, see [INFRASTRUCTURE.md](../INFRASTRUCTURE.md).
```

---

### 13. `Architettura.md` (🇮🇹) and `Architecture-FR.md` (🇫🇷)

Same changes as Architecture.md, translated.

---

### 14. `Getting-Started.md` (🇬🇧)

No changes needed — the setup process hasn't changed.

---

### 15. `Guida-Introduttiva.md` (🇮🇹) and `Premiers-Pas.md` (🇫🇷)

No changes needed.

---

### 16. `Contributing.md` / `Contribuire.md` / `Contribuer.md`

No changes needed — the contribution process hasn't changed.

---

### 17. `Desktop-Apps.md` / `App-Desktop.md` / `Applications-Desktop.md`

No changes needed — desktop build process is unchanged.

---

### 18. `AI-Models-Guide.md` / `Guida-Modelli-AI.md` / `Guide-Modeles-IA.md`

No changes needed for v2.4.0 — the model guide is independent of the tool version.

---

### 19. `Prompting-Techniques.md` / `Tecniche-di-Prompting.md` / `Techniques-de-Prompting.md`

No changes needed — prompting techniques are timeless.

---

### 20. `_Sidebar.md`

No changes needed — navigation structure is unchanged (no new tabs or pages added).

---

### 21. `_Footer.md`

No changes needed.

---

## Checklist

Use this checklist to track your progress:

- [x] `Home.md` — version 2.3.1 → 2.4.0, add new features
- [x] `Home-IT.md` — same in Italian
- [x] `Accueil.md` — same in French
- [x] `Prompt-Workshop.md` — update Tools, Create, Playground, My Library sections
- [x] `Prompt-Workshop-IT.md` — same in Italian
- [x] `Prompt-Workshop-FR.md` — same in French
- [x] `Tools-Linter-Optimizer-Recommender.md` — add type awareness, diff view
- [x] `Strumenti-Linter-Optimizer-Recommender.md` — same in Italian
- [x] `Outils-Linter-Optimizer-Recommender.md` — same in French
- [x] `API-and-Playground.md` — add multi-model compare, security notes
- [x] `API-e-Playground.md` — same in Italian
- [x] `API-et-Playground.md` — same in French
- [x] `Architecture.md` — update tab table, add localStorage key
- [x] `Architettura.md` — same in Italian
- [x] `Architecture-FR.md` — same in French

**Pages that need NO changes:** Getting-Started (3 langs), Contributing (3 langs), Desktop-Apps (3 langs), AI-Models-Guide (3 langs), Prompting-Techniques (3 langs), _Sidebar.md, _Footer.md

---

*This file can be deleted after the wiki is updated.*
