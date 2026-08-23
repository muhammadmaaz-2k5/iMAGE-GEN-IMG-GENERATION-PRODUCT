'use client';

import React, { useState } from 'react';
import { STYLE_OPTIONS, LIGHTING_OPTIONS, SAMPLE_PROMPTS, PlatformPreset } from '@/lib/presets';
import { Sparkles, Wand2, Dices, X, Lightbulb, Flame, ChevronDown, ChevronUp, AlertTriangle, Info } from 'lucide-react';

interface PromptStudioProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  selectedPreset: PlatformPreset;
  selectedStyle: string;
  setSelectedStyle: (styleId: string) => void;
  selectedLighting: string;
  setSelectedLighting: (lightingId: string) => void;
  enhancePrompt: boolean;
  setEnhancePrompt: (enhance: boolean) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export function PromptStudio({
  prompt,
  setPrompt,
  selectedPreset,
  selectedStyle,
  setSelectedStyle,
  selectedLighting,
  setSelectedLighting,
  enhancePrompt,
  setEnhancePrompt,
  onGenerate,
  isLoading,
}: PromptStudioProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_PROMPTS.length);
    setPrompt(SAMPLE_PROMPTS[randomIndex]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && prompt.trim() && !isLoading) {
      e.preventDefault();
      onGenerate();
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Model Capability Note */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-300 flex items-center gap-1.5">
            Important AI Model Note
          </p>
          <p className="text-[11px] text-amber-200/90 leading-relaxed">
            This image generation AI is designed for <strong>visual scenes, 3D artwork, characters, and lighting</strong>. It <strong>cannot reliably render written words, titles, or complex flowcharts</strong> (it will draw warped/gibberish letters).
          </p>
          <p className="text-[10.5px] text-amber-300/80 pt-0.5">
            👉 <strong>Tip:</strong> Describe the visual scene (e.g. <em>"Futuristic glowing server room with neon cyber aesthetic"</em>) instead of asking it to print specific text.
          </p>
        </div>
      </div>

      {/* Prompt Input Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Prompt Engine
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomPrompt}
              type="button"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs transition-colors border border-white/10"
              title="Insert a random creative visual prompt"
            >
              <Dices className="w-3.5 h-3.5 text-pink-400" />
              <span>Surprise Me</span>
            </button>
            {prompt && (
              <button
                onClick={() => setPrompt('')}
                type="button"
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Clear prompt"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the visual scene (e.g. 'A sleek futuristic black laptop in a cyberpunk developer room with glowing neon blue and purple server data streams')..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-sm resize-none transition-all"
          />
          <div className="absolute bottom-2.5 right-3 text-[10px] text-slate-500 font-mono">
            {prompt.length} chars • Ctrl+Enter to run
          </div>
        </div>
      </div>

      {/* Magic Enhancer & Style Chips */}
      <div className="space-y-3">
        {/* Enhancer Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-transparent border border-purple-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
              <Wand2 className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                Magic Thumbnail CTR Enhancer
                <span className="px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 text-[10px] font-bold">
                  Recommended
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Auto-injects 8K clarity, volumetric contrast, and click-optimized lighting.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEnhancePrompt(!enhancePrompt)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              enhancePrompt ? 'bg-purple-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                enhancePrompt ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Visual Styles */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Artistic Style Preset
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STYLE_OPTIONS.map((style) => {
              const isSelected = selectedStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-medium transition-all border ${
                    isSelected
                      ? 'bg-purple-600/30 border-purple-500 text-white shadow-sm shadow-purple-500/20'
                      : 'bg-slate-900/60 border-white/5 text-slate-300 hover:text-white hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  <span className="text-base">{style.icon}</span>
                  <span className="truncate">{style.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced Lighting Accordion */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-slate-200 py-1 transition-colors"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
              Lighting & Atmosphere Tuning
            </span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/5 animate-in fade-in duration-150">
              {LIGHTING_OPTIONS.map((lighting) => (
                <button
                  key={lighting.id}
                  type="button"
                  onClick={() => setSelectedLighting(lighting.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-all border ${
                    selectedLighting === lighting.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                      : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lighting.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Generate CTA Button */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={isLoading || !prompt.trim()}
        className={`relative w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white shadow-xl transition-all overflow-hidden flex items-center justify-center gap-2.5 ${
          isLoading || !prompt.trim()
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
            : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:via-indigo-500 hover:to-pink-500 shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Synthesizing Thumbnail...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
            <span>Generate {selectedPreset.name}</span>
            <span className="text-[11px] font-mono opacity-70 px-1.5 py-0.5 rounded bg-white/10 ml-1">
              {selectedPreset.badge}
            </span>
          </>
        )}
      </button>
    </div>
  );
}
