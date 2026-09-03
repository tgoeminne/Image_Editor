import React from 'react';
import { SplitDirection } from '../../types';
import { Scissors, Columns2, Rows2, Info } from 'lucide-react';

interface SplitPanelProps {
  splitDirection: SplitDirection;
  splitRatio: number;
  onChangeSplitDirection: (direction: SplitDirection) => void;
  onChangeSplitRatio: (ratio: number) => void;
  onPerformSplit: () => void;
  imageDimensions: { width: number; height: number } | null;
}

export const SplitPanel: React.FC<SplitPanelProps> = ({
  splitDirection,
  splitRatio,
  onChangeSplitDirection,
  onChangeSplitRatio,
  onPerformSplit,
  imageDimensions,
}) => {
  const isVertical = splitDirection === 'vertical';

  // Calculate pixel cut point
  const totalDim = imageDimensions
    ? isVertical
      ? imageDimensions.width
      : imageDimensions.height
    : 1000;

  const part1Dim = Math.round(totalDim * splitRatio);
  const part2Dim = totalDim - part1Dim;

  return (
    <div className="space-y-6">
      {/* Help Banner */}
      <div className="p-3 bg-[#141414] border border-white/10 rounded-2xl flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#E5C378]/15 text-[#E5C378] flex items-center justify-center shrink-0 border border-[#E5C378]/30">
          <Scissors className="w-4 h-4" />
        </div>
        <div className="text-xs text-[#D4D4D8]">
          Cut your image into 2 clean pieces. Drag the gold divider bar on canvas or use the slider below.
        </div>
      </div>

      {/* Split Direction Options */}
      <div className="grid grid-cols-2 gap-2">
        <button
          id="split-vertical-btn"
          type="button"
          onClick={() => onChangeSplitDirection('vertical')}
          className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            isVertical
              ? 'bg-[#E5C378]/15 border-[#E5C378] text-[#E5C378] shadow-md shadow-[#E5C378]/10'
              : 'bg-[#0F0F0F] border-white/10 text-[#D4D4D8] hover:text-white hover:border-white/20'
          }`}
        >
          <Columns2 className="w-5 h-5" />
          <span className="text-xs font-semibold">Vertical Split</span>
          <span className="text-[10px] text-[#A1A1AA]">Left & Right Parts</span>
        </button>

        <button
          id="split-horizontal-btn"
          type="button"
          onClick={() => onChangeSplitDirection('horizontal')}
          className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            !isVertical
              ? 'bg-[#E5C378]/15 border-[#E5C378] text-[#E5C378] shadow-md shadow-[#E5C378]/10'
              : 'bg-[#0F0F0F] border-white/10 text-[#D4D4D8] hover:text-white hover:border-white/20'
          }`}
        >
          <Rows2 className="w-5 h-5" />
          <span className="text-xs font-semibold">Horizontal Split</span>
          <span className="text-[10px] text-[#A1A1AA]">Top & Bottom Parts</span>
        </button>
      </div>

      {/* Split Ratio Slider */}
      <div className="space-y-3 p-4 bg-[#141414] border border-white/10 rounded-2xl">
        <div className="flex items-center justify-between text-xs">
          <label className="text-[#D4D4D8] font-medium flex items-center gap-1.5">
            <span>Split Cut Point</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#E5C378] bg-[#0A0A0A] px-2 py-0.5 rounded border border-white/10">
              {(splitRatio * 100).toFixed(1)}%
            </span>
            <button
              type="button"
              onClick={() => onChangeSplitRatio(0.5)}
              className="text-[10px] text-[#A1A1AA] hover:text-white underline cursor-pointer"
            >
              Exact 50%
            </button>
          </div>
        </div>

        <input
          id="split-ratio-slider"
          type="range"
          min="5"
          max="95"
          step="0.5"
          value={splitRatio * 100}
          onChange={(e) => onChangeSplitRatio(Number(e.target.value) / 100)}
          className="w-full h-2 bg-[#1F1F1F] rounded-lg appearance-none cursor-pointer accent-[#E5C378] touch-none"
        />

        {/* Quick Snap Points */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => onChangeSplitRatio(0.333)}
            className="py-1 px-2 rounded-lg bg-[#0F0F0F] border border-white/5 text-[11px] text-[#A1A1AA] hover:text-white hover:border-white/20 text-center cursor-pointer"
          >
            1/3 (33.3%)
          </button>
          <button
            type="button"
            onClick={() => onChangeSplitRatio(0.5)}
            className={`py-1 px-2 rounded-lg border text-[11px] font-medium text-center cursor-pointer transition-colors ${
              Math.abs(splitRatio - 0.5) < 0.005
                ? 'bg-[#E5C378]/20 border-[#E5C378] text-[#E5C378]'
                : 'bg-[#0F0F0F] border-white/5 text-[#A1A1AA] hover:text-white'
            }`}
          >
            Exact 50/50 Half
          </button>
          <button
            type="button"
            onClick={() => onChangeSplitRatio(0.667)}
            className="py-1 px-2 rounded-lg bg-[#0F0F0F] border border-white/5 text-[11px] text-[#A1A1AA] hover:text-white hover:border-white/20 text-center cursor-pointer"
          >
            2/3 (66.7%)
          </button>
        </div>
      </div>

      {/* Resulting Dimensions Preview */}
      {imageDimensions && (
        <div className="p-3.5 bg-[#0A0A0A] border border-white/10 rounded-2xl space-y-2 text-xs font-mono">
          <div className="text-[10px] uppercase tracking-wider text-[#71717A] font-sans font-semibold">
            Output Dimensions
          </div>
          <div className="flex items-center justify-between text-[#D4D4D8]">
            <span>Part 1 ({isVertical ? 'Left' : 'Top'}):</span>
            <span className="text-[#E5C378]">
              {isVertical
                ? `${part1Dim} × ${imageDimensions.height} px`
                : `${imageDimensions.width} × ${part1Dim} px`}
            </span>
          </div>
          <div className="flex items-center justify-between text-[#D4D4D8]">
            <span>Part 2 ({isVertical ? 'Right' : 'Bottom'}):</span>
            <span className="text-[#E5C378]">
              {isVertical
                ? `${part2Dim} × ${imageDimensions.height} px`
                : `${imageDimensions.width} × ${part2Dim} px`}
            </span>
          </div>
        </div>
      )}

      {/* Perform Split Button */}
      <button
        id="perform-split-btn"
        type="button"
        onClick={onPerformSplit}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#E5C378] to-[#C9A050] text-[#0A0A0A] text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#E5C378]/20 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
      >
        <Scissors className="w-4 h-4" />
        <span>Generate & Download Slices</span>
      </button>
    </div>
  );
};
