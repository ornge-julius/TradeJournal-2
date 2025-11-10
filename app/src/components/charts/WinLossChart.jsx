import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const WinLossChart = ({ data, winningTrades, losingTrades }) => {
  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-200">Win/Loss Ratio</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={-90}
            endAngle={270}
            innerRadius={0}
            outerRadius={100}
            dataKey="value"
            stroke="#FFFFFF"
            strokeWidth={2}
            strokeOpacity={0.25}
            labelLine={false}

          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={1} strokeOpacity={0.25} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: '#10B981' }} />
          <span className="text-sm text-gray-700 dark:text-gray-400">Wins ({winningTrades})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: '#111827' }} />
          <span className="text-sm text-gray-700 dark:text-gray-400">Losses ({losingTrades})</span>
        </div>
      </div>
    </div>
  );
};

export default WinLossChart;
