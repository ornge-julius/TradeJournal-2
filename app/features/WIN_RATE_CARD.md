# Win Rate Card Implementation

## Problem Statement

The dashboard screenshot shows an enhanced "Win Rate" metric card that displays the win rate percentage with a circular progress bar that visually represents the percentage. Unlike a simple text display, this enhanced card provides immediate visual feedback about trading performance through the circular progress indicator.

## Current Implementation

The existing `MetricsCards` component displays win rate as a simple percentage text. The enhanced card needs to show:
- Win rate percentage with 2 decimal places (e.g., "40.48%")
- Circular progress bar where the green segment represents wins and the black/dark segment represents losses
- The circular indicator should match the percentage value exactly

## Requirements

### Functional Requirements

1. **Main Value Display**
   - Display win rate as a percentage with 2 decimal places
   - Format: "XX.XX%" (e.g., "40.48%")
   - Should be prominently displayed

2. **Circular Progress Bar**
   - Display a circular progress indicator showing:
     - **Green segment**: Represents the win rate percentage (e.g., 40.48% of the circle)
     - **Black/dark segment**: Represents the loss rate (remaining portion)
   - The green segment should start from the top and proceed clockwise
   - The circular indicator should accurately match the percentage value
   - Should be a full circle (not a donut)

3. **Data Requirements**
   - Requires `winRate`: Number (percentage, 0-100)
   - Can be calculated from: `(winningTrades / totalTrades) * 100`
   - Should handle edge cases (0 trades, 100% win rate, 0% win rate)

### Design Requirements

1. **Color Scheme**
   - Winning segment: Green (`#10B981` or `emerald-400`)
   - Losing segment: Black (`#000000`) or dark gray (`gray-900`)
   - Background: `bg-gray-800/50` with `backdrop-blur` and `border-gray-700`
   - Text: `text-gray-200` for title, white for values

2. **Layout**
   - Card should be rounded (`rounded-xl`)
   - Consistent padding (`p-6`)
   - Maintain hover effects (`hover:bg-gray-800/70`)
   - Circular indicator should be visually balanced with the text value

3. **Typography**
   - Title: "Win Rate" with info icon (`text-gray-400 text-sm font-medium`)
   - Main value: `text-2xl font-bold`

### Technical Requirements

1. **Component Props**
   - Component should accept:
     - `winRate`: Number (percentage, 0-100)

2. **Chart Library**
   - Use Recharts `PieChart` with `Pie` component
   - Use `Cell` components for individual segments

3. **Circular Progress Implementation**
   - Use `PieChart` with `Pie` component
   - Set `innerRadius={0}` for full circle (no donut hole)
   - Use `startAngle={-90}` to start from top
   - Calculate segment:
     - Win segment: `(winRate / 100) * 360` degrees
     - Loss segment: `((100 - winRate) / 100) * 360` degrees
   - Green segment should be the win rate portion
   - Black segment should fill the remainder

## Implementation Approach

### Component Structure

```javascript
// app/src/components/ui/cards/WinRateCard.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Info } from 'lucide-react';

const WinRateCard = ({ winRate }) => {
  // Ensure winRate is valid
  const validWinRate = isNaN(winRate) ? 0 : Math.max(0, Math.min(100, winRate));
  const lossRate = 100 - validWinRate;

  // Prepare data for pie chart
  // The first segment is the win rate (green), the second is loss rate (black)
  const data = [
    { name: 'Wins', value: validWinRate, color: '#10B981' },
    { name: 'Losses', value: lossRate, color: '#000000' }
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-gray-400 text-sm font-medium">Win Rate</h3>
        <Info className="h-4 w-4 text-gray-400" />
      </div>
      <p className="text-2xl font-bold text-white mb-4">
        {validWinRate.toFixed(2)}%
      </p>
      
      <ResponsiveContainer width="100%" height={80}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={-90}  // Start from top
            endAngle={270}    // Complete circle
            innerRadius={0}   // Full circle, not donut
            outerRadius={35}
            dataKey="value"
            animationBegin={0}
            animationDuration={500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WinRateCard;
```

### Alternative with Custom Label

To show percentage inside the circle:

```javascript
// Add label prop to Pie
<Pie
  // ... other props
  label={({ value }) => `${value.toFixed(1)}%`}
  labelLine={false}
>
```

However, based on the screenshot, no label appears inside the circle, just the progress indicator.

## Implementation Steps

1. **Create component file**
   - Create `app/src/components/ui/cards/WinRateCard.jsx`
   - Import necessary dependencies (React, Recharts, Lucide)

2. **Implement circular progress**
   - Set up PieChart with proper configuration
   - Calculate segments based on winRate percentage
   - Green segment from top, clockwise for win rate
   - Black segment for remaining portion

3. **Add percentage display**
   - Format win rate to 2 decimal places
   - Display prominently

4. **Styling**
   - Apply card styling to match app design
   - Ensure responsive behavior
   - Test visual balance

5. **Integration**
   - Import into main DashboardMetricsCards component
   - Pass winRate from metrics

## Files to Create/Modify

1. **New Files**
   - `app/src/components/ui/cards/WinRateCard.jsx` - Card component

2. **Files to Modify**
   - `app/src/components/ui/DashboardMetricsCards.jsx` - Import and use WinRateCard

## Acceptance Criteria

- ✅ Card displays win rate percentage with 2 decimal places (e.g., "40.48%")
- ✅ Circular progress bar accurately represents the win rate percentage
- ✅ Green segment represents wins, black segment represents losses
- ✅ Progress bar starts from top and proceeds clockwise
- ✅ Card uses app's color scheme (green for wins, black for losses)
- ✅ Card handles edge cases (0%, 100%, invalid values)
- ✅ Card is responsive and maintains proper styling
- ✅ The circular indicator matches the percentage value exactly (e.g., 40.48% = ~40.48% of circle in green)

## Edge Cases

1. **0% win rate (all losses)**
   - Display "0.00%"
   - Circular indicator should be all black
   - No green segment should appear

2. **100% win rate (all wins)**
   - Display "100.00%"
   - Circular indicator should be all green
   - No black segment should appear

3. **Invalid or NaN winRate**
   - Default to 0%
   - Display "0.00%" or "N/A"
   - Show empty or default indicator

4. **WinRate > 100 or < 0**
   - Clamp to valid range (0-100)
   - Ensure circular indicator doesn't break

5. **Very small winRate (e.g., 0.01%)**
   - Should still display correctly
   - Green segment may be very small but should be visible or show as 0%

6. **Very precise decimals**
   - Round to 2 decimal places for display
   - Use full precision for calculation

## Notes

- The circular indicator should be mathematically accurate. For example, a 40.48% win rate means approximately 145.73 degrees (40.48 / 100 * 360) should be green, and the remaining 214.27 degrees should be black.
- The progress bar typically animates from the top (12 o'clock position) going clockwise
- Consider adding a subtle animation when the value updates
- The screenshot shows the circular progress as a visual indicator, not a detailed chart, so keep it simple and clean

