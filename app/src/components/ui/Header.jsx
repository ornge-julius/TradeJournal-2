import React from 'react';
import { Settings, Plus } from 'lucide-react';
import AccountSelector from './AccountSelector';

const Header = ({ 
  onToggleSettings, 
  onToggleTradeForm, 
  showTradeForm,
  accounts,
  selectedAccountId,
  onSelectAccount,
  onAddAccount,
  onEditAccount,
  onDeleteAccount
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Trading Journal
          </h1>
          <p className="text-gray-400">Track your trades and analyze your performance</p>
        </div>
        
        {/* Account Selector - positioned between title and action buttons */}
        <div className="flex-1 flex justify-center">
          <AccountSelector
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onSelectAccount={onSelectAccount}
            onAddAccount={onAddAccount}
            onEditAccount={onEditAccount}
            onDeleteAccount={onDeleteAccount}
          />
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={onToggleTradeForm}
            className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            {showTradeForm ? 'Cancel' : 'Add New Trade'}
          </button>
          <button
            onClick={onToggleSettings}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
