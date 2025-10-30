import React from 'react';
import WinRateCard from './cards/WinRateCard';
import TotalTradesCard from './cards/TotalTradesCard';
import CurrentBalanceCard from './cards/CurrentBalanceCard';
import AvgWLCard from './cards/AvgWLCard';

const DashboardMetricsCards = ({ metrics, currentBalance, balanceTrendData }) => {
  if (!metrics) {
    return null;
  }

  const {
    winRate = 0,
    winningTrades = 0,
    losingTrades = 0,
    totalTrades = 0,
    avgWin = 0,
    avgLoss = 0,
  } = metrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 items-stretch">
      <WinRateCard
        winRate={winRate}
        winningTrades={winningTrades}
        losingTrades={losingTrades}
        totalTrades={totalTrades}
      />

      <TotalTradesCard
        totalTrades={totalTrades}
        winningTrades={winningTrades}
        losingTrades={losingTrades}
      />

      <CurrentBalanceCard
        currentBalance={currentBalance}
        trendData={balanceTrendData}
      />

      <AvgWLCard
        avgWin={avgWin}
        avgLoss={avgLoss}
      />
    </div>
  );
};

export default DashboardMetricsCards;
