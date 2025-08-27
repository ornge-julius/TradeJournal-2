import React, { useMemo, useState } from 'react';
import { useTradeManagement } from './hooks/useTradeManagement';
import { useAppState } from './hooks/useAppState';
import { calculateMetrics, generateCumulativeProfitData, generateAccountBalanceData, generateWinLossData } from './utils/calculations';
import Header from './components/ui/Header';
import MetricsCards from './components/ui/MetricsCards';
import TradeForm from './components/forms/TradeForm';
import SettingsForm from './components/forms/SettingsForm';
import AccountEditForm from './components/forms/AccountEditForm';
import TradeHistoryTable from './components/tables/TradeHistoryTable';
import TradeDetailView from './components/ui/TradeDetailView';
import AccountBalanceChart from './components/charts/AccountBalanceChart';
import WinLossChart from './components/charts/WinLossChart';
import CumulativeProfitChart from './components/charts/CumulativeProfitChart';

function App() {
  const [showAccountEditForm, setShowAccountEditForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const {
    startingBalance,
    showBalanceForm,
    showTradeForm,
    updateStartingBalance,
    toggleBalanceForm,
    toggleTradeForm,
    accounts,
    selectedAccountId,
    selectedAccount,
    addAccount,
    updateAccount,
    deleteAccount,
    selectAccount
  } = useAppState();

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
  } = useTradeManagement(selectedAccountId);

  // Calculate metrics using useMemo for performance
  const metrics = useMemo(() => {
    return calculateMetrics(trades, startingBalance);
  }, [trades, startingBalance]);

  // Generate chart data using useMemo for performance
  const chartData = useMemo(() => {
    return {
      cumulativeProfit: generateCumulativeProfitData(trades),
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

  const handleAddAccount = (accountData) => {
    addAccount(accountData);
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setShowAccountEditForm(true);
  };

  const handleAccountEditSubmit = (updatedAccount) => {
    updateAccount(updatedAccount);
    setShowAccountEditForm(false);
    setEditingAccount(null);
  };

  const handleDeleteAccount = (accountId) => {
    if (accounts.length > 1) {
      deleteAccount(accountId);
    }
  };

  const handleSelectAccount = (accountId) => {
    selectAccount(accountId);
  };

  return (
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
              accounts={accounts}
              selectedAccountId={selectedAccountId}
              onSelectAccount={handleSelectAccount}
              onAddAccount={handleAddAccount}
              onEditAccount={handleEditAccount}
              onDeleteAccount={handleDeleteAccount}
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

            {/* Account Edit Form */}
            <AccountEditForm
              isOpen={showAccountEditForm}
              onClose={() => {
                setShowAccountEditForm(false);
                setEditingAccount(null);
              }}
              onSubmit={handleAccountEditSubmit}
              account={editingAccount}
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
              <CumulativeProfitChart data={chartData.cumulativeProfit} />
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
  );
}

export default App;
