# SpendPilot AI — Backend REST API & Server

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express_5-Framework-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-Database-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tests](https://img.shields.io/badge/Tests-5_Passed-brightgreen)](https://nodejs.org/api/test.html)

The SpendPilot AI server is a production-grade REST API built with **Express 5**, **Node.js (ES Modules)**, and **MongoDB Atlas**. It handles audit report persistence, user authentication, transactional email workflows, and strict request validation.

---

## 🏛️ Architecture & Clean MVC Structure

```text
server/
├── config/                     # Database connection setup
│   └── db.js
│
├── controllers/                # Clean MVC business logic controllers
│   ├── authController.js       # User registration, login, and profile fetching
│   ├── leadController.js       # Lead capture & email dispatch
│   └── reportController.js     # Audit report CRUD & Resend email workflows
│
├── middleware/                 # Interceptors and security policies
│   ├── authMiddleware.js       # JWT verification & optional auth loaders
│   ├── schemas.js              # Zod schemas for input validation
│   └── validation.js           # Generic Zod validation middleware
│
├── models/                     # Mongoose database models
│   ├── Lead.js                 # Lead subscription captures
│   ├── Report.js               # Stored AI spend audits and metrics
│   └── User.js                 # Authenticated user accounts & bcrypt hashes
│
├── routes/                     # Pure route definitions mapping to controllers
│   ├── authRoutes.js           # /api/auth endpoints
│   ├── leadRoutes.js           # /api/leads endpoints
│   └── reportRoutes.js         # /api/reports endpoints
│
├── tests/                      # Automated API & schema validation test suites
│   └── api.test.js             # Node native test runner test suite
│
├── server.js                   # Application entry point & middleware mounting
└── package.json
```

---

## 📡 API Endpoint Reference

### 1. Reports API (`/api/reports`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/reports` | Optional | Create and persist a new AI tooling audit report. |
| `GET` | `/api/reports/:id` | Public | Retrieve a verified audit report by ID. |
| `GET` | `/api/reports/user/history` | Required (`Bearer JWT`) | Fetch past audit reports created by the authenticated user. |
| `DELETE` | `/api/reports/:id` | Required (`Bearer JWT`) | Delete an audit report (enforces owner authorization). |
| `POST` | `/api/reports/:id/email` | Public | Dispatch executive audit summary email via Resend API. |

#### Sample Report Creation Payload:
```json
{
  "tools": [
    {
      "tool": "Cursor",
      "plan": "Pro",
      "seats": 10,
      "monthlyCost": 20,
      "useCase": "coding"
    },
    {
      "tool": "OpenAI API",
      "plan": "Starter",
      "seats": 5,
      "monthlyCost": 50,
      "useCase": "development"
    }
  ]
}
```

---

### 2. Authentication API (`/api/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new enterprise user account and return signed JWT. |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials and return signed JWT. |
| `GET` | `/api/auth/me` | Required (`Bearer JWT`) | Retrieve current authenticated user profile. |

---

### 3. Leads API (`/api/leads`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/leads` | Public | Capture user email for audit updates and trigger confirmation. |

---

## 🛡️ Security Policies

1. **Helmet HTTP Headers:** Sets strict HTTP headers including `X-Content-Type-Options`, `X-Frame-Options` (anti-clickjacking), and referrer policies.
2. **API Rate Limiting:** `express-rate-limit` enforces a threshold of 100 requests per 15-minute window per IP to safeguard against brute-force attacks and abuse.
3. **Zod Validation Middleware:** All request bodies are strictly sanitized and validated against typed Zod schemas before reaching controller logic.
4. **Password Hashing:** Passwords are encrypted using `bcryptjs` with 10 salt rounds.
5. **CORS Isolation:** CORS is configured to allow credentials and authorized origins.

---

## 🧪 Testing

The server includes automated test suites powered by the **Node.js Native Test Runner** (`node:test` + `node:assert`):

```bash
# Run server test suite
npm test
```

### Verified Test Cases:
- `reportSchema` validation with compliant tool configurations.
- Rejection of invalid tool configurations or empty tool arrays.
- `leadSchema` email validation and formatting rejection.

---

## ⚙️ Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/spendpilot?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
RESEND_API_KEY=your_resend_api_key_here
ADMIN_EMAIL=your_email@domain.com
```

---

## 🚀 Running the Server Locally

```bash
# Install dependencies
npm install

# Start in development mode with nodemon auto-reload
npm run dev

# Start in production mode
npm start
```
Server runs by default at `http://localhost:5000`.
