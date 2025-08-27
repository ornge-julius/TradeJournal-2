import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AccountEditForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  account 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    startingBalance: '',
    currentBalance: ''
  });

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name || '',
        startingBalance: account.startingBalance || '',
        currentBalance: account.currentBalance || ''
      });
    }
  }, [account]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.startingBalance && formData.currentBalance) {
      onSubmit({
        ...account,
        name: formData.name.trim(),
        startingBalance: parseFloat(formData.startingBalance),
        currentBalance: parseFloat(formData.currentBalance)
      });
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Edit Account</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Account Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Enter account name"
              required
            />
          </div>

          <div>
            <label htmlFor="startingBalance" className="block text-sm font-medium text-gray-300 mb-2">
              Starting Balance
            </label>
            <input
              type="number"
              id="startingBalance"
              name="startingBalance"
              value={formData.startingBalance}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label htmlFor="currentBalance" className="block text-sm font-medium text-gray-300 mb-2">
              Current Balance
            </label>
            <input
              type="number"
              id="currentBalance"
              name="currentBalance"
              value={formData.currentBalance}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountEditForm;
