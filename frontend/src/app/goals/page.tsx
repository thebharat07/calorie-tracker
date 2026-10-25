'use client';

import React from 'react';
import { useGoals } from '@/hooks/useGoals';
import { GoalForm } from '@/components/forms/GoalForm';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Target, AlertCircle } from 'lucide-react';

export default function GoalsPage() {
  const { goals, loading, saving, error, saveGoals } = useGoals();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Target className="w-6 h-6 text-[#3b7a57]" />
            <span>Nutritional & Weight Goals</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Set your daily caloric ceiling, macronutrient distribution, and target body weight.
          </p>
        </div>
      </div>

      {/* Error Alert if initial fetch failed */}
      {error && !saving && (
        <div className="p-4 rounded-xl bg-[#fdf0f0] border border-[#fbd2d2] text-[#6b2323] text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#c53030]" />
          <div>
            <p className="font-semibold">Unable to sync goals</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Loading State or Goal Form */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12">
          <LoadingSpinner label="Loading current goals..." size="lg" />
        </div>
      ) : (
        <GoalForm initialGoals={goals} onSave={saveGoals} isSaving={saving} />
      )}
    </div>
  );
}
