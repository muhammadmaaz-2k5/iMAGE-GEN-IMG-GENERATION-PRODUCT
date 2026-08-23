'use client';

import React from 'react';
import { Sparkles, Database, Cloud, Zap, Sliders, History } from 'lucide-react';

interface NavbarProps {
  status: {
    worker?: { status: string; name: string };
    cloudinary?: { status: string; name: string; info: string };
    neon?: { status: string; name: string; info: string };
  } | null;
  onOpenSettings: () => void;
  onToggleHistory: () => void;
  historyCount: number;
}

export function Navbar({ status, onOpenSettings, onToggleHistory, historyCount }: NavbarProps) {
  const isCloudinaryActive = status?.cloudinary?.status === 'connected';
  const isNeonActive = status?.neon?.status === 'connected';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] glass-panel px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 shadow-lg shadow-purple-500/25">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-200 bg-clip-text text-transparent">
                ThumbnailAI
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Multi-Platform Social & Web Ratio Engine
            </p>
          </div>
        </div>

        {/* Status Indicators & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cloudinary Status Badge */}
          <div
            title={`Cloudinary CDN: ${status?.cloudinary?.info || 'Base64 fallback'}`}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isCloudinaryActive
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Cloudinary: {isCloudinaryActive ? 'Live' : 'Direct'}</span>
          </div>

          {/* Neon DB Status Badge */}
          <div
            title={`Neon DB: ${status?.neon?.info || 'In-Memory fallback'}`}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isNeonActive
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Neon DB: {isNeonActive ? 'Live' : 'Local'}</span>
          </div>

          {/* Worker API Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/30">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>Cloudflare AI</span>
          </div>

          {/* History Button */}
          <button
            onClick={onToggleHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white border border-white/10 text-xs font-medium transition-all"
          >
            <History className="w-4 h-4 text-purple-400" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-purple-500 text-white text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white border border-white/10 transition-all"
            title="Configure Cloudinary & Neon DB"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
