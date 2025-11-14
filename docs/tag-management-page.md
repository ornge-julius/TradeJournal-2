# Build Tags Management Page

## Goal
Provide a dedicated interface for users to create, update, view, and delete trade tags.

## Key Changes
- **Routing**: Introduce a new page (e.g., `/tags`) accessible from the main navigation.
- **List view**: Display existing tags with metadata (name, color, usage count). Include search and sorting if necessary.
- **CRUD actions**: Add dialogs or inline forms to create new tags, edit existing ones, and confirm deletions. Validate uniqueness per user.
- **Usage awareness**: Inform users when deleting tags that are applied to trades and define whether to remove associations or prevent deletion.
- **API integration**: Connect the page to Supabase endpoints for tag CRUD operations, respecting RLS and optimistic updates.

## Tasks
1. Add navigation entry and route configuration for the tags page.
2. Build the tags list component with loading, empty, and error states.
3. Implement create/edit forms (modal or drawer) with validation and success/error feedback.
4. Handle tag deletion with confirmation prompts and optional cascading behavior.
5. Ensure the page updates tag caches or triggers re-fetches so trade forms stay in sync.
6. Add automated tests covering CRUD flows and edge cases (duplicate names, deletion with associations).

## Acceptance Criteria
- Users can navigate to the tags page and manage all tag CRUD operations.
- Tag list reflects real-time updates after mutations.
- Deleting a tag either removes it from associated trades or blocks the action with clear messaging.
- Tests cover primary user journeys and validation rules.
