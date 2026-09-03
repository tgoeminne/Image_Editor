import React, { useRef } from 'react';
import {
  Scissors,
  X,
  RotateCcw,
  Undo2,
  Redo2,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FolderOpen,
  Download,
  Sparkles,
  Sliders,
  Crop,
  RotateCw,
  Info,
  Layers,
  Keyboard,
  Image as ImageIcon,
} from 'lucide-react';
import { ActiveTool } from '../types';
import { SAMPLE_IMAGES, SampleImage } from '../utils/sampleImages';

interface OffCanvasAppMenuProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  imageDimensions: { width: number; height: number } | null;
  canUndo: boolean;
  canRedo: boolean;
  historyIndex: number;
  historyLength: number;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  isComparing: boolean;
  onStartCompare: () => void;
  onEndCompare: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
  onSetZoom: (zoom: number) => void;
  activeTool: ActiveTool;
  onSelectTool: (tool: ActiveTool) => void;
  onOpenNewImage: () => void;
  onSelectSampleImage: (url: string, name: string) => void;
  onExport: () => void;
}

export const OffCanvasAppMenu: React.FC<OffCanvasAppMenuProps> = ({
  isOpen,
  onClose,
  fileName,
  imageDimensions,
  canUndo,
  canRedo,
  historyIndex,
  historyLength,
  onUndo,
  onRedo,
  onReset,
  isComparing,
  onStartCompare,
  onEndCompare,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  onSetZoom,
  activeTool,
  onSelectTool,
  onOpenNewImage,
  onSelectSampleImage,
  onExport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onSelectSampleImage(ev.target.result as string, file.name);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const megapixel = imageDimensions
    ? ((imageDimensions.width * imageDimensions.height) / 1000000).toFixed(1)
    : null;

  const toolShortcuts: { id: ActiveTool; label: string; icon: React.ReactNode }[] = [
    { id: 'adjust', label: 'Darkroom Adjustments', icon: <Sliders className="w-4 h-4 text-[#FF85A0]" /> },
    { id: 'filter', label: 'Artistic & Vintage Filters', icon: <Sparkles className="w-4 h-4 text-[#C4B5FD]" /> },
    { id: 'crop', label: 'Crop & Framing Presets', icon: <Crop className="w-4 h-4 text-[#8CB4FF]" /> },
    { id: 'rotate', label: 'Rotate & Straighten', icon: <RotateCw className="w-4 h-4 text-[#6EE7B7]" /> },
    { id: 'split', label: 'Precision Splitter', icon: <Scissors className="w-4 h-4 text-[#E5C378]" /> },
  ];

  return (
    <div
      id="off-canvas-app-menu-backdrop"
      className="fixed inset-0 z-50 flex bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      {/* Drawer Container (Slide-in from Left) */}
      <div
        id="off-canvas-app-menu"
        className="w-full max-w-sm sm:max-w-md bg-[#0D0D0D] border-r border-white/15 h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-left duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/10 bg-[#0A0A0A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E5C378] to-[#B89045] flex items-center justify-center text-[#0A0A0A] font-bold shadow-md shadow-[#E5C378]/20 border border-white/20">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif-display font-bold text-white tracking-wide leading-none flex items-center gap-1.5">
                <span>Image Studio</span>
                <span className="text-[10px] tracking-widest font-sans uppercase px-1.5 py-0.5 rounded bg-[#E5C378]/15 text-[#E5C378] border border-[#E5C378]/30 font-semibold">
                  Atelier
                </span>
              </h2>
              <p className="text-[11px] text-[#A1A1AA] italic font-serif mt-0.5">
                Workspace Controls & Settings
              </p>
            </div>
          </div>
          <button
            id="offcanvas-close-btn"
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Active Image Info Card */}
          {fileName && (
            <div className="p-4 rounded-2xl bg-[#070707] border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#E5C378]" />
                  <span>Current Photograph</span>
                </span>
                {megapixel && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A1A1A] text-[#E5C378] border border-[#E5C378]/25">
                    {megapixel} MP
                  </span>
                )}
              </div>
              <div className="text-xs font-mono text-white font-medium truncate" title={fileName}>
                {fileName}
              </div>
              {imageDimensions && (
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#A1A1AA]">
                  <span className="bg-[#141414] px-2 py-0.5 rounded border border-white/5">
                    {imageDimensions.width} × {imageDimensions.height} px
                  </span>
                  <span className="bg-[#141414] px-2 py-0.5 rounded border border-white/5">
                    {(imageDimensions.width / imageDimensions.height).toFixed(2)}:1 Ratio
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Darkroom Operations / Quick Actions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-white/5 pb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378]" />
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                Quick Darkroom Actions
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Undo */}
              <button
                type="button"
                onClick={onUndo}
                disabled={!canUndo}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                  canUndo
                    ? 'bg-[#141414] hover:bg-[#1A1A1A] border-white/10 text-white'
                    : 'bg-[#0A0A0A] border-white/5 text-zinc-700 cursor-not-allowed'
                }`}
              >
                <Undo2 className="w-4 h-4" />
                <div className="text-left">
                  <div className="text-xs font-medium">Undo</div>
                  <div className="text-[10px] text-[#71717A]">Step {historyIndex + 1}/{historyLength}</div>
                </div>
              </button>

              {/* Redo */}
              <button
                type="button"
                onClick={onRedo}
                disabled={!canRedo}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                  canRedo
                    ? 'bg-[#141414] hover:bg-[#1A1A1A] border-white/10 text-white'
                    : 'bg-[#0A0A0A] border-white/5 text-zinc-700 cursor-not-allowed'
                }`}
              >
                <Redo2 className="w-4 h-4" />
                <div className="text-left">
                  <div className="text-xs font-medium">Redo</div>
                  <div className="text-[10px] text-[#71717A]">Step forward</div>
                </div>
              </button>
            </div>

            {/* Compare Original Button */}
            <button
              type="button"
              onMouseDown={onStartCompare}
              onMouseUp={onEndCompare}
              onMouseLeave={onEndCompare}
              onTouchStart={onStartCompare}
              onTouchEnd={onEndCompare}
              className={`w-full p-3.5 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer select-none ${
                isComparing
                  ? 'bg-[#E5C378] text-[#0A0A0A] border-[#E5C378] font-bold shadow-lg shadow-[#E5C378]/25'
                  : 'bg-[#141414] hover:bg-[#1A1A1A] border-white/10 text-[#D4D4D8] hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="text-xs font-medium">
                {isComparing ? 'Showing Original (Hold Active)' : 'Hold to Compare with Original'}
              </span>
            </button>

            {/* Reset All */}
            <button
              type="button"
              onClick={() => {
                onReset();
                onClose();
              }}
              className="w-full p-3 rounded-xl bg-[#0A0A0A] hover:bg-rose-950/20 border border-white/5 hover:border-rose-500/30 text-[#A1A1AA] hover:text-rose-400 text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Edits to Default</span>
            </button>
          </div>

          {/* Zoom Viewport Scale */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378]" />
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                  Viewport Zoom
                </h3>
              </div>
              <span className="font-mono text-xs text-[#E5C378] font-bold">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[0.5, 1, 1.5, 2].map((zVal) => (
                <button
                  key={zVal}
                  type="button"
                  onClick={() => onSetZoom(zVal)}
                  className={`py-2 px-1 rounded-xl text-xs font-mono font-medium border text-center transition-all cursor-pointer ${
                    Math.abs(zoom - zVal) < 0.05
                      ? 'bg-[#E5C378]/15 border-[#E5C378] text-[#E5C378] font-bold'
                      : 'bg-[#141414] border-white/10 text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  {Math.round(zVal * 100)}%
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onZoomOut}
                className="flex-1 py-2.5 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-white/10 text-white text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
                <span>Zoom Out</span>
              </button>
              <button
                type="button"
                onClick={onZoomFit}
                className="flex-1 py-2.5 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-white/10 text-white text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Fit 100%</span>
              </button>
              <button
                type="button"
                onClick={onZoomIn}
                className="flex-1 py-2.5 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-white/10 text-white text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Zoom In</span>
              </button>
            </div>
          </div>

          {/* Jump to Tool Sections */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-white/5 pb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378]" />
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                Darkroom Tools
              </h3>
            </div>

            <div className="space-y-1.5">
              {toolShortcuts.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    onSelectTool(t.id);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                    activeTool === t.id
                      ? 'bg-[#E5C378]/15 border-[#E5C378] text-[#E5C378] font-bold'
                      : 'bg-[#141414] hover:bg-[#1A1A1A] border-white/10 text-[#D4D4D8] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {t.icon}
                    <span>{t.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#71717A] uppercase">Active</span>
                </button>
              ))}
            </div>
          </div>

          {/* Open New Image / Switch Photo */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-white/5 pb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378]" />
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                Change Photo
              </h3>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3 rounded-xl bg-[#181818] hover:bg-[#222222] border border-white/15 hover:border-[#E5C378]/40 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FolderOpen className="w-4 h-4 text-[#E5C378]" />
              <span>Upload from Device</span>
            </button>

            {/* Quick Sample Selector */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] text-[#71717A] uppercase tracking-wider">Or Load Sample Preset:</span>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_IMAGES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      onSelectSampleImage(s.url, `${s.id}.jpg`);
                      onClose();
                    }}
                    className="p-2 rounded-xl bg-[#141414] hover:bg-[#1F1F1F] border border-white/5 hover:border-white/20 text-left flex items-center gap-2 transition-all cursor-pointer group"
                  >
                    <img
                      src={s.url}
                      alt={s.title}
                      className="w-8 h-8 rounded-lg object-cover border border-white/10"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-white font-medium truncate group-hover:text-[#E5C378]">
                        {s.title}
                      </div>
                      <div className="text-[10px] text-[#71717A]">{s.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts Cheatsheet */}
          <div className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-white/10 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
              <Keyboard className="w-3.5 h-3.5 text-[#E5C378]" />
              <span>Keyboard Shortcuts</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#71717A] font-mono">
              <div><kbd className="text-[#D4D4D8] bg-[#1A1A1A] px-1 py-0.5 rounded border border-white/10">Ctrl+Z</kbd> Undo</div>
              <div><kbd className="text-[#D4D4D8] bg-[#1A1A1A] px-1 py-0.5 rounded border border-white/10">Ctrl+Y</kbd> Redo</div>
              <div><kbd className="text-[#D4D4D8] bg-[#1A1A1A] px-1 py-0.5 rounded border border-white/10">Ctrl+S</kbd> Save</div>
              <div><kbd className="text-[#D4D4D8] bg-[#1A1A1A] px-1 py-0.5 rounded border border-white/10">Esc</kbd> Cancel</div>
            </div>
          </div>
        </div>

        {/* Drawer Bottom CTA */}
        <div className="p-5 border-t border-white/10 bg-[#0A0A0A]">
          <button
            id="offcanvas-export-btn"
            type="button"
            onClick={() => {
              onExport();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#E5C378] to-[#C9A050] hover:from-[#F0D597] hover:to-[#D8AF5F] text-[#0A0A0A] font-bold text-xs shadow-lg shadow-[#E5C378]/20 active:scale-98 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Save & Export High-Res Image</span>
          </button>
        </div>
      </div>
    </div>
  );
};
