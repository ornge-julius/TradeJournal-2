import React, { useState, useCallback } from 'react';
import { Settings, Plus, LogIn, LogOut, Menu, X, Bell } from 'lucide-react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  const handleSelectAccount = (accountId) => {
    onSelectAccount(accountId);
    closeSidebar();
  };

  const handleSignInClick = () => {
    closeSidebar();
    onSignIn();
  };

  const handleSignOutClick = () => {
    closeSidebar();
    onSignOut();
  };

  const handleToggleTradeForm = () => {
    closeSidebar();
    onToggleTradeForm();
  };

  const handleToggleSettings = () => {
    closeSidebar();
    onToggleSettings();
  };

  const navItems = [
    { label: 'Dashboard', isActive: true },
    { label: 'Accounts', isActive: false },
    { label: 'Trades', isActive: false },
    { label: 'Settings', isActive: false }
  ];

  return (
    <header className="sticky top-0 z-30 backdrop-blur-lg bg-gray-900/80 border-b border-gray-800 mb-8">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
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

          <div className="flex items-center gap-2 sm:gap-3">
            <GlobalDateFilter variant="navbar" />

            <button
              type="button"
              onClick={toggleSidebar}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600/80 to-emerald-600/80 text-white shadow-lg transition-all hover:from-blue-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
              aria-label="Toggle navigation menu"
              aria-expanded={isSidebarOpen}
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60" onClick={closeSidebar} aria-hidden="true" />
          <aside className="relative ml-auto flex h-full w-full max-w-xs sm:max-w-sm flex-col border-l border-gray-800 bg-gray-900/95 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800/70">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg" aria-hidden="true">
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
                  <span className="text-base font-semibold text-white">Trade Journal</span>
                  <span className="text-xs text-gray-400">Command center</span>
                </div>
              </div>
              <button
                type="button"
                onClick={closeSidebar}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Navigation</p>
                <nav className="mt-4 space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        item.isActive
                          ? 'bg-gray-800 text-white shadow-lg'
                          : 'text-gray-300 hover:bg-gray-800/70 hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.badge ? (
                        <span className="ml-3 flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-gray-700 px-2 text-xs text-gray-200">
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </nav>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Accounts</p>
                <div className="mt-4">
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

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Trading</p>
                  <div className="mt-4 space-y-3">
                    {isAuthenticated ? (
                      <button
                        type="button"
                        onClick={handleToggleTradeForm}
                        aria-pressed={Boolean(showTradeForm)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-500 hover:to-emerald-500"
                      >
                        <Plus className="h-5 w-5" />
                        {showTradeForm ? 'Hide Trade Form' : 'Add New Trade'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSignInClick}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-800 px-4 py-3 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-700"
                      >
                        <LogIn className="h-4 w-4" />
                        Sign in to add trades
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={isAuthenticated ? handleToggleSettings : handleSignInClick}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-800 px-4 py-3 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-700"
                    >
                      <Settings className="h-4 w-4" />
                      {isAuthenticated ? 'Settings' : 'Sign in to manage settings'}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Notifications</p>
                  <button
                    type="button"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-800 px-4 py-3 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-700"
                  >
                    <Bell className="h-4 w-4" />
                    Notification center
                  </button>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Authentication</p>
                  <div className="mt-4 space-y-3">
                    {isAuthenticated ? (
                      <>
                        <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 text-sm font-semibold text-white">
                            {user?.email?.charAt(0)?.toUpperCase() || 'TJ'}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-white truncate">{user?.email}</span>
                            <span className="text-xs text-gray-400">Signed in</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleSignOutClick}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-800 px-4 py-3 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-700"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSignInClick}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-500 hover:to-emerald-500"
                      >
                        <LogIn className="h-5 w-5" />
                        Sign In
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
};

export default Header;
