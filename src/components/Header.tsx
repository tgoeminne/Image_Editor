import React from 'react';
import {
  Scissors,
  Download,
  RotateCcw,
  Undo2,
  Redo2,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FolderOpen,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  fileName: string;
  imageDimensions: { width: number; height: number } | null;
  canUndo: boolean;
  canRedo: boolean;
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
  onOpenNewImage: () => void;
  onExport: () => void;
  onToggleMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  fileName,
  imageDimensions,
  canUndo,
  canRedo,
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
  onOpenNewImage,
  onExport,
  onToggleMenu,
}) => {
  return (
    <header
      id="app-header"
      className="h-14 bg-[#0F0F0F] border-b border-white/10 px-3 sm:px-6 flex items-center justify-between gap-2 select-none shrink-0"
    >
      {/* Left: Off-Canvas Menu Toggle & Brand */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          id="header-menu-btn"
          type="button"
          onClick={onToggleMenu}
          className="p-2 min-w-[40px] min-h-[40px] rounded-xl bg-[#141414] hover:bg-[#1F1F1F] active:scale-95 border border-white/10 text-[#E5C378] flex items-center justify-center transition-all cursor-pointer"
          title="Open Studio Menu & Controls"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E5C378] to-[#B89045] flex items-center justify-center text-[#0A0A0A] font-bold shadow-md shadow-[#E5C378]/20 border border-white/20 shrink-0">
            <Scissors className="w-4 h-4" />
          </div>
          <div className="hidden xs:block sm:block">
            <h1 className="text-sm sm:text-base font-serif-display font-bold text-white tracking-wide leading-none flex items-center gap-1.5">
              <span>Image Studio</span>
              <span className="text-[9px] sm:text-[10px] tracking-widest font-sans uppercase px-1.5 py-0.5 rounded bg-[#E5C378]/15 text-[#E5C378] border border-[#E5C378]/30 font-medium">
                Atelier
              </span>
            </h1>
            <span className="hidden sm:inline text-[11px] text-[#A1A1AA] italic font-serif leading-tight">
              Precision Splitting & Darkroom
            </span>
          </div>
        </div>

        {fileName && (
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-white/10 text-xs">
            <span
              className="text-[#D4D4D8] font-mono text-[11px] max-w-[140px] truncate"
              title={fileName}
            >
              {fileName}
            </span>
            {imageDimensions && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A1A1A] text-[#A1A1AA] border border-white/10">
                {imageDimensions.width} × {imageDimensions.height} px
              </span>
            )}
          </div>
        )}
      </div>

      {/* Center Utilities: Undo/Redo, Compare, Zoom */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center bg-[#050505] rounded-lg p-0.5 border border-white/10">
          <button
            id="header-undo-btn"
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 sm:p-2 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-md transition-colors ${
              canUndo
                ? 'text-[#E0E0E0] hover:text-white hover:bg-white/10 active:scale-95'
                : 'text-zinc-700 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            id="header-redo-btn"
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 sm:p-2 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-md transition-colors ${
              canRedo
                ? 'text-[#E0E0E0] hover:text-white hover:bg-white/10 active:scale-95'
                : 'text-zinc-700 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compare Original Button (Hold) */}
        <button
          id="header-compare-btn"
          type="button"
          onMouseDown={onStartCompare}
          onMouseUp={onEndCompare}
          onMouseLeave={onEndCompare}
          onTouchStart={onStartCompare}
          onTouchEnd={onEndCompare}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-medium border transition-all select-none cursor-pointer ${
            isComparing
              ? 'bg-[#E5C378] text-[#0A0A0A] border-[#E5C378] font-semibold shadow-md shadow-[#E5C378]/25'
              : 'bg-[#050505] border-white/10 text-[#D4D4D8] hover:text-white hover:border-white/20 hover:bg-white/5'
          }`}
          title="Press and hold to view original image"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden md:inline">
            {isComparing ? 'Original' : 'Hold Compare'}
          </span>
        </button>

        {/* Reset Edits */}
        <button
          id="header-reset-btn"
          type="button"
          onClick={onReset}
          className="hidden sm:flex p-1.5 sm:px-2.5 sm:py-1.5 min-h-[36px] rounded-lg bg-[#050505] border border-white/10 text-[#A1A1AA] hover:text-[#E5C378] hover:border-[#E5C378]/40 hover:bg-white/5 transition-colors text-xs items-center gap-1.5 cursor-pointer"
          title="Reset all edits to original"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Reset</span>
        </button>

        <div className="h-4 w-px bg-white/10 hidden md:block" />

        {/* Desktop Zoom Controls */}
        <div className="hidden md:flex items-center bg-[#050505] rounded-lg p-0.5 border border-white/10 text-xs">
          <button
            id="header-zoom-out-btn"
            type="button"
            onClick={onZoomOut}
            className="p-1.5 rounded-md text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            id="header-zoom-fit-btn"
            type="button"
            onClick={onZoomFit}
            className="px-2 py-0.5 text-[11px] font-mono text-[#D4D4D8] hover:text-white rounded hover:bg-white/10"
            title="Fit to screen"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            id="header-zoom-in-btn"
            type="button"
            onClick={onZoomIn}
            className="p-1.5 rounded-md text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Actions: Open New & Save */}
      <div className="flex items-center gap-2">
        <button
          id="header-open-new-btn"
          type="button"
          onClick={onOpenNewImage}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-[#181818] hover:bg-[#222222] text-[#E0E0E0] text-xs font-medium border border-white/10 hover:border-white/20 transition-all cursor-pointer"
          title="Open new image"
        >
          <FolderOpen className="w-3.5 h-3.5 text-[#A1A1AA]" />
          <span>New Image</span>
        </button>

        <button
          id="header-export-btn"
          type="button"
          onClick={onExport}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 min-h-[36px] rounded-lg bg-gradient-to-r from-[#E5C378] to-[#C9A050] hover:from-[#F0D597] hover:to-[#D8AF5F] text-[#0A0A0A] font-bold text-xs shadow-lg shadow-[#E5C378]/20 border border-[#F5DFAB]/40 active:scale-95 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden xs:inline sm:inline">Save & Export</span>
          <span className="xs:hidden sm:hidden">Export</span>
        </button>
      </div>
    </header>
  );
};
