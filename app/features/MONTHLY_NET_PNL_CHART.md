# Monthly Net P&L Chart Implementation

## Problem Statement

The dashboard screenshot shows a "Monthly Net P&L" chart that displays net profit and loss aggregated by month. The chart is positioned in the top-right section of the dashboard and features:
- Line chart showing monthly profit/loss
- Date-based X-axis with month abbreviations (Jan, Feb, Mar, etc.)
- Y-axis showing dollar values
- Green line for positive values
- Ability to handle missing months (months with no trades are skipped)

The current implementation does not include monthly aggregation of profit/loss data.

## Current Implementation

There is no existing monthly P&L chart in the codebase. This is a new component that needs to be created from scratch.

## Requirements

### Functional Requirements

1. **Monthly Aggregation**
   - Group all trades by month based on `exit_date`
   - Calculate net P&L (sum of all profits/losses) for each month
   - Handle months with no trades (skip them, don't show zero)
   - Sort months chronologically

2. **Line Chart Display**
   - Display as a line chart connecting monthly data points
   - Line should be green (`#10B981` or `emerald-400`)
   - Line should be vibrant and clearly visible
   - Smooth curve connecting points

3. **X-Axis Formatting**
   - Display month abbreviations: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
   - Only show months that have data (skip empty months)
   - Proper spacing between month labels
   - Format: 3-letter abbreviation

4. **Y-Axis Formatting**
   - Display dollar values
   - Show both positive and negative values
   - Include zero line
   - Appropriate tick spacing for data range
   - Format: "$X,XXX" or "$-X,XXX"

5. **Data Points**
   - Show data points on the line
   - Points should be visible but not overwhelming
   - Use same color as line (green)

6. **Tooltip Functionality**
   - Display on hover:
     - Month name (e.g., "January 2020")
     - Net P&L value (formatted as currency, e.g., "$-150.50")
   - Styled to match app theme

### Design Requirements

1. **Size and Layout**
   - Medium-sized chart, fits in right column
   - Should be positioned above the "Last 30 Days Net P&L" chart
   - Responsive container
   - Height: 250-300px

2. **Color Scheme**
   - Line: Green (`#10B981` or `emerald-400`)
   - Data points: Green (matching line)
   - Axis labels: Gray (`#9CA3AF` or `text-gray-400`)
   - Grid lines: Subtle gray (`#374151`)
   - Background: Match card background (`bg-gray-800/50`)

3. **Card Styling**
   - Title: "Monthly Net P&L" with info icon
   - Card background: `bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6`
   - Title styling: `text-xl font-semibold mb-4 text-gray-200`

### Technical Requirements

1. **Data Structure**
   - Component should receive: `{ data: array }`
   - Each data point should include:
     - `month`: Month identifier (e.g., "2020-01" or Date object)
     - `monthLabel`: Display label (e.g., "Jan")
     - `netPNL`: Number (sum of profits for that month)
     - `year`: Optional, for full date in tooltips

2. **Data Generation Function**
   - Create `generateMonthlyNetPNLData` function in `calculations.js`
   - Input: Array of trades
   - Output: Array of monthly aggregated data points
   - Logic:
     1. Group trades by month/year from `exit_date`
     2. Sum `profit` values for each month
     3. Format for display
     4. Sort chronologically

3. **Chart Library**
   - Use Recharts `LineChart` component
   - Use `ResponsiveContainer` for responsiveness
   - Configure axes, tooltips, and styling appropriately

## Implementation Approach

### Component Structure

```javascript
// app/src/components/charts/MonthlyNetPNLChart.jsx
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Info } from 'lucide-react';
```

### Data Generation Function

Add to `app/src/utils/calculations.js`:

```javascript
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
    const month = exitDate.getMonth(); // 0-11
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`; // "2020-01"
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        monthKey,
        year,
        month,
        netPNL: 0,
        count: 0
      };
    }
    
    monthlyData[monthKey].netPNL += trade.profit || 0;
    monthlyData[monthKey].count += 1;
  });

  // Convert to array and sort chronologically
  const dataArray = Object.values(monthlyData)
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

  // Format for chart
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return dataArray.map((item) => ({
    monthKey: item.monthKey,
    monthLabel: monthLabels[item.month],
    monthFull: `${monthLabels[item.month]} ${item.year}`,
    netPNL: item.netPNL,
    year: item.year,
    monthIndex: item.month,
    tradeCount: item.count
  }));
};
```

### Chart Component Implementation

```javascript
const MonthlyNetPNLChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-semibold text-gray-200">Monthly Net P&L</h3>
          <Info className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-center justify-center h-[300px] text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-semibold text-gray-200">Monthly Net P&L</h3>
        <Info className="h-4 w-4 text-gray-400" />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="monthLabel" 
            stroke="#9CA3AF"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F3F4F6'
            }}
            formatter={(value) => [`$${value.toLocaleString()}`, 'Net P&L']}
            labelFormatter={(label, payload) => {
              if (payload && payload.length > 0) {
                return payload[0].payload.monthFull;
              }
              return label;
            }}
          />
          <Line 
            type="monotone" 
            dataKey="netPNL" 
            stroke="#10B981" 
            strokeWidth={2.5}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#059669' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
```

## Implementation Steps

1. **Add data generation function**
   - Add `generateMonthlyNetPNLData` to `calculations.js`
   - Test with sample data

2. **Create chart component**
   - Create `MonthlyNetPNLChart.jsx`
   - Implement LineChart with proper styling
   - Add empty state handling

3. **Date formatting**
   - Ensure month labels format correctly
   - Format tooltip dates appropriately

4. **Styling**
   - Apply green line color
   - Style card and axes
   - Ensure responsive behavior

5. **Integration**
   - Update `App.jsx` to generate monthly data
   - Pass data to component
   - Place in dashboard layout (right column, top)

6. **Testing**
   - Test with various date ranges
   - Test with missing months
   - Test with single month data
   - Test empty state

## Files to Create/Modify

1. **New Files**
   - `app/src/components/charts/MonthlyNetPNLChart.jsx` - Chart component

2. **Files to Modify**
   - `app/src/utils/calculations.js` - Add `generateMonthlyNetPNLData` function
   - `app/src/App.jsx` - Generate monthly data and include component in dashboard

3. **Files to Reference**
   - Other chart components for styling patterns
   - `app/src/components/charts/AccountBalanceChart.jsx` for structure

## Acceptance Criteria

- ✅ Chart displays monthly aggregated net P&L as a line chart
- ✅ X-axis shows month abbreviations (Jan, Feb, Mar, etc.)
- ✅ Y-axis shows dollar values with proper formatting
- ✅ Line is green and clearly visible
- ✅ Only months with data are displayed (empty months are skipped)
- ✅ Months are sorted chronologically
- ✅ Interactive tooltips show full month name and net P&L value
- ✅ Tooltip formats currency correctly
- ✅ Chart handles empty data gracefully
- ✅ Chart is responsive and works on all screen sizes
- ✅ Chart maintains app's color scheme and styling
- ✅ Data points are visible on the line

## Edge Cases

1. **No trades**: Display empty state message
2. **Single month**: Chart should still render correctly
3. **Large gaps between months**: Chart should skip empty months without showing them
4. **Very large P&L values**: Y-axis should format with commas
5. **Negative monthly P&L**: Line should go below zero line correctly
6. **Mixed positive/negative**: Line should show both above and below zero
7. **Cross-year data**: Should handle multiple years correctly
8. **Trades spanning multiple months**: Should group by exit month only

## Notes

- The screenshot shows months abbreviated to 3 letters. This is standard for chart display.
- Consider adding a reference line at y=0 for easier visual reference if not already included by default.
- If the dataset is very large, consider aggregating trades efficiently to avoid performance issues.
- The tooltip can show additional information like number of trades in that month if helpful (though not shown in screenshot).

