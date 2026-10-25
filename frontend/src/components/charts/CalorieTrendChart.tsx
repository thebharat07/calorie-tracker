'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { DailySummary } from '@/types';

interface CalorieTrendChartProps {
  data: DailySummary[];
  goalCalories: number;
}

export function CalorieTrendChart({ data, goalCalories }: CalorieTrendChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    displayDate: new Date(d.date + 'T00:00:00').toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    }),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const actualVal = payload[0]?.value || 0;
      const diff = goalCalories ? actualVal - goalCalories : 0;
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-xs text-xs space-y-1">
          <p className="font-semibold text-slate-800">{label}</p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">Actual Intake:</span>
            <span className="font-semibold text-[#528265]">{actualVal} kcal</span>
          </div>
          {goalCalories > 0 && (
            <>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Daily Target:</span>
                <span className="font-medium text-slate-600">{goalCalories} kcal</span>
              </div>
              <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-100 text-[11px]">
                <span className="text-slate-400">Difference:</span>
                <span className={diff > 0 ? 'text-amber-600 font-medium' : 'text-slate-600 font-medium'}>
                  {diff > 0 ? `+${diff}` : diff} kcal
                </span>
              </div>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Calorie Trend vs Daily Target</h3>
          <p className="text-xs text-slate-500">Tracking daily caloric consumption against your set target</p>
        </div>
        {goalCalories > 0 && (
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-0.5 bg-[#528265] inline-block rounded" />
              <span>Intake</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-[#94a3b8] inline-block" />
              <span>Goal ({goalCalories} kcal)</span>
            </span>
          </div>
        )}
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="displayDate"
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
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            {goalCalories > 0 && (
              <ReferenceLine
                y={goalCalories}
                stroke="#94a3b8"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: 'Goal',
                  position: 'insideTopRight',
                  fill: '#64748b',
                  fontSize: 10,
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#528265"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#528265', stroke: '#ffffff', strokeWidth: 1.5 }}
              activeDot={{ r: 6, fill: '#3b7a57' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
