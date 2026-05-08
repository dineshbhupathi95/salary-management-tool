# Trade-Off Decisions

## SQLite vs Postgres

Chosen: SQLite for assignment simplicity.

Pros:
- zero setup,
- fast local iteration,
- easy reviewer onboarding.

Cons:
- limited concurrency compared to Postgres,
- fewer production-grade operational controls.

Rationale:
For a coding assessment, reduced setup friction and clarity were prioritized.

## FastAPI Monolith vs Separate Services

Chosen: single FastAPI service for CRUD + insights.

Pros:
- fewer moving parts,
- easier debugging and local run experience,
- faster implementation.

Cons:
- tighter coupling between API layers.

Rationale:
Scope is moderate; one service remains maintainable and easier to evaluate.

## Server-Side Search/Sort vs Client-Side

Chosen: server-side search/sort.

Pros:
- works with large datasets (10k+),
- avoids incorrect filtering on partial client data,
- clearer scalability path.

Cons:
- additional query parameter handling and backend validation.

Rationale:
Correctness at scale is more important than UI-only convenience.

## Modal Form vs Inline Form

Chosen: modal-based create/edit.

Pros:
- cleaner primary screen,
- focused user interaction,
- better perceived UX.

Cons:
- extra state management for modal lifecycle.

Rationale:
Improves workflow clarity for HR personas handling frequent list operations.
