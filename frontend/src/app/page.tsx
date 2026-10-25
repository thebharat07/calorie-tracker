import Link from 'next/link';
import { Target, PlusCircle, Calendar, BarChart3, Flame, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-8 py-4">
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#eef7ee] text-[#2c6e49] border border-[#d2edd7]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mindful Daily Nutrition & Energy Tracking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
          Track Your Calories, Set Clear Targets & Analyze Health Records
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Welcome to CalorieTrack. Set daily calorie and macro goals, log meals with instant AI photo
          estimation, review detailed timelines, and examine comprehensive nutrition reports.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Link
            href="/log"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[#3b7a57] text-white hover:bg-[#326749] transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log a Meal Now</span>
          </Link>

          <Link
            href="/entries"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>View Meal Entries</span>
          </Link>
        </div>
      </div>

      {/* Feature Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Goals */}
        <Link
          href="/goals"
          className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-[#3b7a57]/40 hover:bg-[#fcfdfc] transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#fdf7ea] border border-[#f8e6c4] text-[#8c631a] flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm group-hover:text-[#3b7a57] transition-colors">
                Goal Setting
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Configure your daily calorie target, protein, carbs, fat, and body weight goals.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[#3b7a57] group-hover:translate-x-1 transition-transform">
            <span>Configure Goals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Log Meal */}
        <Link
          href="/log"
          className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-[#3b7a57]/40 hover:bg-[#fcfdfc] transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#eef7ee] border border-[#d2edd7] text-[#2c6e49] flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm group-hover:text-[#3b7a57] transition-colors">
                Meal Entry & AI Scan
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Log breakfast, lunch, dinner, or snacks with photo upload and micronutrient tracking.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[#3b7a57] group-hover:translate-x-1 transition-transform">
            <span>Add Meal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Entries */}
        <Link
          href="/entries"
          className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-[#3b7a57]/40 hover:bg-[#fcfdfc] transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#edf5fb] border border-[#d0e4f7] text-[#1e4c74] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm group-hover:text-[#3b7a57] transition-colors">
                Time-Range Listing
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Filter by date and meal category, view per-day totals, edit, and delete entries.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[#3b7a57] group-hover:translate-x-1 transition-transform">
            <span>Explore Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Reports */}
        <Link
          href="/reports"
          className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-[#3b7a57]/40 hover:bg-[#fcfdfc] transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#f4f1fa] border border-[#e2d9f3] text-[#553c7b] flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm group-hover:text-[#3b7a57] transition-colors">
                Nutrition Reports
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Weekly trends, macro stacked charts, percentage donut, and goal vs. actual comparisons.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[#3b7a57] group-hover:translate-x-1 transition-transform">
            <span>View Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>
    </div>
  );
}
