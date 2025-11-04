import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { Info } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const CustomTooltip = ({ active, payload }) => {
  const { isDark } = useTheme();
  
  if (!active || !payload || payload.length === 0) {
    return null;
  }
  
  const data = payload[0].payload;
  
  return (
    <div style={{ 
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF', 
      border: isDark ? '1px solid #374151' : '1px solid #E5E7EB', 
      borderRadius: 8, 
      color: isDark ? '#F3F4F6' : '#111827', 
      padding: '8px 10px' 
    }}>
      <div style={{ fontSize: 12, color: isDark ? '#D1D5DB' : '#6B7280', marginBottom: 4 }}>Trade #{data.tradeNumber}</div>
      {data.currentValue !== null && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 4 }}>
          <span style={{ color: '#60A5FA', fontSize: 12 }}>Current:</span>
          <span style={{ color: '#60A5FA', fontWeight: 600, fontSize: 12 }}>
            ${data.currentValue.toLocaleString()}
          </span>
        </div>
      )}
      {data.previousValue !== null && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
          <span style={{ color: '#F59E0B', fontSize: 12 }}>Previous:</span>
          <span style={{ color: '#F59E0B', fontWeight: 600, fontSize: 12 }}>
            ${data.previousValue.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

const BatchComparisonLineChart = ({ data }) => {
  const { isDark } = useTheme();
  
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-xl pt-4 pb-0 px-4 sm:pt-6 sm:pb-0 sm:px-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Cumulative P&L Comparison</h3>
          <Info className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </div>
        <div className="flex items-center justify-center h-[400px] text-gray-600 dark:text-gray-400">
          No data available
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-xl pt-4 pb-0 px-4 sm:pt-6 sm:pb-0 sm:px-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Cumulative P&L Comparison</h3>
        <Info className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </div>
      <div className="w-full">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 48 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#E5E7EB"} />
            <XAxis
              dataKey="tradeNumber"
              stroke={isDark ? "#9CA3AF" : "#6B7280"}
              tick={{ fontSize: 12, fill: isDark ? '#9CA3AF' : '#6B7280' }}
              label={{ value: 'Trade Number', position: 'insideBottom', offset: -5, fill: isDark ? '#9CA3AF' : '#6B7280' }}
            />
            <YAxis
              stroke={isDark ? "#9CA3AF" : "#6B7280"}
              tick={{ fontSize: 12, fill: isDark ? '#9CA3AF' : '#6B7280' }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <ReferenceLine y={0} stroke={isDark ? "#4B5563" : "#9CA3AF"} />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: isDark ? '#F3F4F6' : '#111827', paddingTop: '16px' }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="currentValue"
              name="Current Batch"
              stroke="#60A5FA"
              strokeWidth={2}
              dot={{ r: 4, fill: '#60A5FA' }}
              activeDot={{ r: 6 }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="previousValue"
              name="Previous Batch"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ r: 4, fill: '#F59E0B' }}
              activeDot={{ r: 6 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BatchComparisonLineChart;
