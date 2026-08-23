'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PLATFORM_PRESETS, PlatformPreset, STYLE_OPTIONS } from '@/lib/presets';
import { GeneratedThumbnailRecord } from '@/lib/db';
import { Navbar } from '@/components/Navbar';
import { SettingsModal } from '@/components/SettingsModal';
import { PlatformSelector } from '@/components/PlatformSelector';
import { PromptStudio } from '@/components/PromptStudio';
import { PreviewCanvas } from '@/components/PreviewCanvas';
import { HistoryDrawer } from '@/components/HistoryDrawer';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Cloud, Database } from 'lucide-react';

export default function Home() {
  const [selectedPreset, setSelectedPreset] = useState<PlatformPreset>(PLATFORM_PRESETS[0]);
  const [prompt, setPrompt] = useState<string>('A cute robot chef cooking a gourmet breakfast in a futuristic glass kitchen');
  const [selectedStyle, setSelectedStyle] = useState<string>('3d-render');
  const [selectedLighting, setSelectedLighting] = useState<string>('studio');
  const [enhancePrompt, setEnhancePrompt] = useState<boolean>(true);

  // Status & System state
  const [status, setStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generation result & history
  const [currentResult, setCurrentResult] = useState<any | null>(null);
  const [history, setHistory] = useState<GeneratedThumbnailRecord[]>([]);

  // Modals & Drawers
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Fetch status
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data.services);
      }
    } catch (err) {
      console.warn('Status fetch failed:', err);
    }
  }, []);

  // Fetch history
  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setHistory(json.data);
          // Set initial result if none exists yet
          if (!currentResult && json.data.length > 0) {
            setCurrentResult(json.data[0]);
          }
        }
      }
    } catch (err) {
      console.warn('History fetch failed:', err);
    }
  }, [currentResult]);

  useEffect(() => {
    fetchStatus();
    fetchHistory();
  }, [fetchStatus, fetchHistory]);

  // Handle generation
  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          platformId: selectedPreset.id,
          styleId: selectedStyle,
          lightingId: selectedLighting,
          enhancePrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Generation failed. Please check worker status.');
      }

      setCurrentResult(data.data);
      // Prepend to history
      setHistory(prev => [data.data, ...prev]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate image';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle remixing prompt from result/history
  const handleRemixPrompt = (remixPrompt: string, platformId?: string, styleId?: string) => {
    setPrompt(remixPrompt);
    if (platformId) {
      const foundPreset = PLATFORM_PRESETS.find(p => p.id === platformId);
      if (foundPreset) setSelectedPreset(foundPreset);
    }
    if (styleId) {
      setSelectedStyle(styleId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle history item select
  const handleSelectFromHistory = (item: GeneratedThumbnailRecord) => {
    setCurrentResult(item);
    const preset = PLATFORM_PRESETS.find(p => p.id === item.platform);
    if (preset) setSelectedPreset(preset);
    setIsHistoryOpen(false);
  };

  // Handle delete history item
  const handleDeleteHistoryItem = async (id: string) => {
    try {
      const res = await fetch(`/api/history?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHistory(prev => prev.filter(item => item.id !== id));
        if (currentResult?.id === id) {
          setCurrentResult(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation */}
      <Navbar
        status={status}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        historyCount={history.length}
      />

      {/* Main Studio Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 sm:py-8">
        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="font-bold">Error:</span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-white font-bold px-2 py-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Studio Grid: Left Controls (55%) & Right Live Canvas (45%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Platform & Ratio Selector + Prompt Studio */}
          <div className="lg:col-span-7 space-y-6">
            {/* Aspect Ratio & Platform Preset Card */}
            <section className="glass-panel p-5 sm:p-6 rounded-2xl">
              <PlatformSelector
                selectedPreset={selectedPreset}
                onSelectPreset={setSelectedPreset}
              />
            </section>

            {/* Prompt Engine Card */}
            <section className="glass-panel p-5 sm:p-6 rounded-2xl">
              <PromptStudio
                prompt={prompt}
                setPrompt={setPrompt}
                selectedPreset={selectedPreset}
                selectedStyle={selectedStyle}
                setSelectedStyle={setSelectedStyle}
                selectedLighting={selectedLighting}
                setSelectedLighting={setSelectedLighting}
                enhancePrompt={enhancePrompt}
                setEnhancePrompt={setEnhancePrompt}
                onGenerate={handleGenerate}
                isLoading={isLoading}
              />
            </section>
          </div>

          {/* Right Column: Live Aspect Ratio Viewport & Image Viewer */}
          <div className="lg:col-span-5 sticky top-20">
            <section className="glass-panel p-5 sm:p-6 rounded-2xl">
              <PreviewCanvas
                selectedPreset={selectedPreset}
                currentResult={currentResult}
                isLoading={isLoading}
                onRemixPrompt={handleRemixPrompt}
              />
            </section>
          </div>
        </div>

        {/* Bottom Feature Badges & Specs Bar */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-slate-400">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">14 Social Media Presets</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Exact pixel ratios for YouTube, Reels, TikTok, LinkedIn, Pinterest, & Web.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Cloudinary CDN & Transforms</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automatic asset optimization, smart subject cropping, and fast global CDN delivery.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Neon Serverless PostgreSQL</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Persistent generation history, prompt analytics, and instant multi-device reload.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        status={status}
        onRefreshStatus={fetchStatus}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectThumbnail={handleSelectFromHistory}
        onDeleteThumbnail={handleDeleteHistoryItem}
      />
    </div>
  );
}
