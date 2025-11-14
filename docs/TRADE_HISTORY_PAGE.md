# Trade History Page Implementation

## Problem Statement

Create a dedicated Trade History page that displays all trades in a table format. This page should be accessible from the hamburger menu navigation, respect the global date filter, and provide a quick way to add new trades via a Floating Action Button (FAB) when the user is authenticated.

## Requirements

### 1. Navigation Integration
- Add a "Trade History" link to the hamburger menu navigation
- The link should be placed in the `navItems` array in `Header.jsx`
- Use an appropriate icon from `lucide-react` (suggest: `History`, `List`, or `FileText`)
- The route should be `/history`
- Update the `currentView` logic in `Header.jsx` to recognize the trade history page

### 2. Route Configuration
- Add a new route in `App.jsx` for `/history`
- The route should be nested under the `MainLayout` component (similar to `/comparison` and `/tags`)
- Pass the `trades` prop to the Trade History view component
- Ensure the route is wrapped in the `DateFilterProvider` context (already handled by `MainLayout`)

### 3. Trade History View Component
- Create a new component: `app/src/components/views/TradeHistoryView.jsx`
- The component should:
  - Accept `trades` as a prop
  - Use the `useDateFilter` hook to access the global date filter
  - Filter trades using `filterTradesByExitDate` from `DateFilterContext`
  - Display the filtered trades in the `TradeHistoryTable` component
  - Include a page title: "Trade History"
  - Show loading/error states if needed (though trades are typically loaded at the app level)

### 4. Date Filter Integration
- Import `filterTradesByExitDate` and `useDateFilter` from `DateFilterContext`
- Use `useMemo` to filter trades based on the current date filter
- The filtered trades should respect the `fromUtc` and `toUtc` values from the filter
- Follow the same pattern used in `DashboardView.jsx` (lines 19-23)

### 5. Floating Action Button (FAB)
- Add a FAB button in the top right corner of the page, positioned above the table
- Use the same FAB implementation from `TagsManagementView.jsx` (lines 69-82)
- The FAB should:
  - Use Material-UI's `Fab` component
  - Use the `Add` icon from `@mui/icons-material`
  - Have the same gradient styling: `linear-gradient(to right, #2563EB, #059669)`
  - Have hover state: `linear-gradient(to right, #1D4ED8, #047857)`
  - Have `zIndex: 10`
  - Only display when `isAuthenticated` is `true`
- The FAB should trigger the trade form (similar to how it works in the header menu)
- Pass `onToggleTradeForm` handler from the parent component (App.jsx)

### 6. Authentication Integration
- Import and use the `useAuth` hook to check authentication status
- Conditionally render the FAB based on `isAuthenticated`
- Optionally show a message when not authenticated (similar to TagsManagementView lines 84-88)

### 7. Layout and Styling
- Follow the same layout pattern as `TagsManagementView.jsx`
- Use a `space-y-6` container with `relative` positioning
- Header section with title and FAB should use `flex items-center justify-between`
- The table should be displayed below the header
- Ensure proper spacing and responsive design

## Technical Implementation Details

### Component Structure

```jsx
TradeHistoryView
├── Header Section
│   ├── Page Title ("Trade History")
│   └── FAB (conditional on isAuthenticated)
└── TradeHistoryTable
    └── filteredTrades (from useMemo)
```

### Key Imports Required

- `React, { useMemo }` from 'react'
- `Fab` from '@mui/material'
- `Add as AddIcon` from '@mui/icons-material'
- `useDateFilter, filterTradesByExitDate` from '../../context/DateFilterContext'
- `useAuth` from '../../hooks/useAuth'
- `TradeHistoryTable` from '../tables/TradeHistoryTable'

### Date Filtering Pattern

```jsx
const { filter } = useDateFilter();

const filteredTrades = useMemo(() => {
  return filterTradesByExitDate(trades, filter);
}, [trades, filter]);
```

### FAB Implementation Pattern

```jsx
{isAuthenticated && (
  <Fab
    color="primary"
    aria-label="add trade"
    onClick={handleToggleTradeForm}
    sx={{
      background: 'linear-gradient(to right, #2563EB, #059669)',
      '&:hover': {
        background: 'linear-gradient(to right, #1D4ED8, #047857)',
      },
      zIndex: 10,
    }}
  >
    <AddIcon />
  </Fab>
)}
```

## Files to Modify

1. **app/src/components/ui/Header.jsx**
   - Add "Trade History" to `navItems` array
   - Update `currentView` logic to include 'tradeHistory'
   - Import appropriate icon (e.g., `History` from lucide-react)

2. **app/src/App.jsx**
   - Add new route: `<Route path="history" element={<TradeHistoryView trades={trades} onToggleTradeForm={handleToggleTradeForm} />} />`
   - Import `TradeHistoryView` component

3. **app/src/components/views/TradeHistoryView.jsx** (NEW FILE)
   - Create the new view component following the requirements above

## Dependencies

All required dependencies are already installed:
- `@mui/material` (for Fab component)
- `@mui/icons-material` (for Add icon)
- `react-router-dom` (for routing)
- `lucide-react` (for navigation icon)

## Testing Considerations

1. Verify the navigation link appears in the hamburger menu
2. Verify clicking the link navigates to `/history`
3. Verify the page displays all trades when no date filter is applied
4. Verify trades are filtered correctly when a date filter is active
5. Verify the FAB appears only when user is authenticated
6. Verify clicking the FAB opens the trade form
7. Verify the page title and layout match the design pattern
8. Verify responsive behavior on different screen sizes

## Edge Cases

1. **No trades available**: The TradeHistoryTable component should handle empty state
2. **No authenticated user**: FAB should not appear, but table should still show (if trades are visible to non-authenticated users)
3. **Date filter with no matches**: Table should show empty state gracefully
4. **Loading state**: Consider if any loading states need to be handled at this level

## Related Components

- `TradeHistoryTable`: Existing component that displays trades in a table format
- `TagsManagementView`: Reference for FAB implementation and layout pattern
- `DashboardView`: Reference for date filter integration pattern
- `Header`: Component that contains the navigation menu
- `DateFilterContext`: Provides global date filter functionality

