'use client';

import React, { useState, useEffect } from 'react';
import { MealEntry, MealType, Micronutrients, ExtractResponse } from '@/types';
import { ImageUploader } from './ImageUploader';
import { 
  ChevronDown, 
  ChevronUp, 
  Utensils, 
  Save, 
  Calendar, 
  Clock, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface EntryFormProps {
  initialEntry?: MealEntry | null;
  onSave: (entryData: Omit<MealEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; error?: string }>;
  isSaving: boolean;
  isEditing?: boolean;
}

interface FormErrors {
  date?: string;
  mealType?: string;
  foodName?: string;
  quantity?: string;
  unit?: string;
  calories?: string;
  protein?: string;
  carbs?: string;
  fat?: string;
}

const mealOptions: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export function EntryForm({ initialEntry, onSave, isSaving, isEditing = false }: EntryFormProps) {
  const [date, setDate] = useState(initialEntry?.date || '');
  const [time, setTime] = useState(initialEntry?.time || '');
  const [mealType, setMealType] = useState<MealType>('Breakfast');
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('serving');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('0');
  const [carbs, setCarbs] = useState('0');
  const [fat, setFat] = useState('0');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState('');

  // Collapsible Micronutrients section
  const [isMicroOpen, setIsMicroOpen] = useState(false);
  const [micros, setMicros] = useState<Micronutrients>({
    fiber: 0,
    sugar: 0,
    sodium: 0,
    calcium: 0,
    iron: 0,
    potassium: 0,
    vitaminA: 0,
    vitaminC: 0,
    vitaminD: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Ensure default date and time are initialized on client
  useEffect(() => {
    if (!date) {
      setDate(new Date().toISOString().split('T')[0]);
    }
    if (!time) {
      setTime(new Date().toTimeString().slice(0, 5));
    }
  }, [date, time]);

  // When initialEntry changes (e.g. edit mode loaded)
  useEffect(() => {
    if (initialEntry) {
      setDate(initialEntry.date);
      setTime(initialEntry.time || '');
      setMealType(initialEntry.mealType || 'Breakfast');
      setFoodName(initialEntry.foodName || '');
      setQuantity(String(initialEntry.quantity ?? 1));
      setUnit(initialEntry.unit || 'serving');
      setCalories(String(initialEntry.calories ?? ''));
      setProtein(String(initialEntry.protein ?? 0));
      setCarbs(String(initialEntry.carbs ?? 0));
      setFat(String(initialEntry.fat ?? 0));
      setImageUrl(initialEntry.imageUrl);
      setNotes(initialEntry.notes || '');

      if (initialEntry.micronutrients) {
        setMicros({
          fiber: initialEntry.micronutrients.fiber ?? 0,
          sugar: initialEntry.micronutrients.sugar ?? 0,
          sodium: initialEntry.micronutrients.sodium ?? 0,
          calcium: initialEntry.micronutrients.calcium ?? 0,
          iron: initialEntry.micronutrients.iron ?? 0,
          potassium: initialEntry.micronutrients.potassium ?? 0,
          vitaminA: initialEntry.micronutrients.vitaminA ?? 0,
          vitaminC: initialEntry.micronutrients.vitaminC ?? 0,
          vitaminD: initialEntry.micronutrients.vitaminD ?? 0,
        });
        // Auto expand if initial entry had custom micronutrients
        const hasCustomMicros = Object.values(initialEntry.micronutrients).some((v) => v && v > 0);
        if (hasCustomMicros) setIsMicroOpen(true);
      }
    }
  }, [initialEntry]);

  // Handle Photo AI auto-fill
  const handlePhotoExtracted = (extracted: ExtractResponse, imgUrl?: string) => {
    if (extracted.foodName) setFoodName(extracted.foodName);
    if (extracted.mealType) setMealType(extracted.mealType);
    if (extracted.quantity) setQuantity(String(extracted.quantity));
    if (extracted.unit) setUnit(extracted.unit);
    if (extracted.calories !== undefined) setCalories(String(extracted.calories));
    if (extracted.protein !== undefined) setProtein(String(extracted.protein));
    if (extracted.carbs !== undefined) setCarbs(String(extracted.carbs));
    if (extracted.fat !== undefined) setFat(String(extracted.fat));
    if (imgUrl) setImageUrl(imgUrl);

    if (extracted.micronutrients) {
      setMicros({
        fiber: extracted.micronutrients.fiber ?? 0,
        sugar: extracted.micronutrients.sugar ?? 0,
        sodium: extracted.micronutrients.sodium ?? 0,
        calcium: extracted.micronutrients.calcium ?? 0,
        iron: extracted.micronutrients.iron ?? 0,
        potassium: extracted.micronutrients.potassium ?? 0,
        vitaminA: extracted.micronutrients.vitaminA ?? 0,
        vitaminC: extracted.micronutrients.vitaminC ?? 0,
        vitaminD: extracted.micronutrients.vitaminD ?? 0,
      });
      setIsMicroOpen(true);
    }

    // Clear validation errors for filled fields
    setErrors({});
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    let valid = true;

    if (!date) {
      errs.date = 'Date is required';
      valid = false;
    }

    if (!foodName.trim()) {
      errs.foodName = 'Food or meal name is required';
      valid = false;
    }

    const qty = parseFloat(quantity);
    if (!quantity || isNaN(qty) || qty <= 0) {
      errs.quantity = 'Quantity must be greater than 0';
      valid = false;
    }

    if (!unit.trim()) {
      errs.unit = 'Unit is required';
      valid = false;
    }

    const cal = parseFloat(calories);
    if (calories === '' || isNaN(cal) || cal < 0) {
      errs.calories = 'Calories must be 0 or a positive number';
      valid = false;
    }

    const p = parseFloat(protein);
    if (protein === '' || isNaN(p) || p < 0) {
      errs.protein = 'Protein cannot be negative';
      valid = false;
    }

    const c = parseFloat(carbs);
    if (carbs === '' || isNaN(c) || c < 0) {
      errs.carbs = 'Carbs cannot be negative';
      valid = false;
    }

    const f = parseFloat(fat);
    if (fat === '' || isNaN(f) || f < 0) {
      errs.fat = 'Fat cannot be negative';
      valid = false;
    }

    setErrors(errs);
    setTouched({
      date: true,
      foodName: true,
      quantity: true,
      unit: true,
      calories: true,
      protein: true,
      carbs: true,
      fat: true,
    });

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSave({
      date,
      time: time || undefined,
      mealType,
      foodName: foodName.trim(),
      quantity: parseFloat(quantity),
      unit: unit.trim(),
      calories: parseFloat(calories),
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      micronutrients: micros,
      imageUrl,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photo AI Uploader */}
      <ImageUploader onExtracted={handlePhotoExtracted} disabled={isSaving} />

      {/* Main Meal Info Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Utensils className="w-4 h-4 text-[#3b7a57]" />
          <h3 className="text-sm font-semibold text-slate-800">
            {isEditing ? 'Edit Meal Details' : 'Meal Details'}
          </h3>
        </div>

        {/* Date, Time, and Meal Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Date */}
          <div>
            <label htmlFor="mealDate" className="block text-xs font-medium text-slate-700 mb-1">
              Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="mealDate"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full px-3 py-2 text-sm rounded-lg border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 transition-colors ${
                  errors.date
                    ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-[#3b7a57] focus:ring-[#3b7a57]/20'
                }`}
              />
            </div>
            {errors.date && <p className="mt-1 text-xs text-rose-600">{errors.date}</p>}
          </div>

          {/* Time */}
          <div>
            <label htmlFor="mealTime" className="block text-xs font-medium text-slate-700 mb-1">
              Time
            </label>
            <input
              id="mealTime"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:border-[#3b7a57] focus:ring-[#3b7a57]/20"
            />
          </div>

          {/* Meal Type */}
          <div>
            <label htmlFor="mealType" className="block text-xs font-medium text-slate-700 mb-1">
              Meal Type <span className="text-rose-500">*</span>
            </label>
            <select
              id="mealType"
              value={mealType}
              onChange={(e) => setMealType(e.target.value as MealType)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:border-[#3b7a57] focus:ring-[#3b7a57]/20"
            >
              {mealOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Food Name */}
        <div>
          <label htmlFor="foodName" className="block text-xs font-medium text-slate-700 mb-1">
            Food / Dish Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="foodName"
            type="text"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder="e.g. Grilled Chicken Salad or Greek Yogurt"
            className={`w-full px-3 py-2 text-sm rounded-lg border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 transition-colors ${
              errors.foodName
                ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
                : 'border-slate-200 focus:border-[#3b7a57] focus:ring-[#3b7a57]/20'
            }`}
          />
          {errors.foodName && (
            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.foodName}</span>
            </p>
          )}
        </div>

        {/* Quantity and Unit */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="quantity" className="block text-xs font-medium text-slate-700 mb-1">
              Quantity <span className="text-rose-500">*</span>
            </label>
            <input
              id="quantity"
              type="number"
              step="0.1"
              min="0.1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="1"
              className={`w-full px-3 py-2 text-sm rounded-lg border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 transition-colors ${
                errors.quantity
                  ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-[#3b7a57] focus:ring-[#3b7a57]/20'
              }`}
            />
            {errors.quantity && <p className="mt-1 text-xs text-rose-600">{errors.quantity}</p>}
          </div>

          <div>
            <label htmlFor="unit" className="block text-xs font-medium text-slate-700 mb-1">
              Portion Unit <span className="text-rose-500">*</span>
            </label>
            <input
              id="unit"
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g. bowl, plate, grams, slices"
              className={`w-full px-3 py-2 text-sm rounded-lg border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 transition-colors ${
                errors.unit
                  ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-[#3b7a57] focus:ring-[#3b7a57]/20'
              }`}
            />
            {errors.unit && <p className="mt-1 text-xs text-rose-600">{errors.unit}</p>}
          </div>
        </div>
      </div>

      {/* Macronutrient Fields Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">Macronutrients & Calories</h3>
          <span className="text-[11px] text-slate-500">Non-negative values</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Calories */}
          <div>
            <label htmlFor="calories" className="block text-xs font-medium text-slate-700 mb-1">
              Calories <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="calories"
                type="number"
                step="1"
                min="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="450"
                className={`w-full px-3 py-2 text-sm rounded-lg border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 transition-colors ${
                  errors.calories
                    ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-[#3b7a57] focus:ring-[#3b7a57]/20'
                }`}
              />
              <span className="absolute right-2.5 top-2.5 text-[11px] text-slate-400">kcal</span>
            </div>
            {errors.calories && <p className="mt-1 text-xs text-rose-600">{errors.calories}</p>}
          </div>

          {/* Protein */}
          <div>
            <label htmlFor="entryProtein" className="block text-xs font-medium text-slate-700 mb-1">
              Protein
            </label>
            <div className="relative">
              <input
                id="entryProtein"
                type="number"
                step="0.5"
                min="0"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="25"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:border-[#3b7a57] focus:ring-[#3b7a57]/20"
              />
              <span className="absolute right-2.5 top-2.5 text-[11px] text-slate-400">g</span>
            </div>
          </div>

          {/* Carbs */}
          <div>
            <label htmlFor="entryCarbs" className="block text-xs font-medium text-slate-700 mb-1">
              Carbohydrates
            </label>
            <div className="relative">
              <input
                id="entryCarbs"
                type="number"
                step="0.5"
                min="0"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="40"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:border-[#3b7a57] focus:ring-[#3b7a57]/20"
              />
              <span className="absolute right-2.5 top-2.5 text-[11px] text-slate-400">g</span>
            </div>
          </div>

          {/* Fat */}
          <div>
            <label htmlFor="entryFat" className="block text-xs font-medium text-slate-700 mb-1">
              Fat
            </label>
            <div className="relative">
              <input
                id="entryFat"
                type="number"
                step="0.5"
                min="0"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                placeholder="12"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:border-[#3b7a57] focus:ring-[#3b7a57]/20"
              />
              <span className="absolute right-2.5 top-2.5 text-[11px] text-slate-400">g</span>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Micronutrients Section */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <button
          type="button"
          onClick={() => setIsMicroOpen(!isMicroOpen)}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-800">
              Micronutrients & Vitamins (Optional)
            </span>
            <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Fiber, Sodium, Vitamins
            </span>
          </div>
          {isMicroOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {isMicroOpen && (
          <div className="p-5 border-t border-slate-100 bg-[#fafbfa] space-y-4">
            <p className="text-xs text-slate-500">
              Track essential dietary minerals and vitamins to balance your daily nutritional intake.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Fiber */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Fiber</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={micros.fiber || ''}
                    onChange={(e) => setMicros({ ...micros, fiber: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:border-[#3b7a57]"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">g</span>
                </div>
              </div>

              {/* Sugar */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Sugar</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={micros.sugar || ''}
                    onChange={(e) => setMicros({ ...micros, sugar: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:border-[#3b7a57]"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">g</span>
                </div>
              </div>

              {/* Sodium */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Sodium</label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={micros.sodium || ''}
                    onChange={(e) => setMicros({ ...micros, sodium: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:border-[#3b7a57]"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">mg</span>
                </div>
              </div>

              {/* Calcium */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Calcium</label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={micros.calcium || ''}
                    onChange={(e) => setMicros({ ...micros, calcium: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:border-[#3b7a57]"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">mg</span>
                </div>
              </div>

              {/* Iron */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Iron</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={micros.iron || ''}
                    onChange={(e) => setMicros({ ...micros, iron: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:border-[#3b7a57]"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">mg</span>
                </div>
              </div>

              {/* Potassium */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Potassium</label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={micros.potassium || ''}
                    onChange={(e) => setMicros({ ...micros, potassium: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:border-[#3b7a57]"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">mg</span>
                </div>
              </div>

              {/* Vitamin A */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Vitamin A</label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={micros.vitaminA || ''}
                    onChange={(e) => setMicros({ ...micros, vitaminA: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:border-[#3b7a57]"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">mcg</span>
                </div>
              </div>

              {/* Vitamin C */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Vitamin C</label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={micros.vitaminC || ''}
                    onChange={(e) => setMicros({ ...micros, vitaminC: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:border-[#3b7a57]"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">mg</span>
                </div>
              </div>

              {/* Vitamin D */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Vitamin D</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={micros.vitaminD || ''}
                    onChange={(e) => setMicros({ ...micros, vitaminD: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:border-[#3b7a57]"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">mcg</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Optional Notes */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <label htmlFor="notes" className="block text-xs font-medium text-slate-700 mb-1">
          Notes or Preparation Remarks (Optional)
        </label>
        <textarea
          id="notes"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Cooked in olive oil, no added salt"
          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:border-[#3b7a57] focus:ring-[#3b7a57]/20"
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-[#3b7a57] text-white hover:bg-[#326749] focus:outline-none focus:ring-2 focus:ring-[#3b7a57]/30 transition-colors disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving Meal Entry...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Update Meal Entry' : 'Save Meal Entry'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
