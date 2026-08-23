'use client';

import React, { useState } from 'react';
import { PLATFORM_PRESETS, PlatformPreset } from '@/lib/presets';
import {
  Sparkles,
  Video,
  Globe,
  Layout,
  User,
  Square,
  Layers,
  Smartphone,
  Play,
  Camera,
  Share2,
  Bookmark,
  MessageSquare
} from 'lucide-react';

interface PlatformSelectorProps {
  selectedPreset: PlatformPreset;
  onSelectPreset: (preset: PlatformPreset) => void;
}

// Brand SVG Icons
function YouTubeIcon() {
  return (
    <svg className="w-4 h-4 text-red-500 fill-current" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-4 h-4 text-pink-400 stroke-current fill-none stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-4 h-4 text-sky-400 fill-current" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28M5.07 18.5h2.79v-8.37H5.07v8.37z"/>
    </svg>
  );
}

function XTwitterIcon() {
  return (
    <svg className="w-4 h-4 text-slate-200 fill-current" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg className="w-4 h-4 text-cyan-400 fill-current" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01v8.43c0 1.25-.34 2.47-1.03 3.52-.73 1.1-1.78 1.95-3.01 2.43-1.22.48-2.58.55-3.83.21-1.25-.33-2.38-1.09-3.21-2.07-1.7-2.01-2.03-4.88-.86-7.21 1.09-2.18 3.39-3.6 5.83-3.66.45-.01.9.03 1.34.12v4.06c-.34-.14-.7-.22-1.07-.22-1.25-.01-2.45.69-3.02 1.8-.57 1.11-.38 2.48.47 3.39.85.91 2.22 1.18 3.37.66.86-.39 1.43-1.25 1.45-2.2V.02z"/>
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4 text-emerald-400 fill-current" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg className="w-4 h-4 text-rose-400 fill-current" viewBox="0 0 24 24">
      <path d="M12 0a12 12 0 0 0-4.37 23.18c-.05-.98-.09-2.48.02-3.55l.8-3.41s-.2-.41-.2-1.02c0-.96.56-1.68 1.25-1.68.59 0 .88.44.88.97 0 .59-.38 1.48-.57 2.3-.16.69.34 1.25 1.02 1.25 1.22 0 2.17-1.29 2.17-3.15 0-1.65-1.18-2.8-2.88-2.8-1.96 0-3.11 1.47-3.11 2.99 0 .59.23 1.23.51 1.57.06.07.07.13.05.2-.05.23-.18.73-.2.83-.03.14-.1.17-.23.1-1.08-.5-1.75-2.07-1.75-3.34 0-2.72 1.97-5.21 5.69-5.21 2.99 0 5.31 2.13 5.31 4.97 0 2.96-1.87 5.35-4.46 5.35-.87 0-1.69-.45-1.97-.99l-.54 2.05c-.19.75-.72 1.68-1.07 2.25A12 12 0 1 0 12 0z"/>
    </svg>
  );
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Youtube: <YouTubeIcon />,
  Instagram: <InstagramIcon />,
  Sparkles: <Sparkles className="w-4 h-4 text-purple-400" />,
  Video: <TikTokIcon />,
  MessageCircle: <WhatsAppIcon />,
  Facebook: <FacebookIcon />,
  Linkedin: <LinkedInIcon />,
  Twitter: <XTwitterIcon />,
  Pin: <PinterestIcon />,
  Globe: <Globe className="w-4 h-4 text-teal-400" />,
  Layout: <Layout className="w-4 h-4 text-indigo-400" />,
  User: <User className="w-4 h-4 text-amber-400" />,
  Square: <Square className="w-4 h-4 text-violet-400" />,
};

export function PlatformSelector({ selectedPreset, onSelectPreset }: PlatformSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'video' | 'social' | 'web' | 'branding'>('all');

  const categories = [
    { id: 'all', label: 'All Ratios (14)' },
    { id: 'video', label: 'Video & Thumbnails' },
    { id: 'social', label: 'Social Feeds' },
    { id: 'web', label: 'Web & Hero' },
    { id: 'branding', label: 'Avatars & Icons' },
  ];

  const filteredPresets = activeCategory === 'all'
    ? PLATFORM_PRESETS
    : PLATFORM_PRESETS.filter(p => p.category === activeCategory);

  return (
    <div className="space-y-3">
      {/* Header & Category Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          <label className="text-sm font-semibold text-slate-200">
            Target Platform & Aspect Ratio
          </label>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full text-xs">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-sm shadow-purple-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[290px] overflow-y-auto pr-1 pb-1">
        {filteredPresets.map(preset => {
          const isSelected = selectedPreset.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`group relative p-3 rounded-xl text-left transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-purple-600/20 border-purple-500/80 shadow-md shadow-purple-500/20 ring-1 ring-purple-400/50'
                  : 'glass-card border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <div className="p-1.5 rounded-lg bg-black/40 border border-white/10 group-hover:scale-105 transition-transform flex items-center justify-center">
                  {ICON_MAP[preset.iconName] || <Layers className="w-4 h-4 text-slate-300" />}
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  isSelected
                    ? 'bg-purple-500 text-white shadow-sm'
                    : 'bg-white/10 text-slate-300 group-hover:bg-white/15'
                }`}>
                  {preset.badge}
                </span>
              </div>

              <div className="font-semibold text-xs text-slate-100 group-hover:text-white truncate">
                {preset.name}
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                {preset.width} × {preset.height}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Preset Info Alert */}
      <div className="px-3.5 py-2 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-center justify-between text-xs text-purple-300">
        <span className="truncate">
          <strong className="font-semibold text-white">{selectedPreset.name}</strong> ({selectedPreset.aspectRatio} • {selectedPreset.width}x{selectedPreset.height}) — {selectedPreset.compositionHint}
        </span>
      </div>
    </div>
  );
}
