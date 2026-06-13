<div align="center">

# 🌿 Sanjivini AI

### Your Personal AI Health Guardian

*An intelligent health companion that tracks your vitals, understands your symptoms, and delivers proactive alerts — so you stay ahead of your health, not behind it.*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle%20ORM-4169E1?style=flat-square&logo=postgresql)](https://orm.drizzle.team/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---

## 📌 What is Sanjivini AI?

Sanjivini AI (named after the mythical healing herb) is a **proactive virtual health guidance platform**. Unlike passive health trackers, Sanjivini AI actively monitors user-reported symptoms and vitals, applies AI-driven analysis, and sends **intelligent alerts and suggestions** before small health concerns become serious ones.

> **V1 focus:** Symptom logging + health record management with AI-powered suggestions.  
> **Final vision:** A fully autonomous health guardian with real-time notifications, medication reminders, and longitudinal health trend analysis.

---

## ✨ Key Features

| Feature | Status |
|---|---|
| Health record creation and management | ✅ V1 |
| Symptom logging with AI suggestions | ✅ V1 |
| REST API with full OpenAPI spec | ✅ V1 |
| Zod-validated request/response contracts | ✅ V1 |
| PostgreSQL persistence (Drizzle ORM) | ✅ V1 |
| Real-time health alerts & notifications | 🔜 V2 |
| Medication and appointment reminders | 🔜 V2 |
| Longitudinal health trend analysis | 🔜 V3 |
| Wearable device integration | 🔜 V3 |

---

## 🏗️ Architecture

Sanjivini AI is built as a **pnpm monorepo** with clean separation between the API layer, data layer, and generated client code.

```
sanjivini_AI/
├── artifacts/
│   └── api-server/          # Express 5 REST API (main deployable)
│       └── src/
│           ├── index.ts     # Entry point — reads PORT, starts server
│           ├── app.ts       # Middleware, CORS, route mounting at /api
│           └── routes/      # Feature route handlers
├── lib/
│   ├── api-spec/            # OpenAPI 3.1 spec + Orval codegen config
│   ├── api-client-react/    # Auto-generated React Query hooks
│   ├── api-zod/             # Auto-generated Zod schemas from OpenAPI
│   └── db/                  # Drizzle ORM schema + PostgreSQL connection
├── scripts/                 # Utility/migration scripts
├── tsconfig.base.json       # Shared TS config (composite, bundler, es2022)
├── pnpm-workspace.yaml      # Workspace package globs
└── package.json             # Root scripts and hoisted devDeps
```

### Why this architecture?

- **Single source of truth:** The OpenAPI spec drives both backend validation (`api-zod`) and frontend hooks (`api-client-react`) via Orval codegen — no drift between API and client.
- **Composite TypeScript builds:** Each package is a TS project reference. `tsc --build` resolves the full dependency graph in the correct order.
- **Deployable bundle:** esbuild bundles the API server into a single `dist/index.cjs` — no runtime transpilation needed.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 5.9 |
| Runtime | Node.js 24 |
| API Framework | Express 5 |
| Database | PostgreSQL |
| ORM | Drizzle ORM + drizzle-zod |
| Validation | Zod v4 |
| API Spec | OpenAPI 3.1 (Orval codegen) |
| Client Hooks | React Query (auto-generated) |
| Build | esbuild (CJS bundle) |
| Package Manager | pnpm workspaces |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 24
- [pnpm](https://pnpm.io/) >= 9
- PostgreSQL database (or use the connection string from your cloud provider)

### 1. Clone the repository

```bash
git clone https://github.com/pujaa06/sanjivini_AI.git
cd sanjivini_AI
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment

Create a `.env` file in the root (or in `artifacts/api-server/`):

```env
DATABASE_URL=postgresql://user:password@localhost:5432/sanjivini
PORT=3000
```

### 4. Push the database schema

```bash
pnpm --filter @workspace/db run push
```

### 5. Run the development server

```bash
pnpm --filter @workspace/api-server run dev
```

The API will be available at `http://localhost:3000/api`.  
Health check: `GET http://localhost:3000/api/health`

---

## 🔧 Available Scripts

| Command | Description |
|---|---|
| `pnpm run build` | Typecheck + build all packages |
| `pnpm run typecheck` | Full TypeScript project reference check |
| `pnpm --filter @workspace/api-server run dev` | Start API dev server |
| `pnpm --filter @workspace/api-server run build` | Bundle API → `dist/index.cjs` |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerate Zod schemas + React Query hooks from OpenAPI spec |
| `pnpm --filter @workspace/db run push` | Push schema changes to database |

---

## 📡 API Reference

Base URL: `/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server health check |
| `POST` | `/health-records` | Create a new health record |
| `GET` | `/health-records/:id` | Retrieve a health record |
| `POST` | `/symptoms` | Log a symptom with AI suggestion |
| `GET` | `/symptoms/:userId` | Get symptom history for a user |

> Full API documentation is available via the OpenAPI spec at `lib/api-spec/openapi.yaml`.

---

## 🗺️ Roadmap

### V1 — Foundation *(current)*
- [x] Monorepo setup with TypeScript project references
- [x] Express 5 REST API with OpenAPI-first design
- [x] PostgreSQL + Drizzle ORM data layer
- [x] Auto-generated Zod validation and React Query client
- [ ] Symptom logging endpoint with basic AI suggestion integration
- [ ] Health record CRUD

### V2 — Intelligence Layer
- [ ] AI-driven symptom analysis (Claude / Gemini integration)
- [ ] Push notification alerts for health anomalies
- [ ] Medication and appointment reminder engine
- [ ] User authentication (JWT)

### V3 — Full Guardian
- [ ] Longitudinal health trend dashboards
- [ ] Wearable / IoT device data ingestion
- [ ] Doctor-sharing reports (PDF export)
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push and open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

Built with ❤️ for better health outcomes.

*Sanjivini — the herb that heals.*

</div># Updated
# Contributors: Pujaa06, harshithap053
