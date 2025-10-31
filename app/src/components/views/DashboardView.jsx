import React, { useMemo } from 'react';
import TradeHistoryTable from '../tables/TradeHistoryTable';
import CumulativeNetProfitChart from '../charts/CumulativeNetProfitChart';
import MonthlyNetPNLChart from '../charts/MonthlyNetPNLChart';
import Last30DaysNetPNLChart from '../charts/Last30DaysNetPNLChart';
import DashboardMetricsCards from '../ui/DashboardMetricsCards';
import {
  calculateMetrics,
  generateCumulativeProfitData,
  generateAccountBalanceData,
  generateBalanceTrendData,
  generateMonthlyNetPNLData,
  generateLast30DaysNetPNLData
} from '../../utils/calculations';
import { filterTradesByEntryDate, useDateFilter } from '../../context/DateFilterContext';

const DashboardContent = ({ trades, startingBalance, onViewTrade }) => {
  const { filter } = useDateFilter();

  const filteredTrades = useMemo(() => {
    return filterTradesByEntryDate(trades, filter);
  }, [trades, filter]);

  const metrics = useMemo(() => {
    return calculateMetrics(filteredTrades, startingBalance);
  }, [filteredTrades, startingBalance]);

  const cumulativeProfitData = useMemo(() => {
    return generateCumulativeProfitData(filteredTrades);
  }, [filteredTrades]);

  const accountBalanceData = useMemo(() => {
    return generateAccountBalanceData(filteredTrades, startingBalance);
  }, [filteredTrades, startingBalance]);

  const balanceTrendData = useMemo(() => {
    return generateBalanceTrendData(accountBalanceData);
  }, [accountBalanceData]);

  const monthlyNetPNLData = useMemo(() => {
    return generateMonthlyNetPNLData(filteredTrades);
  }, [filteredTrades]);
  
  const last30DaysNetPNLData = useMemo(() => {
    return generateLast30DaysNetPNLData(trades);
  }, [trades]);

  return (
    <div className="space-y-8">
      <DashboardMetricsCards metrics={metrics} currentBalance={metrics.currentBalance} balanceTrendData={balanceTrendData} />

      <CumulativeNetProfitChart data={cumulativeProfitData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MonthlyNetPNLChart data={monthlyNetPNLData} />
        <Last30DaysNetPNLChart data={last30DaysNetPNLData} />
      </div>

      <TradeHistoryTable
        trades={trades}
        onViewTrade={onViewTrade}
      />
    </div>
  );
};

const DashboardView = ({ trades, startingBalance, onViewTrade }) => {
  return (
    <DashboardContent
      trades={trades}
      startingBalance={startingBalance}
      onViewTrade={onViewTrade}
    />
  );
};

export default DashboardView;
