# Performance Considerations

## Seed Script Throughput

Objective: generate and insert 10,000 employees quickly and repeatedly.

Implementation choices:
- Preload first and last name lists once.
- Generate records in memory in batches.
- Use SQLAlchemy bulk insert (`insert(Employee)`) per batch.
- Commit per batch instead of per row.
- Clear existing rows before reseeding for deterministic runs.

Result:
- Lower overhead than single-row insert loops.
- Predictable local performance for repeated engineering runs.

## Read Path Considerations

- Added server-side search by `name` and sorting by key fields.
- Limited response size with `limit` and offset via `skip`.
- Added sortable `created_at` for recent-first workflows.

## Why This Matters for 10k Rows

- UI no longer depends on first 200 items for search correctness.
- Sorting/filtering happens in DB query path, not in browser memory.
- Keeps frontend responsive and avoids loading all rows by default.

## Future Improvements (if expanded)

- Add DB indexes on high-usage query fields (`full_name`, `country`, `job_title`, `created_at`).
- Add total-count API + paginated UI controls.
- Consider Postgres for higher write concurrency and production deployment.
