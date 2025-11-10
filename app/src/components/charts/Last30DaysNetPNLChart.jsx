import React from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Rectangle
} from 'recharts';
import { Info } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Custom bar shape with rounded corners that adapts to positive/negative values
const RoundedBar = (props) => {
  const { height, y, ...rest } = props;

  // Positive: rounded top corners. Negative: rounded bottom corners with flat top.
  if (height < 0) {
    return (
      <Rectangle
        {...rest}
        y={y + height}
        height={-height}
        radius={[0, 0, 8, 8]}
      />
    );
  }

  return <Rectangle {...rest} y={y} height={height} radius={[8, 8, 0, 0]} />;
};

const CustomTooltip = ({ active, payload }) => {
  const { isDark } = useTheme();
  
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const dataPoint = payload[0].payload;
  const value = Number(payload[0].value || 0);
  const valueColor = value >= 0 ? '#10B981' : '#EF4444';

  return (
    <div style={{ 
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF', 
      border: isDark ? '1px solid #374151' : '1px solid #E5E7EB', 
      borderRadius: 8, 
      color: isDark ? '#F3F4F6' : '#111827', 
      padding: '8px 10px' 
    }}>
      <div style={{ fontSize: 12, color: isDark ? '#D1D5DB' : '#6B7280', marginBottom: 4 }}>{dataPoint.monthFull}</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
        <span style={{ color: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12 }}>Net P&L</span>
        <span style={{ color: valueColor, fontWeight: 600, fontSize: 12 }}>
          {`$${value.toLocaleString()}`}
        </span>
      </div>
    </div>
  );
};


const Last30DaysNetPNLChart = ({ data }) => {
  const { isDark } = useTheme();
  
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Last 30 Days Net P&amp;L</h3>
          <Info className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </div>
        <div className="flex items-center justify-center h-[300px] text-gray-600 dark:text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Last 30 Days Net P&amp;L</h3>
        <Info className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      </div>
      <div className="w-full">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#E5E7EB"} />
            <XAxis
              dataKey="dateLabel"
              stroke={isDark ? "#9CA3AF" : "#6B7280"}
              tick={{ fontSize: 10, fill: isDark ? '#9CA3AF' : '#6B7280' }}
              angle={-45}
              textAnchor="end"
              height={40}
            />
            <YAxis
              stroke={isDark ? "#9CA3AF" : "#6B7280"}
              tick={{ fontSize: 12, fill: isDark ? '#9CA3AF' : '#6B7280' }}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <ReferenceLine y={0} stroke={isDark ? "#4B5563" : "#9CA3AF"} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="netPNL" barSize={26} shape={<RoundedBar />}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.netPNL >= 0 ? '#10B981' : '#EF4444'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Last30DaysNetPNLChart;
