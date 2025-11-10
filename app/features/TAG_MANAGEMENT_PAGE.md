# Tag Management Page Implementation

## Problem Statement

Users need a dedicated page to manage their tags - creating new tags, viewing all existing tags, updating tag names/colors, and deleting tags. Currently, there is no UI for tag management, and users have no way to create or manage tags through the application interface.

This work focuses on creating a new Tags Management page that provides full CRUD (Create, Read, Update, Delete) functionality for tags.

## Current Implementation

The current application structure includes:
- Main dashboard view at `/`
- Batch comparison view at `/comparison`
- Navigation menu in Header component
- No tags management page exists
- No tag-related UI components exist

The database schema for tags should already be in place (see `TAG_SCHEMA_UPDATE.md`), but there is no application code to interact with it.

## Requirements

### Functional Requirements

1. **New Tags Management Page**
   - Create a new route `/tags` for the tags management page
   - Page should be accessible from the navigation menu
   - Page should require authentication (users must be signed in)
   - Page should display all tags for the current user

2. **View Tags**
   - Display all user's tags in a list or grid layout
   - Show tag name, color (if set), and usage count (number of trades using the tag)
   - Display tags in a visually appealing way (e.g., tag badges/chips)
   - Show empty state when user has no tags
   - Tags should be sortable (by name, usage count, creation date)

3. **Create Tag**
   - Provide a form or input to create a new tag
   - Tag name is required
   - Tag color is optional (can be a color picker or predefined color options)
   - Validate tag name (not empty, reasonable length, unique per user)
   - Show error messages for validation failures
   - After creation, tag should appear in the list immediately

4. **Update Tag**
   - Allow users to edit tag name and color
   - Provide edit functionality (inline editing or modal form)
   - Validate updated tag name (not empty, unique per user)
   - Show error messages for validation failures
   - Update should be reflected immediately in the UI

5. **Delete Tag**
   - Allow users to delete tags
   - Show confirmation modal before deletion
   - Display warning if tag is associated with trades (e.g., "This tag is used by X trades. Deleting it will remove the tag from all associated trades.")
   - After deletion, tag should be removed from the list immediately
   - All trade associations should be removed (handled by database cascade)

6. **Tag Usage Information**
   - Display how many trades are using each tag
   - Optionally show which trades are using a tag (could be a link or tooltip)
   - Usage count should update when tags are added/removed from trades

### Design Requirements

1. **Layout**
   - Page should follow the same design system as the rest of the application
   - Use consistent spacing, colors, and typography
   - Responsive design for mobile and desktop
   - Tag display should be visually clear and organized

2. **Tag Display**
   - Tags should be displayed as badges/chips with their color (if set)
   - Each tag should show:
     - Tag name
     - Color indicator (if color is set)
     - Usage count
     - Edit and delete buttons/actions

3. **Forms and Modals**
   - Create tag form (could be inline or in a modal)
   - Edit tag form (could be inline or in a modal)
   - Delete confirmation modal
   - Forms should match the design of other forms in the app (e.g., TradeForm)

4. **Empty State**
   - Show helpful message when user has no tags
   - Provide clear call-to-action to create first tag

### Technical Requirements

1. **Component Structure**
   - Create `TagsManagementView.jsx` component in `app/src/components/views/`
   - Create `TagForm.jsx` component in `app/src/components/forms/` (for create/edit)
   - Create `TagCard.jsx` or `TagItem.jsx` component in `app/src/components/ui/` (for displaying individual tags)
   - Create custom hook `useTagManagement.js` in `app/src/hooks/` for tag CRUD operations

2. **Data Fetching**
   - Fetch all tags for the current user from Supabase
   - Fetch tag usage counts (number of trades per tag)
   - Handle loading and error states
   - Refresh data after create/update/delete operations

3. **Supabase Integration**
   - Use Supabase client to interact with `tags` table
   - Implement proper error handling
   - Use RLS policies (should already be set up in schema)
   - Handle unique constraint violations (duplicate tag names)

4. **State Management**
   - Manage tags list state
   - Manage form state (create/edit)
   - Manage modal states (delete confirmation)
   - Manage loading and error states

5. **Navigation**
   - Add "Tags" link to Header navigation menu
   - Use React Router for routing
   - Add route in `App.jsx`

## Implementation Approach

### 1. Create Custom Hook for Tag Management

```javascript
// app/src/hooks/useTagManagement.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './useAuth';

export const useTagManagement = () => {
  const { user } = useAuth();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTags = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('tags')
        .select('*, trade_tags(count)')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;

      // Transform data to include usage count
      const tagsWithUsage = data.map(tag => ({
        ...tag,
        usage_count: tag.trade_tags?.[0]?.count || 0
      }));

      setTags(tagsWithUsage);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tags:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const createTag = useCallback(async (tagData) => {
    if (!user) return null;

    try {
      const { data, error: createError } = await supabase
        .from('tags')
        .insert([{
          name: tagData.name,
          color: tagData.color || null,
          user_id: user.id
        }])
        .select()
        .single();

      if (createError) throw createError;

      await fetchTags();
      return data;
    } catch (err) {
      throw err;
    }
  }, [user, fetchTags]);

  const updateTag = useCallback(async (tagId, tagData) => {
    if (!user) return null;

    try {
      const { data, error: updateError } = await supabase
        .from('tags')
        .update({
          name: tagData.name,
          color: tagData.color || null
        })
        .eq('id', tagId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchTags();
      return data;
    } catch (err) {
      throw err;
    }
  }, [user, fetchTags]);

  const deleteTag = useCallback(async (tagId) => {
    if (!user) return;

    try {
      const { error: deleteError } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      await fetchTags();
    } catch (err) {
      throw err;
    }
  }, [user, fetchTags]);

  return {
    tags,
    loading,
    error,
    createTag,
    updateTag,
    deleteTag,
    refetch: fetchTags
  };
};
```

### 2. Create Tag Management View Component

```javascript
// app/src/components/views/TagsManagementView.jsx
import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useTagManagement } from '../../hooks/useTagManagement';
import TagForm from '../forms/TagForm';
import TagCard from '../ui/TagCard';
import ConfirmModal from '../ui/ConfirmModal';

const TagsManagementView = () => {
  const { tags, loading, error, createTag, updateTag, deleteTag } = useTagManagement();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [deletingTag, setDeletingTag] = useState(null);

  const handleCreateTag = async (tagData) => {
    try {
      await createTag(tagData);
      setShowCreateForm(false);
    } catch (err) {
      // Handle error (show notification)
      console.error('Error creating tag:', err);
    }
  };

  const handleUpdateTag = async (tagData) => {
    try {
      await updateTag(editingTag.id, tagData);
      setEditingTag(null);
    } catch (err) {
      // Handle error (show notification)
      console.error('Error updating tag:', err);
    }
  };

  const handleDeleteTag = async () => {
    try {
      await deleteTag(deletingTag.id);
      setDeletingTag(null);
    } catch (err) {
      // Handle error (show notification)
      console.error('Error deleting tag:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-300">Loading tags...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading tags: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tags Management</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 px-4 py-2 rounded-lg text-white font-medium hover:from-blue-500 hover:to-emerald-500 transition-all"
        >
          <Plus className="h-5 w-5" />
          Create Tag
        </button>
      </div>

      {showCreateForm && (
        <TagForm
          isOpen={true}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateTag}
        />
      )}

      {editingTag && (
        <TagForm
          isOpen={true}
          onClose={() => setEditingTag(null)}
          onSubmit={handleUpdateTag}
          editingTag={editingTag}
        />
      )}

      {tags.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl">
          <p className="text-gray-400 mb-4">No tags yet. Create your first tag to get started!</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-blue-600 to-emerald-600 px-4 py-2 rounded-lg text-white font-medium hover:from-blue-500 hover:to-emerald-500 transition-all"
          >
            Create Tag
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map(tag => (
            <TagCard
              key={tag.id}
              tag={tag}
              onEdit={() => setEditingTag(tag)}
              onDelete={() => setDeletingTag(tag)}
            />
          ))}
        </div>
      )}

      {deletingTag && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setDeletingTag(null)}
          onConfirm={handleDeleteTag}
          title="Delete Tag"
          message={`Are you sure you want to delete "${deletingTag.name}"? ${deletingTag.usage_count > 0 ? `This tag is used by ${deletingTag.usage_count} trade(s). Deleting it will remove the tag from all associated trades.` : ''}`}
          confirmText="Delete Tag"
          cancelText="Cancel"
          confirmButtonColor="bg-red-600 hover:bg-red-700"
        />
      )}
    </div>
  );
};

export default TagsManagementView;
```

### 3. Create Tag Form Component

```javascript
// app/src/components/forms/TagForm.jsx
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
```

### 4. Create Tag Card Component

```javascript
// app/src/components/ui/TagCard.jsx
import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const TagCard = ({ tag, onEdit, onDelete }) => {
  const tagColor = tag.color || '#3B82F6';

  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: tagColor }}
          />
          <span className="font-semibold text-gray-900 dark:text-white">
            {tag.name}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Edit tag"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete tag"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Used by {tag.usage_count || 0} trade{tag.usage_count !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default TagCard;
```

### 5. Update App.jsx to Add Route

```javascript
// In App.jsx, add import
import TagsManagementView from './components/views/TagsManagementView';

// In Routes section, add new route
<Route 
  path="/tags" 
  element={
    <TagsManagementView />
  } 
/>
```

### 6. Update Header.jsx to Add Navigation Link

```javascript
// In Header.jsx, add to navItems array
import { Tag } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/', isActive: currentView === 'dashboard' },
  { label: 'Batch Comparison', icon: TrendingUpDown, path: '/comparison', isActive: currentView === 'batchComparison' },
  { label: 'Tags', icon: Tag, path: '/tags', isActive: currentView === 'tags' },
];
```

## Implementation Steps

1. **Create Custom Hook**
   - Create `useTagManagement.js` hook
   - Implement fetch, create, update, delete functions
   - Handle loading and error states

2. **Create Tag Form Component**
   - Create `TagForm.jsx` component
   - Implement form validation
   - Handle create and edit modes

3. **Create Tag Card Component**
   - Create `TagCard.jsx` component
   - Display tag information
   - Add edit and delete actions

4. **Create Tags Management View**
   - Create `TagsManagementView.jsx` component
   - Integrate all sub-components
   - Handle state management

5. **Update App.jsx**
   - Add route for `/tags`
   - Ensure authentication is required

6. **Update Header.jsx**
   - Add "Tags" navigation link
   - Add appropriate icon

7. **Test Functionality**
   - Test creating tags
   - Test editing tags
   - Test deleting tags
   - Test error handling
   - Test empty states

## Files to Create/Modify

1. **New Files**
   - `app/src/hooks/useTagManagement.js` - Custom hook for tag CRUD operations
   - `app/src/components/views/TagsManagementView.jsx` - Main tags management page
   - `app/src/components/forms/TagForm.jsx` - Form for creating/editing tags
   - `app/src/components/ui/TagCard.jsx` - Component for displaying individual tags

2. **Files to Modify**
   - `app/src/App.jsx` - Add route for tags page
   - `app/src/components/ui/Header.jsx` - Add navigation link

## Dependencies and Prerequisites

1. **Database Schema**
   - `TAG_SCHEMA_UPDATE.md` must be completed first
   - Tags table and trade_tags table must exist
   - RLS policies must be set up

2. **Authentication**
   - User must be authenticated to access tags
   - `useAuth` hook must be available

3. **Existing Components**
   - `ConfirmModal` component should exist (for delete confirmation)
   - Supabase client should be configured

## Acceptance Criteria

- ✅ Tags management page is accessible at `/tags` route
- ✅ Navigation link to tags page is visible in Header
- ✅ Users can view all their tags
- ✅ Users can create new tags with name and optional color
- ✅ Users can edit existing tags
- ✅ Users can delete tags with confirmation
- ✅ Tag usage count is displayed for each tag
- ✅ Empty state is shown when user has no tags
- ✅ Loading states are handled properly
- ✅ Error states are handled and displayed
- ✅ Form validation works correctly
- ✅ Duplicate tag names are prevented
- ✅ All operations require authentication
- ✅ UI matches application design system
- ✅ Page is responsive on mobile and desktop

## Edge Cases

1. **No Tags**
   - Show helpful empty state
   - Provide clear call-to-action

2. **Duplicate Tag Names**
   - Show error message when user tries to create duplicate
   - Handle unique constraint violations gracefully

3. **Tag in Use**
   - Show usage count for each tag
   - Warn user when deleting tag that's in use
   - Cascade delete should work (handled by database)

4. **Network Errors**
   - Handle Supabase connection errors
   - Show user-friendly error messages
   - Allow retry operations

5. **Unauthenticated Users**
   - Redirect to sign-in or show message
   - Prevent access to tags page

6. **Long Tag Names**
   - Truncate or wrap long tag names in UI
   - Validate maximum length in form

## Notes

- Tag color is optional and can be null
- Usage count query may need optimization for large datasets
- Consider adding tag search/filter functionality in the future
- Consider adding tag sorting options (by name, usage, date)
- Tag deletion confirmation should clearly explain cascade behavior
- Consider adding bulk operations (delete multiple tags) in the future

