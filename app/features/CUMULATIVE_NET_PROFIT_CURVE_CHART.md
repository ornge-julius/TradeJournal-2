# Cumulative Net Profit Curve Chart Implementation

## Problem Statement

The dashboard screenshot shows a large "Cumulative Net Profit Curve" chart that displays the cumulative net profit over time with several distinctive features:
- Date-based X-axis (not trade number)
- Shaded area below the $0 line to emphasize periods of loss
- Interactive tooltips showing date and profit values
- Clean, minimal design with proper axis formatting
- Multiple date labels showing the progression over time

The current `CumulativeProfitChart` component uses trade numbers on the X-axis and doesn't include the shaded area or date formatting shown in the screenshot.

## Current Implementation

The existing `CumulativeProfitChart` component (`app/src/components/charts/CumulativeProfitChart.jsx`):
- Uses trade numbers (`tradeNum`) on the X-axis instead of dates
- Shows cumulative profit over trades, not over time
- Uses a green line (`#10B981`)
- Does not include shaded area below zero line
- Does not format dates properly

## Requirements

### Functional Requirements

1. **Date-Based X-Axis**
   - X-axis should display dates from trade exit dates
   - Dates should be formatted appropriately (e.g., "09/26/2019", "12/02/2019")
   - X-axis should show multiple date labels spaced appropriately
   - Use `exit_date` from trades as the date source

2. **Cumulative Net Profit Calculation**
   - Calculate cumulative profit chronologically by exit date
   - Start from first trade's exit date
   - Show progression over time, not just by trade number
   - Handle trades that exit on the same date appropriately

3. **Shaded Area Below Zero**
   - Add a filled area below the $0 line on the Y-axis
   - Shaded area should be light gray
   - Should extend from the zero line down to the bottom of the chart
   - Should highlight periods when cumulative profit is negative

4. **Line Styling**
   - Line should be thin and black (matching screenshot)
   - Stroke width: 1-2px (thinner than current 3px)
   - Color: Black (`#000000` or `gray-900`)
   - No dots on the line (or very subtle dots)
   - Smooth curve connecting data points

5. **Tooltip Functionality**
   - Interactive tooltips on hover
   - Display:
     - Date: Formatted date (e.g., "02/20/2020")
     - Profit: Formatted currency (e.g., "$-765.97")
   - Tooltip should follow cursor or appear near data point
   - Styled to match app theme (dark background)

6. **Y-Axis Formatting**
   - Display dollar values with proper formatting
   - Show both positive and negative values
   - Include zero line with clear marker
   - Appropriate tick spacing for data range
   - Format: "$X,XXX" or "$-X,XXX"

### Design Requirements

1. **Size and Layout**
   - Should be large, taking up left column of dashboard
   - Responsive container that fills available width
   - Height: Minimum 300px, preferably 400-500px for better visibility
   - Should use `lg:col-span-2` if in grid to take full width

2. **Color Scheme**
   - Line: Black (`#000000`)
   - Shaded area: Light gray (`rgba(107, 114, 128, 0.2)` or similar)
   - Axis labels: Gray (`#9CA3AF` or `text-gray-400`)
   - Grid lines: Subtle gray (`#374151`)
   - Background: Match card background (`bg-gray-800/50`)

3. **Card Styling**
   - Title: "Cumulative Net Profit Curve" with info icon
   - Card background: `bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6`
   - Title styling: `text-xl font-semibold mb-4 text-gray-200`

### Technical Requirements

1. **Data Structure**
   - Component should receive: `{ data: array }`
   - Each data point should include:
     - `date`: ISO date string or Date object (from `exit_date`)
     - `cumulative`: Number (cumulative profit value)
     - `profit`: Number (individual trade profit, optional)

2. **Date Sorting and Grouping**
   - Trades must be sorted by `exit_date` chronologically
   - If multiple trades exit on same date, aggregate or show latest cumulative value
   - Ensure no gaps in time series (each date should have a value)

3. **Chart Library**
   - Use Recharts `AreaChart` or `LineChart` with `Area` component for shading
   - Use `ResponsiveContainer` for responsiveness
   - Configure axes, tooltips, and styling appropriately

4. **Data Generation**
   - Modify `generateCumulativeProfitData` in `calculations.js` to:
     - Sort trades by `exit_date` (ascending)
     - Calculate cumulative profit chronologically
     - Return data with `date` field formatted appropriately

## Implementation Approach

### Component Structure

```javascript
// app/src/components/charts/CumulativeNetProfitChart.jsx
import React from 'react';
import { 
  AreaChart, 
  Area, 
  Line, 
  LineChart,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Info } from 'lucide-react';
```

### Key Components

1. **Use AreaChart for Shaded Area**
   - Combine `AreaChart` with `Line` for the black line
   - Use `Area` component only for the negative region (below zero)
   - Or use two `Area` components: one for positive (transparent) and one for negative (shaded)

2. **Alternative Approach: LineChart with Custom Area**
   - Use `LineChart` with `Line` component for the curve
   - Add a custom `Area` component that fills from line to zero (when negative)
   - Use `defs` and `linearGradient` for shading effect

### Recommended Implementation

Use `AreaChart` with conditional shading:

```javascript
<AreaChart data={data}>
  {/* Grid and axes */}
  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
  <XAxis 
    dataKey="date" 
    stroke="#9CA3AF"
    tick={{ fontSize: 12 }}
    tickFormatter={(value) => formatDate(value)}
  />
  <YAxis 
    stroke="#9CA3AF"
    tick={{ fontSize: 12 }}
    tickFormatter={(value) => `$${value.toLocaleString()}`}
  />
  
  {/* Shaded area below zero */}
  <Area 
    type="monotone"
    dataKey="cumulative"
    stroke="none"
    fill="#6B7280"
    fillOpacity={0.2}
    // Only fill when value is negative
  />
  
  {/* Black line */}
  <Line 
    type="monotone"
    dataKey="cumulative"
    stroke="#000000"
    strokeWidth={1.5}
    dot={false}
  />
  
  {/* Tooltip */}
  <Tooltip 
    contentStyle={{ 
      backgroundColor: '#1F2937', 
      border: '1px solid #374151',
      borderRadius: '8px',
      color: '#F3F4F6'
    }}
    formatter={(value) => [`$${value.toLocaleString()}`, 'Profit']}
    labelFormatter={(label) => formatDateForTooltip(label)}
  />
</AreaChart>
```

### Data Transformation

Update `generateCumulativeProfitData` in `calculations.js`:

```javascript
export const generateCumulativeProfitData = (trades) => {
  // Sort trades by exit_date chronologically
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.exit_date) - new Date(b.exit_date)
  );
  
  let cumulative = 0;
  const data = [];
  
  sortedTrades.forEach((trade) => {
    cumulative += trade.profit;
    data.push({
      date: trade.exit_date,
      cumulative: cumulative,
      profit: trade.profit
    });
  });
  
  return data;
};
```

### Date Formatting

Create date formatting utility:

```javascript
// Format date for X-axis labels
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Format date for tooltips (can be different format)
export const formatDateForTooltip = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `Date: ${day}/${month}/${year}`;
};
```

### Handling Shaded Area

The shaded area should only appear below the zero line. Recharts doesn't directly support conditional area filling, so options:

1. **Option 1: Two Area Components**
   - Create two datasets: one for positive values (transparent), one for negative (shaded)
   - Overlay them

2. **Option 2: Reference Line + Custom Area**
   - Use `ReferenceLine` at y=0
   - Create area that fills from line to reference line when negative

3. **Option 3: Background Area** (Simplest)
   - Create a background area that always fills to zero
   - Use conditional opacity or color based on value sign

Recommended: Use Option 2 or modify data to include reference points.

## Implementation Steps

1. **Update calculations.js**
   - Modify `generateCumulativeProfitData` to sort by date
   - Add date formatting utilities

2. **Create new chart component**
   - Create `CumulativeNetProfitChart.jsx`
   - Implement AreaChart with Line and Area components
   - Add proper date formatting

3. **Implement shaded area**
   - Add Area component for negative region
   - Style appropriately

4. **Style and format**
   - Apply black line styling
   - Format axes properly
   - Style tooltip

5. **Test and refine**
   - Test with various date ranges
   - Verify shading appears correctly
   - Check date formatting

6. **Integration**
   - Update `App.jsx` to use new component
   - Ensure data flows correctly

## Files to Create/Modify

1. **New Files**
   - `app/src/components/charts/CumulativeNetProfitChart.jsx` - New chart component

2. **Files to Modify**
   - `app/src/utils/calculations.js` - Update `generateCumulativeProfitData` and add date formatting
   - `app/src/App.jsx` - Replace CumulativeProfitChart with CumulativeNetProfitChart

3. **Files to Reference**
   - `app/src/components/charts/CumulativeProfitChart.jsx` - Current implementation
   - Other chart components for styling patterns

## Acceptance Criteria

- ✅ Chart displays cumulative net profit over time (not trade numbers)
- ✅ X-axis shows formatted dates (DD/MM/YYYY format)
- ✅ Y-axis shows dollar values with proper formatting
- ✅ Line is thin and black, matching screenshot
- ✅ Shaded area appears below the $0 line highlighting negative periods
- ✅ Interactive tooltips show date and profit values on hover
- ✅ Tooltip formats dates and currency correctly
- ✅ Chart is large and takes up left column of dashboard
- ✅ Chart maintains app's color scheme and styling
- ✅ Chart handles empty data gracefully
- ✅ Chart is responsive and works on all screen sizes
- ✅ Dates are sorted chronologically and displayed correctly

## Edge Cases

1. **No trades**: Display empty chart with axes
2. **All positive profits**: Shaded area should not appear
3. **All negative profits**: Entire area below zero should be shaded
4. **Multiple trades same date**: Aggregate or show latest cumulative value
5. **Large date ranges**: X-axis labels should space appropriately
6. **Very large profit values**: Y-axis should format with commas
7. **Time gaps**: Chart should handle gaps in trading activity

## Notes

- The screenshot shows dates in DD/MM/YYYY format. Adjust formatting based on locale preferences or user settings if needed.
- The shaded area is a key visual element that helps users quickly identify loss periods - ensure it's visible but not overwhelming.
- Consider adding animation/transition when data updates for better UX.
- The chart should maintain performance with large datasets (1000+ trades).

