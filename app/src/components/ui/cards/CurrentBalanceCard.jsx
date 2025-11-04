import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { Info } from 'lucide-react';

const CurrentBalanceCard = ({ currentBalance = 0, trendData = [] }) => {
  const [hoverBalance, setHoverBalance] = React.useState(null);
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
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-all h-full flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Current Balance</h3>
        <Info className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      </div>

      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {formatCurrency(hoverBalance ?? currentBalance)}
      </p>

      {chartData.length > 0 && (
        <div className="mt-4 h-[40px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData} 
              margin={{ top: 4, right: 8, bottom: 4, left: 8 }}
              onMouseMove={(state) => {
                if (state && state.activePayload && state.activePayload.length > 0) {
                  const value = state.activePayload[0].payload?.value;
                  if (typeof value === 'number') {
                    setHoverBalance(value);
                  }
                }
              }}
              onMouseLeave={() => setHoverBalance(null)}
            >
              {/** Hidden axis with slight padding to avoid clipping at extremes */}
              <YAxis 
                hide 
                domain={[
                  (dataMin) => dataMin - Math.abs(dataMin) * 0.01 - 1,
                  (dataMax) => dataMax + Math.abs(dataMax) * 0.01 + 1
                ]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={1.5}
                dot={false}
                strokeLinecap="round"
                strokeLinejoin="round"
                isAnimationActive={true}
              />
              {/** Tooltip removed by request */}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CurrentBalanceCard;
