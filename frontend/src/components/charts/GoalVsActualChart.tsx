'use client';

import React from 'react';
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
import { ReportsData } from '@/types';
import Link from 'next/link';
import { Target, ArrowUpRight } from 'lucide-react';

interface GoalVsActualChartProps {
  goalVsActual: ReportsData['goalVsActual'];
  hasGoals: boolean;
}

export function GoalVsActualChart({ goalVsActual, hasGoals }: GoalVsActualChartProps) {
  if (!hasGoals) {
    return (
      <div className="bg-[#fbfcfa] rounded-xl border border-slate-200 p-8 text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-[#eef7ee] border border-[#d5edd7] text-[#3b7a57] flex items-center justify-center mx-auto">
          <Target className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-semibold text-slate-800">No Nutrition Goals Set Yet</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Define your daily target calories, protein, carbs, and fat to see goal vs actual comparison charts.
        </p>
        <div>
          <Link
            href="/goals"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-[#3b7a57] text-white hover:bg-[#326749] transition-colors"
          >
            <span>Set Your Goals</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const actual = payload.find((item: any) => item.dataKey === 'actual')?.value || 0;
      const target = payload.find((item: any) => item.dataKey === 'target')?.value || 0;
      const unit = payload[0]?.payload?.unit || '';
      const pct = target > 0 ? Math.round((actual / target) * 100) : 0;

      return (
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-xs text-xs space-y-1">
          <p className="font-semibold text-slate-800">{label}</p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">Actual Average:</span>
            <span className="font-semibold text-[#528265]">{actual} {unit}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">Target Goal:</span>
            <span className="font-medium text-slate-600">{target} {unit}</span>
          </div>
          <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Achieved:</span>
            <span className="font-semibold text-slate-700">{pct}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Goal vs. Actual Comparison</h3>
          <p className="text-xs text-slate-500">Average daily intake compared against your set targets</p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#528265]" />
            <span>Actual</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#cbd5e1]" />
            <span>Target Goal</span>
          </span>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {goalVsActual.map((item) => {
          const isOver = item.percentage > 105;
          const isNear = item.percentage >= 90 && item.percentage <= 105;
          let badgeBg = 'bg-[#edf7ed] text-[#2c6e49] border-[#d2edd7]'; // on target
          if (isOver) {
            badgeBg = 'bg-[#fdf7ea] text-[#8c631a] border-[#fae5be]';
          } else if (item.percentage < 80) {
            badgeBg = 'bg-[#edf5fb] text-[#1e4c74] border-[#d0e4f7]';
          }

          return (
            <div key={item.metric} className="p-3 rounded-lg bg-slate-50/70 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">{item.metric}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${badgeBg}`}>
                  {item.percentage}%
                </span>
              </div>
              <p className="text-xs text-slate-600">
                <span className="font-bold text-slate-900">{item.actual}</span>{' '}
                <span className="text-slate-400">/ {item.target} {item.unit}</span>
              </p>
              {/* Simple subtle flat progress bar */}
              <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#528265] h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, item.percentage)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bar Chart comparing values */}
      <div className="h-60 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={goalVsActual} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="metric"
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
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="actual" name="Actual" fill="#528265" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" name="Target" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
