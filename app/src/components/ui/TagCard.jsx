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

