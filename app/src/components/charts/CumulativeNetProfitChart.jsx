import React from 'react';
import { 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  AreaChart
} from 'recharts';
import { Info } from 'lucide-react';
import { formatDate, formatDateForTooltip } from '../../utils/calculations';
import { useTheme } from '../../context/ThemeContext';

const CumulativeNetProfitChart = ({ data }) => {
  const { isDark } = useTheme();
  
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Cumulative Net Profit Curve</h3>
          <Info className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </div>
        <div className="flex items-center justify-center h-[400px] text-gray-600 dark:text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  // Use provided data directly for charting
  const chartData = data;

  // Calculate Y-axis domain to include both positive and negative values
  const cumulativeValues = chartData
    .map(point => point.cumulative)
    .filter(val => typeof val === 'number' && !isNaN(val));
  
  if (cumulativeValues.length === 0) {
    return null;
  }
  
  const minValue = Math.min(...cumulativeValues);
  const maxValue = Math.max(...cumulativeValues);
  const hasPositiveValues = maxValue > 0;
  const hasNegativeValues = minValue < 0;
  
  // Calculate padding (10% of the range, minimum 10 units)
  const range = maxValue - minValue;
  const padding = range === 0 ? 100 : Math.max(range * 0.1, 10);
  
  // Set domain with padding, ensuring zero is visible when values cross it
  let domainMin = Math.floor(minValue - padding);
  let domainMax = Math.ceil(maxValue + padding);
  
  // If values cross zero, ensure zero is visible in domain
  if (hasPositiveValues && hasNegativeValues) {
    // Ensure domain includes zero with some buffer
    domainMin = Math.min(domainMin, -Math.max(padding, 10));
    domainMax = Math.max(domainMax, Math.max(padding, 10));
  }
  
  const domain = [domainMin, domainMax];

  // Calculate the gradient offset so the fill splits at y=0 like Recharts "fill by value"
  const getGradientOffset = () => {
    if (maxValue <= 0) return '0%';
    if (minValue >= 0) return '100%';
    return `${(maxValue / (maxValue - minValue)) * 100}%`;
  };
  const gradientOffset = getGradientOffset();

  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Cumulative Net Profit Curve</h3>
        <Info className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </div>
      <div className="w-full">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 48 }}>
            <defs>
              <linearGradient id="cumulativeSplit" x1="0" y1="0" x2="0" y2="1">
                <stop offset={gradientOffset} stopColor="#10B981" stopOpacity={0.25} />
                <stop offset={gradientOffset} stopColor="#EF4444" stopOpacity={0.25} />
              </linearGradient>
            </defs>
            {/* Grid and axes */}
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#E5E7EB"} />
          
            {/* X-axis with date labels */}
            <XAxis
              dataKey="date"
              stroke={isDark ? "#9CA3AF" : "#6B7280"}
              tick={{ fontSize: 12, fill: isDark ? '#9CA3AF' : '#6B7280' }}
              tickFormatter={(value) => formatDate(value)}
              angle={-45}
              textAnchor="end"
              height={60}
              interval="preserveStartEnd"
            />
          
            {/* Y-axis with dollar values - domain ensures positive values are visible */}
            <YAxis
              stroke={isDark ? "#9CA3AF" : "#6B7280"}
              tick={{ fontSize: 12, fill: isDark ? '#9CA3AF' : '#6B7280' }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              domain={domain}
              allowDataOverflow={false}
            />
          
            {/* Reference line at zero */}
            <ReferenceLine y={0} stroke={isDark ? "#9CA3AF" : "#6B7280"} strokeDasharray="2 2" />

            {/* Main area for cumulative curve with split-color fill by value */}
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke={isDark ? "#60A5FA" : "#000000"}
              strokeWidth={1.5}
              fill="url(#cumulativeSplit)"
              dot={false}
              activeDot={{ r: 4, fill: isDark ? '#60A5FA' : '#000000', strokeWidth: 2 }}
              isAnimationActive={true}
              connectNulls={false}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                borderRadius: '8px',
                color: isDark ? '#F3F4F6' : '#111827',
                padding: '12px'
              }}
              itemStyle={{ color: isDark ? '#F3F4F6' : '#111827' }}
              labelStyle={{ color: isDark ? '#F3F4F6' : '#111827', marginBottom: '8px', fontWeight: '600' }}
              formatter={(value) => [`$${value.toLocaleString()}`, 'Profit']}
              labelFormatter={(label) => formatDateForTooltip(label)}
              cursor={{ stroke: isDark ? '#6B7280' : '#9CA3AF', strokeWidth: 1 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CumulativeNetProfitChart;

