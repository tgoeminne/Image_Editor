import React, { useRef } from 'react';
import { Columns2, Rows2, Scissors, RotateCcw, Check, Sparkles } from 'lucide-react';
import { SplitDirection } from '../types';

interface SplitOverlayProps {
  containerWidth: number;
  containerHeight: number;
  imageWidth: number;
  imageHeight: number;
  direction: SplitDirection;
  splitRatio: number; // 0.0 to 1.0
  onRatioChange: (ratio: number) => void;
  onDirectionChange: (direction: SplitDirection) => void;
  onPerformSplit: () => void;
  onCancel: () => void;
}

export const SplitOverlay: React.FC<SplitOverlayProps> = ({
  containerWidth,
  containerHeight,
  imageWidth,
  imageHeight,
  direction,
  splitRatio,
  onRatioChange,
  onDirectionChange,
  onPerformSplit,
  onCancel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  const isVertical = direction === 'vertical';

  // Pixel position inside the visible container
  const linePos = isVertical ? containerWidth * splitRatio : containerHeight * splitRatio;

  // Real pixel dimensions of each split piece
  const part1Px = isVertical
    ? Math.round(imageWidth * splitRatio)
    : Math.round(imageHeight * splitRatio);
  const part2Px = isVertical ? imageWidth - part1Px : imageHeight - part1Px;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    e.preventDefault();

    const rect = containerRef.current.getBoundingClientRect();
    let newRatio: number;

    if (isVertical) {
      const x = e.clientX - rect.left;
      newRatio = x / rect.width;
    } else {
      const y = e.clientY - rect.top;
      newRatio = y / rect.height;
    }

    // Clamp between 5% and 95%
    newRatio = Math.max(0.05, Math.min(0.95, newRatio));
    onRatioChange(newRatio);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      isDraggingRef.current = false;
    }
  };

  return (
    <div
      ref={containerRef}
      id="split-overlay-container"
      className="absolute inset-0 pointer-events-auto select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Semi-transparent tint on Part 1 and Part 2 */}
      {isVertical ? (
        <>
          <div
            className="absolute top-0 left-0 bottom-0 bg-[#8CB4FF]/10 border-r border-[#8CB4FF]/30 pointer-events-none transition-colors"
            style={{ width: `${splitRatio * 100}%` }}
          >
            <div className="absolute top-4 left-4 bg-[#0A0A0A]/90 backdrop-blur-md text-white border border-[#8CB4FF]/40 px-3 py-1.5 rounded-lg shadow-xl text-xs font-mono">
              <span className="text-[#8CB4FF] font-semibold">Part 1 (Left)</span>
              <div className="text-[#E0E0E0] text-[11px] mt-0.5">
                {part1Px} × {imageHeight} px ({(splitRatio * 100).toFixed(1)}%)
              </div>
            </div>
          </div>
          <div
            className="absolute top-0 right-0 bottom-0 bg-[#E5C378]/10 pointer-events-none transition-colors"
            style={{ width: `${(1 - splitRatio) * 100}%` }}
          >
            <div className="absolute top-4 right-4 bg-[#0A0A0A]/90 backdrop-blur-md text-white border border-[#E5C378]/40 px-3 py-1.5 rounded-lg shadow-xl text-xs font-mono text-right">
              <span className="text-[#E5C378] font-semibold">Part 2 (Right)</span>
              <div className="text-[#E0E0E0] text-[11px] mt-0.5">
                {part2Px} × {imageHeight} px ({((1 - splitRatio) * 100).toFixed(1)}%)
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="absolute top-0 left-0 right-0 bg-[#8CB4FF]/10 border-b border-[#8CB4FF]/30 pointer-events-none transition-colors"
            style={{ height: `${splitRatio * 100}%` }}
          >
            <div className="absolute top-4 left-4 bg-[#0A0A0A]/90 backdrop-blur-md text-white border border-[#8CB4FF]/40 px-3 py-1.5 rounded-lg shadow-xl text-xs font-mono">
              <span className="text-[#8CB4FF] font-semibold">Part 1 (Top)</span>
              <div className="text-[#E0E0E0] text-[11px] mt-0.5">
                {imageWidth} × {part1Px} px ({(splitRatio * 100).toFixed(1)}%)
              </div>
            </div>
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 bg-[#E5C378]/10 pointer-events-none transition-colors"
            style={{ height: `${(1 - splitRatio) * 100}%` }}
          >
            <div className="absolute bottom-4 left-4 bg-[#0A0A0A]/90 backdrop-blur-md text-white border border-[#E5C378]/40 px-3 py-1.5 rounded-lg shadow-xl text-xs font-mono">
              <span className="text-[#E5C378] font-semibold">Part 2 (Bottom)</span>
              <div className="text-[#E0E0E0] text-[11px] mt-0.5">
                {imageWidth} × {part2Px} px ({((1 - splitRatio) * 100).toFixed(1)}%)
              </div>
            </div>
          </div>
        </>
      )}

      {/* Draggable Split Line with Glow and Handle */}
      {isVertical ? (
        <div
          id="split-draggable-line-vertical"
          className="absolute top-0 bottom-0 cursor-ew-resize group z-30"
          style={{ left: `${splitRatio * 100}%`, transform: 'translateX(-50%)', width: '32px' }}
          onPointerDown={handlePointerDown}
        >
          {/* Visual Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-[#E5C378] shadow-[0_0_15px_rgba(229,195,120,0.8)] group-hover:w-1 transition-all" />

          {/* Center Grab Knob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
            <div className="w-8 h-12 bg-[#0A0A0A] border-2 border-[#E5C378] text-[#E5C378] rounded-full shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform cursor-grab active:cursor-grabbing">
              <div className="flex gap-0.5">
                <div className="w-0.5 h-4 bg-[#E5C378] rounded" />
                <div className="w-0.5 h-4 bg-[#E5C378] rounded" />
              </div>
            </div>
            <div className="px-2 py-0.5 rounded bg-[#050505] text-[#E5C378] text-[11px] font-mono font-medium shadow-lg border border-white/10 whitespace-nowrap">
              {(splitRatio * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      ) : (
        <div
          id="split-draggable-line-horizontal"
          className="absolute left-0 right-0 cursor-ns-resize group z-30"
          style={{ top: `${splitRatio * 100}%`, transform: 'translateY(-50%)', height: '32px' }}
          onPointerDown={handlePointerDown}
        >
          {/* Visual Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-[#E5C378] shadow-[0_0_15px_rgba(229,195,120,0.8)] group-hover:h-1 transition-all" />

          {/* Center Grab Knob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
            <div className="w-12 h-8 bg-[#0A0A0A] border-2 border-[#E5C378] text-[#E5C378] rounded-full shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform cursor-grab active:cursor-grabbing">
              <div className="flex flex-col gap-0.5">
                <div className="w-4 h-0.5 bg-[#E5C378] rounded" />
                <div className="w-4 h-0.5 bg-[#E5C378] rounded" />
              </div>
            </div>
            <div className="px-2 py-0.5 rounded bg-[#050505] text-[#E5C378] text-[11px] font-mono font-medium shadow-lg border border-white/10 whitespace-nowrap">
              {(splitRatio * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Controls Overlay */}
      <div className="absolute bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0D0D0D]/95 backdrop-blur-md border border-white/15 rounded-2xl p-2 px-3 shadow-2xl flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#E0E0E0] max-w-[95vw] overflow-x-auto">
        {/* Direction Switcher */}
        <div className="flex items-center bg-[#050505] rounded-lg p-0.5 border border-white/10">
          <button
            id="split-direction-vertical-btn"
            type="button"
            onClick={() => onDirectionChange('vertical')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              isVertical
                ? 'bg-gradient-to-b from-[#E5C378] to-[#C9A050] text-[#0A0A0A] font-semibold shadow'
                : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Vertical</span>
          </button>
          <button
            id="split-direction-horizontal-btn"
            type="button"
            onClick={() => onDirectionChange('horizontal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              !isVertical
                ? 'bg-gradient-to-b from-[#E5C378] to-[#C9A050] text-[#0A0A0A] font-semibold shadow'
                : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
            }`}
          >
            <Rows2 className="w-3.5 h-3.5" />
            <span>Horizontal</span>
          </button>
        </div>

        {/* Snap to 50% (Exact Half) */}
        <button
          id="split-snap-half-btn"
          type="button"
          onClick={() => onRatioChange(0.5)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-white/10 hover:bg-white/5 transition-colors cursor-pointer ${
            Math.abs(splitRatio - 0.5) < 0.005 ? 'text-[#E5C378] border-[#E5C378]/40 bg-[#E5C378]/10' : 'text-[#E0E0E0]'
          }`}
          title="Reset split line exactly in half (50%)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Snap to 50%</span>
        </button>

        <div className="w-px h-5 bg-white/10" />

        {/* Cancel */}
        <button
          id="split-cancel-btn"
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
        >
          Cancel
        </button>

        {/* Main Action: SPLIT */}
        <button
          id="split-execute-btn"
          type="button"
          onClick={onPerformSplit}
          className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#E5C378] to-[#C9A050] hover:from-[#F0D597] hover:to-[#D8AF5F] text-[#0A0A0A] font-semibold text-xs shadow-lg shadow-[#E5C378]/20 active:scale-95 transition-all cursor-pointer"
        >
          <Scissors className="w-4 h-4" />
          <span>Split Image</span>
        </button>
      </div>
    </div>
  );
};
