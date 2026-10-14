# SpendPilot AI — Frontend Client Application

[![React](https://img.shields.io/badge/React_19-Frontend-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_8-Bundler-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-26_Passed-brightgreen)](https://vitest.dev/)

The frontend of SpendPilot AI is built with **React 19**, **Vite 8**, and **Tailwind CSS**, designed for high responsiveness, fast time-to-interactive, and enterprise-grade FinOps data visualization.

---

## 🛠️ Architecture & Core Components

```text
client/src/
├── api/                        # Axios clients communicating with the Express backend
│   ├── authApi.js              # User registration, login, and profile fetching
│   ├── leadApi.js              # Lead submission for audit notifications
│   └── reportApi.js            # Report creation, fetching, and history retrieval
│
├── components/                 # Reusable UI components
│   ├── AuditHistoryModal.jsx   # Version diffing & past audit snapshot viewer
│   ├── CommandPalette.jsx      # Cmd/Ctrl + K command palette for rapid navigation
│   ├── EmailReportModal.jsx    # Form to email executive audit summaries
│   ├── Navbar.jsx              # Fixed sticky navigation with mobile drawer
│   ├── RepoScanner.jsx         # Public GitHub repository AI dependency scanner
│   ├── ShareAuditModal.jsx     # Viral 1-click social share dialog (X, LinkedIn, WhatsApp)
│   ├── Toast.jsx               # Responsive floating toast notification system
│   ├── TokenCalculator.jsx     # Multi-model LLM token pricing & caching calculator
│   └── WhatIfSimulator.jsx     # Real-time scenario planning & seat downsizing tool
│
├── data/
│   ├── demoAudits.js           # Curated demo audits for instantaneous testing
│   └── toolData.js             # Pricing catalog for supported AI tools & plans
│
├── pages/
│   ├── AuditForm.jsx           # Dynamic audit form with validation & preset loading
│   ├── Home.jsx                # High-conversion landing page with live previews
│   └── Results.jsx             # Comprehensive analytics dashboard & report view
│
└── utils/                      # Client-side FinOps calculation engines & utilities
    ├── auditEngine.js          # Heuristic rule-based plan right-sizing engine
    ├── auditHistory.js         # LocalStorage persistence & snapshot diff calculator
    ├── exportCsv.js            # Excel-compliant UTF-8 CSV generator
    ├── pdfGenerator.js         # Client-side executive PDF report generator (jsPDF)
    ├── repoScanner.js          # GitHub Git Trees API parser & dependency matcher
    └── tokenPricing.js         # Benchmark token rates & prompt caching calculator
```

---

## 🚀 Key Client Capabilities

### 1. 🔍 GitHub Repository Scanner (`RepoScanner.jsx` + `repoScanner.js`)
- Queries the GitHub Git Trees API (`/git/trees/main?recursive=1`) to identify manifests across monorepos and subdirectories.
- Parses `package.json`, `requirements.txt`, `pyproject.toml`, Jupyter notebooks (`.ipynb`), `.cursorrules`, `.windsurfrules`, and `.env.example`.
- Separates commercial billable SaaS seats from open-source libraries and self-hosted vector databases (`LangChain`, `ChromaDB`, `Ollama`), avoiding false-positive cost injections.

### 2. 🧮 Multi-Model Token Calculator (`TokenCalculator.jsx` + `tokenPricing.js`)
- Real-time catalog of frontier model pricing (per 1M input / 1M output / cached input tokens) across `GPT-4o`, `Claude 3.5 Sonnet`, `Gemini 1.5 Pro/Flash`, `DeepSeek-V3`, and `Llama 3.3 70B`.
- Interactive sliders for monthly input/output token volume and prompt caching hit ratios.
- Calculates migration arbitrage savings when transitioning legacy workloads (e.g., GPT-4 $\rightarrow$ GPT-4o-mini).

### 3. 📄 Certified Executive PDF Generator (`pdfGenerator.js`)
- Generates a branded, standalone 2-page executive summary PDF using `jspdf`.
- Formats executive overview cards, full tooling breakdown tables, ghost seat findings, and model migration advisories.

### 4. ⏱️ Audit Snapshot History & Version Diff (`AuditHistoryModal.jsx` + `auditHistory.js`)
- Persists audit runs in `localStorage` under `spendpilot_audit_history`.
- Side-by-side **Audit Diff Engine** computes:
  - $\Delta$ Monthly spend reduction
  - $\Delta$ Added savings
  - $\Delta$ Efficiency score progress
  - Ghost seat reductions and tool additions/removals

### 5. ⚡ Performance & Bundle Optimization
- Built using Vite 8 with manual chunk splitting in `vite.config.js`:
  - `vendor-react`: React, React-DOM, React Router
  - `vendor-charts`: Recharts
  - `vendor-icons`: Lucide React
- Route code-splitting via `React.lazy` and `Suspense` ensures fast first contentful paint (FCP < 1.0s).

---

## 🧪 Testing

The client includes 26 automated unit tests written in **Vitest**:

```bash
# Run all unit tests once
npm test -- --run

# Run tests in watch mode during development
npm test
```

### Verified Test Suites:
- `auditEngine.test.js` — Rule-based right-sizing & ghost seat calculations.
- `repoScanner.test.js` — URL parsing, manifest detection, zero-tool baseline verification.
- `tokenPricing.test.js` — Token cost models & prompt caching discount math.
- `auditHistory.test.js` — Local persistence & version diff computations.
- `exportCsv.test.js` — CSV assembly & Excel UTF-8 BOM encoding.
- `simulator.test.js` — What-If scenario manipulation.

---

## 📦 Building for Production

```bash
# Compile and bundle assets to /dist
npm run build

# Preview production build locally
npm run preview
```
