'use client';

import React, { useState, useRef } from 'react';
import { Camera, UploadCloud, Loader2, Sparkles, X, AlertCircle } from 'lucide-react';
import { ExtractResponse } from '@/types';
import { api } from '@/lib/api';

interface ImageUploaderProps {
  onExtracted: (extractedData: ExtractResponse, imageUrl?: string) => void;
  disabled?: boolean;
}

export function ImageUploader({ onExtracted, disabled = false }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setExtractionError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    setExtractionError(null);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const url = uploadEvent.target?.result as string;
      setPreviewUrl(url);
      extractNutrients(file, url);
    };
    reader.readAsDataURL(file);
  };

  const extractNutrients = async (file: File, imgUrl?: string) => {
    try {
      setIsExtracting(true);
      setExtractionError(null);

      // Call API through lib/api.ts
      const data = await api.extractMealFromPhoto(file);
      onExtracted(data, imgUrl);
    } catch (err: any) {
      setExtractionError(
        err.message || 'Could not recognize meal in photo. You can still fill in the details manually.'
      );
    } finally {
      setIsExtracting(false);
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setExtractionError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-[#fbfcfa] rounded-xl border border-slate-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-[#3b7a57]" />
          <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
            AI Meal Photo Recognition
          </h3>
        </div>
        <span className="text-[11px] text-[#3b7a57] bg-[#edf7ed] px-2 py-0.5 rounded font-medium border border-[#cde8cf]">
          Smart Auto-Fill
        </span>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        Snap or upload a photo of your meal. Our AI will analyze the portion and estimate calories,
        macronutrients, and vitamins.
      </p>

      {/* Upload Drop/Trigger Area */}
      {!previewUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 hover:border-[#3b7a57]/50 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white hover:bg-slate-50/50 group text-center"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={disabled || isExtracting}
          />
          <div className="w-10 h-10 rounded-full bg-[#f2f7f3] text-[#3b7a57] group-hover:bg-[#e4f0e6] flex items-center justify-center mb-2 transition-colors">
            <UploadCloud className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-slate-700">
            Click to upload meal photo or drag & drop
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, or WebP up to 10MB</span>
        </div>
      ) : (
        /* Preview & Extraction Area */
        <div className="relative rounded-xl border border-slate-200 bg-white p-3 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0 bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Meal preview"
              className="w-full h-full object-cover"
            />
            {isExtracting && (
              <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#3b7a57]" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 truncate">
                {selectedFile?.name || 'Meal photo'}
              </span>
              <button
                type="button"
                onClick={handleClear}
                disabled={isExtracting}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isExtracting ? (
              <div className="flex items-center gap-2 text-xs text-slate-600 py-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#3b7a57]" />
                <span>Analyzing ingredients and portion size...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-[#2c6e49] py-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nutrients extracted and filled into form below!</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => selectedFile && extractNutrients(selectedFile, previewUrl)}
                disabled={isExtracting}
                className="text-xs font-medium text-[#3b7a57] hover:underline"
              >
                Re-scan Photo
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isExtracting}
                className="text-xs font-medium text-slate-500 hover:text-slate-700"
              >
                Change Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extraction error message if any */}
      {extractionError && (
        <div className="p-3 rounded-lg bg-[#fdf0f0] border border-[#fbd2d2] text-[#6b2323] text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#c53030]" />
          <span>{extractionError}</span>
        </div>
      )}

      {/* Requirement Notice */}
      <div className="p-2.5 rounded-lg bg-[#fdfaf2] border border-[#f5ebd5] text-[#705315] text-[11px] flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-[#b5811d]" />
        <span>AI values are estimates, please review before saving</span>
      </div>
    </div>
  );
}
