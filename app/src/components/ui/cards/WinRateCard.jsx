import React, { useMemo } from 'react';
import { Info } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const WIN_COLOR = '#10B981';
const LOSS_COLOR = '#111827';
const EMPTY_COLOR = '#1f2937';

const clampPercentage = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }

  if (value < 0) {
    return 0;
  }

  if (value > 100) {
    return 100;
  }

  return value;
};

const WinRateCard = ({
  winRate = 0,
  winningTrades = 0,
  losingTrades = 0,
  totalTrades,
}) => {
  const validWinRate = clampPercentage(winRate);
  const lossRate = 100 - validWinRate;

  const wins = Number.isFinite(winningTrades) && winningTrades > 0 ? Math.round(winningTrades) : 0;
  const losses = Number.isFinite(losingTrades) && losingTrades > 0 ? Math.round(losingTrades) : 0;
  const total = Number.isFinite(totalTrades) ? totalTrades : wins + losses;

  const chartData = useMemo(() => {
    const baseData = [
      { name: 'Wins', value: validWinRate, color: WIN_COLOR },
      { name: 'Losses', value: lossRate, color: LOSS_COLOR },
    ];

    if (validWinRate === 0 && lossRate === 0) {
      return [
        { name: 'Wins', value: 0, color: WIN_COLOR },
        { name: 'Losses', value: 100, color: LOSS_COLOR },
      ];
    }

    return baseData;
  }, [lossRate, validWinRate]);

  const hasTrades = (Number.isFinite(total) ? total : 0) > 0;

  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Win Rate</h3>
        <Info className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      </div>

      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{validWinRate.toFixed(2)}%</p>

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
              stroke="#FFFFFF"
              strokeWidth={2}
              strokeOpacity={0.25}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`win-rate-segment-${entry.name}-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={1} strokeOpacity={0.25} />
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

export default WinRateCard;
