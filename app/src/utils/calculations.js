// Calculate profit for a trade
export const calculateProfit = (entryPrice, exitPrice, quantity, type) => {
  const profit = (exitPrice * 100 - entryPrice * 100) * quantity;
  return profit
};

// Calculate trade metrics
export const calculateMetrics = (trades, startingBalance) => {
  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.profit > 0).length;
  const losingTrades = trades.filter(t => t.profit < 0).length;
  const totalProfit = trades.reduce((sum, trade) => sum + trade.profit, 0);
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  
  const avgWin = winningTrades > 0 
    ? trades.filter(t => t.profit > 0).reduce((sum, t) => sum + t.profit, 0) / winningTrades 
    : 0;
  
  const avgLoss = losingTrades > 0 
    ? Math.abs(trades.filter(t => t.profit < 0).reduce((sum, t) => sum + t.profit, 0) / losingTrades) 
    : 0;
  
  return {
    totalTrades,
    winningTrades,
    losingTrades,
    totalProfit,
    winRate,
    avgWin,
    avgLoss,
    currentBalance: startingBalance + totalProfit
  };
};

// Format date for X-axis labels (DD/MM/YYYY)
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original if invalid date
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Format date for tooltips
export const formatDateForTooltip = (dateString) => {
  if (!dateString) return 'Date: N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return `Date: ${dateString}`;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `Date: ${day}/${month}/${year}`;
};

// Generate chart data for cumulative profit (sorted by date)
export const generateCumulativeProfitData = (trades) => {
  if (!trades || trades.length === 0) {
    return [];
  }

  const tradesWithEntryDate = trades.filter((trade) => trade && trade.entry_date && !Number.isNaN(new Date(trade.entry_date).getTime()));

  if (tradesWithEntryDate.length === 0) {
    return [];
  }

  const sortedTrades = [...tradesWithEntryDate].sort((a, b) => {
    const dateA = new Date(a.entry_date);
    const dateB = new Date(b.entry_date);
    return dateA - dateB;
  });

  let cumulative = 0;
  const data = [];

  sortedTrades.forEach((trade) => {
    cumulative += trade.profit || 0;
    data.push({
      date: trade.entry_date,
      cumulative: cumulative,
      profit: trade.profit
    });
  });

  return data;
};

// Generate chart data for account balance
export const generateAccountBalanceData = (trades, startingBalance) => {
  const tradesWithEntryDate = trades.filter((trade) => trade && trade.entry_date && !Number.isNaN(new Date(trade.entry_date).getTime()));

  if (tradesWithEntryDate.length === 0) {
    return [{ date: 'Start', balance: startingBalance, tradeNum: 0 }];
  }

  const sortedTrades = [...tradesWithEntryDate].sort((a, b) => {
    const dateA = new Date(a.entry_date);
    const dateB = new Date(b.entry_date);
    return dateA - dateB;
  });

  let balance = startingBalance;
  const data = [{ date: 'Start', balance: startingBalance, tradeNum: 0 }];

  sortedTrades.forEach((trade, index) => {
    const profit = trade.profit || 0;
    balance += profit;
    data.push({
      date: trade.entry_date,
      balance,
      tradeNum: index + 1
    });
  });

  return data;
};

// Generate last 30 days net P&L data
export const generateLast30DaysNetPNLData = (trades) => {
  if (!trades || trades.length === 0) {
    return [];
  }

  const exitDates = trades
    .map((trade) => (trade.exit_date ? new Date(trade.exit_date) : null))
    .filter((date) => date && !isNaN(date.getTime()));

  if (exitDates.length === 0) {
    return [];
  }

  const mostRecentDate = new Date(Math.max(...exitDates.map((date) => date.getTime())));

  const startDate = new Date(mostRecentDate);
  startDate.setDate(startDate.getDate() - 30);

  const dailyData = {};

  for (let cursor = new Date(startDate); cursor <= mostRecentDate; cursor.setDate(cursor.getDate() + 1)) {
    const dateKey = cursor.toISOString().split('T')[0];
    dailyData[dateKey] = {
      date: dateKey,
      dateLabel: dateKey,
      netPNL: 0,
      isPositive: true
    };
  }

  trades.forEach((trade) => {
    if (!trade.exit_date) {
      return;
    }

    const exitDate = new Date(trade.exit_date);
    if (isNaN(exitDate.getTime())) {
      return;
    }

    const dateKey = exitDate.toISOString().split('T')[0];

    if (exitDate >= startDate && exitDate <= mostRecentDate && dailyData[dateKey]) {
      dailyData[dateKey].netPNL += trade.profit || 0;
    }
  });

  return Object.values(dailyData)
    .map((item) => ({
      ...item,
      isPositive: item.netPNL >= 0
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Generate trimmed balance trend data for mini charts
export const generateBalanceTrendData = (accountBalanceData, pointCount = 10) => {
  if (!accountBalanceData || accountBalanceData.length === 0) {
    return [];
  }

  const lastPoints = accountBalanceData.slice(-pointCount);

  return lastPoints.map((point) => ({
    balance: point.balance ?? point.value ?? 0
  }));
};

// Generate win/loss data for pie chart
export const generateWinLossData = (winningTrades, losingTrades) => [
  { name: 'Winning Trades', value: winningTrades, color: '#10B981' },
  { name: 'Losing Trades', value: losingTrades, color: '#EF4444' }
];

// Calculate trade duration in days
export const calculateTradeDuration = (entry_date, exit_date) => {
  return Math.ceil((new Date(exit_date) - new Date(entry_date)) / (1000 * 60 * 60 * 24));
};

// Calculate return percentage
export const calculateReturnPercentage = (entryPrice, exitPrice) => {
  return ((exitPrice - entryPrice) / entryPrice) * 100;
};

// Convert numeric result to text
export const getResultText = (result) => {
  if (result === 1) return 'WIN';
  if (result === 0) return 'LOSS';
  return '';
};

// Convert text result to numeric
export const getResultNumber = (resultText) => {
  if (resultText === 'WIN') return 1;
  if (resultText === 'LOSS') return 0;
  return undefined;
};

// Check if trade is a win based on numeric result
export const isWin = (result) => result === 1;

// Check if trade is a loss based on numeric result
export const isLoss = (result) => result === 0;

// Convert numeric trade type to text
export const getTradeTypeText = (type) => {
  if (type === 1) return 'CALL';
  if (type === 2) return 'PUT';
  return '';
};

// Convert text trade type to numeric
export const getTradeTypeNumber = (typeText) => {
  if (typeText === 'CALL') return 1;
  if (typeText === 'PUT') return 2;
  return undefined;
};

// Check if trade type is CALL
export const isCall = (type) => type === 1;

// Check if trade type is PUT
export const isPut = (type) => type === 2;

// Generate monthly net P&L data
export const generateMonthlyNetPNLData = (trades) => {
  if (!trades || trades.length === 0) {
    return [];
  }

  const monthlyData = {};

  trades.forEach((trade) => {
    const entryDate = trade.entry_date ? new Date(trade.entry_date) : null;
    if (!entryDate || isNaN(entryDate.getTime())) {
      return;
    }

    const year = entryDate.getFullYear();
    const month = entryDate.getMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

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

  const dataArray = Object.values(monthlyData).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
