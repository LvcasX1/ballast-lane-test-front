# 📚 Cygnvs Library Frontend

A responsive React + TypeScript app built with Vite and Ant Design for managing a small library. It supports public browsing, member borrowing, and librarian CRUD with a polished Catppuccin-themed UI and subtle animations.

## 🚀 Quick start

Prerequisites:
- Node.js 18+ and npm

Install and run:
- npm install
- Copy .env.example to .env and set VITE_API_URL (defaults to /api for same-origin proxy)
- npm run dev

Build and preview:
- npm run build
- npm run preview

## 🔧 Environment

Create a .env file at project root:
- VITE_API_URL: API base URL (e.g., http://localhost:3000 or /api)

A sample is in .env.example.

## 🧰 Tech stack
- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Ant Design v5](https://ant.design/) (dark theme customized to [Catppuccin Mocha](https://catppuccin.com/))
- [React Router v7](https://reactrouter.com/)
- [Axios](https://axios-http.com/) with interceptors
- [@tanstack/react-query](https://tanstack.com/query/latest) provider (room for server-driven data)
- [react-spring](https://www.react-spring.dev/) animations via shared Animated components

## 👥 Roles and access
- 👤 Guest:
  - Public Home landing with CTAs and highlights
  - Public Books listing (read-only). “Sign in to borrow” hints shown
- 📖 Member:
  - Can borrow books from the book details modal
  - Member dashboard: stats and tables for Active and Overdue borrowings, with details modal
- 🛡️ Librarian:
  - Full Books CRUD (create, edit, delete) via actions menu and Create button
  - Librarian dashboard: stats and a table of members with overdue books, plus details modal

Auth state uses sessionStorage. Role never exists without a valid token. Interceptors clear token/role on 401/403 and redirect to /login when appropriate.

## 🗺️ App overview
- Home: Shows guest landing when logged out; shows Member or Librarian dashboard when logged in depending on role
- Books 📚:
  - AntD Table with search, sorting on all columns, fixed layout, and mobile horizontal scroll
  - Availability, Remaining Copies, and details modal with Borrow action (gated by login and disabled if already borrowed)
  - Librarian actions via 3-dots dropdown (Edit/Delete) and Create Book button
- Global UX ✨:
  - Empty states unified via ConfigProvider renderEmpty
  - Mobile-friendly header and a themed, animated mobile side menu
  - Row click opens book details; actions dropdown does not trigger row click

## 📜 Scripts
- npm run dev: Start Vite dev server
- npm run build: Build for production
- npm run preview: Preview production build locally

## 📝 Notes
- Ensure your backend exposes the required endpoints (sessions, books CRUD, borrowings, dashboards).
- Update VITE_API_URL to point to your API or configure a dev proxy.

## 📈 Diagrams

### 🏗️ High-level architecture
```mermaid
flowchart LR
  A[Browser: React + Ant Design\nVite + TS] -->|Axios| B[(API)]
  subgraph Frontend
    A
  end
  subgraph Backend
    B --- B1[/Sessions/]
    B --- B2[/Books CRUD/]
    B --- B3[/Borrowings/]
    B --- B4[/Dashboards/]
  end
  A -. Interceptor 401/403, clear token+role, redirect /login .-> A
```

### 🔐 Auth/session flow
```mermaid
flowchart TD
  L[Login form] --> S[POST /session]
  S -->|200| T[Store token + optional role in sessionStorage<br/>Set Authorization header]
  S -->|401/403| E[Show error]
  T --> U[Use app]
  U -->|401/403| C[From API<br/>Clear token+role<br/>Redirect to /login]
  C --> U
  Lx[Logout action] --> C
```

### 🧭 Routing map and guards
```mermaid
flowchart TD
  R[/Router/] --> H[/\/]:::pub
  R --> B[/\/books/]:::pub
  R --> LG[/\/login/]:::guest
  R --> SU[/\/sign-up/]:::guest

  classDef pub fill:#94e2d5,stroke:#89b4fa,color:#1e1e2e
  classDef guest fill:#f9e2af,stroke:#fab387,color:#1e1e2e

  LG -->|GuestOnly| LG
  SU -->|GuestOnly| SU
```

### ✅ Roles and permissions
```mermaid
flowchart LR
  Guest -->|Read| Books[Browse books]
  Guest -->|Visit| Home[Home landing]

  Member -->|Borrow| Borrow[Borrow from modal]
  Member -->|View| MDash[Member dashboard]

  Librarian -->|CRUD| LBooks[Books CRUD]
  Librarian -->|View| LDash[Librarian dashboard]
```

### 🔁 Borrow sequence (member)
```mermaid
sequenceDiagram
  participant U as User
  participant UI as Book Modal
  participant API as Backend API

  U->>UI: Open modal
  UI->>UI: Compute remaining copies
  alt Not logged in
    UI-->>U: Show sign-in hint
  else Logged in
    UI->>UI: Check if already borrowed
    alt Already borrowed or no stock
      UI-->>U: Disable Borrow
    else Can borrow
      U->>UI: Click Borrow
      UI->>API: POST /borrowings { book_id }
      API-->>UI: 201 Created
      UI->>UI: Update borrowings_count
      UI-->>U: Success + close
    end
  end
```
