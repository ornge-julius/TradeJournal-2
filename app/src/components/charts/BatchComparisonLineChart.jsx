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

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }
  
  const data = payload[0].payload;
  
  return (
    <div style={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8, color: '#F3F4F6', padding: '8px 10px' }}>
      <div style={{ fontSize: 12, color: '#D1D5DB', marginBottom: 4 }}>Trade #{data.tradeNumber}</div>
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
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-semibold text-gray-200">Cumulative P&L Comparison</h3>
          <Info className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-center justify-center h-[400px] text-gray-400">
          No data available
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-semibold text-gray-200">Cumulative P&L Comparison</h3>
        <Info className="w-4 h-4 text-gray-400" />
      </div>
      <div className="w-full">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="tradeNumber"
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              label={{ value: 'Trade Number', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <ReferenceLine y={0} stroke="#4B5563" />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: '#F3F4F6' }}
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
