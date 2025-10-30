import React, { useMemo } from 'react';
import MetricsCards from '../ui/MetricsCards';
import TradeHistoryTable from '../tables/TradeHistoryTable';
import CumulativeNetProfitChart from '../charts/CumulativeNetProfitChart';
import MonthlyNetPNLChart from '../charts/MonthlyNetPNLChart';
import { calculateMetrics, generateCumulativeProfitData, generateAccountBalanceData, generateBalanceTrendData, generateMonthlyNetPNLData } from '../../utils/calculations';
import DashboardMetricsCards from '../ui/DashboardMetricsCards';

const DashboardView = ({ trades, startingBalance, onViewTrade }) => {
  // Calculate all metrics
  const metrics = useMemo(() => {
    return calculateMetrics(trades, startingBalance);
  }, [trades, startingBalance]);

  // Generate cumulative profit chart data
  const cumulativeProfitData = useMemo(() => {
    return generateCumulativeProfitData(trades);
  }, [trades]);
  const accountBalanceData = useMemo(() => {
    return generateAccountBalanceData(trades, startingBalance);
  }, [trades, startingBalance]);

  const balanceTrendData = useMemo(() => {
    return generateBalanceTrendData(accountBalanceData);
  }, [accountBalanceData]);

  const monthlyNetPNLData = useMemo(() => {
    return generateMonthlyNetPNLData(trades);
  }, [trades]);


  return (
    <div className="space-y-8">
      {/* Enhanced Metrics Cards */}
      <DashboardMetricsCards metrics={metrics} currentBalance={metrics.currentBalance} balanceTrendData={balanceTrendData} />

      {/* Cumulative Net Profit Curve - Full Width Row */}
      <CumulativeNetProfitChart data={cumulativeProfitData} />

      {/* Other Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MonthlyNetPNLChart data={monthlyNetPNLData} />

        {/* Last 30 Days Net P&L Chart Placeholder */}
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            Chart placeholder - Last 30 Days Net P&L
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

