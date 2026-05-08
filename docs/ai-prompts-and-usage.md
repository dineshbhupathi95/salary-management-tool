# AI Prompts and Usage Notes

## How AI Was Used

AI assistance was used to accelerate:
- project scaffolding,
- endpoint and UI implementation,
- iterative UI redesign,
- adding server-side search/sorting,
- creating supporting documentation artifacts.

## Representative Prompt Themes

- "Build complete backend with FastAPI, SQLAlchemy, SQLite from scratch."
- "Add search by name and sorting."
- "Move search/sort from UI to backend API with query params."
- "Redesign UI with top + side nav and Ant Design components."
- "Convert direct create form to modal-based create/edit UX."
- "Add sort by created date."
- "Prepare artifacts explaining architecture and trade-offs."

## Verification and Human Oversight

- Reviewed generated code modules before integrating.
- Ensured API query parameters match frontend usage.
- Added/extended tests for critical behavior (CRUD, insights, sort/search).
- Performed syntax/lint checks after UI/backend changes.
- Adjusted UX flows manually (modal behavior, navigation states).

## AI Boundaries

- AI-generated code was treated as a starting point, not blindly trusted.
- Business logic correctness (insights, sorting semantics, query behavior) was validated with tests and review.
- Final structure and feature decisions were made intentionally for assessment requirements.
