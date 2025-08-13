// Calculate P&L for a trade
export const calculatePnL = (entryPrice, exitPrice, quantity, type) => {
  const pnl = (exitPrice - entryPrice) * quantity;
  return type === 'PUT' ? -pnl : pnl;
};

// Calculate trade metrics
export const calculateMetrics = (trades, startingBalance) => {
  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.pnl > 0).length;
  const losingTrades = trades.filter(t => t.pnl < 0).length;
  const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  
  const avgWin = winningTrades > 0 
    ? trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0) / winningTrades 
    : 0;
  
  const avgLoss = losingTrades > 0 
    ? Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0) / losingTrades) 
    : 0;
  
  return {
    totalTrades,
    winningTrades,
    losingTrades,
    totalPnL,
    winRate,
    avgWin,
    avgLoss,
    currentBalance: startingBalance + totalPnL
  };
};

// Generate chart data for cumulative P&L
export const generateCumulativePnLData = (trades) => {
  let cumulative = 0;
  return trades.map((trade, index) => {
    cumulative += trade.pnl;
    return {
      date: trade.exitDate,
      cumulative,
      trade: trade.pnl,
      tradeNum: index + 1
    };
  });
};

// Generate chart data for account balance
export const generateAccountBalanceData = (trades, startingBalance) => {
  let balance = startingBalance;
  const data = [{ date: 'Start', balance: startingBalance, tradeNum: 0 }];
  
  trades.forEach((trade, index) => {
    balance += trade.pnl;
    data.push({
      date: trade.exitDate,
      balance,
      tradeNum: index + 1
    });
  });
  
  return data;
};

// Generate win/loss data for pie chart
export const generateWinLossData = (winningTrades, losingTrades) => [
  { name: 'Winning Trades', value: winningTrades, color: '#10B981' },
  { name: 'Losing Trades', value: losingTrades, color: '#EF4444' }
];

// Calculate trade duration in days
export const calculateTradeDuration = (entryDate, exitDate) => {
  return Math.ceil((new Date(exitDate) - new Date(entryDate)) / (1000 * 60 * 60 * 24));
};

// Calculate return percentage
export const calculateReturnPercentage = (entryPrice, exitPrice) => {
  return ((exitPrice - entryPrice) / entryPrice) * 100;
};
