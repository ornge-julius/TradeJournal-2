import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Filter, Search, Tag as TagIcon } from 'lucide-react';
import TagBadge from './TagBadge';
import { useTagFilter } from '../../context/TagFilterContext';

const variantClasses = {
  default: {
    container: 'w-full max-w-xs',
    button: 'w-full flex items-center justify-between gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-all',
    dropdown: 'absolute mt-2 w-72 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl z-20',
    badgeContainer: 'mt-2 flex flex-wrap gap-2'
  },
  navbar: {
    container: 'relative w-full sm:w-auto',
    button: 'flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/70 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-white dark:hover:bg-gray-800 transition-all',
    dropdown: 'absolute right-0 mt-3 w-72 sm:w-80 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl z-30',
    badgeContainer: 'mt-2 flex flex-wrap gap-2 max-w-sm'
  }
};

const TagFilter = ({ availableTags = [], variant = 'default' }) => {
  const { selectedTagIds, toggleTag, clearTags, removeTag, hasActiveFilters } = useTagFilter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  const variantConfig = variantClasses[variant] || variantClasses.default;

  const availableTagIds = useMemo(() => {
    return new Set((availableTags || []).map((tag) => String(tag?.id)));
  }, [availableTags]);

  useEffect(() => {
    if (!hasActiveFilters) {
      return;
    }

    let changed = false;
    selectedTagIds.forEach((id) => {
      if (!availableTagIds.has(String(id))) {
        removeTag(id);
        changed = true;
      }
    });

    if (changed) {
      setSearchQuery('');
    }
  }, [availableTagIds, hasActiveFilters, removeTag, selectedTagIds]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !searchInputRef.current) {
      return;
    }

    const timeoutId = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  const selectedSet = useMemo(() => new Set(selectedTagIds.map((id) => String(id))), [selectedTagIds]);

  const selectedTags = useMemo(() => {
    if (!availableTags || availableTags.length === 0) {
      return [];
    }

    return availableTags.filter((tag) => selectedSet.has(String(tag?.id)));
  }, [availableTags, selectedSet]);

  const filteredTags = useMemo(() => {
    if (!searchQuery) {
      return availableTags;
    }

    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) {
      return availableTags;
    }

    return availableTags.filter((tag) => tag?.name?.toLowerCase().includes(normalized));
  }, [availableTags, searchQuery]);

  const toggleDropdown = () => {
    setIsOpen((current) => !current);
    setSearchQuery('');
  };

  const handleClearFilters = () => {
    clearTags();
    setSearchQuery('');
    setIsOpen(false);
  };

  const hasTagsAvailable = availableTags && availableTags.length > 0;

  return (
    <div className={variantConfig.container} ref={containerRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className={variantConfig.button}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <span className="flex items-center gap-2">
          <TagIcon className="h-4 w-4" />
          <span>Tags</span>
        </span>
        {hasActiveFilters ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs font-semibold">
            <Filter className="h-3 w-3" />
            {selectedTagIds.length}
          </span>
        ) : (
          <ChevronIndicator isOpen={isOpen} />
        )}
      </button>

      {selectedTags.length > 0 && (
        <div className={`${variantConfig.badgeContainer} mt-2`}>
          {selectedTags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} size="small" showRemove onRemove={removeTag} />
          ))}
        </div>
      )}

      {isOpen && (
        <div className={variantConfig.dropdown} role="dialog" aria-label="Tag filter">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                <Filter className="h-4 w-4" />
                <span>Filter by tags</span>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-500"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search tags..."
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
              />
            </div>

            <div className="max-h-60 overflow-y-auto rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
              {hasTagsAvailable ? (
                filteredTags.length > 0 ? (
                  filteredTags.map((tag) => {
                    const id = tag?.id;
                    const isSelected = selectedSet.has(String(id));

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleTag(id)}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between gap-3 transition-colors ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-200 font-semibold'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <span className="truncate">{tag?.name}</span>
                        {isSelected && <Check className="h-4 w-4" />}
                      </button>
                    );
                  })
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>No tags found for "{searchQuery}"</p>
                  </div>
                )
              ) : (
                <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400 space-y-2">
                  <p>No tags available yet.</p>
                  <a
                    className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-500 font-medium"
                    href="/tags"
                  >
                    <TagIcon className="h-4 w-4" />
                    Manage tags
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ChevronIndicator = ({ isOpen }) => (
  <svg
    className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
      clipRule="evenodd"
    />
  </svg>
);

export default TagFilter;
