# Prompt Workshop

> Guida completa al Prompt Workshop interattivo nel browser (`viewer.html`).

---

## Panoramica

Il **Prompt Workshop** è un'applicazione HTML a pagina singola autonoma che fornisce un'interfaccia visuale all'intera AI Prompt Library. Funziona:

- **Offline** — nessuna connessione internet necessaria
- **Senza server** — basta aprire il file HTML direttamente
- **Senza Node.js** — puro HTML, CSS e JavaScript vanilla
- **Su qualsiasi dispositivo** — browser desktop, tablet o mobile

### Come Aprirlo

```bash
# Opzione 1: Dalla CLI (inserisce i dati più recenti dei prompt)
prompt-lib viewer

# Opzione 2: Apri direttamente in qualsiasi browser
open viewer.html          # macOS
xdg-open viewer.html      # Linux
start viewer.html         # Windows
```

Il Workshop offre tutto ciò che fa la CLI, più un AI Playground visuale, modalità scura/chiara, scorciatoie da tastiera, gestione de La Mia Libreria e molto altro.

---

## Le 7 Schede

### Scheda 1: Sfoglia

La scheda predefinita. Cerca, filtra ed esplora tutti gli 82+ prompt.

**Funzionalità:**
- **Barra di ricerca** — ricerca in tempo reale su titoli, tag, categorie e contenuto (oppure premi `Ctrl+K`)
- **Filtro per categoria** — filtra per una qualsiasi delle 8 categorie
- **Filtro per difficoltà** — filtra per principiante, intermedio o avanzato
- **Schede dei prompt** — ogni scheda mostra titolo, categoria, difficoltà, tag e modelli compatibili
- **Compilazione rapida** — clicca su un prompt per aprirlo, poi compila i `{{segnaposto}}` in modo interattivo
- **Barra di progresso** — mostra l'avanzamento della compilazione dei segnaposto
- **Anteprima dal vivo** — visualizza il prompt compilato aggiornato in tempo reale
- **Pulsante Copia** — copia il prompt compilato con un solo clic

**Come Funziona la Compilazione Rapida:**
1. Clicca su una scheda di prompt per selezionarlo
2. La sezione template viene estratta e i `{{segnaposto}}` vengono rilevati
3. Compaiono campi di input per ogni segnaposto
4. Mentre digiti, l'anteprima si aggiorna dal vivo
5. Una barra di progresso mostra quanti campi sono compilati
6. Clicca "Copia" per copiare il risultato, oppure salvalo ne La Mia Libreria

---

### Scheda 2: Compose

Combina più prompt in un unico prompt composito potente.

**Flusso di lavoro:**
1. **Prompt di sistema** — seleziona una persona (es. Coding Assistant, Research Assistant, Data Analyst). Imposta il ruolo e le regole comportamentali dell'IA.
2. **Framework** — seleziona una tecnica di ragionamento (es. Chain-of-Thought, Few-Shot Patterns, Tree-of-Thought). Aggiunge un pensiero strutturato.
3. **Template di compito** — seleziona un template specifico per dominio (es. Code Review, SQL Query Builder, Landing Page Copy). Definisce il compito effettivo.
4. **Compila i segnaposto** — eventuali `{{segnaposto}}` nei tre livelli vengono rilevati e presentati per la compilazione.
5. **Anteprima e Copia** — visualizza il risultato composto e copialo con un clic.
6. **Salva** — opzionalmente salva la composizione ne La Mia Libreria.

Il prompt composto segue questa struttura:
```
# SYSTEM PROMPT
[Selected system prompt content]

# REASONING FRAMEWORK
[Selected framework content]

# TASK TEMPLATE
[Selected task template content]
```

---

### Scheda 3: Create

Crea prompt di sistema personalizzati con campi dinamici partendo da zero.

**Funzionalità:**
- **Template Iniziali (v2.4.0)** — 6 scheletri predefiniti (Assistente Esperto, Content Writer, Generatore di Codice, Analista Dati, Strategist Marketing, Prompt Immagine) — clicca per pre-compilare, poi personalizza
- **Costruttore di campi** — definisci campi dinamici che diventano segnaposto `{{nome_campo}}`
- **Metadati dei campi** — ogni campo ha un nome e una descrizione
- **Editor del prompt** — scrivi il corpo del prompt usando i campi definiti
- **Anteprima dal vivo** — visualizza il prompt finale con i segnaposto evidenziati
- **Metadati** — imposta titolo, categoria, tag, difficoltà e modelli compatibili
- **Salva** — i prompt personalizzati vengono salvati ne La Mia Libreria e appaiono insieme ai prompt integrati

**Esempio:**
```
Title: Technical Blog Writer
Category: custom
Fields:
  - topic: The subject of the blog post
  - audience: Target audience (beginner/expert)
  - word_count: Target word count

Template:
Write a {{word_count}}-word technical blog post about {{topic}}
for {{audience}} audience...
```

---

### Scheda 4: Generate

Crea prompt dinamicamente usando 5 framework integrati. Ogni framework pone domande guidate e produce un prompt pronto per la produzione.

**Framework Disponibili:**

| Framework | Descrizione | Domande Chiave |
|-----------|-------------|----------------|
| **Expert Role-Based** | Persona esperta con regole e vincoli | Ruolo, dominio, compito, pubblico, tono, formato di output |
| **Chain-of-Thought** | Ragionamento passo dopo passo obbligatorio | Compito, dominio, passaggi di ragionamento, output, includere esempi |
| **Structured Output** | Template di output coerente e formattato | Compito, descrizione input, campi di output, formato |
| **Task Decomposition** | Scomposizione di compiti complessi in sotto-compiti | Compito, contesto, deliverable, criteri di qualità |
| **Guardrails & Safety** | Regole di sicurezza e vincoli sull'output | Ruolo, compito, argomenti consentiti, argomenti vietati, escalation |

**Flusso di lavoro:**
1. Seleziona un framework
2. Rispondi alle domande guidate (i campi obbligatori sono contrassegnati)
3. Clicca "Genera" per produrre il prompt
4. Visualizza l'anteprima del risultato
5. Copia o salva ne La Mia Libreria

---

### Scheda 5: Strumenti

Tre strumenti di qualità in un'unica scheda — passa dall'uno all'altro usando le sotto-schede.

#### Linter

Analizza il tuo prompt rispetto a 14 regole di qualità. Produce un punteggio (0–100), un voto in lettere (A–F), regole superate/non superate e suggerimenti prioritizzati.

- Incolla qualsiasi prompt nell'area di testo
- Clicca "Lint" per analizzare
- I risultati mostrano le regole ✅ superate e i suggerimenti 💡 di miglioramento
- Le regole sono ordinate per impatto (i fallimenti con peso maggiore per primi)

**Rilevamento Tipo di Prompt (v2.4.0):** Il linter rileva automaticamente il tipo di prompt (🎨 Immagine, 💻 Codice, 🤖 Sistema, 📝 Generale) e adegua i pesi delle regole. I prompt per immagini saltano regole irrilevanti come pubblico/tono; i prompt per codice pesano di più i vincoli.

Consulta [Strumenti: Linter, Optimizer, Recommender](Strumenti-Linter-Optimizer-Recommender) per l'elenco completo delle regole.

#### Optimizer

Riscrive il tuo prompt usando l'ottimizzazione consapevole del contenuto. Due modalità:

| Modalità | Come Funziona | Requisiti |
|----------|---------------|-----------|
| **Istantanea** | Ottimizzazione offline basata su regole. Rileva il dominio, rimuove il riempitivo, rafforza i verbi, aggiunge struttura. | Nessuno |
| **Basata su IA** | Invia il prompt a GPT/Claude/Gemini per una riscrittura professionale. | Chiave API (impostata in ⚙ Impostazioni) |

Mostra i punteggi prima/dopo, tutte le modifiche apportate e il dominio rilevato.

**Vista Differenze (v2.4.0):** Alterna tra "Ottimizzato" (risultato pulito) e "Vista Diff" (confronto colorato prima/dopo: verde = aggiunto, rosso barrato = rimosso).

#### Recommender

Descrivi ciò di cui hai bisogno in linguaggio naturale e il Recommender suggerisce i prompt migliori dalla libreria, includendo una combinazione ottimale di prompt di sistema + framework + template.

- Digita una descrizione (es. "I need to write marketing emails")
- Clicca "Recommend"
- Visualizza i primi 8 prompt corrispondenti ordinati per pertinenza
- Ottieni una combinazione suggerita (prompt di sistema + framework + template)

---

### Scheda 6: Playground

Invia prompt direttamente ai modelli AI e ottieni risposte — tutto all'interno del browser.

**Provider Supportati:**

| Provider | Modello Predefinito | Header |
|----------|--------------------|--------|
| **OpenAI** | `gpt-4o-mini` | `Authorization: Bearer` |
| **Anthropic** | `claude-sonnet-4-20250514` | `x-api-key` |
| **Google** | `gemini-2.0-flash` | Chiave API nell'URL |

**Funzionalità:**
- **Selettore provider** — passa tra OpenAI, Anthropic e Google
- **Campo prompt di sistema** — prompt di sistema opzionale per il contesto
- **Input prompt** — scrivi o incolla il tuo prompt
- **Pulsante Invia** — invia il prompt e visualizza la risposta
- **Tracciamento token** — mostra l'utilizzo dei token input/output per ogni richiesta
- **Copia con un clic** — copia la risposta dell'IA
- **⚖ Confronto Multi-Modello (v2.4.0)** — configura 2+ chiavi API, clicca "Confronta" per inviare lo stesso prompt a tutti i provider simultaneamente. I risultati appaiono affiancati con tempi, token e pulsanti di copia.
- **Visualizzazione risposta** — risposta dell'IA formattata con rendering markdown

Le chiavi API sono memorizzate nel `localStorage` — non lasciano mai il tuo browser.

---

### Scheda 7: La Mia Libreria

Gestisci tutti i prompt salvati, le composizioni e i prompt personalizzati.

**Funzionalità:**
- **Cerca, Filtra e Ordina (v2.4.0)** — cerca per titolo/contenuto, filtra per tipo (Preferiti/Compilati/Composti/Personalizzati), ordina (Più recenti/Più vecchi/A→Z/Z→A)
- **Visualizza elementi salvati** — vedi tutti i prompt salvati con titoli, date e tipi
- **Modifica** — modifica il contenuto dei prompt salvati inline
- **Copia** — copia qualsiasi prompt salvato negli appunti
- **Elimina** — rimuovi singoli elementi
- **Preferiti** — segna i prompt come preferiti per un accesso rapido
- **Esporta** — esporta tutti i dati salvati come file JSON
- **Importa** — importa prompt da un file JSON
- **Pulsante 📚 flottante** — accesso rapido a La Mia Libreria da qualsiasi scheda

**Tipi di elementi ne La Mia Libreria:**
- Template compilati (dalla scheda Sfoglia con Compilazione Rapida)
- Prompt composti (dalla scheda Compose)
- Prompt personalizzati (dalla scheda Create)
- Prompt generati (dalla scheda Generate)

Gli elementi salvati dal database sono contrassegnati con `source: 'database'` e possono essere modificati senza influire sul prompt originale.

---

## Scorciatoie da Tastiera

| Scorciatoia | Azione |
|-------------|--------|
| `1` – `7` | Passa alle schede 1–7 (Sfoglia, Compose, Create, Generate, Strumenti, Playground, La Mia Libreria) |
| `Ctrl+K` | Metti a fuoco la barra di ricerca |
| `H` | Mostra/nascondi il pannello di aiuto |
| `D` | Commuta modalità scura/chiara |
| `Esc` | Cancella la ricerca / chiudi il pannello |

---

## Modalità Principiante

Clicca il pulsante **?** per attivare l'aiuto contestuale. Fornisce:
- Tooltip che spiegano ogni sezione
- Guide passo dopo passo per i nuovi utenti
- Documentazione inline per le funzionalità

---

## Impostazioni API

Clicca il pulsante **⚙** (ingranaggio) per configurare le chiavi API per il Playground e l'Optimizer basato su IA.

**Campi di configurazione:**
- **Provider** — OpenAI, Anthropic o Google
- **Chiave API OpenAI** — la tua chiave API OpenAI
- **Chiave API Anthropic** — la tua chiave API Anthropic
- **Chiave API Google** — la tua chiave API Google AI
- **Modello** — sovrascrittura del modello predefinito per ogni provider

Tutte le impostazioni sono memorizzate nel `localStorage` sotto la chiave `api_settings`. Le chiavi non lasciano mai il tuo browser.

---

## Barra Laterale Ridimensionabile

La barra laterale con l'elenco dei prompt può essere ridimensionata trascinando il suo bordo:
- **Larghezza minima:** 260px
- **Larghezza massima:** 600px
- La larghezza è mantenuta nel `localStorage` (chiave `pl_sidebar_width`)

---

## Modalità Scura/Chiara

Commuta con il tasto `D` o il pulsante tema. La preferenza viene salvata nel `localStorage` (chiave `pl_dark`) e persiste tra le sessioni.

---

## Persistenza dei Dati (localStorage)

Il Prompt Workshop memorizza tutti i dati nel `localStorage` del tuo browser:

| Chiave | Tipo | Descrizione |
|--------|------|-------------|
| `pl_dark` | `boolean` | Preferenza modalità scura |
| `pl_saved` | `array` | Tutti i prompt salvati, template compilati, prompt composti, prompt personalizzati |
| `pl_sidebar_width` | `number` | Larghezza barra laterale in pixel (260–600) |
| `api_settings` | `object` | Chiavi API e preferenze modello per Playground e AI Optimizer |

> **⚠️ Importante:** Cancellare i dati/cookie del browser cancellerà i prompt salvati. Usa **La Mia Libreria → Esporta tutto come JSON** per fare un backup dei tuoi dati.

---

## Utilizzo Offline

Il Prompt Workshop funziona interamente offline. Tutti gli 82+ prompt sono incorporati direttamente nel file HTML come JSON. Nessuna risorsa esterna viene caricata.

Le uniche funzionalità che richiedono internet sono:
- **AI Playground** — invia chiamate API a OpenAI/Anthropic/Google
- **Optimizer basato su IA** — invia chiamate API per la riscrittura

Tutto il resto funziona senza alcuna connessione di rete.

---

**Navigazione:** [← Riferimento CLI](Riferimento-CLI) &nbsp;|&nbsp; [Tecniche di Prompting →](Tecniche-di-Prompting)
