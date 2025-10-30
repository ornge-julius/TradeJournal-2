import React, { useMemo } from 'react';
import { Info } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
      { name: 'Wins', value: validWinRate, color: '#10B981' },
      { name: 'Losses', value: lossRate, color: '#EF4444' },
    ];

    if (validWinRate === 0 && lossRate === 0) {
      return [
        { name: 'Wins', value: 0, color: '#10B981' },
        { name: 'Losses', value: 100, color: '#EF4444' },
      ];
    }

    return baseData;
  }, [lossRate, validWinRate]);

  const hasTrades = (Number.isFinite(total) ? total : 0) > 0;

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-4 hover:bg-gray-800/70 transition-all">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-gray-400 text-sm font-medium">Win Rate</h3>
        <Info className="h-4 w-4 text-gray-400" />
      </div>

      <div className="flex items-center gap-6">
        <div className="h-24 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                startAngle={-90}
                endAngle={270}
                innerRadius={0}
                outerRadius={31}
                dataKey="value"
                stroke="#FFFFFF"
                strokeWidth={2}
                strokeOpacity={.25}
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={1000}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`win-rate-segment-${entry.name}-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1">
          <p className="text-3xl font-bold text-white">
            {validWinRate.toFixed(2)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {hasTrades ? (
              <>
                {wins}W / {losses}L
                {Number.isFinite(total) && total > 0 && ` · ${total} trades`}
              </>
            ) : (
              'No trades yet'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WinRateCard;
