import React from 'react';
import { X } from 'lucide-react';

const sizeClasses = {
  small: 'text-xs px-2 py-1',
  default: 'text-sm px-2.5 py-1.5',
  large: 'text-base px-3 py-2'
};

const TagBadge = ({ tag, onRemove, showRemove = false, size = 'default', className = '' }) => {
  if (!tag) {
    return null;
  }

  const tagColor = tag.color || '#3B82F6';
  const appliedSize = sizeClasses[size] || sizeClasses.default;
  const removableClasses = showRemove
    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600'
    : '';

  const styleProps = showRemove
    ? {}
    : { backgroundColor: `${tagColor}20`, color: tagColor };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-colors ${appliedSize} ${removableClasses} ${className}`.trim()}
      style={styleProps}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: tagColor }}
      />
      <span className="truncate max-w-[6rem]">{tag.name}</span>
      {showRemove && onRemove && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemove(tag.id);
          }}
          className="ml-1 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-full p-0.5 transition-colors"
          aria-label={`Remove tag ${tag.name}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};

export default TagBadge;
