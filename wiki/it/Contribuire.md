# Contribuire

> Come contribuire con prompt, codice e framework alla AI Prompt Library.

---

## Indice

- [Aggiungere Nuovi Prompt](#aggiungere-nuovi-prompt)
- [Formato dei File Prompt](#formato-dei-file-prompt)
- [Categorie](#categorie)
- [Aggiungere Framework al Generatore](#aggiungere-framework-al-generatore)
- [Aggiungere Comandi CLI](#aggiungere-comandi-cli)
- [Eseguire i Test](#eseguire-i-test)
- [Linee Guida sullo Stile del Codice](#linee-guida-sullo-stile-del-codice)
- [Processo di Pull Request](#processo-di-pull-request)
- [Segnalazione Bug](#segnalazione-bug)
- [Richieste di Funzionalità](#richieste-di-funzionalità)

---

## Aggiungere Nuovi Prompt

Il modo più semplice per contribuire. Ogni prompt è un singolo file Markdown nella directory `prompts/`.

### Procedura Passo Dopo Passo

1. **Scegli la categoria giusta** — vedi [Categorie](#categorie) di seguito
2. **Crea il file** — `prompts/<category>/your-prompt-name.md`
3. **Aggiungi il frontmatter YAML** — metadati all'inizio del file
4. **Scrivi il contenuto** — segui il [Formato dei File Prompt](#formato-dei-file-prompt)
5. **Esegui i test** — `node test/run.js` (tutti i test devono passare)
6. **Apri una pull request**

### Esempio: Creare un Nuovo Prompt

```bash
# 1. Create the file
touch prompts/development/api-testing.md

# 2. Write the content (see format below)

# 3. Run tests
node test/run.js

# 4. The CLI picks it up automatically — no registration step
node bin/prompt-lib.js show api-testing
```

---

## Formato dei File Prompt

Ogni file prompt segue questa struttura:

```markdown
---
title: Your Prompt Title
category: development
tags: [api, testing, quality, automation]
difficulty: intermediate
models: [claude, gpt-4, gemini]
---

# Your Prompt Title

## When to Use

Describe when this technique or template is most useful.
Include specific scenarios and use cases. Also mention when
NOT to use it — this helps users make better decisions.

## The Technique

Detailed explanation of the approach, methodology, or framework.
Include the reasoning behind why this works and any theory.

## Template

\```
You are a {{role}} specializing in {{domain}}.

TASK:
{{task_description}}

RULES:
- Rule 1
- Rule 2
- {{custom_constraint}}

OUTPUT FORMAT:
Respond in {{format}} with clear sections.

Before responding, verify that your answer is complete and accurate.
\```

## Examples

### Example 1: [Scenario Name]

**Input:**
\```
[Example input with filled placeholders]
\```

**Expected Output:**
\```
[Example of what the AI should produce]
\```

### Example 2: [Another Scenario]
...

## Tips

- Practical tip from real usage experience
- Common adjustment that improves results
- Model-specific advice (e.g., "Claude works best with XML tags here")

## Common Mistakes

- ❌ Mistake 1 — why it's wrong and how to fix it
- ❌ Mistake 2 — the impact and the correct approach
- ❌ Mistake 3 — a subtle pitfall that's easy to miss
```

### Campi di Metadati Obbligatori

| Campo | Tipo | Descrizione | Esempio |
|-------|------|-------------|---------|
| `title` | stringa | Titolo leggibile | `API Testing Prompt` |
| `category` | stringa | Nome della directory della categoria | `development` |
| `tags` | array | Parole chiave ricercabili | `[api, testing, automation]` |
| `difficulty` | stringa | `beginner`, `intermediate` o `advanced` | `intermediate` |
| `models` | array | Modelli AI compatibili | `[claude, gpt-4, gemini]` |

### Regole per la Sezione Template

- Inserisci il template in un blocco di codice recintato (` ``` `)
- Usa `{{nome_segnaposto}}` per i campi dinamici
- Usa underscore o trattini nei nomi dei segnaposto: `{{task_description}}`, `{{output-format}}`
- I segnaposto vengono rilevati automaticamente da `findPlaceholders()` usando la regex `/\{\{[\w_\-\s/]+\}\}/g`

---

## Categorie

| Categoria | Directory | Cosa Va Qui |
|-----------|-----------|-------------|
| `frameworks` | `prompts/frameworks/` | Tecniche fondamentali di prompting (Chain-of-Thought, Few-Shot, ReAct, ecc.) |
| `model-specific` | `prompts/model-specific/` | Tecniche ottimizzate per LLM specifici (Claude, GPT, Gemini) |
| `system-prompts` | `prompts/system-prompts/` | Prompt di sistema pronti per la produzione (assistente di programmazione, ricercatore, ecc.) |
| `marketing` | `prompts/marketing/` | Template per marketing e contenuti |
| `development` | `prompts/development/` | Template per l'ingegneria del software |
| `data` | `prompts/data/` | Template per analisi e ingegneria dei dati |
| `business` | `prompts/business/` | Template business e professionali |
| `image-generation` | `prompts/image-generation/` | Template per la creazione di immagini con IA |

Per creare una **nuova categoria**, basta creare una nuova sottodirectory in `prompts/`. La CLI scopre le categorie automaticamente dalla struttura delle directory.

---

## Aggiungere Framework al Generatore

I framework del generatore sono definiti in `src/generator.js` nell'oggetto `FRAMEWORKS`.

### Come Aggiungere un Nuovo Framework

Modifica `src/generator.js` e aggiungi una nuova voce a `FRAMEWORKS`:

```javascript
'my-framework': {
  name: 'My Framework',
  description: 'What it does in one sentence',
  questions: [
    {
      key: 'field1',
      label: 'Question for the user',
      required: true
    },
    {
      key: 'field2',
      label: 'Optional question',
      required: false,
      default: 'default value'
    },
  ],
  generate: (answers) => {
    return `You are an expert in ${answers.field1}.

TASK:
${answers.field2}

RULES:
- Be specific and actionable
- Show your reasoning

OUTPUT FORMAT:
Structured markdown with clear sections`;
  }
}
```

### Campi dell'Oggetto Framework

| Campo | Tipo | Obbligatorio | Descrizione |
|-------|------|:------------:|-------------|
| `name` | stringa | ✅ | Nome visualizzato |
| `description` | stringa | ✅ | Descrizione in una frase |
| `questions` | array | ✅ | Array di oggetti domanda |
| `generate` | funzione | ✅ | `(answers) → string` — genera il prompt |

### Campi dell'Oggetto Domanda

| Campo | Tipo | Obbligatorio | Descrizione |
|-------|------|:------------:|-------------|
| `key` | stringa | ✅ | Chiave usata nell'oggetto risposte |
| `label` | stringa | ✅ | Testo della domanda mostrato all'utente |
| `required` | boolean | ✅ | Se il campo deve essere compilato |
| `default` | stringa | ❌ | Valore predefinito se non fornito |

Il framework appare automaticamente in:
- CLI: `prompt-lib generate`
- Prompt Workshop: scheda Generate

---

## Aggiungere Comandi CLI

I comandi CLI sono definiti in `bin/prompt-lib.js`.

### Come Aggiungere un Nuovo Comando

1. **Aggiungi un caso** all'istruzione `switch` in `main()`:

```javascript
case 'mycommand': {
  // Your command logic here
  const arg = args[1];
  // ...
  break;
}
```

2. **Aggiungi alla stringa HELP** all'inizio del file:

```javascript
const HELP = `
  ...
  Commands:
    ...
    mycommand <arg>       Description of what it does
  ...
`;
```

3. **Aggiungi i test** se il comando coinvolge nuovi moduli

### Convenzioni per i Comandi

- I comandi interattivi usano `readline` per l'input dell'utente
- Usa `copyToClipboard(text)` per la copia negli appunti
- Usa `formatPromptDetail()` ecc. da `src/formatter.js` per l'output
- Rispetta la variabile d'ambiente `NO_COLOR` (gestita da formatter.js)
- Esci con `process.exit(1)` in caso di errori

---

## Eseguire i Test

```bash
node test/run.js
```

La suite di test (`test/run.js`) esegue **46 test** senza alcuna dipendenza. I test verificano:

| Area di Test | Cosa Controlla |
|-------------|----------------|
| **Caricamento prompt** | 82+ prompt caricati dai file + prompt personalizzati |
| **Campi obbligatori** | Ogni prompt ha slug, title, category, tags, content |
| **Ricerca** | Correttezza del punteggio e dell'ordinamento |
| **Categorie** | Validazione del conteggio delle categorie |
| **Prompt personalizzati** | Creazione e persistenza |
| **Generatore** | Validazione dei framework, controllo dei campi obbligatori |
| **Linter** | Accuratezza del punteggio, valutazione delle regole |
| **Optimizer** | Correttezza delle trasformazioni |
| **Recommender** | Punteggio e costruzione delle combinazioni |

### Eseguire i Test Prima/Dopo le Modifiche

```bash
# Before changes — establish baseline
node test/run.js

# Make your changes...

# After changes — verify nothing is broken
node test/run.js
```

Tutti i test devono passare prima di inviare una pull request.

---

## Linee Guida sullo Stile del Codice

### Moduli ESM

Il progetto usa **ES Modules** (ESM). Usa la sintassi `import`/`export`:

```javascript
// ✅ Correct
import { readFileSync } from 'fs';
export function myFunction() { ... }

// ❌ Wrong
const fs = require('fs');
module.exports = { myFunction };
```

### Politica Zero Dipendenze

**Non aggiungere pacchetti npm.** Usa solo moduli integrati di Node.js:

| Consentiti | Non Consentiti |
|-----------|----------------|
| `fs`, `path`, `url` | `lodash`, `chalk`, `inquirer` |
| `readline`, `os` | `yargs`, `commander` |
| `child_process` | `clipboardy`, `open` |

Questo è un principio di design fondamentale. La libreria funziona con un'installazione pulita di Node.js — nessun `npm install` necessario.

### Stile Generale

- Mantieni lo stile del codice esistente — osserva il codice vicino per i pattern
- Usa `const` per impostazione predefinita, `let` quando serve la riassegnazione
- Usa i template literal per l'interpolazione delle stringhe
- Usa nomi di variabili descrittivi
- Commenta solo quando il "perché" non è ovvio dal codice
- `viewer.html` è autonomo — tutti i dati dei prompt sono incorporati come JSON

---

## Processo di Pull Request

1. **Fai il fork** del repository e crea un branch da `main`
2. **Apporta le modifiche** — segui le linee guida sopra
3. **Esegui i test:** `node test/run.js` — tutti i test devono passare
4. **Apri una pull request** con una descrizione chiara di cosa hai modificato e perché

### Linee Guida per le PR

- **Mantieni le PR focalizzate** — una funzionalità o correzione per PR
- **Descrivi la modifica** — cosa, perché e come testarla
- **Includi esempi** — se aggiungi un prompt, mostra un uso di esempio
- **Non rompere il comportamento esistente** — testa manualmente i comandi CLI: `prompt-lib list`, `prompt-lib search`, ecc.

---

## Segnalazione Bug

Apri una issue con:

- **Cosa ti aspettavi** che accadesse
- **Cosa è effettivamente accaduto**
- **Passaggi per riprodurre** il problema
- **Il tuo ambiente:** versione Node.js, sistema operativo, browser (per problemi del Workshop)

---

## Richieste di Funzionalità

Apri una issue descrivendo:

- **Cosa vuoi fare**
- **Perché gli strumenti attuali non lo coprono**
- **Come ti aspetti che funzioni**

---

## Licenza

Contribuendo, accetti che i tuoi contributi saranno licenziati sotto la [Licenza MIT](../../LICENSE).

---

**Navigazione:** [← App Desktop](App-Desktop.md) &nbsp;|&nbsp; [Home](Home.md)
