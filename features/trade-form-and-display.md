# Update Trade Forms and Displays for Tags

## Goal
Allow users to assign one or more tags to a trade during creation and editing, and surface the associated tags within trade detail/list views.

## Key Changes
- **Trade create/edit forms**: Add a multi-select component (e.g., combobox with search) backed by the tags catalogue. Support selecting multiple existing tags, setting a primary tag (optional), and removing selections.
- **Tag suggestions**: Provide UX for creating tags inline if the desired tag does not yet exist (optional, depending on scope alignment with the dedicated tags page).
- **Trade detail and list views**: Display assigned tags as badges or chips, using consistent styling. Show both the primary tag (if set) and additional tags.
- **Data plumbing**: Update form state management, API calls, and Supabase mutations to send/receive tag associations and the nullable primary tag column.

## Tasks
1. Audit existing trade form components to determine where to insert tag selection inputs.
2. Create a reusable tag multi-select UI element with search/filter, keyboard support, and clear option.
3. Wire the tag selection to Supabase queries/mutations, ensuring the join table and primary tag column stay in sync.
4. Update trade detail/list components to render tag badges with accessible labels and color coding.
5. Handle loading, empty states, validation feedback, and error scenarios (e.g., unable to fetch tags).
6. Add tests (unit or integration) covering form submission with multiple tags, removal, and display logic.

## Acceptance Criteria
- Users can add, edit, and remove tags on trades through the UI.
- Tag selections persist to Supabase and are reflected in subsequent reads.
- Trade list/detail pages render associated tags clearly and accessibly.
- Automated tests cover core interactions and regression cases.
