# Current Balance Card Implementation

## Problem Statement

The dashboard screenshot shows an enhanced "Current Balance" metric card that displays the current account balance along with a small subtle line chart visualization showing the balance trend over time. This provides both the current balance value and visual context about how the balance has changed.

## Current Implementation

The existing `MetricsCards` component displays "Account Balance" as a simple value. The enhanced card needs to show:
- Current balance value (formatted as currency)
- A small subtle line chart showing balance trend over time
- Chart should use a thin green line and be minimal/decorative

## Requirements

### Functional Requirements

1. **Main Value Display**
   - Display current balance as the primary large value
   - Format: Currency (e.g., "$3,342.66")
   - Should be prominently displayed

2. **Mini Trend Chart**
   - Display a small subtle line chart showing account balance trend
   - Chart should show the progression of balance over time
   - Use a thin green line (1-2px stroke width)
   - Chart should be minimal and decorative, not the primary focus
   - Height should be small (30-40px)
   - No grid lines, axis labels, or tooltips visible
   - Use last 10-15 data points from account balance calculations

### Design Requirements

1. **Color Scheme**
   - Value text: White or appropriate positive color
   - Line chart: Thin green line (`#10B981` or `emerald-400`)
   - Background: `bg-gray-800/50` with `backdrop-blur` and `border-gray-700`
   - Text: `text-gray-200` for title, white for values

2. **Layout**
   - Card should be rounded (`rounded-xl`)
   - Consistent padding (`p-6`)
   - Maintain hover effects (`hover:bg-gray-800/70`)
   - Chart should be positioned at bottom of card

3. **Typography**
   - Title: "Current Balance" with info icon (`text-gray-400 text-sm font-medium`)
   - Main value: `text-2xl font-bold`

### Technical Requirements

1. **Component Props**
   - Component should accept:
     - `currentBalance`: Number (current account balance)
     - `trendData`: Array of data points for mini chart (optional)

2. **Chart Library**
   - Use Recharts `LineChart` with `Line` component
   - Use minimal `ResponsiveContainer` with small height

3. **Data Generation**
   - Mini chart data should be generated from account balance over time calculations
   - Take last N points (10-15) from account balance data
   - Each point should have: `{ value: number }` or `{ balance: number }`
   - Data comes from `generateAccountBalanceData` (already exists in calculations.js)

## Implementation Approach

### Component Structure

```javascript
// app/src/components/ui/cards/CurrentBalanceCard.jsx
import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Info } from 'lucide-react';

const CurrentBalanceCard = ({ currentBalance, trendData = [] }) => {
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Prepare mini chart data (use last 10 points)
  const chartData = trendData.slice(-10).map((point, index) => ({
    index,
    value: point.balance || point.value || 0
  }));

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-gray-400 text-sm font-medium">Current Balance</h3>
        <Info className="h-4 w-4 text-gray-400" />
      </div>
      
      <p className="text-2xl font-bold text-white mb-4">
        {formatCurrency(currentBalance)}
      </p>
      
      {chartData.length > 0 && (
        <div className="mt-4 h-[40px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CurrentBalanceCard;
```

### Alternative with Gradient Fill

For a slightly more polished look (optional):

```javascript
<LineChart 
  data={chartData} 
  margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
>
  <defs>
    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
      <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
    </linearGradient>
  </defs>
  <Line
    type="monotone"
    dataKey="value"
    stroke="#10B981"
    strokeWidth={1.5}
    dot={false}
    isAnimationActive={false}
  />
</LineChart>
```

However, based on the screenshot, the chart appears as a simple line without fill, so keep it minimal.

## Data Generation Function

Add to `app/src/utils/calculations.js` (if not already available):

```javascript
// Generate mini trend data for Current Balance chart
export const generateBalanceTrendData = (accountBalanceData, pointCount = 10) => {
  if (!accountBalanceData || accountBalanceData.length === 0) {
    return [];
  }
  
  // Take last N points from account balance data
  const lastPoints = accountBalanceData.slice(-pointCount);
  
  return lastPoints.map(point => ({
    balance: point.balance || point.value || 0
  }));
};
```

Note: This can reuse the existing `generateAccountBalanceData` function and just take the last N points.

## Implementation Steps

1. **Create component file**
   - Create `app/src/components/ui/cards/CurrentBalanceCard.jsx`
   - Import necessary dependencies (React, Recharts, Lucide)

2. **Implement value display**
   - Format currency correctly
   - Display prominently

3. **Implement mini chart**
   - Create minimal LineChart
   - Style to be subtle and decorative
   - Use green line color
   - Ensure no visible axes or grid

4. **Styling**
   - Apply card styling to match app design
   - Ensure responsive behavior
   - Keep chart minimal

5. **Integration**
   - Import into main DashboardMetricsCards component
   - Pass currentBalance and trend data from metrics/calculations

## Files to Create/Modify

1. **New Files**
   - `app/src/components/ui/cards/CurrentBalanceCard.jsx` - Card component

2. **Files to Modify**
   - `app/src/utils/calculations.js` - Add `generateBalanceTrendData` function (if needed)
   - `app/src/components/ui/DashboardMetricsCards.jsx` - Import and use CurrentBalanceCard

## Acceptance Criteria

- ✅ Card displays current balance formatted as currency
- ✅ Mini trend chart displays at bottom of card
- ✅ Chart uses thin green line and is minimal/decorative
- ✅ Chart shows progression of balance over time
- ✅ No axes, grid lines, or tooltips visible in mini chart
- ✅ Card handles edge cases (no data, zero balance, etc.)
- ✅ Card is responsive and maintains proper styling
- ✅ Chart uses app's green color scheme for positive trend

## Edge Cases

1. **No trend data**
   - Hide mini chart if no data available
   - Don't show empty chart
   - Still display balance value

2. **Zero balance**
   - Display "$0.00"
   - Chart should still render if data available

3. **Very large values**
   - Ensure currency formatting handles large numbers (commas)
   - Chart should scale appropriately

4. **Very small values**
   - Display with appropriate decimal places
   - Chart should show detail even for small variations

5. **Negative balance**
   - Display with minus sign
   - Consider using red color for negative balance (though unlikely in trading context)
   - Chart should handle negative values

6. **Single data point**
   - Chart may show as a single point or line
   - Handle gracefully

## Notes

- The mini chart should be very subtle - it's a decorative element to show trend direction, not a detailed analytical chart. Consider using opacity or very thin lines.
- The screenshot shows the chart as a simple green line without any fill or gradient. Keep it minimal.
- The chart data should come from account balance calculations (already available in the codebase via `generateAccountBalanceData`).
- The green line indicates a positive/upward trend visually, which is appropriate for account balance.
- Consider using last 10-15 data points to keep the chart minimal while still showing recent trend.
- The chart is decorative, so don't add interactivity or detailed tooltips - keep it simple and clean.

