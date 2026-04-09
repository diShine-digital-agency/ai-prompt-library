# Strumenti: Linter, Optimizer, Recommender

> Approfondimento sui tre strumenti di qualità — come funzionano, i loro sistemi di punteggio e come ottenere il massimo.

---

## Indice

- [Prompt Linter](#prompt-linter)
- [Prompt Optimizer](#prompt-optimizer)
- [Smart Recommender](#smart-recommender)

---

## Prompt Linter

**CLI:** `prompt-lib lint`
**Workshop:** scheda Strumenti → Linter
**Sorgente:** [`src/linter.js`](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/src/linter.js)

Il Prompt Linter analizza qualsiasi prompt rispetto a **14 regole di qualità** e produce un punteggio da 0 a 100, un voto in lettere (A–F) e suggerimenti prioritizzati per il miglioramento.

### Tutte le 14 Regole

| # | ID Regola | Nome Regola | Peso | Cosa Controlla |
|---|-----------|-------------|:----:|----------------|
| 1 | `has-role` | Definizione del ruolo | 10 | Il prompt specifica chi deve essere l'IA (`you are`, `act as`, `role:`, `persona:`) |
| 2 | `has-task` | Compito chiaro | 12 | Il prompt indica cosa deve fare l'IA (`task:`, `your job`, `please create/write/generate`) |
| 3 | `has-context` | Contesto fornito | 8 | Informazioni di contesto sono incluse (`context:`, `background:`, `given that`) |
| 4 | `has-output-format` | Formato output specificato | 10 | Il formato di output atteso è definito (`output format:`, `respond in`, `use markdown/json`) |
| 5 | `has-constraints` | Vincoli o regole | 8 | Regole e limiti sono definiti (`rule`, `never`, `always`, `do not`, `must not`) |
| 6 | `sufficient-length` | Dettaglio sufficiente | 8 | Il prompt è lungo almeno 50 parole |
| 7 | `not-too-long` | Non eccessivamente lungo | 5 | Il prompt è sotto le 2000 parole |
| 8 | `has-examples` | Esempi inclusi | 7 | Esempi dell'output atteso sono forniti (`example:`, `for example`, `such as`) |
| 9 | `has-sections` | Sezioni strutturate | 7 | Il prompt ha 2+ intestazioni o sezioni etichettate (`## Header` o `LABEL:`) |
| 10 | `no-vague-language` | Linguaggio specifico | 7 | Usa 3 o meno parole vaghe (`good`, `nice`, `proper`, `appropriate`) |
| 11 | `has-audience` | Pubblico di destinazione | 5 | Specifica chi leggerà l'output (`audience:`, `for a beginner/expert/developer`) |
| 12 | `has-tone` | Tono specificato | 5 | Definisce lo stile comunicativo (`tone:`, `be professional/casual/technical`) |
| 13 | `no-please-overuse` | Non eccessivamente cortese | 3 | Usa "please" 2 volte o meno |
| 14 | `has-quality-check` | Passaggio di verifica qualità | 5 | Chiede all'IA di verificare il proprio lavoro (`verify`, `check your`, `double-check`, `ensure accuracy`) |

### Formula del Punteggio

```
score = (sum of passed rule weights / total weight) × 100
```

**Peso totale:** 100 (somma di tutti i 14 pesi: 10+12+8+10+8+8+5+7+7+7+5+5+3+5)

### Scala dei Voti

| Voto | Intervallo | Significato |
|:----:|:----------:|-------------|
| **A** | 90–100 | Eccellente — prompt pronto per la produzione |
| **B** | 75–89 | Buono — miglioramenti minori possibili |
| **C** | 60–74 | Accettabile — diverse aree da migliorare |
| **D** | 40–59 | Sotto la media — problemi significativi |
| **F** | 0–39 | Scarso — necessita rielaborazione importante |

### Esempio: Analisi di un Prompt Scadente

**Prompt in input:**
```
Can you please help me write something good about dogs? Please make it nice
and interesting. Please include some good information.
```

**Risultato dell'analisi:**
```
Score: 15/100 (Grade: F)
Rules: 2/14 passed | 23 words

✅ Passing:
   • Not excessively long
   • Specific language

💡 Suggestions to improve:
   → State the task explicitly: "Your task is to…"
   → Add a role definition like "You are a senior [role] expert…"
   → Specify the output format: "Respond in [format]"
   → Add context: "Context: …" or "Given the following information: …"
   → Add constraints: "Rules: …" or "Never do X" / "Always do Y"
   → Your prompt is quite short. Add more detail about what you want.
   → Add examples of expected input/output to guide the AI.
   → Organize your prompt with clear sections using headers or labels.
   → Specify the target audience: "This is for [audience]…"
   → Define the tone: "Use a [professional/casual/technical] tone."
   → Reduce "please" usage — direct instructions work better with AI.
   → Add a quality check: "Before responding, verify that…"
```

### Consigli per Punteggi Più Alti

- Aggiungi una definizione di ruolo (10 punti): `"You are a senior content writer"`
- Indica il compito chiaramente (12 punti): `"Your task is to write a 500-word blog post"`
- Specifica il formato di output (10 punti): `"Respond in markdown with headings"`
- Aggiungi vincoli (8 punti): `"Never make up statistics"`
- Aggiungi contesto (8 punti): `"Context: This is for a pet adoption website"`
- Scrivi almeno 50 parole (8 punti)
- Includi esempi (7 punti)
- Usa intestazioni di sezione (7 punti)

### Rilevamento Tipo di Prompt (v2.4.0)

Il linter rileva automaticamente il tipo di prompt e adegua i pesi delle regole:

| Tipo | Rilevamento | Modifiche ai pesi |
|------|-------------|-------------------|
| 🎨 Immagine | Parole chiave: image, photo, visual, dall-e, midjourney... | Salta audience, tone, quality-check. Aumenta vague-language (×1.5) |
| 💻 Codice | Parole chiave: code, function, class, api, debug... | Aumenta task, context, output-format, constraints (×1.2) |
| 🤖 Sistema | Parole chiave: you are, act as, persona... + lunghezza < 800 | Aumenta role (×1.5), constraints (×1.5). Rilassa length (×0.5) |
| 📝 Generale | Predefinito | Tutti i pesi a ×1.0 |

> Per la tabella completa dei moltiplicatori, vedi [INFRASTRUCTURE.md](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/INFRASTRUCTURE.md#3-prompt-type-detection).

---

## Prompt Optimizer

**CLI:** `prompt-lib optimize`
**Workshop:** scheda Strumenti → Optimizer
**Sorgente:** [`src/optimizer.js`](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/src/optimizer.js)

Il Prompt Optimizer riscrive i prompt usando un'analisi consapevole del contenuto. Rileva il dominio, il pubblico e l'intento, poi applica miglioramenti mirati specifici per il contenuto effettivo del prompt.

### Due Modalità

| Modalità | Come Funziona | Requisiti | Velocità |
|----------|---------------|-----------|:--------:|
| **Istantanea (offline)** | Ottimizzazione basata su regole tramite pipeline integrata | Nessuno | Istantanea |
| **Basata su IA** | Invia il prompt a GPT/Claude/Gemini per riscrittura professionale | Chiave API | 2–10s |

### Pipeline di Ottimizzazione Istantanea

L'ottimizzatore elabora il prompt attraverso questi passaggi in ordine:

```
Prompt in input
    │
    ├── 1. Rilevamento del dominio (7 domini)
    ├── 2. Rimozione del riempitivo (frasi ridondanti)
    ├── 3. Riduzione della cortesia (eccesso di "please")
    ├── 4. Rafforzamento dei verbi deboli (tentennamento → direttive)
    ├── 5. Sostituzione del linguaggio vago (termini specifici)
    ├── 6. Decomposizione dei compiti composti (multi-task → passaggi)
    ├── 7. Inserimento del ruolo specifico per dominio
    ├── 8. Rilevamento del pubblico e impostazione del tono
    ├── 9. Aggiunta dei vincoli (specifici per dominio)
    ├── 10. Specifica del formato di output
    ├── 11. Segnaposto per gli esempi
    └── 12. Passaggio di verifica qualità
    │
    ▼
Prompt ottimizzato + punteggi prima/dopo + log delle modifiche
```

### Rilevamento del Dominio

L'ottimizzatore analizza le parole chiave per identificare uno dei 7 domini:

| Dominio | Parole Chiave Esempio | Ruolo Assegnato Automaticamente |
|---------|----------------------|--------------------------------|
| **Programmazione** | code, programming, api, debug, refactor, javascript, python | Senior software engineer with deep expertise in software architecture |
| **Scrittura** | write, blog, article, essay, email, content, draft | Experienced content strategist and professional writer |
| **Marketing** | marketing, seo, social media, campaign, conversion, funnel | Senior marketing strategist with expertise in digital marketing |
| **Dati** | data, analysis, sql, dashboard, statistics, ml, pipeline | Senior data analyst with expertise in statistical analysis |
| **Business** | business, proposal, strategy, stakeholder, budget, revenue | Experienced business consultant with expertise in strategic planning |
| **Formazione** | teach, explain, student, course, lesson, simplify | Experienced educator skilled at breaking down complex concepts |
| **Immagini** | image, photo, visual, design, logo, midjourney, dall-e | Expert visual artist and AI image prompt engineer |

Ogni dominio fornisce:
- Un ruolo esperto specifico (invece del generico "helpful assistant")
- Vincoli rilevanti per il dominio
- Formato di output appropriato
- Controlli di qualità specifici per il dominio
- Segnaposto per gli esempi

### Parole di Riempimento Rimosse

L'ottimizzatore elimina queste espressioni di riempimento:
- `basically`, `essentially`, `actually`, `literally`, `honestly`
- `obviously`, `clearly`, `simply put`, `in other words`
- `as you know`, `it goes without saying`, `needless to say`
- `I think`, `I believe`, `I feel like`, `in my opinion`

### Verbi Deboli Rafforzati

Questi pattern di tentennamento vengono rimossi o sostituiti con istruzioni dirette:

| Prima | Dopo |
|-------|------|
| "Can you write..." | "Write..." |
| "Could you create..." | "Create..." |
| "I want you to..." | (rimosso, segue istruzione diretta) |
| "I need you to..." | (rimosso) |
| "Try to..." | (rimosso) |
| "Maybe..." | (rimosso) |
| "If possible..." | (rimosso) |
| "Just..." | (rimosso) |
| "Kind of..." | (rimosso) |
| "Sort of..." | (rimosso) |

### Sostituzioni del Linguaggio Vago

| Vago | Sostituito Con |
|------|---------------|
| "a good way" | "an effective, well-reasoned way" |
| "make it good" | "ensure it is clear, thorough, and well-structured" |
| "something nice" | "a polished, professional result" |
| "properly" | "correctly and following established standards" |
| "appropriate" | "suitable for the stated context and audience" |
| "interesting" | "insightful and thought-provoking" |
| "as much as possible" | "comprehensively, covering all key aspects" |
| "etc." | "and related items" |
| "stuff" | "components" |
| "things" | "elements" |

### Esempio: Prima e Dopo

**Prima (Punteggio: 35/100, Voto: F):**
```
Can you please help me write a good blog post about machine learning?
Please make it interesting and cover the basics. I want you to maybe
include some good examples if possible. Thanks!
```

**Dopo (Punteggio: 88/100, Voto: B):**
```
You are an experienced content strategist and professional writer with
expertise in clear, engaging communication.

TASK:
Write a blog post about machine learning. Cover the basics. Include
insightful and thought-provoking examples.

TARGET AUDIENCE:
This is for beginners.

TONE:
Be clear, engaging, and well-paced.

OUTPUT FORMAT:
Respond in well-structured prose with clear headings, short paragraphs,
and a logical narrative flow. Use markdown formatting.

RULES:
- Use clear, concise language appropriate to the target audience
- Maintain a consistent tone and voice throughout
- Structure content with logical flow and smooth transitions
- Support claims with specific details or examples

Before responding, verify that the writing is clear, free of jargon,
logically structured, and engaging for the target audience.
```

**Modifiche apportate:**
- Rimosse le parole di riempimento e le frasi ridondanti
- Sostituito il linguaggio esitante con istruzioni dirette
- Sostituito il linguaggio vago con termini specifici
- Aggiunto il ruolo specifico per il dominio (scrittura)
- Organizzato il prompt in sezioni etichettate chiare
- Aggiunto il formato di output specifico per la scrittura
- Aggiunti vincoli di qualità specifici per la scrittura
- Aggiunto il passaggio di verifica della qualità

### Vista Differenze (v2.4.0)

Dopo l'ottimizzazione, alterna tra:
- **Ottimizzato** — prompt ottimizzato pulito
- **Vista Diff** — confronto colorato riga per riga (🟢 aggiunto, 🔴 rimosso, senza marcatore = invariato)

---

## Smart Recommender

**CLI:** `prompt-lib recommend <query>`
**Workshop:** scheda Strumenti → Recommender
**Sorgente:** [`src/recommender.js`](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/src/recommender.js)

Lo Smart Recommender analizza la tua descrizione in linguaggio naturale e suggerisce i prompt migliori dalla libreria, includendo una combinazione ottimale.

### Come Funziona

```
Descrizione dell'utente
    │
    ├── 1. Estrazione dei termini (suddivisione in parole ricercabili)
    ├── 2. Rilevamento dell'intento (mappatura su 8 categorie di intento)
    ├── 3. Punteggio dei prompt (corrispondenza dei termini con tutti i prompt)
    ├── 4. Bonus intento (potenziamento dei prompt nelle categorie corrispondenti)
    └── 5. Costruzione della combinazione (prompt di sistema + framework + template)
    │
    ▼
Prime 8 corrispondenze + combinazione suggerita
```

### Sistema di Punteggio

Per ogni prompt nella libreria, il recommender calcola un punteggio di pertinenza:

| Posizione della Corrispondenza | Punti per Termine |
|-------------------------------|:-----------------:|
| Titolo | 20 |
| Tag | 15 |
| Categoria | 10 |
| Contenuto | 3 |

I prompt nelle categorie che corrispondono all'intento rilevato ricevono un bonus.

### 8 Categorie di Intento

| Intento | Parole Chiave di Attivazione |
|---------|------------------------------|
| **Programmazione** | code, programming, developer, software, api, debug, refactor, test, git, deploy |
| **Scrittura** | write, blog, article, copy, content, essay, email, letter, documentation |
| **Marketing** | marketing, seo, social media, campaign, ads, brand, landing page, conversion |
| **Dati** | data, analysis, sql, database, dashboard, report, statistics, visualization, etl |
| **Business** | business, proposal, meeting, stakeholder, strategy, okr, pitch, client, project |
| **Immagini** | image, photo, visual, design, logo, illustration, portrait, scene, art |
| **Ricerca** | research, analyze, investigate, study, compare, evaluate, review |
| **Didattica** | teach, explain, tutor, learn, student, course, education |

### Formato dell'Output

Il recommender restituisce:

1. **Primi 8 prompt corrispondenti** — ordinati per punteggio di pertinenza
2. **Combinazione suggerita** — la migliore combinazione di:
   - 🧠 **Prompt di sistema** — prompt di sistema con punteggio più alto
   - 🔧 **Framework** — framework con punteggio più alto
   - 📝 **Template** — template di dominio con punteggio più alto
3. **Risultati categorizzati** — primi 3 prompt di sistema, primi 3 framework, primi 5 template

### Esempio

**Query:** "I need to build a REST API with authentication"

**Output:**
```
Suggested combination:

  🧠 System prompt:  Coding Assistant (coding-assistant)
  🔧 Framework:      Chain-of-Thought (chain-of-thought)
  📝 Template:       API Design (api-design)

Top matching prompts:

  API Design
    slug: api-design | category: development | score: 68
  System Design
    slug: system-design | category: development | score: 43
  Coding Assistant
    slug: coding-assistant | category: system-prompts | score: 38
  ...
```

### Consigli per Raccomandazioni Migliori

- **Sii descrittivo:** "I need to write marketing emails for a SaaS product" > "email help"
- **Includi parole chiave del dominio:** "data analysis SQL dashboard" attiva l'intento dati
- **Menziona l'obiettivo finale:** "create a landing page that converts" > "make a web page"
- **Combina contesti:** "code review for Python REST API" attiva sia programmazione che sviluppo

---

**Navigazione:** [← Guida Modelli AI](Guida-Modelli-AI) &nbsp;|&nbsp; [API e Playground →](API-e-Playground)
