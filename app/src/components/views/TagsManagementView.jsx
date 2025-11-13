import React, { useState } from 'react';
import { Plus } from 'lucide-react';
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tag Management</h1>
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

