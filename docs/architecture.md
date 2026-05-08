# Architecture Overview

## High-Level Design

- Frontend: React (Vite + TypeScript + Ant Design)
- Backend: FastAPI + SQLAlchemy
- Database: SQLite
- Tests: Pytest for backend APIs and insights logic

## Runtime Flow

1. User performs actions in React UI.
2. UI calls FastAPI endpoints using fetch-based API client.
3. FastAPI route handlers validate input with Pydantic.
4. SQLAlchemy interacts with SQLite tables.
5. Responses are returned as typed JSON payloads to UI.

## Backend Modules

- `app/main.py`: route declarations and dependency wiring.
- `app/models.py`: SQLAlchemy ORM models.
- `app/schemas.py`: request/response Pydantic models.
- `app/crud.py`: data operations and insight calculations.
- `app/database.py`: engine/session setup.

## Frontend Modules

- `src/App.tsx`: layout, nav tabs, search/sort state, modal state.
- `src/components/EmployeeForm.tsx`: create/update form.
- `src/components/EmployeeTable.tsx`: employee listing and row actions.
- `src/components/InsightsPanel.tsx`: metrics controls and cards.
- `src/api/client.ts`: API methods and query param construction.

## Data Model

`Employee` fields:
- `id`
- `full_name`
- `job_title`
- `country`
- `salary`
- `department`
- `status`
- `created_at`
- `updated_at`

## API Surface

- `POST /employees`
- `GET /employees` with query params:
  - `skip`, `limit`
  - `name` (search by full name)
  - `sort_by` (`id`, `full_name`, `job_title`, `country`, `salary`, `created_at`)
  - `sort_order` (`asc`, `desc`)
- `GET /employees/{id}`
- `PUT /employees/{id}`
- `DELETE /employees/{id}`
- `GET /insights/country/{country}`
- `GET /insights/country/{country}/job-title/{job_title}`
- `GET /insights/overview`
