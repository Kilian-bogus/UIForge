<div align="center">

# ⚒️ UIForge

**Visual UI Builder — Drag, Drop, Export.**

<br>

![Version](https://img.shields.io/badge/version-1.0.0-38BDF8?style=for-the-badge)
![Status](https://img.shields.io/badge/status-active-22C55E?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-22C55E?style=for-the-badge)
![Node](https://img.shields.io/badge/node-%3E%3D18-339933?style=for-the-badge&logo=node.js&logoColor=white)

</div>

---

## Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Production Build](#-production-build)
- [Deployment](#-deployment)
  - [Node.js Server](#nodejs-server)
  - [Pterodactyl Panel](#pterodactyl-panel)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Local Development](#-local-development)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 📖 Overview

**UIForge** is a full-featured visual UI builder that lets you design, prototype, and export interfaces directly in the browser. Built with React and powered by a Node.js backend, it provides an intuitive drag-and-drop canvas, a rich component library, and one-click code export.

> **Live Demo:** [http://178.104.142.87:3004](http://178.104.142.87:3004)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🖱️ **Drag & Drop Canvas** | Build pages visually by dragging components onto a live canvas |
| 🧩 **Component Library** | Pre-built components — buttons, cards, inputs, layouts, navbars, and more |
| 🎨 **Live Style Editor** | Tweak colors, spacing, typography, and see changes instantly |
| 📄 **Page Manager** | Create, rename, reorder and delete pages within your project |
| 👥 **User Authentication** | Register, login — each user gets their own projects |
| 📤 **Code Export** | Export your design as clean React/JSX code |
| 🌙 **Dark Mode** | Built-in dark theme for comfortable editing |
| 🔌 **REST API** | Full backend API for projects, pages, components and media |
| 📱 **Responsive** | Works on desktop and tablet |

---

## 🛠 Tech Stack

```
Frontend          Backend           Build Tools
┌────────────┐   ┌────────────┐   ┌────────────┐
│  React 18  │   │  Express   │   │   Vite     │
│  Zustand   │   │   JWT      │   │  TypeScript│
│  dnd-kit   │   │  bcryptjs  │   │ TailwindCSS│
│ Monaco     │   │    UUID    │   │  PostCSS   │
└────────────┘   └────────────┘   └────────────┘
```

- **Frontend:** React 18, TypeScript, Zustand (state), dnd-kit (drag & drop), Monaco Editor, Tailwind CSS
- **Backend:** Express.js, JWT authentication, bcryptjs, JSON file storage
- **Build:** Vite, TypeScript, PostCSS, Autoprefixer

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/uiforge.git
cd uiforge

# Install dependencies
npm install

# Start development server
npm run dev
```

The Vite dev server starts on `http://localhost:5173` and proxies API requests to the backend at `http://localhost:3001`.

In a **second terminal**, start the API server:

```bash
npm run server
```

---

## 🔨 Production Build

Build the frontend for production:

```bash
npm run build
```

This generates the static frontend in the `dist/` folder (TypeScript check + Vite production build).

---

## 📦 Deployment

### Node.js Server

To build a complete deployable package:

```bash
npm run deploy
```

This creates a `deploy/` folder containing everything needed to run on any Node.js server:

```
deploy/
├── index.js          # Express server (API + static files)
├── package.json      # All dependencies (frontend + backend)
└── dist/             # Built frontend
    ├── index.html
    └── assets/
```

Upload the `deploy/` folder to your server and start it:

```bash
cd deploy
npm install
node index.js
```

Your application will be available at:

> **http://178.104.142.87:3004**

> [!TIP]
> Override the port via environment variable: `PORT=8080 node index.js`

---

### Pterodactyl Panel

For **Pterodactyl** (or similar game/server panels):

1. Run `npm run deploy` locally to generate the `deploy/` folder
2. Upload the **contents** of `deploy/` (not the folder itself) to `/home/container/`
3. Set the **Startup Command** to: `node index.js`
4. Make sure the panel runs `npm install` during installation

**Required files in `/home/container/`:**

```
/home/container/
├── index.js
├── package.json
├── dist/
│   ├── index.html
│   └── assets/
```

Pterodactyl handles `npm install` automatically. After that, `node index.js` starts UIForge on port **3004**.

---

## 📁 Project Structure

```
js-ui-builder/
├── index.js               # Production server (ESM, Express + API)
├── package.json            # Root package with all dependencies
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── index.html              # Vite entry HTML
├── deploy.js               # Deploy script (builds deploy/ folder)
├── build.ps1               # PowerShell build script
├── build.bat               # Windows batch build script
├── server/
│   └── index.js            # Development server (CJS, kept for npm run server)
├── src/
│   ├── main.tsx            # React entry point
│   ├── App.tsx             # Root component
│   ├── components/         # React components
│   │   ├── Canvas.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Toolbar.tsx
│   │   ├── ComponentPanel.tsx
│   │   ├── Editor.tsx
│   │   ├── Preview.tsx
│   │   ├── ExportPanel.tsx
│   │   ├── LoginForm.tsx
│   │   ├── ProjectList.tsx
│   │   └── registry.ts
│   ├── store/              # Zustand state stores
│   │   ├── editorStore.ts
│   │   ├── projectStore.ts
│   │   └── uiStore.ts
│   ├── types/              # TypeScript type definitions
│   │   ├── component.ts
│   │   ├── page.ts
│   │   └── project.ts
│   ├── lib/
│   │   └── cn.ts           # Utility for class merging
│   └── export/
│       ├── index.ts
│       └── reactExport.ts
├── dist/                   # Built frontend (generated)
└── deploy/                 # Deployable package (generated by npm run deploy)
```

---

## 🔌 API Endpoints

All API routes are prefixed with `/api`.

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login with email & password |
| `GET`  | `/api/auth/me` | Get current user info *(auth required)* |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/projects` | List all projects *(auth)* |
| `POST` | `/api/projects` | Create a project *(auth)* |
| `GET`  | `/api/projects/:id` | Get project details *(auth)* |
| `PUT`  | `/api/projects/:id` | Update project *(auth)* |
| `DELETE` | `/api/projects/:id` | Delete project *(auth)* |

### Pages

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/pages` | Create a new page *(auth)* |
| `PUT`  | `/api/pages/:id` | Update page *(auth)* |
| `DELETE` | `/api/pages/:id` | Delete page *(auth)* |

### Components

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/pages/:id/components` | Save page components *(auth)* |
| `GET`  | `/api/pages/:id/components` | Get page components *(auth)* |

### Media & Stats

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/media` | List uploaded media *(auth)* |
| `GET`  | `/api/stats` | Get user statistics *(auth)* |

---

## 🖥️ Local Development

Start both the frontend and backend simultaneously:

```bash
# Terminal 1 — Vite dev server (port 5173)
npm run dev

# Terminal 2 — Express API server (port 3001)
npm run server
```

Or use the Vite proxy (already configured in `vite.config.ts`) so API calls from `localhost:5173` are forwarded to `localhost:3001`.

---

## 🧭 Roadmap

- [ ] Drag-and-drop component positioning
- [ ] Component resizing and alignment guides
- [ ] More export targets (HTML/CSS, Vue, Svelte)
- [ ] Custom component creation
- [ ] Team collaboration
- [ ] Database storage (SQLite / PostgreSQL)
- [ ] Plugin system
- [ ] i18n support

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

---

<div align="center">

**Made with ❤️ by the UIForge team**

<br>

<sub>[Report Bug](https://github.com/your-username/uiforge/issues) · [Request Feature](https://github.com/your-username/uiforge/issues) · [178.104.142.87:3004](http://178.104.142.87:3004)</sub>

</div>
