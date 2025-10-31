import React, { useState, useCallback } from 'react';
import { Settings, Plus, LogIn, LogOut, User, Menu, X } from 'lucide-react';
import AccountSelector from './AccountSelector';
import GlobalDateFilter from './GlobalDateFilter';

const Header = ({ 
  onToggleSettings, 
  onToggleTradeForm, 
  showTradeForm,
  accounts,
  selectedAccountId,
  onSelectAccount,
  onAddAccount,
  onEditAccount,
  onDeleteAccount,
  isAuthenticated,
  user,
  onSignIn,
  onSignOut
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const handleSelectAccount = (accountId) => {
    onSelectAccount(accountId);
    closeMenu();
  };

  const handleSignInClick = () => {
    closeMenu();
    onSignIn();
  };

  const handleSignOutClick = () => {
    closeMenu();
    onSignOut();
  };

  const handleToggleTradeForm = () => {
    closeMenu();
    onToggleTradeForm();
  };

  const handleToggleSettings = () => {
    closeMenu();
    onToggleSettings();
  };

  return (
    <div className="sticky top-0 z-30 bg-gray-800/95 backdrop-blur-sm mb-8 py-4 border-b border-gray-700 shadow-lg rounded-b-2xl">
      {/* Top bar with date filter and hamburger menu */}
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 ml-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Trading Journal
          </h1>
          <p className="text-gray-400 ml-4">Track your trades and analyze your performance</p>
        </div>
        <div className="flex items-center gap-2 ml-4 md:ml-0 md:justify-end relative">
          <GlobalDateFilter />
          <button
            type="button"
            onClick={toggleMenu}
            className="bg-gray-800 hover:bg-gray-700 p-3 rounded-xl transition-colors shadow-lg hover:shadow-xl md:mr-12"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 md:right-12 mt-2 top-full w-[calc(100vw-2rem)] md:w-80 max-w-sm max-h-[calc(100vh-12rem)] overflow-y-auto bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-5 space-y-5 z-50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-400">Manage your accounts</p>
                <AccountSelector
                  accounts={accounts}
                  selectedAccountId={selectedAccountId}
                  onSelectAccount={handleSelectAccount}
                  onAddAccount={onAddAccount}
                  onEditAccount={onEditAccount}
                  onDeleteAccount={onDeleteAccount}
                  isAuthenticated={isAuthenticated}
                  onSignIn={handleSignInClick}
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-400">Authentication</p>
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
                      <User className="h-4 w-4 text-gray-300" />
                      <span className="text-gray-300 text-sm truncate">{user?.email}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleSignOutClick}
                      className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleSignInClick}
                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <LogIn className="h-5 w-5" />
                    Sign In
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-400">Trading</p>
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleToggleTradeForm}
                    aria-pressed={Boolean(showTradeForm)}
                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="h-5 w-5" />
                    {showTradeForm ? 'Hide Trade Form' : 'Add New Trade'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSignInClick}
                    className="w-full bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign in to add trades
                  </button>
                )}
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleToggleSettings}
                    className="w-full bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSignInClick}
                    className="w-full bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Sign in to manage settings
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={closeMenu} aria-hidden="true" />
      )}

    </div>
  );
};

export default Header;
