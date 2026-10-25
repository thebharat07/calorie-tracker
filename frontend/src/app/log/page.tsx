'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { EntryForm } from '@/components/forms/EntryForm';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import { api } from '@/lib/api';
import { MealEntry } from '@/types';
import { PlusCircle, Edit3, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function LogMealContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get('edit');
  const toast = useToast();

  const [initialEntry, setInitialEntry] = useState<MealEntry | null>(null);
  const [isLoadingEntry, setIsLoadingEntry] = useState(Boolean(editId));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editId) {
      setIsLoadingEntry(true);
      api
        .getEntryById(editId)
        .then((data) => {
          setInitialEntry(data);
        })
        .catch((err) => {
          toast.error(err.message || 'Could not find meal entry to edit');
          router.push('/entries');
        })
        .finally(() => {
          setIsLoadingEntry(false);
        });
    } else {
      setInitialEntry(null);
      setIsLoadingEntry(false);
    }
  }, [editId, router, toast]);

  const handleSave = async (entryData: Omit<MealEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSaving(true);
      if (editId) {
        await api.updateEntry(editId, entryData);
        toast.success(`"${entryData.foodName}" updated successfully!`, 'Meal Updated');
      } else {
        await api.createEntry(entryData);
        toast.success(`"${entryData.foodName}" logged successfully!`, 'Meal Saved');
      }
      router.push('/entries');
      return { success: true };
    } catch (err: any) {
      const msg = err.message || 'Failed to save meal entry';
      toast.error(msg, 'Save Error');
      return { success: false, error: msg };
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/entries"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors mr-1"
              title="Back to entries"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              {editId ? (
                <>
                  <Edit3 className="w-5 h-5 text-[#3b7a57]" />
                  <span>Edit Meal Entry</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5 text-[#3b7a57]" />
                  <span>Log New Meal</span>
                </>
              )}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 pl-7">
            {editId
              ? 'Update food information, portion, or macronutrient distribution.'
              : 'Add dishes and snacks with instant AI photo nutrient extraction.'}
          </p>
        </div>
      </div>

      {isLoadingEntry ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12">
          <LoadingSpinner label="Loading meal entry details..." size="lg" />
        </div>
      ) : (
        <EntryForm
          initialEntry={initialEntry}
          onSave={handleSave}
          isSaving={isSaving}
          isEditing={Boolean(editId)}
        />
      )}
    </div>
  );
}

export default function LogPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-xl border border-slate-200 p-12 max-w-3xl mx-auto">
          <LoadingSpinner label="Loading form..." size="lg" />
        </div>
      }
    >
      <LogMealContent />
    </Suspense>
  );
}
