# Net Profit Card Component

## Problem Statement

Users need a dashboard card component that displays the total net profit for their trades. This card should integrate seamlessly with the existing dashboard metrics cards and respect both the global date filter and tag filter, similar to how the WinRateCard component functions. The card should provide a clear, visually appealing display of the cumulative profit/loss from filtered trades.

## Current Implementation Context

### Dashboard Metrics Cards Architecture

The dashboard currently displays three metric cards in a grid layout:

1. **WinRateCard** (`app/src/components/ui/cards/WinRateCard.jsx`)
   - Displays win rate percentage, total trades, and a pie chart visualization
   - Receives metrics from `DashboardMetricsCards` component
   - Respects date and tag filters through filtered trades

2. **CurrentBalanceCard** (`app/src/components/ui/cards/CurrentBalanceCard.jsx`)
   - Displays current account balance with a mini line chart trend
   - Shows all-time balance (not filtered)

3. **AvgWLCard** (`app/src/components/ui/cards/AvgWLCard.jsx`)
   - Displays average win/loss ratio with visual bar representation
   - Respects date and tag filters

### Filtering System

The application uses a two-tier filtering system:

1. **Date Filter** (`DateFilterContext`)
   - Filters trades by exit date
   - Supports presets (Today, Last 7 Days, Last 30 Days, etc.) and custom ranges
   - Persists state in localStorage and URL parameters

2. **Tag Filter** (`TagFilterContext`)
   - Filters trades by selected tag IDs
   - Supports multiple filter modes (AND/OR)
   - Works in conjunction with date filter

3. **Combined Filtering** (`useFilteredTrades` hook)
   - Applies date filter first, then tag filter
   - Used by `DashboardView` to get filtered trades
   - All metrics cards receive data calculated from filtered trades

### Metrics Calculation

The `calculateMetrics` function in `app/src/utils/calculations.js` already calculates `totalProfit`:

```javascript
const totalProfit = trades.reduce((sum, trade) => sum + trade.profit, 0);
```

This value is included in the metrics object returned to `DashboardMetricsCards`:

```javascript
{
  totalTrades,
  winningTrades,
  losingTrades,
  totalProfit,  // <-- This is what we need
  winRate,
  avgWin,
  avgLoss,
  currentBalance: startingBalance + totalProfit
}
```

### Component Integration Flow

1. **DashboardView** (`app/src/components/views/DashboardView.jsx`)
   - Uses `useFilteredTrades(trades)` to get filtered trades
   - Calls `calculateMetrics(filteredTrades, startingBalance)` to compute metrics
   - Passes `metrics` object to `DashboardMetricsCards`

2. **DashboardMetricsCards** (`app/src/components/ui/DashboardMetricsCards.jsx`)
   - Receives `metrics` prop containing all calculated values
   - Renders individual card components in a grid layout
   - Currently renders: WinRateCard, CurrentBalanceCard, AvgWLCard

## Requirements

### Functional Requirements

1. **Display Total Net Profit**
   - Show the sum of all profit values from filtered trades
   - Display as currency formatted value (e.g., "$1,234.56" or "-$567.89")
   - Handle positive, negative, and zero values appropriately

2. **Filter Integration**
   - Automatically respect date filter (via `useFilteredTrades` hook)
   - Automatically respect tag filter (via `useFilteredTrades` hook)
   - Update dynamically when filters change
   - Display value based on currently filtered trades only

3. **Visual Design**
   - Match the design pattern of existing cards (WinRateCard, AvgWLCard)
   - Use consistent styling: white/dark background, backdrop blur, border, shadow
   - Include hover effects and transitions
   - Support dark mode

4. **Data Formatting**
   - Format currency with proper thousands separators
   - Show 2 decimal places for currency values
   - Use appropriate color coding (green for positive, red for negative, neutral for zero)
   - Handle edge cases (no trades, invalid data, NaN values)

### Technical Requirements

1. **Component Structure**
   - Create new file: `app/src/components/ui/cards/NetProfitCard.jsx`
   - Follow React functional component pattern with hooks
   - Use TypeScript-style prop destructuring with defaults

2. **Props Interface**
   ```javascript
   NetProfitCard({
     totalProfit = 0  // Number: sum of profit from filtered trades
   })
   ```

3. **Styling Requirements**
   - Use Tailwind CSS classes consistent with other cards
   - Background: `bg-white dark:bg-gray-800/50 backdrop-blur`
   - Border: `border border-gray-200 dark:border-gray-700`
   - Shadow: `shadow-lg hover:shadow-xl`
   - Rounded corners: `rounded-xl`
   - Padding: `p-6`
   - Hover effect: `hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-all`

4. **Visual Elements**
   - Header section with title "Net Profit" and Info icon (from lucide-react)
   - Large, bold display of the formatted currency value
   - Optional: Visual indicator (color coding, icon, or mini chart)
   - Consider adding a trend indicator or comparison if appropriate

5. **Integration Points**

   a. **Update DashboardMetricsCards.jsx**
   - Import the new `NetProfitCard` component
   - Extract `totalProfit` from `metrics` prop
   - Add `NetProfitCard` to the grid layout
   - Ensure grid layout accommodates 4 cards (currently 3)

   b. **Grid Layout Considerations**
   - Current grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3`
   - May need to adjust to `xl:grid-cols-4` or keep 3 columns with wrapping
   - Ensure responsive behavior on all screen sizes

6. **Data Flow**
   - `DashboardView` → filters trades → calculates metrics → passes to `DashboardMetricsCards`
   - `DashboardMetricsCards` → extracts `totalProfit` → passes to `NetProfitCard`
   - `NetProfitCard` → formats and displays the value

### Edge Cases to Handle

1. **No Trades**
   - Display "$0.00" when no trades are present
   - Handle gracefully when `totalProfit` is undefined or null

2. **Invalid Data**
   - Validate that `totalProfit` is a number
   - Handle NaN, Infinity, and undefined values
   - Default to 0 for invalid inputs

3. **Very Large/Small Values**
   - Ensure currency formatting handles large numbers correctly
   - Test with extreme values (millions, negative millions)

4. **Filter States**
   - When no filters are applied, show all-time net profit
   - When date filter is applied, show net profit for that period
   - When tag filter is applied, show net profit for tagged trades
   - When both filters are applied, show net profit for trades matching both

5. **Real-time Updates**
   - Card should update when trades are added/edited/deleted
   - Card should update when filters change
   - Card should update when account selection changes

### Design Considerations

1. **Visual Hierarchy**
   - Title should be smaller, secondary text
   - Main value should be prominent (text-2xl or larger, bold)
   - Use appropriate color contrast for readability

2. **Color Coding**
   - Positive profit: Green (#10B981 or similar)
   - Negative profit: Red (#EF4444 or similar)
   - Zero profit: Neutral gray
   - Consider using conditional classes based on profit value

3. **Optional Enhancements**
   - Add a mini trend chart showing profit over time (similar to CurrentBalanceCard)
   - Add percentage change indicator
   - Add comparison to previous period
   - Add icon indicator (up arrow for positive, down arrow for negative)

4. **Accessibility**
   - Ensure proper color contrast ratios
   - Include semantic HTML structure
   - Consider screen reader announcements for value changes

## Implementation Steps

1. **Create NetProfitCard Component**
   - Create `app/src/components/ui/cards/NetProfitCard.jsx`
   - Implement currency formatting function
   - Add proper styling and layout
   - Handle edge cases and validation
   - Add color coding for positive/negative values

2. **Update DashboardMetricsCards**
   - Import `NetProfitCard`
   - Extract `totalProfit` from metrics
   - Add `NetProfitCard` to the grid
   - Test grid layout with 4 cards

3. **Testing**
   - Test with various filter combinations
   - Test with positive, negative, and zero values
   - Test with no trades
   - Test responsive layout on different screen sizes
   - Test dark mode appearance

4. **Integration Verification**
   - Verify card updates when filters change
   - Verify card updates when trades are modified
   - Verify consistent styling with other cards
   - Verify proper currency formatting

## Reference Components

### WinRateCard Pattern
- Uses `useMemo` for derived calculations
- Includes validation and clamping functions
- Has Info icon in header
- Displays multiple values (percentage and total trades)
- Includes visual chart element

### CurrentBalanceCard Pattern
- Simple header with title and Info icon
- Large formatted currency value
- Mini line chart visualization
- Hover interaction for chart

### AvgWLCard Pattern
- Header with title and Info icon
- Large formatted value
- Visual bar representation
- Handles edge cases (no data)

## Success Criteria

1. ✅ Card displays total net profit from filtered trades
2. ✅ Card respects date filter (updates when date filter changes)
3. ✅ Card respects tag filter (updates when tag filter changes)
4. ✅ Card matches design pattern of existing cards
5. ✅ Currency is properly formatted with thousands separators
6. ✅ Color coding indicates positive/negative/zero profit
7. ✅ Card handles edge cases gracefully (no trades, invalid data)
8. ✅ Card is responsive and works on all screen sizes
9. ✅ Card supports dark mode
10. ✅ Card integrates seamlessly into existing dashboard grid layout

