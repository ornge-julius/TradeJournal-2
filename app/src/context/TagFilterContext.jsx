import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'dashboardTagFilter';

const sanitizeTagIds = (tagIds) => {
  if (!Array.isArray(tagIds)) {
    return [];
  }

  const unique = new Set();

  tagIds.forEach((value) => {
    if (value === null || value === undefined) {
      return;
    }

    const normalized = String(value);
    if (normalized.trim() !== '') {
      unique.add(normalized);
    }
  });

  return Array.from(unique);
};

const readSelectedTagsFromStorage = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue);
    return sanitizeTagIds(parsed);
  } catch (error) {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    return [];
  }
};

const persistSelectedTags = (tagIds) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (!tagIds || tagIds.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tagIds));
  } catch (error) {
    // Ignore storage errors
  }
};

const TagFilterContext = createContext(null);

export const TagFilterProvider = ({ children }) => {
  const [selectedTagIds, setSelectedTagIds] = useState(() => readSelectedTagsFromStorage());

  useEffect(() => {
    persistSelectedTags(selectedTagIds);
  }, [selectedTagIds]);

  const setTags = useCallback((tagIds) => {
    setSelectedTagIds(sanitizeTagIds(tagIds));
  }, []);

  const addTag = useCallback((tagId) => {
    if (tagId === null || tagId === undefined) {
      return;
    }

    const normalized = String(tagId);
    setSelectedTagIds((current) => {
      if (current.includes(normalized)) {
        return current;
      }
      return [...current, normalized];
    });
  }, []);

  const removeTag = useCallback((tagId) => {
    if (tagId === null || tagId === undefined) {
      return;
    }

    const normalized = String(tagId);
    setSelectedTagIds((current) => current.filter((value) => value !== normalized));
  }, []);

  const toggleTag = useCallback((tagId) => {
    if (tagId === null || tagId === undefined) {
      return;
    }

    const normalized = String(tagId);
    setSelectedTagIds((current) => {
      if (current.includes(normalized)) {
        return current.filter((value) => value !== normalized);
      }
      return [...current, normalized];
    });
  }, []);

  const clearTags = useCallback(() => {
    setSelectedTagIds([]);
  }, []);

  const value = useMemo(() => ({
    selectedTagIds,
    hasActiveFilters: selectedTagIds.length > 0,
    setTags,
    addTag,
    removeTag,
    toggleTag,
    clearTags
  }), [selectedTagIds, setTags, addTag, removeTag, toggleTag, clearTags]);

  return (
    <TagFilterContext.Provider value={value}>
      {children}
    </TagFilterContext.Provider>
  );
};

export const useTagFilter = () => {
  const context = useContext(TagFilterContext);
  if (!context) {
    throw new Error('useTagFilter must be used within a TagFilterProvider');
  }
  return context;
};

export const filterTradesByTags = (trades, selectedTagIds) => {
  if (!Array.isArray(trades) || trades.length === 0) {
    return [];
  }

  if (!Array.isArray(selectedTagIds) || selectedTagIds.length === 0) {
    return trades;
  }

  const selectedSet = new Set(selectedTagIds.map((value) => String(value)));

  return trades.filter((trade) => {
    if (!trade || !Array.isArray(trade.tags) || trade.tags.length === 0) {
      return false;
    }

    return trade.tags.some((tag) => {
      if (!tag || tag.id === null || tag.id === undefined) {
        return false;
      }
      return selectedSet.has(String(tag.id));
    });
  });
};

export const getSelectedTagsFromTrades = (trades, selectedTagIds) => {
  if (!Array.isArray(trades) || trades.length === 0) {
    return [];
  }

  if (!Array.isArray(selectedTagIds) || selectedTagIds.length === 0) {
    return [];
  }

  const selectedSet = new Set(selectedTagIds.map((value) => String(value)));
  const uniqueTags = new Map();

  trades.forEach((trade) => {
    (trade?.tags || []).forEach((tag) => {
      if (!tag || tag.id === null || tag.id === undefined) {
        return;
      }

      const id = String(tag.id);
      if (selectedSet.has(id) && !uniqueTags.has(id)) {
        uniqueTags.set(id, tag);
      }
    });
  });

  return Array.from(uniqueTags.values());
};

export default TagFilterContext;
