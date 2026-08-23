'use client';

import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, RefreshCw, Cloud, Database, Cpu, ExternalLink } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: any;
  onRefreshStatus: () => Promise<void>;
}

export function SettingsModal({ isOpen, onClose, status, onRefreshStatus }: SettingsModalProps) {
  const [refreshing, setRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefreshStatus();
    } finally {
      setRefreshing(false);
    }
  };

  const isCloudinaryActive = status?.cloudinary?.status === 'connected';
  const isNeonActive = status?.neon?.status === 'connected';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl bg-[#10131e]/95 text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Studio Integrations & Services</h2>
              <p className="text-xs text-slate-400">Manage Cloudflare AI, Cloudinary CDN, & Neon Postgres</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Services Status Cards */}
        <div className="space-y-3.5 my-5">
          {/* Cloudflare Worker AI */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400 mt-0.5">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">Cloudflare Worker Image Gen API</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-medium border border-emerald-500/30">
                    Active & Ready
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Worker: <code className="text-purple-300 text-[11px]">https://yellow-scene-ce97...workers.dev</code>
                </p>
              </div>
            </div>
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
          </div>

          {/* Cloudinary */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg mt-0.5 ${isCloudinaryActive ? 'bg-sky-500/20 text-sky-400' : 'bg-amber-500/20 text-amber-400'}`}>
                <Cloud className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">Cloudinary CDN & Image Transforms</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                    isCloudinaryActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {isCloudinaryActive ? 'Connected' : 'Fallback Active (Direct Base64)'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {isCloudinaryActive
                    ? `Cloud Name: ${status?.cloudinary?.info}`
                    : 'Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local for permanent CDN hosting & smart crops.'}
                </p>
              </div>
            </div>
            {isCloudinaryActive ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
            )}
          </div>

          {/* Neon Database */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg mt-0.5 ${isNeonActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                <Database className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">Neon Serverless PostgreSQL</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                    isNeonActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  }`}>
                    {isNeonActive ? 'Connected' : 'Fallback Active (In-Memory)'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {isNeonActive
                    ? 'Connected to Neon PostgreSQL instance with auto-indexing.'
                    : 'Add DATABASE_URL in .env.local for permanent history and generation analytics.'}
                </p>
              </div>
            </div>
            {isNeonActive ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
            ) : (
              <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-1" />
            )}
          </div>
        </div>

        {/* Instructions box */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-white/5 text-xs text-slate-400 font-mono space-y-1">
          <p className="text-slate-300 font-sans font-medium">To configure your own keys:</p>
          <p>1. Open file <span className="text-purple-300">.env.local</span></p>
          <p>2. Fill in <span className="text-cyan-300">CLOUDINARY_*</span> & <span className="text-emerald-300">DATABASE_URL</span></p>
          <p>3. Click Refresh below</p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Check Connectivity</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white transition-all shadow-md shadow-purple-600/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
