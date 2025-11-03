# Trade Batch Comparison View Implementation

## Problem Statement

The application needs a new view that compares the performance of the current batch of up to 10 trades against the previous batch of 10 trades. This comparison view helps traders analyze their recent trading performance relative to their previous trading period, enabling them to identify trends, improvements, or areas that need attention.

The view should:
1. Compare the most recent batch of trades (up to 10 trades) against the previous batch of 10 trades
2. Display win rate charts for both batches side-by-side
3. Display a line chart comparing cumulative P&L between both batches
4. Show performance metrics side-by-side for easy comparison
5. Be accessible via a new menu item in the hamburger navigation menu
6. Handle edge cases gracefully (fewer than 10 trades, fewer than 20 trades, etc.)
7. Reuse existing chart components and styling patterns

## Current Implementation

### Navigation Structure
- The application uses a hamburger menu in `Header.jsx` for navigation
- Navigation items are defined in the `navItems` array (lines 95-100)
- Current navigation items include: Dashboard, Accounts, Performance, Settings
- Navigation items are displayed as buttons in the hamburger menu dropdown
- The app uses state-based view switching (no routing library currently)

### View Switching
- `App.jsx` uses conditional rendering based on state:
  - `viewingTrade` state determines if TradeDetailView is shown
  - Otherwise, DashboardView is displayed
  - Additional view states will need to be added for the batch comparison view

### Trade Data Structure
- Trades are fetched from Supabase and ordered by `entry_date` descending (newest first)
- Trade objects contain: `id`, `symbol`, `entry_price`, `exit_price`, `quantity`, `entry_date`, `exit_date`, `profit`, `result`, etc.
- Trades are stored in the `trades` array from `useTradeManagement` hook
- Metrics are calculated using `calculateMetrics` from `utils/calculations.js`

### Chart Components
- Uses Recharts library for all charts
- Existing chart components:
  - `WinLossChart.jsx` - Pie chart for win/loss ratio (can be reused for win rate)
  - `CumulativeNetProfitChart.jsx` - Area chart for cumulative profit (pattern to follow for line chart)
  - `MonthlyNetPNLChart.jsx` - Bar chart pattern
  - Chart styling uses dark theme with `bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl`
  - All charts use ResponsiveContainer and consistent tooltip styling

## Requirements

### Functional Requirements

1. **Batch Calculation Logic**
   - Trades are ordered by `entry_date` descending (newest first, index 0 = most recent)
   - **Special case: 10 or fewer trades total**
     - When `totalTrades <= 10`: Both current and previous batches should be set to the same data (all available trades)
     - This ensures both charts show the same performance data until there are enough trades to compare
   - **Normal case: 11+ trades**
     - Current batch: Most recent up to 10 trades
       - If `total_trades % 10 === 0`: indices 0-9 (exactly 10 trades)
       - Otherwise: indices 0 to `(total_trades % 10) - 1` (remaining trades after complete batches)
     - Previous batch: Previous 10 trades
       - If `total_trades % 10 === 0`: indices 10-19 (previous 10 trades)
       - Otherwise: indices `(total_trades % 10)` to `min((total_trades % 10) + 9, total_trades - 1)`
   - Both batches should be calculated correctly for all scenarios

2. **Win Rate Charts**
   - Display win rate chart for the current batch (most recent up to 10 trades)
   - Display win rate chart for the previous batch
   - **When 10 or fewer trades**: Both charts display the same data (current batch performance)
   - **When 11+ trades**: Charts display distinct data for current vs previous batches
   - Both charts should use the same styling as existing `WinLossChart` component
   - Charts should be side-by-side for easy comparison
   - Each chart should show: Win percentage, Win/Loss ratio visualization, Win/Loss counts

3. **Cumulative P&L Line Chart**
   - Display a line chart comparing cumulative P&L between current batch and previous batch
   - **When 10 or fewer trades**: Both lines display the same data (overlapping lines showing current batch performance)
   - **When 11+ trades**: Chart shows two distinct lines comparing current vs previous batch
   - Chart should show two lines: one for current batch, one for previous batch
   - X-axis should represent trade number (1st trade, 2nd trade, etc.)
   - Y-axis should represent cumulative profit/loss in dollars
   - Both lines should be clearly labeled and color-coded
   - Chart should follow the same styling pattern as `CumulativeNetProfitChart`

4. **Performance Metrics Display**
   - Calculate and display the following metrics for each batch:
     - Total Trades count
     - Total Profit/Loss
     - Win Rate (%)
     - Winning Trades count
     - Losing Trades count
     - Average Win amount
     - Average Loss amount
     - Best trade (highest profit)
     - Worst trade (lowest profit)
   - Display metrics side-by-side for easy comparison
   - Show visual indicators for improvements/declines (colors, arrows, percentages)

5. **Navigation Integration**
   - Add new menu item "Batch Comparison" to the hamburger menu
   - Add appropriate icon (e.g., `TrendingUp`, `BarChart2`, or `GitCompare` from lucide-react)
   - Menu item should navigate to the batch comparison view
   - Should work with existing navigation pattern

6. **View State Management**
   - Add new state to `App.jsx` for current view (e.g., `currentView` state)
   - Update conditional rendering logic to show appropriate view
   - Maintain ability to switch between Dashboard and Batch Comparison views
   - Preserve existing TradeDetailView functionality

7. **Edge Cases Handling**
   - **10 or fewer trades total**: Both charts and metrics should display the same performance data (current batch data) for both "Current Batch" and "Previous Batch" columns until we reach 11+ trades. This provides a baseline comparison view and avoids showing empty/placeholder states.
   - Fewer than 20 trades but more than 10: Show current incomplete batch vs previous batch (normal comparison)
   - Exactly 11+ trades: Normal comparison behavior with distinct current and previous batches
   - No trades: Display appropriate message
   - Empty batches: Handle gracefully with appropriate messaging

### Design Requirements

1. **Layout Structure**
   - Three main sections:
     - Top: Win rate charts side-by-side (2 columns)
     - Middle: Cumulative P&L comparison line chart (full width)
     - Bottom: Performance metrics side-by-side (2 columns)
   - Each section should have appropriate spacing
   - Visual comparison indicators (improvement arrows, color coding)

2. **Visual Design**
   - Maintain existing dark theme (`bg-gray-900`, `bg-gray-800`)
   - Use gradient backgrounds consistent with app design
   - Charts should match existing chart styling
   - Use color coding:
     - Green (`#10B981`) for positive metrics/improvements/current batch
     - Blue (`#60A5FA`) for current batch line chart
     - Orange/Amber (`#F59E0B`) for previous batch line chart
     - Red (`#EF4444`) for negative metrics/declines
     - Gray/neutral for comparisons

3. **Responsive Design**
   - Win rate charts: Side-by-side on large screens (`lg:grid-cols-2`), stacked on smaller screens
   - Line chart: Full width on all screens
   - Metrics: Side-by-side on large screens, stacked on smaller screens
   - Should work on mobile, tablet, and desktop

4. **Visual Indicators**
   - Show percentage change between batches (if applicable)
   - Use up/down arrows to indicate improvement/decline
   - Highlight significant differences
   - Color-code metrics (green for better, red for worse)

### Technical Requirements

1. **Component Files**
   - Create `app/src/components/views/TradeBatchComparisonView.jsx`
   - Component should receive props: `trades`, `startingBalance`, `onViewTrade`
   - Component should be self-contained and reusable

2. **Chart Components**
   - Reuse `WinLossChart` component for win rate charts (or create variant if needed)
   - Create new `BatchComparisonLineChart.jsx` for cumulative P&L comparison
   - Follow existing chart styling patterns
   - Use Recharts library consistently

3. **Batch Calculation Function**
   - Create utility function to calculate batches
   - Function signature: `calculateTradeBatches(trades)`
   - Returns: `{ currentBatch: [], previousBatch: [] }`
   - Handle all edge cases correctly
   - Use memoization for performance

4. **Chart Data Generation**
   - Create function to generate win/loss chart data: `generateWinLossChartData(batch)`
   - Create function to generate cumulative P&L line chart data: `generateBatchComparisonData(currentBatch, previousBatch)`
   - Both functions should handle empty batches gracefully
   - Data should be formatted correctly for Recharts

5. **Metrics Calculation**
   - Reuse existing `calculateMetrics` function from `utils/calculations.js`
   - Calculate metrics for each batch separately
   - Use `useMemo` for performance optimization

6. **Navigation Updates**
   - Update `Header.jsx` to include new navigation item
   - Add click handler to navigate to batch comparison view
   - Update `navItems` array with new item
   - Add new icon import from lucide-react

7. **App.jsx Updates**
   - Add state for current view: `const [currentView, setCurrentView] = useState('dashboard')`
   - Update conditional rendering to show appropriate view
   - Add handler function to change views
   - Pass view change handler to Header component

## Implementation Approach

### Batch Calculation Logic

The correct formula for batch calculation (trades ordered newest first):

```javascript
const calculateTradeBatches = (trades) => {
  const totalTrades = trades.length;
  
  if (totalTrades === 0) {
    return { currentBatch: [], previousBatch: [] };
  }
  
  // Special case: 10 or fewer trades - show same data for both batches
  if (totalTrades <= 10) {
    const allTrades = trades.slice(0); // Copy all trades
    return { currentBatch: allTrades, previousBatch: allTrades };
  }
  
  // Normal case: 11+ trades
  const remainder = totalTrades % 10;
  
  // Current batch (most recent up to 10 trades)
  let currentBatchStart = 0;
  let currentBatchEnd;
  
  if (remainder === 0) {
    // Exactly a multiple of 10: current batch is the last 10
    currentBatchEnd = 9;
  } else {
    // Incomplete batch: current batch is the remainder
    currentBatchEnd = remainder - 1;
  }
  
  const currentBatch = trades.slice(currentBatchStart, currentBatchEnd + 1);
  
  // Previous batch (previous 10 trades)
  let previousBatchStart;
  let previousBatchEnd;
  
  if (remainder === 0) {
    // If current batch is exactly 10, previous batch starts at index 10
    previousBatchStart = 10;
    previousBatchEnd = Math.min(19, totalTrades - 1);
  } else {
    // Current batch is incomplete, previous batch starts after it
    previousBatchStart = remainder;
    previousBatchEnd = Math.min(remainder + 9, totalTrades - 1);
  }
  
  const previousBatch = trades.slice(previousBatchStart, previousBatchEnd + 1);
  
  return { currentBatch, previousBatch };
};
```

### Examples

**10 or fewer trades (e.g., 5 trades total):**
- Current batch: indices 0-4 (all 5 trades) - 5 trades
- Previous batch: indices 0-4 (same as current batch) - 5 trades
- **Note**: Both charts show identical data until 11+ trades are reached

**10 trades total:**
- Current batch: indices 0-9 (all 10 trades) - 10 trades
- Previous batch: indices 0-9 (same as current batch) - 10 trades
- **Note**: Both charts show identical data until 11+ trades are reached

**13 trades total (11+ trades - normal comparison):**
- Current batch: indices 0-2 (trades #13, #12, #11) - 3 trades
- Previous batch: indices 3-12 (trades #10 through #1) - 10 trades

**25 trades total (11+ trades - normal comparison):**
- Current batch: indices 0-4 (trades #25, #24, #23, #22, #21) - 5 trades
- Previous batch: indices 5-14 (trades #20 through #11) - 10 trades

**20 trades total (exact multiple - normal comparison):**
- Current batch: indices 0-9 (trades #20 through #11) - 10 trades
- Previous batch: indices 10-19 (trades #10 through #1) - 10 trades

### Chart Data Generation

**Win Loss Chart Data:**
```javascript
const generateWinLossChartData = (batch) => {
  if (!batch || batch.length === 0) {
    return [
      { name: 'Wins', value: 0, color: '#10B981' },
      { name: 'Losses', value: 100, color: '#EF4444' }
    ];
  }
  
  const winningTrades = batch.filter(t => t.profit > 0 || t.result === 1).length;
  const losingTrades = batch.filter(t => t.profit < 0 || t.result === 0).length;
  const totalTrades = batch.length;
  
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  const lossRate = 100 - winRate;
  
  return [
    { name: 'Wins', value: winRate, color: '#10B981' },
    { name: 'Losses', value: lossRate, color: '#EF4444' }
  ];
};
```

**Cumulative P&L Line Chart Data:**
```javascript
const generateBatchComparisonData = (currentBatch, previousBatch) => {
  const maxLength = Math.max(currentBatch.length, previousBatch.length);
  const data = [];
  
  let currentCumulative = 0;
  let previousCumulative = 0;
  
  for (let i = 0; i < maxLength; i++) {
    const currentTrade = currentBatch[i];
    const previousTrade = previousBatch[i];
    
    if (currentTrade) {
      currentCumulative += currentTrade.profit || 0;
    }
    
    if (previousTrade) {
      previousCumulative += previousTrade.profit || 0;
    }
    
    data.push({
      tradeNumber: i + 1,
      currentCumulative: currentCumulative,
      previousCumulative: previousCumulative,
      // Only include values if trade exists
      currentValue: currentTrade ? currentCumulative : null,
      previousValue: previousTrade ? previousCumulative : null
    });
  }
  
  return data;
};
```

### Component Structure

```javascript
// app/src/components/views/TradeBatchComparisonView.jsx
import React, { useMemo } from 'react';
import { calculateMetrics } from '../../utils/calculations';
import { calculateTradeBatches, generateWinLossChartData, generateBatchComparisonData } from '../../utils/calculations';
import WinLossChart from '../charts/WinLossChart';
import BatchComparisonLineChart from '../charts/BatchComparisonLineChart';

const TradeBatchComparisonView = ({ trades, startingBalance, onViewTrade }) => {
  // Calculate batches
  const { currentBatch, previousBatch } = useMemo(() => {
    return calculateTradeBatches(trades);
  }, [trades]);
  
  // Calculate metrics for each batch
  const currentMetrics = useMemo(() => {
    return calculateMetrics(currentBatch, 0);
  }, [currentBatch]);
  
  const previousMetrics = useMemo(() => {
    return calculateMetrics(previousBatch, 0);
  }, [previousBatch]);
  
  // Generate chart data
  const currentWinLossData = useMemo(() => {
    return generateWinLossChartData(currentBatch);
  }, [currentBatch]);
  
  const previousWinLossData = useMemo(() => {
    return generateWinLossChartData(previousBatch);
  }, [previousBatch]);
  
  const comparisonLineData = useMemo(() => {
    return generateBatchComparisonData(currentBatch, previousBatch);
  }, [currentBatch, previousBatch]);
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Trade Batch Comparison</h1>
        <p className="text-gray-400">
          {trades.length <= 10 
            ? `Showing baseline view with ${currentBatch.length} trades (comparison available once you reach 11+ trades)`
            : `Comparing your most recent ${currentBatch.length} trades vs previous ${previousBatch.length} trades`
          }
        </p>
      </div>
      
      {/* Win Rate Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-4 sm:p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">Current Batch Win Rate</h3>
          <WinLossChart
            data={currentWinLossData}
            winningTrades={currentMetrics.winningTrades}
            losingTrades={currentMetrics.losingTrades}
          />
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-4 sm:p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">Previous Batch Win Rate</h3>
          {/* When 10 or fewer trades, previousBatch will have same data as currentBatch */}
          <WinLossChart
            data={previousWinLossData}
            winningTrades={previousMetrics.winningTrades}
            losingTrades={previousMetrics.losingTrades}
          />
        </div>
      </div>
      
      {/* Cumulative P&L Comparison Line Chart */}
      {/* Always show chart - when 10 or fewer trades, both lines will overlap with same data */}
      <BatchComparisonLineChart data={comparisonLineData} />
      
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Batch Metrics */}
        <BatchMetricsCard
          title="Current Batch"
          subtitle={`${currentBatch.length} trades`}
          metrics={currentMetrics}
          trades={currentBatch}
          onViewTrade={onViewTrade}
        />
        
        {/* Previous Batch Metrics */}
        {/* When 10 or fewer trades, previousBatch will have same data as currentBatch */}
        <BatchMetricsCard
          title="Previous Batch"
          subtitle={`${previousBatch.length} trades`}
          metrics={previousMetrics}
          trades={previousBatch}
          onViewTrade={onViewTrade}
        />
      </div>
    </div>
  );
};

export default TradeBatchComparisonView;
```

### BatchComparisonLineChart Component

```javascript
// app/src/components/charts/BatchComparisonLineChart.jsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { Info } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }
  
  const data = payload[0].payload;
  
  return (
    <div style={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8, color: '#F3F4F6', padding: '8px 10px' }}>
      <div style={{ fontSize: 12, color: '#D1D5DB', marginBottom: 4 }}>Trade #{data.tradeNumber}</div>
      {data.currentValue !== null && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 4 }}>
          <span style={{ color: '#60A5FA', fontSize: 12 }}>Current:</span>
          <span style={{ color: '#60A5FA', fontWeight: 600, fontSize: 12 }}>
            ${data.currentValue.toLocaleString()}
          </span>
        </div>
      )}
      {data.previousValue !== null && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
          <span style={{ color: '#F59E0B', fontSize: 12 }}>Previous:</span>
          <span style={{ color: '#F59E0B', fontWeight: 600, fontSize: 12 }}>
            ${data.previousValue.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

const BatchComparisonLineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-semibold text-gray-200">Cumulative P&L Comparison</h3>
          <Info className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-center justify-center h-[400px] text-gray-400">
          No data available
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-semibold text-gray-200">Cumulative P&L Comparison</h3>
        <Info className="w-4 h-4 text-gray-400" />
      </div>
      <div className="w-full">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="tradeNumber"
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              label={{ value: 'Trade Number', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <ReferenceLine y={0} stroke="#4B5563" />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: '#F3F4F6' }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="currentValue"
              name="Current Batch"
              stroke="#60A5FA"
              strokeWidth={2}
              dot={{ r: 4, fill: '#60A5FA' }}
              activeDot={{ r: 6 }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="previousValue"
              name="Previous Batch"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ r: 4, fill: '#F59E0B' }}
              activeDot={{ r: 6 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BatchComparisonLineChart;
```

### Navigation Integration

Update `Header.jsx`:

```javascript
// Add import
import { GitCompare } from 'lucide-react';

// Add props to Header component
const Header = ({ 
  // ... existing props
  currentView,
  onNavigateView
}) => {
  // ... existing code
  
  // Update navItems array (around line 95)
  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, isActive: currentView === 'dashboard', view: 'dashboard' },
    { label: 'Batch Comparison', icon: GitCompare, isActive: currentView === 'batchComparison', view: 'batchComparison' },
    { label: 'Accounts', icon: Wallet, isActive: false },
    { label: 'Performance', icon: BarChart3, isActive: false },
    { label: 'Settings', icon: Settings, isActive: false }
  ];
  
  // Update button click handler (around line 191)
  <button
    key={item.label}
    type="button"
    onClick={() => {
      if (item.view && onNavigateView) {
        onNavigateView(item.view);
      }
      closeMenu();
    }}
    className={...}
  >
```

### App.jsx Updates

```javascript
// Add state
const [currentView, setCurrentView] = useState('dashboard');

// Add handler
const handleViewChange = (view) => {
  setCurrentView(view);
  // Clear viewing trade when switching views
  clearViewingTrade();
  clearEditingTrade();
};

// Update Header component
<Header
  ...
  currentView={currentView}
  onNavigateView={handleViewChange}
/>

// Update conditional rendering
{viewingTrade ? (
  <TradeDetailView ... />
) : currentView === 'batchComparison' ? (
  <DateFilterProvider>
    <Header ... />
    {/* Forms */}
    <TradeBatchComparisonView
      trades={trades}
      startingBalance={startingBalance}
      onViewTrade={handleTradeView}
    />
  </DateFilterProvider>
) : (
  <DateFilterProvider>
    <Header ... />
    {/* Existing DashboardView */}
  </DateFilterProvider>
)}
```

## Implementation Steps

1. **Add batch calculation utility to calculations.js**
   - Add `calculateTradeBatches` function
   - Add `generateWinLossChartData` function
   - Add `generateBatchComparisonData` function
   - Test with various trade counts (5, 10, 13, 20, 25 trades)

2. **Create BatchComparisonLineChart component**
   - Create `app/src/components/charts/BatchComparisonLineChart.jsx`
   - Implement line chart with two series
   - Follow existing chart styling patterns
   - Add custom tooltip
   - Handle empty data gracefully

3. **Create TradeBatchComparisonView component**
   - Create `app/src/components/views/TradeBatchComparisonView.jsx`
   - Implement batch calculation logic
   - Calculate metrics for both batches
   - Generate chart data
   - Implement layout with three sections:
     - Win rate charts (side-by-side)
     - Cumulative P&L line chart (full width)
     - Performance metrics (side-by-side)

4. **Create BatchMetricsCard component (optional)**
   - Create reusable card component for displaying batch metrics
   - Include all relevant metrics
   - Add visual comparison indicators
   - Handle empty batch states

5. **Update App.jsx**
   - Add `currentView` state
   - Add `handleViewChange` function
   - Update conditional rendering logic
   - Import and integrate TradeBatchComparisonView
   - Pass view state to Header

6. **Update Header.jsx**
   - Add new navigation item "Batch Comparison"
   - Import appropriate icon (GitCompare or similar)
   - Add `currentView` and `onNavigateView` props
   - Update button click handlers
   - Update navItems array

7. **Test and refine**
   - Test with various trade counts
   - Verify chart rendering
   - Test navigation between views
   - Verify edge cases
   - Ensure responsive design works

## Files to Create/Modify

### New Files
1. `app/src/components/views/TradeBatchComparisonView.jsx` - Main comparison view component
2. `app/src/components/charts/BatchComparisonLineChart.jsx` - Line chart for P&L comparison
3. `app/src/components/ui/BatchMetricsCard.jsx` - Reusable metrics card for batch display (optional, can be inline)

### Modified Files
1. `app/src/App.jsx` - Add view state management and conditional rendering
2. `app/src/components/ui/Header.jsx` - Add navigation item and view change handler
3. `app/src/utils/calculations.js` - Add batch calculation and chart data generation utilities

## Dependencies

- Existing `calculateMetrics` function from `utils/calculations.js`
- Existing `WinLossChart` component (reuse)
- `useTradeManagement` hook for trades data
- `useAppState` hook for startingBalance
- lucide-react icons (GitCompare or similar)
- React hooks: `useState`, `useMemo`
- Recharts library (already in use)

## Acceptance Criteria

- ✅ TradeBatchComparisonView component is created and functional
- ✅ Batch calculation correctly identifies current and previous batches for all scenarios
- ✅ Win rate charts display correctly for both batches (side-by-side)
- ✅ Cumulative P&L line chart displays with two lines comparing both batches
- ✅ Metrics are calculated and displayed for both batches
- ✅ All charts reuse existing styling patterns and components where appropriate
- ✅ Navigation item "Batch Comparison" is added to hamburger menu
- ✅ View switching works correctly between Dashboard and Batch Comparison
- ✅ Component handles edge cases gracefully: when 10 or fewer trades, both batches show same data; when 11+ trades, shows normal comparison
- ✅ Layout is responsive (charts stack on smaller screens)
- ✅ Design matches existing app theme and styling
- ✅ All metrics display correctly for both batches
- ✅ Component is integrated into App.jsx with proper state management
- ✅ No console errors or warnings

## Edge Cases

1. **No trades**: Display message "No trades available for comparison"
2. **10 or fewer trades**: Both batches contain the same trades (all available trades). Both charts and metrics display identical data. This provides a baseline view until there are enough trades for a true comparison.
3. **Exactly 10 trades**: Both batches contain all 10 trades (same data). Both charts show identical performance data.
4. **11 trades**: Transition point - now shows distinct batches (1 trade current, 10 trades previous)
5. **Fewer than 20 trades but more than 10**: Show current incomplete batch vs previous batch (normal comparison)
6. **Empty batches**: Handle gracefully with appropriate messaging
7. **Zero profit in both batches**: Comparison should still work, show 0% change
8. **All winning trades in one batch, all losing in other**: Metrics should display correctly
9. **Very large number of trades**: Batch calculation should still work correctly
10. **Unequal batch sizes**: Line chart should handle different lengths correctly (use null for missing values)

## Testing Scenarios

1. **0 trades**: Verify appropriate message is displayed
2. **5 trades (≤10)**: Verify both batches = same 5 trades, both charts show identical data
3. **10 trades (≤10)**: Verify both batches = same 10 trades, both charts show identical data
4. **11 trades**: Verify transition to normal comparison - current batch = 1 trade, previous batch = 10 trades
5. **13 trades**: Verify current batch = 3 trades, previous batch = 10 trades
6. **25 trades**: Verify current batch = 5 trades, previous batch = 10 trades
7. **20 trades**: Verify current batch = 10 trades, previous batch = 10 trades
8. **Navigation**: Verify clicking menu item switches views correctly
9. **Metrics calculation**: Verify all metrics calculate correctly for each batch
10. **Win rate charts (≤10 trades)**: Verify both charts show identical data when 10 or fewer trades
11. **Win rate charts (11+ trades)**: Verify both charts show distinct data when 11+ trades
12. **Line chart (≤10 trades)**: Verify both lines overlap showing same data when 10 or fewer trades
13. **Line chart (11+ trades)**: Verify two distinct lines showing comparison when 11+ trades
14. **Metrics display (≤10 trades)**: Verify both columns show identical metrics when 10 or fewer trades
15. **Responsive design**: Verify layout adapts correctly on different screen sizes

## Notes

- The batch calculation is critical - ensure the logic matches the examples provided
- Trades are ordered by `entry_date` descending (newest first), so index 0 = most recent trade
- Reuse existing `WinLossChart` component to maintain consistency
- The line chart should handle null values gracefully when batch sizes differ
- The view should provide actionable insights by clearly showing improvement or decline
- Consider adding date range information for each batch (earliest and latest trade dates)
- Maintain consistency with existing DashboardView styling and structure
- All chart components should follow the same styling pattern for consistency

