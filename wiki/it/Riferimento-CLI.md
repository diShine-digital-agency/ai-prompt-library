# Riferimento CLI

> Documentazione completa per ogni comando `prompt-lib`.

---

## Panoramica

La CLI `prompt-lib` è l'interfaccia a riga di comando della AI Prompt Library. Fornisce comandi per scoprire, costruire, comporre, analizzare, ottimizzare e gestire prompt — il tutto senza alcuna dipendenza npm.

```
prompt-lib <comando> [argomenti]
```

**Installazione globale:**
```bash
npm install -g @dishine/prompt-library
prompt-lib --help
```

**Locale (senza installazione):**
```bash
node bin/prompt-lib.js --help
```

---

## Riferimento Comandi

### `list` — Elenca Tutti i Prompt

Elenca tutti i prompt raggruppati per categoria, mostrando slug, titolo e livello di difficoltà.

```bash
prompt-lib list
```

**Output:**
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

### `search <query>` — Cerca Prompt

Cerca i prompt per parola chiave attraverso titoli, tag, categorie e contenuto. I risultati sono ordinati per punteggio di pertinenza.

```bash
prompt-lib search <query>
```

**Sistema di punteggio:**

| Posizione della Corrispondenza | Punti per Termine |
|-------------------------------|:-----------------:|
| Titolo | 100 |
| Tag | 50 |
| Categoria | 30 |
| Contenuto | 10 |

Le query con più parole assegnano un punteggio per ogni parola indipendentemente. Un prompt che corrisponde a "code" e "review" nel titolo ottiene 200 punti.

**Esempi:**
```bash
prompt-lib search "chain of thought"
prompt-lib search "marketing email"
prompt-lib search "code review security"
prompt-lib search "claude xml"
prompt-lib search "data pipeline"
```

---

### `show <slug>` — Mostra il Prompt Completo

Visualizza il contenuto completo di un prompt, inclusi metadati, template, suggerimenti ed esempi.

```bash
prompt-lib show <slug>
```

**Esempio:**
```bash
prompt-lib show chain-of-thought
prompt-lib show code-review
prompt-lib show landing-page-copy
```

L'output include:
- Titolo, categoria, difficoltà, tag, modelli compatibili
- Contenuto completo del prompt con tutte le sezioni
- Percorso del file all'interno della libreria

---

### `use <slug>` — Costruisci un Prompt in Modo Interattivo

Estrae la sezione template da un prompt, rileva i `{{segnaposto}}` e ti chiede di compilare ciascuno. Il prompt completato viene copiato negli appunti.

```bash
prompt-lib use <slug>
```

**Esempio:**
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

### `copy <slug>` — Copia il Template negli Appunti

Estrae e copia la sezione template di un prompt direttamente negli appunti, senza compilazione interattiva.

```bash
prompt-lib copy <slug>
```

**Esempio:**
```bash
prompt-lib copy chain-of-thought
prompt-lib copy sql-query-builder
```

---

### `compose` — Combina Più Livelli

Comando interattivo che ti permette di stratificare un **prompt di sistema** + **framework** + **template di compito** in un unico prompt potente. I segnaposto di tutti i livelli vengono compilati in modo interattivo.

```bash
prompt-lib compose
```

**Flusso di lavoro:**
1. Scegli un prompt di sistema (es. Coding Assistant, Research Assistant)
2. Scegli un framework di ragionamento (es. Chain-of-Thought, Few-Shot Patterns)
3. Scegli un template di dominio (es. Code Review, SQL Query Builder)
4. Compila eventuali `{{segnaposto}}` nei tre livelli
5. Il prompt composto viene copiato negli appunti
6. Opzionalmente salva la composizione per un uso futuro

**Output di esempio:**
```
# SYSTEM PROMPT
You are a senior software engineer...

# REASONING FRAMEWORK
Think through this problem step by step...

# TASK TEMPLATE
Review the following code for...
```

Le composizioni salvate vengono archiviate in `~/.prompt-library/saved-prompts.json`.

---

### `create` — Crea un Prompt Personalizzato

Comando interattivo per costruire un nuovo prompt di sistema con campi dinamici personalizzati.

```bash
prompt-lib create
```

**Flusso di lavoro:**
1. Inserisci titolo, categoria, tag, difficoltà e modelli di destinazione
2. Definisci i campi dinamici (diventano segnaposto `{{nome_campo}}`)
3. Scrivi il corpo del prompt usando i tuoi campi
4. Il prompt viene salvato in `~/.prompt-library/custom-prompts.json`
5. Opzionalmente compilalo e usalo immediatamente

**Esempio:**
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

I tuoi prompt personalizzati appaiono in `prompt-lib list` e `prompt-lib search` insieme ai prompt integrati.

---

### `generate` — Genera un Prompt da un Framework

Comando interattivo che ti guida nella creazione di un prompt utilizzando uno dei 5 framework integrati.

```bash
prompt-lib generate
```

**Framework disponibili:**

| # | Framework | Descrizione |
|---|-----------|-------------|
| 1 | **Expert Role-Based** | Crea prompt con persona esperta, regole e vincoli |
| 2 | **Chain-of-Thought** | Impone un ragionamento passo dopo passo |
| 3 | **Structured Output** | Produce output coerente e formattato |
| 4 | **Task Decomposition** | Scompone compiti complessi in sotto-compiti |
| 5 | **Guardrails & Safety** | Regole di sicurezza e vincoli sull'output integrate |

Ogni framework pone domande specifiche al contesto e genera un prompt pronto per la produzione. Puoi salvare il risultato come prompt personalizzato.

---

### `lint` — Analizza la Qualità del Prompt

Analizza qualsiasi prompt rispetto a 14 regole di qualità, producendo un punteggio (0–100), un voto in lettere (A–F) e suggerimenti prioritizzati.

```bash
prompt-lib lint
```

Incolla il tuo prompt (multi-riga, termina con due righe vuote) e ottieni:

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

Consulta [Strumenti: Linter, Optimizer, Recommender](Strumenti-Linter-Optimizer-Recommender.md) per l'elenco completo delle regole e i dettagli del punteggio.

---

### `optimize` — Riscrivi il Prompt con le Migliori Pratiche

Analizza e riscrive il tuo prompt usando l'ottimizzazione consapevole del contenuto. Funziona interamente offline.

```bash
prompt-lib optimize
```

L'ottimizzatore:
1. Rileva il dominio (programmazione, scrittura, marketing, dati, business, formazione, immagini)
2. Rimuove le parole di riempimento e la cortesia eccessiva
3. Rafforza i verbi deboli
4. Sostituisce il linguaggio vago con termini specifici
5. Aggiunge struttura specifica per il dominio (ruolo, vincoli, formato di output)
6. Mostra i punteggi prima/dopo e tutte le modifiche apportate

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

### `recommend <query>` — Suggerimenti Intelligenti

Analizza la tua descrizione del caso d'uso e suggerisce i prompt migliori, includendo una combinazione ottimale di prompt di sistema + framework + template.

```bash
prompt-lib recommend <query>
```

**Esempio:**
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

### `saved` — Visualizza le Composizioni Salvate

Elenca tutte le composizioni salvate e i prompt personalizzati da `~/.prompt-library/`.

```bash
prompt-lib saved
```

---

### `viewer` — Apri il Prompt Workshop

Apre il Prompt Workshop (strumento visuale nel browser) con tutti i prompt caricati.

```bash
prompt-lib viewer
```

Il comando inserisce i dati attuali dei prompt in `viewer.html` e lo apre nel browser predefinito.

---

### `categories` — Elenca Tutte le Categorie

Mostra tutte le categorie di prompt con il relativo conteggio.

```bash
prompt-lib categories
```

---

### `random` — Mostra un Prompt Casuale

Visualizza un prompt casuale dalla libreria — ottimo per trarre ispirazione.

```bash
prompt-lib random
```

---

### `stats` — Statistiche della Libreria

Mostra statistiche complete: totale prompt, categorie, tag univoci, modelli coperti, distribuzione delle difficoltà e tag più usati.

```bash
prompt-lib stats
```

---

### `--help`, `-h` — Aiuto

```bash
prompt-lib --help
```

### `--version`, `-v` — Versione

```bash
prompt-lib --version
```

---

## Supporto Appunti

I comandi `copy`, `use` e `compose` copiano automaticamente i risultati negli appunti. Strumenti specifici per piattaforma:

| Piattaforma | Strumento Appunti | Note |
|-------------|-------------------|------|
| **macOS** | `pbcopy` | Integrato, sempre disponibile |
| **Windows** | `clip` | Integrato, sempre disponibile |
| **Linux** | `xclip` o `xsel` | Installa con `sudo apt install xclip` |

Se nessuno strumento per gli appunti è disponibile, la CLI mostra il contenuto del prompt e ti chiede di copiarlo manualmente.

---

## Flussi di Lavoro Comuni

### Flusso 1: Scoperta Rapida dei Prompt

```bash
prompt-lib search "sql"          # Find SQL-related prompts
prompt-lib show sql-query-builder # Read the full prompt
prompt-lib use sql-query-builder  # Fill placeholders and copy
```

### Flusso 2: Costruire un Prompt Composto

```bash
prompt-lib compose               # Layer system + framework + template
# or for AI-powered suggestions:
prompt-lib recommend "build a REST API" # Get recommendations first
```

### Flusso 3: Controllo Qualità del Prompt

```bash
prompt-lib lint                  # Score your prompt
prompt-lib optimize              # Rewrite with best practices
```

### Flusso 4: Creare e Riutilizzare Prompt Personalizzati

```bash
prompt-lib create                # Build a custom prompt
prompt-lib saved                 # View your saved prompts
prompt-lib use my-custom-prompt  # Use it anytime
```

---

## Variabili d'Ambiente

| Variabile | Effetto |
|-----------|---------|
| `NO_COLOR` | Disabilita l'output con colori ANSI quando impostata a qualsiasi valore |

---

**Navigazione:** [← Guida Introduttiva](Guida-Introduttiva.md) &nbsp;|&nbsp; [Prompt Workshop →](Prompt-Workshop.md)
