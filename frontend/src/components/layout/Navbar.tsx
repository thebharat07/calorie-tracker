'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Target, 
  PlusCircle, 
  Calendar, 
  BarChart3, 
  Menu, 
  X,
  Flame
} from 'lucide-react';

const navItems = [
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/log', label: 'Log Meal', icon: PlusCircle },
  { href: '/entries', label: 'Entries', icon: Calendar },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link href="/entries" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-[#eef7ee] border border-[#d2ecd4] flex items-center justify-center text-[#2e6930]">
              <Flame className="w-5 h-5 text-[#3b7a57]" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-800 text-base leading-tight tracking-tight">
                Calorie<span className="text-[#3b7a57]">Track</span>
              </span>
              <span className="text-[11px] font-normal text-slate-500 leading-tight">
                Nutrition & Goals
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#eef5f0] text-[#2c6e49] border border-[#d6ebd9]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#2c6e49]' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/log"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium bg-[#3b7a57] text-white hover:bg-[#326749] transition-colors shadow-none"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Quick Log</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-[#eef5f0] text-[#2c6e49] border border-[#d6ebd9]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#2c6e49]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/log"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-[#3b7a57] text-white hover:bg-[#326749]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Quick Log Meal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
