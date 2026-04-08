# Architettura

> Architettura tecnica, riferimento dei moduli, formati dei dati e struttura del progetto della AI Prompt Library.

---

## Indice

- [Panoramica dell'Architettura](#panoramica-dellarchitettura)
- [Riferimento Moduli](#riferimento-moduli)
- [Formati dei Dati](#formati-dei-dati)
- [Chiavi localStorage](#chiavi-localstorage)
- [Struttura dei File del Progetto](#struttura-dei-file-del-progetto)
- [Moduli Integrati di Node.js Utilizzati](#moduli-integrati-di-nodejs-utilizzati)
- [Come Funziona viewer.html](#come-funziona-viewerhtml)

---

## Panoramica dell'Architettura

```
┌─────────────────────────────────────────────────────────┐
│                   Interfaccia Utente                      │
│                                                         │
│   CLI (bin/prompt-lib.js)    HTML (viewer.html)          │
│   ├── list, search, show     ├── Scheda Sfoglia          │
│   ├── use, copy              ├── Scheda Compose           │
│   ├── compose                ├── Scheda Create            │
│   ├── create                 ├── Scheda Generate          │
│   ├── generate               ├── Scheda Strumenti         │
│   ├── lint                   │   ├── Linter              │
│   ├── optimize               │   ├── Optimizer           │
│   ├── recommend              │   └── Recommender         │
│   ├── saved                  ├── Scheda Playground        │
│   └── viewer                 └── Scheda La Mia Libreria   │
│                                                         │
│   App desktop (desktop/)                                 │
│   ├── macOS nativo (Swift + WebKit)                      │
│   ├── Linux nativo (Python + GTK + WebKitGTK)            │
│   └── Windows (modalità app Edge/Chrome)                 │
├─────────────────────────────────────────────────────────┤
│                    Moduli Principali                      │
│                                                         │
│   src/index.js     — Caricatore di prompt, persistenza    │
│   src/search.js    — Algoritmo di ricerca con punteggio  │
│   src/formatter.js — Formattazione ANSI per il terminale │
│   src/generator.js — Generazione dinamica di prompt      │
│   src/linter.js    — Valutatore di qualità a 14 regole   │
│   src/optimizer.js — Ottimizzatore consapevole del cont. │
│   src/recommender.js — Matcher di prompt basato su intento│
├─────────────────────────────────────────────────────────┤
│                    Livello Dati                           │
│                                                         │
│   prompts/**/*.md           — File di prompt integrati    │
│   ~/.prompt-library/        — Directory dati utente       │
│     custom-prompts.json     — Prompt creati dall'utente   │
│     saved-prompts.json      — Composizioni salvate        │
│   localStorage (browser)    — Persistenza app HTML        │
└─────────────────────────────────────────────────────────┘
```

---

## Riferimento Moduli

### `src/index.js` — Caricatore di Prompt e Persistenza

Il modulo principale che carica i prompt dal filesystem e gestisce i dati utente.

**Esportazioni:**

| Funzione | Firma | Descrizione |
|----------|-------|-------------|
| `loadPrompts()` | `() → Array<Prompt>` | Carica tutti i prompt dalla directory `prompts/` + prompt personalizzati da `~/.prompt-library/custom-prompts.json` |
| `loadCustomPrompts()` | `() → Array<Prompt>` | Carica solo i prompt personalizzati creati dall'utente |
| `saveCustomPrompt(prompt)` | `(Prompt) → Prompt` | Salva un prompt personalizzato. Sovrascrive se lo slug esiste, altrimenti aggiunge |
| `loadSavedCompositions()` | `() → Array<Composition>` | Carica le composizioni salvate da `~/.prompt-library/saved-prompts.json` |
| `saveComposition(composition)` | `(Object) → Composition` | Aggiunge una composizione con `id` auto-generato (timestamp) e `date` (stringa ISO) |
| `findPlaceholders(text)` | `(string) → Array<string>` | Estrae i token `{{segnaposto}}` univoci dal testo usando la regex `/\{\{[\w_\-\s/]+\}\}/g` |
| `extractTemplate(content)` | `(string) → string\|null` | Estrae il contenuto tra i delimitatori di codice nella sezione `## Template` |

**Costanti Esportate:**

| Nome | Valore | Descrizione |
|------|--------|-------------|
| `PROMPTS_DIR` | `<project>/prompts/` | Percorso assoluto ai prompt integrati |
| `USER_DATA_DIR` | `~/.prompt-library/` | Directory dati utente |
| `USER_PROMPTS_FILE` | `~/.prompt-library/custom-prompts.json` | File prompt personalizzati |
| `USER_SAVED_FILE` | `~/.prompt-library/saved-prompts.json` | File composizioni salvate |

**Funzioni Interne:**
- `parseFrontmatter(content)` — analizza il frontmatter YAML (tra marcatori `---`) in un oggetto `{meta, body}`. Gestisce array con parentesi (`[tag1, tag2]`).
- `walkDir(dir)` — trova ricorsivamente tutti i file `.md` in un albero di directory.
- `ensureUserDir()` — crea `~/.prompt-library/` se non esiste.

---

### `src/search.js` — Algoritmo di Ricerca

**Esportazioni:**

| Funzione | Firma | Descrizione |
|----------|-------|-------------|
| `searchPrompts(prompts, query)` | `(Array, string) → Array` | Assegna un punteggio e ordina i prompt per pertinenza alla query |

**Punteggio:**

| Posizione della Corrispondenza | Punti per Termine |
|-------------------------------|:-----------------:|
| Titolo | 100 |
| Tag | 50 |
| Categoria | 30 |
| Contenuto | 10 |

**Algoritmo:**
1. Suddivide la query in termini minuscoli
2. Per ogni prompt, assegna un punteggio a ogni termine rispetto a titolo, tag, categoria e contenuto
3. Somma tutti i punti
4. Filtra i prompt con punteggio zero
5. Ordina per punteggio decrescente

---

### `src/formatter.js` — Formattazione Terminale

Fornisce formattazione con colori ANSI per l'output della CLI. Rispetta la variabile d'ambiente `NO_COLOR` (quando impostata, tutti i codici colore sono stringhe vuote).

**Esportazioni:**

| Funzione | Descrizione |
|----------|-------------|
| `formatPromptList(prompts)` | Formatta tutti i prompt raggruppati per categoria |
| `formatPromptDetail(prompt)` | Formatta un singolo prompt con tutti i metadati |
| `formatCategories(prompts)` | Formatta l'elenco delle categorie con i conteggi |
| `formatStats(prompts)` | Formatta le statistiche della libreria (totali, distribuzione difficoltà, tag principali) |
| `formatSearchResults(results, query)` | Formatta i risultati di ricerca con i punteggi |

**Schema dei colori:**
- Ciano: titoli, slug, intestazioni di sezione
- Magenta: nomi delle categorie
- Giallo: etichette dei metadati, difficoltà intermedia
- Verde: difficoltà principiante, tag
- Rosso: difficoltà avanzata
- Grigio tenue: separatori, informazioni secondarie

---

### `src/generator.js` — Generazione Dinamica di Prompt

**Esportazioni:**

| Funzione | Firma | Descrizione |
|----------|-------|-------------|
| `getFrameworks()` | `() → Array<FrameworkInfo>` | Restituisce tutti i framework con metadati e domande |
| `getFramework(key)` | `(string) → Framework\|null` | Restituisce un singolo framework per chiave |
| `generatePrompt(key, answers)` | `(string, Object) → string` | Genera un prompt completo. Valida i campi obbligatori e applica i valori predefiniti. |

**Framework Disponibili:**

| Chiave | Nome | Domande |
|--------|------|:-------:|
| `expert-role` | Expert Role-Based | 8 |
| `chain-of-thought` | Chain-of-Thought | 5 |
| `structured-output` | Structured Output | 5 |
| `task-decomposition` | Task Decomposition | 4 |
| `guardrails` | Guardrails & Safety | 6 |

Ogni framework definisce una funzione `generate(answers)` che produce la stringa finale del prompt dalle risposte dell'utente.

---

### `src/linter.js` — Valutatore di Qualità dei Prompt

**Esportazioni:**

| Funzione | Firma | Descrizione |
|----------|-------|-------------|
| `lintPrompt(text)` | `(string) → LintResult` | Analizza il prompt rispetto a 14 regole. Restituisce punteggio, voto, regole superate/non superate, suggerimenti, conteggio parole |
| `formatLintResult(result)` | `(LintResult) → string` | Formatta il risultato dell'analisi come stringa leggibile |
| `LINT_RULES` | `Array<Rule>` | Array di tutti i 14 oggetti regola |

**Struttura LintResult:**
```javascript
{
  score: 72,              // 0-100
  grade: 'C',             // A, B, C, D, F
  totalRules: 14,
  passedCount: 10,
  failedCount: 4,
  passed: [...],           // Array of passed rules
  failed: [...],           // Array of failed rules
  suggestions: [...],      // Array of suggestion strings (sorted by weight)
  wordCount: 89
}
```

**Punteggio:** `score = Math.round((earnedWeight / totalWeight) × 100)` dove totalWeight = 100.

Consulta [Strumenti: Linter, Optimizer, Recommender](Strumenti-Linter-Optimizer-Recommender.md#prompt-linter) per l'elenco completo delle regole.

---

### `src/optimizer.js` — Ottimizzatore di Prompt Consapevole del Contenuto

**Esportazioni:**

| Funzione | Firma | Descrizione |
|----------|-------|-------------|
| `optimizePrompt(text)` | `(string) → OptimizeResult` | Ottimizzazione offline basata su regole |
| `optimizeWithAI(text, provider, apiKey, model)` | `(string, string, string, string?) → Promise<string>` | Riscrittura tramite IA |
| `sendToAI(prompt, systemPrompt, provider, apiKey, model)` | `(string, string?, string, string, string?) → Promise<AIResponse>` | Invio prompt al modello AI (Playground) |

**Struttura OptimizeResult:**
```javascript
{
  original: "...",         // Original prompt text
  optimized: "...",        // Optimized prompt text
  changes: [...],          // Array of change descriptions
  scoreBefore: 35,
  scoreAfter: 88,
  improvement: 53,
  lint: { ... },           // Full lint result of optimized prompt
  domain: "coding",        // Detected domain
  audience: "developers"   // Detected audience (or null)
}
```

**Pipeline di ottimizzazione:** rilevamento dominio → rimozione riempitivo → riduzione cortesia → rafforzamento verbi deboli → sostituzione linguaggio vago → decomposizione compiti composti → inserimento ruolo → rilevamento pubblico/tono → vincoli → formato output → esempi → controllo qualità.

**7 Domini Rilevati:** programmazione, scrittura, marketing, dati, business, formazione, immagini.

---

### `src/recommender.js` — Matcher di Prompt Basato sull'Intento

**Esportazioni:**

| Funzione | Firma | Descrizione |
|----------|-------|-------------|
| `recommendPrompts(prompts, description)` | `(Array, string) → Array` | Assegna un punteggio a tutti i prompt per pertinenza |
| `buildRecommendation(prompts, description)` | `(Array, string) → Recommendation` | Costruisce una raccomandazione completa con combinazione |

**Struttura Recommendation:**
```javascript
{
  description: "...",
  topPrompts: [...],          // Top 8 matches
  suggestedCombo: {
    systemPrompt: { ... },    // Best matching system prompt
    framework: { ... },       // Best matching framework
    template: { ... }         // Best matching domain template
  },
  systemPrompts: [...],       // Top 3 system prompts
  frameworks: [...],          // Top 3 frameworks
  templates: [...]            // Top 5 templates
}
```

**8 Categorie di Intento:** programmazione, scrittura, marketing, dati, business, immagini, ricerca, didattica.

---

## Formati dei Dati

### Oggetto Prompt

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

I prompt personalizzati aggiungono:
```json
{
  "fields": [
    { "name": "language", "description": "Programming language" }
  ],
  "custom": true
}
```

### Composizione Salvata

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

### Formato dei File Prompt (Frontmatter YAML)

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

## Chiavi localStorage

Queste chiavi sono usate dal Prompt Workshop (`viewer.html`):

| Chiave | Tipo | Descrizione |
|--------|------|-------------|
| `pl_dark` | `boolean` | Preferenza modalità scura (`true`/`false`) |
| `pl_saved` | `JSON array` | Tutti i prompt salvati, template compilati, prompt composti, prompt personalizzati. Gli elementi dal database sono contrassegnati con `source: 'database'` |
| `pl_sidebar_width` | `number` | Larghezza barra laterale in pixel (260–600). Persiste tra le sessioni |
| `api_settings` | `JSON object` | Chiavi API e preferenze modello per Playground e AI Optimizer. Contiene provider, chiavi per OpenAI/Anthropic/Google e modelli selezionati |

---

## Struttura dei File del Progetto

```
ai-prompt-library/
├── bin/
│   └── prompt-lib.js            # Punto di ingresso CLI (ESM, #!/usr/bin/env node)
├── src/
│   ├── index.js                 # Caricatore prompt, persistenza, segnaposto
│   ├── search.js                # Algoritmo di ricerca con punteggio
│   ├── formatter.js             # Formattazione ANSI per il terminale
│   ├── generator.js             # 5 framework, generazione dinamica prompt
│   ├── linter.js                # Valutatore di qualità a 14 regole
│   ├── optimizer.js             # Ottimizzatore consapevole del contenuto + API AI
│   └── recommender.js           # Matcher di prompt basato sull'intento
├── prompts/
│   ├── business/                # 12 template business
│   ├── data/                    # 10 template analisi dati
│   ├── development/             # 13 template sviluppo
│   ├── frameworks/              # 12 guide framework di prompting
│   ├── image-generation/        # 8 template generazione immagini
│   ├── marketing/               # 11 template marketing
│   ├── model-specific/          # 6 guide specifiche per modello
│   └── system-prompts/          # 10 prompt di sistema
├── desktop/
│   ├── build-all.sh             # Compilazione tutte le piattaforme
│   ├── build-macos.sh           # Script compilazione macOS
│   ├── build-linux.sh           # Script compilazione Linux
│   ├── build-windows.bat        # Script compilazione Windows
│   ├── macos-native/            # Sorgente Swift per app nativa macOS
│   ├── linux-native/            # Sorgente Python + GTK per app nativa Linux
│   ├── icons/                   # Icone app per tutte le piattaforme
│   └── images/                  # Screenshot e immagini documentazione
├── test/
│   └── run.js                   # Suite di test (46 test, zero dipendenze)
├── wiki/
│   ├── en/                      # Pagine wiki in inglese
│   ├── fr/                      # Pagine wiki in francese
│   └── it/                      # Pagine wiki in italiano
├── viewer.html                  # Prompt Workshop (SPA autonoma)
├── package.json                 # Configurazione pacchetto (zero dipendenze)
├── README.md                    # Panoramica del progetto
├── GUIDE.md                     # Guida utente
├── TECHNICAL.md                 # Documentazione tecnica
├── FUNCTIONS.md                 # Riferimento funzioni
├── CONTRIBUTING.md              # Linee guida per contribuire
├── CHANGELOG.md                 # Cronologia versioni
├── CODE_OF_CONDUCT.md           # Codice di condotta
├── SECURITY.md                  # Politica di sicurezza
└── LICENSE                      # Licenza MIT
```

---

## Moduli Integrati di Node.js Utilizzati

Il progetto usa **zero dipendenze npm**. Solo moduli integrati di Node.js:

| Modulo | Utilizzo |
|--------|----------|
| `fs` | Lettura file (`readFileSync`), scrittura (`writeFileSync`), attraversamento directory (`readdirSync`, `statSync`), controllo esistenza (`existsSync`), creazione directory (`mkdirSync`) |
| `path` | Manipolazione percorsi (`join`, `dirname`, `relative`, `basename`) |
| `url` | `fileURLToPath` per `__dirname` compatibile con ESM |
| `readline` | Input interattivo CLI (domande e inserimento prompt multi-riga) |
| `child_process` | Copia negli appunti tramite `execSync` (`pbcopy`, `clip`, `xclip`, `xsel`), apertura browser (`open`, `xdg-open`, `start`) |
| `os` | Directory home (`homedir`), directory temporanea (`tmpdir`) |

---

## Come Funziona viewer.html

Il file `viewer.html` è un'**applicazione a pagina singola autonoma**:

1. **Nessuna dipendenza esterna** — puro HTML, CSS e JavaScript vanilla in un singolo file
2. **Dati prompt incorporati** — tutti gli 82+ prompt sono serializzati come JSON in un tag `<script>`
3. **localStorage per la persistenza** — prompt personalizzati, composizioni salvate, preferiti, chiavi API e preferenze dell'interfaccia
4. **Design responsivo** — funziona su desktop, tablet e mobile
5. **Modalità scura/chiara** — commutabile con preferenza salvata nel localStorage

Quando lanciato tramite `prompt-lib viewer`, la CLI:
1. Legge `viewer.html`
2. Carica tutti i prompt (inclusi quelli personalizzati)
3. Inserisce i dati dei prompt come JSON nell'HTML
4. Scrive l'HTML modificato in un file temporaneo
5. Apre il file temporaneo nel browser predefinito

Quando aperto direttamente, vengono usati i dati prompt incorporati (generati al momento del rilascio).

---

**Navigazione:** [← API e Playground](API-e-Playground.md) &nbsp;|&nbsp; [App Desktop →](App-Desktop.md)
