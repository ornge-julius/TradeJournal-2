# Update Supabase Schema for Trade Tags

## Goal
Introduce a tagging system that allows trades to reference one or more user-defined tags while preserving existing functionality and data integrity.

## Key Changes
- **Create `tags` table**: Columns include `id` (UUID primary key), `user_id` (foreign key to users or profiles), `name` (text, unique per user), optional `color` or `description`, and timestamps.
- **Create `trade_tags` join table**: Columns include `trade_id` (foreign key to `trades`), `tag_id` (foreign key to `tags`), plus timestamps. Enforce uniqueness on `(trade_id, tag_id)` to prevent duplicates and enable many-to-many relationships.
- **Add optional tag reference on `trades`**: Introduce a nullable column (e.g., `primary_tag_id` or `default_tag_id`) that defaults to `NULL` for backwards compatibility and quick filtering. Ensure this column references `tags.id` and stays in sync with the join table when set.
- **Set up row-level security (RLS)**: Mirror existing policies so users can access only their own tags and tag associations.

## Tasks
1. Inspect current Supabase tables to confirm trade identifiers, ownership fields, and RLS policies.
2. Write SQL migration(s) to create `tags` and `trade_tags` tables with appropriate constraints, indexes, and cascading behavior.
3. Add the nullable foreign-key column on `trades` with a default of `NULL` and update existing DML or triggers if necessary.
4. Update Supabase client types (e.g., generated types or ORM definitions) to include new tables and relationships.
5. Backfill or migrate existing data if prior tag information exists.
6. Test queries for creating tags, assigning them to trades, maintaining the optional single-tag column, and ensuring cascading deletes behave as expected.

## Acceptance Criteria
- New tables exist with correct relationships and RLS policies.
- Trades can be associated with multiple tags via the join table, and the optional single-tag column defaults to `NULL` when unused.
- Supabase types/build tooling compile without errors.
- Migration scripts are idempotent and safe to run in production.
