import { useState, useEffect } from 'react';
import { Category } from '@/types';
import { FlatCategory } from '@/components/admin/categories/CategoryRow';
import { flattenCategories, resolveHierarchy } from '@/lib/admin/category-operations';
import { getApiUrl } from '@/lib/utils';

export function useAdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<FlatCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl('/admin/categories'), {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setCategories(data || []);
      setIsDirty(false);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !isDirty) {
      setItems(flattenCategories(categories));
    }
  }, [categories, isDirty]);

  const updateLocalState = (newItems: FlatCategory[]) => {
    setItems(newItems);
    setIsDirty(true);
  };

  const handleMoveUp = (id: string) => {
    const index = items.findIndex(i => i.id === id);
    if (index <= 0) return;

    const current = items[index];
    const target = items[index - 1];

    if (current.depth !== target.depth) return;

    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    updateLocalState(newItems);
  };

  const handleMoveDown = (id: string) => {
    const index = items.findIndex(i => i.id === id);
    if (index < 0 || index >= items.length - 1) return;

    const current = items[index];
    const target = items[index + 1];

    if (current && target.depth !== target.depth) return;

    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    updateLocalState(newItems);
  };

  const handleIndent = (id: string) => {
    const index = items.findIndex(i => i.id === id);
    if (index <= 0) return;

    const prevItem = items[index - 1];
    const newItems = [...items];
    newItems[index] = { ...newItems[index], depth: prevItem.depth + 1 };
    updateLocalState(newItems);
  };

  const handleOutdent = (id: string) => {
    const index = items.findIndex(i => i.id === id);
    if (index < 0) return;

    const item = items[index];
    if (item.depth === 0) return;

    const newItems = [...items];
    newItems[index] = { ...newItems[index], depth: item.depth - 1 };
    updateLocalState(newItems);
  };

  const saveChanges = async () => {
    const payload = resolveHierarchy(items);
    
    try {
      const res = await fetch(getApiUrl('/admin/categories/reorder'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ updates: payload })
      });

      if (res.ok) {
        await fetchCategories();
        return true;
      } else {
        console.error('Failed to save hierarchy');
        return false;
      }
    } catch (error) {
      console.error('Save error:', error);
      return false;
    }
  };

  return {
    categories,
    items,
    isLoading,
    isDirty,
    expanded,
    setExpanded,
    handleMoveUp,
    handleMoveDown,
    handleIndent,
    handleOutdent,
    saveChanges,
    refetch: fetchCategories
  };
}
