'use client';

import React, { useState, useEffect } from 'react';
import { Goals } from '@/types';
import { Target, Scale, Flame, Dumbbell, Sparkles, Check, AlertCircle } from 'lucide-react';

interface GoalFormProps {
  initialGoals: Goals | null;
  onSave: (goals: Omit<Goals, 'id' | 'updatedAt'>) => Promise<{ success: boolean; error?: string }>;
  isSaving: boolean;
}

interface FormErrors {
  dailyCalories?: string;
  protein?: string;
  carbs?: string;
  fat?: string;
  currentWeight?: string;
  targetWeight?: string;
}

export function GoalForm({ initialGoals, onSave, isSaving }: GoalFormProps) {
  const [formData, setFormData] = useState({
    dailyCalories: initialGoals?.dailyCalories ? String(initialGoals.dailyCalories) : '2000',
    protein: initialGoals?.protein ? String(initialGoals.protein) : '130',
    carbs: initialGoals?.carbs ? String(initialGoals.carbs) : '220',
    fat: initialGoals?.fat ? String(initialGoals.fat) : '60',
    currentWeight: initialGoals?.currentWeight ? String(initialGoals.currentWeight) : '75',
    targetWeight: initialGoals?.targetWeight ? String(initialGoals.targetWeight) : '70',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (initialGoals) {
      setFormData({
        dailyCalories: String(initialGoals.dailyCalories),
        protein: String(initialGoals.protein),
        carbs: String(initialGoals.carbs),
        fat: String(initialGoals.fat),
        currentWeight: String(initialGoals.currentWeight),
        targetWeight: String(initialGoals.targetWeight),
      });
    }
  }, [initialGoals]);

  const validateField = (name: string, value: string): string | undefined => {
    const num = parseFloat(value);
    if (!value || value.trim() === '') {
      return 'This field is required';
    }
    if (isNaN(num)) {
      return 'Must be a valid number';
    }
    if (num <= 0) {
      return 'Must be a positive number greater than 0';
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const val = formData[key as keyof typeof formData];
      const err = validateField(key, val);
      if (err) {
        newErrors[key as keyof FormErrors] = err;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      dailyCalories: true,
      protein: true,
      carbs: true,
      fat: true,
      currentWeight: true,
      targetWeight: true,
    });
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    await onSave({
      dailyCalories: parseFloat(formData.dailyCalories),
      protein: parseFloat(formData.protein),
      carbs: parseFloat(formData.carbs),
      fat: parseFloat(formData.fat),
      currentWeight: parseFloat(formData.currentWeight),
      targetWeight: parseFloat(formData.targetWeight),
    });
  };

  // Calculate macro calorie contributions
  const p = parseFloat(formData.protein) || 0;
  const c = parseFloat(formData.carbs) || 0;
  const f = parseFloat(formData.fat) || 0;
  const calculatedMacroCalories = p * 4 + c * 4 + f * 9;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Target summary banner */}
      <div className="bg-[#f6faf6] border border-[#dcecdc] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#eaf5eb] border border-[#d0e8d3] flex items-center justify-center text-[#3b7a57]">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">
              Personalized Nutrition Target
            </h4>
            <p className="text-xs text-slate-500">
              Set realistic daily caloric and macronutrient targets for healthy sustainable progress.
            </p>
          </div>
        </div>

        {initialGoals?.updatedAt && (
          <span className="text-[11px] text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
            Updated {new Date(initialGoals.updatedAt).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Daily Caloric Target Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Flame className="w-4 h-4 text-[#e2a961]" />
            <h3 className="text-sm font-semibold text-slate-800">Energy & Weight</h3>
          </div>

          {/* Daily Calories */}
          <div>
            <label htmlFor="dailyCalories" className="block text-xs font-medium text-slate-700 mb-1">
              Daily Calories Target <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="dailyCalories"
                name="dailyCalories"
                type="number"
                step="1"
                min="1"
                value={formData.dailyCalories}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 text-sm rounded-lg border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 transition-colors ${
                  errors.dailyCalories
                    ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200 text-rose-900'
                    : 'border-slate-200 focus:border-[#3b7a57] focus:ring-[#3b7a57]/20 text-slate-800'
                }`}
                placeholder="e.g. 2100"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">kcal</span>
            </div>
            {errors.dailyCalories && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.dailyCalories}</span>
              </p>
            )}
          </div>

          {/* Weights Row */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label htmlFor="currentWeight" className="block text-xs font-medium text-slate-700 mb-1">
                Current Weight <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="currentWeight"
                  name="currentWeight"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.currentWeight}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 text-sm rounded-lg border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 transition-colors ${
                    errors.currentWeight
                      ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-[#3b7a57] focus:ring-[#3b7a57]/20'
                  }`}
                  placeholder="75.0"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">kg</span>
              </div>
              {errors.currentWeight && (
                <p className="mt-1 text-xs text-rose-600">{errors.currentWeight}</p>
              )}
            </div>

            <div>
              <label htmlFor="targetWeight" className="block text-xs font-medium text-slate-700 mb-1">
                Target Weight <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="targetWeight"
                  name="targetWeight"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.targetWeight}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 text-sm rounded-lg border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 transition-colors ${
                    errors.targetWeight
                      ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-[#3b7a57] focus:ring-[#3b7a57]/20'
                  }`}
                  placeholder="70.0"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">kg</span>
              </div>
              {errors.targetWeight && (
                <p className="mt-1 text-xs text-rose-600">{errors.targetWeight}</p>
              )}
            </div>
          </div>
        </div>

        {/* Macronutrient Distribution Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Dumbbell className="w-4 h-4 text-[#6b9ac4]" />
            <h3 className="text-sm font-semibold text-slate-800">Macronutrients Target (Grams)</h3>
          </div>

          {/* Protein */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="protein" className="block text-xs font-medium text-slate-700">
                Protein Target <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-[#2b6cb0] font-medium bg-[#edf4fb] px-2 py-0.5 rounded">
                4 kcal / g
              </span>
            </div>
            <div className="relative">
              <input
                id="protein"
                name="protein"
                type="number"
                step="1"
                min="1"
                value={formData.protein}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 text-sm rounded-lg border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 transition-colors ${
                  errors.protein
                    ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-[#3b7a57] focus:ring-[#3b7a57]/20'
                }`}
                placeholder="140"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">grams</span>
            </div>
            {errors.protein && <p className="mt-1 text-xs text-rose-600">{errors.protein}</p>}
          </div>

          {/* Carbs */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="carbs" className="block text-xs font-medium text-slate-700">
                Carbohydrates Target <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-[#8c631a] font-medium bg-[#fdf6e7] px-2 py-0.5 rounded">
                4 kcal / g
              </span>
            </div>
            <div className="relative">
              <input
                id="carbs"
                name="carbs"
                type="number"
                step="1"
                min="1"
                value={formData.carbs}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 text-sm rounded-lg border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 transition-colors ${
                  errors.carbs
                    ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-[#3b7a57] focus:ring-[#3b7a57]/20'
                }`}
                placeholder="220"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">grams</span>
            </div>
            {errors.carbs && <p className="mt-1 text-xs text-rose-600">{errors.carbs}</p>}
          </div>

          {/* Fat */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="fat" className="block text-xs font-medium text-slate-700">
                Healthy Fat Target <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-[#993f48] font-medium bg-[#fdf0f0] px-2 py-0.5 rounded">
                9 kcal / g
              </span>
            </div>
            <div className="relative">
              <input
                id="fat"
                name="fat"
                type="number"
                step="1"
                min="1"
                value={formData.fat}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 text-sm rounded-lg border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 transition-colors ${
                  errors.fat
                    ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-[#3b7a57] focus:ring-[#3b7a57]/20'
                }`}
                placeholder="65"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">grams</span>
            </div>
            {errors.fat && <p className="mt-1 text-xs text-rose-600">{errors.fat}</p>}
          </div>
        </div>
      </div>

      {/* Calculated Breakdown Insight */}
      <div className="bg-[#fbfcfc] border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-600 gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#3b7a57]" />
          <span>
            Combined macros equal <strong>{calculatedMacroCalories} kcal</strong> (Target:{' '}
            <strong>{formData.dailyCalories || 0} kcal</strong>)
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="text-[#2b6cb0]">P: {p}g ({Math.round((p * 4 / (calculatedMacroCalories || 1)) * 100)}%)</span>
          <span className="text-[#8c631a]">C: {c}g ({Math.round((c * 4 / (calculatedMacroCalories || 1)) * 100)}%)</span>
          <span className="text-[#993f48]">F: {f}g ({Math.round((f * 9 / (calculatedMacroCalories || 1)) * 100)}%)</span>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-[#3b7a57] text-white hover:bg-[#326749] focus:outline-none focus:ring-2 focus:ring-[#3b7a57]/30 transition-colors disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving Goals...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Save Goals</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
