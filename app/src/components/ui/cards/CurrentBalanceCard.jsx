import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Info } from 'lucide-react';

const CurrentBalanceCard = ({ currentBalance = 0, trendData = [] }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const chartData = trendData.slice(-10).map((point, index) => ({
    index,
    value: point.balance ?? point.value ?? 0
  }));

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-gray-400 text-sm font-medium">Current Balance</h3>
        <Info className="h-4 w-4 text-gray-400" />
      </div>

      <p className="text-2xl font-bold text-white mb-4">
        {formatCurrency(currentBalance)}
      </p>

      {chartData.length > 0 && (
        <div className="mt-4 h-[40px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CurrentBalanceCard;
