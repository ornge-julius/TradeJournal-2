# Global Tag Filter Implementation

## Problem Statement

The application currently has a global date filter that allows users to filter trades by exit date across the Dashboard and Trade History pages. Users need a similar global tag filter that works in conjunction with the date filter to provide more granular filtering capabilities. The tag filter should allow users to select one or more tags and filter trades that have at least one of the selected tags, while also respecting the date filter settings.

## Current Implementation

### Date Filter Architecture

The existing date filter is implemented using:

1. **DateFilterContext** (`app/src/context/DateFilterContext.jsx`):
   - Provides global state management for date filtering
   - Stores filter configuration: `preset`, `from`, `to`, `fromUtc`, `toUtc`
   - Persists filter state to localStorage with key `dashboardDateRange`
   - Updates URL query parameters (`preset`, `from`, `to`)
   - Provides `filterTradesByExitDate()` utility function
   - Exports `useDateFilter()` hook for consuming components

2. **GlobalDateFilter Component** (`app/src/components/ui/GlobalDateFilter.jsx`):
   - UI component rendered in the Header
   - Supports `navbar` variant for compact header display
   - Provides preset options (All Time, Today, Last 7 Days, etc.) and custom date range selection
   - Includes calendar picker for custom date selection

3. **Usage in Views**:
   - **DashboardView** (`app/src/components/views/DashboardView.jsx`):
     - Uses `useDateFilter()` hook to get current filter
     - Filters trades using `filterTradesByExitDate()` before calculating metrics and rendering charts
     - Passes filtered trades to `TradeHistoryTable` component
   
   - **TradeHistoryView** (`app/src/components/views/TradeHistoryView.jsx`):
     - Uses `useDateFilter()` hook to get current filter
     - Filters trades using `filterTradesByExitDate()` before passing to `TradeHistoryTable`

### Tag Data Structure

- Trades have a `tags` property that is an array of tag objects
- Each tag object has at least an `id` property and typically includes `name`, `color`, etc.
- Tags are fetched from Supabase via the `trade_tags` junction table
- The relationship is many-to-many: trades can have multiple tags, and tags can be associated with multiple trades

### Header Layout

The Header component (`app/src/components/ui/Header.jsx`) currently:
- Renders `GlobalDateFilter` in the header navigation bar (line 105)
- Uses a flex layout with the date filter positioned before the menu button
- Has a sticky header with backdrop blur styling

## Requirements

### Functional Requirements

1. **Tag Filter Context**
   - Create a new `TagFilterContext` similar to `DateFilterContext`
   - Store selected tag IDs as an array (empty array means no filter)
   - Persist filter state to localStorage with key `dashboardTagFilter`
   - Update URL query parameters to include `tags` parameter (comma-separated tag IDs)
   - Provide `filterTradesByTags()` utility function
   - Export `useTagFilter()` hook for consuming components
   - Support reading filter state from URL on initial load
   - Support reading filter state from localStorage if URL doesn't have tags parameter

2. **Tag Filter UI Component**
   - Create `GlobalTagFilter` component similar to `GlobalDateFilter`
   - Support `navbar` variant for compact display (similar to `GlobalDateFilter`)
   - Display selected tags as removable badges
   - Provide dropdown/combobox interface for selecting tags
   - Include search functionality to filter available tags
   - Show "All Tags" or "No filter" when no tags are selected
   - Support removing individual selected tags
   - Support clearing all selected tags
   - Fetch available tags from the application's tag management system
   - Handle loading and error states gracefully
   - On mobile: Display only the `Tag` icon (from lucide-react, same as used in drawer navigation)
   - On desktop: Display icon with text label and selected tag count
   - Use responsive classes to hide/show text label based on screen size (similar to `GlobalDateFilter`'s `hidden sm:inline` pattern)

3. **Filter Placement**
   - Place the tag filter in the top right corner, positioned just below the header
   - The filter should be aligned to the right side of the content area (matching the header's right alignment)
   - The filter should only be visible on:
     - Dashboard page (`/` route)
     - Trade History page (`/history` route)
   - The filter should be hidden on other pages (Tags page, Batch Comparison, etc.)
   - On mobile views, the filter should display only the tag icon (same `Tag` icon used in the drawer navigation), similar to how `GlobalDateFilter` shows only the calendar icon on mobile
   - On desktop/tablet views, the filter should display the full button with text label and selected tag count

4. **Combined Filtering Logic**
   - Trades must satisfy BOTH the date filter AND the tag filter
   - If no tags are selected, all trades pass the tag filter (no filtering by tags)
   - If tags are selected, a trade must have at least one of the selected tags to pass
   - If no date filter is set (All Time), all trades pass the date filter
   - Filtering should be applied in this order:
     1. First apply date filter (if active)
     2. Then apply tag filter (if active) to the date-filtered results

5. **Integration Points**
   - Update `DashboardView` to:
     - Use both `useDateFilter()` and `useTagFilter()` hooks
     - Apply both filters sequentially to trades
     - Pass filtered trades to all child components (charts, metrics, table)
   
   - Update `TradeHistoryView` to:
     - Use both `useDateFilter()` and `useTagFilter()` hooks
     - Apply both filters sequentially to trades
     - Pass filtered trades to `TradeHistoryTable`

6. **State Persistence**
   - Tag filter state should persist across page refreshes
   - Tag filter state should be shareable via URL
   - Tag filter state should be independent of date filter state
   - Both filters should work together when both are active

### Technical Requirements

1. **Context Provider**
   - Wrap the application (or at least the MainLayout) with `TagFilterProvider`
   - Provider should be at the same level or sibling to `DateFilterProvider`
   - Provider should initialize from URL params, then localStorage, then default (empty array)

2. **Filter Function**
   - `filterTradesByTags(trades, selectedTagIds)` function:
     - Returns all trades if `selectedTagIds` is empty or null
     - Filters trades to include only those with at least one matching tag ID
     - Handles trades with no tags (empty or undefined `tags` array)
     - Returns empty array if trades input is invalid

3. **Combined Filter Utility**
   - Create a utility function or hook that applies both filters:
     - `useFilteredTrades(trades)` hook that:
       - Gets both date and tag filters from their respective contexts
       - Applies date filter first
       - Applies tag filter to the result
       - Returns the final filtered array
       - Memoizes the result based on trades array and both filter states

4. **URL Parameter Format**
   - Tag IDs should be stored in URL as comma-separated values: `?tags=id1,id2,id3`
   - Should handle URL encoding/decoding properly
   - Should remove `tags` parameter when no tags are selected

5. **LocalStorage Format**
   - Store as JSON array: `["id1", "id2", "id3"]`
   - Store empty array `[]` when no tags selected (or remove key)
   - Handle parsing errors gracefully (fallback to empty array)

6. **Tag Fetching**
   - The filter component needs access to the list of available tags
   - Should use existing tag management hooks or context if available
   - Should handle cases where tags haven't loaded yet
   - Should handle cases where user has no tags created

### UI/UX Requirements

1. **Filter Placement Layout**
   - Position the filter in the top right corner, just below the header
   - Should be aligned with the right side of the content area (matching header alignment)
   - Should have appropriate spacing from header and content below
   - Should use absolute or relative positioning to maintain right alignment
   - Should be responsive and work on mobile devices
   - On mobile: Icon-only display (Tag icon from lucide-react)
   - On desktop: Full button with icon, text label, and selected tag count

2. **Tag Filter Component Design**
   - Should match the visual style of `GlobalDateFilter`
   - Should use similar button/dropdown pattern
   - Should display selected tags as badges (similar to `TagBadge` component)
   - Should have a clear visual indicator when tags are selected
   - Should support keyboard navigation
   - Should be accessible (ARIA labels, keyboard support)

3. **Visual Feedback**
   - Show count of selected tags in the filter button
   - Highlight active filter state when tags are selected
   - Provide clear way to clear all selected tags
   - Show loading state while tags are being fetched

4. **Responsive Design**
   - Filter should work on mobile, tablet, and desktop
   - On mobile views (small screens):
     - Display only the Tag icon (same icon used in drawer navigation)
     - Hide text label and tag count (use `hidden sm:inline` pattern like `GlobalDateFilter`)
     - Icon should be clearly tappable/clickable
   - On desktop/tablet views:
     - Display full button with Tag icon, text label ("Tag filter" or similar), and selected tag count
     - Show selected tags as badges when dropdown is open
   - Dropdown should position correctly on all screen sizes (right-aligned on desktop, full-width on mobile)
   - Selected tags should wrap appropriately on smaller screens

### Edge Cases

1. **No Tags Available**
   - If user has no tags, show appropriate message
   - Disable tag selection if no tags exist
   - Provide link or guidance to create tags

2. **Tag Deletion**
   - If a selected tag is deleted, remove it from the filter automatically
   - Update filter state when tags are deleted
   - Handle gracefully if tag is deleted while filter is active

3. **Invalid Tag IDs**
   - If URL contains invalid tag IDs, ignore them
   - If localStorage contains invalid tag IDs, clear them
   - Validate tag IDs against available tags list

4. **Empty Trade Tags**
   - Trades with no tags should not match when tags are selected
   - Trades with empty `tags` array should be handled correctly

5. **Performance**
   - Filtering should be efficient even with large numbers of trades
   - Tag fetching should not block UI
   - Memoization should prevent unnecessary re-filtering

## Implementation Plan

### Phase 1: Context and Core Logic

1. Create `TagFilterContext.jsx`:
   - Define context and provider
   - Implement state management
   - Implement localStorage persistence
   - Implement URL parameter sync
   - Implement `filterTradesByTags()` utility function
   - Export `useTagFilter()` hook

2. Create combined filter hook:
   - Create `useFilteredTrades.js` hook
   - Combine date and tag filtering logic
   - Implement memoization

### Phase 2: UI Components

1. Create `GlobalTagFilter.jsx` component:
   - Implement tag selector dropdown
   - Implement tag badge display
   - Implement search functionality
   - Implement clear/remove functionality
   - Add loading and error states
   - Support `navbar` variant for compact display
   - Implement responsive behavior:
     - Mobile: Icon-only display (Tag icon from lucide-react)
     - Desktop: Full button with icon, text label, and tag count
   - Use responsive classes (`hidden sm:inline`) to hide/show text label

2. Integrate filter placement:
   - Position `GlobalTagFilter` in top right corner, just below header
   - Conditionally render based on current route (Dashboard and Trade History only)
   - Ensure proper right alignment with content area
   - Add appropriate spacing from header

### Phase 3: Integration

1. Update `App.jsx`:
   - Wrap MainLayout with `TagFilterProvider`
   - Ensure proper provider nesting

2. Update `DashboardView.jsx`:
   - Use `useFilteredTrades()` hook instead of just date filtering
   - Ensure all metrics and charts use filtered data

3. Update `TradeHistoryView.jsx`:
   - Use `useFilteredTrades()` hook instead of just date filtering

4. Update layout to include filter placement:
   - Position `GlobalTagFilter` in top right corner, just below header
   - Conditionally show based on route (Dashboard and Trade History only)
   - Ensure proper alignment and spacing

### Phase 4: Testing and Refinement

1. Test filter persistence:
   - Test localStorage persistence
   - Test URL parameter sharing
   - Test filter state across page navigation

2. Test combined filtering:
   - Test date filter alone
   - Test tag filter alone
   - Test both filters together
   - Test edge cases (no tags, no trades, etc.)

3. Test UI/UX:
   - Test responsive design
   - Test keyboard navigation
   - Test accessibility
   - Test loading states

## File Structure

```
app/src/
├── context/
│   ├── DateFilterContext.jsx (existing)
│   └── TagFilterContext.jsx (new)
├── components/
│   ├── ui/
│   │   ├── GlobalDateFilter.jsx (existing)
│   │   └── GlobalTagFilter.jsx (new)
│   └── views/
│       ├── DashboardView.jsx (update)
│       └── TradeHistoryView.jsx (update)
├── hooks/
│   └── useFilteredTrades.js (new)
└── App.jsx (update)
```

## Acceptance Criteria

1. ✅ Tag filter context is created and provides state management
2. ✅ Tag filter persists to localStorage and URL
3. ✅ GlobalTagFilter component is created and styled consistently
4. ✅ Filter appears in top right corner below header on Dashboard and Trade History pages only
5. ✅ Filter displays icon-only on mobile views (Tag icon from lucide-react)
6. ✅ Filter displays full button with text and count on desktop views
7. ✅ Tag filter works independently of date filter
8. ✅ Combined filtering applies both filters correctly (AND logic)
9. ✅ DashboardView uses combined filtered trades for all metrics and charts
10. ✅ TradeHistoryView uses combined filtered trades for table
11. ✅ Filter state persists across page refreshes
12. ✅ Filter state is shareable via URL
13. ✅ Edge cases are handled (no tags, deleted tags, invalid IDs, etc.)
14. ✅ UI is responsive and accessible
15. ✅ Performance is acceptable with large datasets

## Dependencies

- Existing `DateFilterContext` and `GlobalDateFilter` (for reference)
- Existing tag management system (for fetching available tags)
- Existing `TagBadge` component (for displaying selected tags)
- React Router (for route detection)
- localStorage API (for persistence)

## Notes

- The tag filter should be independent of the date filter but work in conjunction with it
- Consider using the existing `TagSelector` component as a reference, but the global filter may need different styling and behavior
- The filter placement in the top right corner below the header should mirror the date filter's position in the header for visual consistency
- On mobile, the icon-only display should match the date filter's mobile behavior (calendar icon only)
- Use the `Tag` icon from lucide-react (same icon used in the drawer navigation menu)
- Both filters should feel like first-class features, not secondary filters
- Consider adding visual indicators when filters are active (e.g., badge counts, highlighted states)
- The responsive behavior should follow the same pattern as `GlobalDateFilter`: `hidden sm:inline` for text labels, icon always visible

