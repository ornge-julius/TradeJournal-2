import React, { useState } from 'react';
import { ChevronDown, Plus, Settings, Trash2, LogIn } from 'lucide-react';

const AccountSelector = ({
  accounts,
  selectedAccountId,
  onSelectAccount,
  onAddAccount,
  onEditAccount,
  onDeleteAccount,
  isAuthenticated,
  onSignIn
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountBalance, setNewAccountBalance] = useState('');

  const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);

  const handleRequireAuthentication = () => {
    setIsOpen(false);
    if (typeof onSignIn === 'function') {
      onSignIn();
    }
  };

  const handleAddAccount = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      handleRequireAuthentication();
      return;
    }
    if (newAccountName.trim() && newAccountBalance) {
      onAddAccount({
        name: newAccountName.trim(),
        startingBalance: parseFloat(newAccountBalance),
        currentBalance: parseFloat(newAccountBalance)
      });
      setNewAccountName('');
      setNewAccountBalance('');
      setShowAddForm(false);
    }
  };

  const handleDeleteAccount = (accountId) => {
    if (!isAuthenticated) {
      handleRequireAuthentication();
      return;
    }
    if (accounts.length > 1) {
      onDeleteAccount(accountId);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Account Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 min-w-[200px] justify-between border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
      >
        <span className="truncate">
          {selectedAccount ? selectedAccount.name : 'Select Account'}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
          {/* Current Account Info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{selectedAccount?.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Balance: ${selectedAccount?.currentBalance?.toLocaleString() || 0}
                </p>
              </div>
              {isAuthenticated && (
                <button
                  onClick={() => onEditAccount(selectedAccount)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Settings className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Account List */}
          <div className="max-h-60 overflow-y-auto">
            {accounts.map((account) => (
              <div
                key={account.id}
                className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                  account.id === selectedAccountId ? 'bg-gray-50 dark:bg-gray-700' : ''
                }`}
                onClick={() => {
                  onSelectAccount(account.id);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{account.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ${account.currentBalance?.toLocaleString() || 0}
                    </div>
                  </div>
                  {isAuthenticated && accounts.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAccount(account.id);
                      }}
                      className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1"
                      title="Delete Account"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add New Account */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {isAuthenticated ? (
              !showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add New Account
                </button>
              ) : (
                <form onSubmit={handleAddAccount} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Account Name"
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Starting Balance"
                    value={newAccountBalance}
                    onChange={(e) => setNewAccountBalance(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    step="0.01"
                    min="0"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setNewAccountName('');
                        setNewAccountBalance('');
                      }}
                      className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )
            ) : (
              <div className="space-y-3 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Sign in to add or manage accounts.</p>
                <button
                  type="button"
                  onClick={handleRequireAuthentication}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default AccountSelector;
