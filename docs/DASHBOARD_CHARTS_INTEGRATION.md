# Dashboard Charts Integration Implementation

## Problem Statement

The `DashboardView` component has been created with the proper layout structure and placeholders for charts. This piece of work focuses on replacing the chart placeholders with the actual chart components and integrating them into the dashboard:

1. Cumulative Net Profit Curve chart (large, left column)
2. Monthly Net P&L chart (right column, top)
3. Last 30 Days Net P&L chart (right column, bottom)

Each chart needs proper data generation, proper integration into the dashboard layout, and correct data flow from the parent component.

## Current Implementation

The `DashboardView` component currently has:
- Enhanced metrics cards displaying correctly
- Chart area with placeholders showing "Chart placeholder" messages
- Layout structure ready for charts
- Metrics calculation working

The chart components themselves should be created separately based on their individual implementation documentation:
- `CumulativeNetProfitChart.jsx`
- `MonthlyNetPNLChart.jsx`
- `Last30DaysNetPNLChart.jsx`

## Requirements

### Functional Requirements

1. **Data Generation**
   - Generate cumulative profit data (date-based) from trades
   - Generate monthly net P&L data from trades
   - Generate last 30 days net P&L data from trades
   - All data generation should use `useMemo` for performance
   - Data should be recalculated only when trades change

2. **Chart Integration**
   - Replace left column placeholder with `CumulativeNetProfitChart`
   - Replace top-right placeholder with `MonthlyNetPNLChart`
   - Replace bottom-right placeholder with `Last30DaysNetPNLChart`
   - Pass correct data props to each chart component
   - Ensure charts receive empty arrays if no data available

3. **Data Flow**
   - Data calculations happen in `DashboardView` component
   - Data flows down to individual chart components
   - Charts handle their own empty states internally
   - No data transformation should happen in chart components (done in parent)

4. **Performance**
   - Memoize all data generation functions
   - Only recalculate when trades array changes
   - Charts should not re-render unnecessarily

### Design Requirements

1. **Chart Placement**
   - Cumulative Net Profit Curve: Left column, full width of column
   - Monthly Net P&L: Right column, top position
   - Last 30 Days Net P&L: Right column, bottom position
   - Maintain spacing: `gap-8` between charts in right column

2. **Responsive Behavior**
   - Charts should stack vertically on smaller screens
   - Left column chart should take full width when stacked
   - Right column charts should stack when column collapses

3. **Consistency**
   - Charts should match app's color scheme
   - Charts should follow same styling patterns as existing charts

### Technical Requirements

1. **Data Generation Functions**
   - All functions should be in `app/src/utils/calculations.js`:
     - `generateCumulativeProfitData` (may need update for date-based)
     - `generateMonthlyNetPNLData` (new function)
     - `generateLast30DaysNetPNLData` (new function)

2. **Component Updates**
   - Update `DashboardView.jsx` to import chart components
   - Update `DashboardView.jsx` to generate and pass chart data
   - Remove placeholder divs
   - Add chart components in correct locations

3. **Error Handling**
   - Charts should handle empty data gracefully
   - Charts should handle invalid data gracefully
   - Dashboard should not break if chart components fail

## Implementation Approach

### Update DashboardView Component

```javascript
// app/src/components/views/DashboardView.jsx
import React, { useMemo } from 'react';
import DashboardMetricsCards from '../ui/DashboardMetricsCards';
import CumulativeNetProfitChart from '../charts/CumulativeNetProfitChart';
import MonthlyNetPNLChart from '../charts/MonthlyNetPNLChart';
import Last30DaysNetPNLChart from '../charts/Last30DaysNetPNLChart';
import TradeHistoryTable from '../tables/TradeHistoryTable';
import { 
  calculateMetrics,
  generateCumulativeProfitData,
  generateMonthlyNetPNLData,
  generateLast30DaysNetPNLData
} from '../../utils/calculations';

const DashboardView = ({ trades, startingBalance, onViewTrade }) => {
  // Calculate all metrics
  const metrics = useMemo(() => {
    return calculateMetrics(trades, startingBalance);
  }, [trades, startingBalance]);

  // Generate all chart data
  const chartData = useMemo(() => {
    if (!trades || trades.length === 0) {
      return {
        cumulativeProfit: [],
        monthlyNetPNL: [],
        last30DaysNetPNL: []
      };
    }

    return {
      cumulativeProfit: generateCumulativeProfitData(trades),
      monthlyNetPNL: generateMonthlyNetPNLData(trades),
      last30DaysNetPNL: generateLast30DaysNetPNLData(trades)
    };
  }, [trades]);

  return (
    <div className="space-y-8">
      {/* Enhanced Metrics Cards */}
      <DashboardMetricsCards 
        metrics={metrics}
        trades={trades}
        startingBalance={startingBalance}
      />

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Cumulative Net Profit Curve */}
        <div className="lg:col-span-1">
          <CumulativeNetProfitChart data={chartData.cumulativeProfit} />
        </div>

        {/* Right Column: Monthly and Daily Charts */}
        <div className="flex flex-col gap-8">
          <MonthlyNetPNLChart data={chartData.monthlyNetPNL} />
          <Last30DaysNetPNLChart data={chartData.last30DaysNetPNL} />
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

### Ensure Data Generation Functions Exist

Verify or create in `app/src/utils/calculations.js`:

```javascript
// Update generateCumulativeProfitData to be date-based
export const generateCumulativeProfitData = (trades) => {
  if (!trades || trades.length === 0) {
    return [];
  }

  // Sort trades by exit_date chronologically
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.exit_date) - new Date(b.exit_date)
  );
  
  let cumulative = 0;
  const data = [];
  
  sortedTrades.forEach((trade) => {
    cumulative += trade.profit || 0;
    data.push({
      date: trade.exit_date,
      cumulative: cumulative,
      profit: trade.profit || 0
    });
  });
  
  return data;
};

// Generate monthly net P&L data
export const generateMonthlyNetPNLData = (trades) => {
  if (!trades || trades.length === 0) {
    return [];
  }

  // Group trades by month
  const monthlyData = {};
  
  trades.forEach((trade) => {
    const exitDate = new Date(trade.exit_date);
    const year = exitDate.getFullYear();
    const month = exitDate.getMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        monthKey,
        year,
        month,
        netPNL: 0
      };
    }
    
    monthlyData[monthKey].netPNL += trade.profit || 0;
  });

  // Convert to array and sort chronologically
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return Object.values(monthlyData)
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    })
    .map((item) => ({
      monthKey: item.monthKey,
      monthLabel: monthLabels[item.month],
      monthFull: `${monthLabels[item.month]} ${item.year}`,
      netPNL: item.netPNL,
      year: item.year,
      monthIndex: item.month
    }));
};

// Generate last 30 days net P&L data
export const generateLast30DaysNetPNLData = (trades) => {
  if (!trades || trades.length === 0) {
    return [];
  }

  // Find the most recent exit date
  const exitDates = trades
    .map(trade => new Date(trade.exit_date))
    .filter(date => !isNaN(date.getTime()));
  
  if (exitDates.length === 0) {
    return [];
  }

  const mostRecentDate = new Date(Math.max(...exitDates));
  
  // Calculate date range (last 30 days)
  const startDate = new Date(mostRecentDate);
  startDate.setDate(startDate.getDate() - 30);
  
  // Initialize daily data
  const dailyData = {};
  
  // Initialize all days in range with zero
  for (let d = new Date(startDate); d <= mostRecentDate; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toISOString().split('T')[0];
    dailyData[dateKey] = {
      date: dateKey,
      dateLabel: dateKey,
      netPNL: 0,
      isPositive: true
    };
  }

  // Sum profits for each day
  trades.forEach((trade) => {
    const exitDate = new Date(trade.exit_date);
    const dateKey = exitDate.toISOString().split('T')[0];
    
    if (exitDate >= startDate && exitDate <= mostRecentDate && dailyData[dateKey]) {
      dailyData[dateKey].netPNL += trade.profit || 0;
      dailyData[dateKey].isPositive = dailyData[dateKey].netPNL >= 0;
    }
  });

  // Convert to array and sort chronologically
  return Object.values(dailyData)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};
```

## Implementation Steps

1. **Create/verify chart components exist**
   - Ensure `CumulativeNetProfitChart.jsx` exists (should be created separately)
   - Ensure `MonthlyNetPNLChart.jsx` exists (should be created separately)
   - Ensure `Last30DaysNetPNLChart.jsx` exists (should be created separately)
   - Verify they accept `data` prop as array

2. **Add/verify data generation functions**
   - Verify `generateCumulativeProfitData` exists and is date-based
   - Add `generateMonthlyNetPNLData` if not exists
   - Add `generateLast30DaysNetPNLData` if not exists
   - Test functions with sample data

3. **Update DashboardView component**
   - Import chart components
   - Import data generation functions
   - Add `useMemo` for chart data generation
   - Replace placeholders with actual chart components
   - Pass data props to charts

4. **Test chart integration**
   - Test with real trade data
   - Test with empty trade array
   - Test with various data scenarios
   - Verify charts render correctly

5. **Test responsive behavior**
   - Test on different screen sizes
   - Verify charts stack correctly
   - Ensure layout doesn't break

6. **Performance testing**
   - Test with large datasets
   - Verify memoization works correctly
   - Check for unnecessary re-renders

7. **Styling verification**
   - Ensure charts match app's color scheme
   - Verify spacing and layout
   - Check for consistency

## Files to Create/Modify

1. **Files to Modify**
   - `app/src/components/views/DashboardView.jsx` - Add chart imports, data generation, and replace placeholders
   - `app/src/utils/calculations.js` - Add/update data generation functions

2. **Files to Reference (should already exist)**
   - `app/src/components/charts/CumulativeNetProfitChart.jsx` - Should be created separately
   - `app/src/components/charts/MonthlyNetPNLChart.jsx` - Should be created separately
   - `app/src/components/charts/Last30DaysNetPNLChart.jsx` - Should be created separately

## Acceptance Criteria

- ✅ All three chart components are integrated into DashboardView
- ✅ Chart placeholders are replaced with actual chart components
- ✅ Cumulative Net Profit Curve displays in left column
- ✅ Monthly Net P&L chart displays in right column, top position
- ✅ Last 30 Days Net P&L chart displays in right column, bottom position
- ✅ All charts receive correct data from parent component
- ✅ Data generation functions work correctly (date-based cumulative, monthly, daily)
- ✅ Charts display correctly with real data
- ✅ Charts handle empty data gracefully (show empty states)
- ✅ Layout is responsive and charts stack correctly on smaller screens
- ✅ Performance is acceptable (memoization working)
- ✅ Charts maintain app's color scheme and styling
- ✅ No console errors or warnings

## Edge Cases

1. **No trades**: All charts should show empty states gracefully
2. **Single trade**: Charts should still render correctly
3. **Trades outside 30-day window**: Last 30 days chart should show empty or only recent data
4. **Trades in single month**: Monthly chart should show single data point
5. **Very large datasets**: Charts should perform adequately
6. **Invalid dates**: Should handle gracefully without breaking
7. **Missing chart components**: Dashboard should not break if chart components are missing

## Dependencies

This work depends on:
- `DashboardView` component existing (from previous work)
- Chart components being created (separate work):
  - `CumulativeNetProfitChart.jsx`
  - `MonthlyNetPNLChart.jsx`
  - `Last30DaysNetPNLChart.jsx`

## Notes

- This work assumes chart components are already created. If not, they should be created first based on their individual implementation documentation.
- The data generation functions should be efficient and handle edge cases.
- Chart components should handle their own empty states internally.
- The layout structure should remain the same - we're just replacing placeholders with real components.
- All data calculation should happen in the DashboardView component using useMemo for performance.
- Charts should be pure presentation components that receive data and display it.

