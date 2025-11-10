import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Info } from 'lucide-react';

const WIN_COLOR = '#10B981';
const LOSS_COLOR = '#111827';
const EMPTY_COLOR = '#1f2937';

const TotalTradesCard = ({ totalTrades = 0, winningTrades = 0, losingTrades = 0 }) => {
  const { displayTotal, wins, losses, hasBreakdown } = useMemo(() => {
    const safeTotal = Math.max(0, Number(totalTrades) || 0);
    let safeWins = Math.max(0, Number(winningTrades) || 0);
    let safeLosses = Math.max(0, Number(losingTrades) || 0);

    const providedBreakdownTotal = safeWins + safeLosses;

    if (safeTotal === 0 && providedBreakdownTotal === 0) {
      return { displayTotal: 0, wins: 0, losses: 0, hasBreakdown: false };
    }

    if (safeTotal === 0 && providedBreakdownTotal > 0) {
      return {
        displayTotal: providedBreakdownTotal,
        wins: safeWins,
        losses: safeLosses,
        hasBreakdown: true
      };
    }

    if (providedBreakdownTotal === safeTotal) {
      return {
        displayTotal: safeTotal,
        wins: safeWins,
        losses: safeLosses,
        hasBreakdown: safeTotal > 0
      };
    }

    if (providedBreakdownTotal === 0 && safeTotal > 0) {
      // No breakdown provided, fallback to treating all trades as losses to visualize total
      return {
        displayTotal: safeTotal,
        wins: 0,
        losses: safeTotal,
        hasBreakdown: false
      };
    }

    // Normalize the breakdown so the sum matches the total
    const ratio = safeTotal / providedBreakdownTotal;
    safeWins = Math.round(safeWins * ratio);
    safeLosses = Math.max(0, safeTotal - safeWins);

    return {
      displayTotal: safeTotal,
      wins: safeWins,
      losses: safeLosses,
      hasBreakdown: true
    };
  }, [totalTrades, winningTrades, losingTrades]);

  const chartData = hasBreakdown
    ? [
        { name: 'Wins', value: wins, color: WIN_COLOR },
        { name: 'Losses', value: losses, color: LOSS_COLOR }
      ]
    : [
        { name: 'Total Trades', value: 1, color: EMPTY_COLOR }
      ];

  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Trades</h3>
        <Info className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      </div>

      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{displayTotal.toLocaleString()}</p>

      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              startAngle={-90}
              endAngle={270}
              innerRadius={0}
              outerRadius={56}
              dataKey="value"
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${entry.name}-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={1} strokeOpacity={0.25} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-around text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: WIN_COLOR }} />
          <span className="font-medium text-gray-900 dark:text-white">{wins.toLocaleString()}</span>
          <span className="text-gray-600 dark:text-gray-500">Wins</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: LOSS_COLOR }} />
          <span className="font-medium text-gray-900 dark:text-white">{losses.toLocaleString()}</span>
          <span className="text-gray-600 dark:text-gray-500">Losses</span>
        </div>
      </div>
    </div>
  );
};

export default TotalTradesCard;
