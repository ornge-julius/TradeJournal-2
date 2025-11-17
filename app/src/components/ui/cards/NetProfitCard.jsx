import React from 'react';
import { Info } from 'lucide-react';

const NetProfitCard = ({ totalProfit = 0 }) => {
  const formatCurrency = (value) => {
    // Validate and sanitize input
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(0);
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const validProfit = typeof totalProfit === 'number' && Number.isFinite(totalProfit) ? totalProfit : 0;
  const isPositive = validProfit > 0;
  const isNegative = validProfit < 0;
  const isZero = validProfit === 0;

  // Determine color based on profit value
  const profitColor = isPositive 
    ? 'text-[#10B981]' 
    : isNegative 
    ? 'text-[#EF4444]' 
    : 'text-gray-900 dark:text-white';

  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-all h-full flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Net Profit</h3>
        <Info className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      </div>

      <p className={`text-2xl font-bold ${profitColor}`}>
        {formatCurrency(validProfit)}
      </p>
    </div>
  );
};

export default NetProfitCard;

