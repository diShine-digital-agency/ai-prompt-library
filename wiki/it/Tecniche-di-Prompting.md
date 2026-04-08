# Tecniche di Prompting

> Guida completa a tutti i framework, pattern e best practice per il prompting contenuti nella AI Prompt Library.

---

## Indice

- [Chain-of-Thought (CoT)](#chain-of-thought-cot)
- [Few-Shot Patterns](#few-shot-patterns)
- [ReAct Agent](#react-agent)
- [Tree-of-Thought (ToT)](#tree-of-thought-tot)
- [Role-Based Prompting](#role-based-prompting)
- [Meta-Prompting](#meta-prompting)
- [Constitutional AI](#constitutional-ai)
- [Prompt Chaining](#prompt-chaining)
- [Structured Extraction](#structured-extraction)
- [Mega-Prompt](#mega-prompt)
- [Prompt Evaluation](#prompt-evaluation)
- [Self-Consistency](#self-consistency)
- [Best Practice Generali](#best-practice-generali)
- [Errori Comuni da Evitare](#errori-comuni-da-evitare)
- [Consigli per Livello di Competenza](#consigli-per-livello-di-competenza)

---

## Chain-of-Thought (CoT)

Il Chain-of-Thought prompting istruisce l'IA a mostrare il proprio ragionamento passo dopo passo prima di arrivare a una conclusione. Questo migliora drasticamente l'accuratezza nei compiti che richiedono un ragionamento articolato.

### Varianti

| Variante | Come Funziona | Quando Usarla |
|----------|---------------|---------------|
| **Zero-Shot CoT** | Aggiungi "Let's think step by step" alla fine del prompt | Incremento rapido del ragionamento, senza bisogno di esempi |
| **Few-Shot CoT** | Fornisci esempi con ragionamento passo dopo passo | Ragionamento complesso dove il formato è importante |
| **Auto-CoT** | Lascia che il modello generi le proprie catene di ragionamento | Quando non riesci a creare buoni esempi |
| **Self-Consistency (CoT-SC)** | Esegui il CoT più volte e prendi la risposta a maggioranza | Decisioni ad alto rischio che richiedono affidabilità |

### Esempio Zero-Shot CoT

```
Solve the following math problem. Let's think step by step.

A store has 45 apples. They sell 18 in the morning and receive 30 more
in the afternoon. How many apples do they have at the end of the day?
```

### Esempio Few-Shot CoT

```
Q: If a train travels at 60 km/h for 2.5 hours, how far does it go?
A: Let me work through this step by step.
   Step 1: Identify the formula — distance = speed × time
   Step 2: Plug in values — distance = 60 × 2.5
   Step 3: Calculate — distance = 150 km
   Answer: The train travels 150 km.

Q: A car drives at 80 km/h for 3.25 hours. How far does it travel?
A:
```

### Quando Usare il CoT

✅ **Usa quando:**
- Problemi di matematica, logica o ragionamento multi-fase
- Analisi complesse che richiedono valutazione di prove
- Debug del codice o tracciamento del flusso di esecuzione
- Compiti di pianificazione con dipendenze
- Qualsiasi problema dove mostrare il procedimento è importante

❌ **Non usare quando:**
- Ricerche fattuali semplici ("Qual è la capitale della Francia?")
- Scrittura creativa dove il ragionamento interrompe il flusso
- Compiti ad alto volume dove paghi per token
- Compiti di classificazione con categorie chiare

### Consigli

- **Sii esplicito:** "Show your reasoning for each step" funziona meglio di "think about it"
- **Numera i passaggi:** il modello segue passaggi numerati più fedelmente rispetto al ragionamento libero
- **Aggiungi una verifica:** "After reaching your answer, verify it by working backwards"
- **Combina con un ruolo:** "You are a math professor. Solve this step by step, explaining each step to a student"

---

## Few-Shot Patterns

Il prompting Few-Shot insegna all'IA fornendo esempi del formato input-output desiderato. Il modello apprende lo schema e lo applica a nuovi input.

### Come Funziona

```
Convert the following product descriptions to JSON:

Input: "Red running shoes, size 10, $89.99"
Output: {"product": "running shoes", "color": "red", "size": "10", "price": 89.99}

Input: "Blue denim jacket, large, $124.50"
Output: {"product": "denim jacket", "color": "blue", "size": "large", "price": 124.50}

Input: "Black leather wallet, one size, $45.00"
Output:
```

### Quanti Esempi Servono?

| Quantità | Ideale Per | Compromesso |
|:--------:|-----------|-------------|
| 0 (zero-shot) | Compiti semplici e ben definiti | Costo in token più basso |
| 1–2 | Dimostrazione del formato | Buon equilibrio |
| 3–5 | Apprendimento del pattern, casi limite | Miglior qualità per la maggior parte dei compiti |
| 6+ | Compiti complessi o ambigui | Costo in token elevato, rendimenti decrescenti |

### Consigli

- **Formato coerente:** ogni esempio deve seguire esattamente la stessa struttura
- **Mostra i casi limite:** includi almeno un esempio complicato
- **Varia gli esempi:** non fare tutti gli esempi troppo simili — mostra la gamma
- **L'ordine conta:** metti gli esempi più rappresentativi per primi
- **Delimita chiaramente:** usa separatori evidenti tra gli esempi (`---`, `###` o righe vuote)

---

## ReAct Agent

ReAct (Reasoning + Acting) combina il ragionamento chain-of-thought con azioni che utilizzano strumenti. Il modello segue un ciclo **Thought → Action → Observation** (Pensiero → Azione → Osservazione).

### Lo Schema

```
You are a research assistant with access to these tools:
- search(query): Search the web for information
- calculator(expression): Evaluate a math expression
- lookup(term): Look up a definition

For each step, use this format:
Thought: [What I need to figure out next]
Action: [tool_name(arguments)]
Observation: [Result from the tool]
... (repeat until you have the answer)
Final Answer: [Your conclusion]

Question: What is the GDP per capita of the country with the
tallest building in the world?
```

### Quando Usarlo

✅ **Usa quando:**
- Compiti che richiedono l'uso di strumenti esterni (ricerca, API, database)
- Domande di ricerca multi-fase
- Problemi che richiedono dati in tempo reale
- Costruzione di agenti IA con accesso a strumenti

❌ **Non usare quando:**
- L'IA ha tutte le informazioni necessarie nel contesto
- Compiti semplici a singola fase
- Compiti dove la latenza degli strumenti non è accettabile

---

## Tree-of-Thought (ToT)

Tree-of-Thought estende il CoT esplorando **percorsi di ragionamento multipli** simultaneamente, valutando ogni ramo e tornando indietro dai vicoli ciechi.

### Lo Schema

```
Consider the following problem: [PROBLEM]

Generate 3 different approaches to solving this:

Approach 1: [description]
  Step 1: ...
  Step 2: ...
  Evaluation: [How promising is this approach? Rate 1-10]

Approach 2: [description]
  Step 1: ...
  Step 2: ...
  Evaluation: [How promising is this approach? Rate 1-10]

Approach 3: [description]
  Step 1: ...
  Step 2: ...
  Evaluation: [How promising is this approach? Rate 1-10]

Now select the most promising approach and develop it fully.
If you hit a dead end, backtrack and try the next best approach.
```

### Quando Usarlo

✅ **Usa per:** pianificazione strategica, risoluzione creativa di problemi, decisioni di design complesse, problemi di ottimizzazione

❌ **Evita per:** problemi semplici con risposte ovvie, compiti con requisiti di latenza stringenti

---

## Role-Based Prompting

Assegnare una persona esperta migliora drasticamente la qualità delle risposte. L'IA attinge ai pattern di conoscenza associati a quel ruolo.

### Schema Base

```
You are a senior data analyst with 15 years of experience in
financial services. You specialize in risk modeling and have
presented findings to C-level executives at Fortune 500 companies.

[Your task here]
```

### Avanzato: Ruolo + Vincoli

```
You are a senior DevOps engineer specializing in Kubernetes.

RULES:
- Always suggest the simplest solution first
- Include security implications for every recommendation
- If you're unsure, say so rather than guessing
- Use concrete examples with actual YAML/commands

AUDIENCE: Mid-level developers who know Docker but are new to K8s

TASK: [Your task here]
```

### Consigli

- **Sii specifico:** "Senior Python developer" > "programmer"
- **Aggiungi il livello di esperienza:** "10+ years" indica profondità di conoscenza
- **Aggiungi il dominio:** "specializing in healthcare data" restringe il focus
- **Combina con altre tecniche:** Role + CoT, Role + Few-Shot, Role + Guardrails

---

## Meta-Prompting

Usare prompt per generare prompt migliori. L'IA diventa il tuo ingegnere di prompt.

### Lo Schema

```
You are an expert prompt engineer. Given the following task description,
create an optimized prompt that will produce the best possible output
from a large language model.

Task: {{task_description}}

Your optimized prompt should include:
1. A clear role definition
2. Specific instructions with constraints
3. Output format specification
4. Quality verification step
5. At least one example of expected output

Return the complete prompt, ready to use.
```

### Quando Usarlo

- Quando fai fatica a ottenere buoni risultati da un prompt
- Quando devi creare prompt per utenti non tecnici
- Quando ottimizzi prompt per sistemi in produzione
- Come primo passo prima del perfezionamento manuale

---

## Constitutional AI

Un ciclo di auto-critica e revisione in cui l'IA valuta e migliora il proprio output.

### Lo Schema

```
Step 1: Generate an initial response to: [TASK]

Step 2: Critique your response using these principles:
- Is it accurate and factually correct?
- Is it helpful without being harmful?
- Does it avoid bias and stereotypes?
- Is it complete and addresses all parts of the question?

Step 3: Revise your response based on the critique.

Step 4: Present only the revised version as your final answer.
```

### Quando Usarlo

- Moderazione dei contenuti e applicazioni con criticità di sicurezza
- Riduzione dei pregiudizi nel contenuto generato
- Miglioramento dell'accuratezza fattuale
- Auto-correzione di output complessi

---

## Prompt Chaining

Scomporre compiti complessi in prompt sequenziali, dove l'output di uno diventa l'input del successivo.

### Lo Schema

```
Chain 1: Research
  "List the 5 most important factors in {{topic}}"

Chain 2: Analysis (receives Chain 1 output)
  "For each factor listed below, provide a detailed analysis:
   {{chain_1_output}}"

Chain 3: Synthesis (receives Chain 2 output)
  "Based on the following analysis, write an executive summary
   with recommendations: {{chain_2_output}}"
```

### Vantaggi

| Vantaggio | Descrizione |
|-----------|-------------|
| **Qualità migliore** | Ogni passaggio ha un compito focalizzato e gestibile |
| **Debug più facile** | Puoi ispezionare e correggere ogni passaggio indipendentemente |
| **Maggiore controllo** | Puoi aggiungere validazioni tra i passaggi |
| **Efficienza nei token** | Ogni prompt può usare un modello più piccolo e meno costoso |

### Consigli

- Mantieni ogni catena focalizzata su un singolo compito
- Valida l'output tra le catene
- Usa modelli diversi per catene diverse (economico per passaggi semplici, costoso per quelli complessi)
- Documenta il flusso della catena per la manutenibilità

---

## Structured Extraction

Usare template per estrarre in modo affidabile dati strutturati da testo non strutturato.

### Lo Schema

```
Extract the following information from the text below.
Return the result in this exact JSON format:

{
  "company_name": "string",
  "revenue": "number or null",
  "employees": "number or null",
  "founded_year": "number or null",
  "key_products": ["string"]
}

Rules:
- Use null for any field you can't find
- For revenue, use the most recent annual figure in USD
- For employees, use the most recent approximate count

Text:
{{input_text}}
```

### Consigli

- Specifica sempre il formato esatto dell'output (JSON, tabella, ecc.)
- Definisci cosa fare quando i dati mancano (`null`, "N/A", ometti)
- Includi esempi di casi limite
- Usa vincoli: "Extract ONLY from the provided text — do not add information"

---

## Mega-Prompt

Un prompt di sistema completo e multi-sezione che copre tutti gli aspetti di un compito complesso in un unico prompt.

### Struttura

```
# ROLE
You are [detailed role description]

# CONTEXT
[Background information and domain knowledge]

# TASK
[Primary task with clear objectives]

# RULES
1. [Hard constraint]
2. [Hard constraint]
3. [Quality standard]

# OUTPUT FORMAT
[Exact format specification]

# EXAMPLES
[1-3 examples of expected output]

# QUALITY CHECKS
Before responding, verify:
- [ ] All rules are followed
- [ ] Output matches the specified format
- [ ] Content is accurate and complete
```

### Quando Usarlo

- Prompt di sistema in produzione che devono gestire molti scenari
- Compiti complessi con molti requisiti
- Quando serve un output coerente attraverso molte richieste
- Prompt di sistema per applicazioni IA rivolte al cliente

---

## Prompt Evaluation

Valutare e assegnare un punteggio sistematicamente alla qualità dei prompt.

### Criteri di Valutazione

| Criterio | Peso | Cosa Verificare |
|----------|:----:|-----------------|
| **Chiarezza** | Alto | Il compito è privo di ambiguità? |
| **Specificità** | Alto | I requisiti sono sufficientemente dettagliati? |
| **Struttura** | Medio | Ci sono sezioni ben definite? |
| **Vincoli** | Medio | I limiti sono definiti? |
| **Esempi** | Medio | Gli output attesi sono mostrati? |
| **Completezza** | Alto | Copre tutti i casi? |
| **Efficienza** | Basso | È conciso senza perdere chiarezza? |

Usa il [Prompt Linter](Strumenti-Linter-Optimizer-Recommender.md#prompt-linter) integrato per automatizzare la valutazione della qualità.

---

## Self-Consistency

Esegui lo stesso prompt più volte con percorsi di ragionamento diversi e prendi la risposta a maggioranza.

### Lo Schema

```
Solve this problem 3 times using different approaches.
For each attempt, use a different reasoning strategy.

Problem: [PROBLEM]

Attempt 1 (logical deduction): ...
Attempt 2 (working backwards): ...
Attempt 3 (analogy-based reasoning): ...

Final answer: [Select the answer that appears most frequently,
or if all differ, select the one with the strongest reasoning]
```

### Quando Usarlo

- Decisioni ad alto rischio dove l'accuratezza è critica
- Problemi matematici con percorsi di soluzione multipli
- Problemi ambigui dove l'approccio "giusto" non è chiaro
- Ovunque serva calibrazione della confidenza

---

## Best Practice Generali

### I Fondamenti

| Pratica | Perché È Importante | Esempio |
|---------|---------------------|---------|
| **Sii specifico** | Prompt vaghi producono risposte vaghe | ❌ "Write something about dogs" → ✅ "Write a 500-word blog post about the health benefits of adopting senior dogs" |
| **Definisci il ruolo** | Imposta il contesto di conoscenza | "You are a senior security engineer" |
| **Imposta vincoli** | Previene comportamenti indesiderati | "Never make up statistics. Cite sources." |
| **Fornisci esempi** | Mostra il formato atteso | Includi 1-3 esempi input/output |
| **Specifica il formato di output** | Garantisce coerenza | "Respond in JSON with these fields: ..." |
| **Aggiungi una verifica** | Rileva errori dell'IA | "Before responding, verify that your answer addresses all 3 requirements" |

### Template per la Struttura del Prompt

```
ROLE: [Who the AI should be]

CONTEXT: [Background information]

TASK: [What to do — be specific]

RULES:
- [Constraint 1]
- [Constraint 2]

OUTPUT FORMAT: [Exact format specification]

QUALITY CHECK: [Verification step]
```

---

## Errori Comuni da Evitare

| Errore | Problema | Soluzione |
|--------|----------|-----------|
| **Troppo vago** | "Help me with my code" | Specifica linguaggio, errore, comportamento atteso |
| **Nessun ruolo** | Risposte generiche e superficiali | Aggiungi "You are a [specific expert]" |
| **Nessun formato** | Struttura dell'output incoerente | Specifica JSON, markdown, tabella, ecc. |
| **Troppo cortese** | "Please kindly help me if you could..." spreca token | Le istruzioni dirette funzionano meglio |
| **Sovraccarico di informazioni** | 5000 parole di contesto con una domanda da 1 riga | Metti la domanda prima, il contesto dopo |
| **Ambito ambiguo** | "Tell me about Python" | "Explain Python's GIL and how it affects multi-threading" |
| **Nessun vincolo** | L'IA inventa dati, ha allucinazioni | "Only use information from the provided text" |
| **Nessun esempio** | Il modello indovina il formato | Aggiungi 1-2 esempi dell'output atteso |
| **Dare per scontato il contesto** | "Fix the bug from before" | Ogni prompt dovrebbe essere autosufficiente |
| **Ignorare i punti di forza del modello** | Usare il modello sbagliato per il compito | Consulta la [Guida Modelli AI](Guida-Modelli-AI.md) |

---

## Consigli per Livello di Competenza

### Principiante

1. Inizia con un ruolo: "You are a helpful [expert]"
2. Esprimi il tuo compito chiaramente in una frase
3. Aggiungi "Respond in [format]" (markdown, elenchi puntati, JSON)
4. Usa il [Prompt Linter](Strumenti-Linter-Optimizer-Recommender.md) per verificare i tuoi prompt
5. Sfoglia i template della libreria per ispirazione

### Intermedio

1. Usa sezioni strutturate (ROLE, TASK, RULES, OUTPUT FORMAT)
2. Aggiungi 2-3 esempi few-shot per compiti complessi
3. Combina le tecniche: Role + CoT, Few-Shot + Guardrails
4. Usa la funzionalità Compose per stratificare prompt di sistema + framework
5. Testa i prompt su più modelli per verificarne la robustezza

### Avanzato

1. Costruisci catene di prompt per flussi di lavoro complessi multi-fase
2. Implementa la Self-Consistency (percorsi di ragionamento multipli)
3. Usa il Meta-Prompting per generare e ottimizzare prompt
4. Progetta pattern di Constitutional AI per l'auto-correzione
5. Costruisci routing multi-modello con classificazione del tipo di compito
6. Crea Mega-Prompt per prompt di sistema in produzione
7. Usa Tree-of-Thought per decisioni strategiche complesse

---

**Navigazione:** [← Prompt Workshop](Prompt-Workshop.md) &nbsp;|&nbsp; [Guida Modelli AI →](Guida-Modelli-AI.md)
