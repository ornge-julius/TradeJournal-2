import React, { useEffect, useRef, useState } from 'react';
import {
  Settings,
  Plus,
  LogIn,
  LogOut,
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
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

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
    { label: 'Dashboard', icon: LayoutDashboard, isActive: true },
    { label: 'Accounts', icon: Wallet, isActive: false },
    { label: 'Performance', icon: BarChart3, isActive: false },
    { label: 'Settings', icon: Settings, isActive: false }
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

          <div className="relative flex items-center gap-2 sm:gap-3">
            <GlobalDateFilter variant="navbar" />

            <button
              type="button"
              onClick={toggleMenu}
              ref={menuButtonRef}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600/80 to-emerald-600/80 text-white shadow-lg transition-all hover:from-blue-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 top-[calc(100%+0.75rem)] w-[min(20rem,calc(100vw-2rem))] sm:w-80"
              >
                <div className="rounded-2xl border border-gray-800 bg-gray-900/95 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800/70">
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
                        <span className="text-base font-semibold text-white">Trade Journal</span>
                        <span className="text-xs text-gray-400">Command center</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={closeMenu}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                      aria-label="Close navigation menu"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="px-5 py-4 max-h-[min(75vh,28rem)] overflow-y-auto space-y-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Navigation</p>
                      <nav className="mt-4 space-y-1">
                        {navItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.label}
                              type="button"
                              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                item.isActive
                                  ? 'bg-gray-800 text-white shadow-lg'
                                  : 'text-gray-300 hover:bg-gray-800/70 hover:text-white'
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                              <span>{item.label}</span>
                            </button>
                          );
                        })}
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
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
