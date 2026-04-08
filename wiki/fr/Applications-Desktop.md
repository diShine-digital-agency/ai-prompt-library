# Applications de bureau

> Compiler et installer des applications de bureau natives pour macOS, Linux et Windows.

---

## Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Commandes de compilation](#commandes-de-compilation)
- [macOS — Application native](#macos--application-native)
- [Linux — Application native](#linux--application-native)
- [Windows — Application de style natif](#windows--application-de-style-natif)
- [Android et iOS](#android-et-ios)
- [Résolution de problèmes](#résolution-de-problèmes)

---

## Vue d'ensemble

Le Prompt Workshop peut s'exécuter comme une **application de bureau** sur toutes les plateformes majeures. Chaque plateforme utilise une approche différente optimisée pour un rendu natif :

| Plateforme | Technologie | Fenêtre native | Navigateur requis |
|------------|-----------|:--------------:|:-----------------:|
| **macOS** | Swift + WebKit | ✅ | ❌ |
| **Linux** | Python + GTK + WebKitGTK | ✅ | ❌ |
| **Windows** | Mode application Edge (lanceur VBScript) | ✅ | ✅ (Edge/Chrome) |
| **Android/iOS** | Navigateur + « Ajouter à l'écran d'accueil » | Partiel | ✅ |

Toutes les applications de bureau sont **compilées depuis les sources** — il n'y a pas de téléchargements pré-compilés.

---

## Commandes de compilation

Toutes les compilations nécessitent **Node.js 18+** et **Bash** (Git Bash ou WSL sous Windows).

```bash
# Cloner le dépôt
git clone https://github.com/diShine-digital-agency/ai-prompt-library.git
cd ai-prompt-library

# Compiler pour toutes les plateformes
./desktop/build-all.sh

# Ou compiler individuellement
./desktop/build-macos.sh      # macOS
./desktop/build-linux.sh      # Linux
# Windows : utilisez build-all.sh ou build-windows.bat sous Windows
```

**La sortie va dans `dist/` :**

| Plateforme | Archive | Type |
|------------|---------|------|
| macOS (avec Xcode CLI) | `PromptWorkshop-macOS.zip` | Application native (fenêtre propre) |
| macOS (sans Xcode CLI) | `PromptWorkshop.tar.gz` | Mode application de repli (Chrome/Edge) |
| Linux | `prompt-workshop-linux.tar.gz` | Application native GTK |
| Windows | `PromptWorkshop-win.zip` | Mode application Edge |

---

## macOS — Application native

### Ce que vous obtenez

Une **véritable application macOS** qui s'exécute dans sa propre fenêtre — aucun navigateur nécessaire :

- ✅ Sa propre fenêtre avec une barre de titre native
- ✅ Barre de menus complète (Fichier, Édition, Présentation, Fenêtre)
- ✅ Raccourcis clavier standard (⌘C, ⌘V, ⌘Q, ⌘+/⌘- zoom)
- ✅ Icône dans le Dock — épinglez-la dans votre Dock
- ✅ Recherche Spotlight — trouvez-la en tapant « Prompt Workshop »
- ✅ Prise en charge du plein écran (⌃⌘F)
- ✅ Fonctionne entièrement hors ligne
- ✅ Les prompts sauvegardés persistent entre les sessions

### Pré-requis

- **macOS 11+**
- **Outils en ligne de commande Xcode** (pour la compilation de l'application native)
  ```bash
  xcode-select --install
  ```

> **Sans les outils CLI Xcode**, la compilation crée un **mode application de repli** qui s'ouvre dans Chrome/Edge au lieu d'une fenêtre native.

### Compilation et installation

```bash
# 1. Installer les outils en ligne de commande Xcode (REQUIS pour l'app native)
xcode-select --install

# 2. Compiler l'application — cherchez "★ Native build" dans la sortie
./desktop/build-macos.sh

# 3. Installer
mv dist/PromptWorkshop.app /Applications/

# 4. Lancer
open /Applications/PromptWorkshop.app
```

### Structure de l'application

```
PromptWorkshop.app/
└── Contents/
    ├── Info.plist              # Métadonnées de l'app (bundle ID, version, icône)
    ├── MacOS/
    │   └── PromptWorkshop      # Exécutable natif (Swift + WebKit)
    └── Resources/
        └── viewer.html         # Le Prompt Workshop complet
```

### Raccourcis clavier

| Raccourci | Action |
|-----------|--------|
| ⌘Q | Quitter |
| ⌘W | Fermer la fenêtre |
| ⌘C / ⌘V | Copier / Coller |
| ⌘Z / ⇧⌘Z | Annuler / Rétablir |
| ⌘+ / ⌘- | Zoom avant / arrière |
| ⌘0 | Réinitialiser le zoom |
| ⌃⌘F | Basculer en plein écran |
| ⌘R | Recharger |
| ⌘M | Réduire |
| ⌘H | Masquer |

Plus tous les raccourcis intégrés à l'application (1–7 pour les onglets, Ctrl+K pour la recherche, H pour l'aide, D pour le mode sombre).

### Stockage des données

Vos prompts sauvegardés et paramètres sont stockés dans le magasin de données WebKit de l'application :

- ✅ Les données persistent entre les redémarrages et les mises à jour de l'app
- ✅ Séparées des données du navigateur — vider Safari/Chrome n'affecte pas l'app
- ⚠️ Si vous supprimez l'app, vos données sont perdues — **exportez votre bibliothèque d'abord**

---

## Linux — Application native

### Ce que vous obtenez

Une **application Linux native** s'exécutant dans sa propre fenêtre :

- ✅ Sa propre fenêtre (pas de barre d'adresse ni d'onglets du navigateur)
- ✅ Entrée dans le menu des applications — recherchez « Prompt Workshop »
- ✅ Raccourcis clavier (Ctrl+C/V, Ctrl+±, F11 plein écran)
- ✅ Fonctionne entièrement hors ligne
- ✅ Les prompts sauvegardés persistent entre les sessions

### Pré-requis

La fenêtre native nécessite GTK + WebKitGTK (pré-installés sur la plupart des distributions de bureau) :

| Distribution | Paquets nécessaires | Pré-installés ? |
|-------------|-------------------|:---------------:|
| Ubuntu/Debian | `python3-gi gir1.2-webkit2-4.0` | ✅ Oui (GNOME) |
| Fedora | `python3-gobject webkit2gtk3` | ✅ Oui |
| Arch | `python-gobject webkit2gtk` | ⚠️ Installation possible |
| Linux Mint | `python3-gi gir1.2-webkit2-4.0` | ✅ Oui |

Si absents, l'app bascule vers le mode application Chrome/Edge ou votre navigateur par défaut.

**Pour la prise en charge du presse-papiers :** installez `xclip` (`sudo apt install xclip`).

### Compilation et installation

```bash
# 1. Compiler le paquet Linux
./desktop/build-linux.sh

# 2. Extraire et installer
cd dist
tar -xzf prompt-workshop-linux.tar.gz
cd prompt-workshop
./install.sh

# 3. Lancer
prompt-workshop
```

Vous pouvez également double-cliquer sur `install.sh` depuis votre gestionnaire de fichiers — sous GNOME, une boîte de dialogue affiche la progression et un message « ✅ Installed! ».

### Contenu du paquet

```
prompt-workshop/
├── viewer.html               # Le Prompt Workshop complet
├── prompt-workshop            # Lanceur intelligent (natif → app-mode → navigateur)
├── prompt-workshop-app.py     # Application native GTK + WebKit
├── prompt-workshop.png        # Icône de l'application
├── prompt-workshop.desktop    # Fichier d'entrée de bureau
└── install.sh                 # Installateur graphique (double-cliquer pour installer)
```

### Emplacements d'installation

| Fichier | Emplacement |
|---------|------------|
| Fichiers de l'app | `~/.local/share/prompt-workshop/` |
| Lanceur | `~/.local/bin/prompt-workshop` |
| Entrée de bureau | `~/.local/share/applications/prompt-workshop.desktop` |

### Désinstallation

```bash
rm -rf ~/.local/share/prompt-workshop
rm -f ~/.local/bin/prompt-workshop
rm -f ~/.local/share/applications/prompt-workshop.desktop
```

---

## Windows — Application de style natif

### Ce que vous obtenez

Une **application Windows de style natif** utilisant le mode application de Microsoft Edge :

- ✅ Sa propre fenêtre (pas de barre d'adresse, pas d'onglets)
- ✅ Raccourci sur le bureau avec icône personnalisée
- ✅ Entrée dans le menu Démarrer — recherchez « Prompt Workshop »
- ✅ Intégration à la barre des tâches — épinglez à la barre des tâches
- ✅ Fonctionne entièrement hors ligne
- ✅ Aucun droit administrateur nécessaire
- ✅ Aucune modification du registre

### Fonctionnement

L'application s'ouvre en **mode application Microsoft Edge** — une fenêtre épurée sans éléments d'interface du navigateur. Edge est pré-installé sur Windows 10/11.

**Chaîne de repli :** mode application Edge → mode application Chrome → navigateur par défaut

### Compilation et installation

Nécessite Bash (Git Bash ou WSL) et Node.js 18+.

```bash
# 1. Compiler (depuis Git Bash ou WSL)
./desktop/build-all.sh

# 2. Extraire le zip depuis dist/
# 3. Double-cliquer sur Install.bat
```

`Install.bat` crée :
- Un **raccourci sur le bureau** (avec icône personnalisée)
- Une **entrée dans le menu Démarrer** (recherchable comme « Prompt Workshop »)

### Contenu du paquet

```
PromptWorkshop-win/
├── viewer.html               # Le Prompt Workshop complet
├── PromptWorkshop.vbs        # Lanceur de style natif (mode application Edge)
├── PromptWorkshop.bat        # Lanceur de repli (navigateur par défaut)
├── PromptWorkshop.ico        # Icône de l'application
├── Install.bat               # Installateur en un clic
├── Uninstall.bat             # Désinstallateur en un clic
└── README.txt                # Guide de démarrage rapide
```

### Utilisation portable

Vous ne voulez pas installer ? Double-cliquez simplement sur `PromptWorkshop.vbs` directement depuis n'importe quel dossier.

### Désinstallation

Double-cliquez sur `Uninstall.bat`, ou supprimez manuellement :
- Le dossier `%LocalAppData%\PromptWorkshop\`
- Le raccourci du bureau
- Le raccourci du menu Démarrer

---

## Android et iOS

Le Prompt Workshop fonctionne dans n'importe quel navigateur mobile moderne comme fichier HTML autonome.

### Android

1. Transférez `viewer.html` sur votre appareil (e-mail, stockage cloud, USB)
2. Ouvrez-le dans Chrome
3. Appuyez sur le menu ⋮ → **« Ajouter à l'écran d'accueil »**
4. Lancez depuis votre écran d'accueil comme une application classique

### iOS / iPadOS

1. Transférez `viewer.html` sur votre appareil (AirDrop, iCloud Drive, e-mail)
2. Ouvrez-le dans Safari
3. Appuyez sur le bouton de partage (↑) → **« Sur l'écran d'accueil »**
4. Lancez depuis votre écran d'accueil

> **Note :** iOS requiert Safari pour « Ajouter à l'écran d'accueil » — les autres navigateurs ne prennent pas en charge cette fonctionnalité.

---

## Résolution de problèmes

### macOS : l'application s'ouvre dans le navigateur au lieu de sa propre fenêtre

La compilation a créé le **mode application de repli** au lieu de l'application native.

**Cause :** les outils en ligne de commande Xcode ne sont pas installés (pas de compilateur `swiftc`).

**Solution :**
```bash
xcode-select --install       # Installer les outils CLI Xcode
./desktop/build-macos.sh     # Recompiler — cherchez "★ Native build"
mv dist/PromptWorkshop.app /Applications/
```

### macOS : icône de l'application absente dans le Dock

```bash
# Vider le cache d'icônes et redémarrer le Finder
sudo rm -rf /Library/Caches/com.apple.iconservices.store
killall Dock
```

### macOS : « L'application est endommagée et ne peut pas être ouverte »

C'est Gatekeeper de macOS qui bloque les applications non signées. Corrigez avec l'une de ces méthodes :

1. **Clic droit** sur l'app → cliquez **Ouvrir** → cliquez **Ouvrir** dans la boîte de dialogue
2. Exécutez : `xattr -cr /Applications/PromptWorkshop.app`
3. Allez dans **Réglages système → Confidentialité et sécurité** → cliquez **Ouvrir quand même**

### macOS : erreur de compilation « swiftc: command not found »

Installez les outils en ligne de commande Xcode : `xcode-select --install`

### Linux : « Permission denied » sur install.sh

```bash
chmod +x install.sh && ./install.sh
```

Ou clic droit → Propriétés → Permissions → cochez « Autoriser l'exécution du fichier comme programme ».

### Linux : application absente du menu des applications

```bash
update-desktop-database ~/.local/share/applications/
```

### Linux : `~/.local/bin` absent du PATH

```bash
# Ajouter à ~/.bashrc ou ~/.zshrc
export PATH="$HOME/.local/bin:$PATH"
source ~/.bashrc
```

### Windows : SmartScreen « Windows a protégé votre PC »

1. Cliquez sur **« Plus d'infos »**
2. Cliquez sur **« Exécuter quand même »**

Cela ne se produit qu'une seule fois pour les fichiers téléchargés depuis internet.

### Windows : l'antivirus bloque le fichier .vbs

- Utilisez `PromptWorkshop.bat` à la place
- Ou ouvrez `viewer.html` directement dans votre navigateur
- Ou ajoutez une exception dans votre antivirus

### Windows : l'application s'ouvre dans le navigateur complet

Edge n'a pas été trouvé. Installez [Microsoft Edge](https://www.microsoft.com/edge) ou Google Chrome — le lanceur utilisera le mode application.

---

## Sauvegarde des données

Avant de mettre à jour ou de désinstaller, exportez vos données :

1. Ouvrez le Prompt Workshop
2. Allez dans l'onglet **Ma bibliothèque** (ou cliquez 📚)
3. Cliquez sur **Exporter tout en JSON**
4. Sauvegardez le fichier

Pour restaurer : **Ma bibliothèque** → **Importer JSON** → sélectionnez votre fichier de sauvegarde.

---

**Navigation :** [← Architecture](Architecture.md) &nbsp;|&nbsp; [Contribuer →](Contribuer.md)
