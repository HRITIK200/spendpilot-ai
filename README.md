# SpendPilot AI

AI-powered SaaS platform that audits company AI tool spending and generates optimization recommendations to reduce infrastructure costs.
![React](https://img.shields.io/badge/React-Frontend-blue)

![Node.js](https://img.shields.io/badge/Node.js-Backend-green)

![MongoDB](https://img.shields.io/badge/MongoDB-Database-darkgreen)

![Vercel](https://img.shields.io/badge/Deployment-Vercel-black)

![Render](https://img.shields.io/badge/API-Render-purple)

![License](https://img.shields.io/badge/Status-Production-success)

## Live Demo

Frontend:
https://spendpilot-ai-sandy.vercel.app/

Backend:
https://spendpilot-backend-84ep.onrender.com

---

# Overview

SpendPilot AI is a production-style MERN SaaS application designed to help organizations analyze and optimize their AI tooling infrastructure costs.

The platform evaluates:
- AI subscriptions
- seat utilization
- workflow alignment
- operational efficiency
- SaaS overspending opportunities

and generates intelligent optimization recommendations.

---

# Key Features

## AI Spend Auditing

Analyze organizational AI infrastructure usage patterns and identify optimization opportunities.

## Optimization Recommendations

Generate actionable recommendations for:
- plan right-sizing
- subscription consolidation
- workflow optimization
- infrastructure efficiency

## Interactive Analytics Dashboard

Visualize:
- monthly savings
- annual savings
- optimization scores
- spend comparisons

using responsive analytics dashboards.

## Public Shareable Reports

Generated audits can be shared using public URLs for collaborative review.

## Lead Capture System

Integrated email capture workflow for future optimization engagement.

## Transactional Email Integration

Automated email delivery using Resend transactional email infrastructure.

## Abuse Protection

API rate limiting added for production-grade backend protection.

## Responsive UI

Fully responsive user experience across:
- desktop
- tablet
- mobile devices

---

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Recharts
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

### Deployment

- Vercel (for Frontend)
- Render (for Backend)

---

## Infrastructure

- Vercel
- Render
- GitHub Actions

## Additional Services

- Resend Email API

---

# Architecture

```text
User
   ↓
React Frontend
   ↓
Express API
   ↓
MongoDB Atlas
```

The frontend handles:
- user interaction
- dashboard rendering
- analytics visualization
- routing

The backend handles:
- report persistence
- audit storage
- lead management
- transactional email workflows
- API protection

---

## Screenshots

### Home Page
![Home](./screenshot/landing_page.png)

### Audit Dashboard
![audit](./screenshot/audit_form.png)

### Results Analytics
![results](./screenshot/results.png)

---

# Local Development Setup

## 1. Clone Repository

```bash
git clone https://github.com/HRITIK200/spendpilot-ai
```

---

## 2. Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

---

### Environment Variables

## client(.env)

```env

VITE_API_URL=https://spendpilot-backend-84ep.onrender.com/api/reports 
VITE_API_BASE_URL=http://localhost:5000
```
---

## Server(.env)

```env

MONGO_URI=mongodb://spendpilotadmin:spendpilot123@ac-5d5dcpw-shard-00-00.jgn3sdo.mongodb.net:27017,ac-5d5dcpw-shard-00-01.jgn3sdo.mongodb.net:27017,ac-5d5dcpw-shard-00-02.jgn3sdo.mongodb.net:27017/spendpilot?ssl=true&replicaSet=atlas-1bfus0-shard-0&authSource=admin&appName=Cluster0

PORT=5000

RESEND_API_KEY=re_CuFVwetU_E6k8LgD36uaVdXsMSjvuGgP2
```

---

# Run Development Servers

## Frontend

```bash
cd client
npm run dev
```

---

## Backend

```bash
cd server
npx nodemon server.js
```

---

# Automated Testing

Run frontend tests:

```bash
npm run test
```

GitHub Actions automatically:
- install dependencies
- run tests
- validate builds

on every push.

---

# Current Optimization Rules

## Small Team Optimization

Downgrades Team plans for small organizations with low seat counts.

## Enterprise Right-Sizing

Recommends Business plans when Enterprise subscriptions are underutilized.

## Workflow Optimization

Suggests specialized coding tools for development-heavy workflows.

---

# Future Improvements

Potential future enhancements include:

- AI-generated recommendation engine
- Stripe billing integration
- organization dashboards
- historical analytics
- recurring optimization alerts
- role-based access control
- multi-tenant architecture
- PDF audit exports
- advanced analytics

---

# Security Features

Current protections include:

- API rate limiting
- environment variable isolation
- MongoDB cloud security
- CORS configuration
- backend API abstraction

---

# CI/CD

GitHub Actions pipeline automatically:

- installs dependencies
- runs automated tests
- validates frontend builds

This ensures deployment quality and engineering reliability.

---

# Design Philosophy

SpendPilot AI was designed as:

- lightweight
- modular
- scalable
- deployment-friendly
- startup-oriented

The architecture prioritizes:
- maintainability
- responsive UX
- operational clarity
- rapid iteration
- clean client/server separation

---

# Author

Hritik Pal

GitHub:
https://github.com/HRITIK200

---

