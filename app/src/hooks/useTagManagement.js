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
        .select('*, trade_tags(id)')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;

      // Transform data to include usage count
      const tagsWithUsage = data.map(tag => ({
        ...tag,
        usage_count: tag.trade_tags?.length || 0
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

