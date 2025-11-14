# Design Tag-Based Trade Filtering

## Goal
Enable users to filter trade datasets by tags, determining the most intuitive UX for tag-based filtering across existing views.

## Questions to Resolve
- Should tag filtering live as a global filter in the primary trades table, or should it be a dedicated view focused on tagged segments?
- How should multiple tag selections behave (AND vs. OR logic) and how is this communicated to users?
- Do we need saved filters or quick presets for frequently used tag combinations?

## Proposed Approaches
1. **Global filter control**
   - Add a tag filter component to the main trades page toolbar.
   - Persist selections in URL query params or application state to support sharing/bookmarking.
   - Display active filters as chips with clear/remove options.
2. **Dedicated tag-focused view**
   - Create a separate page (e.g., `/trades/tags`) that highlights tag-based analytics and segment views.
   - Surface tag metadata (usage counts, performance metrics) alongside filtered trade lists.
   - Potentially include saved tag sets or comparisons.
3. **Hybrid approach**
   - Provide a lightweight global filter for quick narrowing plus a deeper dive page for advanced analysis.

## Tasks
1. Review current trades listing UX and identify entry points for additional filters.
2. Prototype UI mockups/wireframes for the chosen approach(es), validating space and interactions.
3. Define filtering logic (AND/OR) and implement backend queries or Supabase RPC to support it.
4. Update front-end state management to fetch filtered trades and keep pagination/sorting consistent.
5. Add visual indicators of active filters and controls to clear them.
6. Write tests covering filtering behavior, including no matches and combination scenarios.

## Acceptance Criteria
- Clear decision on global vs. dedicated filtering experience, documented for the team.
- Implemented UI allowing users to filter trades by one or multiple tags.
- Filtering integrates with existing sorting, pagination, and export features (if any).
- Tests validate query correctness and UI feedback.
