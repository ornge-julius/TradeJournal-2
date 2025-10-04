import React, { useMemo, useState } from 'react';
import { useTradeManagement } from './hooks/useTradeManagement';
import { useAppState } from './hooks/useAppState';
import { useAuth } from './hooks/useAuth';
import { calculateMetrics, generateCumulativeProfitData, generateAccountBalanceData, generateWinLossData } from './utils/calculations';
import Header from './components/ui/Header';
import MetricsCards from './components/ui/MetricsCards';
import TradeForm from './components/forms/TradeForm';
import SettingsForm from './components/forms/SettingsForm';
import AccountEditForm from './components/forms/AccountEditForm';
import SignInForm from './components/forms/SignInForm';
import TradeHistoryTable from './components/tables/TradeHistoryTable';
import TradeDetailView from './components/ui/TradeDetailView';
import AccountBalanceChart from './components/charts/AccountBalanceChart';
import WinLossChart from './components/charts/WinLossChart';
import CumulativeProfitChart from './components/charts/CumulativeProfitChart';

function App() {
  const [showAccountEditForm, setShowAccountEditForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [showSignInForm, setShowSignInForm] = useState(false);

  // Authentication state
  const { user, isAuthenticated, isLoading: authLoading, signInWithEmail, signOut } = useAuth();

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

  // Check if account is still loading
  const isAccountLoading = accounts.length === 0 && selectedAccountId === null;

  // Calculate metrics using useMemo for performance
  const metrics = useMemo(() => {
    if (isAccountLoading || !selectedAccountId) {
      return {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        totalProfit: 0,
        averageProfit: 0,
        maxProfit: 0,
        maxLoss: 0
      };
    }
    return calculateMetrics(trades, startingBalance);
  }, [trades, startingBalance, isAccountLoading, selectedAccountId]);

  // Generate chart data using useMemo for performance
  const chartData = useMemo(() => {
    if (isAccountLoading || !selectedAccountId) {
      return {
        cumulativeProfit: [],
        accountBalance: [],
        winLoss: []
      };
    }
    return {
      cumulativeProfit: generateCumulativeProfitData(trades),
      accountBalance: generateAccountBalanceData(trades, startingBalance),
      winLoss: generateWinLossData(metrics.winningTrades, metrics.losingTrades)
    };
  }, [trades, startingBalance, metrics.winningTrades, metrics.losingTrades, isAccountLoading, selectedAccountId]);

  const handleTradeSubmit = (tradeData) => {
    if (editingTrade) {
      updateTrade({ ...editingTrade, ...tradeData });
      clearEditingTrade();
    } else {
      addTrade(tradeData);
    }
    // Only toggle trade form if we're on the main page (not viewing a trade)
    if (!viewingTrade) {
      toggleTradeForm();
    }
  };

  const handleTradeEdit = (trade) => {
    setEditingTrade(trade);
    // Only toggle trade form if we're on the main page (not viewing a trade)
    if (!viewingTrade) {
      toggleTradeForm();
    }
  };

  const handleTradeView = (trade) => {
    setViewingTrade(trade);
  };

  const handleBackToList = () => {
    clearViewingTrade();
    // Clear any editing trade when going back to main page
    clearEditingTrade();
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

  // Authentication handlers
  const handleSignIn = () => {
    setShowSignInForm(true);
  };

  const handleSignInSubmit = async (email, password) => {
    await signInWithEmail(email, password);
    setShowSignInForm(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleCloseSignInForm = () => {
    setShowSignInForm(false);
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
            isEditing={editingTrade && editingTrade.id === viewingTrade.id}
            onSubmit={handleTradeSubmit}
            onCancelEdit={() => {
              clearEditingTrade();
            }}
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
              isAuthenticated={isAuthenticated}
              user={user}
              onSignIn={handleSignIn}
              onSignOut={handleSignOut}
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

            {/* Sign In Form */}
            <SignInForm
              isOpen={showSignInForm}
              onClose={handleCloseSignInForm}
              onSignIn={handleSignInSubmit}
            />

            {/* Loading State */}
            {authLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-300">Loading authentication...</p>
              </div>
            ) : isAccountLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-300">Loading account data...</p>
              </div>
            ) : !selectedAccountId ? (
              <div className="text-center py-12">
                <p className="text-gray-300 text-lg mb-4">No account selected</p>
                <p className="text-gray-400">Please select an account to view trades and metrics.</p>
              </div>
            ) : (
              <>
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
                <TradeHistoryTable trades={trades} onViewTrade={handleTradeView} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
