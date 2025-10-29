import React, { useMemo } from 'react';
import MetricsCards from '../ui/MetricsCards';
import TradeHistoryTable from '../tables/TradeHistoryTable';
import { calculateMetrics } from '../../utils/calculations';

const DashboardView = ({ trades, startingBalance, onViewTrade }) => {
  // Calculate all metrics
  const metrics = useMemo(() => {
    return calculateMetrics(trades, startingBalance);
  }, [trades, startingBalance]);

  return (
    <div className="space-y-8">
      {/* Enhanced Metrics Cards */}
      <MetricsCards 
        metrics={metrics}
        startingBalance={startingBalance}
      />

      {/* Main Charts Section - Structure ready for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Placeholder for Cumulative Net Profit Curve */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-center h-[400px] text-gray-400">
              Chart placeholder - Cumulative Net Profit Curve
            </div>
          </div>
        </div>

        {/* Right Column: Placeholders for Monthly and Daily Charts */}
        <div className="flex flex-col gap-8">
          {/* Monthly Net P&L Chart Placeholder */}
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              Chart placeholder - Monthly Net P&L
            </div>
          </div>
          
          {/* Last 30 Days Net P&L Chart Placeholder */}
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              Chart placeholder - Last 30 Days Net P&L
            </div>
          </div>
        </div>
      </div>

      {/* Trade History Table */}
      <TradeHistoryTable 
        trades={trades} 
        onViewTrade={onViewTrade} 
      />
    </div>
  );
};

export default DashboardView;

