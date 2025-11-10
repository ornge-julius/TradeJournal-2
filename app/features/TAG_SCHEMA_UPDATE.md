# Tag Schema Update for Supabase

## Problem Statement

The application needs to support a tagging system for trades where users can:
1. Create, view, update, and delete tags
2. Associate multiple tags with each trade
3. Filter trades by tags

This requires updating the Supabase database schema to support a many-to-many relationship between trades and tags. The current `trades` table does not have any tag-related columns, and there is no `tags` table or junction table to manage the relationship.

## Current Implementation

The current database schema includes:
- `trades` table with columns: `id`, `symbol`, `position_type`, `entry_price`, `exit_price`, `quantity`, `entry_date`, `exit_date`, `notes`, `reasoning`, `result`, `option`, `source`, `profit`, `account_id`, `user_id`, `created_at`, `updated_at`
- No `tags` table exists
- No junction table exists for trade-tag relationships
- No tag-related columns in the `trades` table

## Requirements

### Functional Requirements

1. **Tags Table**
   - Create a new `tags` table in Supabase
   - Each tag should have:
     - `id` (UUID, primary key)
     - `name` (text, required, unique per user)
     - `color` (text, optional - for UI display purposes)
     - `user_id` (UUID, foreign key to auth.users)
     - `created_at` (timestamp)
     - `updated_at` (timestamp)
   - Tags should be user-specific (each user can have their own set of tags)
   - Tag names should be unique per user (no duplicate tag names for the same user)

2. **Trade-Tag Junction Table**
   - Create a new `trade_tags` table to manage the many-to-many relationship
   - Each record should have:
     - `id` (UUID, primary key)
     - `trade_id` (UUID, foreign key to trades table)
     - `tag_id` (UUID, foreign key to tags table)
     - `created_at` (timestamp)
   - Composite unique constraint on `(trade_id, tag_id)` to prevent duplicate associations
   - Cascade delete: When a trade is deleted, all associated trade_tags records should be deleted
   - Cascade delete: When a tag is deleted, all associated trade_tags records should be deleted

3. **Database Constraints**
   - Foreign key constraints with proper cascade behavior
   - Unique constraints to prevent duplicate tag names per user
   - Unique constraints to prevent duplicate trade-tag associations
   - Indexes for performance on frequently queried columns

4. **Row Level Security (RLS)**
   - Enable RLS on both `tags` and `trade_tags` tables
   - Users should only be able to:
     - View, create, update, and delete their own tags
     - View and manage trade_tags for their own trades
   - Policies should be based on `user_id` matching the authenticated user

## Implementation Approach

### 1. Create Tags Table

```sql
-- Create tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Create index on user_id for faster queries
CREATE INDEX idx_tags_user_id ON tags(user_id);

-- Create index on name for faster searches
CREATE INDEX idx_tags_name ON tags(name);

-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tags
-- Users can view their own tags
CREATE POLICY "Users can view their own tags"
  ON tags FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own tags
CREATE POLICY "Users can insert their own tags"
  ON tags FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own tags
CREATE POLICY "Users can update their own tags"
  ON tags FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own tags
CREATE POLICY "Users can delete their own tags"
  ON tags FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON tags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 2. Create Trade-Tags Junction Table

```sql
-- Create trade_tags junction table
CREATE TABLE trade_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id UUID NOT NULL REFERENCES trades(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(trade_id, tag_id)
);

-- Create indexes for faster queries
CREATE INDEX idx_trade_tags_trade_id ON trade_tags(trade_id);
CREATE INDEX idx_trade_tags_tag_id ON trade_tags(tag_id);

-- Enable RLS
ALTER TABLE trade_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trade_tags
-- Users can view trade_tags for their own trades
CREATE POLICY "Users can view trade_tags for their own trades"
  ON trade_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trades
      WHERE trades.id = trade_tags.trade_id
      AND trades.user_id = auth.uid()
    )
  );

-- Users can insert trade_tags for their own trades
CREATE POLICY "Users can insert trade_tags for their own trades"
  ON trade_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trades
      WHERE trades.id = trade_tags.trade_id
      AND trades.user_id = auth.uid()
    )
    AND
    EXISTS (
      SELECT 1 FROM tags
      WHERE tags.id = trade_tags.tag_id
      AND tags.user_id = auth.uid()
    )
  );

-- Users can delete trade_tags for their own trades
CREATE POLICY "Users can delete trade_tags for their own trades"
  ON trade_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM trades
      WHERE trades.id = trade_tags.trade_id
      AND trades.user_id = auth.uid()
    )
  );
```

### 3. Migration Strategy

Since this is a new feature, the migration should:
1. Create the new tables without affecting existing data
2. Ensure backward compatibility (existing trades will have no tags initially)
3. Set up proper indexes for performance
4. Configure RLS policies correctly

## Technical Considerations

### Database Design Decisions

1. **Many-to-Many Relationship**
   - Using a junction table (`trade_tags`) is the correct approach for many-to-many relationships
   - This allows a trade to have multiple tags and a tag to be associated with multiple trades

2. **User Isolation**
   - Tags are user-specific to ensure data privacy
   - RLS policies enforce that users can only access their own tags
   - The `UNIQUE(user_id, name)` constraint ensures tag names are unique per user

3. **Cascade Deletes**
   - When a trade is deleted, associated `trade_tags` records are automatically deleted
   - When a tag is deleted, associated `trade_tags` records are automatically deleted
   - This prevents orphaned records

4. **Color Field**
   - Optional `color` field allows for future UI customization
   - Can store hex color codes (e.g., "#FF5733") or color names
   - Can be null if not needed

### Performance Considerations

1. **Indexes**
   - Index on `tags.user_id` for faster user-specific queries
   - Index on `tags.name` for faster tag name searches
   - Indexes on `trade_tags.trade_id` and `trade_tags.tag_id` for faster joins

2. **Query Optimization**
   - When fetching trades with tags, use JOINs efficiently
   - Consider using Supabase's `.select()` with nested queries for tag data

### Security Considerations

1. **Row Level Security**
   - All tables have RLS enabled
   - Policies ensure users can only access their own data
   - Policies check both trade ownership and tag ownership

2. **Data Validation**
   - Tag names should be validated in the application layer (not empty, reasonable length)
   - Color values should be validated if used (valid hex codes)

## Implementation Steps

1. **Access Supabase Dashboard**
   - Navigate to the Supabase project dashboard
   - Go to SQL Editor

2. **Create Tags Table**
   - Run the SQL script to create the `tags` table
   - Verify table creation in Table Editor
   - Verify indexes are created

3. **Create Trade-Tags Junction Table**
   - Run the SQL script to create the `trade_tags` table
   - Verify table creation in Table Editor
   - Verify indexes are created

4. **Set Up RLS Policies**
   - Verify RLS is enabled on both tables
   - Test policies by attempting to access data as different users
   - Verify policies work correctly

5. **Test Database Operations**
   - Create a test tag
   - Associate a tag with a test trade
   - Verify cascade deletes work correctly
   - Test unique constraints

6. **Update Supabase Client Configuration**
   - Ensure the Supabase client in the application can access the new tables
   - Test queries from the application

## Files to Create/Modify

1. **SQL Migration Scripts**
   - Create migration file or run SQL directly in Supabase SQL Editor
   - Document the migration for future reference

2. **No Application Code Changes Yet**
   - This work focuses only on database schema
   - Application code changes will come in subsequent work

## Dependencies and Prerequisites

1. **Supabase Project Access**
   - Must have access to Supabase project dashboard
   - Must have permissions to create tables and set up RLS

2. **Existing Tables**
   - `trades` table must exist
   - `auth.users` table must exist (provided by Supabase Auth)

3. **Authentication**
   - Supabase Auth must be configured
   - Users must be authenticated to use tags (RLS policies depend on `auth.uid()`)

## Acceptance Criteria

- ✅ `tags` table is created with all required columns
- ✅ `trade_tags` junction table is created with all required columns
- ✅ Foreign key constraints are set up correctly with cascade deletes
- ✅ Unique constraints prevent duplicate tag names per user
- ✅ Unique constraints prevent duplicate trade-tag associations
- ✅ Indexes are created for performance optimization
- ✅ RLS is enabled on both tables
- ✅ RLS policies are created and tested
- ✅ Users can only access their own tags
- ✅ Users can only manage trade_tags for their own trades
- ✅ Cascade deletes work correctly when trades or tags are deleted
- ✅ Database schema is documented

## Edge Cases

1. **Existing Trades**
   - Existing trades will have no tags initially (this is expected)
   - No migration needed for existing data

2. **Tag Name Collisions**
   - Unique constraint prevents duplicate tag names per user
   - Application should handle constraint violations gracefully

3. **Cascade Deletes**
   - When a tag is deleted, all trade associations are removed
   - When a trade is deleted, all tag associations are removed
   - No orphaned records should remain

4. **Empty Tags**
   - Tags with no associated trades are allowed
   - Users can create tags before associating them with trades

5. **Multiple Users**
   - Each user has their own isolated set of tags
   - Users cannot see or access other users' tags

## Notes

- This work focuses solely on database schema changes
- Application code changes will be implemented in subsequent work
- The color field is optional and can be added later if needed
- Consider adding a `description` field to tags in the future if needed
- The junction table approach allows for future metadata (e.g., when a tag was added to a trade)

