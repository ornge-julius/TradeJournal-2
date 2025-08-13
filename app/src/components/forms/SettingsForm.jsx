import React, { useState } from 'react';

const SettingsForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  currentBalance 
}) => {
  const [balance, setBalance] = useState(currentBalance);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(balance);
  };

  if (!isOpen) return null;

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-200">Account Settings</h3>
      <form onSubmit={handleSubmit}>
        <div className="flex items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Starting Account Balance</label>
            <input
              type="number"
              step="0.01"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="50000"
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SettingsForm;
