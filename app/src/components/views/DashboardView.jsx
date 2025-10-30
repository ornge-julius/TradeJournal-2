import React, { useMemo } from 'react';
import MetricsCards from '../ui/MetricsCards';
import TradeHistoryTable from '../tables/TradeHistoryTable';
import CumulativeNetProfitChart from '../charts/CumulativeNetProfitChart';
import MonthlyNetPNLChart from '../charts/MonthlyNetPNLChart';
import Last30DaysNetPNLChart from '../charts/Last30DaysNetPNLChart';
import DashboardMetricsCards from '../ui/DashboardMetricsCards';
import { calculateMetrics, generateCumulativeProfitData, generateAccountBalanceData, generateBalanceTrendData, generateMonthlyNetPNLData, generateLast30DaysNetPNLData } from '../../utils/calculations';

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
  
  const last30DaysNetPNLData = useMemo(() => {
    return generateLast30DaysNetPNLData(trades);
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
        <Last30DaysNetPNLChart data={last30DaysNetPNLData} />
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

