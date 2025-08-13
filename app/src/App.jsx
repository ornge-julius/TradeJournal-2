import React, { useMemo } from 'react';
import { useTradeManagement } from './hooks/useTradeManagement';
import { useSettings } from './hooks/useSettings';
import { calculateMetrics, generateCumulativePnLData, generateAccountBalanceData, generateWinLossData } from './utils/calculations';
import { SupabaseProvider } from './contexts/SupabaseContext';
import Header from './components/ui/Header';
import MetricsCards from './components/ui/MetricsCards';
import TradeForm from './components/forms/TradeForm';
import SettingsForm from './components/forms/SettingsForm';
import TradeHistoryTable from './components/tables/TradeHistoryTable';
import TradeDetailView from './components/ui/TradeDetailView';
import AccountBalanceChart from './components/charts/AccountBalanceChart';
import WinLossChart from './components/charts/WinLossChart';
import CumulativePnLChart from './components/charts/CumulativePnLChart';

function App() {
  const {
    trades,
    editingTrade,
    viewingTrade,
    addTrade,
    updateTrade,
    setEditingTrade,
    setViewingTrade,
    clearEditingTrade,
    clearViewingTrade
  } = useTradeManagement();

  const {
    startingBalance,
    showBalanceForm,
    showTradeForm,
    updateStartingBalance,
    toggleBalanceForm,
    toggleTradeForm
  } = useSettings();

  // Calculate metrics using useMemo for performance
  const metrics = useMemo(() => {
    return calculateMetrics(trades, startingBalance);
  }, [trades, startingBalance]);

  // Generate chart data using useMemo for performance
  const chartData = useMemo(() => {
    return {
      cumulativePnL: generateCumulativePnLData(trades),
      accountBalance: generateAccountBalanceData(trades, startingBalance),
      winLoss: generateWinLossData(metrics.winningTrades, metrics.losingTrades)
    };
  }, [trades, startingBalance, metrics.winningTrades, metrics.losingTrades]);

  const handleTradeSubmit = (tradeData) => {
    if (editingTrade) {
      updateTrade({ ...editingTrade, ...tradeData });
      clearEditingTrade();
    } else {
      addTrade(tradeData);
    }
    toggleTradeForm();
  };

  const handleTradeEdit = (trade) => {
    setEditingTrade(trade);
    toggleTradeForm();
  };

  const handleTradeView = (trade) => {
    setViewingTrade(trade);
  };

  const handleBackToList = () => {
    clearViewingTrade();
  };

  const handleCancelEdit = () => {
    clearEditingTrade();
    toggleTradeForm();
  };

  const handleUpdateBalance = (newBalance) => {
    updateStartingBalance(newBalance);
    toggleBalanceForm();
  };

  return (
    <SupabaseProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* Trade Detail View */}
          {viewingTrade ? (
            <TradeDetailView
              trade={viewingTrade}
              onBack={handleBackToList}
              onEdit={handleTradeEdit}
            />
          ) : (
            // Main Dashboard View
            <>
              <Header
                onToggleSettings={toggleBalanceForm}
                onToggleTradeForm={toggleTradeForm}
                showTradeForm={showTradeForm}
              />

              {/* Settings Form */}
              <SettingsForm
                isOpen={showBalanceForm}
                onClose={toggleBalanceForm}
                onSubmit={handleUpdateBalance}
                currentBalance={startingBalance}
              />

              {/* Trade Form */}
              <TradeForm
                isOpen={showTradeForm}
                onClose={toggleTradeForm}
                onSubmit={handleTradeSubmit}
                editingTrade={editingTrade}
                onCancel={handleCancelEdit}
              />

              {/* Key Metrics Cards */}
              <MetricsCards metrics={metrics} startingBalance={startingBalance} />

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <AccountBalanceChart data={chartData.accountBalance} />
                <WinLossChart 
                  data={chartData.winLoss} 
                  winningTrades={metrics.winningTrades} 
                  losingTrades={metrics.losingTrades} 
                />
                <CumulativePnLChart data={chartData.cumulativePnL} />
              </div>

              {/* Trade History */}
              <TradeHistoryTable
                trades={trades}
                onViewTrade={handleTradeView}
                onEditTrade={handleTradeEdit}
              />
            </>
          )}
        </div>
      </div>
    </SupabaseProvider>
  );
}

export default App;
