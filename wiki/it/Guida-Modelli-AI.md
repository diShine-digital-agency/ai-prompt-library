# Guida Modelli AI

> Confronto completo dei modelli AI coperti nella Prompt Library — prezzi, capacità, latenza, limiti di frequenza e guida alla scelta.

**⚠️ Prezzi e disponibilità dei modelli cambiano frequentemente.** Questa guida riflette le informazioni di aprile 2026. Verifica sempre le tariffe aggiornate sulla pagina dei prezzi di ciascun provider prima di fare proiezioni sui costi.

---

## Indice

- [Claude (Anthropic)](#claude-anthropic)
- [GPT (OpenAI)](#gpt-openai)
- [Gemini (Google)](#gemini-google)
- [Llama (Meta)](#llama-meta)
- [Mistral](#mistral)
- [Tabella Comparativa dei Prezzi](#tabella-comparativa-dei-prezzi)
- [Confronto Benchmark per Compito](#confronto-benchmark-per-compito)
- [Confronto Latenza](#confronto-latenza)
- [Limiti di Frequenza](#limiti-di-frequenza)
- [Albero Decisionale: Quale Modello Usare](#albero-decisionale-quale-modello-usare)
- [Strategie di Ottimizzazione dei Costi](#strategie-di-ottimizzazione-dei-costi)
- [Modelli Ritirati](#modelli-ritirati)

---

## Claude (Anthropic)

I modelli Claude eccellono nel seguire le istruzioni, nell'analisi di contesti lunghi, nella scrittura creativa e nella programmazione. Rispondono particolarmente bene ai prompt strutturati con tag XML.

### Modelli Attuali

| Modello | Contesto | Prezzo Input | Prezzo Output | Ideale Per |
|---------|:--------:|:------------:|:-------------:|------------|
| **Opus 4.6** | 1M token | $5.00/M | $25.00/M | Ragionamento profondo, multi-agente, analisi con contesto massivo |
| **Sonnet 4.6** | 200K token | $3.00/M | $15.00/M | Modello bilanciato — programmazione, design, lavoro intellettuale |
| **Haiku 4.5** | 200K token | $1.00/M | $5.00/M | Risposta veloce, qualità quasi di frontiera, alto volume |

### Tecniche Specifiche per Claude

**Tag XML** — Claude tratta i tag XML come contenitori semantici. Pattern ad alto valore:

```xml
<instructions>Primary task definition</instructions>
<context>Background information</context>
<constraints>Hard rules that override other instructions</constraints>
<examples>Input/output examples</examples>
```

**Extended Thinking** — Disponibile su Opus 4.6, consente al modello di "pensare" attraverso problemi complessi prima di rispondere. Attiva un ragionamento più profondo al costo di maggiore latenza e token.

**Tecnica Prefill** — Inizia la risposta di Claude per guidare formato e tono:

```json
{
  "messages": [
    {"role": "user", "content": "Analyze this data..."},
    {"role": "assistant", "content": "{\"analysis\":"}
  ]
}
```

### Quale Claude Scegliere

- **Opus 4.6** — Quando serve il miglior ragionamento in assoluto, per elaborare documenti oltre 200K token, o per flussi di lavoro multi-agente
- **Sonnet 4.6** — Il modello tuttofare — usalo per il 90% dei compiti (programmazione, analisi, scrittura, uso di strumenti)
- **Haiku 4.5** — Classificazione ad alto volume, routing, estrazioni rapide, o dove latenza/costo contano di più

---

## GPT (OpenAI)

I modelli GPT offrono prestazioni eccellenti per uso generale, output strutturati e function calling.

### Modelli Attuali

| Modello | Note |
|---------|------|
| **GPT-5.4** | GPT più capace, modalità "Thinking" disponibile |
| **GPT-5.4 Pro** | Livello di qualità massima, prezzo premium |
| **GPT-5.3 Instant** | ChatGPT predefinito — tuttofare veloce per uso quotidiano |
| **GPT-5.3-Codex** | Modello di programmazione agentico |
| **GPT-5.2-Codex** | Modello di programmazione generazione precedente |

### Tecniche Specifiche per GPT

**Modalità JSON** — Forza l'output a essere JSON valido:

```json
{
  "response_format": { "type": "json_object" }
}
```

**Structured Outputs** — Definisci uno schema JSON esatto che il modello deve seguire:

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

**Function Calling** — Definisci strumenti che il modello può invocare, abilitando un comportamento simile agli agenti con uso strutturato di strumenti.

---

## Gemini (Google)

I modelli Gemini offrono capacità multimodali native, grounding con Google Search ed esecuzione di codice.

### Modelli Attuali

| Modello | Note |
|---------|------|
| **Gemini 3 Pro** | Ragionamento di frontiera, multimodale, agentico |
| **Gemini 3 Flash** | Nuovo predefinito — veloce e capace |
| **Gemini 2.5 Pro** | $1.25/$10.00 per M token, contesto 1M+ — **deprecato giugno 2026** |
| **Gemini 2.5 Flash** | $0.30/$2.50 per M token, contesto 1M — **deprecato giugno 2026** |

### Tecniche Specifiche per Gemini

**Input Multimodale** — Supporto nativo per immagini, video e audio nei prompt. Non serve descrivere il contenuto visivo in testo.

**Grounding con Google Search** — Ancora le risposte ai risultati di ricerca web in tempo reale per informazioni aggiornate.

**Esecuzione di Codice** — Il modello può eseguire codice come parte della risposta, utile per analisi di dati e compiti computazionali.

---

## Llama (Meta)

Modelli open-weight che puoi ospitare autonomamente. Nessun costo API — paghi solo il calcolo.

### Modelli Attuali

| Modello | Parametri | Contesto | Note |
|---------|:---------:|:--------:|------|
| **Llama 4 Scout** | MoE | 10M token | Funziona su singola H100, finestra di contesto 10M |
| **Llama 4 Maverick** | 400B totali (MoE) | Grande | Supera GPT-4o nei benchmark, open-weight |
| **Llama 4 Behemoth** | 2T (MoE) | Grande | Solo anteprima, modello teacher |
| **Llama 3.3** | 70B (denso) | 128K | Il migliore per il fine-tuning, ecosistema maturo |
| **Llama 3.2** | 1B–3B | Varia | Deployment edge/mobile |

### Vantaggi Principali

- **Open-weight** — scarica ed esegui sulla tua infrastruttura
- **Nessun costo API** — solo costi di calcolo (GPU a noleggio o hardware di proprietà)
- **Fine-tuning** — personalizza per il tuo dominio specifico
- **Architettura MoE** (Llama 4) — alto numero di parametri con inferenza efficiente
- **Privacy** — i dati non lasciano mai la tua infrastruttura

### Quando Scegliere Llama

- I dati devono restare sulla tua infrastruttura (normative, privacy)
- Inferenza ad alto volume dove i costi API sarebbero proibitivi
- Fine-tuning per domini specializzati
- Deployment edge/mobile (Llama 3.2)
- Ricerca e sperimentazione

---

## Mistral

Laboratorio di IA europeo che offre una gamma di modelli dal minuscolo al livello di frontiera, con eccellenti rapporti prezzo-prestazioni.

### Modelli Attuali

| Modello | Parametri | Note |
|---------|:---------:|------|
| **Mistral Large 3** | MoE 41B/675B | Punteggio 9.4/10 complessivo, qualità di frontiera |
| **Mistral Medium 3** | — | $0.40/$2.00 per M — **miglior rapporto qualità-prezzo nella sua classe** |
| **Codestral** | — | 86.6% HumanEval, 80+ linguaggi, contesto 256K |
| **Devstral 2** | — | Modello di programmazione agentico |
| **Magistral** | — | Modello focalizzato sul ragionamento |
| **Pixtral** | — | Modello con capacità visive |
| **Ministral 3** | — | Minuscolo, veloce, deployment edge |

### Vantaggi Principali

- **Miglior rapporto prezzo-prestazioni:** Mistral Medium 3 a $0.40/M input offre qualità classe GPT-4 a 1/5 del costo
- **Eccellenza multilingue:** forte nelle lingue europee e globali
- **Architettura MoE:** inferenza efficiente con alto numero di parametri
- **Specializzazione nel codice:** Codestral e Devstral per i flussi di lavoro di sviluppo
- **Sovranità dei dati UE:** opzioni di hosting europeo

---

## Tabella Comparativa dei Prezzi

Prezzi per milione di token (aprile 2026):

| Modello | Input | Output | Contesto | Ideale Per |
|---------|:-----:|:------:|:--------:|------------|
| Claude Opus 4.6 | $5.00 | $25.00 | 1M | Ragionamento profondo, multi-agente |
| Claude Sonnet 4.6 | $3.00 | $15.00 | 200K | Tuttofare bilanciato |
| Claude Haiku 4.5 | $1.00 | $5.00 | 200K | Alto volume, veloce |
| GPT-5.4 | varia | varia | Grande | GPT più capace |
| GPT-5.3 Instant | medio | medio | Grande | Compiti quotidiani |
| Gemini 2.5 Pro | $1.25 | $10.00 | 1M+ | Contesto lungo (deprecato giugno 2026) |
| Gemini 2.5 Flash | $0.30 | $2.50 | 1M | Budget (deprecato giugno 2026) |
| Mistral Medium 3 | $0.40 | $2.00 | Grande | Miglior rapporto qualità-prezzo |
| Llama 4 Maverick | Gratis* | Gratis* | Grande | Self-hosted |
| Llama 4 Scout | Gratis* | Gratis* | 10M | Contesto estremo |

*\*I modelli Llama sono open-weight — paghi solo il calcolo (hosting/noleggio GPU).*

**Sconti API Batch:**
- OpenAI Batch API: 50% di sconto (turnaround 24h)
- Anthropic Batches API: 50% di sconto (turnaround 24h)
- Google Batch API: varia per modello

---

## Confronto Benchmark per Compito

Visione pratica delle prestazioni relative per categoria di compito:

| Compito | Livello 1 (Migliore) | Livello 2 | Livello 3 |
|---------|:--------------------:|:---------:|:---------:|
| **Ragionamento complesso** | Claude Opus 4.6, GPT-5.4 Pro | Gemini 3 Pro, Mistral Large 3 | Llama 4 Maverick, Magistral |
| **Generazione codice** | Claude Sonnet 4.6, GPT-5.3-Codex | Codestral, Devstral 2 | Gemini 3 Flash, Llama 4 Maverick |
| **Seguire istruzioni** | Claude Sonnet/Opus 4.6 | GPT-5.4, Gemini 3 Pro | Mistral Large 3 |
| **Scrittura creativa** | Claude Opus 4.6, GPT-5.4 | Gemini 3 Pro | Mistral Large 3 |
| **Estrazione dati** | GPT-5.4 (structured outputs) | Claude Sonnet 4.6 | Gemini 3 Flash, Mistral Medium 3 |
| **Analisi documenti lunghi** | Claude Opus 4.6 (1M), Llama 4 Scout (10M) | Gemini 3 Pro | GPT-5.4 |
| **Multilingue** | Gemini 3 Pro, Mistral Large 3 | GPT-5.4, Claude 4.6 | Llama 4 |
| **Visione (immagini)** | Gemini 3 Pro, GPT-5.4 | Claude Sonnet 4.6, Pixtral | Llama 4 Maverick |
| **Comprensione video** | Gemini 3 Pro (nativo) | GPT-5.4 | Llama 4 Maverick |
| **Programmazione agentica** | GPT-5.3-Codex, Devstral 2 | Claude Sonnet 4.6 | Codestral |
| **Classificazione (volume)** | Gemini 3 Flash, Mistral Medium 3 | Claude Haiku 4.5 | Ministral 3, Llama 3.2 |
| **Chain-of-thought** | GPT-5.4 Thinking, Magistral | Claude Opus 4.6 (extended thinking) | Gemini 3 Pro |
| **Sicurezza/rifiuto** | Claude (il più prudente) | GPT-5.4 | Gemini, Mistral |

---

## Confronto Latenza

Intervalli approssimativi per richieste tipiche (varia per regione, carico e lunghezza del prompt):

| Fascia del Modello | TTFT (mediana) | Throughput | Esempi |
|-------------------|:--------------:|:----------:|--------|
| **Veloce/economico** | ~150–300ms | ~100–150 tok/s | Gemini 3 Flash, Claude Haiku 4.5, Mistral Medium 3, GPT-5.3 Instant |
| **Bilanciato** | ~300–600ms | ~50–80 tok/s | Claude Sonnet 4.6, GPT-5.4, Gemini 3 Pro, Mistral Large 3 |
| **Frontiera/ragionamento** | ~500–1000ms | ~30–50 tok/s | Claude Opus 4.6, GPT-5.4 Pro, modalità thinking/reasoning |
| **Self-hosted (A100/H100)** | ~200–500ms | ~40–100 tok/s | Llama 4 Scout, Llama 3.3 70B |

TTFT = Time To First Token (tempo al primo token). Queste sono mediane approssimative per orientamento, non SLA.

---

## Limiti di Frequenza

| Provider | Piano Gratuito | Piano a Pagamento (Tipico) | Enterprise |
|----------|:--------------:|:--------------------------:|:----------:|
| **OpenAI** | 3 RPM, 200 RPD | 500–10K RPM | Personalizzato |
| **Anthropic** | 5 RPM, 300 RPD | 1K–4K RPM | Personalizzato |
| **Google** | 15 RPM, 1500 RPD | 360–1000 RPM | Personalizzato |
| **Mistral** | 1 RPM | 100–500 RPM | Personalizzato |

RPM = richieste al minuto, RPD = richieste al giorno. I limiti variano per modello all'interno di ciascun provider.

---

## Albero Decisionale: Quale Modello Usare

```
INIZIO: Qual è il tuo requisito principale?

[I dati devono restare sulla tua infrastruttura?]
  SÌ → Llama 3.3 70B (qualità) o Llama 3.2 3B (edge/mobile)
  NO → continua

[Elaborazione nativa di video o audio?]
  SÌ → Gemini 3 Pro (video/audio nativo)
  NO → continua

[Documenti che superano 200K token?]
  SÌ → Claude Opus 4.6 (1M) o Llama 4 Scout (10M)
  NO → continua

[Serve conformità garantita allo schema JSON?]
  SÌ → GPT-5.4 con structured outputs
  NO → continua

[Ragionamento complesso o scrittura di testi lunghi?]
  SÌ → Claude Sonnet (rapporto qualità-prezzo) o Opus (qualità massima)
  NO → continua

[Alto volume, sensibilità al costo (>10K richieste/giorno)?]
  SÌ → Quanto è complesso?
    Semplice → Gemini Flash o Mistral Medium 3
    Moderato → Claude Haiku 4.5
    Complesso → Claude Sonnet con batching
  NO → continua

[Generazione o revisione del codice?]
  SÌ → Claude Sonnet 4.6, GPT-5.3-Codex o Codestral
  NO → continua

[Predefinito / uso generale]
  Budget → Mistral Medium 3
  Qualità → Claude Sonnet 4.6 o GPT-5.4
  Massimo → Claude Opus 4.6
```

---

## Strategie di Ottimizzazione dei Costi

### Pattern 1: Routing Basato su Classificatore

Usa un modello economico per classificare la complessità della richiesta, poi indirizza al modello appropriato:

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

### Pattern 2: A Cascata (Prova Prima il Più Economico)

```python
response = cheap_model.generate(prompt)

if not passes_quality_check(response):
    response = expensive_model.generate(prompt)  # escalate
```

### Pattern 3: Routing per Tipo di Compito

```python
task_routing = {
    "classification": "gemini-flash",
    "extraction":     "mistral-medium",
    "summarization":  "claude-haiku",
    "reasoning":      "claude-sonnet",
    "code":           "codestral",
}
```

### Risparmi Attesi

Un router ben implementato risparmia il **60–80%** rispetto all'invio di tutto al modello più costoso.

---

## Modelli Ritirati

Non usare questi modelli in nuovi progetti:

| Modello | Stato |
|---------|-------|
| GPT-4o | Ritirato |
| GPT-4.1 | Ritirato |
| GPT-4.1 mini | Ritirato |
| GPT-4 Turbo | Ritirato |
| o4-mini | Ritirato |
| Gemini 2.0 Flash | Ritirato |
| Claude 3.5 Haiku | Ritirato |

---

**Navigazione:** [← Tecniche di Prompting](Tecniche-di-Prompting.md) &nbsp;|&nbsp; [Strumenti: Linter, Optimizer, Recommender →](Strumenti-Linter-Optimizer-Recommender.md)
