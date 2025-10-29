# Avg W/L $ Card Implementation

## Problem Statement

The dashboard screenshot shows an enhanced "Avg W/L $" (Average Win/Loss Dollar) metric card that displays the average win/loss ratio along with a horizontal bar chart visualization showing the average win amount and average loss amount side by side. This provides both the ratio value and a visual comparison of average win versus average loss amounts.

## Current Implementation

The existing `MetricsCards` component displays "Avg Win/Loss" as a simple ratio. The enhanced card needs to show:
- Average win/loss ratio as the main value (e.g., "1.14")
- A horizontal bar chart with two segments:
  - Left segment (green): Average win amount labeled "$XX"
  - Right segment (black/dark): Average loss amount labeled "$XX"
- Values should be rounded to nearest dollar

## Requirements

### Functional Requirements

1. **Main Value Display**
   - Display average win/loss ratio as the primary large value
   - Format: Decimal number with 2 decimal places (e.g., "1.14")
   - Calculation: `avgWin / avgLoss` (if avgLoss > 0)
   - If avgLoss is 0, display "N/A" or handle edge case

2. **Horizontal Bar Chart**
   - Display two segments side by side:
     - **Left segment (green)**: Average win amount
     - **Right segment (black/dark)**: Average loss amount
   - Each segment should be labeled with its dollar amount
   - Values should be rounded to nearest dollar
   - Bar segments should be proportional to their values

3. **Data Requirements**
   - Requires `avgWin`: Number (average winning trade profit)
   - Requires `avgLoss`: Number (average losing trade loss, typically positive value representing absolute loss)
   - If using absolute loss values, ensure consistency in calculation
   - Validation: Handle division by zero

### Design Requirements

1. **Color Scheme**
   - Average win segment: Green (`#10B981` or `emerald-400`)
   - Average loss segment: Black (`#000000`) or dark gray (`gray-900`)
   - Background: `bg-gray-800/50` with `backdrop-blur` and `border-gray-700`
   - Text: `text-gray-200` for title, white for values

2. **Layout**
   - Card should be rounded (`rounded-xl`)
   - Consistent padding (`p-6`)
   - Maintain hover effects (`hover:bg-gray-800/70`)
   - Bar chart should be clearly visible below the ratio value

3. **Typography**
   - Title: "Avg W/L $" with info icon (`text-gray-400 text-sm font-medium`)
   - Main value: `text-2xl font-bold`
   - Bar labels: Smaller font, clearly visible on/above colored segments

### Technical Requirements

1. **Component Props**
   - Component should accept:
     - `avgWin`: Number
     - `avgLoss`: Number (absolute value of average loss)

2. **Chart Library**
   - Use Recharts `BarChart` with `Bar` component
   - Use horizontal orientation or configure appropriately
   - Use `Cell` components for conditional coloring

3. **Ratio Calculation**
   - Calculate: `avgWin / avgLoss` (if avgLoss > 0)
   - Display with 2 decimal places
   - Handle edge cases (division by zero)

4. **Bar Chart Data**
   - Prepare data array with win and loss values
   - Values should be rounded to nearest dollar
   - Bar should scale proportionally

## Implementation Approach

### Component Structure

```javascript
// app/src/components/ui/cards/AvgWLCard.jsx
import React from 'react';
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, LabelList } from 'recharts';
import { Info } from 'lucide-react';

const AvgWLCard = ({ avgWin, avgLoss }) => {
  // Calculate ratio
  const calculateRatio = () => {
    if (!avgLoss || avgLoss === 0) {
      return 'N/A';
    }
    return (avgWin / avgLoss).toFixed(2);
  };

  const ratio = calculateRatio();

  // Prepare bar chart data
  const roundedWin = Math.round(avgWin || 0);
  const roundedLoss = Math.round(avgLoss || 0);
  
  const barData = [
    { name: 'Win', value: roundedWin, label: `$${roundedWin}`, color: '#10B981' },
    { name: 'Loss', value: roundedLoss, label: `$${roundedLoss}`, color: '#000000' }
  ];

  // Find max value for scaling
  const maxValue = Math.max(roundedWin, roundedLoss) || 1;

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-gray-400 text-sm font-medium">Avg W/L $</h3>
        <Info className="h-4 w-4 text-gray-400" />
      </div>
      
      <p className="text-2xl font-bold text-white mb-4">{ratio}</p>
      
      <div className="flex items-center gap-2 mb-1">
        {/* Win Bar */}
        <div 
          className="bg-[#10B981] rounded px-2 py-1 flex-1 min-w-[60px]"
          style={{ width: `${(roundedWin / maxValue) * 100}%` }}
        >
          <span className="text-xs font-medium text-white">${roundedWin}</span>
        </div>
        
        {/* Loss Bar */}
        <div 
          className="bg-gray-900 rounded px-2 py-1 flex-1 min-w-[60px]"
          style={{ width: `${(roundedLoss / maxValue) * 100}%` }}
        >
          <span className="text-xs font-medium text-white">${roundedLoss}</span>
        </div>
      </div>
    </div>
  );
};

export default AvgWLCard;
```

### Alternative Using Recharts

```javascript
const AvgWLCard = ({ avgWin, avgLoss }) => {
  const calculateRatio = () => {
    if (!avgLoss || avgLoss === 0) return 'N/A';
    return (avgWin / avgLoss).toFixed(2);
  };

  const roundedWin = Math.round(avgWin || 0);
  const roundedLoss = Math.round(avgLoss || 0);
  
  const barData = [
    { name: 'Win', value: roundedWin, color: '#10B981' },
    { name: 'Loss', value: roundedLoss, color: '#000000' }
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-gray-400 text-sm font-medium">Avg W/L $</h3>
        <Info className="h-4 w-4 text-gray-400" />
      </div>
      
      <p className="text-2xl font-bold text-white mb-4">{calculateRatio()}</p>
      
      <ResponsiveContainer width="100%" height={50}>
        <BarChart 
          data={barData} 
          layout="horizontal"
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {barData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <LabelList 
              dataKey="value" 
              position="center" 
              formatter={(value) => `$${value}`}
              fill="#FFFFFF"
              fontSize={12}
            />
          </Bar>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" hide />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
```

### Simple CSS-Based Approach (Recommended for this use case)

```javascript
const AvgWLCard = ({ avgWin, avgLoss }) => {
  const calculateRatio = () => {
    if (!avgLoss || avgLoss === 0) return 'N/A';
    return (avgWin / avgLoss).toFixed(2);
  };

  const roundedWin = Math.round(avgWin || 0);
  const roundedLoss = Math.round(avgLoss || 0);
  
  // Normalize values for bar display (max bar width is 100%)
  const total = roundedWin + roundedLoss || 1;
  const winPercentage = (roundedWin / total) * 100;
  const lossPercentage = (roundedLoss / total) * 100;

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-gray-400 text-sm font-medium">Avg W/L $</h3>
        <Info className="h-4 w-4 text-gray-400" />
      </div>
      
      <p className="text-2xl font-bold text-white mb-4">{calculateRatio()}</p>
      
      <div className="flex items-stretch h-8 gap-1">
        {/* Win Bar */}
        {roundedWin > 0 && (
          <div 
            className="bg-[#10B981] rounded flex items-center justify-center min-w-[40px]"
            style={{ width: `${winPercentage}%` }}
          >
            <span className="text-xs font-medium text-white px-1">${roundedWin}</span>
          </div>
        )}
        
        {/* Loss Bar */}
        {roundedLoss > 0 && (
          <div 
            className="bg-gray-900 rounded flex items-center justify-center min-w-[40px]"
            style={{ width: `${lossPercentage}%` }}
          >
            <span className="text-xs font-medium text-white px-1">${roundedLoss}</span>
          </div>
        )}
      </div>
    </div>
  );
};
```

## Implementation Steps

1. **Create component file**
   - Create `app/src/components/ui/cards/AvgWLCard.jsx`
   - Import necessary dependencies (React, possibly Recharts, Lucide)

2. **Implement ratio calculation**
   - Calculate avgWin / avgLoss
   - Format to 2 decimal places
   - Handle division by zero

3. **Implement horizontal bar chart**
   - Create two segments (win and loss)
   - Apply colors (green for win, black for loss)
   - Add dollar amount labels
   - Make bars proportional

4. **Styling**
   - Apply card styling to match app design
   - Ensure responsive behavior
   - Keep labels readable

5. **Integration**
   - Import into main DashboardMetricsCards component
   - Pass avgWin and avgLoss from metrics

## Files to Create/Modify

1. **New Files**
   - `app/src/components/ui/cards/AvgWLCard.jsx` - Card component

2. **Files to Modify**
   - `app/src/components/ui/DashboardMetricsCards.jsx` - Import and use AvgWLCard

## Acceptance Criteria

- ✅ Card displays average win/loss ratio with 2 decimal places (e.g., "1.14")
- ✅ Horizontal bar chart shows two segments (green for win, black for loss)
- ✅ Each segment is labeled with its dollar amount (rounded to nearest dollar)
- ✅ Bar segments are proportional to their values
- ✅ Card handles edge cases (no wins, no losses, division by zero)
- ✅ Card uses app's color scheme (green for wins, black for losses)
- ✅ Card is responsive and maintains proper styling
- ✅ Labels are clearly visible and readable

## Edge Cases

1. **No losses (avgLoss = 0)**
   - Display "N/A" for ratio or handle appropriately
   - Only show win bar, or show both bars with loss = 0

2. **No wins (avgWin = 0)**
   - Display "0.00" for ratio
   - Only show loss bar, or show both bars with win = 0

3. **Both zero**
   - Display "N/A" for ratio
   - Show empty bars or minimal display

4. **Very different values**
   - Ensure bars scale appropriately
   - One bar may be very small - ensure minimum width for readability

5. **Large values**
   - Ensure formatting handles large dollar amounts
   - Bars should scale proportionally

6. **Negative average loss**
   - Use absolute value for display
   - Ensure calculation is correct (avgLoss should typically be positive in calculations.js)

## Notes

- The average loss is typically stored/calculated as an absolute value (positive number), so ensure consistency in how it's used.
- The bar chart segments should be proportional. If avgWin is $15 and avgLoss is $13, the win bar should be slightly larger than the loss bar.
- Consider using CSS-based bars instead of Recharts for simpler implementation and better control, unless you need Recharts for other charts.
- Labels should be centered and readable on both colored backgrounds. White text works well on both green and black.
- The screenshot shows the bars side by side with labels. Ensure both segments are always visible even if values are very different.

