'use client';

import React, { useState } from 'react';
import { MealEntry, MealType } from '@/types';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { 
  Calendar, 
  Edit3, 
  Trash2, 
  UtensilsCrossed, 
  Flame, 
  Clock, 
  Info,
  Layers
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EntryTableProps {
  entries: MealEntry[];
  dailyTotals: {
    [date: string]: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      count: number;
    };
  };
  isLoading: boolean;
  onDelete: (id: string) => Promise<boolean>;
}

export function EntryTable({ entries, dailyTotals, isLoading, onDelete }: EntryTableProps) {
  const router = useRouter();
  const [selectedEntryToDelete, setSelectedEntryToDelete] = useState<MealEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getMealBadge = (meal: MealType) => {
    switch (meal) {
      case 'Breakfast':
        return 'bg-[#fef9e7] text-[#8c631a] border-[#fae5be]';
      case 'Lunch':
        return 'bg-[#eaf5ee] text-[#2c6e49] border-[#d2edd7]';
      case 'Dinner':
        return 'bg-[#edf5fb] text-[#1e4c74] border-[#d0e4f7]';
      case 'Snack':
        return 'bg-[#f4f1fa] text-[#553c7b] border-[#e2d9f3]';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleEdit = (entry: MealEntry) => {
    router.push(`/log?edit=${entry.id}`);
  };

  const confirmDelete = async () => {
    if (!selectedEntryToDelete) return;
    setIsDeleting(true);
    const ok = await onDelete(selectedEntryToDelete.id);
    setIsDeleting(false);
    if (ok) {
      setSelectedEntryToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12">
        <LoadingSpinner label="Loading meal history & totals..." size="lg" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={UtensilsCrossed}
        title="No meal records found"
        description="Try adjusting your time range filters or log your first meal to get started."
        actionHref="/log"
        actionLabel="Log a Meal Now"
      />
    );
  }

  // Group entries by date for beautiful per-day summaries
  const dateGroups: { [date: string]: MealEntry[] } = {};
  entries.forEach((e) => {
    if (!dateGroups[e.date]) dateGroups[e.date] = [];
    dateGroups[e.date].push(e);
  });

  const sortedDates = Object.keys(dateGroups).sort((a, b) => b.localeCompare(a));

  return (
    <>
      <div className="space-y-6">
        {sortedDates.map((dateStr) => {
          const groupEntries = dateGroups[dateStr];
          const daySummary = dailyTotals[dateStr] || {
            calories: groupEntries.reduce((acc, curr) => acc + curr.calories, 0),
            protein: groupEntries.reduce((acc, curr) => acc + curr.protein, 0),
            carbs: groupEntries.reduce((acc, curr) => acc + curr.carbs, 0),
            fat: groupEntries.reduce((acc, curr) => acc + curr.fat, 0),
            count: groupEntries.length,
          };

          const formattedDate = new Date(dateStr + 'T00:00:00').toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <div key={dateStr} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              {/* Per-Day Calorie Total Header */}
              <div className="bg-[#f8faf9] px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#3b7a57]" />
                  <span className="font-semibold text-sm text-slate-800">{formattedDate}</span>
                  <span className="text-[11px] text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded">
                    {groupEntries.length} {groupEntries.length === 1 ? 'meal' : 'meals'}
                  </span>
                </div>

                {/* Day Total Nutrients */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 font-semibold text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    <Flame className="w-3.5 h-3.5 text-[#e2a961]" />
                    <span>{Math.round(daySummary.calories)} kcal</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                    <span className="text-[#2b6cb0] font-medium">P: {Math.round(daySummary.protein)}g</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[#8c631a] font-medium">C: {Math.round(daySummary.carbs)}g</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[#993f48] font-medium">F: {Math.round(daySummary.fat)}g</span>
                  </div>
                </div>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th scope="col" className="px-4 py-2.5">Time / Meal</th>
                      <th scope="col" className="px-4 py-2.5">Food</th>
                      <th scope="col" className="px-4 py-2.5">Portion</th>
                      <th scope="col" className="px-4 py-2.5 text-right">Calories</th>
                      <th scope="col" className="px-4 py-2.5 text-right">Protein</th>
                      <th scope="col" className="px-4 py-2.5 text-right">Carbs</th>
                      <th scope="col" className="px-4 py-2.5 text-right">Fat</th>
                      <th scope="col" className="px-4 py-2.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {groupEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Time & Meal Type */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${getMealBadge(
                                entry.mealType
                              )}`}
                            >
                              {entry.mealType}
                            </span>
                            {entry.time && (
                              <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                                <Clock className="w-3 h-3" />
                                {entry.time}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Food Name */}
                        <td className="px-4 py-3 font-medium text-slate-800">
                          <div className="flex items-center gap-2">
                            <span>{entry.foodName}</span>
                            {entry.micronutrients && Object.values(entry.micronutrients).some((v) => v && v > 0) && (
                              <span
                                className="text-[10px] text-slate-400 hover:text-slate-600 cursor-help"
                                title="Has detailed micronutrients recorded"
                              >
                                <Info className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          {entry.notes && (
                            <p className="text-[10px] text-slate-400 italic truncate max-w-xs">
                              {entry.notes}
                            </p>
                          )}
                        </td>

                        {/* Quantity & Unit */}
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {entry.quantity} {entry.unit}
                        </td>

                        {/* Calories */}
                        <td className="px-4 py-3 text-right font-semibold text-slate-800 whitespace-nowrap">
                          {entry.calories} <span className="text-[10px] font-normal text-slate-400">kcal</span>
                        </td>

                        {/* Protein */}
                        <td className="px-4 py-3 text-right text-[#2b6cb0] font-medium whitespace-nowrap">
                          {entry.protein}g
                        </td>

                        {/* Carbs */}
                        <td className="px-4 py-3 text-right text-[#8c631a] font-medium whitespace-nowrap">
                          {entry.carbs}g
                        </td>

                        {/* Fat */}
                        <td className="px-4 py-3 text-right text-[#993f48] font-medium whitespace-nowrap">
                          {entry.fat}g
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleEdit(entry)}
                              className="p-1 rounded text-slate-500 hover:text-[#3b7a57] hover:bg-[#edf5ee] transition-colors"
                              title="Edit meal entry"
                              aria-label={`Edit ${entry.foodName}`}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedEntryToDelete(entry)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete meal entry"
                              aria-label={`Delete ${entry.foodName}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(selectedEntryToDelete)}
        title="Delete Meal Entry"
        message={`Are you sure you want to delete "${selectedEntryToDelete?.foodName}"? This action cannot be undone.`}
        confirmLabel="Delete Entry"
        onConfirm={confirmDelete}
        onCancel={() => setSelectedEntryToDelete(null)}
        isLoading={isDeleting}
      />
    </>
  );
}
