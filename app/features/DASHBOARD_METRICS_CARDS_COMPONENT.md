# Dashboard Metrics Cards Component Implementation

## Problem Statement

The dashboard requires a parent component that orchestrates and displays all five enhanced metric cards in a unified grid layout. While individual card components (TotalTradesCard, WinRateCard, NetPNLCard, AvgWLCard, CurrentBalanceCard) will be created separately, we need a container component that:

1. Receives metrics, trades, and startingBalance as props
2. Renders all five individual metric cards in a responsive grid
3. Manages the layout and spacing
4. Passes appropriate props to each individual card
5. Handles data preparation for cards that need additional data processing

This component serves as the main metrics display area and will be integrated into the DashboardView component.

## Current Implementation

Currently, the existing `MetricsCards` component (`app/src/components/ui/MetricsCards.jsx`) displays four basic metric cards. However, this component:
- Uses simple card layouts without circular indicators or mini charts
- Only displays 4 cards instead of 5
- Doesn't match the enhanced design requirements

## Requirements

### Functional Requirements

1. **Component Structure**
   - Create `DashboardMetricsCards` component that renders all 5 individual cards
   - Component should be a container/orchestrator component
   - Each card should be a separate component imported into this parent

2. **Card Integration**
   - TotalTradesCard: Display total trades with circular win/loss indicator
   - WinRateCard: Display win rate percentage with circular progress bar
   - NetPNLCard: Display net P&L with fees subtitle and mini trend chart
   - AvgWLCard: Display average win/loss ratio with horizontal bar chart
   - CurrentBalanceCard: Display current balance with mini trend chart

3. **Data Preparation**
   - Receive `metrics` object containing all calculated metrics
   - Receive `trades` array for trend data generation
   - Receive `startingBalance` for balance calculations
   - Prepare trend data for NetPNLCard and CurrentBalanceCard
   - Calculate total fees if needed for NetPNLCard
   - Pass appropriate props to each card component

4. **Responsive Layout**
   - Display cards in a responsive grid
   - Large screens: 5 columns (1 card per column)
   - Medium screens: 3 columns with some wrapping
   - Small screens: Single column (all cards stack vertically)
   - Use Tailwind grid classes: `grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6`

### Design Requirements

1. **Layout Grid**
   - Use CSS Grid for layout
   - Consistent gap between cards: `gap-6`
   - Cards should fill their grid cells appropriately
   - Maintain consistent card sizing

2. **Spacing**
   - Proper spacing between cards
   - Consistent padding within cards (handled by individual card components)

3. **Responsive Breakpoints**
   - Mobile: Single column
   - Tablet (md): 3 columns
   - Desktop (lg+): 5 columns

### Technical Requirements

1. **Component Props**
   - `metrics`: Object containing:
     - `totalTrades`: Number
     - `winningTrades`: Number
     - `losingTrades`: Number
     - `winRate`: Number (percentage, 0-100)
     - `totalProfit`: Number (net P&L)
     - `avgWin`: Number
     - `avgLoss`: Number
     - `currentBalance`: Number
   - `trades`: Array of trade objects (for trend data)
   - `startingBalance`: Number (for balance calculations)

2. **Data Preparation Functions**
   - May need to generate mini trend data for NetPNLCard and CurrentBalanceCard
   - Calculate total fees for NetPNLCard (if available)
   - Use utility functions from `calculations.js` as needed

3. **Individual Card Components**
   - Import each of the 5 card components
   - Each card should be created separately (separate implementation work)
   - Cards should handle their own styling and internal logic

## Implementation Approach

### Component Structure

```javascript
// app/src/components/ui/DashboardMetricsCards.jsx
import React, { useMemo } from 'react';
import TotalTradesCard from './cards/TotalTradesCard';
import WinRateCard from './cards/WinRateCard';
import NetPNLCard from './cards/NetPNLCard';
import AvgWLCard from './cards/AvgWLCard';
import CurrentBalanceCard from './cards/CurrentBalanceCard';
import { 
  generateAccountBalanceData,
  generateCumulativeProfitData,
  generateNetPNLTrendData,
  generateBalanceTrendData,
  calculateTotalFees
} from '../../utils/calculations';

const DashboardMetricsCards = ({ metrics, trades, startingBalance }) => {
  // Generate trend data for Net P&L card
  const netPNLTrendData = useMemo(() => {
    if (!trades || trades.length === 0) {
      return [];
    }
    const cumulativeData = generateCumulativeProfitData(trades);
    return generateNetPNLTrendData(cumulativeData);
  }, [trades]);

  // Generate trend data for Current Balance card
  const balanceTrendData = useMemo(() => {
    if (!trades || trades.length === 0) {
      return [];
    }
    const balanceData = generateAccountBalanceData(trades, startingBalance);
    return generateBalanceTrendData(balanceData);
  }, [trades, startingBalance]);

  // Calculate total fees for Net P&L card
  const totalFees = useMemo(() => {
    return calculateTotalFees(trades);
  }, [trades]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      <TotalTradesCard
        totalTrades={metrics.totalTrades}
        winningTrades={metrics.winningTrades}
        losingTrades={metrics.losingTrades}
      />
      
      <WinRateCard
        winRate={metrics.winRate}
      />
      
      <NetPNLCard
        netPNL={metrics.totalProfit}
        totalFees={totalFees}
        trendData={netPNLTrendData}
      />
      
      <AvgWLCard
        avgWin={metrics.avgWin}
        avgLoss={metrics.avgLoss}
      />
      
      <CurrentBalanceCard
        currentBalance={metrics.currentBalance}
        trendData={balanceTrendData}
      />
    </div>
  );
};

export default DashboardMetricsCards;
```

### Data Flow

```
App.jsx or DashboardView
  ↓
  passes: metrics, trades, startingBalance
  ↓
DashboardMetricsCards
  ↓
  prepares trend data, fees
  ↓
  passes specific props to each card
  ↓
Individual Card Components (TotalTradesCard, etc.)
```

## Implementation Steps

1. **Create component file**
   - Create `app/src/components/ui/DashboardMetricsCards.jsx`
   - Import all 5 individual card components
   - Import necessary utility functions

2. **Implement data preparation**
   - Add `useMemo` hooks for trend data generation
   - Generate Net P&L trend data using cumulative profit calculations
   - Generate balance trend data using account balance calculations
   - Calculate total fees if needed

3. **Set up responsive grid**
   - Apply Tailwind grid classes
   - Test responsive breakpoints
   - Ensure cards wrap properly

4. **Implement individual card rendering**
   - Render each of the 5 cards
   - Pass appropriate props to each card
   - Ensure props match what each card expects

5. **Test integration**
   - Test with real data
   - Test with empty data
   - Test responsive behavior
   - Verify all cards display correctly

6. **Integration**
   - Import into DashboardView component
   - Pass metrics, trades, and startingBalance from DashboardView
   - Verify everything works together

## Files to Create/Modify

1. **New Files**
   - `app/src/components/ui/DashboardMetricsCards.jsx` - Main container component

2. **Files to Modify**
   - `app/src/components/views/DashboardView.jsx` - Import and use DashboardMetricsCards

3. **Files to Reference/Create (Dependencies)**
   - `app/src/components/ui/cards/TotalTradesCard.jsx` - Must be created first
   - `app/src/components/ui/cards/WinRateCard.jsx` - Must be created first
   - `app/src/components/ui/cards/NetPNLCard.jsx` - Must be created first
   - `app/src/components/ui/cards/AvgWLCard.jsx` - Must be created first
   - `app/src/components/ui/cards/CurrentBalanceCard.jsx` - Must be created first
   - `app/src/utils/calculations.js` - Should have trend data generation functions

## Acceptance Criteria

- ✅ DashboardMetricsCards component is created and functional
- ✅ Component displays all 5 metric cards in a responsive grid
- ✅ Grid layout is responsive: 5 columns on large screens, 3 on medium, 1 on small
- ✅ Each card receives correct props
- ✅ Trend data is generated correctly for Net P&L and Current Balance cards
- ✅ Total fees are calculated correctly for Net P&L card
- ✅ Component handles empty data gracefully
- ✅ Component is integrated into DashboardView
- ✅ All cards display correctly with real data
- ✅ Responsive behavior works on all screen sizes
- ✅ No console errors or warnings

## Edge Cases

1. **No trades**: All cards should receive appropriate default values
2. **Empty metrics object**: Component should handle gracefully
3. **Missing individual card components**: Should show error or fallback
4. **Invalid trend data**: Cards should handle gracefully
5. **Very large datasets**: Trend data generation should be efficient
6. **Missing utility functions**: Should handle gracefully or show errors

## Notes

- This component is a container component - it doesn't render its own UI elements, just orchestrates the individual cards
- Individual card components should be created separately based on their implementation documentation
- The component should use `useMemo` for expensive data calculations to optimize performance
- Trend data preparation is done here to keep individual card components simpler
- The grid layout ensures cards maintain consistent sizing and spacing
- If individual card components aren't ready, placeholders can be used temporarily
- This component can be created after individual cards are implemented, or in parallel if placeholders are used

## Dependencies

This component depends on:
1. All 5 individual card components being created:
   - TotalTradesCard
   - WinRateCard
   - NetPNLCard
   - AvgWLCard
   - CurrentBalanceCard

2. Utility functions in `calculations.js`:
   - `generateCumulativeProfitData`
   - `generateAccountBalanceData`
   - `generateNetPNLTrendData` (or similar)
   - `generateBalanceTrendData` (or similar)
   - `calculateTotalFees`

3. Being imported into DashboardView component (from separate work)

