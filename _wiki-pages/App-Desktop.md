# App Desktop

> Compila e installa le applicazioni desktop native per macOS, Linux e Windows.

---

## Indice

- [Panoramica](#panoramica)
- [Comandi di Compilazione](#comandi-di-compilazione)
- [macOS — App Nativa](#macos--app-nativa)
- [Linux — App Nativa](#linux--app-nativa)
- [Windows — App in Stile Nativo](#windows--app-in-stile-nativo)
- [Android e iOS](#android-e-ios)
- [Risoluzione dei Problemi](#risoluzione-dei-problemi)

---

## Panoramica

Il Prompt Workshop può essere eseguito come **applicazione desktop** su tutte le principali piattaforme. Ogni piattaforma usa un approccio diverso ottimizzato per un'esperienza nativa:

| Piattaforma | Tecnologia | Finestra Nativa | Browser Necessario |
|-------------|-----------|:--------------:|:------------------:|
| **macOS** | Swift + WebKit | ✅ | ❌ |
| **Linux** | Python + GTK + WebKitGTK | ✅ | ❌ |
| **Windows** | Modalità app Edge (launcher VBScript) | ✅ | ✅ (Edge/Chrome) |
| **Android/iOS** | Browser + "Aggiungi alla schermata Home" | Parziale | ✅ |

Tutte le app desktop vengono **compilate dal sorgente** — non ci sono download precompilati.

---

## Comandi di Compilazione

Tutte le compilazioni richiedono **Node.js 18+** e **Bash** (Git Bash o WSL su Windows).

```bash
# Clone the repository
git clone https://github.com/diShine-digital-agency/ai-prompt-library.git
cd ai-prompt-library

# Build for all platforms at once
./desktop/build-all.sh

# Or build individually
./desktop/build-macos.sh      # macOS
./desktop/build-linux.sh      # Linux
# Windows: use build-all.sh or build-windows.bat on Windows
```

**L'output va nella directory `dist/`:**

| Piattaforma | Archivio | Tipo |
|-------------|----------|------|
| macOS (con Xcode CLI) | `PromptWorkshop-macOS.zip` | App nativa (finestra propria) |
| macOS (senza Xcode CLI) | `PromptWorkshop.tar.gz` | Fallback modalità app (Chrome/Edge) |
| Linux | `prompt-workshop-linux.tar.gz` | App nativa GTK |
| Windows | `PromptWorkshop-win.zip` | Modalità app Edge |

---

## macOS — App Nativa

### Cosa Ottieni

Una **vera applicazione macOS** che si esegue nella propria finestra — nessun browser necessario:

- ✅ Finestra propria con barra del titolo nativa
- ✅ Barra dei menu completa (File, Modifica, Vista, Finestra)
- ✅ Scorciatoie da tastiera standard (⌘C, ⌘V, ⌘Q, ⌘+/⌘- zoom)
- ✅ Icona nel Dock — fissala nel tuo Dock
- ✅ Ricerca Spotlight — trovala digitando "Prompt Workshop"
- ✅ Supporto schermo intero (⌃⌘F)
- ✅ Funziona completamente offline
- ✅ I prompt salvati persistono tra le sessioni

### Requisiti

- **macOS 11+**
- **Xcode Command Line Tools** (per la compilazione dell'app nativa)
  ```bash
  xcode-select --install
  ```

> **Senza Xcode CLI Tools**, la compilazione crea un **fallback in modalità app** che si apre in Chrome/Edge invece di una finestra nativa.

### Compilazione e Installazione

```bash
# 1. Install Xcode Command Line Tools (REQUIRED for native app)
xcode-select --install

# 2. Build the app — look for "★ Native build" in the output
./desktop/build-macos.sh

# 3. Install
mv dist/PromptWorkshop.app /Applications/

# 4. Launch
open /Applications/PromptWorkshop.app
```

### Struttura dell'App

```
PromptWorkshop.app/
└── Contents/
    ├── Info.plist              # Metadati app (bundle ID, versione, icona)
    ├── MacOS/
    │   └── PromptWorkshop      # Eseguibile nativo (Swift + WebKit)
    └── Resources/
        └── viewer.html         # Il Prompt Workshop completo
```

### Scorciatoie da Tastiera

| Scorciatoia | Azione |
|-------------|--------|
| ⌘Q | Esci |
| ⌘W | Chiudi finestra |
| ⌘C / ⌘V | Copia / Incolla |
| ⌘Z / ⇧⌘Z | Annulla / Ripristina |
| ⌘+ / ⌘- | Zoom avanti / indietro |
| ⌘0 | Ripristina zoom |
| ⌃⌘F | Schermo intero |
| ⌘R | Ricarica |
| ⌘M | Minimizza |
| ⌘H | Nascondi |

Più tutte le scorciatoie dell'app (1–7 per le schede, Ctrl+K per la ricerca, H per l'aiuto, D per la modalità scura).

### Archiviazione dei Dati

I prompt salvati e le impostazioni sono memorizzati nell'archivio dati WebKit dedicato dell'app:

- ✅ I dati persistono tra i riavvii e gli aggiornamenti dell'app
- ✅ Separati dai dati del browser — cancellare Safari/Chrome non influisce sull'app
- ⚠️ Se elimini l'app, i tuoi dati vengono persi — **esporta la tua libreria prima**

---

## Linux — App Nativa

### Cosa Ottieni

Un'**applicazione Linux nativa** che si esegue nella propria finestra:

- ✅ Finestra propria (nessuna barra degli indirizzi o schede del browser)
- ✅ Voce nel menu applicazioni — cerca "Prompt Workshop"
- ✅ Scorciatoie da tastiera (Ctrl+C/V, Ctrl+±, F11 schermo intero)
- ✅ Funziona completamente offline
- ✅ I prompt salvati persistono tra le sessioni

### Requisiti

La finestra nativa richiede GTK + WebKitGTK (preinstallati sulla maggior parte delle distribuzioni desktop):

| Distribuzione | Pacchetti Necessari | Preinstallati? |
|---------------|---------------------|:--------------:|
| Ubuntu/Debian | `python3-gi gir1.2-webkit2-4.0` | ✅ Sì (GNOME) |
| Fedora | `python3-gobject webkit2gtk3` | ✅ Sì |
| Arch | `python-gobject webkit2gtk` | ⚠️ Potrebbe servire installarli |
| Linux Mint | `python3-gi gir1.2-webkit2-4.0` | ✅ Sì |

Se mancanti, l'app fa fallback sulla modalità app Chrome/Edge o sul browser predefinito.

**Per il supporto appunti:** installa `xclip` (`sudo apt install xclip`).

### Compilazione e Installazione

```bash
# 1. Build the Linux package
./desktop/build-linux.sh

# 2. Extract and install
cd dist
tar -xzf prompt-workshop-linux.tar.gz
cd prompt-workshop
./install.sh

# 3. Launch
prompt-workshop
```

Puoi anche fare doppio clic su `install.sh` dal tuo file manager — su GNOME, una finestra di dialogo mostra il progresso e un messaggio "✅ Installed!".

### Contenuto del Pacchetto

```
prompt-workshop/
├── viewer.html               # Il Prompt Workshop completo
├── prompt-workshop            # Launcher intelligente (nativo → modalità app → browser)
├── prompt-workshop-app.py     # Applicazione nativa GTK + WebKit
├── prompt-workshop.png        # Icona dell'app
├── prompt-workshop.desktop    # File voce desktop
└── install.sh                 # Installatore GUI (doppio clic per installare)
```

### Posizioni di Installazione

| File | Posizione |
|------|-----------|
| File dell'app | `~/.local/share/prompt-workshop/` |
| Launcher | `~/.local/bin/prompt-workshop` |
| Voce desktop | `~/.local/share/applications/prompt-workshop.desktop` |

### Disinstallazione

```bash
rm -rf ~/.local/share/prompt-workshop
rm -f ~/.local/bin/prompt-workshop
rm -f ~/.local/share/applications/prompt-workshop.desktop
```

---

## Windows — App in Stile Nativo

### Cosa Ottieni

Un'**applicazione Windows in stile nativo** che usa la modalità app di Microsoft Edge:

- ✅ Finestra propria (nessuna barra degli indirizzi, nessuna scheda)
- ✅ Collegamento sul desktop con icona personalizzata
- ✅ Voce nel menu Start — cerca "Prompt Workshop"
- ✅ Integrazione con la barra delle applicazioni — fissala nella barra
- ✅ Funziona completamente offline
- ✅ Nessun diritto di amministratore necessario
- ✅ Nessuna modifica al registro

### Come Funziona

L'app si apre nella **modalità app di Microsoft Edge** — una finestra pulita senza chrome del browser. Edge è preinstallato su Windows 10/11.

**Catena di fallback:** Modalità app Edge → modalità app Chrome → browser predefinito

### Compilazione e Installazione

Richiede Bash (Git Bash o WSL) e Node.js 18+.

```bash
# 1. Build (from Git Bash or WSL)
./desktop/build-all.sh

# 2. Extract the zip from dist/
# 3. Double-click Install.bat
```

`Install.bat` crea:
- Un **collegamento sul desktop** (con icona personalizzata)
- Una **voce nel menu Start** (ricercabile come "Prompt Workshop")

### Contenuto del Pacchetto

```
PromptWorkshop-win/
├── viewer.html               # Il Prompt Workshop completo
├── PromptWorkshop.vbs        # Launcher in stile nativo (modalità app Edge)
├── PromptWorkshop.bat        # Launcher di fallback (browser predefinito)
├── PromptWorkshop.ico        # Icona dell'app
├── Install.bat               # Installatore con un clic
├── Uninstall.bat             # Disinstallatore con un clic
└── README.txt                # Guida rapida
```

### Uso Portatile

Non vuoi installare? Fai semplicemente doppio clic su `PromptWorkshop.vbs` direttamente da qualsiasi cartella.

### Disinstallazione

Fai doppio clic su `Uninstall.bat`, oppure elimina manualmente:
- La cartella `%LocalAppData%\PromptWorkshop\`
- Il collegamento sul desktop
- Il collegamento nel menu Start

---

## Android e iOS

Il Prompt Workshop funziona in qualsiasi browser mobile moderno come file HTML autonomo.

### Android

1. Trasferisci `viewer.html` sul tuo dispositivo (email, cloud drive, USB)
2. Aprilo in Chrome
3. Tocca il menu ⋮ → **"Aggiungi alla schermata Home"**
4. Avvialo dalla schermata Home come un'app normale

### iOS / iPadOS

1. Trasferisci `viewer.html` sul tuo dispositivo (AirDrop, iCloud Drive, email)
2. Aprilo in Safari
3. Tocca il pulsante condividi (↑) → **"Aggiungi alla schermata Home"**
4. Avvialo dalla schermata Home

> **Nota:** iOS richiede Safari per "Aggiungi alla schermata Home" — gli altri browser non supportano questa funzione.

---

## Risoluzione dei Problemi

### macOS: L'App si Apre nel Browser Invece della Propria Finestra

La compilazione ha creato il **fallback in modalità app** invece dell'app nativa.

**Causa:** Xcode Command Line Tools non installati (nessun compilatore `swiftc`).

**Soluzione:**
```bash
xcode-select --install       # Install Xcode CLI Tools
./desktop/build-macos.sh     # Rebuild — look for "★ Native build"
mv dist/PromptWorkshop.app /Applications/
```

### macOS: Icona dell'App Mancante nel Dock

```bash
# Clear icon cache and restart Finder
sudo rm -rf /Library/Caches/com.apple.iconservices.store
killall Dock
```

### macOS: "L'App è Danneggiata e Non Può Essere Aperta"

Questo è il Gatekeeper di macOS che blocca le app non firmate. Risolvi con uno di questi metodi:

1. **Clic destro** sull'app → clicca **Apri** → clicca **Apri** nella finestra di dialogo
2. Esegui: `xattr -cr /Applications/PromptWorkshop.app`
3. Vai su **Impostazioni di Sistema → Privacy e Sicurezza** → clicca **Apri Comunque**

### macOS: Errore di Compilazione "swiftc: command not found"

Installa Xcode Command Line Tools: `xcode-select --install`

### Linux: "Permission denied" su install.sh

```bash
chmod +x install.sh && ./install.sh
```

Oppure clic destro → Proprietà → Permessi → seleziona "Consenti l'esecuzione del file come programma".

### Linux: L'App Non Appare nel Menu Applicazioni

```bash
update-desktop-database ~/.local/share/applications/
```

### Linux: `~/.local/bin` Non è nel PATH

```bash
# Add to ~/.bashrc or ~/.zshrc
export PATH="$HOME/.local/bin:$PATH"
source ~/.bashrc
```

### Windows: SmartScreen "Windows ha protetto il tuo PC"

1. Clicca **"Ulteriori informazioni"**
2. Clicca **"Esegui comunque"**

Questo accade solo una volta per i file scaricati da internet.

### Windows: L'Antivirus Blocca il File .vbs

- Usa `PromptWorkshop.bat` al suo posto
- Oppure apri `viewer.html` direttamente nel browser
- Oppure aggiungi un'eccezione nel tuo antivirus

### Windows: L'App si Apre nel Browser Completo

Edge non è stato trovato. Installa [Microsoft Edge](https://www.microsoft.com/edge) o Google Chrome — il launcher userà la modalità app.

---

## Backup dei Dati

Prima di aggiornare o disinstallare, esporta i tuoi dati:

1. Apri il Prompt Workshop
2. Vai alla scheda **La Mia Libreria** (o clicca 📚)
3. Clicca **Esporta tutto come JSON**
4. Salva il file

Per ripristinare: **La Mia Libreria** → **Importa JSON** → seleziona il tuo file di backup.

---

**Navigazione:** [← Architettura](Architettura) &nbsp;|&nbsp; [Contribuire →](Contribuire)
