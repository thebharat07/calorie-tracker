# Docker Deployment Guide for Calorie Tracker

This document provides complete instructions for containerizing, building, and deploying the Calorie Tracker application using Docker and Docker Compose.

---

## 1. Architecture Overview

The containerized stack consists of:

```
                      +-----------------------------+
                      |       Client / Browser      |
                      +--------------+--------------+
                                     |
              +----------------------+----------------------+
              |                                             |
   (Direct / Reverse Proxy)                             (Optional)
              |                                             |
              v                                             v
+-----------------------------+               +-----------------------------+
|   Next.js 16 Frontend       |               |    Nginx Reverse Proxy      |
|   (Port 3000)               |               |    (Port 80 Ingress)        |
|   • Node 20 Alpine          |               +--------------+--------------+
|   • Standalone Server       |                              |
|   • Non-root `nextjs` user  |                              |
+--------------+--------------+                              |
               |                                             |
               | (Internal API Proxy `/api/*`)               |
               v                                             v
+---------------------------------------------------------------------------+
|   Spring Boot 3.4 REST API                                                |
|   (Port 8080)                                                             |
|   • Eclipse Temurin JDK 21 / JRE 21 Jammy                                 |
|   • Non-root `spring` user                                                |
|   • Flyway automated database migrations                                  |
|   • Google Gemini Vision extraction                                       |
+------------------------------------+--------------------------------------+
                                     |
                                     v
+---------------------------------------------------------------------------+
|   PostgreSQL 16 Database                                                  |
|   (Port 5432, Named Volume `postgres_data`)                               |
|   * Or connect to Supabase Cloud via `.env`                               |
+---------------------------------------------------------------------------+
```

---

## 2. Quickstart

### Prerequisites
- Docker Engine 24.0+
- Docker Compose v2.20+

### Step 1: Clone and Configure Environment

```bash
# Copy template environment file
cp .env.example .env
```

*(Optional)* Edit `.env` to add your **Google Gemini API Key**:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### Step 2: Build and Launch Containers

Using npm shortcut:
```bash
npm run docker:up
```

Or using Docker Compose directly:
```bash
docker compose up -d --build
```

### Step 3: Access the Application

| Service | URL | Description |
|---|---|---|
| **Web Frontend** | [http://localhost:3000](http://localhost:3000) | Dashboard, meal logs, charts & AI photo uploader |
| **Backend REST API** | [http://localhost:8080/api](http://localhost:8080/api) | Spring Boot REST endpoints |
| **OpenAPI / Swagger UI** | [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) | Interactive API documentation |
| **PostgreSQL Database** | `localhost:5432` | User: `postgres`, Password: `postgres` |

---

## 3. Database Modes

### Option A: Built-in Local PostgreSQL (Default)
When you run `docker compose up -d`, a local PostgreSQL 16 container starts automatically with persistent storage in the `postgres_data` Docker volume. Flyway automatically runs all database migrations (`V1__init.sql`) on startup and seeds the default user.

### Option B: Cloud Supabase Database
To connect your Dockerized backend to a cloud Supabase database instead of the local PostgreSQL container:

1. In `.env`, set:
   ```properties
   DB_URL=jdbc:postgresql://<project-ref>.pooler.supabase.com:5432/postgres
   DB_USER=postgres.<project-ref>
   DB_PASSWORD=your_supabase_password
   ```
2. Restart backend:
   ```bash
   docker compose up -d --no-deps backend
   ```

---

## 4. Single-Port Deployment with Nginx (Optional)

To expose the entire application on standard HTTP **port 80** behind an Nginx reverse proxy with Gzip compression and security headers:

```bash
docker compose --profile nginx up -d
```

- Web App: [http://localhost](http://localhost)
- API: [http://localhost/api](http://localhost/api)
- Swagger Docs: [http://localhost/swagger-ui.html](http://localhost/swagger-ui.html)

---

## 5. Daily Docker Operations

### View Real-Time Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

### Check Container Health Status
```bash
docker compose ps
```
All healthy containers will display `(healthy)`.

### Stop the Application
```bash
# Stop containers (preserves database data)
npm run docker:down
# or
docker compose down

# Stop and wipe database volume (clean reset)
docker compose down -v
```

### Rebuild After Code Changes
```bash
docker compose up -d --build
```

---

## 6. Production Deployment Strategies

### Deploying to a Linux VPS (Ubuntu / Debian / Droplet / EC2)

1. **Install Docker & Docker Compose**:
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER
   ```
2. **Clone your repository & navigate to directory**:
   ```bash
   git clone <repo-url> calorie-tracker
   cd calorie-tracker
   ```
3. **Configure production `.env`**:
   ```bash
   cp .env.example .env
   # Add your production database credentials & Gemini API key
   nano .env
   ```
4. **Run containers with automatic restart**:
   ```bash
   docker compose --profile nginx up -d --build
   ```

### Deploying to Cloud Container Registries (Docker Hub, AWS ECR, GCP Artifact Registry)

Build and tag each service individually:

```bash
# Build & tag backend
docker build -t your-registry/calorie-tracker-backend:latest ./backend
docker push your-registry/calorie-tracker-backend:latest

# Build & tag frontend
docker build -t your-registry/calorie-tracker-frontend:latest ./frontend
docker push your-registry/calorie-tracker-frontend:latest
```

---

## 7. Security & Optimization Highlights

1. **Multi-Stage Builds**:
   - Backend build uses JDK 21, runtime uses stripped JRE 21.
   - Frontend build uses Node 20, runtime packages only the standalone bundle (`.next/standalone`) without bloated `node_modules`.
2. **Unprivileged Users**:
   - Backend runs as system user `spring:spring` (UID 1001).
   - Frontend runs as system user `nextjs:nodejs` (UID 1001).
3. **Container Health Checks**:
   - All services define active health checks to ensure dependent services only start when dependencies are fully ready.
4. **Layer Caching**:
   - Gradle wrapper and dependencies are cached before compiling source code.
   - `package.json` and `package-lock.json` are cached before compiling TypeScript.
