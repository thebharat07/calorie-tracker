# 🥗 Calorie Tracker Application

A full-stack, production-ready health and nutrition tracking application featuring daily calorie logging, macronutrient & micronutrient analytics, interactive progress charts, and **AI-powered meal nutrition extraction from photos** using Google Gemini Vision.

---

## 📑 Table of Contents

1. [Features](#-features)
2. [Demo Video & Walkthrough](#-demo-video--walkthrough)
3. [Architecture & Tech Stack](#-architecture--tech-stack)
4. [Assumptions Made](#-assumptions-made)
5. [Prerequisites](#-prerequisites)
6. [Environment Configuration](#-environment-configuration)
7. [Option 1: Quickstart with Docker Compose (Recommended)](#-option-1-quickstart-with-docker-compose-recommended)
8. [Option 2: Local Development Setup (Without Docker)](#-option-2-local-development-setup-without-docker)
9. [Option 3: Cloud Deployment (Render / VPS)](#-option-3-cloud-deployment-render--vps)
10. [API Endpoints & Swagger Documentation](#-api-endpoints--swagger-documentation)
11. [Testing & Code Quality](#-testing--code-quality)
12. [Project Structure](#-project-structure)

---

## ✨ Features

- **Dashboard & Calorie Goals**: Set daily calorie targets, target weight, and macro splits (Protein, Carbs, Fat) with real-time percentage progress indicators.
- **AI Photo Nutrition Extraction**: Upload or snap a picture of your meal; the backend leverages Google Gemini Vision (`gemini-3.5-flash-lite`) to detect food items, portion size, calories, and complete micro/macro breakdowns.
- **Detailed Meal Logging**: Log meals across categories (`BREAKFAST`, `LUNCH`, `DINNER`, `SNACK`) with custom serving units.
- **Nutrition Analytics & Charts**:
  - 7-day calorie trend vs. daily goal (Recharts).
  - Macro distribution breakdown (bar and pie charts).
  - Micronutrient tracking (Dietary Fiber, Sugar, Sodium, Calcium, Iron, Potassium, Vitamins A, C, D) against standard Recommended Daily Allowances (RDA).
- **Log History & Filtering**: Filter meal logs by date ranges, search by meal type, and navigate pages with server-side pagination.
- **Clean Architecture & Containerization**: Fully dockerized with multi-stage builds, non-root users, health checks, and optional single-port Nginx ingress.

---

## 🎬 Demo Video & Walkthrough

Watch the application in action — covering the interactive dashboard, nutrition goal tracking, meal logging, and automated photo nutrition extraction powered by Google Gemini Vision:

[▶ Download / watch the demo video](https://github.com/thebharat07/calorie-tracker/releases/download/Demo/Demo.mp4)

---

## 🏗 Architecture & Tech Stack

```
                          ┌─────────────────────────────┐
                          │    Browser / Client Web     │
                          └──────────────┬──────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
      (Port 3000 / Direct)                            (Port 80 / Optional)
                 │                                               │
                 ▼                                               ▼
  ┌─────────────────────────────┐                 ┌─────────────────────────────┐
  │     Next.js 16 Frontend     │                 │     Nginx Reverse Proxy     │
  │     • React 19 + TypeScript │                 │     • Port 80 Ingress       │
  │     • Tailwind CSS v4       │                 │     • Gzip + 10MB Uploads   │
  │     • Standalone Server     │                 └──────────────┬──────────────┘
  └──────────────┬──────────────┘                                │
                 │                                               │
                 │ (Internal Proxy /api/*)                       │
                 ▼                                               │
  ┌──────────────────────────────────────────────────────────────▼──────────────┐
  │                         Spring Boot 3.4.3 Backend                           │
  │                         • Java 21 LTS                                       │
  │                         • Spring Data JPA + Hibernate (ddl-auto=validate)   │
  │                         • Flyway Automated Migrations                       │
  │                         • Google Gemini Vision API Integration              │
  │                         • SpringDoc OpenAPI / Swagger UI (Port 8080)        │
  └──────────────────────────────┬───────────────────────────────┬──────────────┘
                                 │                               │
                 ┌───────────────┘                               └──────────────┐
                 ▼                                                              ▼
  ┌─────────────────────────────┐                                ┌─────────────────────────────┐
  │   Local PostgreSQL 16 DB    │  -- OR Switchable in .env -->  │   Cloud Supabase Database   │
  │   (Port 5432, Volume Mount) │                                │   (PostgreSQL Pooler)       │
  └─────────────────────────────┘                                └─────────────────────────────┘
```

| Layer | Technologies |
|---|---|
| **Frontend** | [Next.js 16 (App Router)](https://nextjs.org), [React 19](https://react.dev), [TypeScript 5](https://www.typescriptlang.org), [Tailwind CSS v4](https://tailwindcss.com), [Lucide Icons](https://lucide.dev), [Recharts](https://recharts.org) |
| **Backend** | [Spring Boot 3.4.3](https://spring.io/projects/spring-boot), [Java 21](https://www.oracle.com/java/), [Spring Data JPA](https://spring.io/projects/spring-data-jpa), [Flyway](https://flywaydb.org/), [Hibernate](https://hibernate.org/), [SpringDoc OpenAPI 2.8.5](https://springdoc.org/) |
| **Database** | PostgreSQL 16 (Local Docker container or [Supabase](https://supabase.com)) |
| **AI Vision** | Google Gemini Vision (`gemini-3.5-flash-lite` or `gemini-3.8-flash`) |
| **DevOps / Container** | Docker, Docker Compose, Multi-stage builds, Alpine/Jammy minimal images, Nginx |

---

## 📌 Assumptions Made

1. **User Identity & Single-User Model**:
   - The system is architected around a seeded default user UUID (`00000000-0000-0000-0000-000000000001`) initialized automatically by Flyway migration (`V1__init.sql`).
   - All food entries, goals, and analytical aggregations are scoped to this user via foreign key relationships.
   - *Rationale*: This enables out-of-the-box instant usability without requiring mandatory authentication setup (OAuth/JWT) while keeping the database schema fully relational and ready for multi-tenant auth in the future.

2. **Database Migrations vs. ORM Generation**:
   - Flyway is the single source of truth for database schema management (`backend/src/main/resources/db/migration/V1__init.sql`).
   - Hibernate is configured with `ddl-auto=validate` to prevent accidental runtime schema mutations.
   - Both local PostgreSQL and cloud Supabase connections are fully supported without code alterations.

3. **AI Vision Graceful Fallback (Mock Mode)**:
   - If a valid `GEMINI_API_KEY` is not provided in `.env`, the backend does **not** crash or fail health checks.
   - Instead, the image extraction service gracefully returns a realistic mock nutritional breakdown so developers and evaluators can test the complete photo upload UI and flow without needing an active Google Cloud billing account.

4. **API Proxying & CORS Strategy**:
   - In containerized environments, the Next.js frontend uses internal Next.js rewrites (`/api/:path*` -> `${BACKEND_INTERNAL_URL}/api/:path*`) or Nginx ingress.
   - This eliminates cross-origin browser issues (CORS), hardcoded localhost IP conflicts, and allows deployment on arbitrary hostnames and ports.
   - If `NEXT_PUBLIC_API_URL` is explicitly set, the frontend client can also communicate with the backend directly.

5. **Date & Time Standards**:
   - Food entry logs use ISO calendar dates (`YYYY-MM-DD`) representing the user's localized day of consumption.
   - Audit columns (`created_at`, `updated_at`) are stored as UTC `TIMESTAMP WITH TIME ZONE`.

---

## ⚙️ Prerequisites

Depending on your chosen runtime method:

- **For Docker Deployment**:
  - [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v24.0+)
  - [Docker Compose](https://docs.docker.com/compose/) (v2.20+)
- **For Local Development (Without Docker)**:
  - [Node.js](https://nodejs.org/) (v20.x or v22.x LTS) & npm
  - [Java Development Kit (JDK 21)](https://adoptium.net/)
  - [PostgreSQL 15+](https://www.postgresql.org/) OR a free [Supabase](https://supabase.com) account

---

## 🔐 Environment Configuration

Create a root `.env` file from the provided template:

```bash
cp .env.example .env
```

### Environment Variables Reference

| Variable | Required | Default in Docker | Description |
|---|---|---|---|
| `POSTGRES_USER` | Optional | `postgres` | Local PostgreSQL username |
| `POSTGRES_PASSWORD` | Optional | `postgres` | Local PostgreSQL password |
| `POSTGRES_DB` | Optional | `postgres` | Local PostgreSQL database name |
| `POSTGRES_PORT` | Optional | `5432` | Exposed host port for local PostgreSQL |
| `DB_URL` | Optional | `jdbc:postgresql://postgres:5432/postgres` | JDBC connection URL (point to Supabase if desired) |
| `DB_USER` | Optional | `postgres` | Database username for Spring Boot |
| `DB_PASSWORD` | Optional | `postgres` | Database password for Spring Boot |
| `GEMINI_API_KEY` | Optional | *(empty)* | Google Gemini API key for photo nutrition analysis |
| `FRONTEND_PORT` | Optional | `3000` | Host port mapped to Next.js |
| `BACKEND_PORT` | Optional | `8080` | Host port mapped to Spring Boot REST API |
| `HTTP_PORT` | Optional | `80` | Host port mapped to optional Nginx reverse proxy |
| `CORS_ALLOWED_ORIGINS` | Optional | `http://localhost:3000,...` | Comma-separated allowed CORS origins |
| `NEXT_PUBLIC_API_URL` | Optional | *(empty)* | Public API URL if browser calls backend directly |

> [!TIP]
> **Using Supabase instead of local PostgreSQL?**
> Set your Supabase JDBC connection string in `.env`:
> ```env
> DB_URL=jdbc:postgresql://<project-ref>.pooler.supabase.com:5432/postgres
> DB_USER=postgres.<project-ref>
> DB_PASSWORD=your_supabase_password
> ```

---

## 🚀 Option 1: Quickstart with Docker Compose (Recommended)

This single command builds and starts the **PostgreSQL database**, **Spring Boot backend**, and **Next.js frontend** containers on a private network:

```bash
# Start all containers in the background
npm run docker:up
# or
docker compose up -d --build
```

### Accessing the Services

- **Web Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend REST API**: [http://localhost:8080/api](http://localhost:8080/api)
- **Interactive Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **PostgreSQL Database**: `localhost:5432`

### Single-Port Ingress via Nginx (Port 80)

To expose both frontend and backend through a production-grade Nginx reverse proxy on standard HTTP Port 80:

```bash
docker compose --profile nginx up -d
```
Access the application at [http://localhost](http://localhost).

### Useful Docker Management Commands

```bash
# View real-time container logs
npm run docker:logs
# or
docker compose logs -f

# Check health status of all containers
docker compose ps

# Stop all running containers (preserves database data)
npm run docker:down
# or
docker compose down

# Stop and wipe database volume (clean database reset)
docker compose down -v
```

---

## 💻 Option 2: Local Development Setup (Without Docker)

### 1. Database Setup
Ensure PostgreSQL is running locally on port 5432 (or use Supabase). Create a database named `postgres`:
```sql
CREATE DATABASE postgres;
```

### 2. Run the Spring Boot Backend
In the `backend` directory, create a `.env` file (or set system environment variables):
```properties
DB_URL=jdbc:postgresql://localhost:5432/postgres
DB_USER=postgres
DB_PASSWORD=postgres
GEMINI_API_KEY=your_key_here
```

Run the backend via Gradle:
```bash
# On Linux / macOS:
./backend/gradlew -p backend bootRun

# On Windows:
.\backend\gradlew.bat -p backend bootRun
```
*The backend starts at `http://localhost:8080`. Flyway will run migrations automatically upon startup.*

### 3. Run the Next.js Frontend
In a new terminal window:
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
*The frontend starts at `http://localhost:3000` with hot-module reloading enabled.*

---

## ☁️ Option 3: Cloud Deployment (Render / VPS)

### Deploying to Render
A pre-configured [`render.yaml`](file:///d:/projects/typeface/calorie-tracker/render.yaml) blueprint is included in the root directory:

1. Push your repository to GitHub or GitLab.
2. Log in to [Render](https://render.com) and click **New + → Blueprint**.
3. Connect your repository. Render will detect `render.yaml` and configure:
   - `calorie-tracker-backend`: Docker web service with healthcheck at `/swagger-ui.html`.
   - `calorie-tracker-frontend`: Docker web service with healthcheck at `/`.
4. Enter your environment variables (`DB_URL`, `DB_USER`, `DB_PASSWORD`, `GEMINI_API_KEY`) in the Render Dashboard.

### Deploying to a Linux VPS (Ubuntu / Debian / EC2 / Droplet)
1. Install Docker & Docker Compose:
   ```bash
   curl -fsSL https://get.docker.com | sh
   ```
2. Clone repository & configure `.env`:
   ```bash
   git clone <repo-url> calorie-tracker
   cd calorie-tracker
   cp .env.example .env
   nano .env
   ```
3. Run with Nginx ingress on Port 80:
   ```bash
   docker compose --profile nginx up -d --build
   ```

---

## 📡 API Endpoints & Swagger Documentation

Interactive OpenAPI documentation and live request testing is available at:
👉 **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

### Key Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/goals` | Retrieve current user nutrition and weight goals |
| `PUT` | `/api/goals` | Update daily calories, macros, and weight targets |
| `GET` | `/api/entries` | List meal entries with date filtering (`?from=&to=`), meal type, and pagination |
| `POST` | `/api/entries` | Create a new food log entry |
| `GET` | `/api/entries/{id}` | Retrieve details of a specific entry by UUID |
| `PUT` | `/api/entries/{id}` | Update an existing food entry |
| `DELETE` | `/api/entries/{id}` | Delete a food entry |
| `GET` | `/api/reports/weekly-calories` | 7-day calorie totals compared against target goal |
| `GET` | `/api/reports/macros` | Macro totals (protein, carbs, fat) grouped by day or week |
| `GET` | `/api/reports/micros` | Average daily intake for 9 essential micronutrients |
| `GET` | `/api/reports/goal-vs-actual` | Target vs. actual intake with percentage achieved |
| `POST` | `/api/extract` | Upload food photo (`multipart/form-data`) for AI nutrition extraction |

---

## 🧪 Testing & Code Quality

### Backend JUnit & Integration Tests
```bash
# Run unit & integration tests using H2 in-memory test database
./backend/gradlew -p backend test
```

### Frontend Linting & Type-checking
```bash
# Check TypeScript types and ESLint rules
npm --prefix frontend run lint

# Verify production Next.js standalone build
npm --prefix frontend run build
```

---

## 📁 Project Structure

```
calorie-tracker/
├── backend/                              # Spring Boot 3.4 Java backend
│   ├── src/main/java/com/tracker/
│   │   ├── config/                       # OpenAPI, CORS, and AI client configuration
│   │   ├── controller/                   # Entry, Goal, Report, and Extract REST controllers
│   │   ├── dto/                          # Request/response data transfer objects
│   │   ├── entity/                       # JPA entities (FoodEntry, Goal, User)
│   │   ├── exception/                    # Global exception handling & error responses
│   │   ├── mapper/                       # Entity <-> DTO mappers
│   │   ├── repository/                   # Spring Data JPA repositories
│   │   └── service/                      # Core business logic & Gemini Vision extraction
│   ├── src/main/resources/
│   │   ├── application.properties        # Backend configuration
│   │   └── db/migration/V1__init.sql     # Flyway database schema & initial seed
│   ├── Dockerfile                        # Multi-stage JDK 21 build & JRE 21 runtime
│   ├── build.gradle                      # Gradle dependencies and plugins
│   └── .dockerignore                     # Excludes build and Gradle caches
│
├── frontend/                             # Next.js 16 web application
│   ├── src/app/                          # Next.js App Router (pages: /, /log, /entries, /goals, /reports)
│   ├── src/components/                   # Reusable UI, charts (Recharts), and forms
│   ├── src/hooks/                        # Custom React data hooks (useEntries, useGoals, etc.)
│   ├── src/lib/api.ts                    # Strongly-typed REST client
│   ├── src/types/                        # TypeScript domain interfaces
│   ├── next.config.ts                    # Standalone build & API rewrites configuration
│   ├── Dockerfile                        # Multi-stage Node 20 build & standalone runner
│   └── .dockerignore                     # Excludes node_modules and .next cache
│
├── nginx/
│   └── nginx.conf                        # Production reverse proxy (Port 80 routing & 10MB photo upload)
│
├── .dockerignore                         # Global Docker build exclusions
├── .env.example                          # Environment configuration template
├── .gitignore                            # Git exclusion rules (secrets, build files, caches)
├── docker-compose.yml                    # Multi-container orchestration (Postgres, Backend, Frontend, Nginx)
├── render.yaml                           # Cloud blueprint for Render deployment
├── DOCKER.md                             # Detailed Docker operations and cloud deployment guide
└── README.md                             # Main documentation
```
