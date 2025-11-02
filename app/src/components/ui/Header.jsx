import React, { useState, useCallback } from 'react';
import { Settings, Plus, LogIn, LogOut, Menu, X } from 'lucide-react';
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

          <button
            type="button"
            onClick={toggleMenu}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600/80 to-emerald-600/80 text-white shadow-lg transition-all hover:from-blue-600 hover:to-emerald-600"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-black/60" onClick={closeMenu} aria-hidden="true" />
      </div>

      <aside
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform transition-transform duration-300 ease-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex h-full flex-col overflow-y-auto border-l border-gray-800 bg-gray-900/95 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex flex-col">
              <span className="text-base font-semibold text-white">Quick Access</span>
              <span className="text-xs text-gray-400">Everything you need in one place</span>
            </div>
            <button
              type="button"
              onClick={closeMenu}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800/80 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 pb-10 space-y-8">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Navigation</p>
              <div className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={closeMenu}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                      item.isActive
                        ? 'bg-gray-800 text-white shadow-lg'
                        : 'bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Filter trades</p>
              <GlobalDateFilter inline />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Manage your accounts</p>
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
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Authentication</p>
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
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Trading</p>
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
      </aside>
    </header>
  );
};

export default Header;
