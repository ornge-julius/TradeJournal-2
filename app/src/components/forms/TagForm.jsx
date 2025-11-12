import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TagForm = ({ isOpen, onClose, onSubmit, editingTag }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTag) {
      setFormData({
        name: editingTag.name || '',
        color: editingTag.color || ''
      });
    } else {
      setFormData({ name: '', color: '' });
    }
    setErrors({});
  }, [editingTag, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Tag name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({ name: '', color: '' });
      setErrors({});
    } catch (err) {
      if (err.message.includes('unique') || err.message.includes('duplicate')) {
        setErrors({ name: 'A tag with this name already exists' });
      } else {
        setErrors({ name: 'An error occurred. Please try again.' });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
          {editingTag ? 'Edit Tag' : 'Create New Tag'}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tag Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              className={`w-full bg-white dark:bg-gray-700 border rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-blue-500'
              }`}
              placeholder="e.g., Options, Swing Trade, Day Trade"
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color (Optional)
            </label>
            <input
              type="color"
              value={formData.color || '#3B82F6'}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full h-12 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-medium transition-colors flex-1 text-white"
            >
              {editingTag ? 'Update Tag' : 'Create Tag'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 px-4 py-3 rounded-lg font-medium transition-colors text-gray-900 dark:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TagForm;

