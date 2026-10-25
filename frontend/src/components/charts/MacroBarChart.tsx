'use client';

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { DailySummary } from '@/types';

interface MacroBarChartProps {
  data: DailySummary[];
}

export function MacroBarChart({ data }: MacroBarChartProps) {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  // Prepare chart data by day
  const dailyData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      label: new Date(d.date + 'T00:00:00').toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
    }));
  }, [data]);

  // Group by weekly intervals if toggle is week
  const weeklyData = useMemo(() => {
    if (data.length === 0) return [];

    const weeks: { [weekLabel: string]: { protein: number; carbs: number; fat: number; count: number } } = {};

    data.forEach((d) => {
      const dt = new Date(d.date + 'T00:00:00');
      // Calculate start of week (Sunday)
      const startOfWeek = new Date(dt);
      startOfWeek.setDate(dt.getDate() - dt.getDay());
      const label = `Wk of ${startOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;

      if (!weeks[label]) {
        weeks[label] = { protein: 0, carbs: 0, fat: 0, count: 0 };
      }
      weeks[label].protein += d.protein;
      weeks[label].carbs += d.carbs;
      weeks[label].fat += d.fat;
      weeks[label].count += 1;
    });

    return Object.keys(weeks).map((label) => ({
      label,
      protein: Math.round(weeks[label].protein),
      carbs: Math.round(weeks[label].carbs),
      fat: Math.round(weeks[label].fat),
    }));
  }, [data]);

  const chartData = viewMode === 'day' ? dailyData : weeklyData;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const p = payload.find((item: any) => item.dataKey === 'protein')?.value || 0;
      const c = payload.find((item: any) => item.dataKey === 'carbs')?.value || 0;
      const f = payload.find((item: any) => item.dataKey === 'fat')?.value || 0;
      const totalGrams = p + c + f;

      return (
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-xs text-xs space-y-1.5">
          <p className="font-semibold text-slate-800">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#7fa9c6]" />
                <span>Protein:</span>
              </span>
              <span className="font-semibold text-[#1e4c74]">{p}g</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#e5b869]" />
                <span>Carbohydrates:</span>
              </span>
              <span className="font-semibold text-[#8c631a]">{c}g</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#de8990]" />
                <span>Fat:</span>
              </span>
              <span className="font-semibold text-[#993f48]">{f}g</span>
            </div>
          </div>
          <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Total Macros:</span>
            <span className="font-semibold text-slate-700">{totalGrams}g</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Macronutrient Intake Breakdown</h3>
          <p className="text-xs text-slate-500">Stacked distribution of daily protein, carbs, and fat (grams)</p>
        </div>

        {/* Day / Week Toggle */}
        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
          <button
            type="button"
            onClick={() => setViewMode('day')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'day'
                ? 'bg-white text-slate-800 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            By Day
          </button>
          <button
            type="button"
            onClick={() => setViewMode('week')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'week'
                ? 'bg-white text-slate-800 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            By Week
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-4 text-xs pt-1">
        <span className="flex items-center gap-1.5 text-slate-600">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#7fa9c6]" />
          <span>Protein</span>
        </span>
        <span className="flex items-center gap-1.5 text-slate-600">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#e5b869]" />
          <span>Carbs</span>
        </span>
        <span className="flex items-center gap-1.5 text-slate-600">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#de8990]" />
          <span>Fat</span>
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}g`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="protein" stackId="macros" fill="#7fa9c6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="carbs" stackId="macros" fill="#e5b869" radius={[0, 0, 0, 0]} />
            <Bar dataKey="fat" stackId="macros" fill="#de8990" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
