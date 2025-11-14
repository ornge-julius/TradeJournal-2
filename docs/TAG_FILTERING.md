# Tag Filtering Implementation

## Problem Statement

Users need the ability to filter trades by tags to quickly find trades that match specific criteria. This is a critical feature for organizing and analyzing trading data. The implementation needs to consider the best UX approach: should tag filtering be a global filter that affects all trade views, or should it be a feature specific to a dedicated filtered view?

This document explores both approaches and recommends the best solution based on the application's current architecture and user needs.

## Current Implementation

The current application includes:
- Dashboard view showing all trades with metrics and charts
- Batch comparison view for comparing trade batches
- Trade history table displaying trades
- Date filtering via `DateFilterContext` (global filter affecting all views)
- Tag associations exist (see `TRADE_TAG_ASSOCIATION_UI.md`)
- No tag filtering functionality exists

The `DateFilterContext` provides a global date filter that affects:
- Dashboard metrics calculations
- Charts data
- Trade history table
- Batch comparison view

## Requirements Analysis

### User Needs

1. **Filter by Single Tag**
   - Users should be able to select a tag and see only trades with that tag
   - Should work across all views (dashboard, table, charts)

2. **Filter by Multiple Tags**
   - Users should be able to select multiple tags
   - Need to decide: AND logic (trades with ALL selected tags) or OR logic (trades with ANY selected tags)
   - Recommendation: OR logic (trades with ANY selected tag) is more intuitive for most use cases

3. **Clear Filters**
   - Users should be able to easily clear tag filters
   - Should be able to see active filters

4. **Filter Persistence**
   - Should tag filters persist when navigating between views?
   - Should they persist across page refreshes? (probably not, but could be optional)

5. **Integration with Date Filters**
   - Tag filters should work in combination with date filters
   - Both filters should apply simultaneously

### UX Approach Options

#### Option 1: Global Tag Filter (Recommended)
**Similar to DateFilterContext**

Pros:
- Consistent with existing date filter pattern
- Filters apply to all views automatically
- Simple mental model for users
- Easy to implement using existing context pattern

Cons:
- May be too aggressive (filters everything)
- Less flexibility for different views

**Implementation:**
- Create `TagFilterContext` similar to `DateFilterContext`
- Add tag filter UI to Header (near date filter)
- Filter applies to all trade data automatically

#### Option 2: Dedicated Filtered View
**New route like `/trades?tags=tag1,tag2`**

Pros:
- More flexible (can have different views with different filters)
- Doesn't affect main dashboard unless user navigates to filtered view
- Can have multiple filtered views open in different tabs

Cons:
- More complex to implement
- Requires new route and view component
- Users need to navigate to see filtered results
- Less discoverable

#### Option 3: Hybrid Approach
**Global filter with option to disable per view**

Pros:
- Most flexible
- Best of both worlds

Cons:
- Most complex to implement
- May be confusing for users
- Over-engineered for current needs

### Recommendation: Option 1 (Global Tag Filter)

Based on the existing architecture and user needs, **Option 1 (Global Tag Filter)** is recommended because:
1. It matches the existing date filter pattern
2. Users are already familiar with global filters
3. Simpler to implement and maintain
4. Provides consistent UX across the application
5. Tag filtering is likely to be used frequently, so making it global makes sense

## Requirements

### Functional Requirements

1. **Tag Filter Context**
   - Create `TagFilterContext` similar to `DateFilterContext`
   - Manage selected tag IDs state
   - Provide filter functions to child components
   - Persist filter state during session (optional: localStorage)

2. **Tag Filter UI Component**
   - Create `TagFilter.jsx` component
   - Display selected tags as removable badges
   - Provide dropdown/picker to select tags
   - Show "Clear filters" button when tags are selected
   - Should be placed in Header near date filter

3. **Filter Logic**
   - Filter trades to show only those with at least one selected tag (OR logic)
   - When no tags are selected, show all trades (no filtering)
   - Filter should work in combination with date filter
   - Filter should apply to:
     - Trade history table
     - Dashboard metrics calculations
     - Charts data
     - Batch comparison view

4. **Filter Application**
   - Filter should be applied to trade data before calculations
   - Metrics should reflect filtered trades
   - Charts should show filtered data
   - Table should show filtered trades

5. **Empty State**
   - Show message when no trades match selected tags
   - Provide option to clear filters

### Design Requirements

1. **UI Placement**
   - Tag filter should be in Header component
   - Should be near the date filter for consistency
   - Should be visually distinct but cohesive

2. **Tag Display**
   - Selected tags should be shown as badges/chips
   - Should match tag colors (if set)
   - Should be removable with X button
   - Should show count of selected tags

3. **Filter Picker**
   - Dropdown or popover to select tags
   - Should show all available tags
   - Should indicate which tags are selected
   - Should support search if user has many tags

4. **Visual Feedback**
   - Clear indication when filters are active
   - Show number of trades matching filters
   - Highlight filtered state

### Technical Requirements

1. **Context Implementation**
   - Create `TagFilterContext.jsx` in `app/src/context/`
   - Use React Context API
   - Provide `selectedTagIds`, `setSelectedTagIds`, `clearFilters` functions
   - Optional: persist to localStorage

2. **Filter Hook**
   - Create `useTagFilter.js` hook or integrate into existing hooks
   - Filter trades based on selected tag IDs
   - Return filtered trades array

3. **Component Updates**
   - Update `Header.jsx` to include TagFilter component
   - Update `DashboardView.jsx` to use filtered trades
   - Update `TradeHistoryTable.jsx` to use filtered trades
   - Update `TradeBatchComparisonView.jsx` to use filtered trades
   - Update metrics calculations to use filtered trades

4. **Performance**
   - Filtering should be efficient (use useMemo)
   - Should not cause unnecessary re-renders
   - Consider debouncing if needed

## Implementation Approach

### 1. Create Tag Filter Context

```javascript
// app/src/context/TagFilterContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const TagFilterContext = createContext();

export const TagFilterProvider = ({ children }) => {
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tagFilter');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSelectedTagIds(parsed);
      } catch (e) {
        // Invalid data, ignore
      }
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (selectedTagIds.length > 0) {
      localStorage.setItem('tagFilter', JSON.stringify(selectedTagIds));
    } else {
      localStorage.removeItem('tagFilter');
    }
  }, [selectedTagIds]);

  const addTag = (tagId) => {
    if (!selectedTagIds.includes(tagId)) {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  const removeTag = (tagId) => {
    setSelectedTagIds(selectedTagIds.filter(id => id !== tagId));
  };

  const clearFilters = () => {
    setSelectedTagIds([]);
  };

  const value = {
    selectedTagIds,
    setSelectedTagIds,
    addTag,
    removeTag,
    clearFilters,
    hasActiveFilters: selectedTagIds.length > 0
  };

  return (
    <TagFilterContext.Provider value={value}>
      {children}
    </TagFilterContext.Provider>
  );
};

export const useTagFilter = () => {
  const context = useContext(TagFilterContext);
  if (!context) {
    throw new Error('useTagFilter must be used within TagFilterProvider');
  }
  return context;
};
```

### 2. Create Tag Filter Component

```javascript
// app/src/components/ui/TagFilter.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { useTagFilter } from '../../context/TagFilterContext';
import { useTagManagement } from '../../hooks/useTagManagement';
import TagBadge from './TagBadge';

const TagFilter = () => {
  const { selectedTagIds, removeTag, clearFilters, hasActiveFilters } = useTagFilter();
  const { tags, loading } = useTagManagement();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const selectedTags = tags.filter(tag => selectedTagIds.includes(tag.id));
  const availableTags = tags.filter(tag => 
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

  const handleTagToggle = (tagId) => {
    if (selectedTagIds.includes(tagId)) {
      removeTag(tagId);
    } else {
      const { addTag } = useTagFilter();
      addTag(tagId);
    }
  };

  if (loading || tags.length === 0) {
    return null; // Don't show filter if no tags available
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
          hasActiveFilters
            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
        }`}
      >
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">
          {hasActiveFilters ? `${selectedTagIds.length} tag${selectedTagIds.length !== 1 ? 's' : ''}` : 'Filter by tags'}
        </span>
        {hasActiveFilters && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearFilters();
            }}
            className="ml-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded p-0.5"
            title="Clear filters"
          >
            <X className="h-3 w-3" />
          </button>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                Selected Tags
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <TagBadge
                    key={tag.id}
                    tag={tag}
                    onRemove={removeTag}
                    showRemove={true}
                    size="small"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Available Tags */}
          <div className="p-3">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
              Available Tags
            </div>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {availableTags.length > 0 ? (
                availableTags.map(tag => (
                  <button
                    key={tag.id}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default TagFilter;
```

### 3. Create Filter Hook

```javascript
// app/src/hooks/useFilteredTrades.js
import { useMemo } from 'react';
import { useTagFilter } from '../context/TagFilterContext';
import { useDateFilter } from '../context/DateFilterContext';

export const useFilteredTrades = (trades) => {
  const { selectedTagIds } = useTagFilter();
  const { startDate, endDate } = useDateFilter();

  const filteredTrades = useMemo(() => {
    let filtered = [...trades];

    // Apply date filter
    if (startDate || endDate) {
      filtered = filtered.filter(trade => {
        const tradeDate = new Date(trade.exit_date);
        if (startDate && tradeDate < new Date(startDate)) return false;
        if (endDate && tradeDate > new Date(endDate)) return false;
        return true;
      });
    }

    // Apply tag filter
    if (selectedTagIds.length > 0) {
      filtered = filtered.filter(trade => {
        const tradeTagIds = trade.tags?.map(tag => tag.id) || [];
        // OR logic: trade must have at least one selected tag
        return selectedTagIds.some(tagId => tradeTagIds.includes(tagId));
      });
    }

    return filtered;
  }, [trades, selectedTagIds, startDate, endDate]);

  return filteredTrades;
};
```

### 4. Update App.jsx to Include TagFilterProvider

```javascript
// In App.jsx
import { TagFilterProvider } from './context/TagFilterContext';

// Wrap AppContent with TagFilterProvider
function App() {
  return (
    <ThemeProvider>
      <TagFilterProvider>
        <BrowserRouter>
          <AppContent />
          <SpeedInsights />
          <Analytics />
        </BrowserRouter>
      </TagFilterProvider>
    </ThemeProvider>
  );
}
```

### 5. Update Header.jsx to Include TagFilter

```javascript
// In Header.jsx
import TagFilter from './TagFilter';

// Add TagFilter component near GlobalDateFilter
<div className="relative flex items-center gap-2 sm:gap-3">
  <GlobalDateFilter variant="navbar" />
  <TagFilter />
  {/* ... rest of header */}
</div>
```

### 6. Update DashboardView to Use Filtered Trades

```javascript
// In DashboardView.jsx
import { useFilteredTrades } from '../../hooks/useFilteredTrades';

const DashboardView = ({ trades, startingBalance, onViewTrade }) => {
  const filteredTrades = useFilteredTrades(trades);
  
  // Use filteredTrades instead of trades for all calculations and displays
  const metrics = useMemo(() => {
    return calculateMetrics(filteredTrades, startingBalance);
  }, [filteredTrades, startingBalance]);

  // ... rest of component uses filteredTrades
};
```

### 7. Update Other Views Similarly

- Update `TradeHistoryTable` to use filtered trades
- Update `TradeBatchComparisonView` to use filtered trades
- Update any other components that display trades

## Implementation Steps

1. **Create Tag Filter Context**
   - Create `TagFilterContext.jsx`
   - Implement state management
   - Add localStorage persistence (optional)

2. **Create Tag Filter Component**
   - Create `TagFilter.jsx` component
   - Implement dropdown/picker UI
   - Handle tag selection/deselection

3. **Create Filter Hook**
   - Create `useFilteredTrades.js` hook
   - Combine tag and date filters
   - Return filtered trades

4. **Update App.jsx**
   - Add `TagFilterProvider` to component tree
   - Wrap around existing providers

5. **Update Header.jsx**
   - Add `TagFilter` component
   - Place near date filter

6. **Update All Trade Views**
   - Update `DashboardView` to use filtered trades
   - Update `TradeHistoryTable` to use filtered trades
   - Update `TradeBatchComparisonView` to use filtered trades
   - Update metrics calculations

7. **Test Functionality**
   - Test filtering by single tag
   - Test filtering by multiple tags
   - Test clearing filters
   - Test combination with date filters
   - Test empty states
   - Test with trades that have no tags

## Files to Create/Modify

1. **New Files**
   - `app/src/context/TagFilterContext.jsx` - Tag filter context
   - `app/src/components/ui/TagFilter.jsx` - Tag filter UI component
   - `app/src/hooks/useFilteredTrades.js` - Hook to combine filters

2. **Files to Modify**
   - `app/src/App.jsx` - Add TagFilterProvider
   - `app/src/components/ui/Header.jsx` - Add TagFilter component
   - `app/src/components/views/DashboardView.jsx` - Use filtered trades
   - `app/src/components/tables/TradeHistoryTable.jsx` - Use filtered trades
   - `app/src/components/views/TradeBatchComparisonView.jsx` - Use filtered trades

## Dependencies and Prerequisites

1. **Tag System**
   - `TAG_SCHEMA_UPDATE.md` must be completed
   - `TAG_MANAGEMENT_PAGE.md` should be completed
   - `TRADE_TAG_ASSOCIATION_UI.md` must be completed
   - Tags must be associated with trades

2. **Existing Context**
   - `DateFilterContext` should exist (for reference)
   - Context pattern should be understood

3. **Components**
   - `TagBadge` component should exist
   - `useTagManagement` hook should exist

## Acceptance Criteria

- ✅ Tag filter context is created and functional
- ✅ Tag filter UI is displayed in Header
- ✅ Users can select multiple tags to filter by
- ✅ Selected tags are displayed as removable badges
- ✅ Filter applies to all trade views (dashboard, table, charts)
- ✅ Filter works in combination with date filter
- ✅ Metrics reflect filtered trades
- ✅ Charts show filtered data
- ✅ Table shows filtered trades
- ✅ Users can clear tag filters
- ✅ Empty state is shown when no trades match filters
- ✅ Filter state persists during session (optional: localStorage)
- ✅ UI matches application design system
- ✅ Filter is responsive on mobile devices

## Edge Cases

1. **No Tags Selected**
   - Show all trades (no filtering)
   - Filter UI should indicate no active filters

2. **No Trades Match Filters**
   - Show empty state message
   - Provide option to clear filters
   - Metrics should show zeros/defaults

3. **Trades with No Tags**
   - Trades without tags won't match any tag filter
   - This is expected behavior

4. **Tag Deleted While Filtered**
   - Handle case where filtered tag is deleted
   - Remove tag from filter automatically
   - Show message to user

5. **Many Selected Tags**
   - UI should handle many selected tags gracefully
   - Consider scrolling or compact display

6. **Combination with Date Filter**
   - Both filters should work together
   - Trades must match both date range AND have selected tags

## Notes

- OR logic (trades with ANY selected tag) is recommended over AND logic
- Consider adding AND/OR toggle in future if needed
- Filter persistence in localStorage is optional but recommended
- Consider adding "Filter by tag" quick action from tag badges in trade views
- Consider showing filter count in UI (e.g., "Showing 15 of 50 trades")
- Performance: filtering should be memoized to avoid unnecessary recalculations

