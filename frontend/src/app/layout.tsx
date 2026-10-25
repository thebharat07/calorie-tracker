import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/hooks/useToast';
import { Navbar } from '@/components/layout/Navbar';
import { Toast } from '@/components/layout/Toast';

export const metadata: Metadata = {
  title: 'CalorieTrack — Daily Nutrition & Meal Log Tracker',
  description: 'Track daily calories, macros, set nutritional goals, scan meals with AI, and analyze past records.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#fbfcfc] text-slate-800 antialiased">
        <ToastProvider>
          <Navbar />
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {children}
          </main>
          <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>CalorieTrack © 2026. Clean, mindful nutrition tracking.</p>
              <div className="flex items-center gap-4 text-slate-500">
                <span>No Gradients</span>
                <span>•</span>
                <span>Simple Light Tints</span>
                <span>•</span>
                <span>Accurate Insights</span>
              </div>
            </div>
          </footer>
          <Toast />
        </ToastProvider>
      </body>
    </html>
  );
}
