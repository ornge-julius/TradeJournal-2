import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTradeManagement } from './hooks/useTradeManagement';
import { useAppState } from './hooks/useAppState';
import { useAuth } from './hooks/useAuth';
import Header from './components/ui/Header';
import TradeForm from './components/forms/TradeForm';
import SettingsForm from './components/forms/SettingsForm';
import AccountEditForm from './components/forms/AccountEditForm';
import SignInForm from './components/forms/SignInForm';
import TradeDetailView from './components/ui/TradeDetailView';
import DashboardView from './components/views/DashboardView';
import TradeBatchComparisonView from './components/views/TradeBatchComparisonView';
import { DateFilterProvider } from './context/DateFilterContext';

function AppContent() {
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
          <DateFilterProvider>
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
              <Routes>
                <Route 
                  path="/comparison" 
                  element={
                    <TradeBatchComparisonView
                      trades={trades}
                      startingBalance={startingBalance}
                      onViewTrade={handleTradeView}
                    />
                  } 
                />
                <Route 
                  path="/" 
                  element={
                    <DashboardView
                      trades={trades}
                      startingBalance={startingBalance}
                      onViewTrade={handleTradeView}
                    />
                  } 
                />
              </Routes>
            )}
          </DateFilterProvider>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
