'use client';

import React, { useState } from 'react';
import { PlatformPreset } from '@/lib/presets';
import {
  Download,
  Copy,
  Maximize2,
  Check,
  Sparkles,
  Cloud,
  Database,
  ExternalLink,
  RotateCcw,
  Info,
  X
} from 'lucide-react';

interface PreviewCanvasProps {
  selectedPreset: PlatformPreset;
  currentResult: any | null;
  isLoading: boolean;
  onRemixPrompt?: (prompt: string, presetId: string, styleId: string) => void;
}

export function PreviewCanvas({
  selectedPreset,
  currentResult,
  isLoading,
  onRemixPrompt,
}: PreviewCanvasProps) {
  const [copied, setCopied] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showMeta, setShowMeta] = useState(false);

  const handleCopyLink = async () => {
    if (!currentResult?.image_url) return;
    try {
      await navigator.clipboard.writeText(currentResult.image_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = () => {
    if (!currentResult?.image_url) return;
    const link = document.createElement('a');
    link.href = currentResult.image_url;
    link.download = `thumbnail-${currentResult.platform || 'generated'}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate proportional preview container styling
  // We keep max height around 480px and adjust aspect ratio
  const getAspectRatioStyle = () => {
    if (selectedPreset.aspectRatio === '16:9') return 'aspect-[16/9]';
    if (selectedPreset.aspectRatio === '1:1') return 'aspect-square max-w-[400px]';
    if (selectedPreset.aspectRatio === '9:16') return 'aspect-[9/16] max-h-[500px] max-w-[280px]';
    if (selectedPreset.aspectRatio === '4:5') return 'aspect-[4/5] max-h-[480px] max-w-[380px]';
    if (selectedPreset.aspectRatio === '1.91:1') return 'aspect-[1.91/1]';
    if (selectedPreset.aspectRatio === '2:3') return 'aspect-[2/3] max-h-[480px] max-w-[320px]';
    return 'aspect-video';
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Canvas Top Bar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-200">Canvas Preview</span>
          <span className="text-slate-400 font-mono">({selectedPreset.aspectRatio} • {selectedPreset.width}×{selectedPreset.height}px)</span>
        </div>

        {currentResult && !isLoading && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowMeta(!showMeta)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 text-xs transition-colors"
              title="View metadata"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowLightbox(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 text-xs transition-colors"
              title="Expand fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Viewport Container */}
      <div className="relative flex-1 min-h-[360px] max-h-[540px] flex items-center justify-center p-4 rounded-2xl bg-black/40 border border-white/10 glass-panel overflow-hidden">
        {/* Ambient background glow for active image */}
        {currentResult?.image_url && (
          <div
            className="absolute inset-0 opacity-25 blur-3xl scale-110 pointer-events-none transition-all duration-700"
            style={{
              backgroundImage: `url(${currentResult.image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}

        {/* Dynamic Aspect Ratio Box */}
        <div
          className={`relative w-full ${getAspectRatioStyle()} mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/15 bg-slate-950/80 flex items-center justify-center transition-all duration-500`}
        >
          {isLoading ? (
            /* Loading State */
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 w-full h-full animate-shimmer">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 animate-spin flex items-center justify-center shadow-lg shadow-purple-500/30" />
                <Sparkles className="w-6 h-6 text-white absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-1.5 max-w-xs">
                <p className="text-sm font-bold text-white tracking-wide">Rendering High-CTR Visual</p>
                <p className="text-xs text-slate-400">
                  Cloudflare Worker AI is generating image for <span className="text-purple-300 font-medium">{selectedPreset.name}</span>...
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-black/40 px-3 py-1 rounded-full border border-white/10 font-mono">
                <span>Aspect: {selectedPreset.aspectRatio}</span>
                <span>•</span>
                <span>Framing applied</span>
              </div>
            </div>
          ) : currentResult ? (
            /* Result Image */
            <div className="relative w-full h-full group">
              <img
                src={currentResult.image_url}
                alt={currentResult.prompt || 'Generated Thumbnail'}
                className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Watermark / Badge Overlay */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-[11px] text-white font-medium shadow-lg pointer-events-none">
                <span>{selectedPreset.name}</span>
                <span className="text-purple-300 font-mono">({selectedPreset.aspectRatio})</span>
              </div>

              {/* Cloudinary CDN Indicator */}
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] text-slate-300 font-mono pointer-events-none">
                {currentResult.isCloudinary ? (
                  <>
                    <Cloud className="w-3 h-3 text-sky-400" />
                    <span>Cloudinary CDN</span>
                  </>
                ) : (
                  <>
                    <Database className="w-3 h-3 text-indigo-400" />
                    <span>Direct Output</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 text-slate-500">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <Sparkles className="w-8 h-8 text-purple-400/60" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-300">Ready to Generate</p>
                <p className="text-xs text-slate-400 max-w-xs">
                  Enter your prompt or choose a preset and click <strong className="text-purple-300 font-medium">Generate</strong>.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                Preset: {selectedPreset.name} ({selectedPreset.aspectRatio})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Toolbar */}
      {currentResult && !isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download HD</span>
          </button>

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-xs border border-white/10 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Link!' : 'Copy CDN Link'}</span>
          </button>

          {/* Remix / Refine Prompt */}
          <button
            onClick={() => onRemixPrompt?.(currentResult.prompt, currentResult.platform, currentResult.style)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-xs border border-white/10 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-pink-400" />
            <span>Remix Prompt</span>
          </button>

          {/* Open Fullscreen */}
          <button
            onClick={() => setShowLightbox(true)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-xs border border-white/10 transition-all"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Preview HD</span>
          </button>
        </div>
      )}

      {/* Metadata Accordion */}
      {showMeta && currentResult && (
        <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 text-xs space-y-1.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-slate-400 font-semibold border-b border-white/10 pb-1">
            <span>Generation Metadata</span>
            <button onClick={() => setShowMeta(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-slate-300"><strong className="text-slate-400">Prompt:</strong> {currentResult.prompt}</p>
          <p className="text-slate-300 text-[11px]"><strong className="text-slate-400">Enriched:</strong> {currentResult.enhanced_prompt || currentResult.enhancedPrompt}</p>
          <div className="flex flex-wrap gap-3 pt-1 text-[11px] text-slate-400 font-mono">
            <span>Ratio: {currentResult.aspect_ratio || currentResult.aspectRatio}</span>
            <span>Dimensions: {currentResult.width}×{currentResult.height}</span>
            <span>Style: {currentResult.style}</span>
            {currentResult.cloudinary_id && <span>Cloudinary ID: {currentResult.cloudinary_id}</span>}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {showLightbox && currentResult?.image_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
            <img
              src={currentResult.image_url}
              alt="Fullscreen Preview"
              className="w-full h-full object-contain max-h-[85vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
