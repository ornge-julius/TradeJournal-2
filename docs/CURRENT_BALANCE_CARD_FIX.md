# Current Balance Card Fix

## Problem Statement

The `CurrentBalanceCard` component is displaying an incorrect balance amount. Currently, it shows the balance calculated from trades filtered by the date range filter, but it should always display the **all-time total balance** regardless of the date filter applied. The chart within the card should show the account balance fluctuation over the **specified date filter period**.

## Current Behavior

### Issue
1. **Incorrect Balance Display**: The card displays `currentBalance` which is calculated from `filteredTrades` (trades filtered by the date range). This means:
   - When a user filters to "Last 30 Days", the balance shown is only the balance after trades in that 30-day period
   - When a user filters to "Last Month", the balance shown is only the balance after trades in that month
   - The balance should always reflect the **total all-time balance** regardless of date filter

2. **Chart Data**: The chart correctly shows balance trend data from the filtered period, which is the desired behavior.

### Current Implementation Flow

```
DashboardView.jsx
  ↓
  filterTradesByExitDate(trades, filter) → filteredTrades
  ↓
  calculateMetrics(filteredTrades, startingBalance) → metrics.currentBalance
  ↓
  generateAccountBalanceData(filteredTrades, startingBalance) → accountBalanceData
  ↓
  generateBalanceTrendData(accountBalanceData) → balanceTrendData
  ↓
  CurrentBalanceCard receives:
    - currentBalance: metrics.currentBalance (from filtered trades) ❌
    - trendData: balanceTrendData (from filtered trades) ✅
```

## Expected Behavior

### Requirements

1. **Balance Display (All-Time)**
   - The `currentBalance` prop passed to `CurrentBalanceCard` should always represent the **total all-time account balance**
   - This balance should be calculated from **all trades** (not filtered by date range)
   - Formula: `startingBalance + sum of all trade profits`
   - This value should remain constant regardless of the date filter applied

2. **Chart Display (Filtered Period)**
   - The `trendData` prop should show the account balance fluctuation **within the filtered date range**
   - The chart should display how the balance changed during the selected time period
   - This data should be calculated from trades filtered by the date range
   - The chart should show the progression of balance from the start of the filtered period to the end

## Technical Requirements

### Data Flow Changes

The implementation needs to separate the calculation of:
1. **All-time balance** (from all trades, not filtered)
2. **Filtered period balance trend** (from filtered trades, for chart display)

### Modified Flow

```
DashboardView.jsx
  ↓
  filterTradesByExitDate(trades, filter) → filteredTrades
  ↓
  ┌─────────────────────────────────────┐
  │                                     │
  │ All-Time Balance Calculation       │
  │ calculateMetrics(trades, startingBalance) → allTimeMetrics.currentBalance
  │                                     │
  │ Filtered Period Chart Data         │
  │ generateAccountBalanceData(filteredTrades, startingBalance) → accountBalanceData
  │ generateBalanceTrendData(accountBalanceData) → balanceTrendData
  │                                     │
  └─────────────────────────────────────┘
  ↓
  CurrentBalanceCard receives:
    - currentBalance: allTimeMetrics.currentBalance (from ALL trades) ✅
    - trendData: balanceTrendData (from filtered trades) ✅
```

### Implementation Details

1. **Calculate All-Time Balance**
   - Use `calculateMetrics(trades, startingBalance)` with **all trades** (not filtered)
   - Extract `currentBalance` from the all-time metrics
   - This value represents the true current account balance

2. **Calculate Filtered Period Balance Trend**
   - Continue using `filteredTrades` for chart data generation
   - Use `generateAccountBalanceData(filteredTrades, startingBalance)` to get balance progression within the filtered period
   - Use `generateBalanceTrendData(accountBalanceData)` to format data for the chart
   - **Important**: The balance trend should show the balance progression within the filtered date range, starting from the balance at the beginning of that period

3. **Chart Balance Calculation for Filtered Period**
   - When generating `accountBalanceData` for filtered trades, the starting balance should be the balance **at the start of the filtered period**
   - This requires calculating what the balance was at the beginning of the filtered date range
   - Formula for starting balance of filtered period: `startingBalance + sum of all trades that exited before the filter start date`

### Edge Cases to Handle

1. **No Trades in Filtered Period**
   - Chart should still display (may show a flat line or empty state)
   - Balance should still show all-time balance

2. **Filter Set to "All Time"**
   - Balance and chart should both show all-time data
   - This is the default case where filtered trades = all trades

3. **Filter Start Date Before Any Trades**
   - Starting balance for chart should be the account's `startingBalance`
   - Chart should show progression from starting balance

4. **Filter Start Date After Some Trades**
   - Starting balance for chart should be calculated as: `startingBalance + sum of profits from trades before filter start date`
   - Chart should show balance progression from that calculated starting point

## Files to Modify

1. **`app/src/components/views/DashboardView.jsx`**
   - Calculate all-time metrics separately from filtered metrics
   - Pass all-time `currentBalance` to `DashboardMetricsCards`
   - Keep filtered `balanceTrendData` calculation for chart

2. **`app/src/utils/calculations.js`** (if needed)
   - May need a helper function to calculate balance at a specific date
   - Function: `calculateBalanceAtDate(trades, startingBalance, targetDate)`
   - Returns the account balance at the start of the target date

## Component Props

### CurrentBalanceCard (No Changes Required)
The component itself doesn't need changes. It will receive:
- `currentBalance`: All-time balance (number)
- `trendData`: Balance trend data for filtered period (array of objects with `balance` property)

## Testing Scenarios

1. **All Time Filter**
   - Balance should equal: `startingBalance + sum(all trade profits)`
   - Chart should show full balance progression

2. **Last 30 Days Filter**
   - Balance should still show all-time balance
   - Chart should show balance changes only within last 30 days
   - Chart starting point should be balance at 30 days ago

3. **Custom Date Range**
   - Balance should show all-time balance
   - Chart should show balance progression within custom range
   - Chart starting point should be balance at the start of custom range

4. **No Trades in Filtered Period**
   - Balance should show all-time balance
   - Chart should handle empty/zero data gracefully

## Success Criteria

✅ The balance displayed in `CurrentBalanceCard` always shows the total all-time account balance  
✅ The balance value does not change when date filters are applied  
✅ The chart shows balance fluctuation within the selected date filter period  
✅ The chart starting point correctly reflects the balance at the beginning of the filtered period  
✅ Edge cases (no trades, all time, custom ranges) are handled correctly

