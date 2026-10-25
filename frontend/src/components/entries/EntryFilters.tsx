'use client';

import React from 'react';
import { MealType } from '@/types';
import { Filter, Calendar, RotateCcw } from 'lucide-react';

interface EntryFiltersProps {
  startDate?: string;
  endDate?: string;
  mealType?: 'All' | MealType;
  onFilterChange: (filters: { startDate?: string; endDate?: string; mealType?: 'All' | MealType }) => void;
  onReset: () => void;
}

const mealOptions: ('All' | MealType)[] = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];

export function EntryFilters({
  startDate = '',
  endDate = '',
  mealType = 'All',
  onFilterChange,
  onReset,
}: EntryFiltersProps) {
  const setQuickRange = (days: number | 'all') => {
    if (days === 'all') {
      onFilterChange({ startDate: '', endDate: '', mealType });
      return;
    }
    const end = new Date().toISOString().split('T')[0];
    const d = new Date();
    d.setDate(d.getDate() - (days - 1));
    const start = d.toISOString().split('T')[0];
    onFilterChange({ startDate: start, endDate: end, mealType });
  };

  const hasActiveFilters = Boolean(startDate || endDate || mealType !== 'All');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#3b7a57]" />
          <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
            Filter Meal Entries
          </span>
        </div>

        {/* Quick Range Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setQuickRange(1)}
            className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setQuickRange(7)}
            className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={() => setQuickRange(30)}
            className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Last 30 Days
          </button>
          <button
            type="button"
            onClick={() => setQuickRange('all')}
            className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            All Time
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-xs font-medium text-slate-600 mb-1">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => onFilterChange({ startDate: e.target.value, endDate, mealType })}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:border-[#3b7a57]"
          />
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block text-xs font-medium text-slate-600 mb-1">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => onFilterChange({ startDate, endDate: e.target.value, mealType })}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:border-[#3b7a57]"
          />
        </div>

        {/* Meal Type */}
        <div>
          <label htmlFor="filterMealType" className="block text-xs font-medium text-slate-600 mb-1">
            Meal Category
          </label>
          <select
            id="filterMealType"
            value={mealType}
            onChange={(e) =>
              onFilterChange({
                startDate,
                endDate,
                mealType: e.target.value as 'All' | MealType,
              })
            }
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:border-[#3b7a57]"
          >
            {mealOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-500">Filters applied</span>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
