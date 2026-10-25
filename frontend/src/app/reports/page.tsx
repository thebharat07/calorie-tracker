'use client';

import React from 'react';
import { useReports } from '@/hooks/useReports';
import { CalorieTrendChart } from '@/components/charts/CalorieTrendChart';
import { MacroBarChart } from '@/components/charts/MacroBarChart';
import { MacroPieChart } from '@/components/charts/MacroPieChart';
import { MicroChart } from '@/components/charts/MicroChart';
import { GoalVsActualChart } from '@/components/charts/GoalVsActualChart';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { BarChart3, Calendar, Target, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function ReportsPage() {
  const { data, loading, startDate, endDate, setRange, selectPreset } = useReports();

  return (
    <div className="space-y-6">
      {/* Header & Shared Date Range Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#3b7a57]" />
            <span>Nutrition Reports & Analysis</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Calorie trends, macronutrient splits, micronutrient averages, and target fulfillment.
          </p>
        </div>

        {/* Shared Date Range Selector Across Charts */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 px-1">
            <Calendar className="w-3.5 h-3.5 text-[#3b7a57]" />
            <span>Period:</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => selectPreset(7)}
              className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => selectPreset(14)}
              className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              14 Days
            </button>
            <button
              type="button"
              onClick={() => selectPreset(30)}
              className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              30 Days
            </button>
          </div>

          <div className="flex items-center gap-1.5 pl-2 sm:border-l border-slate-200">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setRange(e.target.value, endDate)}
              className="px-2 py-1 text-xs rounded border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:border-[#3b7a57]"
            />
            <span className="text-slate-400 text-xs">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setRange(startDate, e.target.value)}
              className="px-2 py-1 text-xs rounded border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:border-[#3b7a57]"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12">
          <LoadingSpinner label="Compiling nutrition analytics & trends..." size="lg" />
        </div>
      ) : !data || data.dailySummaries.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No analytics for this date range"
          description="Log meals within the selected dates or broaden your date range to generate charts."
          actionHref="/log"
          actionLabel="Log a Meal"
        />
      ) : (
        <div className="space-y-6">
          {/* Goal Prompt Notice if goals are missing */}
          {!data.hasGoals && (
            <div className="p-4 rounded-xl bg-[#fdfaf2] border border-[#f5ebd5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#705315]">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 flex-shrink-0 text-[#b5811d]" />
                <div>
                  <p className="font-semibold text-slate-800">You haven&apos;t configured your nutrition goals</p>
                  <p className="text-slate-600 mt-0.5">
                    Set your daily calorie target and macro targets to unlock comparison lines and goal progress.
                  </p>
                </div>
              </div>
              <Link
                href="/goals"
                className="px-3.5 py-1.5 rounded-lg bg-[#3b7a57] text-white hover:bg-[#326749] font-medium transition-colors whitespace-nowrap text-center"
              >
                Set Goals Now
              </Link>
            </div>
          )}

          {/* 1. Goal vs. Actual Chart */}
          <GoalVsActualChart
            goalVsActual={data.goalVsActual}
            hasGoals={data.hasGoals}
          />

          {/* 2. Weekly / Daily Calorie Trend Chart with Goal Line */}
          <CalorieTrendChart
            data={data.dailySummaries}
            goalCalories={data.goals?.dailyCalories || 0}
          />

          {/* 3. Macronutrient Breakdown: Stacked Bar Chart & Pie Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MacroBarChart data={data.dailySummaries} />
            </div>
            <div className="lg:col-span-1">
              <MacroPieChart macroTotals={data.macroTotals} />
            </div>
          </div>

          {/* 4. Micronutrient Summary: Bar Chart of Average Daily Vitamins & Minerals */}
          <MicroChart micronutrientAverages={data.micronutrientAverages} />
        </div>
      )}
    </div>
  );
}
