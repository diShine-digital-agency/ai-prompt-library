# API e Playground

> Utilizzo dell'AI Playground e della Prompt Library in modo programmatico.

---

## Indice

- [AI Playground (Browser)](#ai-playground-browser)
- [Configurazione delle Chiavi API](#configurazione-delle-chiavi-api)
- [Provider Supportati](#provider-supportati)
- [Tracciamento dell'Utilizzo dei Token](#tracciamento-dellutilizzo-dei-token)
- [Utilizzo Programmatico (JavaScript)](#utilizzo-programmatico-javascript)
- [Riferimento Funzioni API](#riferimento-funzioni-api)

---

## AI Playground (Browser)

L'AI Playground è disponibile nel **Prompt Workshop** (solo browser/desktop — non nella CLI). Ti permette di inviare prompt direttamente ai modelli AI e ottenere risposte, tutto all'interno del browser.

### Come Accedere

1. Apri il Prompt Workshop (`viewer.html` o `prompt-lib viewer`)
2. Clicca sulla scheda **6** (Playground) oppure premi il tasto `6`

### Funzionalità

- **Selettore provider** — scegli tra OpenAI, Anthropic o Google
- **Sovrascrittura modello** — usa un modello specifico al posto di quello predefinito
- **Prompt di sistema** — prompt di sistema opzionale per impostare il contesto
- **Input prompt** — scrivi, incolla o carica un prompt dalla libreria
- **Invia** — invia il prompt all'API del provider selezionato
- **Visualizzazione risposta** — risposta AI formattata con rendering markdown
- **Tracciamento token** — mostra l'utilizzo dei token input/output per ogni richiesta
- **Copia con un clic** — copia la risposta AI negli appunti

### Flusso di Lavoro

1. Configura la tua chiave API nelle Impostazioni (pulsante ⚙) — configurazione una tantum
2. Seleziona un provider (OpenAI, Anthropic o Google)
3. Opzionalmente inserisci un prompt di sistema
4. Scrivi o incolla il tuo prompt
5. Clicca "Invia"
6. Visualizza la risposta AI, l'utilizzo dei token e le informazioni sul modello
7. Copia la risposta o itera

---

## Configurazione delle Chiavi API

Clicca il pulsante **⚙** (ingranaggio) nel Prompt Workshop per aprire le Impostazioni API.

### Campi di Configurazione

| Campo | Descrizione |
|-------|-------------|
| **Provider** | Provider attivo: OpenAI, Anthropic o Google |
| **Chiave API OpenAI** | La tua chiave API OpenAI (inizia con `sk-`) |
| **Chiave API Anthropic** | La tua chiave API Anthropic (inizia con `sk-ant-`) |
| **Chiave API Google** | La tua chiave API Google AI Studio |
| **Modello** | Sovrascrittura opzionale del modello per ogni provider |

### Sicurezza

- **Le chiavi sono memorizzate nel `localStorage`** — non lasciano mai il tuo browser
- Le chiavi vengono inviate direttamente dal tuo browser all'API del provider (nessun server intermedio)
- Le chiavi sono memorizzate sotto la chiave `api_settings` del localStorage
- Per cancellare le chiavi: Impostazioni → elimina i campi delle chiavi, oppure cancella il localStorage del browser

### Ottenere le Chiavi API

| Provider | Dove Ottenere la Chiave |
|----------|------------------------|
| **OpenAI** | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| **Anthropic** | [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) |
| **Google** | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |

---

## Provider Supportati

### OpenAI

| Impostazione | Valore Predefinito |
|-------------|-------------------|
| **Modello predefinito** | `gpt-4o-mini` |
| **Endpoint API** | `https://api.openai.com/v1/chat/completions` |
| **Header di autenticazione** | `Authorization: Bearer <key>` |
| **Temperature** | 0.7 (playground), 0.3 (optimizer) |
| **Max token** | 4000 (playground), 2000 (optimizer) |

**Formato dei messaggi:**
```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {"role": "system", "content": "System prompt here"},
    {"role": "user", "content": "User prompt here"}
  ]
}
```

### Anthropic

| Impostazione | Valore Predefinito |
|-------------|-------------------|
| **Modello predefinito** | `claude-sonnet-4-20250514` |
| **Endpoint API** | `https://api.anthropic.com/v1/messages` |
| **Header di autenticazione** | `x-api-key: <key>` |
| **Versione API** | `2023-06-01` |
| **Temperature** | 0.7 (playground), 0.3 (optimizer) |
| **Max token** | 4000 (playground), 2000 (optimizer) |

**Formato dei messaggi:**
```json
{
  "model": "claude-sonnet-4-20250514",
  "system": "System prompt here",
  "messages": [
    {"role": "user", "content": "User prompt here"}
  ]
}
```

### Google

| Impostazione | Valore Predefinito |
|-------------|-------------------|
| **Modello predefinito** | `gemini-2.0-flash` |
| **Endpoint API** | `https://generativelanguage.googleapis.com/v1beta/models/<model>:generateContent` |
| **Autenticazione** | Chiave API nel parametro di query dell'URL |
| **Temperature** | 0.7 (playground), 0.3 (optimizer) |
| **Max token** | 4000 (playground), 2000 (optimizer) |

**Formato dei messaggi:**
```json
{
  "contents": [
    {"parts": [{"text": "System prompt + user prompt"}]}
  ],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 4000
  }
}
```

> **Nota:** L'API di Google combina il prompt di sistema e quello utente in un unico blocco di contenuto.

---

## Tracciamento dell'Utilizzo dei Token

Il Playground traccia l'utilizzo dei token per ogni richiesta:

| Provider | Informazioni Token Disponibili |
|----------|:-----------------------------:|
| **OpenAI** | ✅ Token input, token output, totale |
| **Anthropic** | ✅ Token input, token output |
| **Google** | ❌ Non fornito dall'API |

Il conteggio dei token viene visualizzato dopo ogni risposta, aiutandoti a monitorare i costi e ottimizzare la lunghezza del prompt.

---

## ⚖ Confronto Multi-Modello (v2.4.0)

Invia lo stesso prompt a tutti i provider configurati simultaneamente e confronta le risposte affiancate.

**Come usarlo:**
1. Configura 2+ chiavi API tramite ⚙ Impostazioni
2. Scrivi il prompt nel Playground
3. Clicca **"⚖ Confronta (N modelli)"**
4. I risultati appaiono in una griglia: testo della risposta, tempi, utilizzo token, pulsante copia

**Dettagli tecnici:**
- Usa `Promise.allSettled()` — il fallimento di un provider non blocca gli altri
- Ogni richiesta ha un timeout di 30 secondi tramite AbortController
- Il pulsante Invia è disabilitato durante il confronto

## Sicurezza (v2.4.0)

- Tutte le chiamate API impongono un **timeout di 30 secondi** tramite AbortController
- Il modale Impostazioni API mostra un **avviso di sicurezza** sulla memorizzazione in chiaro nel localStorage
- Le chiavi API non vengono mai inviate altrove se non all'endpoint del provider selezionato

---

## Utilizzo Programmatico (JavaScript)

La Prompt Library può essere importata e usata in modo programmatico nei tuoi progetti JavaScript/Node.js.

### Installazione

```bash
npm install @dishine/prompt-library
```

### Modulo Principale — Caricamento e Ricerca dei Prompt

```javascript
import {
  loadPrompts,
  findPlaceholders,
  extractTemplate,
  saveCustomPrompt,
  loadSavedCompositions,
  saveComposition,
  loadCustomPrompts
} from '@dishine/prompt-library';

// Load all 82+ prompts
const prompts = loadPrompts();
console.log(`Loaded ${prompts.length} prompts`);

// Find placeholders in a template
const template = '{{role}} should {{task}} for {{audience}}';
const placeholders = findPlaceholders(template);
// → ['{{role}}', '{{task}}', '{{audience}}']

// Extract the template section from a prompt's content
const prompt = prompts.find(p => p.slug === 'code-review');
const tmpl = extractTemplate(prompt.content);
```

### Modulo di Ricerca

```javascript
import { searchPrompts } from '@dishine/prompt-library/src/search.js';

const prompts = loadPrompts();
const results = searchPrompts(prompts, 'chain of thought');

for (const r of results) {
  console.log(`${r.slug} (score: ${r.score})`);
}
```

### Modulo Generatore

```javascript
import {
  generatePrompt,
  getFrameworks,
  getFramework
} from '@dishine/prompt-library/src/generator.js';

// List available frameworks
const frameworks = getFrameworks();
frameworks.forEach(fw => {
  console.log(`${fw.key}: ${fw.name} — ${fw.description}`);
});

// Generate a prompt from a framework
const result = generatePrompt('expert-role', {
  role: 'senior data analyst',
  experience: '10+ years',
  domain: 'financial services',
  task: 'Analyze quarterly revenue trends and identify anomalies',
  audience: 'executive team',
  tone: 'professional',
  constraints: 'Use only provided data, cite specific numbers',
  output_format: 'structured markdown with tables'
});

console.log(result);
```

### Modulo Linter

```javascript
import { lintPrompt, formatLintResult } from '@dishine/prompt-library/src/linter.js';

const result = lintPrompt('Write me something good about dogs');
console.log(`Score: ${result.score}/100 (Grade: ${result.grade})`);
console.log(`Passed: ${result.passedCount}/${result.totalRules}`);

// Human-readable output
console.log(formatLintResult(result));
```

### Modulo Optimizer

```javascript
import { optimizePrompt } from '@dishine/prompt-library/src/optimizer.js';

const result = optimizePrompt('Can you help me write a blog post about AI?');
console.log(`Score: ${result.scoreBefore} → ${result.scoreAfter}`);
console.log(`Domain: ${result.domain}`);
console.log('Changes:', result.changes);
console.log('Optimized:', result.optimized);
```

### Modulo Recommender

```javascript
import { buildRecommendation } from '@dishine/prompt-library/src/recommender.js';

const prompts = loadPrompts();
const rec = buildRecommendation(prompts, 'I need to build a REST API');

console.log('Suggested combo:');
if (rec.suggestedCombo.systemPrompt) {
  console.log(`  System: ${rec.suggestedCombo.systemPrompt.title}`);
}
if (rec.suggestedCombo.framework) {
  console.log(`  Framework: ${rec.suggestedCombo.framework.title}`);
}
if (rec.suggestedCombo.template) {
  console.log(`  Template: ${rec.suggestedCombo.template.title}`);
}
```

---

## Riferimento Funzioni API

### `sendToAI(prompt, systemPrompt, provider, apiKey, model)`

Invia un prompt a un modello AI e restituisce la risposta. Usato dal Playground.

**Parametri:**

| Parametro | Tipo | Obbligatorio | Descrizione |
|-----------|------|:------------:|-------------|
| `prompt` | string | ✅ | Il prompt utente da inviare |
| `systemPrompt` | string | ❌ | Prompt di sistema opzionale |
| `provider` | string | ✅ | `'openai'`, `'anthropic'` o `'google'` |
| `apiKey` | string | ✅ | Chiave API per il provider |
| `model` | string | ❌ | Sovrascrittura modello (usa il predefinito del provider se omesso) |

**Ritorna:**

```javascript
{
  text: "AI response text",
  model: "model-name",
  usage: { prompt_tokens: 50, completion_tokens: 200, total_tokens: 250 }
  // usage is null for Google provider
}
```

### `optimizeWithAI(text, provider, apiKey, model)`

Invia un prompt a un modello AI per una riscrittura professionale. Restituisce solo il testo del prompt ottimizzato.

**Parametri:**

| Parametro | Tipo | Obbligatorio | Descrizione |
|-----------|------|:------------:|-------------|
| `text` | string | ✅ | Il prompt da ottimizzare |
| `provider` | string | ✅ | `'openai'`, `'anthropic'` o `'google'` |
| `apiKey` | string | ✅ | Chiave API |
| `model` | string | ❌ | Sovrascrittura modello |

**Ritorna:** `string` — il testo del prompt ottimizzato.

L'ottimizzatore basato su IA usa un prompt di sistema accuratamente preparato che istruisce il modello a:
1. Mantenere l'intento e il significato originale
2. Aggiungere struttura con sezioni chiare
3. Rendere le istruzioni più specifiche
4. Aggiungere vincoli e verifica della qualità
5. Rimuovere il linguaggio vago
6. Restituire solo il prompt ottimizzato (nessun commento)

---

**Navigazione:** [← Strumenti: Linter, Optimizer, Recommender](Strumenti-Linter-Optimizer-Recommender) &nbsp;|&nbsp; [Architettura →](Architettura)
