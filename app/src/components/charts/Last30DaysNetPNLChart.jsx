import React from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Info } from 'lucide-react';

const Last30DaysNetPNLChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-semibold text-gray-200">Last 30 Days Net P&amp;L</h3>
          <Info className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-center justify-center h-[300px] text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  const formatTooltipDate = (dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-semibold text-gray-200">Last 30 Days Net P&amp;L</h3>
        <Info className="h-4 w-4 text-gray-400" />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="dateLabel"
            stroke="#9CA3AF"
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            stroke="#9CA3AF"
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            tickFormatter={(value) => formatCurrency(value)}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F3F4F6'
            }}
            formatter={(value) => [formatCurrency(value), 'Net P&L']}
            labelFormatter={(label) => formatTooltipDate(label)}
          />
          <Bar dataKey="netPNL" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isPositive ? '#10B981' : '#000000'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Last30DaysNetPNLChart;
