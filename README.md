<div align="center">
  <br>
  <img src="public/vite.svg" width="64" height="64" alt="UIForge Logo">
  <h1 align="center">⚒️ UIForge</h1>
  <p align="center">
    <strong>Visual UI Builder — Drag, Drop, Export.</strong>
    <br>
    Designe Interfaces visuell im Browser und exportiere sauberen React/HTML-Code.
  </p>
  <br>
  <p>
    <img src="https://img.shields.io/badge/version-2.0.0-3b82f6?style=for-the-badge&labelColor=1e293b" alt="Version 2.0.0">
    <img src="https://img.shields.io/badge/status-stable-22c55e?style=for-the-badge&labelColor=1e293b" alt="Status Stable">
    <img src="https://img.shields.io/badge/license-MIT-22c55e?style=for-the-badge&labelColor=1e293b" alt="MIT License">
    <img src="https://img.shields.io/badge/react-18-3b82f6?style=for-the-badge&labelColor=1e293b&logo=react" alt="React 18">
    <img src="https://img.shields.io/badge/typescript-5.5-3178c6?style=for-the-badge&labelColor=1e293b&logo=typescript" alt="TypeScript 5.5">
  </p>
  <br>
</div>

---

## ✨ Features

<table>
  <tr>
    <td align="center" width="140">
      <br>
      <h3>🖱️</h3>
      <br>
      <b>Drag & Drop</b>
    </td>
    <td width="300">Baue Seiten visuell — ziehe Komponenten per Drag & Drop auf die Leinwand.</td>
    <td align="center" width="140">
      <br>
      <h3>🎨</h3>
      <br>
      <b>Live Editor</b>
    </td>
    <td width="300">Bearbeite Eigenschaften und Styles in Echtzeit mit sofortiger Vorschau.</td>
  </tr>
  <tr>
    <td align="center">
      <br>
      <h3>🧩</h3>
      <br>
      <b>Library</b>
    </td>
    <td>20+ vorgefertigte Komponenten — Container, Cards, Formulare, Navigation uvm.</td>
    <td align="center">
      <br>
      <h3>📄</h3>
      <br>
      <b>Export</b>
    </td>
    <td>Exportiere als React JSX, React TypeScript oder reines HTML+CSS.</td>
  </tr>
  <tr>
    <td align="center">
      <br>
      <h3>↩️</h3>
      <br>
      <b>Undo/Redo</b>
    </td>
    <td>Unbegrenztes Rückgängig & Wiederherstellen für jede Änderung.</td>
    <td align="center">
      <br>
      <h3>📱</h3>
      <br>
      <b>Responsive</b>
    </td>
    <td>Vorschau für Desktop, Tablet und Mobile — inklusive Zoom.</td>
  </tr>
  <tr>
    <td align="center">
      <br>
      <h3>💾</h3>
      <br>
      <b>Lokal speichern</b>
    </td>
    <td>Projekte werden automatisch im Browser gespeichert.</td>
    <td align="center">
      <br>
      <h3>🔌</h3>
      <br>
      <b>REST API</b>
    </td>
    <td>Vollständige Backend-API mit JWT-Authentifizierung.</td>
  </tr>
</table>

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│                      UIForge                            │
├──────────────┬──────────────────┬───────────────────────┤
│   Frontend   │     Backend      │      Build            │
├──────────────┼──────────────────┼───────────────────────┤
│  React 18    │  Express.js      │  Vite 5               │
│  TypeScript  │  JWT Auth        │  TypeScript 5.5       │
│  Zustand     │  bcryptjs        │  Tailwind CSS 3       │
│  dnd-kit     │  JSON Storage    │  PostCSS / Autoprefixer│
│  Monaco      │  UUID            │                       │
│  Lucide Icons│  CORS / Multer   │                       │
│  Tailwind CSS│                  │                       │
└──────────────┴──────────────────┴───────────────────────┘
```

---

## 🚀 Getting Started

### Voraussetzungen

- [Node.js](https://nodejs.org/) v18 oder höher
- npm (wird mit Node.js installiert)

### Installation & Start

```bash
# Repository klonen
git clone https://github.com/dein-username/uiforge.git
cd uiforge

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten (Frontend + API-Proxy)
npm run dev
```

Öffne **http://localhost:5173** im Browser.

Für die vollständige API (optional) in einem zweiten Terminal:

```bash
npm run server
```

---

## 🏗️ Production Build

```bash
npm run build
```

Erzeugt das optimierte Frontend im `dist/` Ordner.

### Deployment-Paket erstellen

```bash
npm run deploy
```

Erstellt einen `deploy/` Ordner mit allem, was für den Server benötigt wird:

```
deploy/
├── index.js          # Express-Server (API + Static Files)
├── package.json      # Alle Dependencies
└── dist/             # Gebautes Frontend
    ├── index.html
    └── assets/
```

Auf dem Server:

```bash
cd deploy
npm install
node index.js
```

Die Anwendung läuft dann auf **http://localhost:3004**.

> **Tipp:** Port über `PORT=8080 node index.js` anpassen.

---

## 📁 Projektstruktur

```
uiforge/
├── index.js                 # Production Server (ESM)
├── index.html               # Vite Entry
├── public/
│   └── vite.svg             # Favicon / Logo
├── src/
│   ├── main.tsx             # React Entry Point
│   ├── App.tsx              # Root Component mit Navigation
│   ├── components/
│   │   ├── registry.ts      # Komponenten-Definitionen (20+ Typen)
│   │   └── BuiltInRenderer.tsx # Render-Logik für alle Komponenten
│   ├── editor/
│   │   ├── Canvas.tsx       # Drag & Drop Leinwand
│   │   ├── Toolbar.tsx      # Werkzeugleiste (Undo, Zoom, Export)
│   │   ├── ComponentPalette.tsx # Komponenten-Auswahl
│   │   ├── PropertiesPanel.tsx   # Eigenschaften-Editor
│   │   └── ExportDialog.tsx # Code-Export Dialog
│   ├── pages/
│   │   ├── Dashboard.tsx    # Projektübersicht
│   │   ├── EditorPage.tsx   # Haupt-Editor (Split-View)
│   │   └── SettingsPage.tsx # Projekteinstellungen
│   ├── store/
│   │   ├── editorStore.ts   # Editor-State (Nodes, History, Selection)
│   │   ├── projectStore.ts  # Projekt-State (Projects, Pages)
│   │   └── uiStore.ts       # UI-State (Panels, Theme, Toasts)
│   ├── types/
│   │   ├── component.ts     # ComponentInstance, PropDefinition
│   │   ├── page.ts          # Page Interface
│   │   └── project.ts       # Project, ProjectSettings
│   ├── export/
│   │   ├── index.ts         # Export-Hub
│   │   └── reactExport.ts   # React/HTML Code-Generatoren
│   ├── lib/
│   │   ├── cn.ts            # Tailwind class merge utility
│   │   └── storage.ts       # localStorage Persistenz
│   ├── preview/
│   │   └── PreviewFrame.tsx # Live-Vorschau
│   └── styles/
│       └── index.css        # Globale Styles, Tailwind, Keyframes
├── server/
│   └── index.js             # Development Server (CJS)
├── deploy.js                # Deployment-Script
├── build.ps1                # PowerShell Build-Script
├── build.bat                # Windows Batch Build
├── vite.config.ts           # Vite-Konfiguration
├── tsconfig.json            # TypeScript-Konfiguration
├── tailwind.config.js       # Tailwind-Konfiguration
├── postcss.config.js        # PostCSS-Konfiguration
└── package.json             # Projekt-Metadaten & Scripts
```

---

## 🔌 API Endpoints

Alle API-Routen sind mit `/api` prefixiert. Authentifizierte Endpoints benötigen einen `Authorization: Bearer <token>` Header.

### Authentication

| Methode | Endpoint | Beschreibung |
|---------|----------|-------------|
| `POST` | `/api/auth/register` | Benutzer registrieren |
| `POST` | `/api/auth/login` | Login (Email & Passwort) |
| `GET` | `/api/auth/me` | Aktuellen Benutzer abrufen * |

### Projekte

| Methode | Endpoint | Beschreibung |
|---------|----------|-------------|
| `GET` | `/api/projects` | Alle Projekte des Benutzers * |
| `POST` | `/api/projects` | Neues Projekt erstellen * |
| `GET` | `/api/projects/:id` | Projektdetails * |
| `PUT` | `/api/projects/:id` | Projekt aktualisieren * |
| `DELETE` | `/api/projects/:id` | Projekt löschen * |

### Seiten & Komponenten

| Methode | Endpoint | Beschreibung |
|---------|----------|-------------|
| `POST` | `/api/pages` | Neue Seite erstellen * |
| `PUT` | `/api/pages/:id` | Seite aktualisieren * |
| `DELETE` | `/api/pages/:id` | Seite löschen * |
| `POST` | `/api/pages/:id/components` | Komponenten speichern * |
| `GET` | `/api/pages/:id/components` | Komponenten abrufen * |

*\* = Authentifizierung erforderlich*

---

## 🧩 Komponenten

| Komponente | Kategorie | Kinder? | Beschreibung |
|-----------|-----------|---------|-------------|
| Container | Layout | ✅ | Flex-Container mit Direction, Justify, Align |
| Section | Layout | ✅ | Abschnitt mit Hintergrund & Padding |
| Grid | Layout | ✅ | CSS-Grid mit einstellbaren Spalten |
| Column | Layout | ✅ | Grid-Spalte mit Span |
| Header | Layout | ✅ | Kopfzeile |
| Footer | Layout | ✅ | Fußzeile mit Hintergrund |
| Heading | Basic | ❌ | Überschrift (H1-H4) |
| Text | Basic | ❌ | Textabsatz |
| Button | Basic | ❌ | Button mit Varianten & Größen |
| Image | Media | ❌ | Bild mit Object-Fit |
| Video | Media | ❌ | YouTube/Vimeo/Direct Embed |
| Input | Form | ❌ | Eingabefeld mit Label |
| Textarea | Form | ❌ | Mehrzeiliges Textfeld |
| Form | Form | ✅ | Formular mit Submit-Button |
| Card | Content | ✅ | Karte mit Shadow & Padding |
| Divider | Basic | ❌ | Horizontale Trennlinie |
| Spacer | Layout | ❌ | Leerraum |
| Link | Basic | ❌ | Hyperlink |
| NavBar | Navigation | ✅ | Navigationsleiste mit Brand |
| RawHTML | Custom | ❌ | Benutzerdefinierter HTML-Code |

---

## 🔧 Bugfixes & Changelog

### Version 2.0.0

- **🔨 Undo/Redo gefixt** — Die History-Engine speichert jetzt korrekt Zwischenzustände; Undo und Redo funktionieren zuverlässig über beliebig viele Schritte
- **🧭 Dashboard-Navigation** — Vom Editor zurück zur Projektübersicht (neuer Zurück-Button in der Toolbar)
- **💾 Lokale Persistenz** — Projekte und Editor-Zustand werden automatisch im Browser gespeichert und beim Neuladen wiederhergestellt
- **🖼️ Favicon** — Eigenes UIForge-Logo als SVG-Favicon
- **🧹 Code bereinigt** — Unbenutzte Imports entfernt, TypeScript strikter
- **🎨 README** — Vollständig überarbeitet mit detaillierter Dokumentation

---

## 🧭 Roadmap

- [x] Lokale Persistenz (localStorage)
- [x] Undo/Redo History
- [ ] Drag & Drop Positionierung (`@dnd-kit`)
- [ ] Komponenten-Resizing & Alignment-Guides
- [ ] Weitere Export-Ziele (Vue, Svelte)
- [ ] Eigene Komponenten erstellen
- [ ] Team-Zusammenarbeit
- [ ] Datenbank-Storage (SQLite / PostgreSQL)
- [ ] Plugin-System
- [ ] i18n / Mehrsprachigkeit

---

## 📄 License

Dieses Projekt steht unter der **MIT License** — frei verwendbar, modifizierbar und verteilbar.

---

<div align="center">
  <br>
  <sub>
    Built with TypeScript, React & ❤️
    <br>
    <a href="http://178.104.142.87:3004">Live Demo</a> ·
    <a href="https://github.com/dein-username/uiforge/issues">Bug melden</a> ·
    <a href="https://github.com/dein-username/uiforge/issues">Feature vorschlagen</a>
  </sub>
  <br>
  <br>
  <img src="https://img.shields.io/badge/made_with-❤️-ef4444?style=flat-square" alt="Made with love">
</div>
