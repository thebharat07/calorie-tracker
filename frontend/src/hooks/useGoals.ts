'use client';

import { useState, useEffect, useCallback } from 'react';
import { Goals } from '@/types';
import { api } from '@/lib/api';
import { useToast } from './useToast';

export function useGoals() {
  const [goals, setGoals] = useState<Goals | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getGoals();
      setGoals(data);
    } catch (err: any) {
      const msg = err.message || 'Failed to load goals';
      setError(msg);
      toast.error(msg, 'Goals Error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const saveGoals = async (goalsData: Omit<Goals, 'id' | 'updatedAt'>) => {
    try {
      setSaving(true);
      setError(null);
      const updated = await api.saveGoals(goalsData);
      setGoals(updated);
      toast.success('Your nutrition and weight goals have been saved!', 'Goals Saved');
      return { success: true, data: updated };
    } catch (err: any) {
      const msg = err.message || 'Failed to save goals';
      setError(msg);
      toast.error(msg, 'Save Failed');
      return { success: false, error: msg };
    } finally {
      setSaving(false);
    }
  };

  return {
    goals,
    loading,
    saving,
    error,
    reloadGoals: fetchGoals,
    saveGoals,
  };
}
