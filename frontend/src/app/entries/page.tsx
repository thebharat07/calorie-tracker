'use client';

import React from 'react';
import { useEntries } from '@/hooks/useEntries';
import { EntryFilters } from '@/components/entries/EntryFilters';
import { EntryTable } from '@/components/entries/EntryTable';
import { Pagination } from '@/components/entries/Pagination';
import { Calendar, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function EntriesPage() {
  const {
    entries,
    total,
    totalPages,
    dailyTotals,
    loading,
    filters,
    updateFilters,
    setPage,
    setPageSize,
    deleteEntry,
  } = useEntries({ pageSize: 8 });

  const handleResetFilters = () => {
    updateFilters({
      startDate: '',
      endDate: '',
      mealType: 'All',
      page: 1,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#3b7a57]" />
            <span>Meal Records & Daily Timelines</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Filter, inspect, edit, and review your historical nutrition records and per-day calorie sums.
          </p>
        </div>

        <div>
          <Link
            href="/log"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-[#3b7a57] text-white hover:bg-[#326749] transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log Meal</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <EntryFilters
        startDate={filters.startDate}
        endDate={filters.endDate}
        mealType={filters.mealType}
        onFilterChange={updateFilters}
        onReset={handleResetFilters}
      />

      {/* Table & Per-day Summaries */}
      <EntryTable
        entries={entries}
        dailyTotals={dailyTotals}
        isLoading={loading}
        onDelete={deleteEntry}
      />

      {/* Pagination */}
      {!loading && total > 0 && (
        <Pagination
          currentPage={filters.page || 1}
          totalPages={totalPages}
          pageSize={filters.pageSize || 8}
          totalItems={total}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}
    </div>
  );
}
