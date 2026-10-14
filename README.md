# SpendPilot AI — Enterprise AI SaaS & FinOps Intelligence Platform

[![React](https://img.shields.io/badge/React_19-Frontend-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_8-Bundler-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express_5-API_Framework-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-Database-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tests](https://img.shields.io/badge/Tests-31_Passed-brightgreen)](https://github.com/HRITIK200/spendpilot-ai)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel_%2B_Render-black)](https://spendpilot-ai-sandy.vercel.app/)

SpendPilot AI is a production-grade Developer FinOps platform that audits organizational AI tooling spend, detects codebase LLM dependencies, models team seat utilization, and delivers actionable right-sizing recommendations to eliminate recurring subscription waste.

---

## 🌐 Live Deployments

- **Interactive Web App (Vercel):** [https://spendpilot-ai-sandy.vercel.app/](https://spendpilot-ai-sandy.vercel.app/)
- **Production REST API (Render):** [https://spendpilot-backend-84ep.onrender.com](https://spendpilot-backend-84ep.onrender.com)
- **GitHub Repository:** [https://github.com/HRITIK200/spendpilot-ai](https://github.com/HRITIK200/spendpilot-ai)

---

## 🚀 Key Features

### 1. 🔍 GitHub Repository AI FinOps & Dependency Scanner
- **One-Click URL Analysis:** Paste any public repository (`owner/repo` or full URL) to inspect codebase architecture.
- **Multi-Manifest Discovery:** Employs the GitHub Git Trees API to parse:
  - Node.js dependencies (`package.json`, monorepo subdirectories)
  - Python requirements (`requirements.txt`, `pyproject.toml`, `Pipfile`)
  - Jupyter Notebooks (`.ipynb` pip installs and import statements)
  - AI IDE configurations (`.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`, `.vscode/extensions.json`)
  - Environment samples (`.env.example`, `.env.local.example`)
- **Accurate Stack Attribution:** Cleanly differentiates **Billable SaaS & LLM APIs** (`OpenAI API`, `Anthropic API`, `Gemini`, `Cursor`, `GitHub Copilot`) from **Free Open-Source Frameworks & Local Vector Stores** (`LangChain`, `LlamaIndex`, `ChromaDB`, `Vercel AI SDK`, `Ollama`).
- **Zero-AI Clean Baseline:** Accurately identifies standard web repositories without false positive Copilot or API billing injections.

### 2. 📄 Certified Executive PDF Report Generator
- **Direct Client-Side Generation:** Instantly creates downloadable, publication-grade executive audit documents powered by `jspdf`.
- **Complete Deliverable:** Includes SpendPilot certification badges, executive summary KPI cards, detailed tool inventory tables with right-sizing recommendations, ghost seat audit findings, and model migration advisories.

### 3. 🧮 Multi-Model LLM Token & Migration Calculator
- **Real-Time Frontier Model Benchmarks:** Compares pricing across `GPT-4o`, `GPT-4o-mini`, `Claude 3.5 Sonnet`, `Claude 3.5 Haiku`, `Gemini 1.5 Pro`, `Gemini 1.5 Flash`, `DeepSeek-V3`, and `Llama 3.3 70B`.
- **Interactive Workload Sliders:** Simulate monthly input tokens (1M–200M), output tokens (500k–50M), and prompt caching hit ratios (0%–90%).
- **Migration Arbitrage Engine:** Dynamic selector comparing "Current Baseline Model $\rightarrow$ Target Model" showing exact monthly and annualized dollar savings.

### 4. ⏱️ Audit Snapshot History & Version Diff Modal
- **Automatic Snapshot Persistence:** Automatically saves generated audit snapshots to local storage with timestamp, spend, and score.
- **Side-by-Side Version Comparison:** Select any two past audits (e.g., *Initial Audit vs. Post-Optimization*) to compute $\Delta$ spend, $\Delta$ savings, score changes, idle seat reductions, and tool stack delta.

### 5. 👻 Ghost Seat & Dormant License Detection
- **Utilization Modeling:** Flags unallocated, dormant, or underutilized seats across paid developer tools.
- **Recoverable Waste Breakdown:** Shows exact monthly and annual dollar waste caused by idle licenses.

### 6. ⌨️ Interactive `Ctrl + K` / `Cmd + K` Command Palette
- **Keyboard-First Navigation:** Instant access to audit forms, demo stack presets, repository scanner, token calculator, audit history, and CSV exports from any page.

### 7. 📅 Enterprise Annual Commitment Discount Simulator
- **Monthly vs. Annual Upfront:** Global toggle between standard monthly billing and 18% enterprise annual commitment discounts across all active developer seats.

### 8. 📱 Responsive Fixed Navigation & Modern UI
- **Fixed Sticky Navbar:** Modern navigation bar with frosted-glass backdrop blur, active page indicators, and zero layout shift.
- **Mobile Drawer:** Touch-friendly slide-out mobile drawer with instant history lookup and keyboard shortcuts.

### 9. 📥 Data Export & Transactional Email Dispatch
- **Excel UTF-8 BOM CSV Export:** Generates clean, Excel-compatible CSV spreadsheets containing all tool configurations, seat allocations, and savings.
- **Executive Emailing:** Dispatches beautifully formatted HTML audit summaries via Resend transactional email API.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19, Vite 8
- **Styling:** Tailwind CSS, PostCSS
- **Data Visualization:** Recharts (Radial Gauge, Bar Charts, Donut Charts)
- **Document Generation:** jsPDF, html2canvas
- **Icons & UI:** Lucide React
- **Testing:** Vitest (26 passing unit tests)

### Backend
- **Runtime:** Node.js (ES Modules)
- **Server:** Express.js 5
- **Database:** MongoDB Atlas with Mongoose ODM
- **Architecture:** Clean MVC Controller Pattern (`reportController.js`, `authController.js`, `leadController.js`)
- **Security:** Helmet, Express-Rate-Limit, CORS origin validation, bcryptjs password hashing, JWT authentication
- **Validation:** Zod schema validation middleware
- **Email Delivery:** Resend Transactional Email API
- **Testing:** Node.js native test runner (`node --test`)

---

## 🏛️ System Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                    SpendPilot AI Client                      │
│                                                              │
│  [ Landing Page ] ─── [ Repo Scanner ] ─── [ Command Palette ] │
│         │                     │                     │        │
│  [ Audit Form ] ──────── [ Results Dashboard ] ────────────── │
│         │                     │                              │
│         │           ┌─────────┴─────────┐                    │
│         │           │                   │                    │
│         ▼           ▼                   ▼                    │
│   [ Rule Engine ] [ Token Calc ]  [ PDF Generator ]          │
│   [ Local History Diff Engine ]   [ CSV Exporter ]           │
└─────────────────────────────┬────────────────────────────────┘
                              │ HTTPS / JSON API
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    Express.js Backend API                    │
│                                                              │
│  [ Helmet & Rate-Limiter ] ─── [ Zod Validation Middleware ] │
│                              │                               │
│  ┌───────────────────────────┼────────────────────────────┐  │
│  ▼                           ▼                            ▼  │
│ [ Auth Controller ]   [ Report Controller ]     [ Lead Controller ]
│  (JWT / bcrypt)       (Audit Storage & CRUD)    (Resend Email API)
└──────────────────────────────┬───────────────────────────────┘
                               │ Mongoose ODM
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                     MongoDB Atlas Cloud                      │
│            Collections: users, reports, leads                │
└──────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```text
SpendPilot-AI/
├── client/                     # React 19 + Vite Frontend Application
│   ├── src/
│   │   ├── api/                # Axios API service clients (reportApi, authApi, leadApi)
│   │   ├── components/         # Reusable UI components
│   │   │   ├── AuditHistoryModal.jsx   # Version comparison & diff modal
│   │   │   ├── CommandPalette.jsx      # Ctrl+K modal launcher
│   │   │   ├── Navbar.jsx              # Fixed sticky navigation with mobile drawer
│   │   │   ├── RepoScanner.jsx         # GitHub repository FinOps scanner UI
│   │   │   ├── ShareAuditModal.jsx     # Social sharing modal (X, LinkedIn, WhatsApp)
│   │   │   ├── TokenCalculator.jsx     # Multi-model LLM token pricing calculator
│   │   │   ├── WhatIfSimulator.jsx     # Real-time scenario planning simulator
│   │   │   └── ...
│   │   ├── data/               # Supported AI tools catalog & demo presets
│   │   ├── pages/              # Primary route views (Home, AuditForm, Results)
│   │   └── utils/              # FinOps calculation engines & utilities
│   │       ├── auditEngine.js          # Core rule-based optimization engine
│   │       ├── auditHistory.js         # Local audit snapshot persistence & diff logic
│   │       ├── exportCsv.js            # Excel-ready CSV export formatter
│   │       ├── pdfGenerator.js         # Client-side executive PDF report generator
│   │       ├── repoScanner.js          # GitHub Git Tree & dependency analyzer
│   │       └── tokenPricing.js         # Frontier LLM token benchmark rates
│   └── package.json
│
├── server/                     # Express.js REST API Backend
│   ├── config/                 # Database configuration
│   ├── controllers/            # Clean MVC business logic controllers
│   │   ├── authController.js           # Authentication & profile management
│   │   ├── leadController.js           # Lead capture & email dispatch
│   │   └── reportController.js         # Report CRUD & Resend email workflow
│   ├── middleware/             # Validation, auth, and security middlewares
│   ├── models/                 # Mongoose schemas (User, Report, Lead)
│   ├── routes/                 # Express route definitions
│   ├── tests/                  # Automated API & schema test suites
│   ├── server.js               # Application entry point
│   └── package.json
│
└── README.md                   # Project overview & documentation
```

---

## ⚡ Quickstart & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/HRITIK200/spendpilot-ai.git
cd spendpilot-ai
```

### 2. Configure Environment Variables

#### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api/reports
VITE_API_BASE_URL=http://localhost:5000
```

#### Server (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/spendpilot?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
RESEND_API_KEY=your_resend_api_key_here
ADMIN_EMAIL=your_email@domain.com
```

### 3. Install Dependencies & Run Locally

#### Run Backend Server:
```bash
cd server
npm install
npm run dev
```

#### Run Frontend Client:
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Automated Testing

SpendPilot AI maintains full automated testing coverage across both frontend and backend codebases:

### Run Client Tests (Vitest)
```bash
cd client
npm test -- --run
```
*Executes 26 unit tests verifying the audit optimization engine, repo scanner, CSV exporter, token pricing calculator, and audit history diffing.*

### Run Server Tests (Node.js Test Runner)
```bash
cd server
npm test
```
*Executes automated API tests validating request schemas, payload constraints, and security.*

---

## 🔒 Security & Quality Standards

- **API Protection:** `express-rate-limit` prevents brute-force attempts and denial-of-service spikes.
- **HTTP Security Headers:** `helmet` sets secure Content-Security-Policy, anti-clickjacking, and XSS protection.
- **Payload Validation:** Strict `zod` schemas validate all incoming API payloads before reaching controllers.
- **CORS Whitelisting:** Configured for cross-origin credentials and strict client domain isolation.
- **Token Security:** Passwords hashed with `bcryptjs` (salt rounds: 10), and authentication managed via signed JSON Web Tokens (JWT).

---

## 👤 Author

**Hritik Pal**
- GitHub: [@HRITIK200](https://github.com/HRITIK200)
- Project: [SpendPilot AI](https://github.com/HRITIK200/spendpilot-ai)
