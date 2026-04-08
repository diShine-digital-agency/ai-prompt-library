# Guida Introduttiva

> Installazione, configurazione e primi passi con la AI Prompt Library.

---

## Requisiti di Sistema

| Requisito | Dettagli |
|-----------|----------|
| **Node.js** | 18 o successivo (per CLI e compilazione app desktop) |
| **Dipendenze npm** | **Nessuna** — zero pacchetti esterni |
| **Browser** | Qualsiasi browser moderno (per il Prompt Workshop) |
| **Spazio su disco** | ~2 MB (l'intera libreria) |

> **Non hai Node.js?** Scaricalo da [nodejs.org](https://nodejs.org/) — scegli la versione LTS. Oppure salta completamente Node.js e usa l'[opzione solo browser](#opzione-4-solo-browser-senza-nodejs).

---

## Opzioni di Installazione

### Opzione 1: Clona ed Esegui (Nessuna Installazione Necessaria)

Il modo più veloce per iniziare. Clona il repository ed esegui la CLI direttamente:

```bash
git clone https://github.com/diShine-digital-agency/ai-prompt-library.git
cd ai-prompt-library
node bin/prompt-lib.js --help
```

Tutto qui. Nessun `npm install`, nessuna dipendenza, niente da configurare.

### Opzione 2: Installazione Globale tramite npm

Installa una volta e usa il comando `prompt-lib` da qualsiasi posizione:

```bash
npm install -g @dishine/prompt-library
prompt-lib --help
```

Questo registra il comando `prompt-lib` a livello di sistema.

### Opzione 3: Link per lo Sviluppo

Se hai clonato il repository e vuoi il comando `prompt-lib` disponibile globalmente mentre lavori sul codice:

```bash
cd ai-prompt-library
npm link
prompt-lib --help
```

Le modifiche ai file sorgente hanno effetto immediato — non serve alcuna ricompilazione.

### Opzione 4: Solo Browser (Senza Node.js)

Apri semplicemente `viewer.html` in qualsiasi browser. Questo è il **Prompt Workshop** — un file autonomo con tutto integrato:

- Nessun server necessario
- Nessuna connessione internet necessaria
- Nessun Node.js necessario
- Tutti gli 82+ prompt incorporati nel file

Fai doppio clic su `viewer.html` o trascinalo nel tuo browser.

### Opzione 5: App Desktop (Compilazione dal Sorgente)

Compila app desktop native per macOS, Linux o Windows:

```bash
git clone https://github.com/diShine-digital-agency/ai-prompt-library.git
cd ai-prompt-library
./desktop/build-all.sh
```

L'output viene generato in `dist/`. Consulta la pagina [App Desktop](App-Desktop.md) per le guide specifiche per piattaforma.

| Piattaforma | Script di Compilazione | Requisiti |
|-------------|------------------------|-----------|
| macOS | `./desktop/build-macos.sh` | Xcode CLI Tools per l'app nativa |
| Linux | `./desktop/build-linux.sh` | Python 3, GTK, WebKitGTK |
| Windows | `./desktop/build-all.sh` | Git Bash o WSL |
| Tutte | `./desktop/build-all.sh` | Node.js 18+, Bash |

---

## Primi Comandi da Provare

Una volta installato, prova questi comandi per esplorare la libreria:

```bash
# Elenca tutti gli 82+ prompt raggruppati per categoria
prompt-lib list

# Cerca prompt per parola chiave
prompt-lib search "chain of thought"

# Mostra i dettagli completi di un prompt specifico
prompt-lib show chain-of-thought

# Visualizza tutte le categorie con i conteggi
prompt-lib categories

# Ottieni le statistiche della libreria
prompt-lib stats

# Mostra un prompt casuale per ispirazione
prompt-lib random
```

---

## Aprire il Prompt Workshop

Il Prompt Workshop è uno strumento visuale nel browser con 7 schede. Aprilo dalla CLI:

```bash
prompt-lib viewer
```

Oppure apri `viewer.html` direttamente in qualsiasi browser — nessun server necessario.

Il Workshop offre tutto ciò che fa la CLI, più:
- Ricerca visuale e filtri
- AI Playground (invia prompt a GPT/Claude/Gemini)
- Modalità scura/chiara
- La Mia Libreria (salva, modifica, esporta/importa prompt)
- Scorciatoie da tastiera

---

## Tutorial Rapido: Trovare e Utilizzare un Prompt

### Passo 1: Trova un Prompt

```bash
prompt-lib search "code review"
```

L'output mostra i prompt corrispondenti ordinati per pertinenza:

```
Search results for "code review" (3 found)

  code-review (score: 200)
    Code Review Checklist [intermediate] in development
    tags: code-review, quality, checklist

  code-refactoring-review (score: 110)
    Code Refactoring Review [intermediate] in development
    tags: refactoring, review, patterns
```

### Passo 2: Visualizza il Prompt Completo

```bash
prompt-lib show code-review
```

Questo mostra il contenuto completo del prompt, inclusi il template, i suggerimenti e gli esempi.

### Passo 3: Costruiscilo in Modo Interattivo

```bash
prompt-lib use code-review
```

La CLI rileva i `{{segnaposto}}` nel template e ti chiede di compilare ciascuno:

```
Building prompt: Code Review Checklist
3 field(s) to fill in

  programming language: Python
  code snippet: def calculate_total(items): ...
  focus area: security and error handling
```

Il prompt compilato viene automaticamente copiato negli appunti — pronto per essere incollato in qualsiasi modello AI.

### Passo 4: Componi un Prompt Multi-Livello

```bash
prompt-lib compose
```

Questo ti permette di combinare:
1. **Prompt di sistema** (persona e regole) — es. "Coding Assistant"
2. **Framework** (tecnica di ragionamento) — es. "Chain-of-Thought"
3. **Template di compito** (specifico per dominio) — es. "Code Review"

Il risultato è un prompt stratificato e potente che supera le prestazioni di qualsiasi singolo template.

---

## Cosa Fare Dopo?

| Vuoi... | Vai a... |
|---------|----------|
| Imparare tutti i comandi CLI | [Riferimento CLI](Riferimento-CLI.md) |
| Esplorare lo strumento nel browser | [Prompt Workshop](Prompt-Workshop.md) |
| Padroneggiare le tecniche di prompting | [Tecniche di Prompting](Tecniche-di-Prompting.md) |
| Confrontare i modelli AI | [Guida Modelli AI](Guida-Modelli-AI.md) |
| Usare gli strumenti di qualità | [Strumenti: Linter, Optimizer, Recommender](Strumenti-Linter-Optimizer-Recommender.md) |
| Compilare le app desktop | [App Desktop](App-Desktop.md) |
| Contribuire | [Contribuire](Contribuire.md) |

---

**Navigazione:** [← Home](Home.md) &nbsp;|&nbsp; [Riferimento CLI →](Riferimento-CLI.md)
