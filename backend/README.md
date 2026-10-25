# Calorie Tracker Backend (Spring Boot + Supabase + Gemini Vision)

A robust, production-ready Spring Boot backend for the Calorie Tracker application, backed by **Supabase PostgreSQL**, schema migrations via **Flyway**, and meal photo nutrition extraction using **Google Gemini Vision**.

---

## 1. Supabase Setup

1. Create a project at [Supabase](https://supabase.com) and copy your database password.
2. Go to **Project Settings → Database → Connection string → JDBC**.
3. **Session Pooler (Recommended)**: Use port `5432` or `6543`.
   ```
   jdbc:postgresql://<project-ref>.pooler.supabase.com:5432/postgres
   ```
4. Set the environment variables in `.env` or system environment:
   ```properties
   DB_URL=jdbc:postgresql://<host>:5432/postgres
   DB_USER=postgres.<project-ref>
   DB_PASSWORD=your_db_password
   ```

Hibernate uses `ddl-auto=validate` to verify table definitions while **Flyway** manages migration schemas via `src/main/resources/db/migration/V1__init.sql`.

---

## 2. Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DB_URL` | JDBC Connection String | `jdbc:postgresql://localhost:5432/postgres` |
| `DB_USER` | PostgreSQL Username | `postgres` |
| `DB_PASSWORD` | PostgreSQL Password | `postgres` |
| `GEMINI_API_KEY` | Google Gemini Vision API Key | *(empty - fallback demo mode enabled)* |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins | `http://localhost:3000,http://127.0.0.1:3000` |

---

## 3. Database Schema

- **`users`**: `id` (UUID PK), `name`, `created_at`.
  - Default user seeded: `00000000-0000-0000-0000-000000000001`
- **`goals`**: `id` (UUID PK), `user_id` (UUID FK unique), `daily_calories`, `protein_g`, `carbs_g`, `fat_g`, `current_weight_kg`, `target_weight_kg`, `updated_at`.
- **`food_entries`**: `id` (UUID PK), `user_id` (UUID FK), `entry_date`, `meal_type` (`BREAKFAST`, `LUNCH`, `DINNER`, `SNACK`), `food_name`, `quantity`, `unit`, `calories`, `protein_g`, `carbs_g`, `fat_g`, `fiber_g`, `sugar_g`, `sodium_mg`, `calcium_mg`, `iron_mg`, `potassium_mg`, `vitamin_a_mcg`, `vitamin_c_mg`, `vitamin_d_mcg`, `created_at`, `updated_at`.
  - Index: `(user_id, entry_date)`.

---

## 4. API Endpoints

### Goals
- **`GET /api/goals`**: Returns current goals (404 if none set).
- **`PUT /api/goals`**: Upserts goals (`@Positive` and `@Max` validation).

### Food Entries CRUD & Listing
- **`POST /api/entries`**: Create food entry (`@Valid`).
- **`GET /api/entries?from=&to=&mealType=&page=&size=`**: Filtered range list with pagination (`PagedResponse: { items, page, size, totalElements, totalPages }`).
- **`GET /api/entries/{id}`**: Get entry by UUID (scoped to current user).
- **`PUT /api/entries/{id}`**: Update entry details.
- **`DELETE /api/entries/{id}`**: Delete entry.

### Nutrition Reports (SQL Aggregations)
- **`GET /api/reports/weekly-calories?weekStart=`**: 7 days of daily calories plus target goal (zero-filled for missing days).
- **`GET /api/reports/macros?from=&to=&groupBy=day|week`**: Protein, carbs, fat totals per bucket.
- **`GET /api/reports/micros?from=&to=`**: Average daily micronutrients across active days.
- **`GET /api/reports/goal-vs-actual?from=&to=`**: Targets, daily averages, and percentage achieved.

### Google Gemini Vision AI Extraction
- **`POST /api/extract`**: Accepts multipart photo (JPEG, PNG, WebP up to 5MB) and returns strict nutrition JSON.

---

## 5. Running the Application

### Using Gradle
```bash
# Run tests
gradle test

# Run Spring Boot backend server on port 8080
gradle bootRun
```

### Swagger UI Documentation
Once running, open:
```
http://localhost:8080/swagger-ui.html
```
