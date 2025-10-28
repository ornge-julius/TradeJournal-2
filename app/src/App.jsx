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
    deleteTrade,
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

  const ensureAuthenticated = () => {
    if (!isAuthenticated) {
      setShowSignInForm(true);
      return false;
    }
    return true;
  };

  const handleTradeSubmit = async (tradeData) => {
    if (!ensureAuthenticated()) {
      return;
    }
    if (editingTrade) {
      const updatedTrade = await updateTrade({ ...editingTrade, ...tradeData });

      if (updatedTrade) {
        if (viewingTrade && viewingTrade.id === updatedTrade.id) {
          setViewingTrade(updatedTrade);
        }

        clearEditingTrade();

        if (!viewingTrade) {
          toggleTradeForm();
        }

        return true;
      }

      return false;
    }

    const newTrade = await addTrade(tradeData);

    if (newTrade) {
      if (!viewingTrade) {
        toggleTradeForm();
      }

      return true;
    }

    return false;
  };

  const handleTradeEdit = (trade) => {
    if (!ensureAuthenticated()) {
      return;
    }
    setEditingTrade(trade);
    // Only toggle trade form if we're on the main page (not viewing a trade)
    if (!viewingTrade) {
      toggleTradeForm();
    }
  };

  const handleToggleTradeForm = () => {
    if (!ensureAuthenticated()) {
      return;
    }
    toggleTradeForm();
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

  const handleTradeDelete = async (tradeId) => {
    if (!ensureAuthenticated()) {
      return;
    }
    
    try {
      await deleteTrade(tradeId);
      
      // If we're viewing the trade that was deleted, go back to list
      if (viewingTrade && viewingTrade.id === tradeId) {
        clearViewingTrade();
        clearEditingTrade();
      } else if (editingTrade && editingTrade.id === tradeId) {
        // If we're editing the trade that was deleted
        clearEditingTrade();
        toggleTradeForm();
      } else if (editingTrade) {
        // If we're editing a different trade, just clear editing
        clearEditingTrade();
      }
    } catch (err) {
      console.error('Error deleting trade:', err);
      // You could add error handling/notification here
    }
  };

  const handleToggleSettings = () => {
    if (!showBalanceForm && !ensureAuthenticated()) {
      return;
    }
    toggleBalanceForm();
  };

  const handleUpdateBalance = (newBalance) => {
    if (!ensureAuthenticated()) {
      return;
    }
    updateStartingBalance(newBalance);
    toggleBalanceForm();
  };

  const handleAddAccount = (accountData) => {
    if (!ensureAuthenticated()) {
      return;
    }
    addAccount(accountData);
  };

  const handleEditAccount = (account) => {
    if (!ensureAuthenticated()) {
      return;
    }
    setEditingAccount(account);
    setShowAccountEditForm(true);
  };

  const handleAccountEditSubmit = (updatedAccount) => {
    if (!ensureAuthenticated()) {
      return;
    }
    updateAccount(updatedAccount);
    setShowAccountEditForm(false);
    setEditingAccount(null);
  };

  const handleDeleteAccount = (accountId) => {
    if (!ensureAuthenticated()) {
      return;
    }
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
            onDelete={handleTradeDelete}
            isAuthenticated={isAuthenticated}
          />
        ) : (
          // Main Dashboard View
          <>
            <Header
              onToggleSettings={handleToggleSettings}
              onToggleTradeForm={handleToggleTradeForm}
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
              onClose={handleToggleSettings}
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
              onDelete={handleTradeDelete}
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
