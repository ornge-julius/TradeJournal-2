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
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const dataPoint = payload[0].payload;
  const value = Number(payload[0].value || 0);
  const valueColor = value >= 0 ? '#10B981' : '#EF4444';

  return (
    <div style={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8, color: '#F3F4F6', padding: '8px 10px' }}>
      <div style={{ fontSize: 12, color: '#D1D5DB', marginBottom: 4 }}>{dataPoint.monthFull}</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
        <span style={{ color: '#9CA3AF', fontSize: 12 }}>Net P&L</span>
        <span style={{ color: valueColor, fontWeight: 600, fontSize: 12 }}>
          {`$${value.toLocaleString()}`}
        </span>
      </div>
    </div>
  );
};


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
          <ReferenceLine y={0} stroke="#4B5563" />
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
  );
};

export default Last30DaysNetPNLChart;
