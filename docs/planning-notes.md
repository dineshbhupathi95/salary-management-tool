# Planning and Design Notes

## Goal

Build a minimal but usable salary management tool for an HR manager handling up to 10,000 employees.

## Product Scope

- Employee management: create, view, update, delete.
- Salary insights:
  - Min / max / average salary by country.
  - Average salary by job title in a country.
  - Additional HR-friendly overview metrics.

## Non-Functional Goals

- Keep solution easy to run locally.
- Keep API and UI simple and deterministic.
- Support regular reseeding with 10,000 rows efficiently.
- Use clear structure that is easy to review in an interview setting.

## Iterative Delivery Plan

1. Establish backend model, schema, and tests for core CRUD.
2. Add insights endpoints and tests.
3. Add fast seed script with batch inserts.
4. Build frontend for employee workflows.
5. Improve UX with Ant Design layout and modal-driven create/edit flow.
6. Move search/sort to backend for scale.
7. Add docs artifacts and submission notes.

## Validation Checklist

- API endpoints are callable and return valid responses.
- CRUD operations update data correctly in SQLite.
- Insights return expected metrics for controlled test data.
- Search/sort works server-side (including `created_at` sort).
- UI supports primary HR flows with low friction.
