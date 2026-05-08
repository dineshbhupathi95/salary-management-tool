# Salary Management Tool

Full-stack assignment solution using:
- Backend: FastAPI + SQLAlchemy + SQLite
- Frontend: React (Vite + TypeScript)
- Testing: Pytest (API and insights tests)

## Features

- Employee CRUD via UI and API
- Salary insights:
  - Min, max, average, median salary by country
  - Average salary by job title in a country
  - Global overview metrics (total/active/inactive employees, global average)
- Seed script to generate 10,000 employees from first and last name files

## Project Structure

```
salary-management-tool/
  backend/
    app/
    scripts/
    tests/
    data/
  frontend/
```

## Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m pytest
python -m scripts.seed_data
uvicorn app.main:app --reload
```

Backend runs at `http://127.0.0.1:8000`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://127.0.0.1:5173`.

## Important API Endpoints

- `POST /employees`
- `GET /employees`
- `GET /employees/{employee_id}`
- `PUT /employees/{employee_id}`
- `DELETE /employees/{employee_id}`
- `GET /insights/country/{country}`
- `GET /insights/country/{country}/job-title/{job_title}`
- `GET /insights/overview`

## Seed Script

Run:

```bash
cd backend
python -m scripts.seed_data
```

This clears existing employees and inserts 10,000 records in batches for speed.

## Artifacts

The following artifacts explain planning, architecture, and engineering decisions:

- `docs/planning-notes.md`
- `docs/architecture.md`
- `docs/ai-prompts-and-usage.md`
- `docs/tradeoffs.md`
- `docs/performance-considerations.md`
