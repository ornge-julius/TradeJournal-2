import React, { useState } from 'react';
import { Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTagManagement } from '../../hooks/useTagManagement';
import { useAuth } from '../../hooks/useAuth';
import TagForm from '../forms/TagForm';
import TagCard from '../ui/TagCard';
import ConfirmModal from '../ui/ConfirmModal';
import AnimatedContent from '../ui/animation/AnimatedContent';

const TagsManagementView = () => {
  const { isAuthenticated } = useAuth();
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
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tag Management</h1>
        {isAuthenticated && (
          <Fab
            color="primary"
            aria-label="add tag"
            onClick={() => setShowCreateForm(true)}
            sx={{
              background: 'linear-gradient(to right, #2563EB, #059669)',
              '&:hover': {
                background: 'linear-gradient(to right, #1D4ED8, #047857)',
              },
              zIndex: 10,
            }}
          >
            <AddIcon />
          </Fab>
        )}
        {!isAuthenticated && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sign in to create and edit tags
          </p>
        )}
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
          <p className="text-gray-400 mb-4">
            {isAuthenticated 
              ? "No tags yet. Create your first tag to get started!" 
              : "No tags available. Sign in to view your tags."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag, index) => (
            <AnimatedContent 
              key={tag.id} 
              ease="back.out"
              scale={0.8}
              duration={0.5}
              delay={index * 0.1}
              distance={0}
              immediate={true}
            >
              <TagCard
                tag={tag}
                onEdit={isAuthenticated ? () => setEditingTag(tag) : undefined}
                onDelete={isAuthenticated ? () => setDeletingTag(tag) : undefined}
                canEdit={isAuthenticated}
              />
            </AnimatedContent>
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
