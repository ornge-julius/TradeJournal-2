# Dashboard View Component Implementation

## Problem Statement

The application needs a new comprehensive dashboard view component that provides a unified, well-organized layout for displaying trading metrics and charts. This component will serve as the foundation for the new dashboard and will eventually replace the current dashboard layout in `App.jsx`. 

This first piece of work focuses on creating the new `DashboardView` component structure with:
1. Enhanced metrics cards (5 cards: Total Trades, Win Rate, Net P&L, Avg W/L $, Current Balance)
2. Layout structure prepared for charts (placeholders for now)
3. Proper data flow and memoization
4. Responsive grid layout

The charts themselves will be added in a separate piece of work.

## Current Implementation

The current dashboard layout in `App.jsx`:
- Shows 4 basic metrics cards in a grid
- Displays 3 charts (Account Balance, Win/Loss, Cumulative Profit) in a 2-column grid
- Shows trade history table below charts
- Uses basic metrics cards without circular indicators and mini visualizations
- All dashboard logic is embedded directly in `App.jsx`

## Requirements

### Functional Requirements

1. **Component Structure**
   - Create new `DashboardView.jsx` component
   - Extract dashboard layout logic from `App.jsx`
   - Component should be self-contained and reusable
   - Component should receive props: `trades`, `startingBalance`, `onViewTrade`

2. **Enhanced Metrics Cards**
   - Integrate `DashboardMetricsCards` component (should be created separately)
   - Display 5 metric cards: Total Trades, Win Rate, Net P&L, Avg W/L $, Current Balance
   - Metrics cards should be in a responsive grid: 5 columns on large screens, fewer on smaller screens

3. **Layout Structure for Charts**
   - Create layout structure ready for charts:
     - Left column placeholder (for Cumulative Net Profit Curve chart)
     - Right column placeholder with two stacked sections (for Monthly and Daily charts)
   - Charts will be added in subsequent work, but layout should be ready
   - Include trade history table below charts area

4. **Data Flow and Calculations**
   - Component should calculate metrics using `calculateMetrics` from `calculations.js`
   - Use `useMemo` for performance optimization
   - Metrics calculation should depend on `trades` and `startingBalance`
   - Prepare structure for chart data generation (will be implemented later)

5. **Responsive Behavior**
   - Metrics cards should stack appropriately on smaller screens
   - Chart area should stack vertically on smaller screens
   - Layout should be responsive and work on all screen sizes

### Design Requirements

1. **Layout Grid**
   - Metrics cards: `grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6`
   - Chart area: `grid grid-cols-1 lg:grid-cols-2 gap-8`
   - Charts in right column: `flex flex-col gap-8` (once charts are added)

2. **Spacing and Padding**
   - Consistent spacing between sections (`space-y-8`)
   - Maintain padding from current implementation
   - Charts area should have appropriate margins

3. **Color Scheme**
   - Maintain existing dark theme
   - Use app's color scheme consistently
   - Background: `bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900` (from parent)

### Technical Requirements

1. **Component File**
   - Create `app/src/components/views/DashboardView.jsx`
   - Extract dashboard logic from `App.jsx`
   - Keep header and forms in `App.jsx`
   - Make dashboard component reusable and clean

2. **Metrics Calculation**
   - Use existing `calculateMetrics` function from `utils/calculations.js`
   - Memoize metrics calculation with `useMemo`
   - Dependencies: `[trades, startingBalance]`

3. **Performance Considerations**
   - Memoize metrics calculations
   - Only recalculate when trades or startingBalance change
   - Component should be optimized for re-renders

## Implementation Approach

### Component Structure

```javascript
// app/src/components/views/DashboardView.jsx
import React, { useMemo } from 'react';
import DashboardMetricsCards from '../ui/DashboardMetricsCards';
import TradeHistoryTable from '../tables/TradeHistoryTable';
import { calculateMetrics } from '../../utils/calculations';

const DashboardView = ({ trades, startingBalance, onViewTrade }) => {
  // Calculate all metrics
  const metrics = useMemo(() => {
    return calculateMetrics(trades, startingBalance);
  }, [trades, startingBalance]);

  return (
    <div className="space-y-8">
      {/* Enhanced Metrics Cards */}
      <DashboardMetricsCards 
        metrics={metrics}
        trades={trades}
        startingBalance={startingBalance}
      />

      {/* Main Charts Section - Structure ready for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Placeholder for Cumulative Net Profit Curve */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-center h-[400px] text-gray-400">
              Chart placeholder - Cumulative Net Profit Curve
            </div>
          </div>
        </div>

        {/* Right Column: Placeholders for Monthly and Daily Charts */}
        <div className="flex flex-col gap-8">
          {/* Monthly Net P&L Chart Placeholder */}
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              Chart placeholder - Monthly Net P&L
            </div>
          </div>
          
          {/* Last 30 Days Net P&L Chart Placeholder */}
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              Chart placeholder - Last 30 Days Net P&L
            </div>
          </div>
        </div>
      </div>

      {/* Trade History Table */}
      <TradeHistoryTable 
        trades={trades} 
        onViewTrade={onViewTrade} 
      />
    </div>
  );
};

export default DashboardView;
```

### Update App.jsx

Modify the main dashboard section in `App.jsx`:

```javascript
// In App.jsx
import DashboardView from './components/views/DashboardView';

// Replace the current dashboard section with:
{viewingTrade ? (
  <TradeDetailView ... />
) : (
  <>
    <Header ... />
    {/* Other forms */}
    
    {/* Dashboard */}
    {authLoading ? (
      // Loading state
    ) : isAccountLoading ? (
      // Loading state
    ) : !selectedAccountId ? (
      // No account selected
    ) : (
      <DashboardView
        trades={trades}
        startingBalance={startingBalance}
        onViewTrade={handleTradeView}
      />
    )}
  </>
)}
```

### Layout Structure

The layout should match the target design:
- Top row: 5 enhanced metrics cards
- Bottom section: 2-column grid for charts (left column for large chart, right column for two stacked charts)
- Trade history table below

## Implementation Steps

1. **Create DashboardView component**
   - Create `app/src/components/views/DashboardView.jsx`
   - Import DashboardMetricsCards component
   - Import TradeHistoryTable component
   - Import calculation utilities
   - Set up component structure with placeholders

2. **Implement metrics calculation**
   - Add `useMemo` hook for metrics calculation
   - Use existing `calculateMetrics` function
   - Pass metrics to DashboardMetricsCards

3. **Set up layout structure**
   - Create responsive grid layout for metrics cards
   - Create 2-column grid layout for chart area
   - Add placeholder divs for charts
   - Include trade history table

4. **Update App.jsx**
   - Import DashboardView component
   - Replace current dashboard section with DashboardView
   - Pass required props (trades, startingBalance, onViewTrade)
   - Remove old metrics cards and charts from App.jsx

5. **Test layout and responsive behavior**
   - Test on different screen sizes
   - Verify layout breaks correctly
   - Ensure metrics cards display correctly
   - Verify placeholders show in chart areas

6. **Styling refinements**
   - Ensure consistent spacing
   - Verify color scheme consistency
   - Check responsive breakpoints

## Files to Create/Modify

1. **New Files**
   - `app/src/components/views/DashboardView.jsx` - Main dashboard component

2. **Files to Modify**
   - `app/src/App.jsx` - Replace dashboard section with DashboardView

3. **Files to Reference/Create**
   - `app/src/components/ui/DashboardMetricsCards.jsx` - Must be created first (separate work)
   - `app/src/utils/calculations.js` - Should already have `calculateMetrics` function

## Acceptance Criteria

- ✅ DashboardView component is created and functional
- ✅ Component displays 5 enhanced metrics cards in top row
- ✅ Metrics cards are in responsive grid (5 cols large, fewer on smaller screens)
- ✅ Chart area layout structure is in place with placeholders
- ✅ Trade history table displays below chart area
- ✅ Metrics are calculated correctly using memoization
- ✅ Component is integrated into App.jsx
- ✅ Layout is responsive and works on all screen sizes
- ✅ Component maintains app's color scheme and styling
- ✅ Spacing and padding are consistent
- ✅ Old dashboard code is removed from App.jsx

## Edge Cases

1. **No trades**: Metrics should show zeros/defaults, placeholders should display
2. **Loading state**: Handled by parent App.jsx
3. **No account selected**: Handled by parent App.jsx
4. **Empty data**: Component should handle gracefully without errors
5. **Missing DashboardMetricsCards**: Should show error or fallback

## Notes

- This work focuses on creating the structure and layout. Charts will be added in separate work.
- The DashboardMetricsCards component should already be created (separate work on individual card components).
- Chart placeholders are temporary - they will be replaced with actual chart components in the next piece of work.
- The component should be completely self-contained and reusable.
- Consider using React.memo for the component if needed to optimize re-renders.
- The layout structure should exactly match where charts will go, so when charts are added, they can be dropped into the placeholder locations.

