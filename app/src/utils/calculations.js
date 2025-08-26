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

// Generate chart data for cumulative profit
export const generateCumulativeProfitData = (trades) => {
  let cumulative = 0;
  return trades.map((trade, index) => {
    cumulative += trade.profit;
    return {
      date: trade.exitDate,
      cumulative,
      trade: trade.profit,
      tradeNum: index + 1
    };
  });
};

// Generate chart data for account balance
export const generateAccountBalanceData = (trades, startingBalance) => {
  let balance = startingBalance;
  const data = [{ date: 'Start', balance: startingBalance, tradeNum: 0 }];
  
  trades.forEach((trade, index) => {
    balance += trade.profit;
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
