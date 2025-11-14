# Statement of Work: Trade Detail Routing

## Objective
Convert the existing trade detail modal view into a dedicated routed page so that trades can be linked and navigated directly. Update related UI elements to leverage the new route and document the scope of the change.

## Deliverables
- Introduce a `/detail/{trade_id}` route that renders the existing trade detail experience as a full page.
- Ensure navigation state is preserved so users can return to the originating page via a back button.
- Update trade symbol interactions (tables, comparison cards) to point to the new detail route.
- Provide any supporting state management adjustments required for routed navigation.

## Acceptance Criteria
1. Visiting `/detail/{trade_id}` displays the trade detail view for the specified trade when it exists under the active account.
2. The detail page includes a back action that returns the user to the page where the navigation originated, defaulting to the dashboard when accessed directly.
3. Trade symbols in history tables and batch comparison cards navigate to the routed detail page using standard links.
4. Editing, deleting, and authentication flows continue to work from the detail page context.

## Out of Scope
- Styling or layout overhauls unrelated to establishing the new route.
- Changes to trade data fetching beyond what is necessary to support routed navigation.
- Updates to analytics, tracking, or performance monitoring.

## Dependencies & Considerations
- React Router configuration must support nested layouts so that the dashboard and other views remain accessible alongside the new detail page.
- Existing trade management hooks should remain the source of truth for trade data and must synchronize correctly after edits or deletions triggered from the new route.
- Back navigation relies on React Router location state; components linking to the detail route should provide this state to maintain context.
