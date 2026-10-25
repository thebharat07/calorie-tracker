# Calorie Tracker Application

A full-stack, production-ready health & nutrition tracker application featuring automated meal nutrition extraction from photos powered by Google Gemini Vision.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts
- **Backend**: Java 21, Spring Boot 3.4.3, Spring Data JPA, Hibernate, Flyway Migrations, SpringDoc OpenAPI / Swagger UI
- **Database**: PostgreSQL 16 (local container) or Supabase Cloud
- **AI Vision**: Google Gemini 3.8 Flash for photo-to-nutrition parsing
- **Containerization**: Multi-stage Dockerfiles and Docker Compose orchestration

---

## Quick Start with Docker

The fastest way to run the entire application:

```bash
# 1. Clone the repository and enter the directory
git clone <repo-url> calorie-tracker
cd calorie-tracker

# 2. Copy the environment template
cp .env.example .env

# 3. Start all services (PostgreSQL, Backend, Frontend)
docker compose up -d --build
```

### Accessing the Services

- **Web Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)
- **OpenAPI Swagger Docs**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **Local PostgreSQL**: `localhost:5432`

For detailed Docker instructions and cloud deployment strategies, see [DOCKER.md](file:///d:/projects/typeface/calorie-tracker/DOCKER.md).

---

## Local Development (Without Docker)

### 1. Prerequisites
- Node.js 20+
- Java 21 JDK
- PostgreSQL database (or Supabase project)

### 2. Run the Frontend
```bash
npm --prefix frontend install
npm --prefix frontend run dev
```

### 3. Run the Backend
```bash
./backend/gradlew -p backend bootRun
```

---

## Repository Structure

```
calorie-tracker/
├── backend/                  # Spring Boot 3.4 Java backend
│   ├── src/                  # Controllers, services, JPA repositories, Flyway migrations
│   ├── Dockerfile            # Multi-stage Java 21 container build
│   └── build.gradle          # Gradle build configuration
├── frontend/                 # Next.js 16 web application
│   ├── src/                  # App router pages, React components, API client
│   ├── Dockerfile            # Multi-stage Node 20 standalone build
│   └── package.json          # Dependencies & scripts
├── nginx/                    # Production reverse proxy config
│   └── nginx.conf            # Single-port ingress routing
├── docker-compose.yml        # Multi-container orchestration
├── .dockerignore             # Global build context exclusions
├── .env.example              # Environment variables template
└── DOCKER.md                 # Full deployment guide
```
