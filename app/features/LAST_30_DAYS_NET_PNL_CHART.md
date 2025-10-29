# Last 30 Days Net P&L Chart Implementation

## Problem Statement

The dashboard screenshot shows a "Last 30 Days Net P&L" chart that displays daily net profit and loss as a bar chart for the most recent 30 days. The chart is positioned in the bottom-right section of the dashboard and features:
- Bar chart showing daily profit/loss
- Date-based X-axis showing specific dates
- Y-axis showing dollar values
- Green bars for positive values (profits)
- Black/dark bars for negative values (losses)
- Only shows the last 30 days with data (days without trades can be skipped or shown as zero)

The current implementation does not include daily aggregation or a 30-day view of profit/loss data.

## Current Implementation

There is no existing daily P&L chart in the codebase. This is a new component that needs to be created from scratch.

## Requirements

### Functional Requirements

1. **Daily Aggregation for Last 30 Days**
   - Calculate net P&L for each day in the last 30 days
   - Group trades by `exit_date` (daily)
   - Sum all profits/losses for each day
   - Only include days that are within the last 30 days from the most recent trade date
   - Handle days with no trades (show as zero or skip, based on preference)

2. **Bar Chart Display**
   - Display as vertical bar chart (columns)
   - Bars should be green (`#10B981` or `emerald-400`) when value is positive
   - Bars should be black/dark (`#000000` or `gray-900`) when value is negative
   - Bars should clearly indicate profit vs loss

3. **X-Axis Formatting**
   - Display dates in format shown in screenshot (e.g., "2020-02-07", "2020-02-24")
   - Show multiple date labels spaced appropriately
   - Format as YYYY-MM-DD or similar compact format
   - Only show dates that have data or space labels to avoid crowding

4. **Y-Axis Formatting**
   - Display dollar values
   - Show both positive and negative values
   - Include zero line
   - Appropriate tick spacing for data range
   - Format: "$X,XXX" or "$-X,XXX"

5. **Bar Styling**
   - Bars should be clearly visible but not overwhelming
   - Consistent width for all bars
   - Proper spacing between bars
   - Color should indicate direction (green = profit, black = loss)

6. **Tooltip Functionality**
   - Display on hover:
     - Date (formatted, e.g., "February 7, 2020")
     - Net P&L value (formatted as currency, e.g., "$50.00" or "$-75.50")
   - Styled to match app theme

### Design Requirements

1. **Size and Layout**
   - Medium-sized chart, fits in right column
   - Should be positioned below the "Monthly Net P&L" chart
   - Responsive container
   - Height: 250-300px

2. **Color Scheme**
   - Positive bars: Green (`#10B981` or `emerald-400`)
   - Negative bars: Black (`#000000` or `gray-900`)
   - Axis labels: Gray (`#9CA3AF` or `text-gray-400`)
   - Grid lines: Subtle gray (`#374151`)
   - Background: Match card background (`bg-gray-800/50`)

3. **Card Styling**
   - Title: "Last 30 Days Net P&L" with info icon
   - Card background: `bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6`
   - Title styling: `text-xl font-semibold mb-4 text-gray-200`

### Technical Requirements

1. **Data Structure**
   - Component should receive: `{ data: array }`
   - Each data point should include:
     - `date`: Date string (ISO format or Date object)
     - `dateLabel`: Display label for X-axis (e.g., "2020-02-07")
     - `netPNL`: Number (sum of profits for that day)
     - `isPositive`: Boolean (for conditional styling)

2. **Data Generation Function**
   - Create `generateLast30DaysNetPNLData` function in `calculations.js`
   - Input: Array of trades
   - Output: Array of daily aggregated data points for last 30 days
   - Logic:
     1. Find the most recent trade's `exit_date`
     2. Calculate date range (last 30 days from that date)
     3. Group trades by date within that range
     4. Sum `profit` values for each day
     5. Include all days in range (with zero for days without trades, or skip)
     6. Format for display

3. **Chart Library**
   - Use Recharts `BarChart` component
   - Use `Bar` component for individual bars
   - Use `ResponsiveContainer` for responsiveness
   - Configure axes, tooltips, and styling appropriately
   - Use `Cell` component for conditional coloring

## Implementation Approach

### Component Structure

```javascript
// app/src/components/charts/Last30DaysNetPNLChart.jsx
import React from 'react';
import { 
  BarChart, 
  Bar, 
  Cell,
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
  
  // Initialize daily data object
  const dailyData = {};
  
  // Initialize all days in range with zero
  for (let d = new Date(startDate); d <= mostRecentDate; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toISOString().split('T')[0]; // YYYY-MM-DD
    dailyData[dateKey] = {
      date: dateKey,
      dateLabel: dateKey, // Can format differently if needed
      netPNL: 0,
      isPositive: true
    };
  }

  // Sum profits for each day
  trades.forEach((trade) => {
    const exitDate = new Date(trade.exit_date);
    const dateKey = exitDate.toISOString().split('T')[0];
    
    // Only include if within last 30 days
    if (exitDate >= startDate && exitDate <= mostRecentDate && dailyData[dateKey]) {
      dailyData[dateKey].netPNL += trade.profit || 0;
    }
  });

  // Convert to array, update isPositive flag, and sort chronologically
  const dataArray = Object.values(dailyData)
    .map(item => ({
      ...item,
      isPositive: item.netPNL >= 0
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Optionally filter out days with zero (if you want to skip empty days)
  // return dataArray.filter(item => item.netPNL !== 0);

  return dataArray;
};
```

### Chart Component Implementation

```javascript
const Last30DaysNetPNLChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-semibold text-gray-200">Last 30 Days Net P&L</h3>
          <Info className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-center justify-center h-[300px] text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  const formatDateForTooltip = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-semibold text-gray-200">Last 30 Days Net P&L</h3>
        <Info className="h-4 w-4 text-gray-400" />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="dateLabel" 
            stroke="#9CA3AF"
            tick={{ fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            height={60}
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
            labelFormatter={(label) => formatDateForTooltip(label)}
          />
          <Bar dataKey="netPNL" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.isPositive ? '#10B981' : '#000000'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
```

## Implementation Steps

1. **Add data generation function**
   - Add `generateLast30DaysNetPNLData` to `calculations.js`
   - Test with sample data
   - Ensure proper date range calculation

2. **Create chart component**
   - Create `Last30DaysNetPNLChart.jsx`
   - Implement BarChart with conditional coloring
   - Add empty state handling

3. **Conditional bar coloring**
   - Use `Cell` component to color bars based on value
   - Green for positive, black for negative

4. **Date formatting**
   - Format X-axis labels appropriately
   - Format tooltip dates for readability

5. **Styling**
   - Apply color scheme
   - Style card and axes
   - Ensure responsive behavior
   - Handle rotated X-axis labels

6. **Integration**
   - Update `App.jsx` to generate daily data
   - Pass data to component
   - Place in dashboard layout (right column, bottom)

7. **Testing**
   - Test with various date ranges
   - Test with days without trades
   - Test with all positive/negative/all mixed
   - Test empty state
   - Test edge cases (exactly 30 days, less than 30 days, more than 30 days)

## Files to Create/Modify

1. **New Files**
   - `app/src/components/charts/Last30DaysNetPNLChart.jsx` - Chart component

2. **Files to Modify**
   - `app/src/utils/calculations.js` - Add `generateLast30DaysNetPNLData` function
   - `app/src/App.jsx` - Generate daily data and include component in dashboard

3. **Files to Reference**
   - Other chart components for styling patterns
   - `app/src/components/charts/WinLossChart.jsx` for bar chart reference

## Acceptance Criteria

- ✅ Chart displays daily net P&L for the last 30 days as a bar chart
- ✅ X-axis shows dates in appropriate format
- ✅ Y-axis shows dollar values with proper formatting
- ✅ Positive values are shown as green bars
- ✅ Negative values are shown as black bars
- ✅ Only the last 30 days from most recent trade are shown
- ✅ Days without trades are handled appropriately (shown as zero or skipped)
- ✅ Interactive tooltips show formatted date and net P&L value
- ✅ Tooltip formats currency correctly
- ✅ Chart handles empty data gracefully
- ✅ Chart is responsive and works on all screen sizes
- ✅ Chart maintains app's color scheme and styling
- ✅ Bars are clearly visible and properly spaced

## Edge Cases

1. **No trades**: Display empty state message
2. **Less than 30 days of data**: Show only available days
3. **More than 30 days since last trade**: Show last 30 days from most recent trade
4. **All positive days**: All bars should be green
5. **All negative days**: All bars should be black
6. **Many zero days**: Bars should show at zero (or skip based on preference)
7. **Very large P&L values**: Y-axis should format with commas
8. **Multiple trades same day**: Should sum correctly
9. **Trades outside 30-day window**: Should be excluded

## Notes

- The decision to show days with zero trades or skip them is a design choice. The screenshot appears to skip empty days, but including them can show trading frequency. Consider making this configurable or match the screenshot behavior.
- The X-axis labels may need to be rotated or spaced carefully if showing all 30 days to avoid crowding.
- Consider showing fewer date labels on X-axis if space is limited (e.g., every 5-7 days).
- The "last 30 days" should be calculated from the most recent trade date, not from today, to ensure relevant data is shown.
- Bar radius rounding at the top (`radius={[4, 4, 0, 0]}`) makes bars look more polished.

