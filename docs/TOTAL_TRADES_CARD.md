# Total Trades Card Implementation

## Problem Statement

The dashboard screenshot shows an enhanced "Total Trades" metric card that displays the total number of trades with a visual circular progress-like indicator showing the breakdown of wins versus losses. Unlike the current simple metrics card, this enhanced card uses a segmented circular indicator to visually represent the ratio of winning trades to losing trades, making it easy to see at a glance the distribution between wins and losses.

## Current Implementation

The existing `MetricsCards` component displays a simple "Total Trades" value without any visual breakdown. The enhanced card needs to show:
- Total trades count as the main value
- Circular indicator with two segments (green for wins, black for losses)
- Numerical labels on each segment showing the count

## Requirements

### Functional Requirements

1. **Main Value Display**
   - Display total number of trades as the primary large value
   - Format: Plain number (e.g., "373")
   - Should be prominently displayed

2. **Circular Progress Indicator**
   - Display a circular progress-like indicator showing two segments:
     - **Left segment (green)**: Represents winning trades
     - **Right segment (black/dark)**: Represents losing trades
   - Segments should visually represent the exact ratio of wins to losses
   - The circular indicator should be a full circle (not a donut)
   - Both segments should be clearly labeled with their respective numbers
   - The total of the two segments should equal the total trades value

3. **Data Requirements**
   - Requires `totalTrades`: Total number of trades
   - Requires `winningTrades`: Number of winning trades
   - Requires `losingTrades`: Number of losing trades
   - Validation: `winningTrades + losingTrades === totalTrades` (or close, accounting for breakeven trades)

### Design Requirements

1. **Color Scheme**
   - Winning trades segment: Green (`#10B981` or `emerald-400`)
   - Losing trades segment: Black (`#000000`) or dark gray (`gray-900`)
   - Background: `bg-gray-800/50` with `backdrop-blur` and `border-gray-700`
   - Text: `text-gray-200` for title, white for values

2. **Layout**
   - Card should be rounded (`rounded-xl`)
   - Consistent padding (`p-6`)
   - Maintain hover effects (`hover:bg-gray-800/70`)
   - Circular indicator should be visually balanced with the text value

3. **Typography**
   - Title: "Total Trades" with info icon (`text-gray-400 text-sm font-medium`)
   - Main value: `text-2xl font-bold`
   - Segment labels: Smaller font, clearly visible on colored segments

### Technical Requirements

1. **Component Props**
   - Component should accept:
     - `totalTrades`: Number
     - `winningTrades`: Number
     - `losingTrades`: Number

2. **Chart Library**
   - Use Recharts `PieChart` with `Pie` component
   - Use `Cell` components for individual segments

3. **Circular Indicator Implementation**
   - Use `PieChart` with `Pie` component
   - Set `innerRadius={0}` for full circle (no donut hole)
   - Use `startAngle={-90}` and `endAngle={270}` to start from top
   - Calculate segment angles based on ratio:
     - If totalTrades > 0:
       - Winning segment angle: `(winningTrades / totalTrades) * 360`
       - Losing segment angle: `(losingTrades / totalTrades) * 360`
     - The segments should split the circle proportionally

## Implementation Approach

### Component Structure

```javascript
// app/src/components/ui/cards/TotalTradesCard.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LabelList } from 'recharts';
import { Info } from 'lucide-react';

const TotalTradesCard = ({ totalTrades, winningTrades, losingTrades }) => {
  // Prepare data for pie chart
  const data = [
    { name: 'Wins', value: winningTrades, color: '#10B981' },
    { name: 'Losses', value: losingTrades, color: '#000000' }
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-gray-400 text-sm font-medium">Total Trades</h3>
        <Info className="h-4 w-4 text-gray-400" />
      </div>
      <p className="text-2xl font-bold text-white mb-4">{totalTrades}</p>
      
      <ResponsiveContainer width="100%" height={80}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={-90}
            endAngle={270}
            innerRadius={0}
            outerRadius={35}
            dataKey="value"
            label={({ value }) => value}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      <div className="flex justify-center gap-4 mt-2 text-xs">
        <span className="text-[#10B981]">{winningTrades}</span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900">{losingTrades}</span>
      </div>
    </div>
  );
};
```

### Alternative Label Approach

If labels inside the segments are difficult to read, use external labels:

```javascript
<div className="flex items-center justify-around mt-2">
  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
    <span className="text-xs text-gray-400">{winningTrades}</span>
  </div>
  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full bg-gray-900"></div>
    <span className="text-xs text-gray-400">{losingTrades}</span>
  </div>
</div>
```

## Implementation Steps

1. **Create component file**
   - Create `app/src/components/ui/cards/TotalTradesCard.jsx`
   - Import necessary dependencies (React, Recharts, Lucide)

2. **Implement circular indicator**
   - Set up PieChart with proper configuration
   - Calculate segment angles based on ratios
   - Apply colors correctly

3. **Add labels**
   - Add segment value labels
   - Ensure labels are readable (white text on colored backgrounds or external labels)

4. **Styling**
   - Apply card styling to match app design
   - Ensure responsive behavior
   - Test visual balance

5. **Integration**
   - Import into main DashboardMetricsCards component
   - Pass correct props from metrics

## Files to Create/Modify

1. **New Files**
   - `app/src/components/ui/cards/TotalTradesCard.jsx` - Card component

2. **Files to Modify**
   - `app/src/components/ui/DashboardMetricsCards.jsx` - Import and use TotalTradesCard

## Acceptance Criteria

- ✅ Card displays total trades count prominently
- ✅ Circular indicator shows two segments (green for wins, black for losses)
- ✅ Segments accurately represent the ratio of wins to losses
- ✅ Both segments are labeled with their respective counts
- ✅ The sum of wins and losses equals total trades
- ✅ Card uses app's color scheme (green for wins, black for losses)
- ✅ Card handles edge cases (0 trades, all wins, all losses)
- ✅ Card is responsive and maintains proper styling
- ✅ Circular indicator is visually balanced with the text value

## Edge Cases

1. **No trades (totalTrades = 0)**
   - Display "0" as total
   - Show empty or single-colored circle (or hide indicator)
   - Handle gracefully without errors

2. **All wins (losingTrades = 0)**
   - Circular indicator should be all green
   - Winning label should show total, losing label should show 0

3. **All losses (winningTrades = 0)**
   - Circular indicator should be all black
   - Losing label should show total, winning label should show 0

4. **Breakeven trades**
   - If trades can be breakeven (profit = 0), decide how to categorize
   - May need to add third category or include in one of the segments

5. **Very large numbers**
   - Ensure formatting handles large trade counts (commas if needed)

6. **Inconsistent data**
   - If `winningTrades + losingTrades !== totalTrades`, handle gracefully
   - Use totalTrades as source of truth or show warning

## Notes

- The circular indicator should be proportional to the actual ratios. If winningTrades is 151 and losingTrades is 222, the green segment should represent approximately 40.5% of the circle and the black segment should represent approximately 59.5%.
- Consider adding hover effects on the segments to show more details
- Labels inside colored segments may be difficult to read - consider placing them outside or using contrasting colors
- The screenshot shows the segments split visually with labels, so prioritize readability over strict adherence to inside-segment labels if needed

