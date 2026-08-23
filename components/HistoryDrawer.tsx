'use client';

import React, { useState } from 'react';
import { GeneratedThumbnailRecord } from '@/lib/db';
import { PLATFORM_PRESETS } from '@/lib/presets';
import { X, Trash2, RotateCcw, Download, Sparkles, ExternalLink } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: GeneratedThumbnailRecord[];
  onSelectThumbnail: (thumb: GeneratedThumbnailRecord) => void;
  onDeleteThumbnail: (id: string) => Promise<void>;
}

export function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onSelectThumbnail,
  onDeleteThumbnail,
}: HistoryDrawerProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = selectedFilter === 'all'
    ? history
    : history.filter(item => item.platform === selectedFilter);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await onDeleteThumbnail(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-[#0d101a] border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl overflow-hidden animate-in slide-in-from-right duration-250">
        {/* Top Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <div>
                <h2 className="font-bold text-base text-white">Generation History</h2>
                <p className="text-xs text-slate-400">Stored in Neon DB / Local session</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedFilter === 'all'
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              All ({history.length})
            </button>
            {Array.from(new Set(history.map(h => h.platform))).map(platformId => {
              const preset = PLATFORM_PRESETS.find(p => p.id === platformId);
              return (
                <button
                  key={platformId}
                  onClick={() => setSelectedFilter(platformId)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
                    selectedFilter === platformId
                      ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {preset?.name || platformId}
                </button>
              );
            })}
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto my-4 pr-1 space-y-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-center space-y-2">
              <p className="text-sm">No generations yet</p>
              <p className="text-xs text-slate-500">Create your first thumbnail to see it here.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const preset = PLATFORM_PRESETS.find(p => p.id === item.platform);
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectThumbnail(item)}
                  className="group relative flex gap-3 p-2.5 rounded-xl glass-card border border-white/5 hover:border-purple-500/40 transition-all cursor-pointer"
                >
                  {/* Thumbnail Thumbnail */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-black/60">
                    <img
                      src={item.image_url}
                      alt={item.prompt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[9px] font-mono text-purple-300">
                      {item.aspect_ratio}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-semibold text-purple-300 truncate">
                          {preset?.name || item.platform}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 line-clamp-2 mt-0.5 font-medium">
                        {item.prompt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400 capitalize">
                        Style: {item.style || 'Default'}
                      </span>
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        disabled={deletingId === item.id}
                        className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete from history"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            Close History
          </button>
        </div>
      </div>
    </div>
  );
}
