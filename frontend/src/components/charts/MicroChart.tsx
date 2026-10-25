'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { ReportsData } from '@/types';

interface MicroChartProps {
  micronutrientAverages: ReportsData['micronutrientAverages'];
}

export function MicroChart({ micronutrientAverages }: MicroChartProps) {
  // Let user toggle between All, Vitamins, and Minerals for clarity
  const [filterType, setFilterType] = useState<'all' | 'vitamins' | 'minerals'>('all');

  const filteredItems = micronutrientAverages.filter((item) => {
    if (filterType === 'vitamins') return item.name.startsWith('Vitamin');
    if (filterType === 'minerals') return !item.name.startsWith('Vitamin');
    return true;
  });

  const chartData = filteredItems.map((item) => ({
    name: item.name.replace('Dietary ', ''),
    avgDaily: item.avgDaily,
    unit: item.unit,
    target: item.target,
    pctOfTarget: item.target ? Math.min(150, Math.round((item.avgDaily / item.target) * 100)) : 100,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-slate-200 p-2.5 rounded-lg shadow-xs text-xs space-y-1">
          <p className="font-semibold text-slate-800">{data.name}</p>
          <p className="text-slate-600">
            Average Daily: <strong>{data.avgDaily} {data.unit}</strong>
          </p>
          {data.target && (
            <p className="text-slate-500 text-[11px]">
              Target: {data.target} {data.unit} ({data.pctOfTarget}% achieved)
            </p>
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
          <h3 className="text-sm font-semibold text-slate-800">Micronutrient Summary</h3>
          <p className="text-xs text-slate-500">Average daily intake of essential vitamins and minerals</p>
        </div>

        {/* Filter buttons */}
        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-white text-slate-800 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilterType('minerals')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              filterType === 'minerals'
                ? 'bg-white text-slate-800 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Minerals & Fiber
          </button>
          <button
            type="button"
            onClick={() => setFilterType('vitamins')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              filterType === 'vitamins'
                ? 'bg-white text-slate-800 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Vitamins
          </button>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              angle={-20}
              textAnchor="end"
              interval={0}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avgDaily" fill="#8cb398" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`micro-cell-${index}`}
                  fill={entry.name.startsWith('Vit') ? '#8cb398' : '#7ba4b8'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-end gap-4 text-xs pt-1 border-t border-slate-100">
        <span className="flex items-center gap-1.5 text-slate-500 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#7ba4b8]" />
          <span>Minerals & Fiber</span>
        </span>
        <span className="flex items-center gap-1.5 text-slate-500 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#8cb398]" />
          <span>Vitamins</span>
        </span>
      </div>
    </div>
  );
}
