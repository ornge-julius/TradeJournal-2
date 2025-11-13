import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import TagBadge from './TagBadge';

const TagSelector = ({
  tags = [],
  selectedTagIds = [],
  onChange,
  disabled = false,
  loading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id));
  const availableTags = tags.filter(
    (tag) =>
      !selectedTagIds.includes(tag.id) &&
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  const handleTagToggle = (tagId) => {
    if (!onChange) return;

    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  const handleRemoveTag = (tagId) => {
    if (!onChange) return;
    onChange(selectedTagIds.filter((id) => id !== tagId));
  };

  const handleToggleDropdown = () => {
    if (disabled || loading) {
      return;
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Tags
      </label>

      <div
        onClick={handleToggleDropdown}
        className={`w-full min-h-[48px] bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 flex flex-wrap items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        role="button"
        tabIndex={0}
      >
        {loading ? (
          <span className="text-gray-500 dark:text-gray-400 text-sm">Loading tags...</span>
        ) : selectedTags.length > 0 ? (
          selectedTags.map((tag) => (
            <TagBadge
              key={tag.id}
              tag={tag}
              onRemove={handleRemoveTag}
              showRemove={!disabled}
              size="small"
            />
          ))
        ) : (
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {tags.length === 0 ? 'No tags available' : 'Select tags...'}
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 ml-auto text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {isOpen && !disabled && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search tags..."
                className="w-full pl-8 pr-8 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="p-2">
            {availableTags.length > 0 ? (
              availableTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.id)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <TagBadge tag={tag} size="small" />
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                {searchQuery ? 'No tags found' : 'No available tags'}
              </div>
            )}
          </div>

          {tags.length === 0 && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <a
                href="/tags"
                className="block px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                Create your first tag
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagSelector;
