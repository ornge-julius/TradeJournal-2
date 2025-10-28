import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { getResultNumber, getTradeTypeNumber } from '../../utils/calculations';
import ConfirmModal from '../ui/ConfirmModal';

const TradeForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingTrade, 
  onCancel,
  onDelete 
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    symbol: '',
    position_type: getTradeTypeNumber('CALL'),
    entry_price: '',
    exit_price: '',
    quantity: '',
    entry_date: '',
    exit_date: '',
    notes: '',
    reasoning: '',  // changed from reason to reasoning
    result: getResultNumber('WIN'),
    option: '',
    source: ''
  });

  useEffect(() => {
    if (editingTrade) {
      setFormData({
        ...editingTrade,
        entry_price: editingTrade.entry_price.toString(),
        exit_price: editingTrade.exit_price.toString(),
        quantity: editingTrade.quantity.toString()
      });
    } else {
      setFormData({
        symbol: '',
        position_type: getTradeTypeNumber('CALL'),
        entry_price: '',
        exit_price: '',
        quantity: '',
        entry_date: '',
        exit_date: '',
        notes: '',
        reasoning: '',  // changed from reason to reasoning
        result: getResultNumber('WIN'),
        option: '',
        source: ''
      });
    }
    setErrors({}); // Clear errors when form changes
  }, [editingTrade]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.symbol.trim()) newErrors.symbol = true;
    if (!formData.entry_price) newErrors.entry_price = true;
    if (!formData.exit_price) newErrors.exit_price = true;
    if (!formData.quantity) newErrors.quantity = true;
    if (!formData.entry_date) newErrors.entry_date = true;
    if (!formData.exit_date) newErrors.exit_date = true;
    if (!formData.reasoning.trim()) newErrors.reasoning = true;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form and return early if validation fails
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      setErrors({}); // Clear errors on successful submission
    } catch (err) {
      console.error('Error submitting trade form:', err);
    }
  };

  const handleCancel = () => {
    setErrors({}); // Clear errors on cancel
    if (editingTrade) {
      onCancel();
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-200">
          {editingTrade ? 'Edit Trade' : 'Add New Trade'}
        </h3>
        <button 
          onClick={handleCancel}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Symbol</label>
            <input
              type="text"
              placeholder="e.g., AAPL"
              value={formData.symbol}
              onChange={(e) => {
                setFormData({...formData, symbol: e.target.value.toUpperCase()});
                if (errors.symbol) setErrors({...errors, symbol: false});
              }}
              className={`w-full bg-gray-700 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none ${
                errors.symbol 
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                  : 'border-gray-600 focus:ring-2 focus:ring-blue-500'
              }`}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Position Type</label>
            <select
              value={formData.position_type}
              onChange={(e) => setFormData({...formData, position_type: parseInt(e.target.value)})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={getTradeTypeNumber('CALL')}>CALL</option>
              <option value={getTradeTypeNumber('PUT')}>PUT</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Option Contract</label>
            <input
              type="text"
              placeholder="e.g., AAPL 08/18 $150 Call"
              value={formData.option}
              onChange={(e) => setFormData({...formData, option: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Entry Price</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.entry_price}
              onChange={(e) => {
                setFormData({...formData, entry_price: e.target.value});
                if (errors.entry_price) setErrors({...errors, entry_price: false});
              }}
              className={`w-full bg-gray-700 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none ${
                errors.entry_price 
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                  : 'border-gray-600 focus:ring-2 focus:ring-blue-500'
              }`}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Exit Price</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.exit_price}
              onChange={(e) => {
                setFormData({...formData, exit_price: e.target.value});
                if (errors.exit_price) setErrors({...errors, exit_price: false});
              }}
              className={`w-full bg-gray-700 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none ${
                errors.exit_price 
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                  : 'border-gray-600 focus:ring-2 focus:ring-blue-500'
              }`}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
            <input
              type="number"
              placeholder="0"
              value={formData.quantity}
              onChange={(e) => {
                setFormData({...formData, quantity: e.target.value});
                if (errors.quantity) setErrors({...errors, quantity: false});
              }}
              className={`w-full bg-gray-700 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none ${
                errors.quantity 
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                  : 'border-gray-600 focus:ring-2 focus:ring-blue-500'
              }`}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Entry Date</label>
            <input
              type="date"
              value={formData.entry_date}
              onChange={(e) => {
                setFormData({...formData, entry_date: e.target.value});
                if (errors.entry_date) setErrors({...errors, entry_date: false});
              }}
              className={`w-full bg-gray-700 border rounded-lg px-4 py-3 text-white focus:outline-none ${
                errors.entry_date 
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                  : 'border-gray-600 focus:ring-2 focus:ring-blue-500'
              }`}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Exit Date</label>
            <input
              type="date"
              value={formData.exit_date}
              onChange={(e) => {
                setFormData({...formData, exit_date: e.target.value});
                if (errors.exit_date) setErrors({...errors, exit_date: false});
              }}
              className={`w-full bg-gray-700 border rounded-lg px-4 py-3 text-white focus:outline-none ${
                errors.exit_date 
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                  : 'border-gray-600 focus:ring-2 focus:ring-blue-500'
              }`}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Source</label>
            <input
              type="text"
              placeholder="e.g., TradingView, Discord"
              value={formData.source}
              onChange={(e) => setFormData({...formData, source: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Reason for Trade</label>
            <input
              type="text"
              placeholder="Why did you enter this trade?"
              value={formData.reasoning}
              onChange={(e) => {
                setFormData({...formData, reasoning: e.target.value});
                if (errors.reasoning) setErrors({...errors, reasoning: false});
              }}
              className={`w-full bg-gray-700 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none ${
                errors.reasoning 
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                  : 'border-gray-600 focus:ring-2 focus:ring-blue-500'
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Trade Result</label>
            <select
              value={formData.result}
              onChange={(e) => setFormData({...formData, result: parseInt(e.target.value)})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select result</option>
              <option value={1}>WIN</option>
              <option value={0}>LOSS</option>
            </select>
          </div>
          
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-300 mb-2">Additional Notes</label>
            <textarea
              placeholder="Any additional thoughts or observations..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
            />
          </div>
          
          <div className="flex gap-2 md:col-span-3">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-medium transition-colors flex-1"
            >
              {editingTrade ? 'Update Trade' : 'Add Trade'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            {editingTrade && onDelete && (
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            )}
          </div>
        </div>
      </form>
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (onDelete && editingTrade) {
            await onDelete(editingTrade.id);
            setShowDeleteModal(false);
          }
        }}
        title="Delete Trade"
        message={`Are you sure you want to delete this trade? This action cannot be undone.`}
        confirmText="Delete Trade"
        cancelText="Cancel"
        confirmButtonColor="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default TradeForm;
