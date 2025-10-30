import React from 'react';
import WinRateCard from './cards/WinRateCard';

const DashboardMetricsCards = ({ metrics }) => {
  if (!metrics) {
    return null;
  }

  const {
    winRate = 0,
    winningTrades = 0,
    losingTrades = 0,
    totalTrades = 0,
  } = metrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <WinRateCard
        winRate={winRate}
        winningTrades={winningTrades}
        losingTrades={losingTrades}
        totalTrades={totalTrades}
      />
    </div>
  );
};

export default DashboardMetricsCards;
