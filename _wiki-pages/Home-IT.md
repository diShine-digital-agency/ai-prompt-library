# 🧠 AI Prompt Library — Wiki

> **82+ template di prompt engineering di livello esperto** con CLI, Prompt Workshop nel browser e app desktop — progettati per sviluppatori, scrittori, professionisti del marketing e praticanti di IA.

Benvenuto nella wiki ufficiale della **AI Prompt Library** di [diShine Digital Agency](https://dishine.it). Questo è il tuo punto di riferimento per imparare tutto sullo strumento — dall'installazione alle tecniche avanzate di prompting.

---

## Cos'è la AI Prompt Library?

La AI Prompt Library è un toolkit completo e senza dipendenze per il prompt engineering. Offre:

- **82+ template di prompt pronti per la produzione** organizzati in 8 categorie
- **Strumento CLI** (`prompt-lib`) per scoprire, costruire e ottimizzare prompt dal terminale
- **Prompt Workshop** — un'applicazione interattiva nel browser (`viewer.html`) che funziona offline
- **App desktop** per macOS (Swift nativo), Linux (GTK) e Windows (modalità app Edge)
- **Strumenti di qualità** — Linter (punteggio con 14 regole), Optimizer (riscrittura consapevole del contenuto), Recommender (suggerimenti basati sull'intento)
- **AI Playground** — invia prompt direttamente a GPT, Claude o Gemini dal browser
- **Generatore di prompt** — crea prompt dinamicamente usando 5 framework
- **Compose & Create** — combina prompt di sistema + framework + template, oppure crea prompt personalizzati con campi dinamici

**Versione:** 2.3.1 &nbsp;|&nbsp; **Licenza:** MIT &nbsp;|&nbsp; **Dipendenze:** Zero (solo moduli integrati di Node.js 18+)

---

## Funzionalità Principali

| Funzionalità | CLI | Prompt Workshop | Descrizione |
|--------------|:---:|:---------------:|-------------|
| **Sfoglia e Cerca** | ✅ | ✅ | Trova prompt per parola chiave, categoria o tag |
| **Visualizza e Usa** | ✅ | ✅ | Visualizza i prompt completi e compila i `{{segnaposto}}` in modo interattivo |
| **Copia negli Appunti** | ✅ | ✅ | Copia dei template con un solo clic |
| **Compose** | ✅ | ✅ | Combina prompt di sistema + framework + template |
| **Create** | ✅ | ✅ | Crea prompt personalizzati con campi dinamici |
| **Generate** | ✅ | ✅ | Genera prompt da 5 framework |
| **Lint** | ✅ | ✅ | Valuta la qualità del prompt (0–100, voto A–F) |
| **Optimize** | ✅ | ✅ | Riscrivi i prompt con le migliori pratiche |
| **Recommend** | ✅ | ✅ | Suggerimenti intelligenti basati sull'intento |
| **AI Playground** | — | ✅ | Invia prompt a GPT/Claude/Gemini |
| **La Mia Libreria** | ✅ | ✅ | Salva, modifica, esporta/importa prompt |
| **Modalità Scura** | — | ✅ | Commutazione tema chiaro/scuro |

---

## Tre Modi per Utilizzarlo

### 1. CLI (`prompt-lib`)
Uno strumento da terminale per cercare, costruire, comporre, analizzare e ottimizzare prompt. Installabile globalmente tramite npm o eseguibile direttamente dal repository.

```bash
prompt-lib search "chain of thought"
prompt-lib use code-review
prompt-lib lint
```

### 2. Prompt Workshop (`viewer.html`)
Un'applicazione HTML a pagina singola con 7 schede — Sfoglia, Compose, Create, Generate, Strumenti, Playground e La Mia Libreria. Funziona offline, senza server, senza Node.js.

### 3. App Desktop
Applicazioni native per macOS (Swift + WebKit), Linux (Python + GTK + WebKitGTK) e Windows (modalità app Edge). Compila dal sorgente con `./desktop/build-all.sh`.

---

## Categorie di Prompt

| Categoria | Quantità | Descrizione |
|-----------|:--------:|-------------|
| `business` | 12 | Proposte, pitch, aggiornamenti per stakeholder, OKR |
| `data` | 10 | SQL, dashboard, ETL, valutazione ML, qualità dei dati |
| `development` | 13 | Code review, architettura, debugging, testing |
| `frameworks` | 12 | Chain-of-thought, ReAct, few-shot, meta-prompting |
| `image-generation` | 8 | Ritratti, loghi, scene, character design |
| `marketing` | 11 | SEO, campagne email, copy pubblicitari, voce del brand |
| `model-specific` | 6 | Best practice per Claude, GPT, Gemini, Llama, Mistral |
| `system-prompts` | 10 | Assistente di programmazione, ricercatore, scrittore di contenuti, tutor |

---

## Pagine della Wiki

| Pagina | Descrizione |
|--------|-------------|
| **[Guida Introduttiva](Guida-Introduttiva)** | Installazione, configurazione e primi passi |
| **[Riferimento CLI](Riferimento-CLI)** | Documentazione completa dell'interfaccia a riga di comando |
| **[Prompt Workshop](Prompt-Workshop-IT)** | Guida allo strumento interattivo nel browser |
| **[Tecniche di Prompting](Tecniche-di-Prompting)** | Framework, pattern e best practice |
| **[Guida Modelli AI](Guida-Modelli-AI)** | Confronto modelli, prezzi, criteri di scelta |
| **[Strumenti: Linter, Optimizer, Recommender](Strumenti-Linter-Optimizer-Recommender)** | Approfondimento sugli strumenti di qualità |
| **[API e Playground](API-e-Playground)** | AI Playground e utilizzo programmatico |
| **[Architettura](Architettura)** | Architettura tecnica e riferimento dei moduli |
| **[App Desktop](App-Desktop)** | Guida alle applicazioni desktop |
| **[Contribuire](Contribuire)** | Come contribuire con prompt, codice e framework |

---

## Link Rapidi

- 📦 **npm:** `npm install -g @dishine/prompt-library`
- 🏠 **Repository:** [github.com/diShine-digital-agency/ai-prompt-library](https://github.com/diShine-digital-agency/ai-prompt-library)
- 📖 **Guida Utente:** [GUIDE.md](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/GUIDE.md)
- 🔧 **Documentazione Tecnica:** [TECHNICAL.md](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/TECHNICAL.md)
- 📋 **Riferimento Funzioni:** [FUNCTIONS.md](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/FUNCTIONS.md)
- 📝 **Changelog:** [CHANGELOG.md](https://github.com/diShine-digital-agency/ai-prompt-library/blob/main/CHANGELOG.md)

---

<p align="center">
Realizzato con ❤️ da <a href="https://dishine.it">diShine Digital Agency</a> — v2.3.1
</p>

---

**Navigazione:** [Guida Introduttiva →](Guida-Introduttiva)
