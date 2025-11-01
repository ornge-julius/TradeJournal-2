import React, { useState, useCallback } from 'react';
import { Settings, Plus, LogIn, LogOut, User, Menu, X, Bell } from 'lucide-react';
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

  const navItems = [
    { label: 'Dashboard', isActive: true },
    { label: 'Accounts', isActive: false },
    { label: 'Trades', isActive: false },
    { label: 'Settings', isActive: false }
  ];

  const userInitial = user?.email?.charAt(0)?.toUpperCase() || 'TJ';

  return (
    <header className="sticky top-0 z-30 backdrop-blur-lg bg-gray-900/80 border-b border-gray-800 mb-8">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg"
              aria-hidden="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-6 w-6"
              >
                <path d="M3 12c0-4.97 4.03-9 9-9s9 4.03 9 9" opacity="0.4" />
                <path d="M5 17c1.5-2 3.5-3 7-3s5.5 1 7 3" />
                <path d="M12 12.5c1.5 0 3-1 3-2.5S13.5 7.5 12 7.5s-3 1-3 2.5 1.5 2.5 3 2.5z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-white">Trade Journal</span>
              <span className="text-xs text-gray-400 hidden sm:inline">Smarter insights for every trade</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1 rounded-full bg-gray-800/60 p-1 border border-gray-700/80 shadow-inner">
            {navItems.map((item) => (
              <span
                key={item.label}
                className={`px-4 py-1 text-sm font-medium rounded-full transition-all ${
                  item.isActive
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/70'
                }`}
              >
                {item.label}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <GlobalDateFilter />
            </div>

            <button
              type="button"
              onClick={isAuthenticated ? handleToggleTradeForm : handleSignInClick}
              aria-label={isAuthenticated ? 'Add new trade' : 'Sign in to add trades'}
              className={`hidden md:flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all shadow-lg ${
                isAuthenticated
                  ? 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>{isAuthenticated ? 'New Trade' : 'Sign In'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleSettings}
              className="hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={toggleMenu}
              className="hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600/80 to-emerald-600/80 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-emerald-600 transition-all"
              aria-label="Open profile menu"
              aria-expanded={isMenuOpen}
            >
              {user ? userInitial : <User className="h-5 w-5" />}
            </button>

            <button
              type="button"
              onClick={toggleMenu}
              className="md:hidden h-10 w-10 items-center justify-center rounded-xl bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors flex"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="relative z-40">
          <div className="fixed inset-0" onClick={closeMenu} aria-hidden="true" />
          <div className="absolute right-4 md:right-10 top-20 md:top-24 w-[calc(100vw-2rem)] md:w-96 max-w-sm max-h-[calc(100vh-10rem)] overflow-y-auto rounded-3xl border border-gray-800 bg-gray-900/95 shadow-2xl backdrop-blur-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Quick Access</h2>
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
              <p className="text-sm text-gray-400">Filter trades</p>
              <GlobalDateFilter />
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
                  <div className="flex items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900/60 px-4 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 text-sm font-semibold text-white">
                      {userInitial}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white truncate">{user?.email}</span>
                      <span className="text-xs text-gray-400">Signed in</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOutClick}
                    className="w-full rounded-2xl bg-gray-800 px-4 py-2 font-medium text-gray-200 transition-colors hover:bg-gray-700 flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleSignInClick}
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 px-4 py-3 font-semibold text-white transition-all duration-200 hover:from-blue-500 hover:to-emerald-500 shadow-lg"
                >
                  <div className="flex items-center justify-center gap-2">
                    <LogIn className="h-5 w-5" />
                    Sign In
                  </div>
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
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 px-4 py-3 font-semibold text-white transition-all duration-200 hover:from-blue-500 hover:to-emerald-500 shadow-lg flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  {showTradeForm ? 'Hide Trade Form' : 'Add New Trade'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSignInClick}
                  className="w-full rounded-2xl bg-gray-800 px-4 py-3 font-medium text-gray-200 transition-colors hover:bg-gray-700 flex items-center justify-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in to add trades
                </button>
              )}
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleToggleSettings}
                  className="w-full rounded-2xl bg-gray-800 px-4 py-3 font-medium text-gray-200 transition-colors hover:bg-gray-700 flex items-center justify-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSignInClick}
                  className="w-full rounded-2xl bg-gray-800 px-4 py-3 font-medium text-gray-200 transition-colors hover:bg-gray-700 flex items-center justify-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Sign in to manage settings
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
