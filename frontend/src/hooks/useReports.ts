'use client';

import { useState, useEffect, useCallback } from 'react';
import { ReportsData } from '@/types';
import { api } from '@/lib/api';
import { useToast } from './useToast';

export function useReports(initialStartDate?: string, initialEndDate?: string) {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<string>(initialStartDate || '');
  const [endDate, setEndDate] = useState<string>(initialEndDate || '');

  const toast = useToast();

  // Initialize dates client-side after mount to prevent prerender hydration mismatches
  useEffect(() => {
    if (!startDate && !endDate) {
      const end = new Date().toISOString().split('T')[0];
      const d = new Date();
      d.setDate(d.getDate() - 6);
      const start = d.toISOString().split('T')[0];
      setStartDate(start);
      setEndDate(end);
    }
  }, [startDate, endDate]);

  const fetchReports = useCallback(async () => {
    if (!startDate || !endDate) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.getReports(startDate, endDate);
      setData(res);
    } catch (err: any) {
      const msg = err.message || 'Failed to generate nutrition reports';
      setError(msg);
      toast.error(msg, 'Reports Error');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, toast]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const setRange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const selectPreset = (days: number) => {
    const end = new Date().toISOString().split('T')[0];
    const d = new Date();
    d.setDate(d.getDate() - (days - 1));
    const start = d.toISOString().split('T')[0];
    setStartDate(start);
    setEndDate(end);
  };

  return {
    data,
    loading: loading || !startDate || !endDate,
    error,
    startDate,
    endDate,
    setRange,
    selectPreset,
    refreshReports: fetchReports,
  };
}
