'use client';

import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

interface MacroPieChartProps {
  macroTotals: {
    protein: number;
    carbs: number;
    fat: number;
    proteinCalories: number;
    carbsCalories: number;
    fatCalories: number;
    totalCalories: number;
    proteinPercent: number;
    carbsPercent: number;
    fatPercent: number;
  };
}

export function MacroPieChart({ macroTotals }: MacroPieChartProps) {
  const pieData = [
    {
      name: 'Protein',
      value: macroTotals.proteinPercent,
      grams: macroTotals.protein,
      calories: macroTotals.proteinCalories,
      color: '#7fa9c6',
      textColor: 'text-[#1e4c74]',
    },
    {
      name: 'Carbs',
      value: macroTotals.carbsPercent,
      grams: macroTotals.carbs,
      calories: macroTotals.carbsCalories,
      color: '#e5b869',
      textColor: 'text-[#8c631a]',
    },
    {
      name: 'Fat',
      value: macroTotals.fatPercent,
      grams: macroTotals.fat,
      calories: macroTotals.fatCalories,
      color: '#de8990',
      textColor: 'text-[#993f48]',
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-slate-200 p-2.5 rounded-lg shadow-xs text-xs space-y-1">
          <p className="font-semibold text-slate-800">{data.name}</p>
          <p className="text-slate-600">
            Share: <strong>{data.value}%</strong>
          </p>
          <p className="text-slate-500 text-[11px]">
            {data.grams}g ({data.calories} kcal)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 flex flex-col justify-between">
      <div className="pb-2 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800">Macro Split (% Calories)</h3>
        <p className="text-xs text-slate-500">Proportional calorie energy contribution</p>
      </div>

      <div className="relative h-48 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={78}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[11px] text-slate-400 font-medium">Energy Split</span>
          <span className="text-sm font-semibold text-slate-700">100%</span>
        </div>
      </div>

      {/* Legend & Gram stats */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
        {pieData.map((item) => (
          <div key={item.name} className="p-2 rounded-lg bg-slate-50/70 border border-slate-100">
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs font-semibold text-slate-700">{item.name}</span>
            </div>
            <p className={`text-sm font-bold ${item.textColor}`}>{item.value}%</p>
            <p className="text-[10px] text-slate-400">{item.grams}g</p>
          </div>
        ))}
      </div>
    </div>
  );
}
