'use client';

import { useState, useEffect, useCallback } from 'react';
import { MealEntry, MealType } from '@/types';
import { api } from '@/lib/api';
import { useToast } from './useToast';

interface FilterOptions {
  startDate?: string;
  endDate?: string;
  mealType?: 'All' | MealType;
  page?: number;
  pageSize?: number;
}

export function useEntries(initialFilters?: FilterOptions) {
  const [entries, setEntries] = useState<MealEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [dailyTotals, setDailyTotals] = useState<{
    [date: string]: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      count: number;
    };
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterOptions>({
    startDate: initialFilters?.startDate || '',
    endDate: initialFilters?.endDate || '',
    mealType: initialFilters?.mealType || 'All',
    page: initialFilters?.page || 1,
    pageSize: initialFilters?.pageSize || 8,
  });

  const toast = useToast();

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getEntries({
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        mealType: filters.mealType,
        page: filters.page,
        pageSize: filters.pageSize,
      });

      setEntries(res.entries);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      setDailyTotals(res.dailyTotals);
    } catch (err: any) {
      const msg = err.message || 'Failed to fetch meal entries';
      setError(msg);
      toast.error(msg, 'Error');
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // If changing filter criteria (not page), reset page to 1
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  };

  const setPage = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const setPageSize = (newPageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize: newPageSize, page: 1 }));
  };

  const deleteEntry = async (id: string) => {
    try {
      await api.deleteEntry(id);
      toast.success('Meal entry deleted successfully', 'Deleted');
      fetchEntries();
      return true;
    } catch (err: any) {
      const msg = err.message || 'Failed to delete meal entry';
      toast.error(msg, 'Delete Error');
      return false;
    }
  };

  return {
    entries,
    total,
    totalPages,
    dailyTotals,
    loading,
    error,
    filters,
    updateFilters,
    setPage,
    setPageSize,
    deleteEntry,
    refreshEntries: fetchEntries,
  };
}
