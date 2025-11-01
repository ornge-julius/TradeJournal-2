import React, { useState, useCallback } from 'react';
import {
  Settings,
  Plus,
  LogIn,
  LogOut,
  User,
  Menu,
  X,
  Bell,
  LineChart
} from 'lucide-react';
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

  const navigationLinks = [
    { label: 'Dashboard', active: true },
    { label: 'Team' },
    { label: 'Projects' },
    { label: 'Calendar' }
  ];

  const userInitial = user?.email?.charAt(0)?.toUpperCase();

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
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg">
                  <LineChart className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="hidden md:flex items-center gap-1 text-sm text-slate-300">
                {navigationLinks.map(({ label, active }) => (
                  <button
                    key={label}
                    type="button"
                    className={`px-4 py-2 rounded-2xl font-medium transition-colors duration-200 ${
                      active
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden lg:block">
                <GlobalDateFilter />
              </div>

              <button
                type="button"
                className="hidden md:flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
              </button>

              <div className="hidden md:flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-200">
                {userInitial ? (
                  <span className="text-sm font-semibold">{userInitial}</span>
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={toggleMenu}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  aria-label="Toggle menu"
                  aria-expanded={isMenuOpen}
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-3 top-full w-[calc(100vw-2rem)] sm:w-80 max-w-sm max-h-[calc(100vh-12rem)] overflow-y-auto bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-5 z-50">
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
          </div>

          <div className="lg:hidden">
            <GlobalDateFilter />
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={closeMenu} aria-hidden="true" />
      )}

    </header>
  );
};

export default Header;
