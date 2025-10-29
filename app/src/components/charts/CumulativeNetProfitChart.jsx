import React from 'react';
import { 
  LineChart,
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Info } from 'lucide-react';
import { formatDate, formatDateForTooltip } from '../../utils/calculations';

const CumulativeNetProfitChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-semibold text-gray-200">Cumulative Net Profit Curve</h3>
          <Info className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-center justify-center h-[400px] text-gray-400">
          No data available
        </div>
      </div>
    );
  }
  console.log("cumulative net profit chart data", data);

  // Prepare data with negative area values for shading below zero
  const chartData = data.map(point => ({
    ...point,
    // Negative area: cumulative value when negative, otherwise 0
    // This will create a filled area from the negative value to zero
    negativeArea: point.cumulative < 0 ? point.cumulative : 0
  }));

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

  console.log("Chart domain:", domain, "Min:", minValue, "Max:", maxValue, "Has positive:", hasPositiveValues);
  console.log("Sample data points:", chartData.slice(0, 5).map(p => ({ date: p.date, cumulative: p.cumulative })));

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-semibold text-gray-200">Cumulative Net Profit Curve</h3>
        <Info className="w-4 h-4 text-gray-400" />
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 80 }}>
          
          {/* Grid and axes */}
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          
          {/* X-axis with date labels */}
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            tickFormatter={(value) => formatDate(value)}
            angle={-45}
            textAnchor="end"
            height={80}
            interval="preserveStartEnd"
          />
          
          {/* Y-axis with dollar values - domain ensures positive values are visible */}
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            domain={domain}
            allowDataOverflow={false}
          />
          
          {/* Reference line at zero */}
          <ReferenceLine y={0} stroke="#9CA3AF" strokeDasharray="2 2" />
          
          {/* Shaded area below zero - fills from negative values to zero line */}
          <Area
            type="monotone"
            dataKey="negativeArea"
            stroke="none"
            fill="rgba(107, 114, 128, 0.2)"
            fillOpacity={1}
            baseLine={0}
            isAnimationActive={true}
          />
          
          {/* Light blue line for cumulative profit - MUST render after Area */}
          <Line 
            type="monotone"
            dataKey="cumulative"
            stroke="#60A5FA"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4, fill: '#60A5FA', strokeWidth: 2 }}
            isAnimationActive={true}
            connectNulls={false}
          />
          
          {/* Tooltip */}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F3F4F6',
              padding: '12px'
            }}
            itemStyle={{ color: '#F3F4F6' }}
            labelStyle={{ color: '#F3F4F6', marginBottom: '8px', fontWeight: '600' }}
            formatter={(value) => [`$${value.toLocaleString()}`, 'Profit']}
            labelFormatter={(label) => formatDateForTooltip(label)}
            cursor={{ stroke: '#6B7280', strokeWidth: 1 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CumulativeNetProfitChart;

