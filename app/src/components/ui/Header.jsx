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
  LayoutDashboard,
  Wallet,
  BarChart3
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
    {
      label: 'Dashboard',
      description: 'Track performance and daily metrics',
      icon: LayoutDashboard,
      action: closeMenu,
      isActive: true
    },
    {
      label: 'Accounts',
      description: 'Review balances and funding status',
      icon: Wallet,
      action: closeMenu,
      isActive: false
    },
    {
      label: 'Trades',
      description: 'Inspect journaled positions and notes',
      icon: BarChart3,
      action: closeMenu,
      isActive: false
    },
    {
      label: 'Settings',
      description: 'Configure alerts, metrics, and preferences',
      icon: Settings,
      action: handleToggleSettings,
      isActive: false
    }
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
          <div className="absolute inset-x-4 top-20 origin-top-right md:right-10 md:left-auto md:inset-x-auto md:top-24 md:w-96">
            <div className="overflow-hidden rounded-3xl bg-slate-900/95 ring-1 ring-white/10 shadow-2xl backdrop-blur-xl">
              <div className="flex items-start justify-between px-6 py-5 border-b border-white/10">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Quick access</p>
                  <h2 className="text-lg font-semibold text-white">Command center</h2>
                </div>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto px-6 py-6 space-y-8 md:max-h-[28rem]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Navigation</p>
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    {navItems.map(({ label, description, icon: Icon, action }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={action}
                        className="group relative flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 px-4 py-4 text-left transition hover:bg-white/10"
                      >
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600/90 to-emerald-600/90 text-white shadow-lg">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="flex flex-col">
                          <span className="text-sm font-semibold text-white">{label}</span>
                          <span className="mt-1 text-xs text-slate-400">{description}</span>
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-4 hidden items-center text-slate-500 transition group-hover:flex">
                          <span className="text-xs uppercase tracking-wider">Open</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Filter trades</p>
                  <div className="mt-4 rounded-2xl border border-white/5 bg-slate-800/60 p-4 shadow-inner">
                    <GlobalDateFilter />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Manage accounts</p>
                  <div className="mt-4 rounded-2xl border border-white/5 bg-slate-800/60 p-4 shadow-inner">
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
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Authentication</p>
                  <div className="mt-4 space-y-3">
                    {isAuthenticated ? (
                      <>
                        <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-800/60 px-4 py-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-emerald-600 text-sm font-semibold text-white">
                            {userInitial}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-white truncate">{user?.email}</span>
                            <span className="text-xs text-slate-400">Signed in</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleSignOutClick}
                          className="w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </div>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSignInClick}
                        className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-emerald-500 shadow-lg"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <LogIn className="h-5 w-5" />
                          Sign In
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 bg-slate-900/60 px-6 py-5">
                <div className="flex flex-col gap-3">
                  {isAuthenticated ? (
                    <>
                      <button
                        type="button"
                        onClick={handleToggleTradeForm}
                        aria-pressed={Boolean(showTradeForm)}
                        className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-emerald-500 shadow-lg flex items-center justify-center gap-2"
                      >
                        <Plus className="h-5 w-5" />
                        {showTradeForm ? 'Hide Trade Form' : 'Add New Trade'}
                      </button>
                      <button
                        type="button"
                        onClick={handleToggleSettings}
                        className="w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white flex items-center justify-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSignInClick}
                      className="w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white flex items-center justify-center gap-2"
                    >
                      <LogIn className="h-4 w-4" />
                      Sign in to manage trades
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
