import React, { useEffect, useState, useRef } from 'react';
import { Tag, ChevronDown, Search, X } from 'lucide-react';
import { Switch, FormControlLabel } from '@mui/material';
import { useTagFilter } from '../../context/TagFilterContext';
import { useTagManagement } from '../../hooks/useTagManagement';
import TagBadge from './TagBadge';

const GlobalTagFilter = ({ variant = 'default' }) => {
  const { selectedTagIds, filterMode, setSelectedTags, addTag, removeTag, clearTags, setMode, FILTER_MODES } = useTagFilter();
  const { tags, loading } = useTagManagement();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const isAndMode = filterMode === FILTER_MODES.AND;

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

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Remove tags that no longer exist
  useEffect(() => {
    if (tags.length > 0 && selectedTagIds.length > 0) {
      const validTagIds = tags.map(tag => tag.id);
      const invalidTagIds = selectedTagIds.filter(id => !validTagIds.includes(id));
      
      if (invalidTagIds.length > 0) {
        const updatedTagIds = selectedTagIds.filter(id => validTagIds.includes(id));
        setSelectedTags(updatedTagIds);
      }
    }
  }, [tags, selectedTagIds, setSelectedTags]);

  const handleTagToggle = (tagId) => {
    if (selectedTagIds.includes(tagId)) {
      removeTag(tagId);
    } else {
      addTag(tagId);
    }
  };

  const handleRemoveTag = (tagId) => {
    removeTag(tagId);
  };

  const isNavbarVariant = variant === 'navbar';
  const buttonAriaLabel = isNavbarVariant ? 'Open tag filter' : undefined;
  const dropdownAlignment = isNavbarVariant ? 'right-0' : 'right-0';
  const hasSelectedTags = selectedTagIds.length > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={buttonAriaLabel}
        aria-expanded={isOpen}
        className={`flex items-center gap-2 rounded-xl transition-colors shadow-lg hover:shadow-xl text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 ${
          isNavbarVariant
            ? 'bg-white dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-700/80 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-white dark:supports-[backdrop-filter]:bg-gray-800/60 border border-gray-200 dark:border-gray-700'
            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 border border-gray-200 dark:border-gray-700'
        } ${hasSelectedTags ? 'ring-2 ring-emerald-500/50' : ''}`}
      >
        <Tag className="h-4 w-4" />
        <span
          className={`text-sm font-medium ${
            isNavbarVariant ? 'hidden sm:inline' : ''
          }`}
        >
          Tag filter
        </span>
        {hasSelectedTags && (
          <span className={`text-xs font-semibold bg-emerald-500 text-white rounded-full px-2 py-0.5 ${
            isNavbarVariant ? 'hidden sm:inline-block' : ''
          }`}>
            {selectedTagIds.length}
          </span>
        )}
        {isNavbarVariant && (
          <span className="sr-only sm:hidden">Tag filter</span>
        )}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''} ${
            isNavbarVariant ? 'hidden sm:block' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute ${dropdownAlignment} top-full mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 p-4`}
          style={{
            maxWidth: 'min(320px, calc(100vw - 1rem))',
          }}
        >
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search tags..."
                className="w-full pl-8 pr-8 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

          {/* Filter Mode Switch */}
          <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <FormControlLabel
              control={
                <Switch
                  checked={isAndMode}
                  onChange={(event) => {
                    setMode(event.target.checked ? FILTER_MODES.AND : FILTER_MODES.OR);
                  }}
                  size="small"
                  color="primary"
                  disabled={selectedTagIds.length === 0}
                />
              }
              label={
                <span className={`text-sm ${selectedTagIds.length === 0 ? 'text-gray-400 dark:text-gray-600' : 'text-gray-900 dark:text-gray-200'}`}>
                  {isAndMode ? 'AND' : 'OR'}
                </span>
              }
              className="m-0"
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '0.875rem',
                  fontWeight: 500,
                },
              }}
            />
            <p className={`text-xs mt-1 ml-14 ${selectedTagIds.length === 0 ? 'text-gray-400 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>
              {selectedTagIds.length === 0
                ? 'Select tags to filter'
                : isAndMode
                  ? 'Show trades with ALL selected tags'
                  : 'Show trades with ANY selected tag'}
            </p>
          </div>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Selected ({selectedTags.length})
                </span>
                <button
                  type="button"
                  onClick={clearTags}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <TagBadge
                    key={tag.id}
                    tag={tag}
                    onRemove={handleRemoveTag}
                    showRemove={true}
                    size="small"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Available Tags */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 block">
              {selectedTags.length > 0 ? 'Available Tags' : 'Tags'}
            </span>
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                Loading tags...
              </div>
            ) : availableTags.length > 0 ? (
              <div className="max-h-60 overflow-y-auto">
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                  >
                    <TagBadge tag={tag} size="small" />
                  </button>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                No tags found
              </div>
            ) : tags.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                <p className="mb-2">No tags available</p>
                <a
                  href="/tags"
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  Create your first tag
                </a>
              </div>
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                All tags selected
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalTagFilter;

